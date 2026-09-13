import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import useTheme from "../../hooks/useTheme";

export default function CaloriesChart({ data }) {
    const { darkMode } = useTheme();

    const textColor = darkMode ? "#CBD5E1" : "#334155";
    const gridColor = darkMode ? "#334155" : "#E2E8F0";

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Calories Burned (Weekly)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid stroke={gridColor} />

                    <XAxis dataKey="day" stroke={textColor} />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke="#F97316"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}