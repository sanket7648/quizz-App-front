/**
 * API Client for Quizly Backend
 * Handles all HTTP requests to the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

/**
 * Make a fetch request with error handling
 */
async function fetchWithError(
  endpoint: string,
  options?: RequestInit
): Promise<unknown> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error: ApiError = new Error(
        `API Error: ${response.status} ${response.statusText}`
      );
      error.status = response.status;
      try {
        error.data = await response.json();
      } catch {
        error.data = await response.text();
      }
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

export interface Choice {
  id?: number;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id?: number;
  text: string;
  difficulty: number;
  choices: Choice[];
}

export interface Topic {
  id: number;
  name: string;
}

export interface GenerateQuizRequest {
  topic: string;
  num_questions: number;
  difficulty: number;
}

export interface GeneratedQuiz {
  topic: string;
  questions: Question[];
  generated_at: string;
}

export interface QuizQuestion extends Question {
  options: string[];
  answer: number; // Index of correct answer
}

// ==================== API FUNCTIONS ====================

/**
 * Get all available topics
 */
export async function getTopics(): Promise<Topic[]> {
  return (await fetchWithError("/api/topics")) as Topic[];
}

/**
 * Get a specific topic by ID
 */
export async function getTopic(topicId: number): Promise<Topic> {
  return (await fetchWithError(`/api/topics/${topicId}`)) as Topic;
}

/**
 * Get questions for a specific topic
 */
export async function getTopicQuestions(
  topicId: number,
  limit?: number
): Promise<Question[]> {
  const url = `/api/topics/${topicId}/questions${limit ? `?limit=${limit}` : ""}`;
  return (await fetchWithError(url)) as Question[];
}

/**
 * Get a random quiz from a topic
 */
export async function getRandomQuiz(
  topicId: number,
  numQuestions: number = 5
): Promise<Question[]> {
  return (await fetchWithError(
    `/api/quiz/random?topic_id=${topicId}&num_questions=${numQuestions}`
  )) as Question[];
}

/**
 * Generate quiz questions using AI for a custom topic
 */
export async function generateQuiz(
  topic: string,
  numQuestions: number = 5,
  difficulty: number = 2
): Promise<GeneratedQuiz> {
  const request: GenerateQuizRequest = {
    topic,
    num_questions: numQuestions,
    difficulty,
  };

  return (await fetchWithError("/api/quiz/generate", {
    method: "POST",
    body: JSON.stringify(request),
  })) as GeneratedQuiz;
}

/**
 * Convert API Questions to Quiz format (for compatibility with existing Quiz component)
 */
export function convertToQuizFormat(question: Question): QuizQuestion {
  // Find the index of the correct answer
  const answerIndex = question.choices.findIndex((c) => c.is_correct);

  return {
    ...question,
    options: question.choices.map((c) => c.text),
    answer: answerIndex >= 0 ? answerIndex : 0,
  };
}

/**
 * Get health status of the backend
 */
export async function getHealthStatus(): Promise<{ status: string; service: string }> {
  return (await fetchWithError("/health")) as {
    status: string;
    service: string;
  };
}

/**
 * Check if API is accessible
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const status = await getHealthStatus();
    return status.status === "healthy";
  } catch {
    return false;
  }
}
