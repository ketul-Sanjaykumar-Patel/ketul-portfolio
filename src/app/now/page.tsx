export default function NowPage() {
  const current = [
    "Open to new opportunities in embedded systems, robotics, and edge AI.",
    "Improving indoor robot guidance with lightweight camera models and more robust UART control logic.",
    "Learning Hailo compilation details so deployment is faster and less trial-and-error heavy.",
    "Documenting experiments clearly enough that someone else could reproduce them without guessing.",
  ];

  const learning = [
    "Model acceleration workflows for edge hardware.",
    "Better debugging habits for real-time embedded systems.",
    "Cleaner project storytelling: what was built, why it mattered, and what failed first.",
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
          <span className="status-chip">Open to conversations</span>
          <p className="small-copy" style={{ maxWidth: "60ch" }}>
            I am looking for opportunities where embedded software, robotics, edge AI, or hardware-aware product work
            are central to the team. The best conversations usually start with a real system problem.
          </p>
        </div>
      </section>
    </main>
  );
}
