/** Форматирование дат заказов для админки */
export function formatOrderDateRu(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatOrderPriceRub(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Для отображения и копирования: `@username` из поля БД */
export function formatTelegramHandle(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";
  return `@${raw.replace(/^@+/, "").trim()}`;
}
