import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import EventBox from "./EventBox";
import AddEventForm from "./AddEventForm";
import AddIcon from "../assets/AddIcon";
import SortIcon from "../assets/SortIcon";
import { useActiveForm } from "../contexts/ActiveFormContext";

const DayColumn = ({
  dateString,
  label,
  events,
  addEvent,
  removeEvent,
  updateEventStatus,
  sortEventsForDate,
  isToday,
}) => {
  const {activeFormDate, setActiveFormDate} = useActiveForm();
  const isActive = activeFormDate === dateString;

  return (
    <div
      className={`group relative ${
        isToday && "border-2 border-teal-600/20 dark:border-slate-200/20"
      }  bg-neutral-50 dark:bg-slate-500/20 p-2 rounded-lg shadow flex flex-col`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-center font-semibold">{label}</h3>
        <button
          onClick={() => sortEventsForDate(dateString)}
          className="absolute top-0 right-0 !bg-transparent !p-1 opacity-75 hover:opacity-100 active:opacity-50 focus:!outline-0"
        >
          <SortIcon />
        </button>
      </div>

      <Droppable droppableId={dateString}>
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
                      onRemove={removeEvent}
                      onUndo={() => updateEventStatus(event.id, "active")}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {isActive ? (
              <AddEventForm
                date={dateString}
                onSave={(newEvent) => {
                  addEvent(newEvent);
                  setActiveFormDate(null);
                }}
                onCancel={() => setActiveFormDate(null)}
              />
            ) : (
              <button
                onClick={() => setActiveFormDate(dateString)}
                className="w-full text-center py-1 rounded mt-2 flex justify-center items-center
                opacity-20 group-hover:opacity-100 hover:opacity-100"
              >
                <AddIcon />
              </button>
            )}
          </div>
        )}
      </Droppable>
      {isToday && <p className="opacity-50 text-right text-sm font-sans">Today</p>}
    </div>
  );
};

export default DayColumn;
