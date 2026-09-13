import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageLayout from "../components/layout/PageLayout";

import CaloriesChart from "../components/charts/CaloriesChart";
import WeightChart from "../components/charts/WeightChart";
import ActivityPieChart from "../components/charts/ActivityPieChart";

import ProgressCard from "../components/dashboard/ProgressCard";
import GoalCard from "../components/dashboard/GoalCard";

import AnimatedCard from "../components/common/AnimatedCard";
import AnimatedPage from "../components/common/AnimatedPage";
import Loader from "../components/common/Loader";

import { getActivities } from "../services/activityService";
import { getDayName } from "../utils/dateFormatter";

import { containerVariants } from "../animations/cardVariants";

export default function Analytics() {
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({
        calories: 0,
        workouts: 0,
        minutes: 0,
        averageCalories: 0,
    });

    const [weeklyCalories, setWeeklyCalories] = useState([]);
    const [weeklyMinutes, setWeeklyMinutes] = useState([]);
    const [pieData, setPieData] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await getActivities();

            let calories = 0;
            let minutes = 0;

            const weekly = {};
            const activityCount = {};

            data.forEach((activity) => {
                calories += activity.caloriesBurned;
                minutes += activity.durationMinutes;

                const day = getDayName(activity.activityDate);

                if (!weekly[day]) {
                    weekly[day] = {
                        day,
                        calories: 0,
                        minutes: 0,
                    };
                }

                weekly[day].calories += activity.caloriesBurned;
                weekly[day].minutes += activity.durationMinutes;

                activityCount[activity.activityType] =
                    (activityCount[activity.activityType] || 0) + 1;
            });

            setSummary({
                calories,
                workouts: data.length,
                minutes,
                averageCalories:
                    data.length === 0 ? 0 : Math.round(calories / data.length),
            });

            setWeeklyCalories(Object.values(weekly));
            setWeeklyMinutes(Object.values(weekly));

            const pie = Object.keys(activityCount).map((key) => ({
                name: key,
                value: activityCount[key],
            }));

            setPieData(pie);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-[color:var(--text)] text-3xl font-bold">
                            Analytics Dashboard
                        </h1>

                        <p className="text-[color:var(--text-secondary)] mt-2">
                            Track your fitness performance with visual analytics.
                        </p>
                    </motion.div>

                    {/* Summary Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    >
                        <AnimatedCard>
                            <div className="surface border border-theme rounded-xl p-5">
                                <p className="text-[color:var(--text-secondary)]">
                                    Calories Burned
                                </p>

                                <h2 className="text-orange-500 text-3xl font-bold mt-3">
                                    {summary.calories}
                                </h2>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard>
                            <div className="surface border border-theme rounded-xl p-5">
                                <p className="text-[color:var(--text-secondary)]">
                                    Total Workouts
                                </p>

                                <h2 className="text-blue-500 text-3xl font-bold mt-3">
                                    {summary.workouts}
                                </h2>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard>
                            <div className="surface border border-theme rounded-xl p-5">
                                <p className="text-[color:var(--text-secondary)]">
                                    Workout Minutes
                                </p>

                                <h2 className="text-green-600 text-3xl font-bold mt-3">
                                    {summary.minutes}
                                </h2>
                            </div>
                        </AnimatedCard>

                        <AnimatedCard>
                            <div className="surface border border-theme rounded-xl p-5">
                                <p className="text-[color:var(--text-secondary)]">
                                    Average Calories
                                </p>

                                <h2 className="text-pink-500 text-3xl font-bold mt-3">
                                    {summary.averageCalories}
                                </h2>
                            </div>
                        </AnimatedCard>
                    </motion.div>

                    {/* Progress */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <AnimatedCard>
                            <ProgressCard percentage={78} />
                        </AnimatedCard>

                        <AnimatedCard>
                            <GoalCard completed={summary.workouts} target={20} />
                        </AnimatedCard>
                    </motion.div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <CaloriesChart data={weeklyCalories} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <WeightChart data={weeklyMinutes} />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <ActivityPieChart data={pieData} />
                    </motion.div>
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}