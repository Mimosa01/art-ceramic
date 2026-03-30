import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { GalleryItemRow } from "@/types/gallery";
import { VerticalCard } from "./VerticalCard";


const sectionNavLinkClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/85 shadow-sm backdrop-blur-md transition hover:border-white/25 hover:bg-black/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export type TikTokGalleryProps = {
  items: GalleryItemRow[];
  /** Классы корневого блока (высота/фон). По умолчанию — на весь экран. */
  rootClassName?: string;
  /** Якорь секции выше блока галереи (ссылка «вверх»). */
  sectionNavPrevHref?: string;
  /** Якорь секции ниже (ссылка «вниз»). */
  sectionNavNextHref?: string;
};

export function TikTokGallery({
  items,
  rootClassName = "relative min-h-0 h-mobile-vp w-full bg-red-deep",
  sectionNavPrevHref = "#about",
  sectionNavNextHref = "#care",
}: TikTokGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: "y",
      align: "start",
      dragFree: false,
      containScroll: "trimSnaps",
      /** Иначе ResizeObserver + сдвиг vh/dvh при UI браузера → reInit → дёрганье карусели */
      watchResize: false,
    },
    [
      AutoScroll({
        playOnInit: false,
        stopOnInteraction: true,
      }),
    ],
  );

  const [snapCount, setSnapCount] = useState(0);
  const [scrollUi, setScrollUi] = useState({ index: 0, withinSlidePct: 0 });

  /**
   * Индикаторы: scrollProgress() — доля по *общему* ходу Embla, не по номеру слайда.
   * scrollSnapList()[i] — значение progress у i-го снапа; между снапами линейно интерполируем.
   */
  const updateFromEmbla = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const n = snaps.length;
    setSnapCount((prev) => (prev === n ? prev : n));

    if (n === 0) {
      setScrollUi({ index: 0, withinSlidePct: 0 });
      return;
    }
    if (n === 1) {
      setScrollUi({ index: 0, withinSlidePct: 100 });
      return;
    }

    const p = emblaApi.scrollProgress();

    // Индекс «текущего» слайда: на нём растёт полоска до следующего снапа
    let index = 0;
    for (let j = 0; j < n; j++) {
      if (p + 1e-9 >= snaps[j]) index = j;
    }

    let withinSlidePct = 100;
    if (index < n - 1) {
      const start = snaps[index];
      const end = snaps[index + 1];
      const span = end - start;
      withinSlidePct =
        span > 1e-6
          ? Math.max(0, Math.min(100, ((p - start) / span) * 100))
          : 100;
    }

    setScrollUi((prev) => {
      if (
        prev.index === index &&
        Math.abs(prev.withinSlidePct - withinSlidePct) < 0.75
      ) {
        return prev;
      }
      return { index, withinSlidePct };
    });
  }, [emblaApi]);

  const scrollRafRef = useRef(0);
  const scheduleScrollUi = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      updateFromEmbla();
    });
  }, [updateFromEmbla]);

  useEffect(() => {
    if (!emblaApi) return;
    updateFromEmbla();
    emblaApi.on("reInit", updateFromEmbla);
    emblaApi.on("select", updateFromEmbla);
    emblaApi.on("scroll", scheduleScrollUi);
    return () => {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = 0;
      emblaApi.off("reInit", updateFromEmbla);
      emblaApi.off("select", updateFromEmbla);
      emblaApi.off("scroll", scheduleScrollUi);
    };
  }, [emblaApi, items.length, updateFromEmbla, scheduleScrollUi]);

  /** После поворота экрана пересчёт нужен; обычный resize от chrome не трогаем (watchResize: false). */
  useEffect(() => {
    if (!emblaApi) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    const onOrient = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        emblaApi.reInit();
        updateFromEmbla();
      }, 200);
    };
    window.addEventListener("orientationchange", onOrient);
    return () => {
      window.removeEventListener("orientationchange", onOrient);
      clearTimeout(t);
    };
  }, [emblaApi, updateFromEmbla]);

  if (items.length === 0) return null;

  const railCount = snapCount > 0 ? snapCount : items.length;

  return (
    <div className={rootClassName}>
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full flex-col">
          {items.map((item) => (
            <div
              className="relative min-h-0 flex-[0_0_100%]"
              key={item.id}
            >
              <VerticalCard item={item} variant="fullscreen" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-2 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1">
        {Array.from({ length: railCount }, (_, i) => (
          <div
            key={i}
            className="h-8 w-1 overflow-hidden rounded-full bg-red-mid/30"
          >
            <div
              className="w-full bg-red-mid/90 transition-opacity duration-200"
              style={{
                height:
                  i < scrollUi.index
                    ? "100%"
                    : i === scrollUi.index
                      ? `${scrollUi.withinSlidePct}%`
                      : "0%",
                opacity: i === scrollUi.index ? 1 : 0.5,
              }}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end">
        <nav
          className="pointer-events-auto flex flex-col gap-2 pr-2"
          aria-label="Навигация по странице"
        >
          <a
            href={sectionNavPrevHref}
            className={sectionNavLinkClass}
            aria-label="К разделу выше"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </a>
          <a
            href={sectionNavNextHref}
            className={sectionNavLinkClass}
            aria-label="К разделу ниже"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  );
}
