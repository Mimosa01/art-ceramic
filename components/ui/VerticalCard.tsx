"use client";

import Image from "next/image";
import { useCallback } from "react";
import { GalleryItemRow } from "@/types/gallery";
import { useModalStore } from "@/store/modalStore";

export type VerticalCardProps = {
  item: GalleryItemRow;
  variant?: "default" | "fullscreen";
  /** Подставляется в модалку «Стиль / идея» (если не задан — собирается из item) */
  modalStyleHint?: string;
};

export function VerticalCard({
  item,
  variant = "default",
  modalStyleHint: hintProp,
}: VerticalCardProps) {
  const isFullscreen = variant === "fullscreen";
  const openModal = useModalStore((s) => s.openModal);
  const src = item.image_url?.trim();

  const defaultHint = (() => {
    const desc = item.description?.trim();
    if (!desc) return item.title;
    const max = 120;
    const short =
      desc.length > max ? `${desc.slice(0, max).trimEnd()}…` : desc;
    return `${item.title} — ${short}`;
  })();

  const styleHint = hintProp ?? defaultHint;

  const handleOrder = useCallback(() => {
    openModal({
      styleHint,
      referenceImageUrl: src && src.length > 0 ? src : null,
    });
  }, [openModal, styleHint, src]);

  return (
    <div
      className={`relative ${
        isFullscreen ? "h-full w-full" : "aspect-square"
      } overflow-hidden group`}
    >
      {src ? (
        <Image
          src={src}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, min(40vw, 480px)"
          loading="lazy"
        />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(145deg,#fff5f5,#fde8e8)",
          }}
          aria-hidden
        />
      )}

      <div
        className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent ${
          isFullscreen ? "flex flex-col justify-end p-6" : "p-4"
        }`}
      >
        <h3 className="text-lg font-medium text-white">{item.title}</h3>
        {item.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-white/80">
            {item.description}
          </p>
        ) : null}

        {isFullscreen ? (
          <button
            type="button"
            onClick={handleOrder}
            className="mt-4 self-start rounded-full bg-white/90 px-6 py-3 font-medium text-red-deep transition hover:bg-white"
          >
            Хочу такую же
          </button>
        ) : null}
      </div>
    </div>
  );
}
