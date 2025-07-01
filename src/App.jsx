import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import WeekView from "./components/WeekView";
import mockEvents from "./data/MockEvents";
import { getCurrentWeekRange } from "./utils/dateUtils";

const App = () => {
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("events")) || mockEvents;
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("events");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed) && parsed.length > 0) {
        setEvents(parsed);
        console.log("Loaded from localStorage:", parsed);
      } else {
        setEvents(mockEvents);
        console.log("No events found — using mock data:", mockEvents);
      }
    } else {
      setEvents(mockEvents);
      console.log("No localStorage key — using mock data:", mockEvents);
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    console.log(
      "Saved to localStorage:",
      JSON.parse(localStorage.getItem("events"))
    );
  }, [events]);

  const updateEventStatus = (id, status) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // If dropped in the same column and position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setEvents((prevEvents) => {
      // Get all events for the source and destination columns
      const sourceDate = source.droppableId;
      const destDate = destination.droppableId;
      const eventsForSource = prevEvents.filter(
        (e) => e.date === sourceDate && e.status === "active"
      );
      const eventsForDest = prevEvents.filter(
        (e) => e.date === destDate && e.status === "active"
      );
      const otherEvents = prevEvents.filter(
        (e) =>
          e.status !== "active" ||
          (e.date !== sourceDate && e.date !== destDate)
      );

      // Find the event being moved
      const movingEvent = eventsForSource[source.index];
      if (!movingEvent) return prevEvents;

      // Remove from source
      let newSource = [...eventsForSource];
      newSource.splice(source.index, 1);

      // If moving within the same column
      if (sourceDate === destDate) {
        newSource.splice(destination.index, 0, movingEvent);
        // Rebuild the events array for this date
        const reordered = [
          ...otherEvents,
          ...newSource.map((e) => (e.id === movingEvent.id ? { ...e } : e)),
        ];
        // Keep the order for other columns
        return reordered;
      } else {
        // Moving to a different column
        let newDest = [...eventsForDest];
        // Update the date of the moving event
        const movedEvent = { ...movingEvent, date: destDate };
        newDest.splice(destination.index, 0, movedEvent);
        // Rebuild the events array for both columns
        const reordered = [...otherEvents, ...newSource, ...newDest];
        return reordered;
      }
    });
  };
  const currentWeekRange = getCurrentWeekRange();

  return (
    <div>
      <div className="">
        <p className="text-4xl font-bold text-center my-4">
          {currentWeekRange}
        </p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <WeekView
          events={events}
          addEvent={addEvent}
          updateEventStatus={updateEventStatus}
        />
      </DragDropContext>
    </div>
  );
};

export default App;
