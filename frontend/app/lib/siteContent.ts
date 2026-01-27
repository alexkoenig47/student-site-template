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

export const student: StudentProfile = {
  name: "${STUDENT_NAME}",
  tagline: "${STUDENT_TAGLINE}",
  email: "${STUDENT_EMAIL}",
  location: "${STUDENT_LOCATION}",
  about:
    "${STUDENT_ABOUT}",
  interests: [
    "${INTEREST_1}",
    "${INTEREST_2}",
    "${INTEREST_3}",
    "${INTEREST_4}",
    "${INTEREST_5}",
    "${INTEREST_6}",
  ],
};

export const posts: BlogPostSummary[] = [
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

