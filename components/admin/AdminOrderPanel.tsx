"use client";

import Button from "@/components/ui/Button";
import { useAdminOrders } from "@/components/admin/hooks/useAdminOrders";
import {
  ORDER_STATUS_OPTIONS,
  type OrderRow,
  type OrderStatus,
} from "@/types/order";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function OrderCard({
  row,
  updatingId,
  onStatusChange,
}: {
  row: OrderRow;
  updatingId: number | null;
  onStatusChange: (id: number, status: OrderStatus) => void;
}) {
  const busy = updatingId === row.id;

  return (
    <article
      className="rounded-xl border border-(--red-deep)/12 bg-white/70 p-4 text-sm text-(--red-deep)"
      data-order-id={row.id}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-(--red-deep)/10 pb-3">
        <div>
          <p className="font-semibold">{row.customer_name}</p>
          <p className="mt-0.5 text-(--red-dark)/80">
            <a href={`tel:${row.customer_phone}`} className="underline-offset-2 hover:underline">
              {row.customer_phone}
            </a>
            {row.customer_telegram ? (
              <span className="ml-2 text-(--red-mid)">@{row.customer_telegram.replace(/^@/, "")}</span>
            ) : null}
          </p>
        </div>
        <span className="rounded-md bg-(--red-deep)/6 px-2 py-0.5 text-xs tabular-nums text-(--red-dark)/90">
          № {row.id}
        </span>
      </div>

      {row.customer_comment ? (
        <p className="mt-3 text-(--red-dark)/85">
          <span className="text-(--red-mid)">Комментарий: </span>
          {row.customer_comment}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-xs">
          <span className="text-(--red-mid)">Статус</span>
          <select
            className="rounded-lg border border-(--red-deep)/20 bg-white px-2 py-1.5 text-(--red-deep) disabled:opacity-50"
            value={row.status}
            disabled={busy}
            onChange={(e) => {
              onStatusChange(row.id, e.target.value as OrderStatus);
            }}
          >
            {ORDER_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-(--red-dark)/70">
          {row.price != null ? `${row.price.toLocaleString("ru-RU")} ₽` : "Цена не указана"}
        </span>
      </div>

      {row.design_preview_url ? (
        <p className="mt-2 text-xs">
          <a
            href={row.design_preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--red-mid) underline-offset-2 hover:underline"
          >
            Открыть макет
          </a>
        </p>
      ) : null}

      <p className="mt-3 text-[0.65rem] text-(--red-dark)/55">
        Создано: {formatDate(row.created_at)}
        {row.updated_at !== row.created_at ? ` · обновлено: ${formatDate(row.updated_at)}` : null}
      </p>
    </article>
  );
}

export default function AdminOrderPanel() {
  const { state, updatingId, mutationError, refetch, setOrderStatus } =
    useAdminOrders();

  if (state.status === "loading") {
    return (
      <p className="text-sm text-(--red-dark)/70" role="status">
        Загрузка заявок…
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-900">
        <p>{state.message}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-3 min-h-10"
          onClick={() => void refetch()}
        >
          Повторить
        </Button>
      </div>
    );
  }

  const rows = state.rows;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-(--red-dark)/75">
          Всего: <span className="font-medium text-(--red-deep)">{rows.length}</span>
        </p>
        <Button
          type="button"
          variant="outline"
          className="min-h-10 text-sm"
          onClick={() => void refetch()}
        >
          Обновить
        </Button>
      </div>

      {mutationError ? (
        <p className="text-sm text-red-700" role="alert">
          {mutationError}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="rounded-xl border border-(--red-deep)/12 bg-white/50 px-4 py-8 text-center text-sm text-(--red-dark)/70">
          Пока нет заявок.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.id}>
              <OrderCard
                row={row}
                updatingId={updatingId}
                onStatusChange={setOrderStatus}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
