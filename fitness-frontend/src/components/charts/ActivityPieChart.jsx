import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import useTheme from "../../hooks/useTheme";

const COLORS = ["#2563EB", "#EA580C", "#16A34A", "#7C3AED", "#EC4899"];

export default function ActivityPieChart({ data }) {
    const { darkMode } = useTheme();

    const labelColor = darkMode ? "#CBD5E1" : "#334155";

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Activity Distribution
            </h2>

            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={{ fill: labelColor, fontSize: 12 }}
                    >
                        {data.map((item, index) => (
                            <Cell
                                key={item.name}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip />
                    <Legend wrapperStyle={{ color: labelColor }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}