"use client";

import { orderFormValuesToPayload } from "@/lib/mapOrderFormToPayload";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useOrdersStore } from "@/store/formStore";
import { Controller } from "react-hook-form";
import FormField from "./FormField";
import OrderFormSubmit from "./OrderFormSubmit";
import OrderFormSuccess from "./OrderFormSuccess";

export default function Form() {
  const { control, handleSubmit, formState } = useOrderForm();
  const submitOrder = useOrdersStore((s) => s.submitOrder);
  const submitStatus = useOrdersStore((s) => s.submitStatus);
  const success = submitStatus === "success";

  const onSubmit = handleSubmit(async (data) => {
    const payload = orderFormValuesToPayload(data);
    const ok = await submitOrder(payload);
    if (!ok) return;

    const name = payload.customer_name;
    const contact =
      payload.customer_phone || payload.customer_telegram || "";

    if (!name || !contact) return;

    void fetch("/api/push/notify-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead: {
          name,
          contact,
          service: null,
        },
      }),
    });
  });

  const isSubmitting = submitStatus === "submitting";

  return (
    <div>
      <form
        id="orderForm"
        className={`space-y-6 ${success ? "hidden" : ""}`}
        onSubmit={onSubmit}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Ваше имя"
              name={field.name}
              required
              placeholder="Как к вам обращаться?"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="contact"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Telegram или телефон"
              name={field.name}
              required
              placeholder="@username или +7..."
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="idea"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              kind="textarea"
              label="Идея или пожелание"
              name={field.name}
              placeholder="Расскажите, какую кружку вы хотите: цвета, образ, для кого..."
              rows={5}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="style"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Выбранный стиль"
              name={field.name}
              placeholder="Или опишите свободно"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <OrderFormSubmit
          submitMode="form"
          disabled={!formState.isValid || isSubmitting}
        />

        <p className="text-xs tracking-wide text-white/45">
          Нажимая «Отправить», вы соглашаетесь с обработкой персональных данных
        </p>
      </form>

      <div className={success ? "" : "hidden"}>
        <OrderFormSuccess />
      </div>
    </div>
  );
}
