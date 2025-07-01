import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import EventBox from "./EventBox";

const DayColumn = ({ date, label, events, addEvent, updateEventStatus }) => {
  const [form, setForm] = useState({
    title: "",
    text: "",
    startTime: "",
    endTime: "",
    status: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) {
      alert("Please enter a title for the event.");
      return;
    }

    addEvent({
      id: "event-" + Date.now(),
      title: form.title,
      text: form.text,
      date: date,
      startTime: form.startTime,
      endTime: form.endTime,
      status: "active",
    });

    setForm({ title: "", text: "", startTime: "", endTime: "" });
  };

  return (
    <div className="bg-neutral-50 dark:bg-slate-500/20 p-2 rounded-lg shadow flex flex-col">
      <h3 className="text-center font-semibold mb-4">{label}</h3>

      <Droppable droppableId={date}>
        {(provided) => (
          <div
            className="flex flex-col flex-1 min-h-[100px]"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    <EventBox
                      event={event}
                      onCancel={() => updateEventStatus(event.id, "cancelled")}
                      onComplete={() =>
                        updateEventStatus(event.id, "completed")
                      }
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form onSubmit={handleSubmit} className="mt-2 space-y-1">
        <input
          type="text"
          placeholder="Title"
          className="w-full text-sm p-1 rounded border"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Details"
          className="w-full text-sm p-1 rounded border"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
        />
        <div className="flex gap-1">
          <input
            type="time"
            className="flex-1 p-1 text-sm rounded border"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <input
            type="time"
            className="flex-1 p-1 text-sm rounded border"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-black rounded text-sm py-1 hover:bg-blue-600"
        >
          + Add Event
        </button>
      </form>
    </div>
  );
};

export default DayColumn;
