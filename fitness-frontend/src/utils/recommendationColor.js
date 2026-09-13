export const difficultyColor = (level) => {
    switch (level) {
        case "BEGINNER":
            return "bg-green-600";
        case "INTERMEDIATE":
            return "bg-yellow-500";
        case "ADVANCED":
            return "bg-red-600";
        default:
            return "bg-slate-600";
    }
};

export const goalColor = (goal) => {
    switch (goal) {
        case "WEIGHT_LOSS":
            return "bg-pink-600";
        case "MUSCLE_GAIN":
            return "bg-blue-600";
        case "ENDURANCE":
            return "bg-purple-600";
        default:
            return "bg-cyan-600";
    }
};