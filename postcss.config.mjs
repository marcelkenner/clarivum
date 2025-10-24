if (typeof process !== "undefined") {
  process.env.CSS_TRANSFORMER_WASM ??= "1";
}

const tailwindcss = (await import("@tailwindcss/postcss")).default;

const postcssConfig = {
  plugins: [tailwindcss()],
};

export default postcssConfig;
