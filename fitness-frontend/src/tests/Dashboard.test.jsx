import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import { ThemeProvider } from "../context/ThemeContext";

vi.mock("../services/activityService", () => ({
    getActivities: vi.fn().mockResolvedValue([]),
}));

vi.mock("../hooks/useAuth", () => ({
    default: () => ({
        user: {
            fullName: "Megha Test",
            email: "megha@test.com",
        },
    }),
}));

import Dashboard from "../pages/Dashboard";

describe("Dashboard smoke test", () => {
    it("renders without crashing and greets the user", async () => {
        render(
            <BrowserRouter>
                <ThemeProvider>
                    <Dashboard />
                </ThemeProvider>
            </BrowserRouter>
        );

        expect(
            await screen.findByText(/megha test/i)
        ).toBeInTheDocument();
    });

    it("renders the daily goal heading", async () => {
        render(
            <BrowserRouter>
                <ThemeProvider>
                    <Dashboard />
                </ThemeProvider>
            </BrowserRouter>
        );

        expect(
            await screen.findByText(/burn 800 calories/i)
        ).toBeInTheDocument();
    });
});