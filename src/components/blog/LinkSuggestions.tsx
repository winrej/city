/**
 * LinkSuggestions — Live internal link suggestion panel in the sidebar.
 *
 * Scans the current markdown content, finds matching keywords for
 * existing project profiles, guides, or static pages, and offers a
 * one-click action to insert the markdown link at the current selection/cursor.
 */

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminBlogs } from "@/lib/api/admin.functions";
import { ChevronDown, ChevronUp, Link as LinkIcon, Plus } from "lucide-react";

// Types
type LinkTarget = {
  path: string;
  name: string;
  keywords: string[];
};

interface LinkSuggestionsProps {
  content: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onLinkAdded?: () => void;
}

const STATIC_TARGETS: LinkTarget[] = [
  { path: "/", name: "Homepage", keywords: ["cityqlo", "home", "advisory", "real estate"] },
  {
    path: "/properties",
    name: "Properties Listing",
    keywords: ["properties", "condo", "condominium", "homes", "presell", "rfo"],
  },
  {
    path: "/why-invest",
    name: "Why Invest Page",
    keywords: ["invest", "investment", "passive income", "manila"],
  },
  {
    path: "/contact",
    name: "Contact/Consultation",
    keywords: ["contact", "consultation", "advisory", "book", "meeting", "inquire"],
  },
  { path: "/about", name: "About Us", keywords: ["about", "team", "founder", "agency", "brokers"] },
  { path: "/careers", name: "Careers", keywords: ["careers", "hiring", "jobs", "join"] },
];

export function LinkSuggestions({
  content,
  textareaRef,
  onChange,
  onLinkAdded,
}: LinkSuggestionsProps) {
  const [expanded, setExpanded] = useState(true);

  // Fetch published / draft guides to suggest linking to them
  const { data: blogs } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => getAdminBlogs(),
    staleTime: 60_000,
  });

  // Combine static targets with dynamically loaded blogs
  const allTargets = useMemo<LinkTarget[]>(() => {
    const targets = [...STATIC_TARGETS];
    if (blogs) {
      blogs.forEach((b: any) => {
        if (b.slug) {
          targets.push({
            path: `/guides/${b.slug}`,
            name: `Guide: ${b.title}`,
            keywords: b.title
              .toLowerCase()
              .split(/\s+/)
              .filter((w: string) => w.length > 3),
          });
        }
      });
    }
    return targets;
  }, [blogs]);

  // Find suggestions: targets whose keywords match content but are not yet linked to
  const suggestions = useMemo(() => {
    if (!content) return [];
    const lowerContent = content.toLowerCase();

    // Check what is already linked
    // We search for `(/path)` or `(https://cityqlo.com/path)`
    const linkedPaths = new Set<string>();
    const linkRe = /\[[^\]]+\]\(([^)]+)\)/g;
    let m;
    while ((m = linkRe.exec(content)) !== null) {
      try {
        let path = m[1];
        if (path.startsWith("http")) {
          const urlObj = new URL(path);
          if (urlObj.hostname === "cityqlo.com" || urlObj.hostname === "localhost") {
            path = urlObj.pathname;
          }
        }
        linkedPaths.add(path);
      } catch (e) {
        // ignore invalid urls
      }
    }

    return allTargets
      .filter((t) => !linkedPaths.has(t.path))
      .map((t) => {
        // Find which keyword matched and where
        const matchedKeyword = t.keywords.find((kw) => {
          const regex = new RegExp(`\\b${kw}\\b`, "i");
          return regex.test(lowerContent);
        });

        if (matchedKeyword) {
          return {
            ...t,
            matchedKeyword,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<LinkTarget & { matchedKeyword: string }>;
  }, [content, allTargets]);

  const handleInsertLink = (target: LinkTarget) => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = el.value;

    const selectedText = value.slice(start, end).trim();
    // Default text is either the selected text, the target name, or the keyword
    const linkText = selectedText || target.name.replace(/^(Guide|Project):\s*/, "");

    const before = value.slice(0, start);
    const after = value.slice(end);
    const linkMarkdown = `[${linkText}](${target.path})`;

    const newValue = before + linkMarkdown + after;
    onChange(newValue);

    // Notify parent
    onLinkAdded?.();

    // Select the link text so they can change it if they want
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(before.length + 1, before.length + 1 + linkText.length);
    }, 50);
  };

  return (
    <div className="portal-card" style={{ padding: "1.25rem" }}>
      <button
        type="button"
        id="link-suggestions-toggle"
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
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--portal-text-muted)",
          }}
        >
          <LinkIcon size={12} /> Link Suggestions
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {suggestions.length > 0 && (
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--portal-accent)",
                background: "var(--portal-accent-dim)",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {suggestions.length}
            </span>
          )}
          <span style={{ color: "var(--portal-text-muted)" }}>
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </span>
      </button>

      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {suggestions.length === 0 ? (
            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--portal-text-muted)",
                fontStyle: "italic",
              }}
            >
              No unmatched internal link suggestions found.
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                maxHeight: "220px",
                overflowY: "auto",
                paddingRight: "4px",
              }}
            >
              {suggestions.map((s) => (
                <div
                  key={s.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    background: "var(--portal-surface-2)",
                    gap: "8px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--portal-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={s.name}
                    >
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.62rem",
                        color: "var(--portal-text-muted)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {s.path} · matched "{s.matchedKeyword}"
                    </div>
                  </div>
                  <button
                    onClick={() => handleInsertLink(s)}
                    className="portal-btn-secondary"
                    title="Insert internal link"
                    style={{
                      padding: "4px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--portal-border)",
                      background: "transparent",
                      color: "var(--portal-text)",
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
