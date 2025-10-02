import React, { useMemo, useState, useEffect } from "react";

/* -------------------- utils -------------------- */
function today() {
  return new Date().toISOString().slice(0, 10);
}

/* ------------------ constants ------------------ */
const MUSCLES = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
];
const EXERCISE_MAP = {
  Chest: ["Bench Press", "Incline DB Press", "Cable Fly"],
  Back: ["Deadlift", "Lat Pulldown", "Row"],
  Legs: ["Squat", "Leg Press", "Leg Curl", "Calf Raise"],
  Shoulders: ["Overhead Press", "Lateral Raise", "Rear Delt Fly"],
  Arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl"],
  Core: ["Hanging Leg Raise", "Plank", "Cable Crunch"],
  "Full Body": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
};

/* -------- attached dropdown (anchored) -------- */
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
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-2 min-w-[240px] rounded-xl border border-sky-900/60 bg-slate-950/95 p-3 shadow-[0_0_40px_rgba(0,160,255,.45)] z-50 custom-scrollbar`}
          onMouseLeave={close}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------- stepper (±2.5, editable) ------------- */
function Stepper({ value, setValue, step = 2.5, suffix = "" }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);

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
        aria-label="decrease"
      >
        −
      </button>

      <div className="flex items-center gap-2 rounded-xl border border-sky-700/60 bg-slate-900/70 px-3 py-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          className="w-24 bg-transparent text-center text-lg text-sky-100 focus:outline-none"
          inputMode="decimal"
        />
        {suffix ? <span className="text-sky-300/80">{suffix}</span> : null}
      </div>

      <button
        onClick={inc}
        className="h-10 w-10 rounded-xl border border-sky-800/60 bg-slate-900/70 text-xl text-sky-200 hover:bg-slate-900"
        aria-label="increase"
      >
        ＋
      </button>
    </div>
  );
}

/* -------------------- app -------------------- */
export default function FitnolsApp() {
  // selections
  const [muscle, setMuscle] = useState("Legs");
  const [exercise, setExercise] = useState(EXERCISE_MAP["Legs"][0]);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);

  // raise z-index of the card while its dropdown is open
  const [zLift, setZLift] = useState({});
  const setLift = (key) => (open) => setZLift((p) => ({ ...p, [key]: open }));

  // sample history
  const todayKey = useMemo(today, []);
  const [history] = useState(() => [
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
      {/* neon scrollbar for dropdowns */}
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

      <header className="text-center py-6">
        <h1 className="text-4xl font-extrabold text-sky-200 drop-shadow-[0_0_25px_rgba(0,140,255,.4)]">
          FITNOLS
        </h1>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 space-y-4">
        {/* row 1 */}
        <section className="grid gap-4 md:grid-cols-12">
          {/* Muscle */}
          <div
            className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.muscle ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Muscle Group</div>
            <AttachedDropdown
              buttonContent={<span>{muscle}</span>}
              onOpenChange={setLift("muscle")}
            >
              <div className="max-h-56 overflow-auto custom-scrollbar">
                {MUSCLES.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMuscle(m);
                      setExercise(EXERCISE_MAP[m][0]);
                    }}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-[15px] hover:bg-sky-500/10 ${
                      m === muscle ? "text-sky-100" : "text-sky-100/90"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </AttachedDropdown>
          </div>

          {/* Exercise */}
          <div
            className="md:col-span-8 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4"
            style={{ zIndex: zLift.exercise ? 1000 : 1 }}
          >
            <div className="mb-2 text-sm text-sky-300/90">Exercise</div>
            <AttachedDropdown
              buttonContent={<span className="truncate">{exercise}</span>}
              onOpenChange={setLift("exercise")}
            >
              <div className="max-h-56 overflow-auto custom-scrollbar">
                {(EXERCISE_MAP[muscle] || []).map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setExercise(ex)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-[15px] hover:bg-sky-500/10 ${
                      ex === exercise ? "text-sky-100" : "text-sky-100/90"
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </AttachedDropdown>
          </div>
        </section>

        {/* row 2 */}
        <section className="grid gap-4 md:grid-cols-12">
          {/* Sets */}
          <div className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4">
            <div className="mb-2 text-sm text-sky-300/90">Sets</div>
            <Stepper value={sets} setValue={setSets} step={2.5} />
          </div>

          {/* Reps */}
          <div className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4">
            <div className="mb-2 text-sm text-sky-300/90">Reps</div>
            <Stepper value={reps} setValue={setReps} step={2.5} />
          </div>

          {/* Weight */}
          <div className="md:col-span-4 relative overflow-visible rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4">
            <div className="mb-2 text-sm text-sky-300/90">Weight</div>
            <Stepper
              value={weight}
              setValue={setWeight}
              step={2.5}
              suffix="kg"
            />
          </div>
        </section>

        {/* log full width */}
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
