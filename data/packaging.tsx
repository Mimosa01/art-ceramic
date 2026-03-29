import type { ReactNode } from "react";

export type PackagingFeature = {
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export const packagingFeatures: PackagingFeature[] = [
  {
    label: "Внутри коробки",
    title: "Мягкий наполнитель и атласная лента",
    description:
      "Кружка уложена в наполнитель - не смещается при доставке. Лента завязана бантом: достаточно снять её, чтобы почувствовать, что это подарок.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--red-mid)"
        strokeWidth="1.2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  {
    label: "По желанию",
    title: "Авторская открытка с вашим текстом",
    description:
      "Если кружка в подарок - напишите пожелание, вложу открытку с вашими словами. Просто скажите об этом при заказе.",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--red-mid)"
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
