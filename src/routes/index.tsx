import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCategories } from "@/hooks/useQuizData";
import { CategoryCard } from "@/components/CategoryCard";
import { Quiz } from "@/components/Quiz";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Quizly — Random Quiz Generator" },
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
  const { categories, loading } = useCategories();

  const active = categories.find((c) => c.id === activeId) ?? null;

  return (
    <main className="relative min-h-screen px-4 py-12 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,_oklch(0.72_0.2_320_/_0.18),transparent_70%)]" />

      <div className="mx-auto max-w-6xl">
        {!active && (
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

              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card p-2 shadow-card">
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
            </header>

            <section>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-semibold sm:text-3xl">Choose a field</h2>
                <span className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${categories.length} topics`}
                </span>
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
              Built with ♥ — plug in your backend to power infinite questions.
            </footer>
          </>
        )}

        {active && (
          <Quiz category={active} numQuestions={count} onExit={() => setActiveId(null)} />
        )}
      </div>
    </main>
  );
}
