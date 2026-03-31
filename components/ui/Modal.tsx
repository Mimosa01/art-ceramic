"use client";

import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";
import { createPortal } from "react-dom";
import { buildOrderPayloadFromModal } from "@/lib/mapOrderFormToPayload";
import { useModalOrderForm } from "@/hooks/useModalOrderForm";
import { useModalStore } from "@/store/modalStore";
import { useOrdersStore } from "@/store/formStore";
import FormField from "@/components/ui/form/FormField";
import OrderFormSubmit from "@/components/ui/form/OrderFormSubmit";
import Button from "@/components/ui/Button";

type ModalOrderBodyProps = {
  styleFieldPrefill: string;
  referenceImageUrl: string | null;
  onRequestClose: () => void;
};

function ModalOrderBody({
  styleFieldPrefill,
  referenceImageUrl,
  onRequestClose,
}: ModalOrderBodyProps) {
  const { control, handleSubmit, formState } = useModalOrderForm(styleFieldPrefill);
  const submitOrder = useOrdersStore((s) => s.submitOrder);
  const submitStatus = useOrdersStore((s) => s.submitStatus);
  const success = submitStatus === "success";
  const isSubmitting = submitStatus === "submitting";

  const onSubmit = handleSubmit(async (data) => {
    const payload = buildOrderPayloadFromModal({
      ...data,
      design_preview_url: referenceImageUrl,
    });

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

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={clsx("space-y-5", success && "hidden")}
      >
        {referenceImageUrl ? (
          <input
            type="hidden"
            name="galleryReferenceImageUrl"
            value={referenceImageUrl}
            tabIndex={-1}
            aria-hidden
          />
        ) : null}

        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Имя"
              name={field.name}
              required
              placeholder="Ваше имя"
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
              label="Telegram / телефон"
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
          name="style"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              label="Стиль / идея"
              name={field.name}
              placeholder="Выбранный стиль или своя идея"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="comment"
          control={control}
          render={({ field, fieldState }) => (
            <FormField
              kind="textarea"
              label="Комментарий"
              name={field.name}
              placeholder="Любые детали..."
              rows={4}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <OrderFormSubmit
          submitMode="form"
          disabled={!formState.isValid || isSubmitting}
          wrapperClassName="pt-3"
          label="Отправить"
        />
      </form>

      <div
        className={clsx("py-8 text-center", !success && "hidden")}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-crimson-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ff9da3"
            strokeWidth="1.5"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-cormorant-garamond text-[1.35rem] text-white">
          Заявка отправлена!
        </p>
        <p className="mt-2 text-sm font-light text-white/78">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <div className="mt-8">
          <Button
            variant="outline"
            type="button"
            className="w-full justify-center"
            onClick={onRequestClose}
          >
            Закрыть
          </Button>
        </div>
      </div>
    </>
  );
}

export default function Modal() {
  const open = useModalStore((s) => s.open);
  const styleFieldPrefill = useModalStore((s) => s.styleFieldPrefill);
  const referenceImageUrl = useModalStore((s) => s.referenceImageUrl);
  const modalSessionId = useModalStore((s) => s.modalSessionId);
  const closeModal = useModalStore((s) => s.closeModal);
  const dismissSubmitResult = useOrdersStore((s) => s.dismissSubmitResult);

  const handleClose = useCallback(() => {
    dismissSubmitResult();
    closeModal();
  }, [dismissSubmitResult, closeModal]);

  useEffect(() => {
    if (!open) return;
    dismissSubmitResult();
  }, [open, modalSessionId, dismissSubmitResult]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!open) return null;

  const node = (
    <div
      className={clsx(
        "fixed inset-0 z-[10050] flex items-center justify-center overflow-y-auto overscroll-contain p-4",
        "bg-[rgba(36,2,6,0.72)] backdrop-blur-[8px]",
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onPointerDown={handleBackdropPointerDown}
    >
      <div
        className={clsx(
          "relative w-[min(520px,94vw)] max-h-[min(90vh,665px)] overflow-y-auto rounded-[2px] border border-[rgba(255,157,163,0.18)] p-12",
          "bg-[linear-gradient(145deg,#2a0508_0%,#48040b_100%)]",
          "shadow-[0_24px_48px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,0,0,0.2)]",
        )}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="section-label text-(--red-light)">Заявка на кружку</p>
            <h3
              id="modal-title"
              className="font-cormorant-garamond text-[1.5rem] text-white"
            >
              Расскажите об идее
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="mt-1 text-white/30 transition-colors hover:text-white/70"
            aria-label="Закрыть"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ModalOrderBody
          key={modalSessionId}
          styleFieldPrefill={styleFieldPrefill}
          referenceImageUrl={referenceImageUrl}
          onRequestClose={handleClose}
        />
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
