import Link from "next/link";
import { projects, student } from "../lib/siteContent";

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <header className="lsu-card relative overflow-hidden">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-purple/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-brand-gold/20 blur-3xl" />
        <div className="relative space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="lsu-badge">Projects</span>
            <p className="text-sm text-muted">
              Work by <span className="font-semibold text-foreground">{student.name}</span>
            </p>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            What I&apos;ve built
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">
            Course work, side projects, and things I&apos;m proud to show. Update the{" "}
            <code className="rounded-md bg-brand-purple/10 px-1.5 py-0.5 text-sm text-brand-purple">
              projects
            </code>{" "}
            array in{" "}
            <code className="rounded-md bg-brand-purple/10 px-1.5 py-0.5 text-sm text-brand-purple">
              frontend/app/lib/siteContent.ts
            </code>
            .
          </p>
        </div>
      </header>

      <section className="grid gap-4">
        {projects.map((project) => (
          <article key={project.title} className="lsu-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h2 className="text-lg font-semibold leading-7 text-foreground">{project.title}</h2>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lsu-link shrink-0 text-sm"
                >
                  {project.hrefLabel ?? "Open link"} →
                </a>
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
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

      <p className="text-center text-sm text-muted-2">
        <Link className="lsu-link" href="/">
          ← Back home
        </Link>
      </p>
    </div>
  );
}
