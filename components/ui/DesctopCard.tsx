import { useCallback, type KeyboardEvent } from "react";
import Image from "next/image";
import { formatGalleryPriceRub } from "@/lib/galleryAdmin";
import { useModalStore } from "@/store/modalStore";
import { GalleryItemRow } from "@/types/gallery";

export type DesctopCardProps = {
  item: GalleryItemRow;
  variant?: "default" | "desktop" | "fullscreen";
  /** Текст для поля «Стиль / идея» в модалке (по умолчанию из title + description) */
  modalStyleHint?: string;
};

/** Текст в поле «Стиль / идея» в модалке */
function buildModalStyleHint(item: GalleryItemRow): string {
  const desc = item.description?.trim();
  if (!desc) return item.title;
  const max = 120;
  const short =
    desc.length > max ? `${desc.slice(0, max).trimEnd()}…` : desc;
  return `${item.title} — ${short}`;
}

/** Заготовка под отдельный вид карточки на десктопе. Клик открывает модалку заказа. */
export function DesctopCard({
  item,
  variant = "default",
  modalStyleHint: hintProp,
}: DesctopCardProps) {
  const isFullscreen = variant === "fullscreen";
  const isDesktop = variant === "desktop";
  const openModal = useModalStore((s) => s.openModal);
  const src = item.image_url?.trim();

  const styleHint = hintProp ?? buildModalStyleHint(item);

  const handleOpenModal = useCallback(() => {
    openModal({
      styleHint,
      referenceImageUrl: src && src.length > 0 ? src : null,
    });
  }, [openModal, styleHint, src]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenModal();
      }
    },
    [handleOpenModal],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenModal}
      onKeyDown={handleKeyDown}
      aria-label={`Заказать: ${item.title}`}
      className={`group relative cursor-pointer overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-red-deep ${
        isFullscreen
          ? "h-full w-full"
          : isDesktop
            ? "aspect-3/4 rounded-[25px]"
            : "aspect-square rounded-[25px]"
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 90vw, min(40vw, 480px)"
          loading="lazy"
        />
      ) : (
        <div
          className="h-full w-full bg-linear-to-br from-red-dark via-red-mid to-red-deep"
          aria-hidden
        />
      )}

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-linear-to-t from-red-mid/22 via-red-deep/8 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          isFullscreen ? "opacity-100" : ""
        }`}
      >
        <h3 className="text-lg font-medium text-white">{item.title}</h3>
        {item.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-white/80">
            {item.description}
          </p>
        ) : null}
        {item.price != null ? (
          <p className="mt-2 text-sm bg-warm-white px-2 py-1 w-fit rounded-full font-semibold text-red-deep tabular-nums">
            от {formatGalleryPriceRub(item.price)}
          </p>
        ) : null}

        {isFullscreen ? (
          <span
            className="mt-4 inline-flex self-start rounded-full bg-white/90 px-6 py-3 text-center font-medium text-red-deep transition-colors hover:bg-white pointer-events-none"
            aria-hidden
          >
            Хочу такую же
          </span>
        ) : null}
      </div>
    </div>
  );
}
