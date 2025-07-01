import React from "react";
import DayColumn from "./DayColumn";
import { getDaysOfWeek } from "../utils/dateUtils";

const WeekView = ({ events, addEvent, updateEventStatus }) => {
  const days = getDaysOfWeek();

  return (
    <div className="grid grid-cols-7 gap-4 p-4 h-screen">
      {days.map((day) => {
        const dateString = day.date.toISOString().slice(0, 10);
        const eventsForDay = events.filter((e) => e.date === dateString && e.status === "active");
        return (
          <DayColumn
            key={day.key}
            date={dateString}
            label={day.label}
            events={eventsForDay}
            addEvent={addEvent}
            updateEventStatus={updateEventStatus}
          />
        );
      })}
    </div>
  );
};

export default WeekView;
