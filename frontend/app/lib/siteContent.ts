export type StudentProfile = {
  name: string;
  tagline: string;
  email: string;
  location: string;
  about: string;
  interests: string[];
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags: string[];
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Optional link (demo, repo, deck, etc.) */
  href?: string;
  /** Button text when href is set, e.g. "GitHub", "Live demo" */
  hrefLabel?: string;
};

export const student: StudentProfile = {
  name: "Alexander Koenig",
  tagline: "Accounting and Business Analytics Student at LSU",
  email: "alexkoenig0323@gmail.com",
  location: "New Orleans, Louisiana",
  about:
    "I’m an Accounting and Business Analytics student at LSU, based in New Orleans. I care about clear financial reporting, data-driven decisions, and building skills that translate to real business problems.",
  interests: [
    "interest 1",
    "interest 2",
    "interest 3",
    "interest 4",
    "interest 5",
    "interest 6",
  ],
};

export const posts: BlogPostSummary[] = [
  {
    slug: "title",
    title: "Title",
    date: "2026-03-25",
    excerpt: "Summary",
    tags: ["Tags"],
  },
  {
    slug: "what-im-building-this-semester",
    title: "What I’m building this semester (and why)",
    date: "2026-01-10",
    excerpt:
      "A quick overview of my goals, the project I’m focusing on, and the habits I’m using to stay consistent.",
    tags: ["Personal", "Projects"],
  },
  {
    slug: "three-design-lessons-portfolio",
    title: "Three small design lessons from redesigning my portfolio",
    date: "2025-12-02",
    excerpt:
      "I kept the changes small: type scale, spacing, and clearer hierarchy. Here are the before/after takeaways.",
    tags: ["Design", "Process"],
  },
];

export const projects: Project[] = [
  {
    title: "Student portfolio (this site)",
    description:
      "A Next.js portfolio with blog, projects, and LSU-inspired styling. Swap copy and add links as you ship more work.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Course or capstone project",
    description:
      "Replace this with a real project: the problem, your approach, tools (Excel, SQL, Python, etc.), and one measurable outcome.",
    tags: ["Analytics", "Excel"],
  },
  {
    title: "Internship, club, or side project",
    description:
      "Add another card for anything you want recruiters to see. Set href + hrefLabel when you have a live or repo link.",
    tags: ["Placeholder"],
  },
];

export function getPostHref(slug: string) {
  return `/blog/${slug}`;
}

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug) ?? null;
}

export function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

