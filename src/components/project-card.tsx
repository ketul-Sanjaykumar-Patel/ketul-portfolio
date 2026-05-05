import Link from "next/link";

export function Card({ children, href }: { children: React.ReactNode; href?: string }) {
  const inner = <div className="project-card overview-card">{children}</div>;

  return href ? (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}
