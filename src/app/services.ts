export type ServiceCategory = {
  id: string;
  title: string;
  short: string;
  long: string;
  tagline: string;
  bullets: string[];
};

export const services: ServiceCategory[] = [
  {
    id: "strategic-consulting",
    title: "Strategy Consulting",
    short:
      "We help federal and corporate leaders frame the right questions, then shape strategies, operating models, and roadmaps that deliver business value.",
    long: "We help federal and corporate leaders frame the right questions, then shape strategies, operating models, and roadmaps that deliver business value.",
    tagline: "We help federal and corporate leaders frame the right questions.",
    bullets: [
      "Enterprise Solutioning",
      "Executive Planning",
      "Operational Efficiency",
      "Portfolio-level Risk Management",
    ],
  },
  {
    id: "project-management",
    title: "Project Management",
    short:
      "Kaizen provides expert end-to-end project and program management, delivering desired outcomes to clients through excellence, integrity, and transparency.",
    long: "Kaizen provides expert end-to-end project and program management, delivering desired outcomes to clients through excellence, integrity, and transparency.",
    tagline: "Kaizen provides expert end-to-end project and program management.",
    bullets: [
      "Delivery Excellence",
      "Process and Lifecycle Engineering",
      "Agile/Waterfall/Hybrid Methodology",
      "Project Management Skills Training",
    ],
  },
  {
    id: "it-modernization",
    title: "IT Modernization",
    short:
      "Our goal is to help customers achieve a competitive edge in technology advancement by providing seamless integration of systems and platforms — securely and at scale.",
    long: "Our goal is to help customers achieve a competitive edge in technology advancement by providing seamless integration of systems and platforms — securely and at scale.",
    tagline: "Our goal is to help customers achieve a competitive edge in technology advancement.",
    bullets: [
      "Digital Transformation",
      "Software Implementation",
      "AI Integration",
      "Change Management",
    ],
  },
];
