import type { Preview } from "@storybook/react";

import "../src/app/globals.css";
import "../src/styles/document-theme.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: "padded",
    a11y: {
      element: "#storybook-root",
      manual: false,
    },
    backgrounds: {
      default: "Paper",
      values: [
        { name: "Paper", value: "var(--beige-soft)" },
        { name: "Snow", value: "var(--snow)" },
        { name: "Ink", value: "var(--ink)" },
      ],
    },
    options: {
      storySort: {
        order: ["Overview", "UI", "Documents"],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="text-ink min-h-screen bg-[radial-gradient(circle_at_20%_-10%,var(--snow)_0%,var(--beige)_55%,var(--beige-soft)_100%)] antialiased">
        <div className="mx-auto max-w-5xl px-[clamp(16px,4vw,64px)] py-12">
          <Story />
        </div>
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default preview;
