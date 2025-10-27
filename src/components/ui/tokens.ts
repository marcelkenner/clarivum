export const brandColors = {
  ink: "#0E0F0F",
  inkSoft: "rgba(14, 15, 15, 0.72)",
  jade: "#2E6B5A",
  jadeHover: "#245345",
  jadeActive: "#1C3F32",
  skinTeal: "#2F8C7A",
  skinTealHover: "#25705F",
  skinTealActive: "#1C564A",
  fuelAmber: "#D98A1A",
  fuelAmberHover: "#B97315",
  fuelAmberActive: "#8F5710",
  habitsIndigo: "#3F3C7F",
  habitsIndigoHover: "#332F65",
  habitsIndigoActive: "#27234C",
  beige: "#EDE6DA",
  beigeSoft: "#F6F1E8",
  snow: "#FFFFFF",
  gold: "#C7A55A",
} as const;

export type PillarKey = "skin" | "fuel" | "habits";
export type AccentKey = PillarKey | "jade";

export type AccentPalette = { base: string; hover: string; active: string; tint: string };

export const jadeAccent: AccentPalette = {
  base: brandColors.jade,
  hover: brandColors.jadeHover,
  active: brandColors.jadeActive,
  tint: "rgba(46, 107, 90, 0.08)",
};

export const pillarAccents: Record<PillarKey, AccentPalette> = {
  skin: {
    base: brandColors.skinTeal,
    hover: brandColors.skinTealHover,
    active: brandColors.skinTealActive,
    tint: "rgba(47, 140, 122, 0.12)",
  },
  fuel: {
    base: brandColors.fuelAmber,
    hover: brandColors.fuelAmberHover,
    active: brandColors.fuelAmberActive,
    tint: "rgba(217, 138, 26, 0.16)",
  },
  habits: {
    base: brandColors.habitsIndigo,
    hover: brandColors.habitsIndigoHover,
    active: brandColors.habitsIndigoActive,
    tint: "rgba(63, 60, 127, 0.14)",
  },
};

export const accentPalettes: Record<AccentKey, AccentPalette> = {
  jade: jadeAccent,
  ...pillarAccents,
};

export const containerWidths = {
  narrow: "740px",
  default: "1120px",
  wide: "1280px",
} as const;

export const pagePaddingInline = "clamp(16px, 4vw, 64px)";
export const sectionSpacing = "clamp(64px, 12vw, 96px)";
export const sectionSpacingTight = "clamp(48px, 8vw, 64px)";

export const radii = {
  pill: "999px",
  card: "1.75rem",
  hero: "2.5rem",
  control: "0.75rem",
} as const;

export const focusRing = {
  width: "2px",
  offset: "2px",
} as const;

export const typographyScale = {
  heading1: "clamp(2.5rem, 5vw, 3.5rem)",
  heading2: "clamp(2rem, 4vw, 2.75rem)",
  heading3: "clamp(1.75rem, 3vw, 2.125rem)",
  heading4: "clamp(1.375rem, 2.5vw, 1.75rem)",
  bodyLg: "1.125rem",
  body: "1rem",
  bodySm: "0.875rem",
} as const;

export const spacingScale = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  xxl: "2rem",
} as const;

export const shadowTokens = {
  soft: "0 40px 65px -50px rgba(46,107,90,0.45)",
  card: "0 24px 45px -35px rgba(46,107,90,0.3)",
} as const;

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
export type ButtonSize = "sm" | "md" | "lg";
