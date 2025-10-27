import { render, screen } from "@testing-library/react";

import { Card } from "@/components/ui";

describe("Card", () => {
  it("renders title, subtitle, and children content", () => {
    render(
      <Card
        heading="Clarivum Habits"
        supportingText="Guardraile na pierwsze 14 dni"
        accent="habits"
      >
        <p data-testid="body">Plan pracy</p>
      </Card>,
    );

    expect(screen.getByRole("heading", { name: /clarivum habits/i })).toBeInTheDocument();
    expect(screen.getByText(/guardraile na pierwsze 14 dni/i)).toBeInTheDocument();
    expect(screen.getByTestId("body")).toBeInTheDocument();
  });
});
