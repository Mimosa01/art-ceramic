import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type UnsubscribeBody = {
  endpoint?: string;
};

function getProjectRefFromUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    return host.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

function getProjectRefFromJwt(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const payloadJson = Buffer.from(payloadPart, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson) as { ref?: string };
    return payload.ref ?? null;
  } catch {
    return null;
  }
}

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase env vars are not configured.");
  }

  const urlRef = getProjectRefFromUrl(url);
  const serviceRef = serviceRoleKey
    ? getProjectRefFromJwt(serviceRoleKey)
    : null;

  const key =
    serviceRoleKey && urlRef && serviceRef === urlRef ? serviceRoleKey : anonKey;

  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UnsubscribeBody;

    if (!body.endpoint) {
      return NextResponse.json(
        { ok: false, message: "Endpoint is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from("push_subscriptions")
      .delete()
      .eq("endpoint", body.endpoint);

    if (error) {
      return NextResponse.json(
        { ok: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}