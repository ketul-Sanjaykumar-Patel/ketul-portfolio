"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/now", label: "now" },
  { href: "/contact", label: "contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-shell">
        <div className="site-header-inner">
          <Link href="/" className="brand-link">
            <span className="brand-badge">KP</span>
            <span className="brand-copy">
              <span className="brand-title">Ketul Patel</span>
              <span className="brand-subtitle">Embedded systems, robotics, edge AI</span>
            </span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          <nav className={`site-nav ${isMenuOpen ? "site-nav-open" : ""}`}>
            {links.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
