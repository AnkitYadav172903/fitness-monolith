import { useState, useEffect } from "react";

import PageLayout from "../components/layout/PageLayout";
import Modal from "../components/common/Modal";
import AnimatedPage from "../components/common/AnimatedPage";
import AnimatedButton from "../components/common/AnimatedButton";

import ProfileCard from "../components/profile/ProfileCard";
import UserStats from "../components/profile/UserStats";
import BMICard from "../components/profile/BMICard";
import AvatarUpload from "../components/profile/AvatarUpload";
import EditProfileModal from "../components/profile/EditProfileModal";

import useAuth from "../hooks/useAuth";
import { getActivities } from "../services/activityService";
import { getProfile } from "../services/profileService";

export default function Profile() {
    const { user } = useAuth();

    const [profile, setProfile] = useState({
        ...user,
        height: 170,
        weight: 70,
    });

    const [stats, setStats] = useState({
        calories: 0,
        workouts: 0,
        minutes: 0,
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        loadStats();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
        } catch {
        }
    };

    const loadStats = async () => {
        const activities = await getActivities();

        let calories = 0;
        let minutes = 0;

        activities.forEach((activity) => {
            calories += activity.caloriesBurned;
            minutes += activity.durationMinutes;
        });

        setStats({
            calories,
            workouts: activities.length,
            minutes,
        });
    };

    const saveProfile = (updatedProfile) => {
        setProfile(updatedProfile);
        setOpen(false);
    };

    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-[color:var(--text)] text-3xl font-bold">
                            My Profile
                        </h1>

                        <AnimatedButton
                            onClick={() => setOpen(true)}
                            className="bg-blue-600 px-5 py-3 rounded-xl text-white"
                        >
                            Edit Profile
                        </AnimatedButton>
                    </div>

                    <ProfileCard user={profile} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <AvatarUpload />

                        <div className="lg:col-span-2">
                            <BMICard
                                height={profile.height}
                                weight={profile.weight}
                            />
                        </div>
                    </div>

                    <UserStats
                        calories={stats.calories}
                        workouts={stats.workouts}
                        minutes={stats.minutes}
                    />

                    <Modal
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        title="Edit Profile"
                    >
                        <EditProfileModal
                            user={profile}
                            onSave={saveProfile}
                        />
                    </Modal>
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}