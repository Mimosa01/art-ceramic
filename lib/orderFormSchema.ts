import { z } from "zod";

function normalizePhoneDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

function isValidRuPhone(raw: string): boolean {
  let d = normalizePhoneDigits(raw);
  if (d.length === 11 && d.startsWith("8")) d = "7" + d.slice(1);
  if (d.length === 11 && d.startsWith("7")) return true;
  if (d.length === 10 && d.startsWith("9")) return true;
  return false;
}

/**
 * Строго @username: строка начинается с @, дальше только латиница, цифры и _
 * (ник 5–32 символа, с буквы — как в Telegram).
 */
function isValidAtLatinHandle(raw: string): boolean {
  const t = raw.trim();
  return /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(t);
}

/** Телефон РФ или @username латиницей (без ссылок и без ника без @). */
export function isValidContact(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return isValidRuPhone(t) || isValidAtLatinHandle(t);
}

const nameSchema = z
  .string()
  .trim()
  .min(1, "Укажите имя")
  .max(120, "Слишком длинное имя");

const contactSchema = z
  .string()
  .trim()
  .min(1, "Укажите телефон или Telegram.")
  .refine((v) => isValidContact(v), {
    message:
      "Укажите номер РФ (+7… / 8… / 9…) или @ник латиницей (без пробелов и ссылок).",
  });

export const orderFormSchema = z.object({
  name: nameSchema,
  contact: contactSchema,
  idea: z.string().max(2000, "Слишком длинный текст"),
  style: z.string().max(500, "Слишком длинный текст"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

/** Поля модалки «Заявка на кружку» (совпадают с `ModalOrderFormInput`, кроме `design_preview_url`). */
export const modalOrderFormSchema = z.object({
  name: nameSchema,
  contact: contactSchema,
  style: z.string().max(500, "Слишком длинный текст"),
  comment: z.string().max(2000, "Слишком длинный текст"),
});

export type ModalOrderFormValues = z.infer<typeof modalOrderFormSchema>;
