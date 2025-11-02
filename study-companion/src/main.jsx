import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import {
  Calendar as CalendarIcon,
  Award,
  Target,
  TimerReset,
  CheckCircle2,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BadgeCheck,
  Goal,
  ListChecks,
  Gauge,
} from "lucide-react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


/**********************
FOLDER STRUCTURE (suggested)

study-companion/
├─ src/
│  ├─ App.jsx               <-- (This file)
│  ├─ main.jsx              <-- ReactDOM.createRoot(<App />)
│  ├─ index.css             <-- Tailwind base + custom CSS
│  └─ components/
│     ├─ Landing.jsx
│     ├─ Dashboard.jsx
│     ├─ Pomodoro.jsx
│     ├─ Calendar.jsx
│     ├─ ProgressBars.jsx
│     ├─ Badges.jsx
│     └─ BackToTop.jsx
├─ tailwind.config.js
├─ postcss.config.js
├─ package.json (deps: react, react-dom, framer-motion, lucide-react, react-confetti, tailwindcss)
└─ README.md

Notes:
- In this single-file preview, everything is combined inside App for simplicity.
- Colors used: background: black (#000), accent pink: #FF66B2, secondary blue: #66CCFF, cards/text: white.
**********************/

// Utility: clamp and percent
const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
const percent = (num, den) => (den === 0 ? 0 : Math.round((num / den) * 100));

// Default goal templates
const TEMPLATES = {
  DSA: {
    monthly: ["Finish Arrays & Strings", "Master Hashmaps", "20 Binary Search Qs"],
    weekly: [
      "Day 1: Arrays – learn",
      "Day 2: Arrays – practice",
      "Day 3: Strings – learn",
      "Day 4: Strings – practice",
      "Day 5: Review + Mock",
      "Day 6: Revision",
      "Day 7: Rest/Light notes",
    ],
  },
  Cybersecurity: {
    monthly: ["Set up SIEM", "Windows Logs 101", "Network Basics Lab"],
    weekly: [
      "Day 1: SIEM setup",
      "Day 2: Collect logs",
      "Day 3: Parse & search",
      "Day 4: Alert rules",
      "Day 5: Mock incident",
      "Day 6: Write report",
      "Day 7: Review",
    ],
  },
  Both: {
    monthly: [
      "Finish Arrays & Strings",
      "Set up SIEM",
      "10 String Qs + 1 Mock Incident",
    ],
    weekly: [
      "D1: DSA learn",
      "D2: DSA practice",
      "D3: Cyber – SIEM",
      "D4: Cyber – logs",
      "D5: Review + Mock",
      "D6: Revision",
      "D7: Rest/Notes",
    ],
  },
};

// Badge definitions
const BADGES = [
  { id: "arrays-master", label: "Arrays Master", condition: (state) => state.milestones.includes("Finish Arrays & Strings") },
  { id: "siem-explorer", label: "SIEM Explorer", condition: (state) => state.milestones.includes("Set up SIEM") },
  { id: "streak-5", label: "5-Day Streak", condition: (state) => state.streak >= 5 },
  { id: "week-complete", label: "Weekly Finisher", condition: (state) => state.weekDone },
];

// Glass card wrapper
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/10 ${className}`}
  >
    {children}
  </div>
);

// Progress bar
const Progress = ({ value = 0, color = "pink" }) => {
  const barColor = color === "blue" ? "bg-[#66CCFF]" : "bg-[#FF66B2]";
  return (
    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-3 ${barColor}`}
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
};

