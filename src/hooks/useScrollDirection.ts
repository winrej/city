import { useState, useEffect, useRef } from "react";

export function useScrollDirection(threshold = 80) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cache initial state
    setIsScrolledPast(window.scrollY > threshold);
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold
      setIsScrolledPast(currentScrollY > threshold);

      // Determine scroll direction with a buffer to prevent jitter
      const diff = currentScrollY - lastScrollY.current;
      if (Math.abs(diff) > 5) {
        if (diff > 0) {
          setScrollDirection("down");
        } else {
          setScrollDirection("up");
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrollDirection, isScrolledPast };
}
