import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import useTheme from "../../hooks/useTheme";
import { chartTheme, tooltipStyle } from "../../utils/chartTheme";

export default function ActivityPieChart({ data }) {
    useTheme();
    const t = chartTheme();

    const COLORS = [t.primary, t.info, t.success, t.warning, t.danger];

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
                        label={{ fill: t.text, fontSize: 12 }}
                    >
                        {data.map((item, index) => (
                            <Cell
                                key={item.name}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>

                    <Tooltip {...tooltipStyle()} />
                    <Legend wrapperStyle={{ color: t.text, fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}