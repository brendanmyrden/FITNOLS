import React, { useMemo, useState, useEffect, useRef } from "react";

// --- Utilities ---
function today() {
  return new Date().toISOString().slice(0, 10);
}

// --- Constants ---
const MUSCLES = [
  "Face",
  "Neck",
  "Shoulders",

  "Arms",
  "Biceps",
  "Triceps",

  "Forearms",
  "Wrist",
  "Hands",

  "Chest",
  "Core",
  "Obliques",
  "Back",

  "Pelvis",
  "Legs",
  "Butt",

  "Ankles",

  "Full Body",
  "Full Body Lower",
  "Full Body Upper",
];
const EXERCISE_MAP = {
  Face: ["Smile", "Frown", "Squint", "Blink"],
  Neck: [
    "Neck Flexion",
    "Neck Extension",
    "Neck Lateral Flexion",
    "Neck Lateral Extension",
  ],
  Shoulders: ["Overhead Press", "Lateral Raise", "Rear Delt Fly"],

  Arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl"],
  Biceps: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl"],
  Triceps: ["Tricep Pushdown", "Tricep Extension", "Tricep Pushdown"],

  Forearms: ["Forearm Curl", "Forearm Extension", "Forearm Curl"],
  Wrist: [
    "Wrist Flexion",
    "Wrist Extension",
    "Wrist Lateral Flexion",
    "Wrist Lateral Extension",
  ],
  Hands: ["Hand Grip", "Hand Release", "Hand Squeeze", "Hand Open"],

  Chest: ["Bench Press", "Incline DB Press", "Cable Fly"],
  Core: ["Hanging Leg Raise", "Plank", "Cable Crunch"],
  Obliques: ["Oblique Twist", "Oblique Crunch", "Oblique Lateral Twist"],
  Back: ["Deadlift", "Lat Pulldown", "Row"],

  Pelvis: [
    "Hip Flexion",
    "Hip Extension",
    "Hip Lateral Flexion",
    "Hip Lateral Extension",
  ],
  Legs: ["Squat", "Leg Press", "Leg Curl", "Calf Raise"],
  Butt: ["Glute Bridge", "Hip Thrust", "Leg Raise"],

  Ankles: [
    "Ankle Flexion",
    "Ankle Extension",
    "Ankle Lateral Flexion",
    "Ankle Lateral Extension",
  ],
  "Full Body": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
  "Full Body Lower": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
  "Full Body Upper": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
};
const SETS_OPTIONS = Array.from({ length: 8 }, (_, i) => i + 1);
const REPS_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1);
const WEIGHT_OPTIONS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100,
];

// ---- Attached Dropdown (anchored to its card) ----
function AttachedDropdown({
  label,
  buttonContent,
  children,
  align = "left",
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  function toggle() {
    const next = !open;
    setOpen(next);
    onOpenChange && onOpenChange(next);
  }
  function close() {
    setOpen(false);
    onOpenChange && onOpenChange(false);
  }
  return (
    <div className="relative z-10">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-sky-700/70 bg-slate-900/70 px-4 py-2.5 text-[15px] text-sky-100 hover:bg-slate-900/80"
      >
        <span className="truncate">{buttonContent ?? label}</span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div
          className={`absolute left-0 top-full mt-3 w-[calc(100%)] max-h-[360px] overflow-auto rounded-2xl ring-1 ring-sky-800/60 bg-[rgba(6,12,24,0.96)] backdrop-blur-md p-2 shadow-[0_20px_80px_rgba(0,160,255,.25)] z-50 custom-scrollbar`}
          onMouseLeave={close}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ---- Number Stepper (± step, editable center) ----
function Stepper({ value, setValue, step = 2.5, suffix = "" }) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    setText(String(value));
  }, [value]);
  const commit = () => {
    const n = parseFloat(text);
    if (!Number.isNaN(n)) setValue(n);
    else setText(String(value));
  };
  const inc = () => setValue((v) => +((v ?? 0) + step).toFixed(2));
  const dec = () => setValue((v) => +((v ?? 0) - step).toFixed(2));
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={dec}
        className="h-10 w-10 rounded-xl border border-sky-800/60 bg-slate-900/70 text-xl text-sky-200 hover:bg-slate-900"
      >
        −
      </button>
      <div className="flex items-center gap-2 rounded-xl border border-sky-700/60 bg-slate-900/70 px-3 py-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="w-24 bg-transparent text-center text-lg text-sky-100 focus:outline-none"
          inputMode="decimal"
        />
        {suffix && <span className="text-sky-300/80">{suffix}</span>}
      </div>
      <button
        onClick={inc}
        className="h-10 w-10 rounded-xl border border-sky-800/60 bg-slate-900/70 text-xl text-sky-200 hover:bg-slate-900"
      >
        ＋
      </button>
    </div>
  );
}

