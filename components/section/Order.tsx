import Form from "@/components/ui/form/Form";
import RevealSection from "@/components/ui/RevealSection";

export default function Order() {
  return (
    <RevealSection
      id="order"
      className="relative overflow-hidden bg-[linear-gradient(135deg,var(--red-deep)_0%,#6b0a13_100%)] px-6 py-28 md:px-16"
    >
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[.07]" />
      <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-16 md:grid-cols-2">
        {/* Left info */}
        <div className="text-white">
          <p className="section-label text-(--red-light)">Оставить заявку</p>
          <h3 className="mt-4 font-cormorant-garamond text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] text-white">
            Давайте создадим
            <br />
            <em className="text-[#ffb8bc]">вашу кружку</em>
          </h3>
          <p className="mt-6 text-[.95rem] font-light leading-relaxed text-white/78">
            Заполните форму — и я свяжусь с вами в Telegram, чтобы обсудить все
            детали: идею, размер, цвета и дизайн.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[25px] border border-(--red-mid)">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9da3"
                  strokeWidth="1.5"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.94 19.79 19.79 0 01.12 1.36 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#ffb8bc] uppercase">
                  Telegram / WhatsApp
                </p>
                <p className="mt-1 text-sm font-light text-white/78">
                  Быстро отвечу и обсудим детали
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[25px] border border-(--red-mid)">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9da3"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#ffb8bc] uppercase">
                  Срок изготовления
                </p>
                <p className="mt-1 text-sm font-light text-white/78">
                  От 5 до 14 дней в зависимости от сложности
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[25px] border border-(--red-mid)">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff9da3"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-xs tracking-widest text-[#ffb8bc] uppercase">
                  Доставка
                </p>
                <p className="mt-1 text-sm font-light text-white/78">
                  По всей России, самовывоз из Москвы
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <Form />
      </div>
    </RevealSection>
  );
}
