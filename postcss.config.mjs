// Vercel (and most CI runners) ship platform-specific lightningcss binaries.
// Only force the WASM fallback when explicitly requested to avoid missing '../pkg'.
if (typeof process !== "undefined" && process.env.LIGHTNINGCSS_FORCE_WASM === "1") {
  process.env.CSS_TRANSFORMER_WASM = "1";
}

const tailwindcss = (await import("@tailwindcss/postcss")).default;

const postcssConfig = {
  plugins: [tailwindcss()],
};

export default postcssConfig;
