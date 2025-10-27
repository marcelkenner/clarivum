import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Button } from "@/components/ui";

const dispatchAnalyticsEvent = vi.fn();

vi.mock("@/lib/analytics/dispatch", () => ({
  dispatchAnalyticsEvent,
}));

describe("Button", () => {
  beforeEach(() => {
    dispatchAnalyticsEvent.mockClear();
  });

  it("renders children and forwards clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} accent="fuel">
        Wyślij plan
      </Button>,
    );

    const button = screen.getByRole("button", { name: /wyślij plan/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("dispatches analytics metadata when provided", async () => {
    const user = userEvent.setup();

    render(
      <Button
        analytics={{
          name: "HomepageHeroPlanRequested",
          payload: { area: "fuel", goal: "energy", emailProvided: false },
        }}
      >
        Planuj
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: /planuj/i }));

    expect(dispatchAnalyticsEvent).toHaveBeenCalledWith("HomepageHeroPlanRequested", {
      area: "fuel",
      goal: "energy",
      emailProvided: false,
    });
  });

  it("shows a spinner and disables interaction when loading", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button loading onClick={handleClick}>
        Zapisywanie
      </Button>,
    );

    const button = screen.getByRole("button", { name: /zapisywanie/i });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    expect(screen.getByRole("status")).toBeInTheDocument();

    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });
});
