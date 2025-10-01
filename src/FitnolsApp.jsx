import React, { useEffect, useRef, useState } from "react";

// FITNOLS — Cyberpunk Workout Tracker (React, JS)
// Updates in this version:
// 1) Glowing + buttons beside each category label
// 2) Layout: Muscle row full-width horizontally, Exercise row beneath
// 3) Deletable chips via long-press (hold ~600ms to reveal delete dot)
// 4) Sections visually separated and reactive
// 5) Calendar with translucent blue fill for days with entries
// 6) Progression line (last 14 days streak overview)

// ---- Utilities ----
const gradientClass =
  "relative inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-semibold tracking-wide text-sky-100 " +
  "before:absolute before:inset-0 before:rounded-xl before:p-[1.5px] before:[background:linear-gradient(135deg,#06183A,rgba(0,148,255,.8),#06183A)] before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] before:content-[''] " +
  "bg-[radial-gradient(120%_120%_at_50%_-20%,#0b1222,#050b16)] hover:shadow-[0_0_20px_rgba(0,140,255,.35)]";

const chipBase =
  "relative rounded-xl border border-sky-800/60 bg-slate-900/60 px-3 py-1 text-[13px] text-sky-200/90 shadow-[inset_0_0_0_1px_rgba(6,24,58,.5)] hover:bg-slate-900/80 transition select-none";

const panelClass =
  "rounded-2xl border border-sky-900/50 bg-slate-950/40 p-4 backdrop-blur-sm";

function today() {
  return new Date().toISOString().slice(0, 10);
}
function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

// ---- Add (+) Button ----
function AddButton({ onClick, title = "Add" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/40 bg-white/5 backdrop-blur shadow-[0_0_12px_rgba(0,160,255,.35)] hover:shadow-[0_0_18px_rgba(0,160,255,.5)] transition"
      aria-label={title}
    >
      <span className="text-sky-300 text-lg leading-none">+</span>
    </button>
  );
}

// ---- LongPress Deletable Chip ----
function DeletableChip({ label, active = false, onClick, onDelete }) {
  const [showDel, setShowDel] = useState(false);
  const timerRef = useRef(null);

  function down() {
    timerRef.current = setTimeout(() => setShowDel(true), 600);
  }
  function up() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }
  return (
    <div className="relative">
      {showDel && (
        <button
          onClick={onDelete}
          className="absolute -left-2 -top-2 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border border-sky-600/60 bg-sky-900/80 text-sky-200 text-[11px] shadow-[0_0_10px_rgba(0,140,255,.35)]"
          aria-label={`Delete ${label}`}
          title="Delete"
        >
          ×
        </button>
      )}
      <button
        onMouseDown={down}
        onMouseUp={up}
        onMouseLeave={up}
        onTouchStart={down}
        onTouchEnd={up}
        onClick={onClick}
        className={`${chipBase} ${
          active ? "ring-1 ring-sky-400/60 bg-slate-950/60" : ""
        }`}
      >
        {label}
      </button>
    </div>
  );
}

