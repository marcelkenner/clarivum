"use client";

import { forwardRef, useId } from "react";

import { accentPalettes, brandColors, type AccentKey } from "./tokens";
import { cx } from "./utils";

import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type TextFieldCSSVariables = CSSProperties & {
  "--field-accent"?: string;
  "--field-surface"?: string;
};

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "color"> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  accent?: AccentKey;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    id,
    label,
    description,
    error,
    accent = "jade",
    startIcon,
    endIcon,
    className,
    disabled,
    required,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const palette = accentPalettes[accent];

  const cssVars: TextFieldCSSVariables = {
    "--field-accent": palette.base,
    "--field-surface": brandColors.snow,
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-ink text-xs font-semibold tracking-[0.26em] uppercase"
      >
        {label}
        {required ? <span className="text-ink-soft ml-1 text-[0.7em]">(wymagane)</span> : null}
      </label>
      <div
        className={cx(
          "relative flex items-center gap-2 rounded-[0.85rem] border border-[rgba(46,107,90,0.18)] bg-[color:var(--field-surface)] px-4",
          "transition focus-within:border-[color:var(--field-accent)] focus-within:shadow-[0_0_0_1px_var(--field-accent)]",
          disabled ? "opacity-60" : null,
          error ? "border-[color:var(--field-accent)]" : null,
        )}
        style={cssVars}
      >
        {startIcon ? <span aria-hidden="true">{startIcon}</span> : null}
        <input
          id={inputId}
          ref={ref}
          className={cx(
            "text-ink placeholder:text-ink-soft flex-1 bg-transparent py-3 text-base leading-relaxed",
            "focus-visible:outline-none",
            className,
          )}
          disabled={disabled}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={Boolean(error) || undefined}
          required={required}
          {...rest}
        />
        {endIcon ? <span aria-hidden="true">{endIcon}</span> : null}
      </div>
      {description ? (
        <p id={descriptionId} className="text-ink-soft text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-ink-soft text-sm leading-relaxed font-semibold">
          {error}
        </p>
      ) : null}
    </div>
  );
});
