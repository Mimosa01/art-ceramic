import type { GalleryItemRow } from "@/types/gallery";

export function formatGalleryPriceRub(value: number | null): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export type GalleryFormState = {
  image_url: string;
  title: string;
  description: string;
  price: string;
  sort_order: string;
  is_active: boolean;
};

export function emptyGalleryForm(sortOrder: number): GalleryFormState {
  return {
    image_url: "",
    title: "",
    description: "",
    price: "",
    sort_order: String(sortOrder),
    is_active: true,
  };
}

export function galleryRowToForm(row: GalleryItemRow): GalleryFormState {
  return {
    image_url: row.image_url,
    title: row.title,
    description: row.description ?? "",
    price: row.price != null ? String(row.price) : "",
    sort_order: String(row.sort_order),
    is_active: row.is_active,
  };
}

type ValidatedFields = {
  title: string;
  descriptionTrim: string;
  price: number | null;
  sort_order: number;
};

export function validateGalleryForm(
  form: GalleryFormState,
):
  | { ok: true; fields: ValidatedFields }
  | { ok: false; error: string } {
  const title = form.title.trim();
  if (!title) {
    return { ok: false, error: "Укажите название." };
  }
  const priceRaw = form.price.trim();
  let price: number | null;
  if (priceRaw === "") {
    price = null;
  } else {
    const p = Number.parseInt(priceRaw, 10);
    if (Number.isNaN(p) || p < 0) {
      return { ok: false, error: "Цена — целое число рублей или пусто." };
    }
    price = p;
  }
  const sort_order = Number.parseInt(form.sort_order, 10);
  if (Number.isNaN(sort_order)) {
    return { ok: false, error: "Порядок — целое число." };
  }
  return {
    ok: true,
    fields: {
      title,
      descriptionTrim: form.description.trim(),
      price,
      sort_order,
    },
  };
}
