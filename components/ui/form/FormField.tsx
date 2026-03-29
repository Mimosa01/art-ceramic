import clsx from "clsx";
import { type InputHTMLAttributes } from "react";

const inputBase =
  "w-full bg-transparent border-0 border-b py-[0.85rem] font-cormorant-garamond text-base font-light tracking-[0.04em] outline-none transition-colors duration-300";

type BaseProps = {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  /** Неконтролируемый режим */
  defaultValue?: string;
  /** Контролируемый режим (если переданы оба с `onChange`) */
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  /** Сообщение об ошибке валидации */
  error?: string;
  /**
   * Тон текста поля: светлый — как в формах на тёмном фоне; тёмный — на светлом (кремовом).
   */
  textTone?: "light" | "dark";
};

type InputProps = BaseProps & {
  kind?: "input";
  inputType?: InputHTMLAttributes<HTMLInputElement>["type"];
};

type TextareaProps = BaseProps & {
  kind: "textarea";
  rows?: number;
};

type FormFieldProps = InputProps | TextareaProps;

export default function FormField(props: FormFieldProps) {
  const {
    label,
    name,
    required,
    placeholder,
    defaultValue,
    value,
    onChange,
    className,
    error,
    textTone = "light",
  } = props;

  const id = `field-${name}`;
  const controlled = value !== undefined && onChange !== undefined;
  const invalid = Boolean(error);
  const toneDark = textTone === "dark";
  const labelClass = toneDark
    ? "section-label block text-(--red-deep)"
    : "section-label block text-(--red-light)";
  const errorClass = toneDark
    ? "mt-1.5 text-sm text-(--red-mid)"
    : "mt-1.5 text-sm text-red-200/90";

  const inputClass = clsx(
    inputBase,
    toneDark
      ? "border-b border-[rgba(72,4,11,0.35)] text-(--red-deep) placeholder:text-[rgba(72,4,11,0.45)] focus:border-b focus:border-(--red-mid)"
      : "border-b border-white/45 text-white placeholder:text-white/55 focus:border-b focus:border-(--red-light)",
    props.kind === "textarea" && "h-[90px] resize-none",
    className,
  );

  const inputProps = {
    id,
    name,
    required,
    placeholder,
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required ? "*" : ""}
      </label>

      {props.kind === "textarea" ? (
        <textarea
          id={inputProps.id}
          name={inputProps.name}
          required={inputProps.required}
          placeholder={inputProps.placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          {...(controlled
            ? { value, onChange: (e) => onChange(e.target.value) }
            : { defaultValue })}
          className={inputClass}
          rows={props.rows ?? 4}
        />
      ) : (
        <input
          type={props.inputType ?? "text"}
          id={inputProps.id}
          name={inputProps.name}
          required={inputProps.required}
          placeholder={inputProps.placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-error` : undefined}
          {...(controlled
            ? { value, onChange: (e) => onChange(e.target.value) }
            : { defaultValue })}
          className={inputClass}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
