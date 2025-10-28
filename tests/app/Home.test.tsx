import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("Homepage placeholder", () => {
  it("renders the placeholder heading and message", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /Homepage refresh in progress/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/we're rebuilding the clarivum introduction/i)).toBeInTheDocument();
  });
});
