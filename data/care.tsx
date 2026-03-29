import type { ReactNode } from "react";

export type IncludedItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type CareRule = {
  number: string;
  title: string;
  description: string;
};

export const includedItems: IncludedItem[] = [
  {
    title: "Средство для ухода за глазурью",
    description:
      "Специально подобранный состав сохраняет яркость росписи и защищает глазурь от выцветания.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--red-light)"
        strokeWidth="1.2"
      >
        <path d="M9 2h6v3l2 3v11a2 2 0 01-2 2H9a2 2 0 01-2-2V8l2-3V2z" />
        <path d="M9 2h6" strokeLinecap="round" />
        <path d="M7 11h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Памятка по уходу",
    description:
      "Карточка с простыми правилами - как мыть, хранить и беречь роспись, чтобы кружка радовала годами.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--red-light)"
        strokeWidth="1.2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
];

export const rules: CareRule[] = [
  {
    number: "01",
    title: "Мойте вручную",
    description:
      "Посудомоечная машина и агрессивные средства сокращают жизнь росписи. Мягкая губка и тёплая вода - лучшее решение.",
  },
  {
    number: "02",
    title: "Не замачивайте надолго",
    description:
      "Длительный контакт с водой может повредить глазурь. Мойте сразу после использования.",
  },
  {
    number: "03",
    title: "Используйте средство из набора",
    description:
      "Раз в месяц протирайте роспись прилагаемым составом - это освежает цвета и создаёт защитный слой.",
  },
  {
    number: "04",
    title: "Не используйте в микроволновке",
    description:
      "Высокие температуры могут повредить роспись. Кружка создана для красоты и тепла - не для разогрева.",
  },
];