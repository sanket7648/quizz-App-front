import { useMemo, useState } from "react";
import { Category, Question } from "@/lib/quizData";

type Props = {
  category: Category;
  numQuestions?: number;
  onExit: () => void;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Quiz({ category, numQuestions = 5, onExit }: Props) {
  const [questions, setQuestions] = useState<Question[]>(() =>
    shuffle(category.questions).slice(0, numQuestions),
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const progress = useMemo(
    () => ((current + (finished ? 1 : 0)) / questions.length) * 100,
    [current, finished, questions.length],
  );

  const submit = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  };

  const restart = () => {
    setQuestions(shuffle(category.questions).slice(0, numQuestions));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const message =
      pct === 100 ? "Flawless! 🏆" : pct >= 70 ? "Great job! 🎉" : pct >= 40 ? "Not bad 👍" : "Keep practicing 💪";
    return (
      <div className="glass mx-auto w-full max-w-xl rounded-3xl p-8 shadow-card animate-in fade-in zoom-in-95">
        <div className="text-center">
          <div className="text-5xl">{category.icon}</div>
          <h2 className="mt-4 text-3xl font-bold text-gradient-primary">{message}</h2>
          <p className="mt-2 text-muted-foreground">You scored</p>
          <div className="my-6 text-6xl font-extrabold text-foreground">
            {score}
            <span className="text-2xl text-muted-foreground"> / {questions.length}</span>
          </div>
          <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-primary" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={onExit}
              className="rounded-xl border border-border bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-muted"
            >
              Pick Another Topic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass mx-auto w-full max-w-2xl rounded-3xl p-6 shadow-card sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Exit
        </button>
        <span className="text-sm text-muted-foreground">
          Question {current + 1} of {questions.length}
        </span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
          {category.icon} {category.name}
        </span>
      </div>

      <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h2 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
        {q.question}
      </h2>

      <div className="mt-8 grid gap-3">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === selected;
          let cls =
            "border-border bg-secondary/60 hover:bg-secondary hover:border-primary/50";
          if (selected !== null) {
            if (isCorrect) cls = "border-success bg-success/15 text-foreground";
            else if (isSelected) cls = "border-destructive bg-destructive/15 text-foreground";
            else cls = "border-border bg-secondary/40 opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => submit(i)}
              disabled={selected !== null}
              className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${cls}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/40 font-semibold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 font-medium">{opt}</span>
              {selected !== null && isCorrect && <span className="text-success">✓</span>}
              {selected !== null && isSelected && !isCorrect && (
                <span className="text-destructive">✗</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Score: <span className="font-semibold text-foreground">{score}</span>
        </span>
        <button
          onClick={next}
          disabled={selected === null}
          className="rounded-xl bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {current + 1 === questions.length ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
}
