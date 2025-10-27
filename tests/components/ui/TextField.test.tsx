import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextField } from "@/components/ui";

describe("TextField", () => {
  it("associates label and input correctly", () => {
    render(<TextField label="Adres e-mail" placeholder="ty@clarivum.com" />);

    const input = screen.getByPlaceholderText("ty@clarivum.com");
    const label = screen.getByText("Adres e-mail", { selector: "label" });

    expect(label).toHaveAttribute("for", input.id);
  });

  it("renders helper text and error with descriptive ids", async () => {
    const user = userEvent.setup();

    render(
      <TextField
        label="Guardrail"
        description="Dodaj krótki opis guardraila."
        error="Guardrail musi mieć nazwę."
        required
      />,
    );

    const input = screen.getByLabelText(/guardrail/i, { selector: "input" });
    expect(input).toHaveAttribute("aria-describedby");

    const ids = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    ids.forEach((id) => expect(document.getElementById(id)).not.toBeNull());

    await user.type(input, "Test");
    expect(screen.getByText(/guardrail musi mieć nazwę/i)).toBeInTheDocument();
  });
});
