export type Question = {
  question: string;
  options: string[];
  answer: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  questions: Question[];
};

export const categories: Category[] = [
  {
    id: "science",
    name: "Science",
    description: "Physics, chemistry, biology and beyond.",
    icon: "🧬",
    gradient: "from-fuchsia-500 to-purple-600",
    questions: [
      { question: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
      { question: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
      { question: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Hydrogen", "Nitrogen", "Carbon dioxide"], answer: 3 },
      { question: "What is the speed of light (approx)?", options: ["3×10^8 m/s", "3×10^6 m/s", "3×10^5 km/s", "Both A and C"], answer: 3 },
      { question: "Human body has how many bones?", options: ["196", "206", "216", "226"], answer: 1 },
      { question: "Which is the largest organ in the human body?", options: ["Liver", "Brain", "Skin", "Lungs"], answer: 2 },
      { question: "Water boils at?", options: ["90°C", "100°C", "110°C", "120°C"], answer: 1 },
      { question: "DNA stands for?", options: ["Deoxyribonucleic Acid", "Diribonucleic Acid", "Dinucleic Acid", "None"], answer: 0 },
    ],
  },
  {
    id: "history",
    name: "History",
    description: "Empires, wars and turning points.",
    icon: "🏛️",
    gradient: "from-amber-500 to-rose-600",
    questions: [
      { question: "Who was the first President of the USA?", options: ["Lincoln", "Washington", "Jefferson", "Adams"], answer: 1 },
      { question: "World War II ended in?", options: ["1942", "1945", "1948", "1950"], answer: 1 },
      { question: "The Great Wall is in?", options: ["India", "Japan", "China", "Korea"], answer: 2 },
      { question: "Who discovered America?", options: ["Magellan", "Cook", "Columbus", "Vespucci"], answer: 2 },
      { question: "The French Revolution began in?", options: ["1789", "1799", "1776", "1804"], answer: 0 },
      { question: "Taj Mahal was built by?", options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"], answer: 2 },
      { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], answer: 2 },
      { question: "The Berlin Wall fell in?", options: ["1987", "1989", "1991", "1993"], answer: 1 },
    ],
  },
  {
    id: "tech",
    name: "Technology",
    description: "Code, gadgets and the internet age.",
    icon: "💻",
    gradient: "from-cyan-400 to-blue-600",
    questions: [
      { question: "HTML stands for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperTabular ML", "None"], answer: 0 },
      { question: "Founder of Microsoft?", options: ["Steve Jobs", "Bill Gates", "Elon Musk", "Mark Z."], answer: 1 },
      { question: "Which is a JS framework?", options: ["Django", "Laravel", "React", "Flask"], answer: 2 },
      { question: "CPU stands for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Control Process Unit"], answer: 1 },
      { question: "Who founded Tesla?", options: ["Elon Musk", "Martin Eberhard", "Steve Jobs", "Jeff Bezos"], answer: 1 },
      { question: "Which company makes the iPhone?", options: ["Samsung", "Google", "Apple", "Sony"], answer: 2 },
      { question: "AI stands for?", options: ["Auto Intelligence", "Artificial Intelligence", "Applied Info", "Active Internet"], answer: 1 },
      { question: "GitHub was acquired by?", options: ["Google", "Microsoft", "Meta", "Amazon"], answer: 1 },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    description: "Countries, capitals and natural wonders.",
    icon: "🌍",
    gradient: "from-emerald-400 to-teal-600",
    questions: [
      { question: "Capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2 },
      { question: "Largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
      { question: "Mount Everest is in?", options: ["India", "Nepal", "China", "Bhutan"], answer: 1 },
      { question: "Sahara is a?", options: ["Sea", "Desert", "Forest", "Mountain"], answer: 1 },
      { question: "Longest river?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1 },
      { question: "Capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Nagoya"], answer: 2 },
      { question: "Smallest country?", options: ["Monaco", "Vatican City", "Malta", "Nauru"], answer: 1 },
      { question: "Which continent has the most countries?", options: ["Asia", "Europe", "Africa", "S. America"], answer: 2 },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    description: "Champions, records and game rules.",
    icon: "⚽",
    gradient: "from-orange-400 to-red-600",
    questions: [
      { question: "How many players in a football team?", options: ["9", "10", "11", "12"], answer: 2 },
      { question: "Olympics held every?", options: ["2 yrs", "3 yrs", "4 yrs", "5 yrs"], answer: 2 },
      { question: "Cricket originated in?", options: ["India", "England", "Australia", "S. Africa"], answer: 1 },
      { question: "Usain Bolt is from?", options: ["USA", "Jamaica", "Kenya", "Trinidad"], answer: 1 },
      { question: "Tennis grand slam played on grass?", options: ["US Open", "French", "Wimbledon", "Australian"], answer: 2 },
      { question: "Most NBA championships (player)?", options: ["Jordan", "LeBron", "Russell", "Kobe"], answer: 2 },
      { question: "FIFA World Cup 2022 winner?", options: ["France", "Brazil", "Argentina", "Germany"], answer: 2 },
      { question: "How long is a marathon (km)?", options: ["40", "42.195", "45", "50"], answer: 1 },
    ],
  },
  {
    id: "movies",
    name: "Movies",
    description: "Hollywood, classics and blockbusters.",
    icon: "🎬",
    gradient: "from-pink-500 to-purple-700",
    questions: [
      { question: "Who directed Inception?", options: ["Spielberg", "Nolan", "Cameron", "Tarantino"], answer: 1 },
      { question: "Titanic released in?", options: ["1995", "1997", "1999", "2001"], answer: 1 },
      { question: "Iron Man actor?", options: ["Chris Evans", "Robert Downey Jr.", "Mark Ruffalo", "Chris Hemsworth"], answer: 1 },
      { question: "Highest grossing film (2024)?", options: ["Avatar", "Avengers Endgame", "Titanic", "Star Wars 7"], answer: 0 },
      { question: "Joker (2019) lead?", options: ["Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Jack Nicholson"], answer: 1 },
      { question: "Studio behind Toy Story?", options: ["Disney", "Pixar", "DreamWorks", "Sony"], answer: 1 },
      { question: "Matrix protagonist?", options: ["Neo", "Trinity", "Morpheus", "Smith"], answer: 0 },
      { question: "Parasite is from?", options: ["Japan", "China", "S. Korea", "Vietnam"], answer: 2 },
    ],
  },
];
