import type {
  GalleryItemInsert,
  GalleryItemRow,
  GalleryItemUpdate,
} from "@/types/gallery";
import {
  emptyGalleryForm,
  galleryRowToForm,
  validateGalleryForm,
  type GalleryFormState,
} from "@/lib/galleryAdmin";
import { uploadGalleryImage } from "@/services/galleryStorage";
import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useImageFilePreview } from "./useImageFilePreview";

type Mutations = {
  saving: boolean;
  createItem: (payload: GalleryItemInsert) => Promise<boolean>;
  updateItem: (id: number, payload: GalleryItemUpdate) => Promise<boolean>;
};

export function useAdminGallerySheet(items: GalleryItemRow[], m: Mutations) {
  const { saving, createItem, updateItem } = m;
  const image = useImageFilePreview();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<GalleryFormState>(() => emptyGalleryForm(0));
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const nextSortOrder = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => i.sort_order)) + 1;
  }, [items]);

  const openCreate = useCallback(() => {
    image.clear();
    setEditingId(null);
    setForm(emptyGalleryForm(nextSortOrder));
    setFormError(null);
    setSheetOpen(true);
  }, [image, nextSortOrder]);

  const openEdit = useCallback(
    (row: GalleryItemRow) => {
      image.clear();
      setEditingId(row.id);
      setForm(galleryRowToForm(row));
      setFormError(null);
      setSheetOpen(true);
    },
    [image],
  );

  const closeSheet = useCallback(() => {
    image.clear();
    setUploading(false);
    setSheetOpen(false);
    setEditingId(null);
    setFormError(null);
  }, [image]);

  const onImageFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormError(null);
      image.onFileChange(e);
    },
    [image],
  );

  const onSubmitForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFormError(null);

      const parsed = validateGalleryForm(form);
      if (!parsed.ok) {
        setFormError(parsed.error);
        return;
      }
      const { title, descriptionTrim, price, sort_order } = parsed.fields;

      let image_url = "";

      if (editingId == null) {
        if (!image.file) {
          setFormError("Загрузите изображение.");
          return;
        }
        setUploading(true);
        const up = await uploadGalleryImage(image.file);
        setUploading(false);
        if ("error" in up) {
          setFormError(up.error);
          return;
        }
        image_url = up.publicUrl;
      } else if (image.file) {
        setUploading(true);
        const up = await uploadGalleryImage(image.file);
        setUploading(false);
        if ("error" in up) {
          setFormError(up.error);
          return;
        }
        image_url = up.publicUrl;
      } else {
        image_url = form.image_url.trim();
      }

      if (!image_url) {
        setFormError(
          "Нужно изображение: загрузите файл или укажите ссылку ниже.",
        );
        return;
      }

      if (editingId == null) {
        const ok = await createItem({
          image_url,
          title,
          description: descriptionTrim || null,
          price,
          sort_order,
          is_active: form.is_active,
        });
        if (ok) closeSheet();
      } else {
        const ok = await updateItem(editingId, {
          image_url,
          title,
          description: descriptionTrim,
          price,
          sort_order,
          is_active: form.is_active,
        });
        if (ok) closeSheet();
      }
    },
    [closeSheet, createItem, editingId, form, image, updateItem],
  );

  return {
    sheetOpen,
    editingId,
    form,
    setForm,
    formError,
    uploading,
    saving,
    busy: saving || uploading,
    openCreate,
    openEdit,
    closeSheet,
    onSubmitForm,
    filePreviewUrl: image.previewUrl,
    onImageFileChange,
  };
}

export type AdminGallerySheetApi = ReturnType<typeof useAdminGallerySheet>;
