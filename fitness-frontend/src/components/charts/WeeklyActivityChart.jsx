import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import useTheme from "../../hooks/useTheme";
import { chartTheme, tooltipStyle } from "../../utils/chartTheme";

export default function WeeklyActivityChart({ data }) {
    useTheme();
    const t = chartTheme();

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Weekly Activity
            </h2>

            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data}>
                    <CartesianGrid stroke={t.grid} strokeDasharray="3 3" />

                    <XAxis dataKey="day" stroke={t.text} tick={{ fontSize: 12 }} />

                    <Tooltip {...tooltipStyle()} />

                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke={t.primary}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: t.surface }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}