// Back to top button
const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-white/20 border border-white/20 backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Pomodoro Timer component
const Pomodoro = ({ palette }) => {
  const [mode, setMode] = useState("25-5");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const [work, brk] = mode === "25-5" ? [25, 5] : [50, 10];

  const resetForMode = () => {
    setIsBreak(false);
    setSecondsLeft(work * 60);
    setIsRunning(false);
  };

  useEffect(() => {
    resetForMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          // Switch session
          if (!isBreak) {
            setIsBreak(true);
            return brk * 60;
          } else {
            setIsBreak(false);
            return work * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak, brk, work]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Card className="p-4 w-full">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TimerReset className="w-5 h-5 text-white" />
          <h3 className="text-white text-lg font-semibold">Pomodoro</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("25-5")}
            className={`px-3 py-1 rounded-full border text-sm ${
              mode === "25-5"
                ? "bg-white/30 border-white/40 text-white"
                : "bg-transparent border-white/20 text-white/80"
            }`}
          >
            25–5
          </button>
          <button
            onClick={() => setMode("50-10")}
            className={`px-3 py-1 rounded-full border text-sm ${
              mode === "50-10"
                ? "bg-white/30 border-white/40 text-white"
                : "bg-transparent border-white/20 text-white/80"
            }`}
          >
            50–10
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div
          className="text-5xl font-bold"
          style={{ color: isBreak ? palette.blue : palette.pink }}
        >
          {mm}:{ss}
        </div>
        <div className="mt-1 text-white/80 text-sm">
          {isBreak ? "Break" : "Focus"}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setIsRunning(true)}
            className="px-3 py-2 rounded-xl bg-white/20 border border-white/20 hover:bg-white/30 transition flex items-center gap-2"
          >
            <Play className="w-4 h-4" /> Start
          </button>
          <button
            onClick={() => setIsRunning(false)}
            className="px-3 py-2 rounded-xl bg-white/20 border border-white/20 hover:bg-white/30 transition flex items-center gap-2"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
          <button
            onClick={resetForMode}
            className="px-3 py-2 rounded-xl bg-white/20 border border-white/20 hover:bg-white/30 transition flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>
    </Card>
  );
};

