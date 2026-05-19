export type Topic = {
  slug: string;
  name: string;
  description: string;
  modules: number;
  questions: number;
  level: "both" | "professional" | "subprofessional";
  icon: string; // single letter / symbol
};

export const topics: Topic[] = [
  {
    slug: "english",
    name: "English",
    description: "Grammar, vocabulary, reading comprehension, and paragraph organization.",
    modules: 12,
    questions: 240,
    level: "both",
    icon: "En",
  },
  {
    slug: "filipino",
    name: "Filipino",
    description: "Balarila, talasalitaan, pag-unawa sa binasa, at pagsasaayos ng mga pangungusap.",
    modules: 10,
    questions: 200,
    level: "both",
    icon: "Fi",
  },
  {
    slug: "numerical",
    name: "Numerical Ability",
    description: "Basic operations, word problems, fractions, percentages, ratios, and sequences.",
    modules: 14,
    questions: 280,
    level: "both",
    icon: "№",
  },
  {
    slug: "logic",
    name: "Logic & Analytical Ability",
    description: "Logical reasoning, analogies, syllogisms, and number/letter series.",
    modules: 9,
    questions: 180,
    level: "professional",
    icon: "Λ",
  },
  {
    slug: "general-information",
    name: "General Information",
    description: "Current events, Philippine history, geography, and cultural literacy.",
    modules: 8,
    questions: 160,
    level: "both",
    icon: "Gi",
  },
  {
    slug: "constitution",
    name: "Philippine Constitution",
    description: "Articles, rights, duties, and structure of government under the 1987 Constitution.",
    modules: 7,
    questions: 140,
    level: "both",
    icon: "₱",
  },
  {
    slug: "ethics",
    name: "Code of Conduct & Ethical Standards",
    description: "RA 6713 norms of conduct for public officials and employees.",
    modules: 6,
    questions: 120,
    level: "both",
    icon: "Co",
  },
  {
    slug: "clerical",
    name: "Clerical Operations",
    description: "Filing, spelling, and clerical accuracy for the Subprofessional level.",
    modules: 5,
    questions: 100,
    level: "subprofessional",
    icon: "Cl",
  },
];
