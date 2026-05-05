export default function NowPage() {
  const current = [
    "Teaching embedded systems and IoT work at my institute as part of a new teaching contract.",
    "Taking on freelance technical work where embedded software, sensors, robotics, or lightweight edge AI need to come together.",
    "Packaging recent projects into stronger case studies, especially the e-Health IoT platform and Raspberry Pi robot work.",
    "Improving indoor robot guidance with lightweight camera models and more robust UART control logic.",
  ];

  const learning = [
    "Model acceleration workflows for edge hardware.",
    "Better debugging habits for real-time embedded systems.",
    "Explaining embedded systems clearly in teaching settings without losing technical depth.",
  ];

  return (
    <main className="site-shell page-shell">
      <section className="panel page-banner">
        <p className="section-kicker">Now page</p>
        <h1 className="page-title">What I am building and learning right now.</h1>
        <p className="page-copy">
          This is the live layer of the portfolio: the work that is active, slightly messy, and still moving.
        </p>
      </section>

      <section className="focus-grid">
        <div className="panel panel-inner">
          <p className="section-kicker">Current focus</p>
          <ul className="availability-list">
            {current.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="panel panel-inner">
          <p className="section-kicker">Learning loop</p>
          <ul className="availability-list">
            {learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel panel-inner">
        <p className="section-kicker">Availability</p>
        <div style={{ display: "grid", gap: "1rem" }}>
          <span className="status-chip">Teaching + freelance</span>
          <p className="small-copy" style={{ maxWidth: "60ch" }}>
            I am currently in a teaching contract at my institute and available for selective freelance collaborations
            in embedded systems, IoT, robotics, or hardware-aware software. The best conversations usually start with a
            real system problem.
          </p>
        </div>
      </section>
    </main>
  );
}