// --- Main App ---
export default function FitnolsApp() {
  // Selections for the field cards
  const [muscle, setMuscle] = useState("Legs");
  const [exercise, setExercise] = useState(EXERCISE_MAP["Legs"]?.[0] ?? "");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);

  // Toolbar & Live logging state
  const [liveMode, setLiveMode] = useState(true);
  const [layoutMode, setLayoutMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileRef = useRef(null);
  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (f) setAvatarUrl(URL.createObjectURL(f));
  };

  // Live logging state
  const [liveReps, setLiveReps] = useState(10);
  const [liveLog, setLiveLog] = useState({}); // { [exerciseName]: number[] }
  const addLiveRep = () => {
    if (!exercise) return;
    setLiveLog((prev) => {
      const list = prev[exercise] ?? [];
      return { ...prev, [exercise]: [...list, Number(liveReps)] };
    });
  };
  const addToLog = () => {
    if (!exercise) return;
    const entry = {
      date: todayKey,
      muscle,
      exercise,
      sets: Math.max(1, Math.round(Number(sets) || 0)),
      reps: Number(liveReps) || 0,
      weight: Number(weight) || 0,
      unit: "kg",
      notes: "",
    };
    setHistory((prev) => [...prev, entry]);
  };

  // z-index lift when a dropdown is open so it overlays neighbors
  const [zLift, setZLift] = useState({}); // { cardKey: boolean }
  const setLift = (key) => (open) =>
    setZLift((prev) => ({ ...prev, [key]: open }));

  // History (sample)
  const todayKey = useMemo(today, []);
  const [history, setHistory] = useState(() => [
    {
      date: todayKey,
      muscle: "Legs",
      exercise: "Squat",
      sets: 3,
      reps: 8,
      weight: 140,
      unit: "kg",
      notes: "Strong",
    },
    {
      date: todayKey,
      muscle: "Back",
      exercise: "Lat Pulldown",
      sets: 4,
      reps: 12,
      weight: 60,
      unit: "kg",
      notes: "Slow negatives",
    },
  ]);

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(120%_120%_at_50%_-20%,#0b1222,#050b16)] text-slate-100 antialiased">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00aaff, #0066ff);
          border-radius: 9999px;
          box-shadow: 0 0 15px #00aaff;
          animation: pulseGlow 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #33bbff, #0099ff);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 8px #00aaff; }
          50% { box-shadow: 0 0 18px #00ccff; }
        }
      `}</style>

      <header className="py-6">
        <div className="relative mx-auto w-full max-w-6xl px-4">
          <h1 className="text-center text-4xl font-extrabold text-sky-200 drop-shadow-[0_0_25px_rgba(0,140,255,.4)]">
            FITNOLS
          </h1>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <button
              onClick={() => setLiveMode((v) => !v)}
              title={liveMode ? "Live logging: on" : "Live logging: off"}
              className={`h-11 w-11 rounded-2xl ${
                liveMode ? "bg-emerald-400" : "bg-slate-300"
              } text-slate-900 font-semibold shadow`}
            >
              ⏺
            </button>
            <button
              onClick={() => setLayoutMode((v) => !v)}
              title={layoutMode ? "Layout mode: on" : "Layout mode: off"}
              className={`h-11 w-11 rounded-2xl ${
                layoutMode ? "bg-sky-400" : "bg-slate-300"
              } text-slate-900 font-semibold shadow`}
            >
              ▦
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              title="Set profile picture"
              className="h-11 w-11 rounded-2xl bg-slate-300 overflow-hidden shadow"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : null}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPickAvatar}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 space-y-4">
        <section className="grid gap-4 md:grid-cols-12">
          {/* MUSCLE card */}
          <div
            className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.muscle ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Muscle Group</div>
            <AttachedDropdown
              buttonContent={<span>{muscle}</span>}
              onOpenChange={setLift("muscle")}
            >
              <div className="max-h-[320px] overflow-auto custom-scrollbar px-1">
                {MUSCLES.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMuscle(m);
                      setExercise(EXERCISE_MAP[m]?.[0] ?? "");
                    }}
                    className={`block w-full rounded-xl px-3.5 py-2.5 text-left text-[15px] transition hover:bg-sky-500/15 ${
                      m === muscle
                        ? "bg-sky-500/20 ring-1 ring-sky-500/30 text-sky-100"
                        : "text-sky-100/90"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </AttachedDropdown>
          </div>

          {/* EXERCISE card */}
          <div
            className="md:col-span-8 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.exercise ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Exercise</div>
            <AttachedDropdown
              buttonContent={<span className="truncate">{exercise}</span>}
              onOpenChange={setLift("exercise")}
            >
              <div className="max-h-[320px] overflow-auto custom-scrollbar px-1">
                {(EXERCISE_MAP[muscle] || []).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExercise(ex)}
                    className={`block w-full rounded-xl px-3.5 py-2.5 text-left text-[15px] transition hover:bg-sky-500/15 ${
                      ex === exercise
                        ? "bg-sky-500/20 ring-1 ring-sky-500/30 text-sky-100"
                        : "text-sky-100/90"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </AttachedDropdown>

            {/* Live Logging controls */}
            {liveMode && (
              <div className="mt-3 flex items-center gap-3">
                <div className="text-sm text-sky-300/90">Reps</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setLiveReps((v) => Math.max(0, Number(v) - 1))
                      }
                      className="h-9 w-9 rounded-xl border border-sky-800/60 bg-slate-900/70 text-lg text-sky-200"
                    >
                      −
                    </button>
                    <input
                      value={liveReps}
                      onChange={(e) =>
                        setLiveReps(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      onBlur={(e) => {
                        const n = parseFloat(e.target.value);
                        setLiveReps(Number.isNaN(n) ? 0 : n);
                      }}
                      className="w-20 bg-transparent text-center text-base text-sky-100 border border-sky-700/60 rounded-lg py-1"
                      inputMode="numeric"
                    />
                    <button
                      onClick={() => setLiveReps((v) => Number(v) + 1)}
                      className="h-9 w-9 rounded-xl border border-sky-800/60 bg-slate-900/70 text-lg text-sky-200"
                    >
                      ＋
                    </button>
                    <button
                      onClick={addLiveRep}
                      className="ml-2 rounded-xl border border-emerald-600/60 bg-emerald-700/30 px-3 py-2 text-sm text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,.35)] hover:bg-emerald-700/40"
                    >
                      ✓ Add Set
                    </button>
                    <button
                      onClick={addToLog}
                      className="ml-2 rounded-xl border border-sky-600/60 bg-sky-700/30 px-3 py-2 text-sm text-sky-100 shadow-[0_0_12px_rgba(59,130,246,.35)] hover:bg-sky-700/40"
                    >
                      ⇩ Add to Log
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Live progression line */}
            <div className="mt-2 text-sm text-sky-200/90">
              {exercise ? (
                <>
                  <span className="text-sky-300/80">{exercise}:</span>
                  <span className="ml-2 text-sky-100">
                    {(liveLog[exercise] ?? []).join(", ")}
                  </span>
                </>
              ) : (
                <span className="text-sky-400/70">
                  Select an exercise to start live logging.
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-12">
          {/* SETS */}
          <div
            className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.sets ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Sets</div>
            <Stepper value={sets} setValue={setSets} step={2.5} />
          </div>

          {/* REPS */}
          <div
            className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.reps ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Reps</div>
            <Stepper value={reps} setValue={setReps} step={2.5} />
          </div>

          {/* WEIGHT */}
          <div
            className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.weight ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Weight</div>
            <Stepper
              value={weight}
              setValue={setWeight}
              step={2.5}
              suffix="kg"
            />
          </div>
        </section>

        {/* LOG (full width) */}
        <section className="rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4">
          <h3 className="mb-3 text-base font-semibold tracking-wide text-sky-200/90">
            Today's Log
          </h3>
          <div className="overflow-hidden rounded-xl border border-sky-900/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-sky-300/80">
                <tr>
                  <th className="px-4 py-3">Exercise</th>
                  <th className="px-4 py-3">Sets</th>
                  <th className="px-4 py-3">Reps</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-900/40">
                {history
                  .filter((h) => h.date === todayKey)
                  .map((row) => (
                    <tr
                      key={`${row.date}-${row.exercise}-${row.sets}-${row.reps}-${row.weight}`}
                    >
                      <td className="px-4 py-2.5 text-sky-100/90">
                        {row.exercise}
                      </td>
                      <td className="px-4 py-2.5">{row.sets}</td>
                      <td className="px-4 py-2.5">{row.reps}</td>
                      <td className="px-4 py-2.5">
                        {row.weight} {row.unit}
                      </td>
                      <td className="px-4 py-2.5">{row.notes}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
