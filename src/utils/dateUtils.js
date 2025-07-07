//Returns the current week range in the format "1 January - 7 January"
export function getWeekRange(offset = 0) {
  const shiftedDate = new Date();
  shiftedDate.setDate(shiftedDate.getDate() + offset * 7);
  const day = shiftedDate.getDay();
  const monday = new Date(shiftedDate);
  monday.setDate(shiftedDate.getDate() - ((day + 6) % 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (date) =>
    `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`;

  return `${format(monday)} - ${format(sunday)}`;
}

//Returns an array of objects representing the days of the week starting from Monday as [DayName, Date.Day]
export function getDaysOfWeek(offset = 0) {
  const shiftedDate = new Date();
  shiftedDate.setDate(new Date().getDate() + offset * 7);
  const mondayOffset = (shiftedDate.getDay() + 6) % 7;
  const monday = new Date(shiftedDate);
  monday.setDate(shiftedDate.getDate() - mondayOffset);

  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const dayName = date.toLocaleDateString("default", { weekday: "long" });
    days.push({
      key: dayName,
      label: `${dayName} ${date.getDate()}`,
      date: date,
    });
  }

  return days;
}

//Gets a date and returns true or false depending on wheter it's today or not.
export function isToday(date) {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
