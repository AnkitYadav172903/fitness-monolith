import { Menu, Moon, Sun } from "lucide-react";

import useTheme from "../../hooks/useTheme";

export default function Navbar({ setSidebarOpen }) {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <header className="h-16 px-5 flex justify-between items-center sticky top-0 z-40 glass">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2"
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
                className="w-10 h-10 rounded-full surface-secondary border border-theme flex items-center justify-center"
            >
                {darkMode ? (
                    <Sun className="text-amber-400" />
                ) : (
                    <Moon className="text-blue-600" />
                )}
            </button>
        </header>
    );
}