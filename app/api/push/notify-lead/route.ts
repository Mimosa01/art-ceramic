import { NextResponse } from "next/server";
import { sendLeadPushToAll } from "@/lib/push";

type NotifyLeadBody = {
  lead?: {
    id?: number;
    name?: string;
    contact?: string;
    service?: string | null;
  };
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NotifyLeadBody;
    const lead = body.lead;

    if (!lead?.name || !lead?.contact) {
      return NextResponse.json(
        { ok: false, message: "Lead payload is invalid." },
        { status: 400 },
      );
    }

    const stats = await sendLeadPushToAll({
      id: lead.id,
      name: lead.name,
      contact: lead.contact,
      service: lead.service ?? null,
    });

    const pushOk = stats.reason === "ok" || stats.reason === "no_subscriptions";
    return NextResponse.json({
      ok: pushOk,
      stats,
      message: pushOk ? undefined : stats.errorMessage ?? "Не удалось отправить push.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
