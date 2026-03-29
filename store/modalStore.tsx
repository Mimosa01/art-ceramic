import { create } from "zustand";

/** Аргументы открытия модалки (объект) */
export type OpenModalOptions = {
  /** Текст в поле «Стиль / идея» (например, с карточки галереи) */
  styleHint?: string | null;
  /**
   * URL картинки работы с карточки — не показывается в UI,
   * уходит в заказ как `design_preview_url`.
   */
  referenceImageUrl?: string | null;
};

function normalizeOpenModalArg(
  arg?: OpenModalOptions | string | null,
): { styleHint: string; referenceImageUrl: string | null } {
  if (arg === null || arg === undefined) {
    return { styleHint: "", referenceImageUrl: null };
  }
  if (typeof arg === "string") {
    return { styleHint: arg.trim(), referenceImageUrl: null };
  }
  const styleHint =
    typeof arg.styleHint === "string" ? arg.styleHint.trim() : "";
  const rawUrl = arg.referenceImageUrl;
  const referenceImageUrl =
    typeof rawUrl === "string" && rawUrl.trim() !== ""
      ? rawUrl.trim()
      : null;
  return { styleHint, referenceImageUrl };
}

export type ModalState = {
  /** Модалка открыта */
  open: boolean;
  /** Счётчик открытий — для сброса полей формы */
  modalSessionId: number;
  /** Начальное значение поля «Стиль / идея» */
  styleFieldPrefill: string;
  /** Скрытый URL превью работы (с карточки) → `design_preview_url` в заказе */
  referenceImageUrl: string | null;
};

type ModalActions = {
  /**
   * Открыть модалку.
   * Можно передать строку (как раньше — только подсказка стиля) или объект с `styleHint` и `referenceImageUrl`.
   */
  openModal: (arg?: OpenModalOptions | string | null) => void;
  /** Закрыть и сбросить состояние */
  closeModal: () => void;
};

export type ModalStore = ModalState & ModalActions;

const initialState: ModalState = {
  open: false,
  modalSessionId: 0,
  styleFieldPrefill: "",
  referenceImageUrl: null,
};

export const useModalStore = create<ModalStore>((set) => ({
  ...initialState,

  openModal: (arg) => {
    const { styleHint, referenceImageUrl } = normalizeOpenModalArg(arg);
    return set((s) => ({
      open: true,
      modalSessionId: s.modalSessionId + 1,
      styleFieldPrefill: styleHint,
      referenceImageUrl,
    }));
  },

  closeModal: () => set({ ...initialState }),
}));

/** Вызов без подписки на стор (удобно в обработчиках, вне React) */
export const modalActions = {
  open: (arg?: OpenModalOptions | string | null) =>
    useModalStore.getState().openModal(arg),
  close: () => useModalStore.getState().closeModal(),
};
