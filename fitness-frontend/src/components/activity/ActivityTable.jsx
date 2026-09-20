export default function ActivityTable({ activities }) {
    return (
        <>
            {/* Desktop */}
            <div className="hidden lg:block surface border border-theme rounded-2xl overflow-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 surface-secondary text-[color:var(--text-secondary)]">
                    <tr>
                        <th className="p-4">Activity</th>
                        <th className="p-4">Calories</th>
                        <th className="p-4">Minutes</th>
                        <th className="p-4">Date</th>
                    </tr>
                    </thead>

                    <tbody>
                    {activities.map((activity) => (
                        <tr
                            key={activity.id}
                            className="border-t border-theme"
                        >
                            <td className="p-4 text-[color:var(--text)]">
                                {activity.activityType}
                            </td>

                            <td className="p-4 text-orange-400">
                                {activity.caloriesBurned}
                            </td>

                            <td className="p-4 text-blue-400">
                                {activity.durationMinutes}
                            </td>

                            <td className="p-4 text-[color:var(--text-secondary)]">
                                {activity.activityDate}
                            </td>
                        </tr>
                    ))}

                    {activities.length === 0 && (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center text-[color:var(--text-secondary)] p-10"
                            >
                                No Activities Found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden space-y-4">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="surface border border-theme rounded-2xl p-5"
                    >
                        <h2 className="text-[color:var(--text)] font-bold">
                            {activity.activityType}
                        </h2>

                        <p className="text-orange-400 mt-2">
                            Calories : {activity.caloriesBurned}
                        </p>

                        <p className="text-blue-400">
                            Duration : {activity.durationMinutes} mins
                        </p>

                        <p className="text-[color:var(--text-secondary)]">
                            {activity.activityDate}
                        </p>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="text-center text-[color:var(--text-secondary)] p-10 surface border border-theme rounded-2xl">
                        No Activities Found.
                    </div>
                )}
            </div>
        </>
    );
}