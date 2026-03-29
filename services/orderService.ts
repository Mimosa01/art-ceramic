import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  ORDERS_TABLE,
  type OrderInsert,
  type OrderRow,
  type OrderStatus,
} from "@/types/order";

export type OrderQueryResult<T> = {
  data: T;
  error: PostgrestError | null;
};

const table = ORDERS_TABLE;

function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  return t === "" ? null : t;
}

/** Колонка `design_preview_url` в БД может быть NOT NULL — пустое значение как `''`. */
function designPreviewForInsert(value: string | null | undefined): string {
  return trimOrNull(value) ?? "";
}

function toOrderInsert(input: {
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string | null;
  customer_comment?: string | null;
  design_preview_url?: string | null;
}): OrderInsert {
  return {
    customer_name: input.customer_name.trim(),
    customer_phone: input.customer_phone.trim(),
    customer_telegram: trimOrNull(input.customer_telegram),
    customer_comment: trimOrNull(input.customer_comment),
    design_preview_url: designPreviewForInsert(input.design_preview_url),
    status: "new",
  };
}

async function insertOrder(
  payload: OrderInsert,
): Promise<OrderQueryResult<OrderRow | null>> {
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select("*")
    .maybeSingle();

  return { data: data ?? null, error };
}

/**
 * Отправка заказа с лендинга (RLS: `INSERT` для `anon` на `orders`).
 */
export async function submitOrderFromForm(input: {
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string | null;
  customer_comment?: string | null;
  design_preview_url?: string | null;
}): Promise<OrderQueryResult<OrderRow | null>> {
  return insertOrder(toOrderInsert(input));
}

/** Список заявок для админки (RLS: доступ у `authenticated`). */
export async function fetchOrdersForAdmin(): Promise<
  OrderQueryResult<OrderRow[]>
> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  return { data: data ?? [], error };
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
): Promise<OrderQueryResult<OrderRow | null>> {
  const { data, error } = await supabase
    .from(table)
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  return { data: data ?? null, error };
}
