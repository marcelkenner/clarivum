import { createElement } from "react";

import { typographyScale } from "./tokens";
import { cx } from "./utils";

import type { HTMLAttributes } from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";
type HeadingTone = "ink" | "ink-soft" | "jade";
type HeadingSize = "display" | "xl" | "lg" | "md" | "sm";

const toneClassMap: Record<HeadingTone, string> = {
  ink: "text-ink",
  "ink-soft": "text-ink-soft",
  jade: "text-jade",
};

const sizeStyleMap: Record<HeadingSize, string> = {
  display: typographyScale.heading1,
  xl: typographyScale.heading2,
  lg: typographyScale.heading3,
  md: typographyScale.heading4,
  sm: typographyScale.bodyLg,
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  size?: HeadingSize;
  tone?: HeadingTone;
  divider?: boolean;
}

export function Heading({
  as = "h2",
  size = "lg",
  tone = "ink",
  divider = false,
  className,
  children,
  ...rest
}: HeadingProps) {
  const style = { fontSize: sizeStyleMap[size] };

  return createElement(
    as,
    {
      className: cx(
        "font-display leading-tight tracking-[0.04em]",
        toneClassMap[tone],
        divider ? "border-b border-ink/10 pb-3" : null,
        className,
      ),
      style,
      ...rest,
    },
    children,
  );
}