// ---- Calendar (current month) ----
function MonthCalendar({ filledDates = new Set() }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-2xl border border-sky-900/50 bg-slate-950/30 p-4">
      <div className="mb-3 flex items-center justify-between text-sky-300/80 text-sm">
        <div>
          {now.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <div className="flex gap-2 text-[12px]">
          <span className="inline-block h-3 w-3 rounded-sm bg-sky-500/30" />{" "}
          <span>worked out</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[12px] text-sky-300/80 mb-2">
        {weekday.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="h-9" />;
          const k = dateKey(d);
          const filled = filledDates.has(k);
          return (
            <div
              key={i}
              className={`h-9 rounded-md border border-sky-900/50 flex items-center justify-center text-sm ${
                filled ? "bg-sky-500/20 text-sky-100" : "text-sky-300/80"
              }`}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Progression Line (last 14 days) ----
function ProgressLine({ filledDates = new Set(), days = 14 }) {
  const cells = [];
  const base = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const k = dateKey(d);
    cells.push({ k, filled: filledDates.has(k) });
  }
  return (
    <div className="rounded-2xl border border-sky-900/50 bg-slate-950/30 p-4">
      <div className="mb-2 text-sm text-sky-300/80">
        Progress (last {days} days)
      </div>
      <div className="flex gap-1">
        {cells.map(({ k, filled }) => (
          <div
            key={k}
            className={`h-3 w-5 rounded-sm border border-sky-900/60 ${
              filled ? "bg-sky-500/40" : "bg-slate-900/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Main App ----
export default function FitnolsApp() {
  // Editable libraries
  const [muscles, setMuscles] = useState([
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core",
    "Full Body",
  ]);
  const [exerciseMap, setExerciseMap] = useState({
    Chest: ["Bench Press", "Incline DB Press", "Cable Fly"],
    Back: ["Deadlift", "Lat Pulldown", "Row"],
    Legs: ["Squat", "Leg Press", "Leg Curl", "Calf Raise"],
    Shoulders: ["OHP", "Lateral Raise", "Rear Delt Fly"],
    Arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl"],
    Core: ["Hanging Leg Raise", "Plank", "Cable Crunch"],
    "Full Body": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
  });

  // Selection + inputs
  const [unit, setUnit] = useState("kg");
  const [muscle, setMuscle] = useState("Legs");
  const [exercise, setExercise] = useState(exerciseMap["Legs"][0]);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);
  const [notes, setNotes] = useState("");

  // History
  const [history, setHistory] = useState([
    {
      date: today(),
      muscle: "Legs",
      exercise: "Squat",
      sets: 3,
      reps: 8,
      weight: 140,
      unit: "kg",
      notes: "Strong",
    },
    {
      date: today(),
      muscle: "Back",
      exercise: "Lat Pulldown",
      sets: 4,
      reps: 12,
      weight: 60,
      unit: "kg",
      notes: "Slow negatives",
    },
  ]);

  // Filled dates set for calendar/progression
  const filledDates = new Set(history.map((h) => h.date));

  // Helpers for changing numeric values
  const addSet = (d) => setSets(Math.max(1, sets + d));
  const addReps = (d) => setReps(Math.max(1, reps + d));
  const addWeight = (d) => setWeight(Math.max(0, weight + d));

  function save() {
    setHistory([
      { date: today(), muscle, exercise, sets, reps, weight, unit, notes },
      ...history,
    ]);
    setSets(3);
    setReps(10);
    setWeight(60);
    setNotes("");
  }

  // Add via plus buttons (simple prompts for now)
  function addMuscle() {
    const name = prompt("New muscle group name?");
    if (!name) return;
    if (muscles.includes(name)) return alert("Already exists");
    setMuscles([...muscles, name]);
    setExerciseMap({ ...exerciseMap, [name]: ["New Exercise"] });
  }
  function addExercise() {
    const name = prompt(`New exercise for ${muscle}?`);
    if (!name) return;
    setExerciseMap({
      ...exerciseMap,
      [muscle]: [...exerciseMap[muscle], name],
    });
  }

  function deleteMuscle(name) {
    if (muscles.length <= 1) return;
    const newMuscles = muscles.filter((m) => m !== name);
    const { [name]: _, ...rest } = exerciseMap;
    setMuscles(newMuscles);
    setExerciseMap(rest);
    if (muscle === name) {
      const m0 = newMuscles[0];
      setMuscle(m0);
      setExercise(rest[m0][0]);
    }
  }
  function deleteExercise(name) {
    const list = exerciseMap[muscle].filter((e) => e !== name);
    if (list.length === 0) return; // keep at least one
    const map = { ...exerciseMap, [muscle]: list };
    setExerciseMap(map);
    if (exercise === name) setExercise(list[0]);
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(120%_120%_at_50%_-20%,#0b1222,#050b16)] text-slate-100 antialiased">
      <header className="mx-auto w-full max-w-4xl px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-300/70">
            Cyber • Fitness
          </div>
          <div className="text-xs text-sky-300/70">v0.2 preview</div>
        </div>
        <h1 className="mt-2 text-center text-3xl font-black tracking-wide text-sky-200 drop-shadow-[0_0_20px_rgba(0,140,255,.25)]">
          FITNOLS
        </h1>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-24 space-y-5">
        {/* Progress & Calendar */}
        <div className="grid gap-4 md:grid-cols-2">
          <ProgressLine filledDates={filledDates} days={14} />
          <MonthCalendar filledDates={filledDates} />
        </div>

        {/* MUSCLE */}
        <section className={panelClass}>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm text-sky-200/90">Muscle Group</label>
            <AddButton onClick={addMuscle} title="Add muscle" />
          </div>
          <div className="flex flex-wrap gap-2">
            {muscles.map((m) => (
              <DeletableChip
                key={m}
                label={m}
                active={m === muscle}
                onClick={() => {
                  setMuscle(m);
                  setExercise(exerciseMap[m][0]);
                }}
                onDelete={() => deleteMuscle(m)}
              />
            ))}
          </div>
        </section>

        {/* EXERCISE */}
        <section className={panelClass}>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm text-sky-200/90">Exercise</label>
            <AddButton onClick={addExercise} title="Add exercise" />
          </div>
          <div className="flex flex-wrap gap-2">
            {exerciseMap[muscle].map((ex) => (
              <DeletableChip
                key={ex}
                label={ex}
                active={ex === exercise}
                onClick={() => setExercise(ex)}
                onDelete={() => deleteExercise(ex)}
              />
            ))}
          </div>
        </section>

        {/* SETS & REPS & WEIGHT */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className={panelClass}>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-sky-200/90">Sets</label>
              <AddButton onClick={() => addSet(1)} title="Add 1 set" />
            </div>
            <NumberPicker
              label="Sets"
              value={sets}
              onDec={() => addSet(-1)}
              onInc={() => addSet(1)}
            />
          </div>

          <div className={panelClass}>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-sky-200/90">Reps</label>
              <AddButton onClick={() => addReps(1)} title="Add 1 rep" />
            </div>
            <NumberPicker
              label="Reps"
              value={reps}
              onDec={() => addReps(-1)}
              onInc={() => addReps(1)}
            />
          </div>

          <div className={panelClass}>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm text-sky-200/90">Weight</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUnit("kg")}
                  className={`${chipBase} ${
                    unit === "kg" ? "ring-1 ring-sky-400/60" : ""
                  }`}
                >
                  kg
                </button>
                <button
                  onClick={() => setUnit("lb")}
                  className={`${chipBase} ${
                    unit === "lb" ? "ring-1 ring-sky-400/60" : ""
                  }`}
                >
                  lb
                </button>
              </div>
            </div>
            <NumberPicker
              label={`Weight (${unit})`}
              value={weight}
              step={unit === "kg" ? 2.5 : 5}
              onDec={() => addWeight(-(unit === "kg" ? 2.5 : 5))}
              onInc={() => addWeight(unit === "kg" ? 2.5 : 5)}
            />
          </div>

          <div className={panelClass}>
            <label className="mb-2 block text-sm text-sky-200/90">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Felt strong today…"
              className="w-full rounded-2xl border border-sky-900/50 bg-slate-950/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            ></textarea>
          </div>
        </section>

        {/* Actions & Log */}
        <section className={panelClass}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide text-sky-200/90">
              Today\'s Log
            </h3>
            <button className={gradientClass} onClick={save}>
              SAVE SET
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-sky-900/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-sky-300/80">
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
                  .filter((h) => h.date === today())
                  .map((row, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2.5 text-sky-100/90">
                        {row.exercise}
                      </td>
                      <td className="px-4 py-2.5">{row.sets}</td>
                      <td className="px-4 py-2.5">{row.reps}</td>
                      <td className="px-4 py-2.5">
                        {row.weight} {row.unit}
                      </td>
                      <td
                        className="px-4 py-2.5 max-w-[220px] truncate"
                        title={row.notes}
                      >
                        {row.notes}
                      </td>
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

function NumberPicker({ label, value, onDec, onInc, step = 1 }) {
  return (
    <div>
      <div className="mb-2 text-xs text-sky-300/80">{label}</div>
      <div className="flex items-center gap-2">
        <button onClick={onDec} className={chipBase}>
          - {step}
        </button>
        <div className="min-w-[64px] rounded-xl border border-sky-900/50 bg-slate-950/50 px-3 py-2 text-center text-sky-100/90">
          {value}
        </div>
        <button onClick={onInc} className={chipBase}>
          + {step}
        </button>
      </div>
    </div>
  );
}
