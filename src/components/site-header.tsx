"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "projects" },
  { href: "/notes", label: "notes" },
  { href: "/now", label: "now" },
  { href: "/contact", label: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header style={{
      borderBottom: "1px solid var(--border)",
      background: "var(--bg)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "0 1.5rem",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{
          color: "var(--accent2)",
          fontWeight: 700,
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
        }}>
          KP<span style={{ color: "var(--muted)" }}>_</span>
        </Link>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              color: pathname.startsWith(href) ? "var(--accent2)" : "var(--muted)",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              transition: "color 0.2s",
            }}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}