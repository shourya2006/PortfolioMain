export type Project = {
  slug: string;
  /** Screenshot under /public. Projects without a live demo have none. */
  image?: string;
  title: string;
  number: string;
  category: "AI systems" | "Applied ML" | "Web apps";
  subtitle: string;
  description: string;
  date: string;
  stack: string[];
  github: string;
  demo?: string;
  problem: string;
  approach: string[];
  outcome: string;
  metrics: { value: string; label: string }[];
};

export const projects: Project[] = [
  {
    slug: "nextflow",
    image: "/images/projects/nextflow.png",
    title: "NextFlow",
    number: "01",
    category: "AI systems",
    subtitle: "An idea. A few nodes. A working flow.",
    description:
      "A visual workflow builder that connects AI generation with text, image, and video processing.",
    date: "April 2026",
    stack: [
      "TypeScript",
      "Next.js",
      "React Flow",
      "Gemini API",
      "Trigger.dev",
      "PostgreSQL",
      "Prisma",
      "FFmpeg",
      "Sharp",
    ],
    github: "https://github.com/shourya2006/NextFlow",
    demo: "https://nextflow193.vercel.app",
    problem:
      "Bring multi-step AI and media workflows into a visual interface, where users can connect processing steps and execute them as a single flow.",
    approach: [
      "Built a drag-and-drop editor with React Flow for connecting LLM, text, image, and video processing nodes.",
      "Integrated Gemini for generation and Trigger.dev for asynchronous node execution.",
      "Used FFmpeg and Sharp for media processing, with PostgreSQL and Prisma for data storage.",
    ],
    outcome:
      "A node-based application for creating, connecting, and executing workflows that combine AI generation and media processing.",
    metrics: [
      { value: "4", label: "Node types" },
      { value: "Async", label: "Workflow execution" },
    ],
  },
  {
    slug: "rashtram-ai",
    image: "/images/projects/rashtram-ai.png",
    title: "Rashtram AI",
    number: "02",
    category: "AI systems",
    subtitle: "Indian law and policy, with sources.",
    description:
      "A legislative and public-policy platform for exploring Indian Bills, Acts, Gazettes and policies, with grounded AI summaries and chat.",
    date: "July 2026",
    stack: ["Next.js", "React", "Express", "PostgreSQL", "Pinecone", "OpenAI"],
    github: "https://github.com/shourya2006/Rashtram-AI",
    demo: "https://rashtram-ai.vercel.app",
    problem:
      "Make Indian Bills, Acts, Gazettes, policies and regulatory records searchable and understandable without losing track of the original source.",
    approach: [
      "Built a Next.js and React client with an Express API for authentication, document processing and AI services.",
      "Stored users, chats and the legislative catalogue in PostgreSQL, with Pinecone vector retrieval for Bills, Acts and other documents.",
      "Used OpenAI for multilingual embeddings, OCR, summaries and streamed chat responses that stay grounded in source documents.",
    ],
    outcome:
      "A platform where researchers can search public records, ask questions and read summaries that keep links to the original sources.",
    metrics: [
      { value: "RAG", label: "Source-grounded chat" },
      { value: "OCR", label: "Document processing" },
    ],
  },
  {
    slug: "vortex",
    image: "/images/projects/vortex.png",
    title: "Vortex",
    number: "03",
    category: "AI systems",
    subtitle: "Study materials, in conversation.",
    description:
      "An AI study assistant that brings document retrieval, question answering, and math rendering into a chat interface.",
    date: "June 2025",
    stack: [
      "TypeScript",
      "Node.js",
      "Express",
      "Axios",
      "Pinecone",
      "OpenAI",
      "node-cron",
      "KaTeX",
    ],
    github: "https://github.com/shourya2006/Vortex",
    demo: "https://vortex-jet.vercel.app/",
    problem:
      "Make study materials easier to explore by connecting a chat interface to document processing and retrieval.",
    approach: [
      "Implemented a retrieval-augmented generation workflow with vector embeddings and Pinecone.",
      "Combined document processing and automated notes retrieval with an AI-powered chat experience.",
      "Used KaTeX to render mathematical content, with TypeScript, Node.js, and Express behind the application.",
    ],
    outcome:
      "A study assistant that supports questions about learning materials, document retrieval, and mathematical content in one interface.",
    metrics: [
      { value: "RAG", label: "Document retrieval" },
      { value: "KaTeX", label: "Math rendering" },
    ],
  },
  {
    slug: "tripwallet",
    image: "/images/projects/tripwallet.png",
    title: "Trip Wallet",
    number: "04",
    category: "Web apps",
    subtitle: "Split the trip, not the friendship.",
    description:
      "An expense-splitting app for managing shared trip costs, settling debts and organizing travel participants.",
    date: "May 2026",
    stack: ["TypeScript", "Node.js", "Express", "MongoDB", "React", "Vite", "Tailwind CSS", "JWT"],
    github: "https://github.com/shourya2006/TripWallet-ReDesign",
    demo: "https://trip-wallet-eosin.vercel.app",
    problem:
      "Keep track of who paid for what on a shared trip and settle up without spreadsheets.",
    approach: [
      "Rebuilt the backend as a class-based TypeScript architecture on Node.js, Express and MongoDB.",
      "Applied Singleton, Template Method, Strategy, Factory and Adapter patterns to keep services modular.",
      "Built the React and Vite frontend with Tailwind CSS, and JWT authentication with refresh tokens.",
    ],
    outcome:
      "A trip expense app whose redesigned codebase is strictly typed and organized around standard design patterns.",
    metrics: [
      { value: "5", label: "Design patterns" },
      { value: "JWT", label: "Auth with refresh" },
    ],
  },
  {
    slug: "solveiq",
    image: "/images/projects/solveiq.png",
    title: "SolveIQ",
    number: "05",
    category: "Web apps",
    subtitle: "Every judge, one dashboard.",
    description:
      "A dashboard that tracks and visualizes competitive programming progress across Codeforces, LeetCode and CodeChef.",
    date: "April 2025",
    stack: ["React", "React Router", "Tailwind CSS", "Vite", "Codeforces API", "LeetCode API", "CodeChef API"],
    github: "https://github.com/shourya2006/SolveIQ",
    demo: "https://solveiq.vercel.app",
    problem:
      "Competitive programmers track progress on several platforms, each with its own profile and charts.",
    approach: [
      "Connected Codeforces, LeetCode and CodeChef accounts into one unified dashboard.",
      "Visualized solved problems by difficulty and topic, with activity heatmaps.",
      "Added AI problem recommendations based on skill level and the daily LeetCode question.",
    ],
    outcome:
      "A single responsive dashboard for following coding progress across three platforms.",
    metrics: [
      { value: "3", label: "Platforms connected" },
    ],
  },
  {
    slug: "codeclash",
    image: "/images/projects/codeclash.png",
    title: "CodeClash",
    number: "06",
    category: "Web apps",
    subtitle: "Two coders. One problem. Real time.",
    description:
      "A real-time platform for 1v1 coding battles on Codeforces problems, with live submission verification.",
    date: "April 2025",
    stack: ["React", "Node.js", "Express", "Socket.IO", "Codeforces API"],
    github: "https://github.com/shourya2006/CodeClash",
    demo: "https://codeclash-1-bq57.onrender.com/",
    problem:
      "Make competitive programming practice head-to-head: two players, the same problem, against the clock.",
    approach: [
      "Built rooms that players create and join, synchronized in real time with Socket.IO.",
      "Selected Codeforces problems by player rating through the Codeforces API.",
      "Verified solutions by checking players' Codeforces submissions, with configurable time limits.",
    ],
    outcome:
      "A working 1v1 battle platform where the first verified Codeforces submission wins.",
    metrics: [
      { value: "1v1", label: "Real-time battles" },
    ],
  },
  {
    slug: "smart-waste-segregator",
    image: "/images/projects/waste.svg",
    title: "Smart Waste Segregator",
    number: "07",
    category: "Applied ML",
    subtitle: "Six classes. A carefully tested baseline.",
    description:
      "A classical machine learning system for classifying waste images into six material categories.",
    date: "October 2026",
    stack: [
      "Python",
      "Scikit-learn",
      "Scikit-image",
      "NumPy",
      "Pandas",
      "Gradio",
      "SVM",
      "Random Forest",
    ],
    github: "https://github.com/shourya2006/smart-waste-segregation",
    problem:
      "Classify a waste image as cardboard, glass, metal, paper, plastic, or miscellaneous trash using classical machine learning.",
    approach: [
      "Built a feature extraction pipeline combining HSV color histograms, Histogram of Oriented Gradients, and Local Binary Patterns.",
      "Compared SVM and Random Forest classifiers using group-aware cross-validation.",
      "Selected a calibrated SVM model and provided a Gradio interface for image classification.",
    ],
    outcome:
      "In the project’s evaluation, the selected calibrated SVM achieved 89.99% macro F1 and 90.19% test accuracy across six waste classes.",
    metrics: [
      { value: "89.99%", label: "Macro F1" },
      { value: "90.19%", label: "Test accuracy" },
      { value: "6", label: "Waste classes" },
    ],
  },
  {
    slug: "cyber-programmer",
    image: "/images/projects/cyber-programmer.png",
    title: "Cyber Programmer",
    number: "08",
    category: "Web apps",
    subtitle: "Coding lessons, posted and discussed.",
    description:
      "A Django blog for coding tutorials, with video posts, comments, search, accounts and source code downloads.",
    date: "October 2024",
    stack: ["Python", "Django", "SQLite", "Bootstrap", "Render"],
    github: "https://github.com/shourya2006/YTweb",
    demo: "https://cyberprogrammer.onrender.com/",
    problem:
      "Share beginner coding tutorials in one place, with their source code and a way for learners to ask questions.",
    approach: [
      "Built a Django site with models for tutorial videos, comments and contact messages.",
      "Added video search, sign-up and login, and source code links for each tutorial.",
      "Deployed it to Render with Gunicorn and WhiteNoise.",
    ],
    outcome:
      "A live tutorial blog where visitors can browse, search and comment on coding videos.",
    metrics: [],
  },
  {
    slug: "youtube-clone",
    title: "YouTube Clone",
    number: "09",
    category: "Web apps",
    subtitle: "The familiar layout, rebuilt in React.",
    description:
      "A YouTube-style React interface with a category bar, sidebar, video grid and Google sign-in through Firebase.",
    date: "February 2025",
    stack: ["React", "Redux", "Firebase", "React Router", "Bootstrap", "Sass"],
    github: "https://github.com/shourya2006/YoutubeClone",
    problem:
      "Practice building a large, familiar interface in React with real authentication and shared state.",
    approach: [
      "Built the header, sidebar, category bar and video grid as React components styled with Sass.",
      "Added Google sign-in with Firebase, with auth state managed in Redux and Redux Thunk.",
    ],
    outcome:
      "A front-end clone of the YouTube home screen with working sign-in.",
    metrics: [],
  },
];
