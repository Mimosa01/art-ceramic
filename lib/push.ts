import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

type PushSubscriptionRow = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

type LeadPayload = {
  id?: number;
  name: string;
  contact: string;
  service?: string | null;
};

export type PushSendReason =
  | "ok"
  | "no_subscriptions"
  | "vapid_not_configured"
  | "supabase_not_configured"
  | "subscriptions_read_failed"
  | "webpush_send_failed";

export type PushSendStats = {
  total: number;
  sent: number;
  failed: number;
  expiredRemoved: number;
  reason: PushSendReason;
  errorCode?: number;
  errorMessage?: string;
};

let vapidConfigured = false;

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
    throw new Error("supabase_not_configured");
  }

  const urlRef = getProjectRefFromUrl(url);
  const serviceRef = serviceRoleKey
    ? getProjectRefFromJwt(serviceRoleKey)
    : null;

  const key =
    serviceRoleKey && urlRef && serviceRef === urlRef ? serviceRoleKey : anonKey;

  return createClient(url, key, { auth: { persistSession: false } });
}

function ensureWebPushConfigured() {
  if (vapidConfigured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT ?? "mailto:no-reply@example.com";

  if (!publicKey || !privateKey) {
    throw new Error("vapid_not_configured");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
}

function getErrorMeta(err: unknown): { code?: number; message: string } {
  if (err instanceof Error) {
    const maybeStatus =
      typeof err === "object" &&
      err !== null &&
      "statusCode" in err &&
      typeof (err as { statusCode?: number }).statusCode === "number"
        ? (err as { statusCode: number }).statusCode
        : undefined;
    return { code: maybeStatus, message: err.message };
  }
  return { message: "Unexpected push error." };
}

export async function sendLeadPushToAll(lead: LeadPayload): Promise<PushSendStats> {
  try {
    ensureWebPushConfigured();
  } catch (error) {
    const meta = getErrorMeta(error);
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expiredRemoved: 0,
      reason: "vapid_not_configured",
      errorCode: meta.code,
      errorMessage: meta.message,
    };
  }

  let supabase: ReturnType<typeof getSupabaseServerClient> | null = null;
  try {
    supabase = getSupabaseServerClient();
  } catch (error) {
    const meta = getErrorMeta(error);
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expiredRemoved: 0,
      reason: "supabase_not_configured",
      errorCode: meta.code,
      errorMessage: meta.message,
    };
  }
  if (!supabase) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expiredRemoved: 0,
      reason: "supabase_not_configured",
      errorMessage: "Supabase client is not initialized.",
    };
  }

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expiredRemoved: 0,
      reason: "subscriptions_read_failed",
      errorMessage: error.message,
    };
  }

  const subscriptions = (data ?? []) as PushSubscriptionRow[];
  if (subscriptions.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
      expiredRemoved: 0,
      reason: "no_subscriptions",
    };
  }

  const payload = JSON.stringify({
    title: "Новая заявка",
    body: `${lead.name} · ${lead.contact}${lead.service ? ` · ${lead.service}` : ""}`,
    url: "/admin",
  });

  let expiredRemoved = 0;
  let firstFailedCode: number | undefined;
  let firstFailedMessage: string | undefined;

  const results = await Promise.allSettled(
    subscriptions.map(async (row) => {
      const subscription = {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      };

      try {
        await webpush.sendNotification(subscription, payload);
      } catch (err) {
        const statusCode =
          typeof err === "object" &&
          err !== null &&
          "statusCode" in err &&
          typeof (err as { statusCode?: number }).statusCode === "number"
            ? (err as { statusCode: number }).statusCode
            : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", row.endpoint);
          expiredRemoved += 1;
        }
        if (firstFailedCode == null && statusCode != null) {
          firstFailedCode = statusCode;
        }
        if (!firstFailedMessage) {
          firstFailedMessage =
            err instanceof Error ? err.message : "webpush_send_failed";
        }
        throw err;
      }
    }),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;
  return {
    total: results.length,
    sent,
    failed,
    expiredRemoved,
    reason: failed > 0 ? "webpush_send_failed" : "ok",
    errorCode: firstFailedCode,
    errorMessage: firstFailedMessage,
  };
}
