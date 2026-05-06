import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import WeekView from "./components/WeekView";
import mockEvents from "./data/MockEvents";
import motivationalQuotes from "./data/MotivationalQuotes";
import { getWeekRange, getDaysOfWeek } from "./utils/dateUtils";
import {
  ActiveFormProvider,
  useActiveForm,
} from "./contexts/ActiveFormContext";
import RightIcon from "./assets/RightIcon";
import LeftIcon from "./assets/LeftIcon";
import CheckIcon from "./assets/CheckIcon";
import CancelIcon from "./assets/CancelIcon";
import HomeIcon from "./assets/HomeIcon";
import RefreshIcon from "./assets/RefreshIcon";

const App = () => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem("events")) || mockEvents;
  });
  const [weekOffset, setWeekOffset] = useState(() => {
    return parseInt(localStorage.getItem("weekOffset")) || 0;
  });
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [sortOrderByDate, setSortOrderByDate] = useState({});
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);
  const { setActiveFormDate } = useActiveForm();

  const weekDays = getDaysOfWeek(weekOffset);
  const weekDateStrings = weekDays.map((day) => {
    const y = day.date.getFullYear();
    const m = String(day.date.getMonth() + 1).padStart(2, "0");
    const d = String(day.date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const weekEvents = events.filter((event) =>
    weekDateStrings.includes(event.date),
  );
  const completedCount = weekEvents.filter(
    (event) => event.status === "completed",
  ).length;
  const cancelledCount = weekEvents.filter(
    (event) => event.status === "cancelled",
  ).length;
  const totalCount = weekEvents.length;
  const progressCount = completedCount;
  const completionPercentage =
    totalCount > 0 ? Math.round((progressCount / totalCount) * 100) : 0;
  const completedWidth = totalCount ? (completedCount / totalCount) * 100 : 0;
  const cancelledWidth = totalCount ? (cancelledCount / totalCount) * 100 : 0;

  const filterEvents = () => {
    return events.filter((event) => {
      if (showCompleted && event.status === "completed") return true;
      if (showCancelled && event.status === "cancelled") return true;
      return event.status !== "completed" && event.status !== "cancelled";
    });
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("weekOffset", weekOffset);
    setActiveFormDate(null);
  }, [weekOffset]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("events");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed) && parsed.length > 0) {
        setEvents(parsed);
      } else {
        setEvents(mockEvents);
      }
    } else {
      setEvents(mockEvents);
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const updateEventStatus = (id, status) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const addEvent = (event) => {
    setEvents((prev) => [...prev, event]);
  };

  const editEvent = (id, updatedEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
    );
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setEvents((prevEvents) => {
      const sourceDate = source.droppableId;
      const destDate = destination.droppableId;
      const eventsForSource = prevEvents.filter((e) => e.date === sourceDate);
      const eventsForDest = prevEvents.filter((e) => e.date === destDate);
      const otherEvents = prevEvents.filter(
        (e) => e.date !== sourceDate && e.date !== destDate,
      );

      const movingEvent = eventsForSource[source.index];
      if (!movingEvent) return prevEvents;

      let newSource = [...eventsForSource];
      newSource.splice(source.index, 1);

      if (sourceDate === destDate) {
        newSource.splice(destination.index, 0, movingEvent);
        const reordered = [
          ...otherEvents,
          ...newSource.map((e) => (e.id === movingEvent.id ? { ...e } : e)),
        ];
        return reordered;
      } else {
        let newDest = [...eventsForDest];
        const movedEvent = { ...movingEvent, date: destDate };
        newDest.splice(destination.index, 0, movedEvent);
        const reordered = [...otherEvents, ...newSource, ...newDest];
        return reordered;
      }
    });
  };

  const sortEventsForDate = (date) => {
    setEvents((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (a.date !== date || b.date !== date) return 0;

        if (!a.startTime && b.startTime) return 1;
        if (a.startTime && !b.startTime) return -1;
        if (!a.startTime && !b.startTime) return 0;

        const asc = sortOrderByDate[date] ?? true;
        return asc
          ? a.startTime.localeCompare(b.startTime)
          : b.startTime.localeCompare(a.startTime);
      });

      return sorted;
    });

    setSortOrderByDate((prev) => ({
      ...prev,
      [date]: !(prev[date] ?? true),
    }));
  };

  const removeEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const [quoteId, setQuoteId] = useState(() => {
    return parseInt(localStorage.getItem("quoteId")) || null;
  });

  useEffect(() => {
    if (quoteId !== null) {
      localStorage.setItem("quoteId", quoteId);
    } else {
      localStorage.removeItem("quoteId");
    }
  }, [quoteId]);

  const dailyMotivationalQuote = React.useMemo(() => {
    if (quoteId !== null) {
      const quote = motivationalQuotes.find((q) => q.id === quoteId);
      return quote || { quote: "", author: "" };
    }

    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const quoteIndex = daysSinceEpoch % motivationalQuotes.length;
    return motivationalQuotes[quoteIndex] || { quote: "", author: "" };
  }, [quoteId]);

  const handleRandomQuote = () => {
    const randomId = Math.floor(Math.random() * motivationalQuotes.length) + 1;
    setQuoteId(randomId);
  };

  const setDisplayedWeek = (offset) => {
    if (offset === 0) {
      if (weekOffset === 0) return;
      setWeekOffset(0);
    } else {
      setWeekOffset((prev) => prev + offset);
    }
    return;
  };

  return (
    <ActiveFormProvider>
      <div className="w-[99vw] min-w-6xl ml-2 h-[99vh]">
        {/* ── HEADER ── */}
        <div className="flex items-start mb-2 px-3 mt-2 gap-4">
          {/* LEFT 30%: Logo + Progress Bar */}
          <div className="basis-[30%] flex items-center gap-6 min-w-0">
            <div className="!rounded-xl !bg-[#3D9491] aspect-square p-2 flex-shrink-0 ml-2">
              <img
                src="./logo.png"
                alt="Weekly Planner"
                className="h-8 w-8"
                title="Bu proje hayatımın ışığına, Yağmur Kahramanlı'ya adanmıştır."
              />
            </div>
            <div className="flex-1 min-w-0 pt-4">
              <div className="relative h-9 rounded-md bg-slate-300/80 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-600"
                  style={{ width: `${completedWidth}%` }}
                />
                <div
                  className="absolute inset-y-0 bg-red-500 transition-all duration-600"
                  style={{
                    width: `${cancelledWidth}%`,
                    left: `${completedWidth}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white transition-all duration-600">
                  {completionPercentage}%
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">
                {completedCount}/{totalCount} completed
              </div>
            </div>
          </div>

          {/* CENTER 40%: Navigation */}
          <div className="basis-[40%] flex items-center mt-2 justify-center flex-shrink-0">
            <button
              className="!bg-transparent opacity-75 hover:opacity-100 focus:!outline-0 active:opacity-50"
              onClick={() => setDisplayedWeek(0)}
            >
              <HomeIcon size={8} />
            </button>
            <button
              className="px-3 py-1 mr-2 rounded !bg-transparent opacity-75 hover:opacity-100 focus:!outline-0"
              onClick={() => setDisplayedWeek(-1)}
            >
              <LeftIcon size={8} />
            </button>
            <p className="text-4xl font-bold text-center truncate w-lg">
              {getWeekRange(weekOffset)}
            </p>
            <button
              className="px-3 py-1 ml-2 rounded !bg-transparent opacity-75 hover:opacity-100 focus:!outline-0"
              onClick={() => setDisplayedWeek(1)}
            >
              <RightIcon size={8} />
            </button>
          </div>

          {/* RIGHT 30%: Quote + Theme Toggle */}
          <div className="basis-[30%] mt-1 flex items-start gap-4 min-w-0">
            {dailyMotivationalQuote.quote && (
              <div className="flex-1 min-w-[180px]">
                <div className="relative rounded-lg border border-slate-300/80 bg-slate-100/95 px-4 py-3 text-xs text-slate-800 shadow-sm shadow-slate-200/80 transition-all duration-300 dark:border-slate-600/80 dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-slate-200/20">
                  <p className="font-semibold leading-5">
                    {dailyMotivationalQuote.quote}
                  </p>
                  {dailyMotivationalQuote.author && (
                    <p className="mt-1 text-right text-[11px] text-slate-500 dark:text-slate-400">
                      — {dailyMotivationalQuote.author}
                    </p>
                  )}
                  <button
                    onClick={handleRandomQuote}
                    className="absolute -bottom-1 -left-2 bg-transparent! focus:!outline-0 p-1 rounded opacity-40 hover:opacity-60 transition-opacity duration-1000"
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>
            )}
            <div className="!rounded-full !border-2 dark:border-slate-400/80 border-sky-600/70 flex-shrink-0">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`relative w-16 h-8 !rounded-full transition-colors duration-300 focus:!outline-0 ${
                  theme === "dark" ? "!bg-sky-900" : "!bg-sky-300"
                }`}
              >
                <span
                  className={`absolute left-[1px] top-[1px] w-7 h-7 !rounded-full bg-neutral-100/40 shadow-md transform transition-transform duration-300 flex justify-center items-center text-center text-xl ${
                    theme === "dark" ? "translate-x-8" : ""
                  }`}
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                </span>
              </button>
            </div>
            {/* <div className=" !rounded-xl p-1 bg-teal-600/10 dark:bg-slate-500/20">
              <button
                className="!bg-transparent focus:!outline-0 mr-2 items-center"
                onClick={() => {
                  setShowCompleted(!showCompleted);
                }}
              >
                <CheckIcon size={6} />
                <div className="w-8 h-3 mt-1 rounded-full bg-gray-300 relative">
                  <div
                    className={`w-3 h-3 rounded-full bg-white shadow-md absolute top-0 transition-all duration-300 ${
                      showCompleted
                        ? "left-5 !bg-green-500"
                        : "left-0 !bg-red-500"
                    }`}
                  />
                </div>
              </button>
              <button
                className="!bg-transparent focus:!outline-0 items-center"
                onClick={() => {
                  setShowCancelled(!showCancelled);
                }}
              >
                <CancelIcon size={"w-6 h-6"} />
                <div className="w-8 h-3 mt-1 rounded-full bg-gray-300 relative">
                  <div
                    className={`w-3 h-3 rounded-full bg-white shadow-md absolute top-0 transition-all duration-300 ${
                      showCancelled
                        ? "left-5 !bg-green-500"
                        : "left-0 !bg-red-500"
                    }`}
                  />
                </div>
              </button>
            </div> */}
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <WeekView
            events={filterEvents()}
            addEvent={addEvent}
            editEvent={editEvent}
            updateEventStatus={updateEventStatus}
            removeEvent={removeEvent}
            sortEventsForDate={sortEventsForDate}
            weekOffset={weekOffset}
          />
        </DragDropContext>
      </div>
    </ActiveFormProvider>
  );
};

export default App;
