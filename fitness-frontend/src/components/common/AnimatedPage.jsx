import { motion } from "framer-motion";
import { pageVariants } from "../../animations/pageVariants";

export default function AnimatedPage({ children }) {
    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}