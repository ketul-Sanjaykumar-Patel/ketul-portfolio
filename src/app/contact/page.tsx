export default function ContactPage() {
  return (
    <main className="site-shell page-shell">
      <section className="panel page-banner">
        <p className="section-kicker">Contact</p>
        <h1 className="page-title">Let&apos;s talk about embedded systems, robots, or edge AI.</h1>
        <p className="page-copy">
          If you have a role, a collaboration idea, or a practical hardware-software problem, email is the best place
          to start.
        </p>
        <div className="button-row">
          <a href="mailto:ketulpatel858@gmail.com" className="button-primary">
            Send email
          </a>
          <a href="/cv/ketul_patel_Embedded_systems.pdf" className="button-secondary" target="_blank" rel="noreferrer">
            Open resume
          </a>
        </div>
      </section>

      <section className="contact-grid">
        <div className="panel contact-card">
          <p className="contact-label">Email</p>
          <a href="mailto:ketulpatel858@gmail.com" className="contact-link">
            ketulpatel858@gmail.com
          </a>
        </div>

        <div className="panel contact-card">
          <p className="contact-label">LinkedIn</p>
          <a
            href="https://www.linkedin.com/in/ketul-patel-kp099/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            linkedin.com/in/ketul-patel-kp099
          </a>
        </div>

        <div className="panel contact-card">
          <p className="contact-label">GitHub</p>
          <a href="https://github.com/ketul099" target="_blank" rel="noreferrer" className="contact-link">
            github.com/ketul099
          </a>
        </div>
      </section>

      <section className="focus-grid">
        <div className="panel panel-inner">
          <p className="section-kicker">Best for</p>
          <ul className="availability-list">
            <li>Embedded software and firmware adjacent roles.</li>
            <li>Robotics or edge AI product teams that care about deployment reality.</li>
            <li>Technical conversations about systems that mix sensing, inference, and control.</li>
          </ul>
        </div>

        <div className="panel panel-inner">
          <p className="section-kicker">Quick note</p>
          <p className="small-copy">
            If you are reaching out about a role, I would love to hear the stack, the hardware, and what the team is
            trying to make reliable. That is usually the fastest way to know if there is a strong fit.
          </p>
        </div>
      </section>
    </main>
  );
}
