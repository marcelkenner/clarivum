import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

function Greeting() {
  return <h1>Hello, Clarivum!</h1>;
}

describe("Greeting component", () => {
  it("renders the welcome message", () => {
    render(<Greeting />);
    expect(screen.getByRole("heading", { name: /hello, clarivum/i })).toBeInTheDocument();
  });
});
