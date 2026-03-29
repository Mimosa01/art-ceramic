import clsx from "clsx";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "outline";

type Common = {
  variant: Variant;
  children: ReactNode;
  className?: string;
};

export type ButtonAsLinkProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type ButtonAsButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

function variantClasses(variant: Variant) {
  return [
    variant === "primary" && [
      "relative overflow-hidden rounded-[25px] border-none bg-red-accent px-10 py-4 text-white transition-[background_0.3s,transform_0.2s]",
      "after:pointer-events-none after:absolute after:inset-0 after:origin-left after:scale-x-0 after:bg-white/12 after:transition-transform after:duration-300 after:ease-out after:content-['']",
      "hover:-translate-y-0.5 hover:after:scale-x-100 active:translate-y-0",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.55] disabled:after:hidden disabled:hover:translate-y-0",
    ],
    variant === "outline" && [
      "rounded-[25px] border border-red-light bg-transparent px-8 py-3.5 text-red-mid transition-[background-color,color,border-color] duration-300",
      "hover:border-red-mid hover:bg-red-mid hover:text-white",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-[0.55]",
      "disabled:hover:border-red-light disabled:hover:bg-transparent disabled:hover:text-red-mid",
    ],
  ];
}

export default function Button(props: ButtonProps) {
  const { variant, children, className, ...rest } = props;

  const classes = clsx(
    "inline-flex cursor-pointer items-center gap-3 font-jost text-xs font-normal uppercase tracking-[0.25em] no-underline",
    ...variantClasses(variant),
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = rest as Omit<
      ButtonAsLinkProps,
      "variant" | "children" | "className"
    >;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const buttonProps = rest as Omit<
    ButtonAsButtonProps,
    "variant" | "children" | "className"
  >;

  return (
    <button
      type={buttonProps.type ?? "button"}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
