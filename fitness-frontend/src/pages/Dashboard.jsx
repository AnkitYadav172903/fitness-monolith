import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageLayout from "../components/layout/PageLayout";

import HeroBanner from "../components/dashboard/HeroBanner";
import DailyGoalRing from "../components/dashboard/DailyGoalRing";
import WaterTracker from "../components/dashboard/WaterTracker";
import StreakCard from "../components/dashboard/StreakCard";
import CaloriesRemaining from "../components/dashboard/CaloriesRemaining";
import TodaySummary from "../components/dashboard/TodaySummary";
import RecentActivities from "../components/dashboard/RecentActivities";
import WeeklyCalendar from "../components/dashboard/WeeklyCalendar";
import AchievementCard from "../components/dashboard/AchievementCard";
import QuickActions from "../components/dashboard/QuickActions";
import WeeklyActivityChart from "../components/charts/WeeklyActivityChart";

import AnimatedCard from "../components/common/AnimatedCard";
import AnimatedPage from "../components/common/AnimatedPage";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import useAuth from "../hooks/useAuth";
import { getActivities } from "../services/activityService";

import { containerVariants } from "../animations/cardVariants";
import { handleApiError } from "../utils/apiErrorHandler";
import { calculateStreak } from "../utils/streakCalculator";

const DAILY_GOAL = 800;

function Dashboard() {
    const { user } = useAuth();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [summary, setSummary] = useState({
        calories: 0,
        workouts: 0,
        minutes: 0,
    });

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setError("");
            setLoading(true);

            const data = await getActivities();

            setActivities(data);

            let calories = 0;
            let minutes = 0;

            data.forEach((activity) => {
                calories += activity.caloriesBurned;
                minutes += activity.durationMinutes;
            });

            setSummary({
                calories,
                workouts: data.length,
                minutes,
            });

            const weekly = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => ({
                    day,
                    calories: 0,
                })
            );

            data.forEach((activity) => {
                const date = new Date(activity.activityDate);
                const dayIndex = (date.getDay() + 6) % 7;

                weekly[dayIndex].calories += activity.caloriesBurned;
            });

            setChartData(weekly);
        } catch (error) {
            setError(handleApiError(error));
        } finally {
            setLoading(false);
        }
    };

    const streak = calculateStreak(activities);

    const workoutDays = chartData
        .filter((day) => day.calories > 0)
        .map((day) => day.day);

    if (loading) return <Loader />;

    if (error) {
        return (
            <ErrorMessage
                message={error}
                retry={loadDashboard}
            />
        );
    }

    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-8">
                    <HeroBanner user={user} />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-2 gap-6"
                    >
                        <AnimatedCard>
                            <DailyGoalRing
                                calories={summary.calories}
                                goal={DAILY_GOAL}
                            />
                        </AnimatedCard>

                        <AnimatedCard>
                            <WaterTracker />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid lg:grid-cols-2 gap-6"
                    >
                        <AnimatedCard>
                            <StreakCard streak={streak} />
                        </AnimatedCard>

                        <AnimatedCard>
                            <CaloriesRemaining
                                calories={summary.calories}
                                goal={DAILY_GOAL}
                            />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <TodaySummary
                                calories={summary.calories}
                                workouts={summary.workouts}
                                minutes={summary.minutes}
                            />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <WeeklyActivityChart data={chartData} />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <RecentActivities activities={activities} />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <WeeklyCalendar workoutDays={workoutDays} />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <AchievementCard workouts={summary.workouts} />
                        </AnimatedCard>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatedCard>
                            <QuickActions />
                        </AnimatedCard>
                    </motion.div>
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}

export default Dashboard;