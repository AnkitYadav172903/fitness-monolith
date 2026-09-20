const startOfDay = (date) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const calculateStreak = (activities) => {
    if (!activities.length) return 0;

    const loggedDays = new Set(
        activities.map((activity) => startOfDay(new Date(activity.activityDate)).getTime())
    );

    let cursor = startOfDay(new Date());

    if (!loggedDays.has(cursor.getTime())) {
        cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;

    while (loggedDays.has(cursor.getTime())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};