import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import EventBox from "./EventBox";
import AddEventForm from "./AddEventForm";
import AddIcon from "../assets/AddIcon";
import SortIcon from "../assets/SortIcon";

const DayColumn = ({ date, label, events, addEvent, removeEvent, updateEventStatus, sortEventsForDate }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="group relative bg-neutral-50 dark:bg-slate-500/20 p-2 rounded-lg shadow flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-center font-semibold">{label}</h3>
        <button
          onClick={() => sortEventsForDate(date)}
          className="absolute top-0 right-0 !bg-transparent !p-1 opacity-75 hover:opacity-100 active:opacity-50 focus:!outline-0"
        >
          <SortIcon/>
        </button>
      </div>

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
                      onComplete={() => updateEventStatus(event.id, "completed")}
                      onRemove={removeEvent}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {showForm ? (
              <AddEventForm
                date={date}
                onSave={(newEvent) => {
                  addEvent(newEvent);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full text-center py-1 rounded bg-green-100 hover:bg-green-200 mt-2 flex justify-center items-center"
              >
                <AddIcon />
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DayColumn;
