
//Returns the current week range in the format "1 January - 7 January"
export function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (date) =>
    `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`;

  return `${format(monday)} - ${format(sunday)}`;
}

//Returns an array of objects representing the days of the week starting from Monday as [DayName, Date.Day]
export function getDaysOfWeek() {
  const today = new Date();
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

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
