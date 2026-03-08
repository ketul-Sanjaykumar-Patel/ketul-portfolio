"use client";
import { useState } from "react";

type Token = { text: string; color: string };

// VS Code Dark+ colors
const COLORS = {
  keyword:   "#569cd6", // blue   — import, from, if, while, return, def, class
  builtin:   "#4ec9b0", // teal   — True, False, None, print, len
  string:    "#ce9178", // orange — "..." '...' 
  comment:   "#6a9955", // green  — # ...
  number:    "#b5cea8", // light green — 0.60, 9600
  funcname:  "#dcdcaa", // yellow — function/method names after def or (
  classname: "#4ec9b0", // teal   — class names
  decorator: "#c586c0", // purple — @something
  param:     "#9cdcfe", // light blue — parameters, variables
  operator:  "#d4d4d4", // white  — = : , . ( ) [ ] 
  plain:     "#d4d4d4", // default
};

const PY_KEYWORDS = new Set([
  "import","from","as","if","else","elif","while","for","in","not","and","or",
  "def","class","return","True","False","None","with","try","except","pass",
  "raise","lambda","yield","global","nonlocal","del","assert","break","continue",
  "async","await","is",
]);

const PY_BUILTINS = new Set([
  "print","len","range","type","str","int","float","list","dict","set","tuple",
  "bool","open","enumerate","zip","map","filter","sorted","reversed","max","min",
  "sum","abs","round","input","super","self","cls",
]);

function tokenizePython(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // comment
    if (line[i] === "#") {
      tokens.push({ text: line.slice(i), color: COLORS.comment });
      break;
    }
    // decorator
    if (line[i] === "@") {
      let j = i + 1;
      while (j < line.length && /\w/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: COLORS.decorator });
      i = j; continue;
    }
    // string (single or double, simple)
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      // triple quote
      if (line.slice(i, i+3) === quote.repeat(3)) {
        j = i + 3;
        while (j < line.length && line.slice(j, j+3) !== quote.repeat(3)) j++;
        j += 3;
      } else {
        while (j < line.length && line[j] !== quote) {
          if (line[j] === "\\") j++;
          j++;
        }
        j++;
      }
      tokens.push({ text: line.slice(i, j), color: COLORS.string });
      i = j; continue;
    }
    // number
    if (/[0-9]/.test(line[i]) || (line[i] === "." && /[0-9]/.test(line[i+1] || ""))) {
      let j = i;
      while (j < line.length && /[0-9._xXbBoO]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), color: COLORS.number });
      i = j; continue;
    }
    // word (keyword / builtin / identifier)
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /\w/.test(line[j])) j++;
      const word = line.slice(i, j);
      let color = COLORS.plain;
      if (PY_KEYWORDS.has(word))  color = COLORS.keyword;
      else if (PY_BUILTINS.has(word)) color = COLORS.builtin;
      // function call  word(
      else if (line[j] === "(")   color = COLORS.funcname;
      // after def/class
      else {
        const before = line.slice(0, i).trimEnd();
        if (/\bdef$/.test(before))   color = COLORS.funcname;
        if (/\bclass$/.test(before)) color = COLORS.classname;
        else color = COLORS.param;
      }
      tokens.push({ text: word, color });
      i = j; continue;
    }
    // operator / punctuation
    tokens.push({ text: line[i], color: COLORS.operator });
    i++;
  }
  return tokens;
}

function highlightLine(line: string, lang: string): Token[] {
  if (lang === "python") return tokenizePython(line);
  return [{ text: line, color: COLORS.plain }];
}

type Props = {
  filename: string;
  language: string;
  code: string;
  githubUrl?: string;
};

export function CodeViewer({ filename, language, code, githubUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 8,
      overflow: "hidden",
      border: "1px solid #3c3c3c",
      fontFamily: "'Courier New', 'Consolas', monospace",
      fontSize: "0.83rem",
      marginBottom: "1.5rem",
    }}>
      {/* ── Title bar (3 dots like VS Code) ── */}
      <div style={{
        background: "#1e1e1e",
        padding: "0 1rem",
        height: 38,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #3c3c3c",
      }}>
        {/* left: dots + filename */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
          </div>
          <span style={{ color: "#cccccc", fontSize: "0.78rem", letterSpacing: "0.03em" }}>
            {filename}
          </span>
          <span style={{
            fontSize: "0.65rem", color: "#00d4aa",
            border: "1px solid #00d4aa", borderRadius: 3,
            padding: "1px 6px", letterSpacing: "0.08em", opacity: 0.85,
          }}>
            {language.toUpperCase()}
          </span>
        </div>

        {/* right: github + copy */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" style={{
              color: "#858585", fontSize: "0.72rem", letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          <button onClick={handleCopy} style={{
            background: copied ? "#28c840" : "#2d2d2d",
            border: "1px solid #3c3c3c",
            borderRadius: 4, cursor: "pointer",
            color: copied ? "#fff" : "#858585",
            fontSize: "0.72rem", padding: "3px 10px",
            letterSpacing: "0.04em",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Code area ── */}
      <div style={{
        background: "#1e1e1e",
        overflowX: "auto",
        padding: "1rem 0",
      }}>
        <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} style={{ lineHeight: 1.65 }}>
                {/* line number */}
                <td style={{
                  width: 48, minWidth: 48,
                  textAlign: "right",
                  paddingRight: "1.2rem",
                  paddingLeft: "0.5rem",
                  color: "#4a4a4a",
                  userSelect: "none",
                  fontSize: "0.78rem",
                  verticalAlign: "top",
                }}>
                  {idx + 1}
                </td>
                {/* code line */}
                <td style={{ paddingRight: "1.5rem", whiteSpace: "pre", verticalAlign: "top" }}>
                  {highlightLine(line, language).map((tok, ti) => (
                    <span key={ti} style={{ color: tok.color }}>{tok.text}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}