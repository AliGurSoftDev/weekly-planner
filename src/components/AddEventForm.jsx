import React, { useState, useRef, useEffect } from "react";

const AddEventForm = ({ date, onSave, onCancel, editingEvent }) => {
  const [title, setTitle] = useState(editingEvent ? editingEvent.title : "");
  const [text, setText] = useState(editingEvent ? editingEvent.text : "");
  const [startTime, setStartTime] = useState(editingEvent ? editingEvent.startTime : "");
  const [endTime, setEndTime] = useState(editingEvent ? editingEvent.endTime : "");
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    titleInputRef.current.className = "p-1 border rounded font-medium";
  }, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      titleInputRef.current.className =
        "p-1 border rounded font-medium !text-red-500";
      titleInputRef.current.focus();
      return;
    }

    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title,
      text,
      date,
      startTime,
      endTime,
      status: "active",
    };

    onSave(newEvent);
    // Reset fields
    setTitle("");
    setText("");
    setStartTime("");
    setEndTime("");
  };
  
  return (
    <div className="p-2 mt-2 rounded-lg border border-gray-300  light:bg-amber-50 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Event title"
          value={title}
          ref={titleInputRef}
          onChange={(e) => setTitle(e.target.value)}
          className="p-1 border rounded font-medium"
        />
        <textarea
          placeholder="Details"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-1 border rounded resize-none"
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-1 border rounded flex-1"
          step="900"
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-1 border rounded flex-1"
          step="900"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm px-2 py-1 rounded w-1/2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm px-2 py-1 rounded !bg-emerald-500 text-white hover:!bg-emerald-600  w-1/2"
          >
            {editingEvent ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;
