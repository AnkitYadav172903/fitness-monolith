import { useEffect, useState } from "react";

export default function AccountSettings() {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "English";
    });

    const [unit, setUnit] = useState(() => {
        return localStorage.getItem("unit") || "Metric";
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem("unit", unit);
    }, [unit]);

    return (
        <div className="surface border border-theme rounded-2xl p-6 space-y-5">
            <h2 className="text-[color:var(--text)] text-xl font-bold">
                Account Preferences
            </h2>

            <div>
                <label className="text-[color:var(--text-secondary)]">
                    Language
                </label>

                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full mt-2 surface-secondary border border-theme text-[color:var(--text)] rounded-xl p-3"
                >
                    <option>English</option>
                    <option>Hindi</option>
                </select>
            </div>

            <div>
                <label className="text-[color:var(--text-secondary)]">
                    Measurement Unit
                </label>

                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full mt-2 surface-secondary border border-theme text-[color:var(--text)] rounded-xl p-3"
                >
                    <option>Metric</option>
                    <option>Imperial</option>
                </select>
            </div>
        </div>
    );
}