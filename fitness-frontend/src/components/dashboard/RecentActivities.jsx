import { motion } from "framer-motion";

export default function RecentActivities({
                                             activities,
                                         }) {
    const latest = [...activities].slice(0, 5);

    return (
        <div className="surface border border-theme rounded-3xl p-6">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-6">
                Recent Activities
            </h2>

            <div className="space-y-4">
                {latest.map((activity, index) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex justify-between border-b border-theme pb-3"
                    >
                        <div>
                            <h3 className="text-[color:var(--text)]">
                                {activity.activityType}
                            </h3>

                            <p className="text-[color:var(--text-secondary)] text-sm">
                                {activity.activityDate}
                            </p>
                        </div>

                        <p className="text-orange-400 font-semibold">
                            {activity.caloriesBurned} kcal
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}