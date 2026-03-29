"use client";

import Button from "@/components/ui/Button";
import {
  useOrdersStore,
  type OrderFormPayload,
} from "@/store/formStore";

type OrderFormSubmitBase = {
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  label?: string;
  submittingLabel?: string;
};

export type OrderFormSubmitProps =
  | (OrderFormSubmitBase & {
      submitMode?: "manual";
      payload: OrderFormPayload;
    })
  | (OrderFormSubmitBase & {
      submitMode: "form";
    });

const sendIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function OrderFormSubmit(props: OrderFormSubmitProps) {
  const {
    disabled = false,
    className = "",
    wrapperClassName = "pt-4",
    label = "Отправить заявку",
    submittingLabel = "Отправка…",
  } = props;

  const submitMode = props.submitMode ?? "manual";
  const isFormMode = submitMode === "form";

  const submitOrder = useOrdersStore((s) => s.submitOrder);
  const submitStatus = useOrdersStore((s) => s.submitStatus);
  const submitError = useOrdersStore((s) => s.submitError);

  const isSubmitting = submitStatus === "submitting";
  const isDisabled = disabled || isSubmitting;

  const handleClick = () => {
    if (isFormMode) return;
    if ("payload" in props) {
      void submitOrder(props.payload);
    }
  };

  return (
    <div className={wrapperClassName}>
      <Button
        variant="primary"
        type={isFormMode ? "submit" : "button"}
        onClick={isFormMode ? undefined : handleClick}
        disabled={isDisabled}
        className={`w-full justify-center ${className}`.trim()}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? submittingLabel : label}
        {sendIcon}
      </Button>
      {submitError ? (
        <p className="mt-2 text-sm text-red-200/90" role="alert">
          {submitError}
        </p>
      ) : null}
    </div>
  );
}
