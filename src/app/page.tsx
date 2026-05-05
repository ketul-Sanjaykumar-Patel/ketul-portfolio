import Link from "next/link";

import { Card } from "@/components/project-card";
import { SocialLinks } from "@/components/social-links";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const projectTags = [
    "Raspberry Pi 5",
    "C and C++",
    "Python",
    "Embedded Linux",
    "TFLite",
    "Hailo-8L",
    "Qt and QML",
    "Robotics",
  ];
  const currentFocus = [
    {
      title: "Actively job hunting",
      text: "Looking for embedded systems, robotics, or edge AI roles where I can ship hardware-aware software.",
    },
    {
      title: "Robot guidance reliability",
      text: "Improving indoor robot control with lightweight vision models and more predictable UART command timing.",
    },
    {
      title: "Acceleration workflows",
      text: "Studying the ONNX to HAR to HEF path so models are easier to move onto Hailo hardware.",
    },
    {
      title: "Writing better notes",
      text: "Turning experiments, failures, and debugging sessions into cleaner case studies and lab-style documentation.",
    },
  ];
  const quickStats = [
    { value: `${projects.length}+`, label: "project case studies" },
    { value: "4", label: "focus areas" },
    { value: "offline-first", label: "favorite constraint" },
  ];
  const detailCards = [
    {
      title: "Why the work hits",
      text: "The portfolio is strongest when it feels like a lab notebook crossed with a sharp product site, not a generic resume page.",
    },
    {
      title: "What I build",
      text: "Perception pipelines, embedded control loops, robotics prototypes, and small software tools that support them.",
    },
    {
      title: "What I care about",
      text: "Latency, robustness, deployment reality, and whether the system still works when the internet disappears.",
    },
    {
      title: "Best fit teams",
      text: "Teams building physical products, automation, robotics, edge AI, or embedded devices that need practical engineers.",
    },
  ];

  return (
    <main className="site-shell page-shell">
      <section className="hero-grid">
        <div className="panel hero-panel">
          <p className="section-kicker">Paris / Embedded systems / Edge AI</p>
          <h1 className="hero-title">
            I build <span className="accent-scribble">robots</span> and edge AI systems that think on-device.
          </h1>
          <p className="hero-copy">
            From electrical circuits to real-time inference pipelines, I like building systems where hardware,
            software, and practical constraints all have to agree before anything moves.
          </p>

          <div className="button-row">
            <Link href="/projects" className="button-primary">
              See projects
            </Link>
            <Link href="/contact" className="button-secondary">
              Contact me
            </Link>
          </div>

          <SocialLinks />

          <div className="tag-cloud" style={{ marginTop: "1.25rem" }}>
            {projectTags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-stack">
          <div className="panel sticker-card">
            <span className="eyebrow-label">currently</span>
            <strong style={{ display: "block", fontSize: "1.3rem", lineHeight: 1.1, marginTop: "0.4rem" }}>
              Open to embedded systems and robotics roles.
            </strong>
            <p className="small-copy" style={{ marginTop: "0.6rem" }}>
              Especially teams working on edge AI, automation, controls, or real hardware in the loop.
            </p>
          </div>

          <div className="stats-grid">
            {quickStats.map((stat) => (
              <div key={stat.label} className="panel metric-card">
                <span className="metric-value">{stat.value}</span>
                <span className="metric-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hero-microgrid">
            <div className="panel micro-card">
              <span className="eyebrow-label">track</span>
              <h3 style={{ marginTop: "0.55rem" }}>Embedded systems first</h3>
              <p>Robotics, Linux on Pi, microcontrollers, and deployment-minded AI pipelines.</p>
            </div>
            <div className="panel micro-card">
              <span className="eyebrow-label">energy</span>
              <h3 style={{ marginTop: "0.55rem" }}>Build, test, iterate</h3>
              <p>Small loops, visible progress, and lots of debugging notes beat vague big promises.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <div>
            <p className="section-kicker">Current mode</p>
            <h2 className="section-heading">What I am sharpening right now</h2>
            <p className="section-copy">
              The portfolio is grounded in real projects, but the current work is about making the next build more
              reliable, faster, and easier to explain.
            </p>
          </div>
          <Link href="/now" className="section-link">
            full now page
          </Link>
        </div>

        <div className="focus-grid">
          <div className="panel panel-inner">
            <div className="timeline-list">
              {currentFocus.slice(0, 2).map((item) => (
                <div key={item.title} className="timeline-item">
                  <span className="timeline-dot" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel panel-inner">
            <div className="timeline-list">
              {currentFocus.slice(2).map((item) => (
                <div key={item.title} className="timeline-item">
                  <span className="timeline-dot" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <div>
            <p className="section-kicker">Selected work</p>
            <h2 className="section-heading">Case studies with real hardware and real constraints</h2>
            <p className="section-copy">
              The strongest thread across these projects is offline-first thinking: camera input, embedded compute,
              deterministic control, and debugging until the thing behaves.
            </p>
          </div>
          <Link href="/projects" className="section-link">
            all projects
          </Link>
        </div>

        <div className="projects-grid">
          {featured.map((project) => (
            <Card key={project.slug} href={`/projects/${project.slug}`}>
              <div className="project-card-top">
                <h3>{project.title}</h3>
                <span className="category-badge">{project.category}</span>
              </div>
              <p>{project.summary}</p>
              <div className="tag-cloud" style={{ marginTop: "1rem" }}>
                {project.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="project-footer">
                <span className="project-link">Open case study</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <div>
            <p className="section-kicker">About the fit</p>
            <h2 className="section-heading">A portfolio that reads closer to a build log than a brochure</h2>
          </div>
        </div>

        <div className="info-grid">
          {detailCards.map((item) => (
            <div key={item.title} className="panel micro-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel cta-banner">
        <div>
          <p className="section-kicker">Next step</p>
          <h2 className="section-heading">If your team builds things that have to work outside the browser, we should talk.</h2>
          <p className="section-copy">
            I am especially interested in embedded software, robotics, controls, computer vision at the edge, and
            practical product engineering.
          </p>
        </div>
        <div className="button-row" style={{ marginTop: 0 }}>
          <Link href="/contact" className="button-primary">
            Start a conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
