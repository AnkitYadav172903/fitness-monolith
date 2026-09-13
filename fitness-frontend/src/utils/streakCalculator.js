export const calculateStreak = (activities) => {
    if (!activities.length) return 0;

    const dates = [
        ...new Set(
            activities.map((a) => a.activityDate)
        ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
        const current = new Date(dates[i]);
        const previous = new Date(dates[i + 1]);

        const diff =
            (current - previous) / (1000 * 60 * 60 * 24);

        if (diff === 1) streak++;
        else break;
    }

    return streak;
};