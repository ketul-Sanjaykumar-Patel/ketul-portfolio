import Link from "next/link";

import { Card } from "@/components/project-card";
import { SocialLinks } from "@/components/social-links";
import { projects } from "@/lib/projects";

export default function HomePage() {
  const featuredSlugs = ["dc-motor-pid", "robot-neural-network-movement", "ehealth-iot-platform"];
  const featured = featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
  const projectTags = [
    "PWM",
    "PID",
    "Motor Control",
    "Validation",
    "Raspberry Pi 5",
    "C and C++",
    "Python",
    "Embedded Linux",
    "Hailo-8L",
  ];
  const targetRoles = [
    "Embedded Software Engineer",
    "Embedded Validation Engineer",
    "Motor Control Engineer",
    "Power Electronics Engineer",
    "Edge AI Engineer",
  ];
  const currentFocus = [
    {
      title: "Teaching contract + freelance work",
      text: "Teaching at my institute while taking on freelance embedded and IoT work that turns prototypes into clear, working systems.",
    },
    {
      title: "e-Health IoT platform",
      text: "Turning a two-node Arduino and Raspberry Pi monitoring build into a stronger case study with architecture, alerts, sensor mapping, and dashboard flow.",
    },
    {
      title: "Robot guidance reliability",
      text: "Improving indoor robot control with lightweight vision models, steadier UART timing, and cleaner decision logic.",
    },
    {
      title: "Acceleration workflows",
      text: "Studying the ONNX to HAR to HEF path so models are easier to move onto Hailo hardware.",
    },
  ];
  const quickStats = [
    { value: `${projects.length}+`, label: "project case studies" },
    { value: "5", label: "main technical tracks" },
    { value: "offline-first", label: "deployment mindset" },
  ];
  const strengths = [
    {
      title: "Embedded control systems",
      text: "Raspberry Pi, microcontroller communication, PWM actuation, UART and I2C integration, and software that stays close to hardware reality.",
    },
    {
      title: "Motor control and validation",
      text: "PID loops, tuning, response testing, anti-windup, and debugging behavior in a way that is useful for both control and validation roles.",
    },
    {
      title: "Edge AI deployment",
      text: "Inference pipelines, TFLite workflows, Hailo experiments, and model choices shaped by latency and device limits.",
    },
    {
      title: "Technical communication",
      text: "I like explaining what was built, how it was tested, and what failed during implementation without hiding the messy parts.",
    },
    {
      title: "Learning mindset",
      text: "I am comfortable stepping into tools or domains I have not used yet, learning fast from documentation and testing, and becoming useful quickly on real systems.",
    },
  ];

  return (
    <main className="site-shell page-shell">
      <section className="hero-grid">
        <div className="panel hero-panel">
          <p className="section-kicker">Paris / Embedded systems / Motor control / Edge AI / Teaching</p>
          <h1 className="hero-title">Junior Embedded Systems Engineer</h1>
          <p className="hero-copy">
            I work across embedded Linux, robotics, motor control, computer vision, and on-device inference. Right now
            that includes teaching at my institute, freelance engineering work, and building systems where software,
            hardware, sensing, validation, and real-world behavior all need to line up.
          </p>
          <p className="small-copy" style={{ maxWidth: "60ch", marginTop: "0.9rem" }}>
            I may not have worked with every exact tool yet, but I learn quickly, test carefully, and adapt fast when
            given a real engineering problem.
          </p>
          <p className="small-copy" style={{ maxWidth: "60ch", marginTop: "0.9rem" }}>
            <strong>Target roles:</strong> {targetRoles.join(" · ")}
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
              Teaching embedded systems and building IoT-based healthcare systems.
            </strong>
            <p className="small-copy" style={{ marginTop: "0.6rem" }}>
              Integrating sensors, building smart detection, and making data visible on both a website and a mobile
              application.
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
              <h3 style={{ marginTop: "0.55rem" }}>Embedded + control</h3>
              <p>Motor control, Linux on Pi, microcontrollers, sensors, and deployment-minded robotics software.</p>
            </div>
            <div className="panel micro-card">
              <span className="eyebrow-label">approach</span>
              <h3 style={{ marginTop: "0.55rem" }}>Build, test, document</h3>
              <p>Short loops, validation thinking, clear debugging, and reproducible results matter more than flashy demos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-stack">
        <div className="section-header">
          <div>
            <p className="section-kicker">Current work</p>
            <h2 className="section-heading">What I am working on now</h2>
            <p className="section-copy">
              Right now the focus is on reliability, deployment, and making each project easier to explain as an
              engineering story instead of just a demo.
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
            <h2 className="section-heading">Selected projects</h2>
            <p className="section-copy">
              These projects cover motor control, robot navigation, embedded validation thinking, edge AI inference,
              and deployment-focused experimentation.
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
            <p className="section-kicker">Core strengths</p>
            <h2 className="section-heading">What I bring technically</h2>
          </div>
        </div>

        <div className="info-grid">
          {strengths.map((item) => (
            <div key={item.title} className="panel micro-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel cta-banner">
        <div>
          <p className="section-kicker">For recruiters</p>
          <h2 className="section-heading">The strongest fit is embedded work with real hardware in the loop.</h2>
          <p className="section-copy">
            My portfolio is strongest where sensing, control, validation, debugging, and deployment all matter:
            embedded software, motor control, embedded validation, robotics, IoT systems, and edge AI on constrained
            devices.
          </p>
          <p className="section-copy" style={{ marginTop: "0.85rem" }}>
            Even when a role includes tools I have not used yet, I bring a solid embedded foundation, a fast learning
            loop, and the habit of proving things through testing rather than guessing.
          </p>
        </div>
      </section>

      <section className="panel cta-banner">
        <div>
          <p className="section-kicker">Next step</p>
          <h2 className="section-heading">If your team builds real systems, I would love to talk.</h2>
          <p className="section-copy">
            I am especially interested in embedded software, robotics, controls, edge AI, and practical freelance
            product engineering work.
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
