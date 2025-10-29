import { Button } from "../Button";
import { Card } from "../Card";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    heading: "Monitoruj swoją skórę",
    supportingText:
      "Zapisz aktualny poziom UV, aby aplikacja mogła zasugerować zabezpieczenia i przypomnieć o ponownej aplikacji filtrów.",
    children: (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-ink-soft text-sm md:text-base">
          Łączymy dane UV z Twoimi potrzebami, aby podpowiadać najlepsze rytuały pielęgnacji.
        </p>
        <Button variant="secondary" accent="jade">
          Uruchom widget
        </Button>
      </div>
    ),
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Soft: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const WithAccent: Story = {
  args: {
    accent: "skin",
    heading: "Diagnoza skóry w 5 minut",
    supportingText:
      "Uzyskaj natychmiastowe rekomendacje pielęgnacji i porównaj je z wynikami poprzednich badań.",
  },
};
