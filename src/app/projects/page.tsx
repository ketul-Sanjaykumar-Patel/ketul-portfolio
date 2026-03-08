"use client";
import { useState } from "react";
import Link from "next/link";
import { projects, projectCategories } from "@/lib/projects";

const Tag = ({ label }: { label: string }) => (
  <span style={{
    display: "inline-block",
    padding: "2px 10px",
    border: "1px solid var(--border)",
    borderRadius: 4,
    fontSize: "0.72rem",
    color: "var(--muted)",
    letterSpacing: "0.06em",
    marginRight: 6,
    marginBottom: 6,
  }}>{label}</span>
);

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter(p => p.category === active);

  return (
    <main style={{ maxWidth: "0 auto", margin: "0 auto", padding: "3rem 1.5rem" }}>
      <p style={{ color: "var(--accent2)", fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
        PORTFOLIO
      </p>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>
        Projects
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2.5rem", maxWidth: 520 }}>
        Robotics, edge AI, signal processing, embedded systems, and software — problem → approach → results.
      </p>

      {/* Category Filter */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem" }}>
        {projectCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 6,
              border: `1px solid ${active === cat ? "var(--accent)" : "var(--border)"}`,
              background: active === cat ? "var(--accent)" : "transparent",
              color: active === cat ? "white" : "var(--muted)",
              fontSize: "0.8rem",
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.2s",
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Project Grid */}
      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.map(p => (
          <Link key={p.slug} href={`/projects/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "1.5rem",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ color: "var(--text)", fontWeight: 600, fontSize: "1rem" }}>{p.title}</h3>
                <span style={{
                  fontSize: "0.65rem",
                  color: "var(--accent2)",
                  border: "1px solid var(--accent2)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  whiteSpace: "nowrap",
                  marginLeft: "1rem",
                  opacity: 0.7,
                }}>{p.category}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.summary}</p>
              <div>{p.tags.map(t => <Tag key={t} label={t} />)}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}