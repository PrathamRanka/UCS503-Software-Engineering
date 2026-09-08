import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthScreen } from "./AuthScreen";

function renderAuth(onAuthenticated = vi.fn()) {
  render(
    <MemoryRouter>
      <AuthScreen
        theme="light"
        onToggleTheme={() => undefined}
        onAuthenticated={onAuthenticated}
      />
    </MemoryRouter>,
  );
  return onAuthenticated;
}

describe("AuthScreen integration", () => {
  it("blocks sign-in with a personal email address", async () => {
    const user = userEvent.setup();
    const onAuthenticated = renderAuth();

    await user.type(screen.getByPlaceholderText("TIET email"), "student@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /^Sign in$/ }));

    expect(
      screen.getByText("Use your official TIET email address (@thapar.edu)."),
    ).toBeInTheDocument();
    expect(onAuthenticated).not.toHaveBeenCalled();
  });

  it("signs in with a normalized institutional email", async () => {
    const user = userEvent.setup();
    const onAuthenticated = renderAuth();

    await user.type(screen.getByPlaceholderText("TIET email"), "STUDENT@THAPAR.EDU");
    await user.type(screen.getByPlaceholderText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /^Sign in$/ }));

    expect(onAuthenticated).toHaveBeenCalledOnce();
    expect(onAuthenticated.mock.calls[0][0].email).toBe("student@thapar.edu");
  });

  it("completes registration and profile onboarding", async () => {
    const user = userEvent.setup();
    const onAuthenticated = renderAuth();

    await user.click(screen.getByRole("button", { name: "Create an account" }));
    await user.type(screen.getByPlaceholderText("Full name"), "Ananya Yadav");
    await user.type(screen.getByPlaceholderText("name@thapar.edu"), "ananya@thapar.edu");
    await user.type(screen.getByPlaceholderText("Create password"), "secure123");
    await user.click(screen.getByRole("button", { name: /Verify and continue/ }));
    await user.clear(screen.getByPlaceholderText("username"));
    await user.type(screen.getByPlaceholderText("username"), "ananyayadav");
    await user.selectOptions(screen.getByLabelText("Year"), "Third year");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(onAuthenticated).toHaveBeenCalledOnce();
    expect(onAuthenticated.mock.calls[0][0]).toMatchObject({
      name: "Ananya Yadav",
      username: "ananyayadav",
      email: "ananya@thapar.edu",
      year: "Third year",
    });
  });
});
