import { dirname } from "path";
import { fileURLToPath } from "url";

import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import pluginUnusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      "aws/dist/**",
    ],
  },
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      import: pluginImport,
      "unused-imports": pluginUnusedImports,
      prettier: pluginPrettier,
    },
    settings: {
      import: {
        resolver: {
          node: {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
          },
          typescript: true,
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: [
            "**/*.config.{js,cjs,mjs,ts,cts,mts}",
            "**/*.test.{ts,tsx,js,jsx}",
            "scripts/**",
            "tests/**",
            "playwright/**",
          ],
          packageDir: __dirname,
        },
      ],
      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
            "object",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: false,
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-floating-promises": [
        "error",
        {
          ignoreVoid: true,
        },
      ],
    },
  },
];

export default config;
