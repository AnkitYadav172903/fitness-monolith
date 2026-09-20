const goals = [
    "ALL",
    "WEIGHT_LOSS",
    "MUSCLE_GAIN",
    "ENDURANCE",
];

export default function RecommendationFilter({
                                                 value,
                                                 onChange,
                                             }) {
    return (
        <div className="flex flex-wrap gap-3">
            {goals.map((goal) => (
                <button
                    key={goal}
                    onClick={() => onChange(goal)}
                    className={`px-5 py-2 rounded-full transition ${
                        value === goal
                            ? "bg-blue-600 text-white"
                            : "surface-secondary border border-theme text-[color:var(--text-secondary)]"
                    }`}
                >
                    {goal.replace("_", " ")}
                </button>
            ))}
        </div>
    );
}