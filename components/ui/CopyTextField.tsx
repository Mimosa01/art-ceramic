"use client";

import { useCopyFeedback } from "@/hooks/useCopyFeedback";
import { Clipboard, Check } from "lucide-react";

type CopyTextFieldProps = {
  text: string;
  copyLabel: string;
};

export default function CopyTextField({ text, copyLabel }: CopyTextFieldProps) {
  const { copied, copy } = useCopyFeedback();

  if (!text.trim()) {
    return <span className="text-(--red-deep)/45">—</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 max-w-[min(100%,220px)]">
      <button
        type="button"
        onClick={() => void copy(text)}
        className="shrink-0 rounded-md border border-(--red-deep)/20 bg-white px-2 py-1 text-[0.65rem] uppercase tracking-wide text-(--red-mid) hover:bg-(--cream) active:scale-[0.98]"
        aria-label={copyLabel}
      >
        {copied ? <Check /> : <Clipboard />}
      </button>
      <span className="min-w-0 break-all text-(--red-deep)/90">{text}</span>
    </span>
  );
}
