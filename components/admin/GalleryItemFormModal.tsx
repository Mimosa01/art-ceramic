"use client";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/form/FormField";
import type { AdminGallerySheetApi } from "@/components/admin/hooks/useAdminGallerySheet";

type Props = {
  sheet: AdminGallerySheetApi;
};

export function GalleryItemFormModal({ sheet }: Props) {
  const {
    editingId,
    form,
    setForm,
    formError,
    busy,
    uploading,
    saving,
    closeSheet,
    onSubmitForm,
    filePreviewUrl,
    onImageFileChange,
  } = sheet;

  const previewSrc = filePreviewUrl || form.image_url.trim();

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1px]"
        aria-label="Закрыть"
        onClick={closeSheet}
      />
      <div
        className={[
          "fixed z-50 w-full overflow-y-auto border border-red-deep/10 bg-cream shadow-[0_-8px_40px_rgba(72,4,11,0.12)]",
          "inset-x-0 top-1/2 -translate-y-1/2 max-h-[min(88dvh,680px)] rounded-t-2xl px-4 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]",
          "md:inset-auto md:left-1/2 md:top-1/2 md:bottom-auto md:max-h-[min(94vh,960px)] md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:px-8 md:pb-8 md:pt-8",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-form-title"
      >
        <div className="mb-4 flex items-center justify-between gap-3 md:mb-6">
          <h2
            id="gallery-form-title"
            className="font-cormorant-garamond text-xl text-(--red-deep) md:text-2xl"
          >
            {editingId == null ? "Новая работа" : "Редактирование"}
          </h2>
          <Button
            variant="outline"
            type="button"
            onClick={closeSheet}
          >
            Закрыть
          </Button>
        </div>

        <form
          onSubmit={(e) => void onSubmitForm(e)}
          className="space-y-4 pb-2 md:space-y-5"
        >
          <div className="space-y-2 md:space-y-3">
            <label
              htmlFor="gallery-image-file"
              className="block text-sm font-medium text-(--red-deep)/90"
            >
              Фото
            </label>
            <input
              id="gallery-image-file"
              key={editingId == null ? "create" : `edit-${editingId}`}
              type="file"
              accept="image/*"
              onChange={onImageFileChange}
              className="block w-full text-sm text-(--red-deep)/90 file:mr-3 file:rounded-md file:border-0 file:bg-(--red-deep)/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-(--red-deep)"
            />
            {previewSrc ? (
              <div className="overflow-hidden rounded-xl border border-(--red-deep)/12 bg-white/60">
                {/* blob: и произвольные URL — без next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewSrc}
                  alt=""
                  className="max-h-48 w-full object-contain md:max-h-[min(52vh,420px)]"
                />
              </div>
            ) : null}
          </div>
          {editingId != null ? (
            <details className="rounded-lg border border-(--red-deep)/10 bg-white/40 px-3 py-2">
              <summary className="cursor-pointer text-sm text-(--red-deep)/75">
                Ссылка вручную (без загрузки файла)
              </summary>
              <div className="mt-3">
                <FormField
                  label="URL изображения"
                  name="image_url"
                  placeholder="https://…"
                  textTone="dark"
                  value={form.image_url}
                  onChange={(v) => setForm((f) => ({ ...f, image_url: v }))}
                />
              </div>
            </details>
          ) : null}
          <FormField
            label="Название"
            name="title"
            required
            placeholder="Название работы"
            textTone="dark"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          />
          <FormField
            kind="textarea"
            label="Описание"
            name="description"
            rows={3}
            className="md:h-auto md:min-h-30"
            placeholder="Кратко о работе"
            textTone="dark"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          />
          <FormField
            label="Цена, ₽"
            name="price"
            placeholder="Пусто — без цены"
            inputType="number"
            textTone="dark"
            value={form.price}
            onChange={(v) => setForm((f) => ({ ...f, price: v }))}
          />
          <FormField
            label="Порядок сортировки"
            name="sort_order"
            inputType="number"
            textTone="dark"
            value={form.sort_order}
            onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))}
          />

          <label className="flex cursor-pointer items-center gap-3 py-1">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
              className="h-5 w-5 rounded border-(--red-deep)/30 text-(--red-mid) focus:ring-(--red-mid)"
            />
            <span className="text-sm text-(--red-deep)/90">
              Показывать на сайте
            </span>
          </label>

          {formError ? (
            <p className="text-sm text-red-700" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button
              variant="primary"
              type="submit"
              disabled={busy}
              aria-busy={busy}
              className="min-h-12 w-full justify-center sm:flex-1"
            >
              {uploading ? "Загрузка…" : saving ? "Сохранение…" : "Сохранить"}
            </Button>
            <Button
              variant="outline"
              type="button"
              className="min-h-12 w-full justify-center sm:flex-1"
              onClick={closeSheet}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
