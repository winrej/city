import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// Your Facebook Page Messenger handle.
const MESSENGER_URL = "https://m.me/cityqlo";

// Show the teaser nudge after this many ms of presence (once per browser session).
const NUDGE_DELAY = 6000;
const SESSION_KEY = "cq_messenger_seen";

/** Authentic Facebook Messenger logo (gradient bubble + bolt). */
function MessengerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="cq-msgr-grad" cx="19%" cy="99%" r="116%">
          <stop offset="0" stopColor="#0099FF" />
          <stop offset="0.6" stopColor="#A033FF" />
          <stop offset="0.9" stopColor="#FF5280" />
          <stop offset="1" stopColor="#FF7061" />
        </radialGradient>
      </defs>
      <path
        fill="url(#cq-msgr-grad)"
        d="M18 0C7.95 0 0 7.36 0 17.29c0 5.19 2.17 9.69 5.7 12.79.3.26.48.63.49 1.03l.1 3.23c.03.99 1.05 1.63 1.96 1.23l3.6-1.59c.3-.13.65-.16.97-.07 1.64.45 3.39.69 5.18.69 10.05 0 18-7.36 18-17.29C36 7.36 28.05 0 18 0z"
      />
      <path
        fill="#fff"
        d="M7.19 22.56l5.29-8.39c.84-1.33 2.64-1.67 3.91-.71l4.21 3.15c.39.29.91.29 1.29-.01l5.68-4.31c.76-.58 1.75.33 1.24 1.14l-5.29 8.39c-.84 1.33-2.64 1.67-3.91.71l-4.21-3.15c-.39-.29-.91-.29-1.29.01l-5.68 4.31c-.76.58-1.75-.33-1.24-1.14z"
      />
    </svg>
  );
}

export function FloatingMessenger() {
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const isPortal = pathname.startsWith("/portal");

  // One-time attention nudge per session.
  useEffect(() => {
    if (isPortal) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const t = setTimeout(() => setNudge(true), NUDGE_DELAY);
    return () => clearTimeout(t);
  }, [isPortal]);

  // Close on Escape and on outside click.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    // Defer so the opening click doesn't immediately close it.
    const t = setTimeout(() => document.addEventListener("mousedown", onClick), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
      clearTimeout(t);
    };
  }, [open]);

  const markSeen = () => {
    setInteracted(true);
    setNudge(false);
    if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
  };

  const toggle = () => {
    markSeen();
    setOpen((v) => !v);
  };

  if (isPortal) return null;

  return (
    <div
      ref={cardRef}
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end gap-3 md:right-6",
        // Sit above the mobile BottomNav on phones; comfortable corner on desktop.
        "bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6",
      )}
    >
      {/* Expanded card */}
      <div
        className={cn(
          "w-[300px] origin-bottom-right overflow-hidden rounded-3xl border border-black/[0.06] bg-white/95 shadow-[0_20px_56px_-14px_rgba(0,0,0,0.28),0_4px_14px_-4px_rgba(0,0,0,0.10)] transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0",
        )}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          transitionTimingFunction: "var(--ease-luxe)",
        }}
        role="dialog"
        aria-label="Chat with us on Messenger"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-black/[0.05] px-5 py-4">
          <div className="relative">
            <MessengerLogo className="h-9 w-9" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#31C48D]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-ink">CityQlo</p>
            <p className="flex items-center gap-1 text-[11px] font-medium text-[#31C48D]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#31C48D]" />
              Typically replies instantly
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            Need help choosing a unit?
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">
            Message us on Messenger — we usually reply within a few minutes.
          </p>
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markSeen}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0084FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_-4px_rgba(0,132,255,0.55)] transition-all duration-300 hover:bg-[#0084FF]/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084FF] focus-visible:ring-offset-2"
          >
            <MessengerLogo className="h-5 w-5 [&_path:last-child]:fill-[#0084FF]" />
            Start a chat
          </a>
          <p className="mt-2.5 text-center text-[11px] text-ink/40">
            Free · No sign-up · Opens Messenger
          </p>
        </div>
      </div>

      {/* Teaser nudge — appears once, points to the button */}
      {nudge && !open && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="animate-sheet-up rounded-2xl rounded-br-md border border-black/[0.06] bg-white/95 px-4 py-2.5 text-left text-[13px] font-medium text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.22)]"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            👋 Need help choosing a unit?
          </button>
          <button
            type="button"
            onClick={markSeen}
            aria-label="Dismiss"
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/50 transition-colors hover:bg-ink/20"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Toggle FAB — real Messenger logo */}
      <div className="relative self-end">
        {/* Pulsing attention ring (until first interaction) */}
        {!interacted && !open && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#0084FF]/40" />
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close Messenger chat" : "Chat with us on Messenger"}
          aria-expanded={open}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_8px_28px_-6px_rgba(0,0,0,0.30),0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084FF] focus-visible:ring-offset-2"
          style={{ transitionTimingFunction: "var(--ease-luxe)" }}
        >
          {open ? (
            <X size={24} strokeWidth={2.25} className="text-ink/70" />
          ) : (
            <MessengerLogo className="h-9 w-9" />
          )}

          {/* Unread-style badge to draw the eye */}
          {!interacted && !open && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#FF3B30] text-[10px] font-bold text-white">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
