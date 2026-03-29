import Button from "../Button";

export default function PackagingCta() {
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-8 border-t border-[#f5dede] pt-10 md:flex-row">
      <div>
        <p className="section-label">Готово к вручению</p>
        <p className="mt-2 font-cormorant-garamond text-[clamp(1.3rem,2.5vw,1.75rem)] leading-tight text-(--red-deep)">
          Получаете и сразу можно дарить -
          <br />
          <em className="text-(--red-mid)">без лишних хлопот с упаковкой</em>
        </p>
      </div>
      <Button href="#order" variant="primary">
        Заказать кружку
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </Button>
    </div>
  );
}
