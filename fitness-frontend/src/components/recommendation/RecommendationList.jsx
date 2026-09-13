import { motion } from "framer-motion";

import RecommendationCard from "./RecommendationCard";
import EmptyState from "../common/EmptyState";
import AnimatedCard from "../common/AnimatedCard";
import { containerVariants } from "../../animations/cardVariants";

export default function RecommendationList({
                                               recommendations,
                                           }) {
    if (recommendations.length === 0) {
        return (
            <EmptyState
                title="No Recommendations Available"
                subtitle="Try changing your fitness goal."
            />
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {recommendations.map((item) => (
                <AnimatedCard key={item.id}>
                    <RecommendationCard recommendation={item} />
                </AnimatedCard>
            ))}
        </motion.div>
    );
}