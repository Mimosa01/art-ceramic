import { OrderFormPayload } from "@/store/formStore";

function mapContact(raw: string): {
  customer_phone: string;
  customer_telegram: string | null;
} {
  const customer_phone = raw.trim();
  const customer_telegram = customer_phone.startsWith("@")
    ? customer_phone.replace(/^@+/, "").trim() || null
    : null;
  return { customer_phone, customer_telegram };
}

function joinCommentBlocks(...parts: string[]): string | null {
  const trimmed = parts.map((p) => p.trim()).filter(Boolean);
  return trimmed.length > 0 ? trimmed.join("\n\n") : null;
}

/** Сырые поля формы заказа на лендинге */
export type OrderFormFieldsInput = {
  name: string;
  contact: string;
  idea: string;
  style: string;
};

/**
 * Собирает тело для `submitOrder` из полей формы.
 * Контакт с `@` дублируется в `customer_phone` и парсится в `customer_telegram`.
 */
export function buildOrderPayload(
  input: OrderFormFieldsInput,
): OrderFormPayload {
  const customer_name = input.name.trim();
  const { customer_phone, customer_telegram } = mapContact(input.contact);
  const customer_comment = joinCommentBlocks(input.idea, input.style);

  return {
    customer_name,
    customer_phone,
    customer_telegram,
    customer_comment,
    design_preview_url: null,
  };
}

/** Поля формы в модальном окне */
export type ModalOrderFormInput = {
  name: string;
  contact: string;
  style: string;
  comment: string;
  /**
   * Скрытое поле: URL картинки с карточки галереи → колонка `design_preview_url`.
   */
  design_preview_url?: string | null;
};

/**
 * Собирает тело для `submitOrder` из полей модалки «Заявка на кружку».
 */
export function buildOrderPayloadFromModal(
  input: ModalOrderFormInput,
): OrderFormPayload {
  const customer_name = input.name.trim();
  const { customer_phone, customer_telegram } = mapContact(input.contact);
  const customer_comment = joinCommentBlocks(input.style, input.comment);
  const preview =
    typeof input.design_preview_url === "string"
      ? input.design_preview_url.trim()
      : "";
  const design_preview_url = preview !== "" ? preview : null;

  return {
    customer_name,
    customer_phone,
    customer_telegram,
    customer_comment,
    design_preview_url,
  };
}

/** Алиас для формы на лендинге (`Form.tsx`). */
export { buildOrderPayload as orderFormValuesToPayload };
