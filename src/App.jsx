import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import WeekView from "./components/WeekView";
import mockEvents from "./data/MockEvents";
import { getWeekRange } from "./utils/dateUtils";
import {
  ActiveFormProvider,
  useActiveForm,
} from "./contexts/ActiveFormContext";
import RightIcon from "./assets/RightIcon";
import LeftIcon from "./assets/LeftIcon";
import CheckIcon from "./assets/CheckIcon";
import CancelIcon from "./assets/CancelIcon";
import HomeIcon from "./assets/HomeIcon";

const App = () => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("events")) || mockEvents;
  });
  const [weekOffset, setWeekOffset] = useState(() => {
    return parseInt(localStorage.getItem("weekOffset")) || 0;
  });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [sortOrderByDate, setSortOrderByDate] = useState({});
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);
  const { setActiveFormDate } = useActiveForm();

  const filterEvents = () => {
    return events.filter((event) => {
      if (showCompleted && event.status === "completed") return true;
      if (showCancelled && event.status === "cancelled") return true;
      return event.status !== "completed" && event.status !== "cancelled";
    });
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("weekOffset", weekOffset);
    setActiveFormDate(null);
  }, [weekOffset]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("events");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed) && parsed.length > 0) {
        setEvents(parsed);
      } else {
        setEvents(mockEvents);
      }
    } else {
      setEvents(mockEvents);
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const updateEventStatus = (id, status) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const editEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e))
    );
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
      const eventsForSource = prevEvents.filter((e) => e.date === sourceDate);
      const eventsForDest = prevEvents.filter((e) => e.date === destDate);
      const otherEvents = prevEvents.filter(
        (e) => e.date !== sourceDate && e.date !== destDate
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

  const sortEventsForDate = (date) => {
    setEvents((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (a.date !== date || b.date !== date) return 0; // Only sort this day

        if (!a.startTime && b.startTime) return 1;
        if (a.startTime && !b.startTime) return -1;
        if (!a.startTime && !b.startTime) return 0;

        const asc = sortOrderByDate[date] ?? true;
        return asc
          ? a.startTime.localeCompare(b.startTime)
          : b.startTime.localeCompare(a.startTime);
      });

      return sorted;
    });

    // Toggle sort direction for next time
    setSortOrderByDate((prev) => ({
      ...prev,
      [date]: !(prev[date] ?? true),
    }));
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const setDisplayedWeek = (offset) => {
    if (offset === 0) {
      if (weekOffset === 0) return;
      setWeekOffset(0);
    } else {
      setWeekOffset((prev) => prev + offset);
    }
    return;
  };

  return (
    <ActiveFormProvider>
      <div className="w-[99vw] min-w-6xl h-[98vh]">
        <div className=" relative flex justify-center items-center mb-4 mt-4">
          <div className="absolute left-4 top-0 !rounded-xl !bg-[#3D9491] aspect-square p-2">
            <img
              src="./logo.png"
              alt="Weekly Planner"
              className="h-8 w-8"
              title="Bu proje hayatımın ışığına, Yağmur Kahramanlı'ya adanmıştır."
            />
          </div>

          <button
            className="!bg-transparent opacity-75 hover:opacity-100 focus:!outline-0 active:opacity-50"
            onClick={() => {
              setDisplayedWeek(0);
            }}
          >
            <HomeIcon size={8} />
          </button>
          <button
            className="px-3 py-1 mr-2 rounded !bg-transparent opacity-75 hover:opacity-100 focus:!outline-0"
            onClick={() => setDisplayedWeek(-1)}
          >
            <LeftIcon size={8} />
          </button>
          <p className="text-4xl font-bold w-lg text-center">
            {getWeekRange(weekOffset)}
          </p>
          <button
            className="px-3 py-1 ml-2 rounded !bg-transparent opacity-75 hover:opacity-100 focus:!outline-0"
            onClick={() => setDisplayedWeek(1)}
          >
            <RightIcon size={8} />
          </button>
          <div className="absolute top-0 right-4 grid grid-cols-2 justify-items-end items-center gap-4">
            <div className="!rounded-full !border-4 dark:border-slate-400/80 border-sky-600/70 ">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`relative w-16 h-8 !rounded-full transition-colors duration-300 focus:!outline-0 ${
                  theme === "dark" ? "!bg-sky-900" : "!bg-sky-300"
                }`}
              >
                <span
                  className={`absolute left-[1px] top-[1px] w-7 h-7 !rounded-full bg-neutral-100/40 shadow-md transform transition-transform duration-300
                   flex justify-center items-center text-center text-xl ${
                     theme === "dark" ? "translate-x-8" : ""
                   }`}
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                </span>
              </button>
            </div>
            <div className=" !rounded-xl p-1 bg-teal-600/10 dark:bg-slate-500/20">
              <button
                className="!bg-transparent focus:!outline-0 mr-2 items-center"
                onClick={() => {
                  setShowCompleted(!showCompleted);
                }}
              >
                <CheckIcon size={6} />
                <div className="w-8 h-3 mt-1 rounded-full bg-gray-300 relative">
                  <div
                    className={`w-3 h-3 rounded-full bg-white shadow-md absolute top-0 transition-all duration-300 ${
                      showCompleted
                        ? "left-5 !bg-green-500"
                        : "left-0 !bg-red-500"
                    }`}
                  />
                </div>
              </button>
              <button
                className="!bg-transparent focus:!outline-0 items-center"
                onClick={() => {
                  setShowCancelled(!showCancelled);
                }}
              >
                <CancelIcon size={"w-6 h-6"} />
                <div className="w-8 h-3 mt-1 rounded-full bg-gray-300 relative">
                  <div
                    className={`w-3 h-3 rounded-full bg-white shadow-md absolute top-0 transition-all duration-300 ${
                      showCancelled
                        ? "left-5 !bg-green-500"
                        : "left-0 !bg-red-500"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <WeekView
            events={filterEvents()}
            addEvent={addEvent}
            editEvent={editEvent}
            updateEventStatus={updateEventStatus}
            removeEvent={removeEvent}
            sortEventsForDate={sortEventsForDate}
            weekOffset={weekOffset}
          />
        </DragDropContext>
      </div>
    </ActiveFormProvider>
  );
};

export default App;
