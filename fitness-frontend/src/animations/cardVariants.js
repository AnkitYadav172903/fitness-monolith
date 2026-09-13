export const containerVariants = {
    hidden: {},

    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

export const cardVariants = {
    hidden: {
        opacity: 0,
        y: 25,
        scale: 0.95,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.35,
        },
    },
};