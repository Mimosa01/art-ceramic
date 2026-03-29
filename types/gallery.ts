/**
 * Модель таблицы `gallery_items` (галерея работ).
 * Соответствует схеме в `база.md`.
 *
 * Supabase: Postgres `bigint` в JSON часто приходит как number;
 * при очень больших id можно заменить `id` на `string`.
 */

/** Строка из БД (ответ `.select()`) */
export type GalleryItemRow = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  /** Цена в рублях; в БД может быть `NULL` */
  price: number | null;
  is_active: boolean;
  sort_order: number;
  /** ISO-8601 от PostgREST */
  created_at: string;
};

/** Поля для `.insert()` — без авто-полей */
export type GalleryItemInsert = {
  image_url: string;
  title: string;
  description?: string | null;
  price?: number | null;
  is_active?: boolean;
  sort_order?: number;
};

/** Поля для `.update()` */
export type GalleryItemUpdate = Partial<
  Omit<GalleryItemRow, "id" | "created_at">
>;

/** Имя таблицы в Supabase */
export const GALLERY_ITEMS_TABLE = "gallery_items" as const;

/** Алиас для использования в UI */
export type GalleryItem = GalleryItemRow;
