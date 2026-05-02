import { Category } from "@/lib/quizData";

type Props = {
  category: Category;
  onSelect: (id: string) => void;
};

export function CategoryCard({ category, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(category.id)}
      className="group relative overflow-hidden rounded-2xl glass p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
    >
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${category.gradient} opacity-30 blur-2xl transition-opacity group-hover:opacity-60`}
      />
      <div className="relative">
        <div className="mb-4 text-4xl">{category.icon}</div>
        <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{category.questions.length}+ questions</span>
          <span className="text-primary transition-transform group-hover:translate-x-1">Start →</span>
        </div>
      </div>
    </button>
  );
}
