// Force Lightning CSS to use the WASM build so Turbopack doesn't need to
// resolve a platform-specific native binary during production builds.
if (typeof process !== "undefined") {
  process.env.CSS_TRANSFORMER_WASM ??= "1";
}

const tailwindcss = (await import("@tailwindcss/postcss")).default;

const postcssConfig = {
  plugins: [tailwindcss()],
};

export default postcssConfig;
