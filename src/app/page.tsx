import Link from "next/link";

import { projects } from "@/lib/projects";
import { Card } from "@/components/project-card";
import { SocialLinks } from "@/components/social-links";

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

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text)" }}>{title}</h2>
      {href && (
        <Link href={href} style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>{linkLabel}</Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <main style={{ maxWidth: "0 auto", margin: "0 auto", padding: "3rem 1.5rem" }}>

      {/* HERO */}
<section style={{
  marginBottom: "5rem",
  position: "relative",
  borderRadius: 12,
  overflow: "hidden",
  padding: "4rem 2rem",
  backgroundImage: "url('/circuit-bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
}}>
  {/* dark overlay */}
  <div style={{
    position: "absolute",
    inset: 0,
    background: "rgba(10, 10, 15, 0.92)",
    zIndex: 0,
  }} />
  <div style={{ position: "relative", zIndex: 1 }}>

    <p style={{ color: "var(--accent2)", fontSize: "0.8rem", letterSpacing: "0.15em", marginBottom: "1rem" }}>
      PARIS · EMBEDDED SYSTEMS · EDGE AI
    </p>
    <h1 style={{
      fontSize: "clamp(2.5rem, 6vw, 4rem)",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
      marginBottom: "1.5rem",
      color: "var(--text)",
    }}>
      Ketul Patel
    </h1>
    <p style={{ color: "var(--text)", fontSize: "1.05rem", maxWidth: 560, marginBottom: "2rem", lineHeight: 1.8 }}>
      From electrical circuits to edge AI &mdash; Diploma &#8594; B.E. &#8594; Master&apos;s in Embedded Systems.
      I build real-time systems, autonomous robots, and AI inference pipelines at the edge.
    </p>
    <div style={{ marginBottom: "2.5rem" }}>
      {["Raspberry Pi 5", "C/C++", "Python", "MATLAB", "Qt/QML", "Embedded Linux", "TFLite", "Hailo-8L", "PID Control", "Robotics"]
        .map(t => <Tag key={t} label={t} />)}
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
      <Link href="/projects" style={{
        padding: "0.6rem 1.4rem",
        background: "var(--accent)",
        color: "white",
        borderRadius: 6,
        fontSize: "0.85rem",
        letterSpacing: "0.05em",
        fontWeight: 600,
      }}>View Projects →</Link>
      <SocialLinks />
    </div>

  </div>
</section>

      <div style={{ borderTop: "1px solid var(--border)", marginBottom: "4rem" }} />

      {/* NOW */}
      <section style={{ marginBottom: "4rem" }}>
        <SectionHeader title="Now" />
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>What I&apos;m working on this month.</p>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[
            "Open to new opportunities — actively looking for a job in embedded systems and edge AI.",
            "Exploring new technologies and understanding new concepts to keep growing.",
            "Polishing my skills and building real projects to stay sharp.",
            "Improving indoor robot guidance using lightweight vision models + robust UART control.",
            "Studying Hailo compilation workflow (ONNX/TensorFlow → HAR → HEF) and YAML configs.",
            "Writing short lab notes about what works, what fails, and how I debug.",
          ].map((item, i) => (
            <li key={i} style={{ color: "#9090b8", paddingLeft: "1rem", borderLeft: "2px solid var(--accent)" }}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FEATURED PROJECTS */}
      <section style={{ marginBottom: "4rem" }}>
        <SectionHeader title="Featured Projects" href="/projects" linkLabel="All projects →" />
        <div style={{ display: "grid", gap: "1rem" }}>
          {featured.map(p => (
            <Card key={p.slug} href={`/projects/${p.slug}`}>
              <h3 style={{ color: "var(--text)", fontWeight: 600, marginBottom: "0.4rem" }}>{p.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{p.summary}</p>
              <div>{p.tags.slice(0, 5).map(t => <Tag key={t} label={t} />)}</div>
            </Card>
          ))}
        </div>
      </section>

    </main>
  );
}