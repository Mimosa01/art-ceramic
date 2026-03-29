export default function OrderFormSuccess() {
  return (
    <div id="formSuccess" className="py-12 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-crimson-600">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ff9da3"
          strokeWidth="1.5"
          aria-hidden
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="section-title text-[1.75rem] text-white">
        Заявка отправлена!
      </p>
      <p className="mt-3 text-sm font-light text-white/78">
        Анна свяжется с вами в ближайшее время через Telegram.
      </p>
    </div>
  );
}
