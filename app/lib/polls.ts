/**
 * Poll data structure and daily poll logic
 */

export interface Poll {
  id: string;
  date: string; // YYYY-MM-DD format
  question: string;
  optionA: string;
  optionB: string;
  category?: string; // Optional category for organization
}

/**
 * Predefined poll questions for different days
 * In production, these would come from a database or API
 */
const POLL_QUESTIONS: Poll[] = [
  {
    id: "coffee-tea",
    date: "",
    question: "What's your preference?",
    optionA: "Coffee ☕",
    optionB: "Tea 🍵",
    category: "lifestyle",
  },
  {
    id: "ios-android",
    date: "",
    question: "Which mobile OS do you prefer?",
    optionA: "iOS 🍎",
    optionB: "Android 🤖",
    category: "tech",
  },
  {
    id: "morning-night",
    date: "",
    question: "Are you a morning or night person?",
    optionA: "Morning 🌅",
    optionB: "Night 🌙",
    category: "lifestyle",
  },
  {
    id: "remote-office",
    date: "",
    question: "Where do you prefer to work?",
    optionA: "Remote 🏠",
    optionB: "Office 🏢",
    category: "work",
  },
  {
    id: "pizza-burger",
    date: "",
    question: "What's your favorite fast food?",
    optionA: "Pizza 🍕",
    optionB: "Burger 🍔",
    category: "food",
  },
  {
    id: "dog-cat",
    date: "",
    question: "Dogs or cats?",
    optionA: "Dogs 🐕",
    optionB: "Cats 🐱",
    category: "pets",
  },
  {
    id: "summer-winter",
    date: "",
    question: "Which season do you prefer?",
    optionA: "Summer ☀️",
    optionB: "Winter ❄️",
    category: "weather",
  },
];

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get today's poll based on day of week
 * This ensures the same poll is shown throughout the day
 * and changes daily
 */
export function getTodayPoll(): Poll {
  const today = getTodayDate();
  const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  
  // Use day of week to select a poll (ensures consistency throughout the day)
  const pollIndex = dayOfWeek % POLL_QUESTIONS.length;
  const selectedPoll = { ...POLL_QUESTIONS[pollIndex] };
  
  // Set the date to today
  selectedPoll.date = today;
  selectedPoll.id = `${selectedPoll.id}-${today}`;
  
  return selectedPoll;
}

/**
 * Get poll by date
 * Useful for viewing past polls
 */
export function getPollByDate(date: string): Poll | null {
  const dayOfWeek = new Date(date).getDay();
  const pollIndex = dayOfWeek % POLL_QUESTIONS.length;
  const selectedPoll = { ...POLL_QUESTIONS[pollIndex] };
  
  selectedPoll.date = date;
  selectedPoll.id = `${selectedPoll.id}-${date}`;
  
  return selectedPoll;
}

/**
 * Get all available poll categories
 */
export function getPollCategories(): string[] {
  const categories = new Set<string>();
  POLL_QUESTIONS.forEach((poll) => {
    if (poll.category) {
      categories.add(poll.category);
    }
  });
  return Array.from(categories);
}

