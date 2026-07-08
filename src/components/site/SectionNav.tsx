import { useEffect, useRef, useState } from "react";
import { ChevronDown, ListTree, X, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };
export type TocGroup = { label: string; items: TocItem[] };

/* ------------------------------------------------------------------ */
/* Hooks                                                              */
/* ------------------------------------------------------------------ */

/**
 * Returns the id of the section currently in view (scrollspy). SSR-safe.
 * rootMargin biases toward the section near the top of the viewport so the
 * "active" item matches what the reader is actually looking at.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const next = ids.find((id) => visible.has(id));
        if (next) setActive(next);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}

/** Reading progress (0–100) through the element with the given id. SSR-safe. */
function useReadingProgress(contentId: string): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(contentId);
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Distance scrolled through the element vs. its total scrollable length.
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(rect.top <= 0 ? 100 : 0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(Math.round((scrolled / total) * 100));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [contentId]);

  return progress;
}

/** Which group index contains a given section id. */
function groupIndexOf(groups: TocGroup[], id: string): number {
  return groups.findIndex((g) => g.items.some((i) => i.id === id));
}

/* ------------------------------------------------------------------ */
/* Desktop / tablet: in-flow sticky sidebar (lives in a grid column)  */
/* ------------------------------------------------------------------ */

export function DocSidebar({ groups, contentId }: { groups: TocGroup[]; contentId: string }) {
  const ids = groups.flatMap((g) => g.items.map((i) => i.id));
  const active = useActiveSection(ids);
  const progress = useReadingProgress(contentId);

  // Collapsible state — all open by default; the active group is force-opened.
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(groups.map((_, i) => [i, true])),
  );

  // Auto-expand the group that contains the active section.
  const activeGroup = groupIndexOf(groups, active);
  useEffect(() => {
    if (activeGroup < 0) return;
    setOpenGroups((prev) => (prev[activeGroup] ? prev : { ...prev, [activeGroup]: true }));
  }, [activeGroup]);

  return (
    <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto pb-8">
      {/* Reading progress */}
      <div className="mb-5 h-[3px] w-full overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <nav aria-label="On this page">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-4">
          {groups.map((group, gi) => {
            const open = openGroups[gi] ?? true;
            const groupId = `toc-group-${gi}`;
            return (
              <li key={group.label}>
                <button
                  type="button"
                  onClick={() => setOpenGroups((p) => ({ ...p, [gi]: !open }))}
                  aria-expanded={open}
                  aria-controls={groupId}
                  className="group flex w-full items-center justify-between gap-2 rounded-md py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform duration-300",
                      open ? "rotate-180" : "",
                    )}
                  />
                </button>
                <ul
                  id={groupId}
                  className={cn(
                    "mt-1 overflow-hidden transition-all duration-300",
                    open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {group.items.map((t) => {
                    const isActive = t.id === active;
                    return (
                      <li key={t.id}>
                        <a
                          href={`#${t.id}`}
                          aria-current={isActive ? "location" : undefined}
                          className={cn(
                            "block border-l-2 py-1.5 pl-3 text-[14px] leading-snug transition-all duration-200",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
                            isActive
                              ? "border-primary bg-primary/[0.05] font-medium text-primary"
                              : "border-transparent text-muted-foreground hover:border-hairline hover:text-ink",
                          )}
                        >
                          {t.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile (< md): sticky trigger bar + bottom sheet                   */
/* ------------------------------------------------------------------ */

export function MobileTocBar({ groups }: { groups: TocGroup[] }) {
  const items = groups.flatMap((g) => g.items);
  const ids = items.map((i) => i.id);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);

  const activeIndex = Math.max(
    0,
    items.findIndex((i) => i.id === active),
  );
  const activeLabel = items[activeIndex]?.label ?? items[0]?.label ?? "";

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Esc to close + focus management + scroll lock.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the sheet.
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Sticky trigger bar (below the fixed main nav) */}
      <div className="sticky top-14 z-40 px-4 pt-3">
        <div className="container-prose !px-0">
          <button
            type="button"
            ref={triggerRef}
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-left text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{
              background: "oklch(0.21 0.012 252 / 0.96)",
              border: "1px solid oklch(1 0 0 / 0.08)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "0 12px 36px -8px oklch(0.21 0.012 252 / 0.5)",
            }}
          >
            <ListTree className="h-4 w-4 shrink-0 text-primary" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                On this page
              </span>
              <span className="truncate text-[13px] font-medium">{activeLabel}</span>
            </span>
            <span className="font-mono text-[11px] text-white/40">
              {String(activeIndex + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Table of contents"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="animate-in fade-in absolute inset-0 bg-black/50 backdrop-blur-sm duration-200"
          />
          {/* Panel */}
          <div
            ref={sheetRef}
            className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-hairline bg-white/95 px-5 py-4 backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                On this page
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav aria-label="On this page" className="px-3 py-3">
              {groups.map((group) => (
                <div key={group.label} className="mb-3 last:mb-0">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
                    {group.label}
                  </p>
                  <ul>
                    {group.items.map((t) => {
                      const isActive = t.id === active;
                      return (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            onClick={() => setOpen(false)}
                            aria-current={isActive ? "location" : undefined}
                            className={cn(
                              "block rounded-xl px-3 py-2.5 text-[14.5px] transition-colors",
                              isActive
                                ? "bg-primary/[0.06] font-medium text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-ink",
                            )}
                          >
                            {t.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="border-t border-hairline px-3 py-3">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-muted-foreground hover:bg-secondary hover:text-ink"
              >
                <ArrowUp className="h-4 w-4" /> Back to top
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
