import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/projects";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return notFound();

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <Link href="/projects" style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
        ← Back to projects
      </Link>

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <span style={{
          fontSize: "0.7rem", color: "var(--accent2)", border: "1px solid var(--accent2)",
          borderRadius: 4, padding: "2px 8px", letterSpacing: "0.08em", opacity: 0.8,
        }}>{p.category}</span>
      </div>

      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem", lineHeight: 1.2 }}>
        {p.title}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: "1.5rem", lineHeight: 1.7 }}>
        {p.summary}
      </p>

      <div style={{ marginBottom: "2rem" }}>
        {p.tags.map(t => (
          <span key={t} style={{
            display: "inline-block", padding: "2px 10px", border: "1px solid var(--border)",
            borderRadius: 4, fontSize: "0.72rem", color: "var(--muted)",
            letterSpacing: "0.06em", marginRight: 6, marginBottom: 6,
          }}>{t}</span>
        ))}
      </div>

      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.5rem 1.2rem", border: "1px solid var(--border)",
          borderRadius: 6, color: "var(--muted)", fontSize: "0.82rem",
          marginBottom: "3rem", letterSpacing: "0.05em",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      )}

      <section style={{ marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "var(--accent2)", marginBottom: "1rem" }}>
          WHAT I BUILT
        </h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {p.bullets.map((b, i) => (
            <li key={i} style={{
              color: "#9090b8", paddingLeft: "1rem",
              borderLeft: "2px solid var(--accent)", lineHeight: 1.6,
            }}>{b}</li>
          ))}
        </ul>
      </section>

      <section style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem",
      }}>
        <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "var(--accent2)", marginBottom: "0.75rem" }}>
          RESULTS
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{p.results}</p>
      </section>

      <section style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "1.5rem",
      }}>
        <h2 style={{ fontSize: "0.8rem", letterSpacing: "0.12em", color: "var(--accent2)", marginBottom: "0.75rem" }}>
          LESSONS LEARNED
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>{p.lessons}</p>
      </section>
    </main>
  );
}