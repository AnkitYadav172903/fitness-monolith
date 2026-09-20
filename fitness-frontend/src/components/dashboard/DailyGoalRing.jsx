import useTheme from "../../hooks/useTheme";
import { chartTheme } from "../../utils/chartTheme";

export default function DailyGoalRing({
                                          calories,
                                          goal,
                                      }) {
    useTheme();
    const t = chartTheme();

    const percent = Math.min(
        Math.round((calories / goal) * 100),
        100
    );

    return (
        <div className="surface border border-theme rounded-3xl p-6 text-center">
            <h2 className="text-[color:var(--text)] text-xl font-bold">
                Daily Goal
            </h2>

            <div className="relative w-44 h-44 mx-auto mt-6">
                <svg className="w-44 h-44 rotate-[-90deg]">
                    <circle
                        cx="88"
                        cy="88"
                        r="70"
                        style={{ stroke: "var(--border)" }}
                        strokeWidth="12"
                        fill="transparent"
                    />

                    <circle
                        cx="88"
                        cy="88"
                        r="70"
                        stroke={t.primary}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={
                            440 - (440 * percent) / 100
                        }
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <h1 className="text-4xl text-[color:var(--text)] font-bold">
                        {percent}%
                    </h1>

                    <p className="text-[color:var(--text-secondary)] text-sm">
                        {calories}/{goal}
                    </p>
                </div>
            </div>
        </div>
    );
}