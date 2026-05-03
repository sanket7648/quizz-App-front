import { useEffect, useState } from "react";
import { getTopics, Topic, getRandomQuiz, convertToQuizFormat } from "@/lib/api";
import { categories as fallbackCategories, Category, Question } from "@/lib/quizData";

/**
 * Hook to fetch categories/topics from the backend
 * Falls back to hardcoded data if API is unavailable
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const topics = await getTopics();

        // Convert API topics to Category format
        const convertedCategories: Category[] = topics.map((topic) => {
          // Find matching fallback category for additional data (icon, gradient, description)
          const fallback = fallbackCategories.find(
            (c) => c.name.toLowerCase() === topic.name.toLowerCase()
          );

          return {
            id: topic.id.toString(),
            name: topic.name,
            description: fallback?.description || `${topic.name} quiz`,
            icon: fallback?.icon || "❓",
            gradient: fallback?.gradient || "from-gray-500 to-gray-600",
            questions: fallback?.questions || [],
          };
        });

        if (convertedCategories.length > 0) {
          setCategories(convertedCategories);
        } else {
          // Use fallback if no topics found
          setCategories(fallbackCategories);
        }
      } catch (err) {
        console.warn("Failed to fetch categories from API, using fallback data", err);
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
        // Keep using fallback categories
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook to fetch quiz questions for a category
 */
export function useQuiz(categoryId: string | null, numQuestions: number = 5) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setQuestions([]);
      return;
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API first
        const topicId = parseInt(categoryId, 10);
        if (!isNaN(topicId)) {
          try {
            const apiQuestions = await getRandomQuiz(topicId, numQuestions);
            const converted = apiQuestions.map(convertToQuizFormat);
            setQuestions(converted);
            return;
          } catch (err) {
            console.warn("Failed to fetch from API, using fallback", err);
          }
        }

        // Fallback: use hardcoded data
        const category = fallbackCategories.find((c) => c.id === categoryId);
        if (category) {
          const shuffled = [...category.questions].sort(() => Math.random() - 0.5);
          setQuestions(shuffled.slice(0, numQuestions));
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [categoryId, numQuestions]);

  return { questions, loading, error };
}
