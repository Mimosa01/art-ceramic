import { createBrowserClient } from "@supabase/ssr";
import type {
  GalleryItemInsert,
  GalleryItemRow,
  GalleryItemUpdate,
} from "../types/gallery";
import type {
  OrderInsert,
  OrderRow,
  OrderUpdate,
} from "../types/order";

/**
 * Схема БД для типобезопасных запросов.
 * Дополняйте по мере появления таблиц (или сгенерируйте через Supabase CLI).
 */
export type Database = {
  public: {
    Tables: {
      gallery_items: {
        Row: GalleryItemRow;
        Insert: GalleryItemInsert;
        Update: GalleryItemUpdate;
        Relationships: [];
      };
      orders: {
        Row: OrderRow;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Supabase: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local",
  );
}

/**
 * Браузерный клиент с сессией в cookies (совместим с `proxy.ts` / `createServerClient`).
 * Обычный `createClient` держит сессию в localStorage — сервер после логина «не видит» пользователя.
 */
export const supabase = createBrowserClient<Database>(url, anonKey);
