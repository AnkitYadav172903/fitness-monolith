import { Download } from "lucide-react";

import useTheme from "../../hooks/useTheme";
import usePWAInstall from "../../hooks/usePWAInstall";
import { Moon, Sun } from "lucide-react";

export default function AppearanceSettings() {
    const { darkMode, toggleTheme } = useTheme();
    const { install, canInstall } = usePWAInstall();

    return (
        <div className="surface border border-theme rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <p className="text-[color:var(--text)] font-medium">
                        {darkMode ? "Dark Mode" : "Light Mode"}
                    </p>

                    <p className="text-[color:var(--text-secondary)] text-sm mt-1">
                        Toggle between light and dark theme.
                    </p>
                </div>

                <button
                    onClick={toggleTheme}
                    className="w-20 h-10 rounded-full p-1 surface-secondary border border-theme shrink-0"
                >
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-transform duration-300 ${
                            darkMode
                                ? "translate-x-10 bg-indigo-600"
                                : "translate-x-0 bg-amber-400"
                        }`}
                    >
                        {darkMode ? (
                            <Moon size={16} />
                        ) : (
                            <Sun size={16} />
                        )}
                    </div>
                </button>
            </div>

            {canInstall && (
                <div className="pt-5 border-t border-theme flex justify-between items-center gap-4">
                    <div>
                        <p className="text-[color:var(--text)] font-medium">
                            Install App
                        </p>

                        <p className="text-[color:var(--text-secondary)] text-sm mt-1">
                            Install Fitness Monolith for offline
                            access on your device.
                        </p>
                    </div>

                    <button
                        onClick={install}
                        className="bg-green-600 hover:bg-green-700 rounded-xl px-5 py-3 text-white font-medium flex items-center gap-2 shrink-0"
                    >
                        <Download size={18} />
                        Install Fitness App
                    </button>
                </div>
            )}
        </div>
    );
}