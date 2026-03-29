"use client";

import { GalleryItemFormModal } from "@/components/admin/GalleryItemFormModal";
import { useAdminGallery } from "@/components/admin/hooks/useAdminGallery";
import { useAdminGallerySheet } from "@/components/admin/hooks/useAdminGallerySheet";
import { formatGalleryPriceRub } from "@/lib/galleryAdmin";
import type { GalleryItemRow } from "@/types/gallery";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function AdminGalleryPage() {
  const {
    state,
    saving,
    mutationError,
    refetch,
    createItem,
    updateItem,
    removeItem,
  } = useAdminGallery();

  const sheet = useAdminGallerySheet(
    state.status === "ready" ? state.items : [],
    { saving, createItem, updateItem },
  );

  async function onDelete(id: number) {
    if (!window.confirm("Удалить работу из галереи?")) return;
    await removeItem(id);
  }

  if (state.status === "loading") {
    return (
      <div className="px-4 py-10 md:px-8">
        <p className="section-label text-(--red-mid)">Загрузка галереи…</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="max-w-xl px-4 py-10 md:px-8">
        <h1 className="mb-3 font-cormorant-garamond text-2xl text-(--red-deep)">
          Галерея
        </h1>
        <p className="text-sm text-red-700" role="alert">
          {state.message}
        </p>
        <p className="mt-4 text-sm text-(--red-dark)/75">
          Нужны политики RLS для чтения и изменения{" "}
          <code className="rounded bg-black/5 px-1">gallery_items</code> у роли{" "}
          <code className="rounded bg-black/5 px-1">authenticated</code>.
        </p>
      </div>
    );
  }

  const { items } = state;

  return (
    <div className="px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-cormorant-garamond text-2xl text-(--red-deep) md:text-3xl">
            Галерея
          </h1>
          <p className="mt-1 text-sm text-(--red-dark)/70">
            {items.length === 0
              ? "Пока нет работ."
              : `Работ: ${items.length}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => void refetch()}
            className="min-h-11 px-4"
          >
            Обновить
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={sheet.openCreate}
            className="min-h-11 px-5"
          >
            + Добавить
          </Button>
        </div>
      </header>

      {mutationError ? (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {mutationError}
        </p>
      ) : null}

      <ul className="flex flex-col gap-4">
        {items.map((row) => (
          <GalleryCard
            key={row.id}
            row={row}
            onEdit={() => sheet.openEdit(row)}
            onDelete={() => void onDelete(row.id)}
          />
        ))}
      </ul>

      {sheet.sheetOpen ? <GalleryItemFormModal sheet={sheet} /> : null}
    </div>
  );
}

function GalleryCard({
  row,
  onEdit,
  onDelete,
}: {
  row: GalleryItemRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="overflow-hidden rounded-2xl border border-red-deep/12 bg-white/80 shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden bg-cream sm:aspect-square sm:w-36">
          <Image
            src={row.image_url}
            alt={row.title}
            fill
            className="object-cover"
            sizes="(min-width: 640px) 144px, 100vw"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide ${
                row.is_active
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-neutral-200 text-neutral-700"
              }`}
            >
              {row.is_active ? "На сайте" : "Скрыта"}
            </span>
            <span className="text-sm font-medium text-red-deep">
              {formatGalleryPriceRub(row.price)}
            </span>
          </div>
          <h2 className="font-cormorant-garamond text-lg leading-snug text-red-deep">
            {row.title}
          </h2>
          {row.description ? (
            <p className="line-clamp-3 text-sm text-red-dark/80">
              {row.description}
            </p>
          ) : null}
          <p className="text-[0.7rem] text-red-deep/45">
            Порядок: {row.sort_order} · id {row.id}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="outline"
              type="button"
              className="min-h-10 flex-1 px-4 sm:flex-none"
              onClick={onEdit}
            >
              Изменить
            </Button>
            <button
              type="button"
              className="min-h-10 rounded-md border border-red-200 px-4 text-sm text-red-700 hover:bg-red-50"
              onClick={onDelete}
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
