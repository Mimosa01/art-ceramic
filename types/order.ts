/**
 * Модель таблицы `orders` (заказы).
 * Соответствует схеме в `база.md`.
 *
 * Supabase: Postgres `bigint` в JSON часто приходит как number;
 * при очень больших id можно заменить `id` на `string`.
 */

/** Допустимые значения `orders.status` */
export type OrderStatus = "new" | "in_progress" | "done" | "cancelled";

/** Подписи статусов в админке */
export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Выполнена" },
  { value: "cancelled", label: "Отменена" },
];

/** Строка из БД (ответ `.select()`) */
export type OrderRow = {
  id: number;
  customer_name: string;
  customer_phone: string;
  /** Username Telegram; в БД может быть `NULL` */
  customer_telegram: string | null;
  /** Комментарий клиента */
  customer_comment: string | null;
  /** Ссылка на макет (PNG) из редактора */
  design_preview_url: string | null;
  status: OrderStatus;
  /** Итоговая стоимость; заполняет мастер, до этого `NULL` */
  price: number | null;
  /** ISO-8601 от PostgREST */
  created_at: string;
  /** ISO-8601 от PostgREST */
  updated_at: string;
};

/** Поля для `.insert()` — без авто-полей */
export type OrderInsert = {
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string | null;
  customer_comment?: string | null;
  design_preview_url?: string | null;
  /** Обычно задаётся дефолтом в БД (`new`) */
  status?: OrderStatus;
  price?: number | null;
};

/** Поля для `.update()` */
export type OrderUpdate = Partial<
  Omit<OrderRow, "id" | "created_at">
>;

/** Имя таблицы в Supabase */
export const ORDERS_TABLE = "orders" as const;

/** Алиас для использования в UI */
export type Order = OrderRow;
