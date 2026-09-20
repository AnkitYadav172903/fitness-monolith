import { Menu, Moon, Sun } from "lucide-react";

import useTheme from "../../hooks/useTheme";

export default function Navbar({ setSidebarOpen }) {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <header className="h-16 px-5 flex justify-between items-center sticky top-0 z-40 glass">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open navigation"
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl surface-secondary border border-theme"
                >
                    <Menu className="text-[color:var(--text)]" />
                </button>

                <h2 className="text-[color:var(--text)] text-xl font-bold">
                    Fitness Monolith
                </h2>
            </div>

            <button
                onClick={toggleTheme}
                title="Toggle Theme"
                aria-label="Toggle theme"
                className="w-10 h-10 rounded-full surface-secondary border border-theme flex items-center justify-center hover:bg-blue-500/10 transition"
            >
                {darkMode ? (
                    <Sun className="text-warning w-5 h-5" />
                ) : (
                    <Moon className="text-warning w-5 h-5" />
                )}
            </button>
        </header>
    );
}