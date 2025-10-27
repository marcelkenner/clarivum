"use client";

import { forwardRef } from "react";

import { cx } from "./utils";

export type SpinnerSize = "sm" | "md";

const sizeClassMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-[3px]",
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "sm", label = "Ładowanie", className, ...rest },
  ref,
) {
  return (
    <span
      aria-live="polite"
      role="status"
      ref={ref}
      className={cx(
        "inline-flex items-center justify-center",
        "text-[color:var(--spinner-color, currentColor)]",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cx(
          "inline-flex animate-spin rounded-full border-solid border-current border-t-transparent",
          sizeClassMap[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
});
