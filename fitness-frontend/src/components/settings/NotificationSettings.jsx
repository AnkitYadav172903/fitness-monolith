import { useEffect, useState } from "react";

export default function NotificationSettings() {
    const [settings, setSettings] = useState(() => {
        return (
            JSON.parse(localStorage.getItem("notifications")) || {
                email: true,
                workoutReminder: true,
                recommendations: false,
            }
        );
    });

    useEffect(() => {
        localStorage.setItem(
            "notifications",
            JSON.stringify(settings)
        );
    }, [settings]);

    const toggle = (key) => {
        setSettings({
            ...settings,
            [key]: !settings[key],
        });
    };

    const Item = ({ label, keyName }) => (
        <div className="flex justify-between items-center py-4 border-b border-theme">
            <p className="text-[color:var(--text)]">{label}</p>

            <button
                onClick={() => toggle(keyName)}
                className={`w-14 h-7 rounded-full transition ${
                    settings[keyName]
                        ? "bg-green-600"
                        : "surface-secondary border border-theme"
                }`}
            >
                <div
                    className={`w-6 h-6 rounded-full bg-white shadow transition ${
                        settings[keyName]
                            ? "translate-x-7"
                            : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Notifications
            </h2>

            <Item label="Email Notifications" keyName="email" />

            <Item
                label="Workout Reminders"
                keyName="workoutReminder"
            />

            <Item
                label="Daily Recommendations"
                keyName="recommendations"
            />
        </div>
    );
}