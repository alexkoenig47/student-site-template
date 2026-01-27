import Link from "next/link";
import { formatDate, getPostHref, posts, student } from "../lib/siteContent";

export default function BlogIndexPage() {
  return (
    <div className="space-y-10">
      <header className="lsu-card relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="lsu-badge">Blog</span>
            <p className="text-sm text-muted">
              Writing by <span className="font-semibold text-foreground">{student.name}</span>
            </p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Notes in Purple &amp; Gold
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">
            Short essays, project updates, and what I’m learning at LSU.
          </p>
        </div>
      </header>

      <section className="grid gap-4">
        {posts.map((post) => (
          <article key={post.slug} className="lsu-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-base font-semibold leading-7">
                <Link
                  href={getPostHref(post.slug)}
                  className="underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-purple hover:decoration-brand-gold"
                >
                  {post.title}
                </Link>
              </h2>
              <time dateTime={post.date} className="text-sm text-muted-2">
                {formatDate(post.date)}
              </time>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{post.excerpt}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-brand-purple/25 bg-brand-purple/5 px-3 py-1 text-xs font-medium text-brand-purple"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

