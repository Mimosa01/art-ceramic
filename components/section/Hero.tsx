import clsx from "clsx";
import Button from "../ui/Button";
import RevealSection from "../ui/RevealSection";

export default function Hero() {
  return (
    <RevealSection
      className={clsx(
        "relative flex min-h-mobile-vp flex-col justify-center overflow-hidden px-6 pt-24 pb-20 md:min-h-screen md:px-16 md:pt-24 md:pb-20",
        "bg-[url('/images/hero.webp')] bg-cover bg-center bg-no-repeat",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-[rgba(51,2,6,0.6)] to-[rgba(233,191,195,0.162)]"
        aria-hidden
      />

      <div className="relative z-10 max-w-2xl">
        <p
          className={clsx(
            "mb-8 font-jost text-[0.85rem] font-light uppercase tracking-[0.2em] text-warm-white",
            "fade-up",
          )}
        >
          Авторская роспись · Глазурь · Ручная работа
        </p>
        <h1
          className={clsx(
            "font-cormorant-garamond text-[clamp(3rem,9vw,6rem)] font-light leading-[.95] tracking-[-0.01em] text-warm-white",
            "[&_em]:italic [&_em]:text-red-light",
            "fade-up delay-1",
          )}
        >
          Кружки,
          <br />
          в которые
          <br />
          <em>влюбляются</em>
        </h1>
        <p
          className={clsx(
            "mt-8 max-w-sm font-jost text-[0.95rem] font-light leading-relaxed text-warm-white",
            "fade-up delay-2",
          )}
        >
          Каждая кружка — маленькая картина. Роспись глазурью, обжиг, характер. Создаём вместе то, что останется с вами навсегда.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-5 fade-up delay-3">
          <Button variant="primary">
            Заказать кружку
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
          <Button variant="outline" className="text-warm-white!">
            Посмотреть работы
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
