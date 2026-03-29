import { useLayoutEffect, useState } from "react";

/**
 * Совпадение с `window.matchMedia`. На SSR / первом тике — `false`, затем актуальное значение.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Соответствует брейкпоинту Tailwind `md` (768px). */
export function useIsMdUp() {
  return useMediaQuery("(min-width: 768px)");
}
