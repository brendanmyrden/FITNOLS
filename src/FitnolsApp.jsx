import { useState } from "react";

// Fixed FITNOLS React preview with bug corrections

const MUSCLES = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Full Body",
];
const EXERCISES = {
  Chest: ["Bench Press", "Incline DB Press", "Cable Fly"],
  Back: ["Deadlift", "Lat Pulldown", "Row"],
  Legs: ["Squat", "Leg Press", "Leg Curl", "Calf Raise"],
  Shoulders: ["OHP", "Lateral Raise", "Rear Delt Fly"],
  Arms: ["Barbell Curl", "Tricep Pushdown", "Hammer Curl"],
  Core: ["Hanging Leg Raise", "Plank", "Cable Crunch"],
  "Full Body": ["Clean & Press", "Farmer Carry", "Kettlebell Swing"],
};

const gradientClass =
  "relative inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-semibold tracking-wide text-sky-100 " +
  "before:absolute before:inset-0 before:rounded-xl before:p-[1.5px] before:[background:linear-gradient(135deg,#06183A,rgba(0,148,255,.8),#06183A)] before:[mask:linear-gradient(#000,#000)_content-box,linear-gradient(#000,#000)] before:[mask-composite:exclude] before:content-[''] " +
  "bg-[radial-gradient(120%_120%_at_50%_-20%,#0b1222,#050b16)] hover:shadow-[0_0_20px_rgba(0,140,255,.35)]";

const chipClass =
  "rounded-xl border border-sky-800/60 bg-slate-900/60 px-3 py-1 text-[13px] text-sky-200/90 shadow-[inset_0_0_0_1px_rgba(6,24,58,.5)] hover:bg-slate-900/80 transition";

export default function FitnolsApp() {
  const [unit, setUnit] = useState("kg");
  const [muscle, setMuscle] = useState("Legs");
  const [exercise, setExercise] = useState(EXERCISES["Legs"][0]);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(60);
  const [notes, setNotes] = useState("");
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

  function addSet(delta) {
    setSets(Math.max(1, sets + delta));
  }
  function addReps(delta) {
    setReps(Math.max(1, reps + delta));
  }
  function addWeight(delta) {
    setWeight(Math.max(0, weight + delta));
  }
  function resetForm() {
    setSets(3);
    setReps(10);
    setWeight(60);
    setNotes("");
  }

  function save() {
    setHistory([
      { date: today(), muscle, exercise, sets, reps, weight, unit, notes },
      ...history,
    ]);
    resetForm();
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(120%_120%_at_50%_-20%,#0b1222,#050b16)] text-slate-100 antialiased">
      <header className="mx-auto w-full max-w-3xl px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.35em] text-sky-300/70">
            Cyber • Fitness
          </div>
          <div className="text-xs text-sky-300/70">v0.1 preview</div>
        </div>
        <h1 className="mt-2 text-center text-3xl font-black tracking-wide text-sky-200 drop-shadow-[0_0_20px_rgba(0,140,255,.25)]">
          FITNOLS
        </h1>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-20">
        <div className="relative rounded-3xl p-[1.5px] [background:linear-gradient(135deg,#06183A,rgba(0,148,255,.8),#06183A)] shadow-[0_0_40px_rgba(0,140,255,.25)]">
          <div className="rounded-3xl bg-[linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.0)),radial-gradient(120%_120%_at_50%_-30%,#0e172a,#050b16)] p-5 md:p-7">
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-sky-200/90">
                  Muscle Group
                </label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLES.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMuscle(m);
                        setExercise(EXERCISES[m][0]);
                      }}
                      className={`${chipClass} ${
                        m === muscle
                          ? "ring-1 ring-sky-400/60 bg-slate-950/60"
                          : ""
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-sky-200/90">
                  Exercise
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXERCISES[muscle].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setExercise(ex)}
                      className={`${chipClass} ${
                        ex === exercise
                          ? "ring-1 ring-sky-400/60 bg-slate-950/60"
                          : ""
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <NumberPicker
                label="Sets"
                value={sets}
                onDec={() => addSet(-1)}
                onInc={() => addSet(1)}
              />
              <NumberPicker
                label="Reps"
                value={reps}
                onDec={() => addReps(-1)}
                onInc={() => addReps(1)}
              />

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <NumberPicker
                  label={`Weight (${unit})`}
                  value={weight}
                  step={unit === "kg" ? 2.5 : 5}
                  onDec={() => addWeight(-(unit === "kg" ? 2.5 : 5))}
                  onInc={() => addWeight(unit === "kg" ? 2.5 : 5)}
                />
                <div className="flex items-end justify-end gap-2">
                  <button
                    onClick={() => setUnit("kg")}
                    className={`${chipClass} ${
                      unit === "kg" ? "ring-1 ring-sky-400/60" : ""
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setUnit("lb")}
                    className={`${chipClass} ${
                      unit === "lb" ? "ring-1 ring-sky-400/60" : ""
                    }`}
                  >
                    lb
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-sky-200/90">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Felt strong today…"
                  className="w-full rounded-2xl border border-sky-900/50 bg-slate-950/50 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                ></textarea>
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-3">
                <button className={gradientClass} onClick={save}>
                  SAVE SET
                </button>
                <div className="text-[11px] text-sky-300/70">
                  Tip: tap chips to change values. Long-press (or click
                  repeatedly) to ramp.
                </div>
              </div>
            </section>

            <section className="mt-7">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-sky-200/90">
                Today's Log
              </h3>
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

            <section className="mt-8">
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-sky-200/90">
                Recent Sessions
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {groupByDate(history).map(({ date, items }) => (
                  <div
                    key={date}
                    className="rounded-2xl border border-sky-900/50 bg-slate-950/30 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between text-[13px] text-sky-300/80">
                      <span>{date}</span>
                      <span>{items.length} sets</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      {items.slice(0, 4).map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="text-sky-100/90">{it.exercise}</div>
                          <div className="text-sky-300/80">
                            {it.sets}×{it.reps} @ {it.weight}
                            {it.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0">
          <div className="pointer-events-auto mx-auto mb-6 w-full max-w-3xl px-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky-900/60 bg-slate-950/70 p-3 shadow-[0_0_30px_rgba(0,140,255,.15)]">
              <span className="text-[13px] text-sky-300/80">
                Perimeter UI • Navy gradient & silver glass
              </span>
              <button className={gradientClass} onClick={save}>
                SAVE SET
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NumberPicker({ label, value, onDec, onInc, step = 1 }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-sky-200/90">{label}</label>
      <div className="flex items-center gap-2">
        <button onClick={onDec} className={chipClass}>
          - {step}
        </button>
        <div className="min-w-[64px] rounded-xl border border-sky-900/50 bg-slate-950/50 px-3 py-2 text-center text-sky-100/90">
          {value}
        </div>
        <button onClick={onInc} className={chipClass}>
          + {step}
        </button>
      </div>
    </div>
  );
}

function today() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function groupByDate(items) {
  const map = {};
  for (const it of items) {
    (map[it.date] ||= []).push(it);
  }
  return Object.entries(map).map(([date, items]) => ({ date, items }));
}
