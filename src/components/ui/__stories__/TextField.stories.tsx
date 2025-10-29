"use client";

import { MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";

import { TextField } from "../TextField";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: {
    label: "Adres e-mail",
    placeholder: "anna@clarivum.com",
    description: "Wyślemy tylko zaplanowane przypomnienia oraz raport miesięczny.",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    startIcon: <ShieldCheck size={20} aria-hidden="true" />,
    endIcon: <MagnifyingGlass size={20} aria-hidden="true" />,
    accent: "habits",
  },
};

export const WithError: Story = {
  args: {
    error: "Sprawdź format adresu e-mail.",
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Zaraz dostępne…",
  },
};
