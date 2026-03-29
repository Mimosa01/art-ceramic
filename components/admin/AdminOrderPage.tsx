"use client";

import Image from "next/image";
import CopyTextField from "../ui/CopyTextField";
import { useAdminOrders } from "./hooks/useAdminOrders";
import OrderStatusSelect from "./OrderStatusSelect";
import { formatOrderDateRu, formatOrderPriceRub, formatTelegramHandle } from "@/lib/orderDisplay";

export default function AdminOrdersPage() {
  const {
    state,
    updatingId,
    mutationError,
    refetch,
    setOrderStatus,
  } = useAdminOrders();

  if (state.status === "loading") {
    return (
      <div className="px-4 py-10 md:px-8">
        <p className="section-label text-(--red-mid)">Загрузка заявок…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="px-4 py-10 md:px-8 max-w-2xl">
        <h1 className="font-cormorant-garamond text-2xl text-(--red-deep) mb-3">
          Заявки
        </h1>
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
        <p className="mt-4 text-sm text-(--red-dark)/75">
          Проверьте политики RLS в Supabase: для авторизованных пользователей нужен
          доступ на чтение таблицы{" "}
          <code className="rounded bg-black/5 px-1">orders</code>.
        </p>
      </div>
    );
  }

  const { rows } = state;

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-cormorant-garamond text-2xl md:text-3xl text-(--red-deep)">
            Заявки
          </h1>
          <p className="mt-1 text-sm text-(--red-dark)/70">
            {rows.length === 0 ? "Пока нет заявок." : `Всего: ${rows.length}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="self-start rounded-md border border-(--red-deep)/20 bg-white px-3 py-2 text-sm text-(--red-mid) hover:bg-(--cream)"
        >
          Обновить список
        </button>
      </div>

      {mutationError ? (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {mutationError}
        </p>
      ) : null}

      <div className="-mx-4 overflow-x-auto md:mx-0 md:rounded-xl md:border md:border-(--red-deep)/12 md:bg-white/60">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-(--red-deep)/12 bg-(--cream)/80 text-[0.7rem] uppercase tracking-wide text-(--red-deep)/70">
              <th className="px-3 py-3 font-medium">Имя</th>
              <th className="px-3 py-3 font-medium min-w-[200px]">Телефон</th>
              <th className="px-3 py-3 font-medium min-w-[200px]">Telegram</th>
              <th className="px-3 py-3 font-medium min-w-[240px]">Комментарий</th>
              <th className="px-3 py-3 font-medium min-w-[100px]">Макет</th>
              <th className="px-3 py-3 font-medium">Статус</th>
              <th className="px-3 py-3 font-medium">Цена</th>
              <th className="px-3 py-3 font-medium whitespace-nowrap">Создано</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-(--red-deep)/8 align-middle hover:bg-white/40"
              >
                <td className="px-3 py-3 text-(--red-deep)">{row.customer_name}</td>
                <td className="px-3 py-3">
                  <CopyTextField text={row.customer_phone} copyLabel="Скопировать телефон" />
                </td>
                <td className="px-3 py-3">
                  <CopyTextField
                    text={formatTelegramHandle(row.customer_telegram)}
                    copyLabel="Скопировать Telegram"
                  />
                </td>
                <td className="px-3 py-3 text-(--red-dark)/85 max-w-[320px]">
                  <span className="line-clamp-4 whitespace-pre-wrap wrap-break-word">
                    {row.customer_comment?.trim() || "—"}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {row.design_preview_url ? (
                    <a
                      href={row.design_preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-col gap-1 text-(--red-mid) underline underline-offset-2 hover:text-(--red-deep)"
                    >
                      <Image
                        src={row.design_preview_url}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-md object-cover border border-(--red-deep)/10"
                      />
                      <span className="text-[0.7rem]">Открыть</span>
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-3">
                  <OrderStatusSelect
                    value={String(row.status)}
                    disabled={updatingId === row.id}
                    onChange={(next) => void setOrderStatus(row.id, next)}
                  />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {formatOrderPriceRub(row.price)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-(--red-dark)/80 text-[0.8rem]">
                  {formatOrderDateRu(row.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
