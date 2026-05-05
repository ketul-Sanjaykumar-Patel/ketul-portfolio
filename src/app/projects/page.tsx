"use client";

import Link from "next/link";
import { useState } from "react";

import { projectCategories, projects } from "@/lib/projects";

export default function ProjectsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((project) => project.category === active);
  const categoryButtons = projectCategories.map((category) => ({
    category,
    count: category === "All" ? projects.length : projects.filter((project) => project.category === category).length,
  }));

  return (
    <main className="site-shell page-shell">
      <section className="panel page-banner">
        <p className="section-kicker">Work index</p>
        <h1 className="page-title">Case studies, experiments, and systems work.</h1>
        <p className="page-copy">
          Robotics, edge AI, signal processing, embedded systems, and software. Each project is structured around the
          actual problem, the implementation choices, and what happened when it ran in the real world.
        </p>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <div>
            <p className="section-kicker">Filters</p>
            <h2 className="section-heading">Browse by focus area</h2>
          </div>
          <p className="section-link">{filtered.length} visible</p>
        </div>

        <div className="filter-strip">
          {categoryButtons.map(({ category, count }) => (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              className={`filter-pill ${active === category ? "filter-pill-active" : ""}`}
            >
              <span>{category}</span>
              <span className="filter-count">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="projects-grid">
        {filtered.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="project-card">
            <div className="overview-card">
              <div className="project-card-top">
                <h3>{project.title}</h3>
                <span className="category-badge">{project.category}</span>
              </div>
              <p>{project.summary}</p>
              <div className="tag-cloud" style={{ marginTop: "1rem" }}>
                {project.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-footer">
                <span className="project-link">Open case study</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
