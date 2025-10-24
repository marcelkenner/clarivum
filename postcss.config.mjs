if (typeof process !== "undefined") {
  process.env.CSS_TRANSFORMER_WASM ??= "1";
}

import tailwindcss from "@tailwindcss/postcss";

const postcssConfig = {
  plugins: [tailwindcss()],
};

export default postcssConfig;
