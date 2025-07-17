import React from "react";
import DayColumn from "./DayColumn";
import { getDaysOfWeek, isToday } from "../utils/dateUtils";

const WeekView = ({
  events,
  addEvent,
  editEvent,
  updateEventStatus,
  removeEvent,
  sortEventsForDate,
  weekOffset,
}) => {
  const days = getDaysOfWeek(weekOffset);

  return (
    <div className="grid grid-cols-7 gap-4 p-4 w-[%99] h-[90vh]">
      {days.map((day) => {
        const y = day.date.getFullYear();
        const m = String(day.date.getMonth() + 1).padStart(2, "0");
        const d = String(day.date.getDate()).padStart(2, "0");
        const dateString = `${y}-${m}-${d}`;

        const eventsForDay = events.filter((e) => e.date === dateString);
        return (
          <DayColumn
            key={day.key}
            dateString={dateString}
            label={day.label}
            events={eventsForDay}
            addEvent={addEvent}
            editEvent={editEvent}
            updateEventStatus={updateEventStatus}
            removeEvent={removeEvent}
            sortEventsForDate={sortEventsForDate}
            isToday={isToday(day.date)}
          />
        );
      })}
    </div>
  );
};

export default WeekView;
