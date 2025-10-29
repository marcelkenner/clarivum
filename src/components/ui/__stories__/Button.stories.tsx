"use client";

import { ArrowRight, Check } from "@phosphor-icons/react";

import { Button } from "../Button";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Zobacz plan",
    accent: "jade",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Dowiedz się więcej",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Zacznij teraz",
    icon: <ArrowRight size={18} weight="bold" />,
    iconPosition: "end",
  },
};

export const Loading: Story = {
  args: {
    children: "Przetwarzanie...",
    loading: true,
    disabled: false,
  },
};

export const Confirmation: Story = {
  args: {
    children: "Dodano",
    accent: "fuel",
    icon: <Check size={18} weight="bold" />,
  },
};
