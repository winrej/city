import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { getPublicTestimonials } from "../../lib/api/admin.functions";

export function Testimonials() {
  const {
    data: testimonials,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public_testimonials"],
    queryFn: () => getPublicTestimonials(),
    retry: false,
    // Don't let errors bubble up and crash the page
    throwOnError: false,
  });

  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Silently hide section if loading, error, or no data
  if (isLoading || isError || safeTestimonials.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? safeTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === safeTestimonials.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="testimonials"
      className="relative w-full py-20 md:py-28 overflow-hidden bg-zinc-50 border-t border-zinc-200/50"
    >
      {/* Decorative Gold Accent Bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[oklch(0.74_0.137_79)]" />

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="eyebrow tracking-[0.2em] uppercase text-xs text-[oklch(0.74_0.137_79)] font-semibold block mb-3">
            Client Experiences
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-zinc-900 tracking-tight leading-tight">
            Trusted by Professionals & Investors
          </h2>
          <div className="gold-rule mx-auto mt-6 w-12 h-[1px] bg-zinc-300" />
        </div>

        {/* Carousel / Slider Container */}
        <div className="relative">
          {/* Controls */}
          {safeTestimonials.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 z-20 flex justify-between pointer-events-none hidden md:flex">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-12 h-12 rounded-full border border-zinc-200 bg-white/95 text-zinc-800 hover:text-[oklch(0.434_0.094_251)] hover:border-zinc-400 flex items-center justify-center pointer-events-auto transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-12 h-12 rounded-full border border-zinc-200 bg-white/95 text-zinc-800 hover:text-[oklch(0.434_0.094_251)] hover:border-zinc-400 flex items-center justify-center pointer-events-auto transition-all shadow-sm active:scale-95"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* Cards Frame */}
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Sliding Rail */}
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              {safeTestimonials.map((t) => (
                <div key={t.id} className="w-full flex-shrink-0 px-2 md:px-4">
                  <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-zinc-100 p-8 md:p-12 shadow-xl shadow-zinc-100/50 relative overflow-hidden">
                    {/* Watermark Quote Icon */}
                    <div className="absolute right-8 top-6 text-zinc-100/80 pointer-events-none">
                      <Quote size={80} strokeWidth={1} />
                    </div>

                    {/* Ratings Star View */}
                    {t.rating && (
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < t.rating ? "oklch(0.74 0.137 79)" : "transparent"}
                            stroke={i < t.rating ? "oklch(0.74 0.137 79)" : "#d4d4d8"}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    )}

                    {/* Testimonial Text */}
                    <blockquote className="text-zinc-700 font-light text-lg md:text-xl leading-relaxed font-sans mb-8 relative z-10">
                      "{t.message}"
                    </blockquote>

                    {/* Client Metadata / Profile info */}
                    <div className="flex items-center gap-4 relative z-10">
                      {t.image_url ? (
                        <img
                          src={t.image_url}
                          alt={t.name}
                          loading="lazy"
                          className="w-14 h-14 rounded-full object-cover border-2 border-[oklch(0.74_0.137_79)/30]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-zinc-100 border-2 border-zinc-200/50 flex items-center justify-center text-zinc-500 font-medium text-lg font-serif">
                          {t.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <cite className="not-italic font-serif text-base font-medium text-zinc-900 block">
                          {t.name}
                        </cite>
                        {t.role && (
                          <span className="text-xs text-zinc-400 tracking-wider uppercase font-semibold">
                            {t.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicators/Dots controls at the bottom */}
        {safeTestimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {safeTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[oklch(0.434_0.094_251)]"
                    : "w-2.5 bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
