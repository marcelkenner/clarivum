import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { accentPalettes, brandColors, type AccentKey } from "./tokens";
import { cx } from "./utils";

type CardVariant = "soft" | "outline" | "plain";
type CardPadding = "none" | "sm" | "md" | "lg";

const variantClassMap: Record<CardVariant, string> = {
  soft: "bg-[color:var(--card-surface)] border border-[color:var(--card-border)] shadow-[0_24px_45px_-35px_rgba(46,107,90,0.3)]",
  outline: "bg-transparent border border-[color:var(--card-border)]",
  plain: "bg-[color:var(--card-plain)] border border-[color:var(--card-border)]",
};

const paddingClassMap: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4 md:p-5",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-10",
};

type CardCSSVariables = CSSProperties & {
  "--card-border"?: string;
  "--card-surface"?: string;
  "--card-plain"?: string;
  "--card-accent"?: string;
};

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: CardVariant;
  padding?: CardPadding;
  accent?: AccentKey | "none";
  heading?: ReactNode;
  supportingText?: ReactNode;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as,
    children,
    className,
    variant = "soft",
    padding = "md",
    accent = "none",
    heading,
    supportingText,
    ...rest
  },
  ref,
) {
  const Component = (as ?? "section") as ElementType;

  const palette = accent === "none" ? null : accentPalettes[accent];

  const cssVars: CardCSSVariables = {
    "--card-border": "rgba(14, 15, 15, 0.12)",
    "--card-surface": "rgba(255, 255, 255, 0.92)",
    "--card-plain": brandColors.snow,
    ...(palette
      ? {
          "--card-accent": palette.base,
        }
      : null),
  };

  return (
    <Component
      ref={ref as never}
      className={cx(
        "relative flex flex-col gap-4 rounded-[1.75rem]",
        variantClassMap[variant],
        paddingClassMap[padding],
        palette ? "border-t-[3px] border-t-[color:var(--card-accent)]" : null,
        className,
      )}
      style={cssVars}
      {...rest}
    >
      {heading || supportingText ? (
        <header className="space-y-2">
          {heading ? (
            <h3 className="font-display text-ink text-xl leading-tight md:text-2xl">{heading}</h3>
          ) : null}
          {supportingText ? (
            <p className="text-ink-soft text-sm leading-relaxed md:text-base">{supportingText}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </Component>
  );
});
