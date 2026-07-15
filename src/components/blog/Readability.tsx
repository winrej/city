/**
 * Readability — Live readability analysis panel for the blog editor sidebar.
 *
 * Computes: Flesch Reading Ease, avg sentence length, avg word length,
 * long-sentence flag (>40 words), passive-voice heuristic.
 * Pure client-side — no dependencies.
 */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Analysis logic
// ---------------------------------------------------------------------------

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/`[^`]+`/g, " ") // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/images
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^[-*]\s+/gm, "") // list bullets
    .replace(/^\d+\.\s+/gm, "") // ordered list markers
    .replace(/^>\s+/gm, "") // blockquotes
    .replace(/^---$/gm, "") // hr
    .replace(/\|[^\n]+/g, " ") // tables
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? Math.max(1, m.length) : 1;
}

const PASSIVE_TRIGGERS = [
  "was ",
  "were ",
  "is ",
  "are ",
  "been ",
  "be ",
  "being ",
  "has been",
  "have been",
  "had been",
  "will be",
  "would be",
];
const PASSIVE_RE = /\b(?:am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;

export type ReadabilityResult = {
  fleschScore: number; // 0–100 (higher = easier)
  fleschLabel: string;
  avgSentenceWords: number;
  avgWordSyllables: number;
  longSentenceCount: number; // sentences > 40 words
  passiveSentenceCount: number;
  wordCount: number;
  sentenceCount: number;
};

export function analyzeReadability(markdown: string): ReadabilityResult | null {
  const text = stripMarkdown(markdown);
  if (!text || text.length < 20) return null;

  // Split sentences on . ? ! (rough heuristic)
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = text.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w));
  if (words.length === 0 || sentences.length === 0) return null;

  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const avgSentenceWords = words.length / sentences.length;
  const avgWordSyllables = totalSyllables / words.length;

  // Flesch Reading Ease
  const flesch = Math.min(
    100,
    Math.max(0, 206.835 - 1.015 * avgSentenceWords - 84.6 * avgWordSyllables),
  );

  const fleschLabel =
    flesch >= 90
      ? "Very Easy"
      : flesch >= 80
        ? "Easy"
        : flesch >= 70
          ? "Fairly Easy"
          : flesch >= 60
            ? "Standard"
            : flesch >= 50
              ? "Fairly Difficult"
              : flesch >= 30
                ? "Difficult"
                : "Very Difficult";

  const longSentenceCount = sentences.filter((s) => s.split(/\s+/).length > 40).length;

  const passiveMatches = text.match(PASSIVE_RE) ?? [];
  const passiveSentenceCount = passiveMatches.length;

  return {
    fleschScore: Math.round(flesch),
    fleschLabel,
    avgSentenceWords: Math.round(avgSentenceWords * 10) / 10,
    avgWordSyllables: Math.round(avgWordSyllables * 100) / 100,
    longSentenceCount,
    passiveSentenceCount,
    wordCount: words.length,
    sentenceCount: sentences.length,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ReadabilityProps {
  content: string;
}

function ScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      style={{
        height: "3px",
        borderRadius: "999px",
        background: "var(--portal-border)",
        overflow: "hidden",
        marginTop: "4px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: "999px",
          transition: "width 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

export function Readability({ content }: ReadabilityProps) {
  const [expanded, setExpanded] = useState(true);
  const result = useMemo(() => analyzeReadability(content), [content]);

  const fleschColor = result
    ? result.fleschScore >= 70
      ? "oklch(0.65 0.18 145)"
      : result.fleschScore >= 50
        ? "oklch(0.72 0.18 80)"
        : "oklch(0.6 0.18 25)"
    : "var(--portal-text-muted)";

  return (
    <div className="portal-card" style={{ padding: "1.25rem" }}>
      <button
        type="button"
        id="readability-toggle"
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          marginBottom: expanded ? "1rem" : 0,
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--portal-text-muted)",
          }}
        >
          Readability
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {result && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: fleschColor,
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {result.fleschLabel}
            </span>
          )}
          <span style={{ color: "var(--portal-text-muted)" }}>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </span>
      </button>

      {expanded && (
        <>
          {!result ? (
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--portal-text-muted)",
                fontStyle: "italic",
              }}
            >
              Write more content to see readability stats.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {/* Flesch Reading Ease */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--portal-text)",
                    }}
                  >
                    Flesch Reading Ease
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontFamily: "JetBrains Mono, monospace",
                      color: fleschColor,
                      fontWeight: 700,
                    }}
                  >
                    {result.fleschScore} / 100
                  </span>
                </div>
                <ScoreBar value={result.fleschScore} max={100} color={fleschColor} />
                <span
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--portal-text-muted)",
                    marginTop: "2px",
                    display: "block",
                  }}
                >
                  Target ≥ 60 (Standard). {result.fleschLabel}.
                </span>
              </div>

              {/* Stats grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.625rem",
                }}
              >
                {[
                  {
                    label: "Words",
                    value: result.wordCount,
                    ok: result.wordCount >= 300,
                    hint: "Target ≥ 300",
                  },
                  {
                    label: "Sentences",
                    value: result.sentenceCount,
                    ok: true,
                    hint: "",
                  },
                  {
                    label: "Avg sentence",
                    value: `${result.avgSentenceWords}w`,
                    ok: result.avgSentenceWords <= 20,
                    hint: "Target ≤ 20 words",
                  },
                  {
                    label: "Avg word",
                    value: `${result.avgWordSyllables} syl`,
                    ok: result.avgWordSyllables <= 1.8,
                    hint: "Target ≤ 1.8",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "var(--portal-surface-2)",
                      borderRadius: "6px",
                      padding: "0.5rem 0.625rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--portal-text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        fontWeight: 600,
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: stat.ok ? "var(--portal-text)" : "oklch(0.72 0.18 80)",
                        fontFamily: "JetBrains Mono, monospace",
                        marginTop: "2px",
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Flags */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color:
                        result.longSentenceCount === 0
                          ? "oklch(0.65 0.18 145)"
                          : "oklch(0.72 0.18 80)",
                      width: "14px",
                      textAlign: "center",
                    }}
                  >
                    {result.longSentenceCount === 0 ? "✓" : "⚠"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--portal-text-muted)" }}>
                    {result.longSentenceCount === 0
                      ? "No overly long sentences"
                      : `${result.longSentenceCount} sentence(s) over 40 words`}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color:
                        result.passiveSentenceCount <= 2
                          ? "oklch(0.65 0.18 145)"
                          : "oklch(0.72 0.18 80)",
                      width: "14px",
                      textAlign: "center",
                    }}
                  >
                    {result.passiveSentenceCount <= 2 ? "✓" : "⚠"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--portal-text-muted)" }}>
                    {result.passiveSentenceCount <= 2
                      ? "Low passive voice usage"
                      : `${result.passiveSentenceCount} passive voice instance(s)`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
