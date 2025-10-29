"use client";

import { Spinner } from "../Spinner";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: {
    label: "Wczytywanie wyników",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Small: Story = {};

export const Medium: Story = {
  args: {
    size: "md",
  },
};
