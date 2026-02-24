"use client";
import Link from "next/link";

export function Card({ children, href }: { children: React.ReactNode; href?: string }) {
  const inner = (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "1.25rem 1.5rem",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
  return href ? (
    <Link href={href} style={{ display: "block", textDecoration: "none" }}>
      {inner}
    </Link>
  ) : inner;
}