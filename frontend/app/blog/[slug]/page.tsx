import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPostBySlug, posts, student } from "../../lib/siteContent";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="space-y-10">
      <header className="lsu-card relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl" />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link className="lsu-link text-sm" href="/blog">
              ← Back to Posts
            </Link>
            <span className="lsu-badge">Purple &amp; Gold</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-2">
              {formatDate(post.date)} • {student.name}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-base leading-7 text-muted">{post.excerpt}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-purple/25 bg-brand-purple/5 px-3 py-1 text-xs font-medium text-brand-purple"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="lsu-card prose prose-zinc max-w-none prose-a:text-brand-purple prose-a:decoration-brand-gold/70 prose-a:underline-offset-4">
        <p>
          This is a starter post template. Replace this content with your real post text—what
          you learned, what you built, and what you’d do differently next time.
        </p>
        <h2>What this post is about</h2>
        <ul>
          <li>The problem or question you started with</li>
          <li>Your approach (and any tradeoffs)</li>
          <li>What you shipped or discovered</li>
        </ul>
        <h2>Key takeaway</h2>
        <p>End with one clear takeaway a future-you (or another student) could use.</p>
      </article>
    </div>
  );
}

