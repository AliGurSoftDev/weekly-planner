import React, { useState } from "react";

const EventBox = ({ event, onCancel, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const handleAction = (action) => {
    setIsVisible(false); // start fade-out

    setTimeout(() => {
      action(); // trigger cancel/complete in parent
    }, 500); // optional: run this after fade if desired

    setTimeout(() => {
      setShouldRender(false); // unmount after fade
    }, 500);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`relative shadow-md rounded-lg p-3 bg-amber-100 dark:bg-amber-200 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* X button */}
      <button
        className="absolute top-0 right-0 !bg-transparent !p-1
        text-red-800 hover:text-red-600 hover:!border-transparent transition-colors duration-200"
        onClick={() => handleAction(onCancel)}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18 17.94 6M18 18 6.06 6"
          />
        </svg>
      </button>

      {/* Content */}
      <p className="font-semibold text-gray-800">{event.title}</p>
      <p className="text-sm text-gray-700">{event.text}</p>
      <p className="text-xs text-gray-600">
        {event.startTime} - {event.endTime}
      </p>

      {/* Check button */}
      <button
        className="absolute bottom-0 right-0 !bg-transparent !p-1 text-green-800 hover:!text-green-600 hover:!border-transparent"
        onClick={() => handleAction(onComplete)}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 11.917L9.724 16.5 19 7.5" />
        </svg>
      </button>
    </div>
  );
};

export default EventBox;
