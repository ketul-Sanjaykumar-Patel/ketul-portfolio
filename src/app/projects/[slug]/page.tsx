"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { projects } from "@/lib/projects";
import { CodeViewer } from "@/components/code-viewer";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
  const p = projects.find((x) => x.slug === slug);

  const [activeTab, setActiveTab] = useState("overview");
  const [fileIdx, setFileIdx] = useState(0);
  const [lightbox, setLightbox] = useState<{ type: "image" | "video"; src: string; caption: string } | null>(null);

  if (!p) return notFound();

  const hasTabs = !!p.tabs;
  const allFiles = p.tabs ? [p.tabs.code, ...(p.tabs.extraFiles ?? [])] : [];

  const tabs = [
    { key: "overview", label: "Overview" },
    ...(hasTabs ? [
      { key: "code",    label: "Code"    },
      { key: "results", label: "Results" },
    ] : []),
  ];

  const sectionLabel: React.CSSProperties = {
    fontSize: "0.75rem", letterSpacing: "0.12em",
    color: "var(--accent2)", marginBottom: "1rem",
  };
  const card: React.CSSProperties = {
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "1.5rem", marginBottom: "1.5rem",
  };

  const ImageCard = ({ img, height }: { img: { src: string; caption: string }; height?: number }) => (
    <div
      onClick={() => setLightbox({ type: "image", src: img.src, caption: img.caption })}
      style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", cursor: "zoom-in" }}
    >
      <img
        src={img.src}
        alt={img.caption}
        style={{ width: "100%", display: "block", objectFit: "cover", height: height ?? 200 }}
      />
      {img.caption && (
        <p style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
          {img.caption}
        </p>
      )}
    </div>
  );

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "3rem 1.5rem" }}>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.92)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "zoom-out", padding: "2rem",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", top: "1.5rem", right: "1.5rem",
              background: "none", border: "1px solid #444",
              borderRadius: 6, color: "#aaa", fontSize: "1.1rem",
              cursor: "pointer", padding: "0.3rem 0.75rem", zIndex: 1001,
            }}
          >✕</button>

          {lightbox.type === "image" ? (
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 8 }}
            />
          ) : (
            <video
              src={lightbox.src}
              controls
              autoPlay
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 8 }}
            />
          )}

          {lightbox.caption && (
            <p style={{ color: "#aaa", fontSize: "0.85rem", marginTop: "1rem", textAlign: "center" }}>
              {lightbox.caption}
            </p>
          )}
        </div>
      )}

      {/* Back */}
      <Link href="/projects" style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
        &#8592; Back to projects
      </Link>

      {/* Category badge */}
      <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
        <span style={{
          fontSize: "0.7rem", color: "var(--accent2)", border: "1px solid var(--accent2)",
          borderRadius: 4, padding: "2px 8px", letterSpacing: "0.08em", opacity: 0.8,
        }}>{p.category}</span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
        {p.title}
      </h1>

      {/* Summary */}
      <p style={{ color: "var(--muted)", fontSize: "0.97rem", marginBottom: "1.25rem", lineHeight: 1.7 }}>
        {p.summary}
      </p>

      {/* Tags */}
      <div style={{ marginBottom: "1.25rem" }}>
        {p.tags.map(t => (
          <span key={t} style={{
            display: "inline-block", padding: "2px 10px", border: "1px solid var(--border)",
            borderRadius: 4, fontSize: "0.72rem", color: "var(--muted)",
            letterSpacing: "0.06em", marginRight: 6, marginBottom: 6,
          }}>{t}</span>
        ))}
      </div>

      {/* GitHub button */}
      {p.github && (
        <a href={p.github} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: "0.4rem",
          padding: "0.45rem 1.1rem", border: "1px solid var(--border)",
          borderRadius: 6, color: "var(--muted)", fontSize: "0.82rem",
          marginBottom: "2rem", letterSpacing: "0.05em",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      )}

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "0.55rem 1.3rem", fontFamily: "inherit",
            fontSize: "0.82rem", letterSpacing: "0.07em",
            color: activeTab === t.key ? "var(--accent2)" : "var(--muted)",
            borderBottom: activeTab === t.key ? "2px solid var(--accent2)" : "2px solid transparent",
            marginBottom: "-1px", transition: "color 0.15s",
          }}>
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {activeTab === "overview" && (
        <>
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={sectionLabel}>WHAT I BUILT</h2>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {p.bullets.map((b, i) => (
                <li key={i} style={{
                  color: "#9090b8", paddingLeft: "1rem",
                  borderLeft: "2px solid var(--accent)", lineHeight: 1.7,
                }}>{b}</li>
              ))}
            </ul>
          </section>

          <div style={card}>
            <h2 style={sectionLabel}>RESULTS</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>{p.results}</p>
          </div>

          <div style={card}>
            <h2 style={sectionLabel}>LESSONS LEARNED</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>{p.lessons}</p>
          </div>
        </>
      )}

      {/* ══ CODE ══ */}
      {activeTab === "code" && p.tabs && (
        <>
          {allFiles.length > 1 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {allFiles.map((f, i) => (
                <button key={i} onClick={() => setFileIdx(i)} style={{
                  background: fileIdx === i ? "var(--accent)" : "var(--surface)",
                  border: `1px solid ${fileIdx === i ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 6, padding: "0.35rem 0.9rem",
                  color: fileIdx === i ? "white" : "var(--muted)",
                  fontSize: "0.78rem", cursor: "pointer",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                  transition: "all 0.15s",
                }}>
                  {f.filename}
                </button>
              ))}
            </div>
          )}

          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "1rem", lineHeight: 1.7 }}>
            <span style={{ color: "var(--accent2)" }}>#{fileIdx + 1}</span> — {allFiles[fileIdx]?.description}
          </p>

          {allFiles[fileIdx] && (
            <CodeViewer
              filename={allFiles[fileIdx].filename}
              language={allFiles[fileIdx].language}
              code={allFiles[fileIdx].snippet}
              githubUrl={p.github}
            />
          )}
        </>
      )}

      {/* ══ RESULTS ══ */}
      {activeTab === "results" && p.tabs && (
        <>
          {/* Metrics */}
          {p.tabs.results.metrics.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={sectionLabel}>METRICS</h2>
              <div style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 8, overflow: "hidden",
              }}>
                {p.tabs.results.metrics.map((row, i) => (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    padding: "0.75rem 1.25rem",
                    borderBottom: i < p.tabs!.results.metrics.length - 1 ? "1px solid var(--border)" : "none",
                  }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>{row.label}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--accent2)", fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Images — only show if project has images */}
          {p.tabs.results.images.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 style={sectionLabel}>IMAGES</h2>

              {/* Gripper & Shapes get special layout: 1st full, 2nd full, rest 3-column */}
              {(p.slug === "robotic-arm-gripper" || p.slug === "shapes-recognizer-nn") ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {p.tabs.results.images.slice(0, 2).map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightbox({ type: "image", src: img.src, caption: img.caption })}
                      style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", cursor: "zoom-in" }}
                    >
                      <img src={img.src} alt={img.caption} style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: 400 }} />
                      {img.caption && (
                        <p style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>{img.caption}</p>
                      )}
                    </div>
                  ))}
                  {p.tabs.results.images.length > 2 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                      {p.tabs.results.images.slice(2).map((img, i) => (
                        <ImageCard key={i} img={img} height={180} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* All other projects — standard auto grid */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                  {p.tabs.results.images.map((img, i) => (
                    <ImageCard key={i} img={img} height={200} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Videos — only show if project has videos */}
          {p.tabs.results.videos.length > 0 && (
            <section>
              <h2 style={sectionLabel}>VIDEOS</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {p.tabs.results.videos.map((vid, i) => (
                  <div key={i}>
                    <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: "0.5rem" }}>{vid.caption}</p>
                    {/* Click thumbnail to open fullscreen */}
                    <div
                      onClick={() => setLightbox({ type: "video", src: vid.url, caption: vid.caption })}
                      style={{ cursor: "zoom-in", position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}
                    >
                      <video src={vid.url} style={{ width: "100%", display: "block", pointerEvents: "none" }} />
                      <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.35)",
                      }}>
                        <span style={{ fontSize: "3.5rem", color: "white", opacity: 0.9 }}>▶</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No media placeholder */}
          {p.tabs.results.images.length === 0 && p.tabs.results.videos.length === 0 && (
            <div style={{
              border: "1px dashed var(--border)", borderRadius: 8,
              padding: "2.5rem", textAlign: "center",
              color: "var(--muted)", fontSize: "0.85rem",
            }}>
              No media yet — add images or videos to{" "}
              <code style={{ color: "var(--accent2)" }}>public/projects/{p.slug}/</code>
              {" "}and update{" "}
              <code style={{ color: "var(--accent2)" }}>projects.ts</code>
            </div>
          )}
        </>
      )}

    </main>
  );
}