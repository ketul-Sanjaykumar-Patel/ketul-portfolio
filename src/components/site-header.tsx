"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/projects", label: "projects" },
  { href: "/now", label: "now" },
  { href: "/contact", label: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        position: "relative",
      }}>
        {/* LOGO */}
        <Link href="/">
          <img
            src="/logo.svg"
            alt="KP Embedded Solutions"
            style={{ height: 36, width: "auto" }}
          />
        </Link>

        {/* DESKTOP NAV */}
        {!isMobile && (
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
        )}

        {/* MOBILE HAMBURGER BUTTON */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              color: "var(--muted)",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        )}

        {/* MOBILE DROPDOWN MENU */}
        {isMobile && isMenuOpen && (
          <div style={{
            position: "absolute",
            top: 56,
            right: 0,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "0.75rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            minWidth: 160,
            zIndex: 100,
          }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: pathname.startsWith(href) ? "var(--accent2)" : "var(--muted)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}