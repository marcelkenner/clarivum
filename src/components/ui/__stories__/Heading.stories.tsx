import { Heading } from "../Heading";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Heading",
  component: Heading,
  tags: ["autodocs"],
  args: {
    children: "Poznaj rytuał Clarivum",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Display: Story = {
  args: {
    size: "display",
    as: "h1",
  },
};

export const Jade: Story = {
  args: {
    tone: "jade",
    size: "lg",
  },
};

export const WithDivider: Story = {
  args: {
    divider: true,
    size: "md",
    children: "Plan pielęgnacji",
  },
};
