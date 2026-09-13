import { motion } from "framer-motion";
import { buttonVariants } from "../../animations/buttonVariants";

export default function AnimatedButton({ children, className, ...props }) {
    return (
        <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={className}
            {...props}
        >
            {children}
        </motion.button>
    );
}