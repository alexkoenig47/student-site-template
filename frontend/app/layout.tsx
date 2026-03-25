import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { HeaderNav } from "./components/HeaderNav";
import { student } from "./lib/siteContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${student.name} | LSU Student`,
  description: "A student portfolio site with projects and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <header className="relative overflow-hidden bg-gradient-to-br from-brand-purple via-[#2b0f52] to-[#0b0713] text-white">
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-90" />
            <div className="absolute -left-32 -top-40 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl" />
            <div className="absolute -right-40 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

            <div className="lsu-container py-10 sm:py-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="group flex items-center gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold text-lg font-black tracking-tight text-brand-purple shadow-sm">
                    LSU
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold/90">
                      Student Portfolio
                    </p>
                    <p className="text-lg font-semibold tracking-tight text-white">
                      {student.name}
                    </p>
                  </div>
                </Link>

                <HeaderNav />
              </div>

              <div className="mt-6 hidden sm:block">
                <p className="max-w-2xl text-sm leading-6 text-white/80">
                  Purple and Gold — projects, writing, and what I’m learning at LSU.
                </p>
              </div>
            </div>
          </header>

          <main className="lsu-container py-14 sm:py-16">{children}</main>

          <footer className="border-t border-border bg-surface-2">
            <div className="lsu-container py-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">
                  © {new Date().getFullYear()} {student.name}. Geaux Tigers.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a className="lsu-link" href={`mailto:${student.email}`}>
                    Email
                  </a>
                  <Link className="lsu-link" href="/projects">
                    Projects
                  </Link>
                  <Link className="lsu-link" href="/blog">
                    Blog
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
