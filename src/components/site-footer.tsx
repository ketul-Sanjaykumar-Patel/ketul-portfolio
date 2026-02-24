export function SiteFooter() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      marginTop: "4rem",
      padding: "2rem 1.5rem",
      textAlign: "center",
      color: "var(--muted)",
      fontSize: "0.8rem",
      letterSpacing: "0.05em",
    }}>
      <p>© {new Date().getFullYear()} Ketul Patel — built with Next.js · Tailwind · MDX</p>
    </footer>
  );
}