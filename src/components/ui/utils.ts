export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | Record<string, boolean | undefined | null | number>;

/**
 * Tiny class name combiner to avoid an additional dependency.
 * Accepts strings, numbers, falsy values, and boolean maps.
 */
export function cx(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      continue;
    }

    for (const [key, condition] of Object.entries(value)) {
      if (condition) {
        classes.push(key);
      }
    }
  }

  return classes.join(" ");
}
