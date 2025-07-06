import React, { useState } from "react";
import CheckIcon from "../assets/CheckIcon";
import CancelIcon from "../assets/CancelIcon";
import TrashIcon from "../assets/TrashIcon";
import UndoIcon from "../assets/UndoIcon";

const EventBox = ({ event, onCancel, onComplete, onRemove, onUndo }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleAction = (action) => {
    setIsVisible(false); // start fade-out

    setTimeout(() => {
      action(); // trigger cancel/complete in parent
    }, 300); // optional: run this after fade if desired

    setTimeout(() => {
      setShouldRender(false); // unmount after fade
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`relative shadow-md rounded-lg p-3
         bg-amber-100 dark:bg-gray-600
         ${event.status === "completed" && "!bg-green-500/20"}
         ${event.status === "cancelled" && "!bg-red-500/20"}
         transition-opacity transition-color duration-500 ${
           isVisible ? "opacity-100" : "opacity-0"
         }`}
    >
      {/* Content */}
      <p className="font-semibold text-gray-800 dark:text-stone-100">
        {event.title} {event.status === "completed" && "(Completed)"}
        {event.status === "cancelled" && "(Cancelled)"}
      </p>
      <p className="text-sm text-gray-700 dark:text-stone-200">{event.text}</p>
      <p className="text-xs text-gray-600 dark:text-stone-300">
        {event.startTime} - {event.endTime}
      </p>

      {event.status === "active" ? (
        <>
          <button
            className="absolute top-0 right-0 !bg-transparent !p-1
        text-red-600 hover:!text-red-400 hover:!border-transparent"
            onClick={onCancel}
          >
            <CancelIcon />
          </button>

          <button
            className="absolute bottom-0 right-0 !bg-transparent !p-1 
        text-green-600 hover:!text-green-400 hover:!border-transparent"
            onClick={onComplete}
          >
            <CheckIcon />
          </button>
        </>
      ) : (
        <div className="absolute bottom-0 right-0">
          <button className="!bg-transparent !p-1 hover:!text-gray-600 hover:!border-transparent"
          onClick={onUndo}>
            <UndoIcon />
          </button>
          <button
            className=" !bg-transparent !p-1 hover:!text-gray-600 hover:!border-transparent"
            onClick={() => handleAction(() => onRemove(event.id))}
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventBox;