// Simple calendar for current month with task dots
const Calendar = ({ tasksByDate }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  const startDay = start.getDay(); // 0=Sun
  const daysInMonth = end.getDate();

  const weeks = [];
  let current = 1;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dayNum = w === 0 && d < startDay ? "" : current <= daysInMonth ? current : "";
      if (dayNum !== "") current++;
      week.push(dayNum);
    }
    weeks.push(week);
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarIcon className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">Calendar</h3>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-white/80 text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {weeks.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((day, j) => (
              <div
                key={`${i}-${j}`}
                className={`aspect-square rounded-xl border border-white/10 flex items-center justify-center relative ${
                  day === "" ? "bg-transparent" : "bg-white/5"
                }`}
              >
                {day !== "" && (
                  <>
                    <span className="text-white/90 text-sm">{day}</span>
                    {/* Dot if tasks exist */}
                    {tasksByDate[day] && tasksByDate[day].length > 0 && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#FF66B2]"></span>
                    )}
                  </>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

// Badge showcase
const Badges = ({ achieved }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 mb-3">
      <Award className="w-5 h-5 text-white" />
      <h3 className="text-white font-semibold">Badges</h3>
    </div>
    <div className="flex flex-wrap gap-2">
      {achieved.length === 0 && (
        <div className="text-white/70 text-sm">No badges yet. Keep going! ✨</div>
      )}
      {achieved.map((b) => (
        <div
          key={b}
          className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-sm flex items-center gap-1"
        >
          <BadgeCheck className="w-4 h-4" /> {b}
        </div>
      ))}
    </div>
  </Card>
);

// Landing overlay
const Landing = ({ open, onSubmit, palette }) => {
  const [hours, setHours] = useState(3);
  const [focus, setFocus] = useState("Both");

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: palette.pink }} />
            <h2 className="text-white text-xl font-semibold">Study Plan Setup</h2>
          </div>
          <label className="block text-white/90 text-sm mb-1">How many hours are you planning to study today?</label>
          <input
            type="number"
            min={1}
            max={16}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
          />
          <label className="block text-white/90 text-sm mt-4 mb-1">What’s your focus?</label>
          <div className="grid grid-cols-3 gap-2">
            {["DSA", "Cybersecurity", "Both"].map((f) => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                className={`p-3 rounded-xl border text-white ${
                  focus === f
                    ? "bg-white/30 border-white/40"
                    : "bg-white/10 border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => onSubmit({ hours, focus })}
            className="mt-5 w-full p-3 rounded-xl text-black font-semibold"
            style={{ background: palette.pink }}
          >
            Let’s Go
          </button>
        </Card>
      </motion.div>
    </div>
  );
};

export default function App() {
  const palette = {
    bg: "#000000",
    pink: "#FF66B2",
    blue: "#66CCFF",
    card: "#ffffff",
  };

  // Landing
  const [firstOpen, setFirstOpen] = useState(true);
  const [hoursPlanned, setHoursPlanned] = useState(0);
  const [focus, setFocus] = useState("Both");

  // Goals and progress
  const [monthlyGoals, setMonthlyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [dailyChecklist, setDailyChecklist] = useState([
    { id: "learn", label: "Learn", done: false },
    { id: "practice", label: "Practice", done: false },
    { id: "review", label: "Review", done: false },
    { id: "mock", label: "Mock", done: false },
    { id: "revision", label: "Revision", done: false },
  ]);

  const [milestones, setMilestones] = useState([]); // strings
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);

  // Calendar tasks demo: mark today with tasks
  const today = new Date();
  const tasksByDate = useMemo(() => ({ [today.getDate()]: ["Study"] }), [today]);

  // Initialize from landing
  const handleLandingSubmit = ({ hours, focus }) => {
    setHoursPlanned(hours);
    setFocus(focus);
    const template = TEMPLATES[focus];
    setMonthlyGoals(template.monthly.map((t) => ({ title: t, done: false })));
    setWeeklyGoals(template.weekly.map((t) => ({ title: t, done: false })));
    setFirstOpen(false);
  };

  // Weekly progress and completion
  const weekDone = weeklyGoals.length > 0 && weeklyGoals.every((g) => g.done);

  // Calculate progress values
  const progressDSA = percent(
    monthlyGoals.filter((g) => g.title.toLowerCase().includes("arrays") && g.done).length,
    monthlyGoals.filter((g) => g.title.toLowerCase().includes("arrays")).length || 1
  );
  const progressCyber = percent(
    monthlyGoals.filter((g) => g.title.toLowerCase().includes("siem") && g.done).length,
    monthlyGoals.filter((g) => g.title.toLowerCase().includes("siem")).length || 1
  );
  const progressDaily = percent(dailyChecklist.filter((c) => c.done).length, dailyChecklist.length);

  // Badge evaluation
  const achievedBadges = useMemo(() => {
    const state = { milestones, streak, weekDone };
    return BADGES.filter((b) => b.condition(state)).map((b) => b.label);
  }, [milestones, streak, weekDone]);

  // Confetti trigger on new badge or milestone completion
  useEffect(() => {
    if (achievedBadges.length > 0) {
      setConfetti(true);
      const t = setTimeout(() => setConfetti(false), 2500);
      return () => clearTimeout(t);
    }
  }, [achievedBadges.join(",")]);

  // Handlers
  const toggleDaily = (id) => {
    setDailyChecklist((list) =>
      list.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const toggleWeekly = (idx) => {
    setWeeklyGoals((list) => list.map((g, i) => (i === idx ? { ...g, done: !g.done } : g)));
  };

  const toggleMonthly = (idx) => {
    setMonthlyGoals((list) => list.map((g, i) => (i === idx ? { ...g, done: !g.done } : g)));
  };

  const completeMilestone = (title) => {
    if (!milestones.includes(title)) {
      setMilestones((m) => [...m, title]);
    }
  };

  // Simple streak demo: if dailyChecklist all done -> increment
  useEffect(() => {
    if (dailyChecklist.every((c) => c.done)) {
      setStreak((s) => s + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressDaily === 100]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: palette.bg }}
    >
      {/* Confetti */}
      <AnimatePresence>
        {confetti && (
          <Confetti numberOfPieces={220} recycle={false} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full" style={{ background: palette.pink }} />
            <h1 className="text-white font-semibold tracking-wide">Study Companion</h1>
          </div>
          <div className="flex items-center gap-3 text-white/80 text-sm">
            <div className="hidden sm:flex items-center gap-1"><Target className="w-4 h-4" /><span>{hoursPlanned || 0}h planned</span></div>
            <div className="hidden sm:flex items-center gap-1"><Gauge className="w-4 h-4" /><span>{focus}</span></div>
            <button
              onClick={() => setFirstOpen(true)}
              className="px-3 py-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition"
            >
              Edit Plan
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Landing CTA */}
      <section className="max-w-6xl mx-auto px-4 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card className="p-6 md:col-span-2">
            <div className="flex items-center gap-2">
              <Goal className="w-5 h-5 text-white" />
              <h2 className="text-white text-lg font-semibold">Goals & Progress</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-5">
              <div>
                <div className="text-white/80 text-sm mb-2">Daily Checklist</div>
                <Card className="p-3">
                  <ul className="space-y-2">
                    {dailyChecklist.map((c) => (
                      <li key={c.id} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleDaily(c.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            c.done ? "bg-white/80 border-white/80" : "bg-transparent border-white/40"
                          }`}
                        >
                          {c.done && <CheckCircle2 className="w-4 h-4 text-black" />}
                        </button>
                        <span className={`text-white ${c.done ? "line-through opacity-70" : ""}`}>{c.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <Progress value={progressDaily} color="pink" />
                    <div className="text-right text-white/70 text-xs mt-1">{progressDaily}%</div>
                  </div>
                </Card>
              </div>
              <div>
                <div className="text-white/80 text-sm mb-2">DSA Progress</div>
                <Card className="p-3">
                  <Progress value={progressDSA} color="pink" />
                  <div className="text-right text-white/70 text-xs mt-1">{progressDSA}%</div>
                  <button
                    onClick={() => completeMilestone("Finish Arrays & Strings")}
                    className="mt-3 w-full p-2 rounded-xl text-black font-semibold"
                    style={{ background: palette.pink }}
                  >
                    Mark “Arrays & Strings” Done
                  </button>
                </Card>
              </div>
              <div>
                <div className="text-white/80 text-sm mb-2">Cyber Progress</div>
                <Card className="p-3">
                  <Progress value={progressCyber} color="blue" />
                  <div className="text-right text-white/70 text-xs mt-1">{progressCyber}%</div>
                  <button
                    onClick={() => completeMilestone("Set up SIEM")}
                    className="mt-3 w-full p-2 rounded-xl text-black font-semibold"
                    style={{ background: palette.blue }}
                  >
                    Mark “Set up SIEM” Done
                  </button>
                </Card>
              </div>
            </div>
          </Card>
          <div className="flex flex-col gap-4">
            <Pomodoro palette={palette} />
            <Badges achieved={achievedBadges} />
          </div>
        </motion.div>
      </section>

      {/* Lists: Monthly / Weekly */}
      <section className="max-w-6xl mx-auto px-4 mt-6 grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">Monthly Goals</h3>
          </div>
          {monthlyGoals.length === 0 ? (
            <div className="text-white/70 text-sm">No goals yet. Click “Edit Plan”.</div>
          ) : (
            <ul className="space-y-2">
              {monthlyGoals.map((g, i) => (
                <li key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleMonthly(i)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      g.done ? "bg-white/80 border-white/80" : "bg-transparent border-white/40"
                    }`}
                  >
                    {g.done && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </button>
                  <span className={`text-white ${g.done ? "line-through opacity-70" : ""}`}>{g.title}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-white" />
            <h3 className="text-white font-semibold">Weekly Goals (auto-generated)</h3>
          </div>
          {weeklyGoals.length === 0 ? (
            <div className="text-white/70 text-sm">No weekly goals yet. Click “Edit Plan”.</div>
          ) : (
            <ul className="space-y-2">
              {weeklyGoals.map((g, i) => (
                <li key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWeekly(i)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      g.done ? "bg-white/80 border-white/80" : "bg-transparent border-white/40"
                    }`}
                  >
                    {g.done && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </button>
                  <span className={`text-white ${g.done ? "line-through opacity-70" : ""}`}>{g.title}</span>
                </li>
              ))}
            </ul>
          )}
          {weekDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-sm"
            >
              <Award className="w-4 h-4" /> Week complete! Badge unlocked.
            </motion.div>
          )}
        </Card>
      </section>

      {/* Calendar */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Calendar tasksByDate={tasksByDate} />
          <Card className="p-4 md:col-span-2">
            <h3 className="text-white font-semibold mb-2">Notes</h3>
            <textarea
              placeholder="Write quick notes here…"
              className="w-full h-40 p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-white/60">
        Built with ❤ for Nazreen — stay consistent and you’ll fly! 🚀
      </footer>

      <Landing open={firstOpen} onSubmit={handleLandingSubmit} palette={palette} />
      <BackToTop />

      {/* Global styles for fonts and nice glow accents */}
      <style>{`
        :root { --pink: ${palette.pink}; --blue: ${palette.blue}; }
        * { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
        .glow-pink { box-shadow: 0 0 30px 0 ${palette.pink}33; }
        .glow-blue { box-shadow: 0 0 30px 0 ${palette.blue}33; }
      `}</style>
    </div>
  );
}
