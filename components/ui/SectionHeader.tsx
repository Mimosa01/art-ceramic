import clsx from "clsx";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  layout?: "split" | "center";
  showGlazeLine?: boolean;
  titleClassName?: string;
  descriptionClassName?: string;
  labelClassName?: string;
  labelColorClassName?: string;
  descriptionColorClassName?: string;
};

export default function SectionHeader({
  label,
  title,
  description,
  className,
  layout = "split",
  showGlazeLine = false,
  titleClassName,
  descriptionClassName,
  labelClassName,
  labelColorClassName = "text-red-mid",
  descriptionColorClassName,
}: SectionHeaderProps) {
  const isCenter = layout === "center";

  return (
    <div
      className={clsx(
        "mb-[3.2rem]",
        isCenter
          ? "text-center"
          : "flex flex-col justify-between gap-6 md:flex-row md:items-end",
        className,
      )}
    >
      <div>
        <p className={clsx("section-label", labelColorClassName, labelClassName)}>
          {label}
        </p>
        <h3
          className={clsx(
            "section-title mt-3 text-[clamp(2.5rem,5vw,4rem)]",
            titleClassName,
          )}
        >
          {title}
        </h3>
        {showGlazeLine ? <div className="glaze-line mx-auto mt-6 w-16" /> : null}
      </div>
      {description ? (
        <p
          className={clsx(
            "text-sm font-light leading-relaxed",
            isCenter
              ? "mx-auto mt-6 max-w-[480px] text-[.95rem] text-red-dark opacity-80"
              : "max-w-xs text-red-mid md:max-w-sm",
            descriptionColorClassName,
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
