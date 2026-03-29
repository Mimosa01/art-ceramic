import type { PostgrestError } from "@supabase/supabase-js";
import {
  GALLERY_ITEMS_TABLE,
  type GalleryItemInsert,
  type GalleryItemRow,
  type GalleryItemUpdate,
} from "../types/gallery";
import { supabase } from "@/lib/supabase";

export type GalleryQueryResult<T> = {
  data: T;
  error: PostgrestError | null;
};

const table = GALLERY_ITEMS_TABLE;

/**
 * Активные работы для публичной галереи.
 * Сортировка: `sort_order` по возрастанию, затем свежие `created_at`.
 *
 * Если строки в таблице есть, а ответ пустой:
 * - в строках должно быть `is_active = true`;
 * - в Supabase включён RLS — нужна политика `SELECT` для роли `anon`, например:
 *   `CREATE POLICY "gallery_public_read" ON gallery_items FOR SELECT TO anon USING (is_active = true);`
 */
export async function fetchActiveGalleryItems(): Promise<
  GalleryQueryResult<GalleryItemRow[]>
> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as GalleryItemRow[];

  if (process.env.NODE_ENV === "development" && !error && rows.length === 0) {
    console.info(
      "[gallery] Ответ пустой. Проверьте: 1) is_active = true 2) RLS: SELECT для anon на gallery_items",
    );
  }

  return { data: rows, error };
}

/**
 * Одна работа по id (в т.ч. неактивная — зависит от RLS).
 */
export async function fetchGalleryItemById(
  id: number,
): Promise<GalleryQueryResult<GalleryItemRow | null>> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { data: (data ?? null) as GalleryItemRow | null, error };
}

/**
 * Все записи таблицы (для админки; на фронте обычно нужна политика RLS под роль).
 */
export async function fetchAllGalleryItems(): Promise<
  GalleryQueryResult<GalleryItemRow[]>
> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return { data: (data ?? []) as GalleryItemRow[], error };
}

/**
 * Создать элемент галереи.
 */
export async function createGalleryItem(
  payload: GalleryItemInsert,
): Promise<GalleryQueryResult<GalleryItemRow | null>> {
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();

  return { data: (data ?? null) as GalleryItemRow | null, error };
}

/**
 * Обновить элемент по id.
 */
export async function updateGalleryItem(
  id: number,
  payload: GalleryItemUpdate,
): Promise<GalleryQueryResult<GalleryItemRow | null>> {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  return { data: (data ?? null) as GalleryItemRow | null, error };
}

/**
 * Мягкое скрытие с витрины (без удаления строки).
 */
export async function deactivateGalleryItem(
  id: number,
): Promise<GalleryQueryResult<GalleryItemRow | null>> {
  return updateGalleryItem(id, { is_active: false });
}

/**
 * Полное удаление строки (нужны права в RLS).
 */
export async function deleteGalleryItem(
  id: number,
): Promise<GalleryQueryResult<null>> {
  const { error } = await supabase.from(table).delete().eq("id", id);

  return { data: null, error };
}
