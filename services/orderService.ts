import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  ORDERS_TABLE,
  type OrderRow,
  type OrderStatus,
} from "@/types/order";

export type OrderServiceError = { message: string };

export type OrderQueryResult<T> = {
  data: T;
  error: PostgrestError | OrderServiceError | null;
};

const table = ORDERS_TABLE;

function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  return t === "" ? null : t;
}

/**
 * Отправка заказа с лендинга через серверный API:
 * insert в `orders` + попытка отправки push на сервере.
 */
export async function submitOrderFromForm(input: {
  customer_name: string;
  customer_phone: string;
  customer_telegram?: string | null;
  customer_comment?: string | null;
  design_preview_url?: string | null;
}): Promise<OrderQueryResult<OrderRow | null>> {
  const response = await fetch("/api/orders/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_name: input.customer_name.trim(),
      customer_phone: input.customer_phone.trim(),
      customer_telegram: trimOrNull(input.customer_telegram),
      customer_comment: trimOrNull(input.customer_comment),
      design_preview_url: trimOrNull(input.design_preview_url),
    }),
  });

  const result = (await response.json()) as {
    ok: boolean;
    message?: string;
    order?: OrderRow | null;
  };

  if (!response.ok || !result.ok) {
    return {
      data: null,
      error: { message: result.message ?? "Не удалось отправить заявку." },
    };
  }

  return { data: result.order ?? null, error: null };
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
