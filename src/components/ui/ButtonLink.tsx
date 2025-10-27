"use client";

import NextLink, { type LinkProps } from "next/link";
import { forwardRef } from "react";

import {
  dispatchAnalyticsEvent,
  type AnalyticsEventName,
  type AnalyticsEventPayloadMap,
} from "@/lib/analytics/dispatch";

import { Spinner } from "./Spinner";
import {
  accentPalettes,
  brandColors,
  type AccentKey,
  type ButtonSize,
  type ButtonVariant,
} from "./tokens";
import { cx } from "./utils";

import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";

type ButtonAnalytics<Name extends AnalyticsEventName = AnalyticsEventName> = {
  name: Name;
  payload: AnalyticsEventPayloadMap[Name];
};

type ButtonIconPosition = "start" | "end";

type ButtonCSSVariables = CSSProperties & {
  "--button-bg"?: string;
  "--button-hover"?: string;
  "--button-active"?: string;
  "--button-tint"?: string;
  "--button-surface"?: string;
  "--tw-ring-color"?: string;
  "--tw-ring-offset-color"?: string;
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.18em]",
  md: "h-11 px-6 text-sm tracking-[0.22em]",
  lg: "h-12 px-7 text-base tracking-[0.24em]",
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--button-bg)] text-snow hover:bg-[color:var(--button-hover)] active:bg-[color:var(--button-active)] shadow-[0_24px_45px_-35px_rgba(46,107,90,0.35)] active:translate-y-[1px]",
  secondary:
    "border border-[color:var(--button-bg)] text-[color:var(--button-bg)] hover:bg-[color:var(--button-tint)] active:bg-[color:var(--button-tint)] focus-visible:bg-[color:var(--button-tint)]",
  tertiary:
    "bg-[color:var(--button-tint)] text-[color:var(--button-bg)] hover:bg-[color:var(--button-hover)]/12 active:bg-[color:var(--button-hover)]/20 border border-transparent",
  text: "bg-transparent text-[color:var(--button-bg)] hover:text-[color:var(--button-hover)] px-0 border border-transparent",
};

type NextLinkOptions = Omit<LinkProps, "href" | "onClick">;

export interface ButtonLinkProps<Name extends AnalyticsEventName = AnalyticsEventName>
  extends NextLinkOptions,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "color" | "onClick" | "ref"> {
  href: LinkProps["href"];
  variant?: ButtonVariant;
  size?: ButtonSize;
  accent?: AccentKey;
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  loading?: boolean;
  analytics?: ButtonAnalytics<Name>;
  onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  {
    children,
    className,
    variant = "primary",
    size = "md",
    accent = "jade",
    icon,
    iconPosition = "start",
    loading = false,
    analytics,
    onClick,
    ...rest
  },
  ref,
) {
  const palette = accentPalettes[accent];

  const cssVars: ButtonCSSVariables = {
    "--button-bg": palette.base,
    "--button-hover": palette.hover,
    "--button-active": palette.active,
    "--button-tint": palette.tint,
    "--button-surface": variant === "primary" ? brandColors.snow : brandColors.beige,
    "--tw-ring-color": palette.base,
    "--tw-ring-offset-color": variant === "primary" ? brandColors.snow : brandColors.beige,
  };

  const computedClassName = cx(
    "inline-flex items-center justify-center gap-2 font-semibold uppercase transition-all duration-150",
    "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none",
    sizeClassMap[size],
    variantClassMap[variant],
    icon && !children ? "px-0" : null,
    className,
  );

  return (
    <NextLink
      ref={ref}
      className={computedClassName}
      style={cssVars}
      data-variant={variant}
      data-accent={accent}
      aria-busy={loading || undefined}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        if (analytics) {
          dispatchAnalyticsEvent(analytics.name, analytics.payload);
        }
        onClick?.(event);
      }}
      {...rest}
    >
      {loading ? (
        <Spinner
          size="sm"
          aria-hidden="true"
          className="text-[color:var(--button-spinner-color,currentColor)]"
        />
      ) : null}
      {icon && iconPosition === "start" && !loading ? (
        <span aria-hidden="true" className="leading-none">
          {icon}
        </span>
      ) : null}
      {children ? <span className="leading-none">{children}</span> : null}
      {icon && iconPosition === "end" && !loading ? (
        <span aria-hidden="true" className="leading-none">
          {icon}
        </span>
      ) : null}
    </NextLink>
  );
});
