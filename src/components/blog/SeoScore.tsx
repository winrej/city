/**
 * SeoScore — Live SEO analysis panel for the blog editor sidebar.
 *
 * Checks: title length, excerpt/meta length, single H1, heading order,
 * slug length, image alt coverage, internal-link count.
 * Returns a weighted 0–100 score with pass / warn / fail rows.
 */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Scoring logic (pure, no side-effects)
// ---------------------------------------------------------------------------

export type SeoCheckResult = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
  weight: number;
};

export type SeoAnalysis = {
  score: number; // 0–100
  checks: SeoCheckResult[];
};

function countInternalLinks(content: string): number {
  const re = /\[([^\]]+)\]\((\/[^)]*)\)/g;
  let count = 0;
  let m;
  while ((m = re.exec(content)) !== null) count++;
  return count;
}

function extractHeadingLevels(content: string): number[] {
  const re = /^(#{1,6}) /gm;
  const levels: number[] = [];
  let m;
  while ((m = re.exec(content)) !== null) levels.push(m[1].length);
  return levels;
}

function checkHeadingOrder(levels: number[]): { ok: boolean; detail: string } {
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      return {
        ok: false,
        detail: `H${levels[i - 1]} → H${levels[i]} skips a level`,
      };
    }
  }
  return { ok: true, detail: "Heading levels are sequential" };
}

function countImagesWithoutAlt(content: string): number {
  const re = /!\[([^\]]*)\]\([^)]+\)/g;
  let missing = 0;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (!m[1].trim()) missing++;
  }
  return missing;
}

export function analyzeSeo(
  title: string,
  excerpt: string,
  slug: string,
  content: string,
): SeoAnalysis {
  const checks: SeoCheckResult[] = [];

  // 1. Title length (50–60 chars)
  const tLen = title.trim().length;
  checks.push({
    id: "title-length",
    label: "Title length",
    status: tLen >= 50 && tLen <= 60 ? "pass" : tLen >= 40 && tLen <= 70 ? "warn" : "fail",
    detail: tLen === 0 ? "No title" : `${tLen} chars (target 50–60)`,
    weight: 15,
  });

  // 2. Excerpt / meta description length (120–160)
  const eLen = excerpt.trim().length;
  checks.push({
    id: "excerpt-length",
    label: "Meta description",
    status: eLen >= 120 && eLen <= 160 ? "pass" : eLen >= 80 && eLen <= 200 ? "warn" : "fail",
    detail: eLen === 0 ? "No excerpt" : `${eLen} chars (target 120–160)`,
    weight: 15,
  });

  // 3. Single H1 check
  const h1Count = (content.match(/^# .+$/gm) ?? []).length;
  checks.push({
    id: "single-h1",
    label: "Single H1",
    status: h1Count === 0 ? "warn" : h1Count === 1 ? "pass" : "fail",
    detail:
      h1Count === 0
        ? "No H1 found (title becomes H1 on the page)"
        : h1Count === 1
          ? "One H1 present"
          : `${h1Count} H1s found — use only one`,
    weight: 10,
  });

  // 4. Heading order
  const levels = extractHeadingLevels(content);
  const { ok: orderOk, detail: orderDetail } = checkHeadingOrder(levels);
  checks.push({
    id: "heading-order",
    label: "Heading hierarchy",
    status: levels.length === 0 ? "warn" : orderOk ? "pass" : "warn",
    detail: levels.length === 0 ? "No headings found" : orderDetail,
    weight: 10,
  });

  // 5. Slug length
  const sLen = slug.trim().length;
  checks.push({
    id: "slug-length",
    label: "Slug length",
    status: sLen === 0 ? "fail" : sLen <= 75 ? "pass" : "warn",
    detail: sLen === 0 ? "No slug" : `${sLen} chars (target ≤ 75)`,
    weight: 10,
  });

  // 6. Image alt coverage
  const missingAlts = countImagesWithoutAlt(content);
  checks.push({
    id: "image-alts",
    label: "Image alt text",
    status: missingAlts === 0 ? "pass" : missingAlts <= 2 ? "warn" : "fail",
    detail:
      missingAlts === 0 ? "All images have alt text" : `${missingAlts} image(s) missing alt text`,
    weight: 20,
  });

  // 7. Internal links
  const internalLinks = countInternalLinks(content);
  checks.push({
    id: "internal-links",
    label: "Internal links",
    status: internalLinks >= 2 ? "pass" : internalLinks === 1 ? "warn" : "fail",
    detail:
      internalLinks === 0 ? "No internal links (add 2+)" : `${internalLinks} internal link(s)`,
    weight: 20,
  });

  // Weighted score
  let earned = 0;
  let total = 0;
  for (const c of checks) {
    total += c.weight;
    if (c.status === "pass") earned += c.weight;
    else if (c.status === "warn") earned += c.weight * 0.5;
  }
  const score = Math.round((earned / total) * 100);

  return { score, checks };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SeoScoreProps {
  title: string;
  excerpt: string;
  slug: string;
  content: string;
}

const STATUS_COLOR: Record<SeoCheckResult["status"], string> = {
  pass: "oklch(0.65 0.18 145)",
  warn: "oklch(0.72 0.18 80)",
  fail: "oklch(0.6 0.18 25)",
};
const STATUS_ICON: Record<SeoCheckResult["status"], string> = {
  pass: "✓",
  warn: "⚠",
  fail: "✗",
};

export function SeoScore({ title, excerpt, slug, content }: SeoScoreProps) {
  const [expanded, setExpanded] = useState(true);
  const { score, checks } = useMemo(
    () => analyzeSeo(title, excerpt, slug, content),
    [title, excerpt, slug, content],
  );

  const scoreColor =
    score >= 80
      ? "oklch(0.65 0.18 145)"
      : score >= 55
        ? "oklch(0.72 0.18 80)"
        : "oklch(0.6 0.18 25)";

  return (
    <div className="portal-card" style={{ padding: "1.25rem" }}>
      {/* Header */}
      <button
        type="button"
        id="seo-score-toggle"
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
          SEO Score
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: scoreColor,
              fontFamily: "JetBrains Mono, monospace",
              transition: "color 400ms ease",
            }}
          >
            {score}
          </span>
          <span style={{ color: "var(--portal-text-muted)" }}>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </span>
      </button>

      {expanded && (
        <>
          {/* Score bar */}
          <div
            style={{
              height: "4px",
              borderRadius: "999px",
              background: "var(--portal-border)",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${score}%`,
                background: scoreColor,
                borderRadius: "999px",
                transition: "width 600ms cubic-bezier(0.22,1,0.36,1), background 400ms ease",
              }}
            />
          </div>

          {/* Checks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {checks.map((c) => (
              <div
                key={c.id}
                className="seo-check-row"
                style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}
              >
                <span
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: STATUS_COLOR[c.status],
                    flexShrink: 0,
                    marginTop: "1px",
                    width: "14px",
                    textAlign: "center",
                  }}
                >
                  {STATUS_ICON[c.status]}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "var(--portal-text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {c.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--portal-text-muted)",
                      marginTop: "1px",
                      lineHeight: 1.4,
                    }}
                  >
                    {c.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
