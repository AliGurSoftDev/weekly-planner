import React, { useState } from "react";

const AddEventForm = ({ date, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please fill in title.");
      return;
    }

    const newEvent = {
      id: Date.now().toString(), // temporary unique ID
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
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;
