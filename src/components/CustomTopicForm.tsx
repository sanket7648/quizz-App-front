import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Props = {
  onSubmit: (topic: string, numQuestions: number, difficulty: number) => Promise<void>;
  isLoading: boolean;
};

export function CustomTopicForm({ onSubmit, isLoading }: Props) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("2");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      await onSubmit(topic, parseInt(numQuestions), parseInt(difficulty));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate quiz. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 shadow-card">
      <div className="mb-6">
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-semibold">
          <Sparkles className="h-6 w-6 text-primary" />
          AI-Powered Quiz Generator
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter any topic and let AI generate custom questions for you
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="topic" className="mb-2 block text-sm font-medium">
            Topic
          </label>
          <Input
            id="topic"
            placeholder="e.g., Quantum Physics, Medieval History, Web Development..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="border-border"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="questions" className="mb-2 block text-sm font-medium">
              Number of Questions
            </label>
            <Select value={numQuestions} onValueChange={setNumQuestions} disabled={isLoading}>
              <SelectTrigger id="questions" className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions</SelectItem>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="8">8 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="difficulty" className="mb-2 block text-sm font-medium">
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
              <SelectTrigger id="difficulty" className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Easy</SelectItem>
                <SelectItem value="2">Medium</SelectItem>
                <SelectItem value="3">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Quiz
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
