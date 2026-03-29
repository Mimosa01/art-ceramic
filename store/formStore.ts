import { create } from "zustand";
import { submitOrderFromForm } from "@/services/orderService";
import type { OrderRow } from "@/types/order";

/** Состояние отправки формы заказа */
export type OrderSubmitStatus = "idle" | "submitting" | "success" | "error";

/** Полезно для пропсов формы / модалки — совпадает с аргументом `submitOrderFromForm` */
export type OrderFormPayload = Parameters<typeof submitOrderFromForm>[0];

export type OrdersStoreState = {
  submitStatus: OrderSubmitStatus;
  submitError: string | null;
  /** Заполнено после успешного `submitOrder` */
  lastCreatedOrder: OrderRow | null;
};

export type OrdersStoreActions = {
  /** Отправка заказа в Supabase. Возвращает `true`, если без ошибки. */
  submitOrder: (input: OrderFormPayload) => Promise<boolean>;
  /** Сброс статуса/ошибки/последнего заказа (например, при закрытии модалки) */
  dismissSubmitResult: () => void;
  reset: () => void;
};

export type OrdersStore = OrdersStoreState & OrdersStoreActions;

const initialState: OrdersStoreState = {
  submitStatus: "idle",
  submitError: null,
  lastCreatedOrder: null,
};

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  ...initialState,

  submitOrder: async (input) => {
    const { submitStatus } = get();
    if (submitStatus === "submitting") return false;

    set({
      submitStatus: "submitting",
      submitError: null,
      lastCreatedOrder: null,
    });

    const { data, error } = await submitOrderFromForm(input);

    if (error) {
      set({
        submitStatus: "error",
        submitError: error.message,
        lastCreatedOrder: null,
      });
      return false;
    }

    set({
      submitStatus: "success",
      submitError: null,
      lastCreatedOrder: data,
    });

    return true;
  },

  dismissSubmitResult: () =>
    set({
      submitStatus: "idle",
      submitError: null,
      lastCreatedOrder: null,
    }),

  reset: () => set(initialState),
}));

/** Вызовы вне React (по аналогии с `galleryActions`) */
export const ordersActions = {
  submitOrder: (input: OrderFormPayload) =>
    useOrdersStore.getState().submitOrder(input),
  dismissSubmitResult: () =>
    useOrdersStore.getState().dismissSubmitResult(),
  reset: () => useOrdersStore.getState().reset(),
};
