import clsx from 'clsx';
import { STEPS, TAGS } from '@/data/about';
import Image from 'next/image';
import RevealSection from '../ui/RevealSection';

export default function About() {
  return (
    <RevealSection
      id="about"
      className={clsx(
        'relative overflow-hidden py-28 px-6 md:px-16',
        'bg-[linear-gradient(135deg,var(--red-deep)_0%,#6b0a13_100%)]',
        'before:pointer-events-none before:absolute before:-top-[200px] before:-right-[150px] before:size-[600px] before:rounded-full before:border before:border-white/6',
        'after:pointer-events-none after:absolute after:-bottom-[150px] after:-left-[100px] after:size-[400px] after:rounded-full after:border after:border-white/4',
      )}
    >
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        {/* Avatar / portrait placeholder */}
        <div>
          <div className="relative w-full">
            <div className="relative aspect-1/1.5 w-full overflow-hidden rounded-[25px] border border-white/10 bg-linear-to-br from-crimson-900 to-crimson-950">
              <Image src="/images/iza.webp" alt="Изабелла" className="h-full w-full object-cover" width={500} height={500} />
            </div>

            {/* Corner accent */}
            <div className="border-(--red-accent) absolute -bottom-4 -right-4 h-20 w-20 rounded-br-[25px] border-r-2 border-b-2" />
            <div className="border-(--red-accent) absolute -top-4 -left-4 h-20 w-20 rounded-tl-[25px] border-l-2 border-t-2" />
          </div>
        </div>

        {/* Text */}
        <div className="text-white">
          <p className="section-label text-[0.7rem] uppercase tracking-[.3em] text-(--red-light)">
            О художнице
          </p>
          <h2 className="mt-4 font-cormorant-garamond text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.1] text-white">
            Изабелла.
            <br />
            <em className="leading-[1.1] text-(--red-light)">Волшебство на керамике.</em>
          </h2>
          <div className="mt-8 space-y-5 text-[0.95rem] font-light leading-relaxed text-white/82">
            <p>Я — художник, создающий волшебство на керамике.</p>
            <p>
              Мой путь в искусстве соткан из красок и линий: расписанные стены, десятки холстов, сотни
              живых зарисовок. Но именно керамика стала тем пространством, где ремесло превращается в
              дыхание, а форма — в историю. В росписи посуды я нахожу тишину и глубину, в которых
              рождается настоящее.
            </p>
            <p>
              Меня вдохновляют мои корни. Память земли, тепло солнца, древние узоры, передающиеся
              сквозь поколения. В моих работах звучат армянские традиционные мотивы — тонкие
              орнаменты, символы силы и света, переплетения судьбы и времени.
            </p>
            <p>
              Каждое изделие — это не просто предмет быта, а прикосновение к культуре, к истоку, к
              дому.
              <br />
              Это диалог прошлого и настоящего, рассказанный языком цвета, линии и огня.
            </p>
            <p>
              Я буду рада, если мои работы откликнутся в вашем сердце, если вы сумеете увидеть красоту
              в мелочах, создающих настроение и пробуждающих ценность к искусству и культуре.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-8 flex flex-wrap gap-3">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-[25px] border border-red-mid px-3 py-1.5 text-[.75rem] font-light tracking-widest text-cream uppercase"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Process */}
          <div className="mt-12 space-y-6">
            <p className="section-label text-(--red-light)">Как я работаю</p>
            <ul className="mt-4 grid grid-cols-1 gap-5">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  data-n={s.n}
                  className={clsx(
                    'relative pl-10',
                    'before:absolute before:left-0 before:top-0 before:font-cormorant-garamond before:text-[3rem] before:font-light before:leading-none before:text-red-mid before:content-[attr(data-n)]',
                  )}
                >
                  {s.n !== '3' ? (
                    <div
                      className="bg-linear-to-b absolute top-14 left-[0.9rem] w-px from-[rgba(193,14,30,0.3)] to-transparent h-[calc(100%-3rem)]"
                      aria-hidden
                    />
                  ) : null}
                  <div className="pl-2">
                    <div className="mb-1 text-sm font-medium tracking-wide text-cream">{s.title}</div>
                    <div className="text-sm font-light text-white/72">{s.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
