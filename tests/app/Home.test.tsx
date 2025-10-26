import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import MarketingHomePage from "@/app/(marketing)/page";

type MockedImageProps = React.ComponentProps<"img"> & { priority?: boolean };

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props?: MockedImageProps) => {
    const { priority, alt, ...rest } = props ?? {};
    void priority;

    // eslint-disable-next-line @next/next/no-img-element -- Use a plain img for predictable tests while Next Image is mocked.
    return <img {...rest} alt={alt ?? ""} />;
  },
}));

describe("Marketing home page", () => {
  it("renders the Clarivum hero copy", () => {
    render(<MarketingHomePage />);

    expect(
      screen.getByRole("heading", { name: /tools-first guidance that respects your time/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Kaizen guardrails/i)).toBeInTheDocument();
  });

  it("surfaces Skin, Fuel, and Habits entry points", () => {
    render(<MarketingHomePage />);

    expect(screen.getByRole("link", { name: /browse the roadmap/i })).toHaveAttribute(
      "href",
      "/skin",
    );
    expect(screen.getByRole("link", { name: /habits hq/i })).toHaveAttribute("href", "/habits");
  });
});
