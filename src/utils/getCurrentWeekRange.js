const formatDate = (date) => {
  return `${date.getDate()} ${date.toLocaleString("default", { month: "long" })}`;
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6

  // Calculate Monday (start of the week)
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7)); // Adjust to Monday

  // Calculate Sunday (end of the week)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return `${formatDate(monday)} - ${formatDate(sunday)}`;
};

export default getCurrentWeekRange;
