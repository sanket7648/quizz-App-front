import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories } from "@/hooks/useQuizData";
import { CategoryCard } from "@/components/CategoryCard";
import { Quiz } from "@/components/Quiz";
import { CustomTopicForm } from "@/components/CustomTopicForm";
import { generateQuiz, GeneratedQuiz, Question } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Quizly | Random Quiz Generator" },
      {
        name: "description",
        content:
          "Pick a topic and get a fresh, randomly generated quiz every time. Test your knowledge across science, tech, history and more.",
      },
    ],
  }),
});

function Index() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [count, setCount] = useState(5);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { categories, loading } = useCategories();
  const active = categories.find((c) => c.id === activeId) ?? null;

  const handleGenerateQuiz = async (topic: string, numQuestions: number, difficulty: number) => {
    try {
      setIsGenerating(true);
      const quiz = await generateQuiz(topic, numQuestions, difficulty);
      setGeneratedQuiz(quiz);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen px-4 py-12 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,_oklch(0.72_0.2_320_/_0.18),transparent_70%)]" />
      
      <div className="mx-auto max-w-6xl">
        {!active && !generatedQuiz && (
          <>
            <header className="mb-12 text-center sm:mb-16">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Fresh questions every round
              </div>
              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl">
                <span className="text-gradient-primary">Quizly</span>
              </h1>
              <p className="mt-4 text-balance text-lg text-muted-foreground sm:text-xl">
                A random quiz generator that adapts to your curiosity. <br className="hidden sm:block" />
                Choose a field, hit start, and let the questions flow.
              </p>
            </header>

            {/* AI CUSTOM QUIZ GENERATOR COMES FIRST */}
            <section className="mb-16">
              <div className="mx-auto max-w-2xl">
                <CustomTopicForm onSubmit={handleGenerateQuiz} isLoading={isGenerating} />
              </div>
            </section>

            {/* PRE-MADE CATEGORY CARDS COME SECOND */}
            <section className="border-t border-border pt-12 mb-12">
              <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-semibold sm:text-3xl">Or Choose A Pre-Made Category</h2>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {loading ? "Loading..." : `${categories.length} Topics Available`}
                  </span>
                </div>
                
                {/* MOVED THE QUESTION SELECTOR HERE */}
                <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-card">
                  <span className="px-3 text-sm text-muted-foreground">Questions:</span>
                  {[5, 8].map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                        count === n
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((c) => (
                    <CategoryCard key={c.id} category={c} onSelect={setActiveId} />
                  ))}
                </div>
              )}
            </section>

            <footer className="mt-20 text-center text-xs text-muted-foreground">
              Built with ❤️
            </footer>
          </>
        )}

        {/* QUIZ PLAYING VIEWS */}
        {active && !generatedQuiz && (
          <Quiz category={active} numQuestions={count} onExit={() => setActiveId(null)} />
        )}

        {generatedQuiz && (
          <GeneratedQuizComponent
            quiz={generatedQuiz}
            onExit={() => setGeneratedQuiz(null)}
          />
        )}
      </div>
    </main>
  );
}

// Component to display generated quiz
function GeneratedQuizComponent({
  quiz,
  onExit,
}: {
  quiz: GeneratedQuiz;
  onExit: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = quiz.questions;
  const q = questions[current];

  const submit = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.choices.findIndex((c) => c.is_correct)) {
      setScore((s) => s + 1);
    }
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
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (!q) {
    return (
      <div className="glass mx-auto w-full max-w-2xl rounded-3xl p-8 shadow-card">
        <div className="text-center">
          <p className="text-muted-foreground">No questions available</p>
          <button
            onClick={onExit}
            className="mt-4 rounded-xl border border-border bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-muted"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const message =
      pct === 100 ? "Flawless! 🏆" : pct >= 70 ? "Great job! 🌟" : pct >= 40 ? "Not bad 👍" : "Keep practicing 💪";

    return (
      <div className="glass mx-auto w-full max-w-2xl rounded-3xl p-8 shadow-card">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">{message}</h2>
          <p className="mt-4 text-3xl font-semibold">
            {score} / {questions.length}
          </p>
          <p className="mt-2 text-muted-foreground">
            {pct}% - {pct === 100 ? "Perfect score!" : `Keep it up!`}
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={restart}
              className="w-full rounded-xl border-2 border-primary bg-transparent px-6 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Try Again
            </button>
            <button
              onClick={onExit}
              className="w-full rounded-xl border border-border bg-secondary px-6 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-muted"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Question {current + 1} / {questions.length}
        </h3>
        <span className="text-sm font-medium text-primary">{quiz.topic}</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-primary transition-all duration-300"
          style={{
            width: `${((current + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="glass mt-8 rounded-3xl p-8 shadow-card">
        <h2 className="mb-6 text-2xl font-bold">{q.text}</h2>

        <div className="space-y-3">
          {q.choices.map((choice, idx) => {
            const isSelected = selected === idx;
            const isCorrect = choice.is_correct;
            const showResult = selected !== null;

            let className =
              "group relative flex w-full items-center gap-4 rounded-xl border-2 border-border bg-card p-4 text-left transition-all ";

            if (!showResult) {
              className +=
                "cursor-pointer hover:border-primary hover:bg-muted ";
              if (isSelected) className += "border-primary bg-muted";
            } else {
              if (isCorrect) {
                className += "border-green-500 bg-green-500/10";
              } else if (isSelected && !isCorrect) {
                className += "border-red-500 bg-red-500/10";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !showResult && submit(idx)}
                disabled={showResult}
                className={className}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {isSelected && "✓"}
                </div>
                <span className="flex-1 font-medium">{choice.text}</span>
                {showResult && isCorrect && <span className="text-green-600">✓</span>}
                {showResult && isSelected && !isCorrect && <span className="text-red-600">✗</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="flex-1 rounded-xl border border-border bg-secondary px-4 py-3 font-semibold text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={next}
            disabled={selected === null}
            className="flex-1 rounded-xl border-2 border-primary bg-transparent px-4 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {current + 1 === questions.length ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}