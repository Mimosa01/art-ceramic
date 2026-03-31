import type { OrderInsert, OrderRow } from "@/types/order";
import { createClient } from "@supabase/supabase-js";
import { sendLeadPushToAll } from "@/lib/push";
import { NextResponse } from "next/server";

type SubmitOrderBody = {
  customer_name?: string;
  customer_phone?: string;
  customer_telegram?: string | null;
  customer_comment?: string | null;
  design_preview_url?: string | null;
};

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

function trimOrNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const t = value.trim();
  return t === "" ? null : t;
}

function toOrderInsert(input: SubmitOrderBody): OrderInsert | null {
  const customer_name = input.customer_name?.trim();
  const customer_phone = input.customer_phone?.trim();

  if (!customer_name || !customer_phone) return null;

  return {
    customer_name,
    customer_phone,
    customer_telegram: trimOrNull(input.customer_telegram),
    customer_comment: trimOrNull(input.customer_comment),
    design_preview_url: trimOrNull(input.design_preview_url) ?? "",
    status: "new",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitOrderBody;
    const payload = toOrderInsert(body);

    if (!payload) {
      return NextResponse.json(
        { ok: false, message: "Некорректные данные заявки." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select("*")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    const order = (data ?? null) as OrderRow | null;

    if (order) {
      // Пуш-ошибки не должны ломать создание заявки.
      try {
        const stats = await sendLeadPushToAll({
          id: order.id,
          name: order.customer_name,
          contact: order.customer_phone,
          service: null,
        });
        console.log("[push] order notification stats:", stats);
      } catch (e) {
        console.error("[push] Failed to send order notification:", e);
      }
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
