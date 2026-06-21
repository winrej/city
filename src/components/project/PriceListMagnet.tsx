import { useEffect, useState } from "react";
import { X, FileText, Printer, Download, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Unit {
  name: string;
  area_sqm: number;
  starting_price: number;
}

interface PriceListMagnetProps {
  open: boolean;
  onClose: () => void;
  project: {
    name: string;
    developer?: string;
    city?: string;
    location?: string;
    status?: string;
    turnover?: string;
    fullAddress?: string;
  };
  units: Unit[];
  priceRange?: string;
  /** Reuses the page's lead handler so submissions land in the same pipeline. */
  onLeadSubmit: (data: {
    name: string;
    mobile: string;
    email: string;
    interest: string;
  }) => Promise<void>;
  /** Optional CTA after the sheet is revealed. */
  onTalkToAdvisor?: () => void;
}

function formatPHP(n: number): string {
  if (!n || Number.isNaN(n)) return "—";
  return "₱" + Math.round(n).toLocaleString("en-PH");
}

export function PriceListMagnet({
  open,
  onClose,
  project,
  units,
  priceRange,
  onLeadSubmit,
  onTalkToAdvisor,
}: PriceListMagnetProps) {
  const [stage, setStage] = useState<"form" | "sheet">("form");
  const [form, setForm] = useState({ name: "", mobile: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  // Reset to the gate each time the modal is opened fresh.
  useEffect(() => {
    if (open) {
      setStage("form");
      setForm({ name: "", mobile: "", email: "" });
    }
  }, [open]);

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const generatedOn = new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error("Please enter your name and mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      await onLeadSubmit({
        name: form.name,
        mobile: form.mobile,
        email: form.email,
        interest: "Price List & Computation",
      });
      setStage("sheet");
      toast.success("Price list unlocked", {
        description: "We've also noted your request — an advisor may follow up.",
      });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-[0_24px_80px_-16px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-ink/60 transition-colors hover:bg-ink/10 hover:text-ink"
        >
          <X size={18} />
        </button>

        {/* ─────────── STAGE 1: GATE ─────────── */}
        {stage === "form" && (
          <div className="p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <FileText className="text-primary" size={22} />
            </div>
            <h2 className="mt-5 text-[22px] font-bold tracking-tight text-ink">
              Get the {project.name} price list
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              See the official starting prices and a sample computation — generated instantly.
              Enter your details and it opens right here, ready to print or save as PDF.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Juan dela Cruz"
                    className="w-full rounded-xl border border-border px-4 py-3 text-[14px] outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    Mobile / Viber *
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full rounded-xl border border-border px-4 py-3 text-[14px] outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email (optional — we'll send a copy)
                </label>
                <input
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="juan@email.com"
                  className="w-full rounded-xl border border-border px-4 py-3 text-[14px] outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[15px] font-bold text-white transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Download size={17} /> Unlock the price list
                  </>
                )}
              </button>
              <p className="text-center text-[11.5px] text-muted-foreground">
                Free · No obligation · We'll only message you about {project.name}.
              </p>
            </form>
          </div>
        )}

        {/* ─────────── STAGE 2: GENERATED SHEET ─────────── */}
        {stage === "sheet" && (
          <div>
            <div className="flex items-center gap-2 border-b border-border/60 bg-emerald-50 px-6 py-3 text-[13px] font-semibold text-emerald-700">
              <CheckCircle2 size={16} /> Your price list is ready — print or save it as a PDF.
            </div>

            <div className="print-sheet p-8 md:p-10">
              {/* Sheet header */}
              <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    Indicative Price List &amp; Sample Computation
                  </p>
                  <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-ink">
                    {project.name}
                  </h1>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {[project.developer, project.location || project.city]
                      .filter(Boolean)
                      .join(" · ")}
                    {project.status ? ` · ${project.status}` : ""}
                    {project.turnover ? ` · Turnover ${project.turnover}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-extrabold tracking-tight text-ink">CityQlo</p>
                  <p className="text-[11px] text-muted-foreground">As of {generatedOn}</p>
                </div>
              </div>

              {/* Units table */}
              <table className="mt-6 w-full border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-ink/15">
                    <th className="py-2.5 pr-3 font-bold text-ink">Unit type</th>
                    <th className="py-2.5 pr-3 font-bold text-ink">Floor area</th>
                    <th className="py-2.5 text-right font-bold text-ink">Starting price</th>
                  </tr>
                </thead>
                <tbody>
                  {units.length > 0 ? (
                    units.map((u) => (
                      <tr key={u.name} className="border-b border-border/50">
                        <td className="py-2.5 pr-3 font-semibold text-ink">{u.name}</td>
                        <td className="py-2.5 pr-3 text-muted-foreground">
                          {u.area_sqm ? `${u.area_sqm} sqm` : "—"}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-ink">
                          {formatPHP(u.starting_price)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-3 text-muted-foreground">
                        Unit pricing available on request.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {priceRange && (
                <p className="mt-3 text-[13px] text-muted-foreground">
                  <strong className="text-ink">Price range:</strong> {priceRange}
                </p>
              )}

              {/* Sample computation framework */}
              <div className="mt-6 rounded-xl border border-border/60 bg-surface/50 p-5">
                <p className="text-[12px] font-bold uppercase tracking-wider text-ink">
                  How the payment works
                </p>
                <ul className="mt-3 space-y-1.5 text-[13px] text-muted-foreground">
                  <li>
                    <strong className="text-ink">Reservation fee</strong> locks your unit and price.
                  </li>
                  <li>
                    <strong className="text-ink">Down payment</strong> is spread across the payment
                    term (no large lump sum).
                  </li>
                  <li>
                    <strong className="text-ink">Balance</strong> is settled via bank financing,
                    Pag-IBIG, in-house financing, or spot cash.
                  </li>
                </ul>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  A personalized computation for your chosen unit and term is prepared by your
                  CityQlo advisor.
                </p>
              </div>

              {/* Disclaimer */}
              <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground/80">
                Prices are indicative as of {generatedOn} and are subject to change without prior
                notice based on the developer's current price list and promos. This document is for
                information only and does not constitute an offer or contract. Confirm final figures
                with your CityQlo advisor.
              </p>
            </div>

            {/* Actions (hidden when printing) */}
            <div className="no-print flex flex-col gap-3 border-t border-border/60 p-6 sm:flex-row">
              <button
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-[14px] font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Printer size={16} /> Print / Save as PDF
              </button>
              {onTalkToAdvisor && (
                <button
                  onClick={() => {
                    onClose();
                    onTalkToAdvisor();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border py-3.5 text-[14px] font-bold text-ink transition-colors hover:bg-surface"
                >
                  Talk to an advisor
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
