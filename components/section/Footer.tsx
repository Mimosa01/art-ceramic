import Logo from "@/components/ui/Logo";

function externalLinkAttrs(url: string | undefined) {
  const href = url?.trim() || "#";
  const isExternal = /^https?:\/\//i.test(href);
  return {
    href,
    ...(isExternal
      ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
      : {}),
  };
}

export default function Footer() {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  return (
    <footer className="px-6 py-4 md:py-1 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <Logo />

        <p className="section-label text-[.65rem] tracking-widest text-red-light/45">
          © {new Date().getFullYear()} · Авторские кружки · Роспись глазурью
        </p>

        <nav aria-label="Соцсети" className="flex items-center gap-6">
          <a
            className="section-label text-white/30 transition-colors hover:text-red-light"
            {...externalLinkAttrs(telegramUrl)}
          >
            Telegram
          </a>
          <a
            className="section-label text-white/30 transition-colors hover:text-red-light"
            {...externalLinkAttrs(instagramUrl)}
          >
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  );
}
