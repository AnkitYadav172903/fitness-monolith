import {
    Flame,
    Timer,
    Activity,
} from "lucide-react";

export default function TodaySummary({
                                         calories,
                                         workouts,
                                         minutes,
                                     }) {
    const items = [
        {
            icon: Flame,
            label: "Calories",
            value: calories,
            color: "text-orange-400",
        },
        {
            icon: Activity,
            label: "Workouts",
            value: workouts,
            color: "text-blue-400",
        },
        {
            icon: Timer,
            label: "Minutes",
            value: minutes,
            color: "text-green-400",
        },
    ];

    return (
        <div className="surface border border-theme rounded-3xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-6">
                Today's Summary
            </h2>

            <div className="space-y-5">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className="flex justify-between items-center"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={item.color} />

                            <p className="text-[color:var(--text)]">
                                {item.label}
                            </p>
                        </div>

                        <h3 className="text-[color:var(--text)] font-bold">
                            {item.value}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
}