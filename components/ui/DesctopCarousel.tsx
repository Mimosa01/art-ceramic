import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { GalleryItemRow } from "@/types/gallery";
import { DesctopCard } from "./DesctopCard";

interface DesktopCarouselProps {
  items: GalleryItemRow[];
}

export function DesktopCarousel({ items }: DesktopCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  /** Длина = числу реальных позиций прокрутки Embla (часто < items.length при trimSnaps + несколько слайдов в окне) */
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setScrollSnaps(emblaApi.scrollSnapList());
    };
    update();
    emblaApi.on("reInit", update);
    emblaApi.on("select", update);
    return () => {
      emblaApi.off("reInit", update);
      emblaApi.off("select", update);
    };
  }, [emblaApi, items.length]);

  const navBtnClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-dark bg-red-dark text-white shadow-md transition hover:bg-red-mid hover:scale-105 disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 py-2">
          {items.map((item) => (
            <div className="min-w-0 flex-[0_0_33%]" key={item.id}>
              <DesctopCard item={item} variant="desktop" />
            </div>
          ))}
        </div>
      </div>

      {/* Навигация: назад — точки — вперёд */}
      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={navBtnClass}
          aria-label="Предыдущий слайд"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          className="flex min-h-8 max-w-[min(100%,28rem)] flex-wrap items-center justify-center gap-2 px-1"
          aria-label="Слайды галереи"
        >
          {scrollSnaps.map((_, index) => (
            <button
              type="button"
              key={index}
              className={`h-2 rounded-full transition-all hover:scale-125 ${
                selectedIndex === index
                  ? "w-6 bg-red-dark"
                  : "w-2 bg-[#e8d4d4] hover:bg-red-mid"
              }`}
              aria-label={`Перейти к позиции ${index + 1} из ${scrollSnaps.length}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={navBtnClass}
          aria-label="Следующий слайд"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
            aria-hidden
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}