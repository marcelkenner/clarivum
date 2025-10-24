import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

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

describe("Home page", () => {
  it("renders the onboarding steps", () => {
    render(<Home />);

    expect(screen.getByAltText(/next\.js logo/i)).toBeInTheDocument();
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument();
  });

  it("includes a link to the documentation", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: /read our docs/i })).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs"),
    );
  });
});
