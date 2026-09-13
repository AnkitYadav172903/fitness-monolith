import { motion } from "framer-motion";
import { cardVariants } from "../../animations/cardVariants";

export default function AnimatedCard({ children }) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{
                y: -6,
                boxShadow: "0 20px 35px rgba(37,99,235,.2)",
            }}
        >
            {children}
        </motion.div>
    );
}