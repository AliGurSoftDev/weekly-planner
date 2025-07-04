const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
};

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1); // simple offset

const mockEvents = [
  {
    id: "event-1",
    title: "Welcome to Weekly Planner",
    date: formatDate(today),
    text: "You can plan your week, complete and cancel events, remove them as well. You can filter your completed and cancelled events via toggle butons at right-top corner.",
    status: "active",
    startTime: "16:00",
    endTime: "21:00",
  },
  {
    id: "event-2",
    title: "Drag me!",
    date: formatDate(tomorrow),
    text: "You can easily drag and drop your events. You can navigate future and past with < and > buttons. And you can always use home button to return back to current week.",
    status: "active",
    startTime: "09:00",
    endTime: "12:00",
  },
];

export default mockEvents;