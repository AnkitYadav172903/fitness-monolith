import { Flame, Activity, Timer, Trophy } from "lucide-react";

export default function UserStats({
                                      calories,
                                      workouts,
                                      minutes,
                                  }) {
    const cards = [
        {
            title: "Calories Burned",
            value: calories,
            icon: Flame,
            color: "text-orange-400",
        },
        {
            title: "Workouts",
            value: workouts,
            icon: Activity,
            color: "text-blue-400",
        },
        {
            title: "Minutes",
            value: minutes,
            icon: Timer,
            color: "text-green-400",
        },
        {
            title: "Weekly Streak",
            value: "7 Days",
            icon: Trophy,
            color: "text-yellow-400",
        },
    ];

    return (
        <div className="grid lg:grid-cols-4 gap-5">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="surface border border-theme rounded-2xl p-5"
                >
                    <card.icon className={card.color} size={28} />

                    <p className="text-[color:var(--text-secondary)] mt-4">
                        {card.title}
                    </p>

                    <h2 className="text-[color:var(--text)] text-3xl font-bold mt-2">
                        {card.value}
                    </h2>
                </div>
            ))}
        </div>
    );
}