const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
];

export default function WeeklyCalendar({
                                           workoutDays,
                                       }) {
    return (
        <div className="surface border border-theme rounded-3xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-6">
                Weekly Calendar
            </h2>

            <div className="grid grid-cols-7 gap-3">
                {days.map((day) => (
                    <div
                        key={day}
                        className={`rounded-xl p-3 text-center transition ${
                            workoutDays.includes(day)
                                ? "bg-green-600 text-white"
                                : "surface-secondary border border-theme text-[color:var(--text-secondary)]"
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}