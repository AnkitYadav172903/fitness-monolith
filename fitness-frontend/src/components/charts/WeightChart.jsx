import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import useTheme from "../../hooks/useTheme";
import { chartTheme, tooltipStyle } from "../../utils/chartTheme";

export default function WeightChart({ data }) {
    useTheme();
    const t = chartTheme();

    return (
        <div className="surface border border-theme rounded-2xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-5">
                Workout Duration
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke={t.grid} strokeDasharray="3 3" />

                    <XAxis dataKey="day" stroke={t.text} tick={{ fontSize: 12 }} />

                    <Tooltip {...tooltipStyle()} />

                    <Bar
                        dataKey="minutes"
                        fill={t.success}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}