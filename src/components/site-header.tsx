"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/projects", label: "projects" },
  { href: "/now", label: "now" },
  { href: "/contact", label: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <Link href="/">
          <img
            src="/logo.png"
            alt="KP Embedded Solutions"
            style={{ height: 36, width: "auto" }}
          />
        </Link>
        <nav style={{ 
          display: "flex", 
          gap: "1.5rem",
          "@media (max-width: 768px)": {
            display: isMenuOpen ? "flex" : "none",
            flexDirection: "column",
            position: "absolute",
            top: 56,
            right: 0,
            background: "var(--bg)",
            padding: "1rem",
            border: "1px solid var(--border)",
          }
        }}>
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
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ 
            display: "none",
            "@media (max-width: 768px)": { display: "block" }
          }}
        >
          ☰
        </button>
      </div>
    </header>
  );
}