export type Project = {
  slug: string;
  title: string;
  number: string;
  category: "AI systems" | "Applied ML";
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
    slug: "smart-waste-segregator",
    title: "Smart Waste Segregator",
    number: "02",
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
    slug: "vortex",
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
];
