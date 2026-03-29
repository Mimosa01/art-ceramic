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

function ensureWebPushConfigured() {
  if (vapidConfigured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT ?? "mailto:no-reply@example.com";

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured.");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
}

export async function sendLeadPushToAll(lead: LeadPayload) {
  ensureWebPushConfigured();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth");

  if (error) {
    throw new Error(error.message);
  }

  const subscriptions = (data ?? []) as PushSubscriptionRow[];
  if (subscriptions.length === 0) {
    return { total: 0, sent: 0, failed: 0 };
  }

  const payload = JSON.stringify({
    title: "Новая заявка",
    body: `${lead.name} · ${lead.contact}${lead.service ? ` · ${lead.service}` : ""}`,
    url: "/admin",
  });

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
        }
      }
    }),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;
  return { total: results.length, sent, failed };
}
