import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import LoginForm from "../components/auth/LoginForm";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

describe("LoginForm", () => {
    it("renders the login heading", () => {
        render(
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <LoginForm />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        );

        expect(
            screen.getByRole("heading", {
                name: /login to fitness monolith/i,
            })
        ).toBeInTheDocument();
    });

    it("renders email and password fields", () => {
        render(
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        <LoginForm />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        );

        expect(
            screen.getByPlaceholderText(/email/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/password/i)
        ).toBeInTheDocument();
    });
});