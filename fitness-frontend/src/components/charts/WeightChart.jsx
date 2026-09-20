import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import useTheme from "../../hooks/useTheme";

export default function WeightChart({ data }) {
    const { darkMode } = useTheme();

    const textColor = darkMode ? "#CBD5E1" : "#334155";
    const gridColor = darkMode ? "#334155" : "#E2E8F0";

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Workout Duration
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke={gridColor} />

                    <XAxis dataKey="day" stroke={textColor} />

                    <Tooltip />

                    <Bar dataKey="minutes" fill="#22C55E" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}