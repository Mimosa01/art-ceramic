import { useCallback, useState } from "react";

/** Копирование в буфер с краткой индикацией «скопировано». */
export function useCopyFeedback(resetMs = 1600) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t) return;
      try {
        await navigator.clipboard.writeText(t);
        setCopied(true);
        window.setTimeout(() => setCopied(false), resetMs);
      } catch {
        // ignore
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
