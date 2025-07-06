import React from "react";
import DayColumn from "./DayColumn";
import { getDaysOfWeek, isToday } from "../utils/dateUtils";

const WeekView = ({
  events,
  addEvent,
  updateEventStatus,
  removeEvent,
  sortEventsForDate,
  weekOffset
}) => {
  const days = getDaysOfWeek(weekOffset);

  return (
    <div className="grid grid-cols-7 gap-4 p-4 w-[%99] h-[90vh]">
      {days.map((day) => {
        const dateString = day.date.toISOString().slice(0, 10);
        const eventsForDay = events.filter((e) => e.date === dateString);
        return (
          <DayColumn
            key={day.key}
            dateString={dateString}
            label={day.label}
            events={eventsForDay}
            addEvent={addEvent}
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
