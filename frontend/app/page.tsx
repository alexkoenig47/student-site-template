import Link from "next/link";
import { formatDate, getPostHref, posts, student } from "./lib/siteContent";

export default function Home() {
  const featuredPosts = posts.slice(0, 2);

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-purple via-[#2b0f52] to-[#0b0713] p-8 text-white shadow-sm sm:p-10">
        <div className="absolute -right-32 -top-28 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" />
        <div className="absolute -left-40 -bottom-36 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="lsu-badge">Louisiana State University</span>
            <span className="rounded-full border border-brand-gold/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
              {student.location}
            </span>
          </div>

          <p className="text-sm text-white/80">
            Hi, I’m <span className="font-semibold text-white">{student.name}</span>.
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            {student.tagline}
          </h1>

          <p className="max-w-2xl text-base leading-7 text-white/80">
            Projects, writing, and notes on what I’m learning—built in Purple &amp; Gold.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a className="lsu-btn-gold" href={`mailto:${student.email}`}>
              Email me
            </a>
            <Link className="lsu-btn-outline" href="/projects">
              View projects
            </Link>
            <Link className="lsu-btn-outline" href="/blog">
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="about" className="lsu-card">
        <h2 id="about" className="text-lg font-semibold tracking-tight">
          About me
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
          {student.about}
        </p>
      </section>

      <section aria-labelledby="interests" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="interests" className="text-lg font-semibold tracking-tight">
            Interests
          </h2>
          <span className="lsu-badge">Purple + Gold energy</span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {student.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-sm"
            >
              <span className="mr-2 text-brand-gold">◆</span>
              {interest}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="featured-posts" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="featured-posts" className="text-lg font-semibold tracking-tight">
              Featured posts
            </h2>
            <p className="mt-1 text-sm text-muted-2">A couple highlights from the blog.</p>
          </div>
          <Link className="lsu-link text-sm" href="/blog">
            View all →
          </Link>
        </div>

        <div className="grid gap-4">
          {featuredPosts.map((post) => (
            <article key={post.slug} className="lsu-card">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="text-base font-semibold leading-7">
                  <Link
                    href={getPostHref(post.slug)}
                    className="underline decoration-brand-gold/60 underline-offset-4 hover:text-brand-purple hover:decoration-brand-gold"
                  >
                    {post.title}
                  </Link>
                </h3>
                <time dateTime={post.date} className="text-sm text-muted-2">
                  {formatDate(post.date)}
                </time>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {post.excerpt}
              </p>
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
        </div>
      </section>
    </div>
  );
}
