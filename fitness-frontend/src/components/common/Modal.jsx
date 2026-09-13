import { AnimatePresence, motion } from "framer-motion";

import { modalVariants } from "../../animations/modalVariants";

export default function Modal({ isOpen, onClose, title, children }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="surface border border-theme rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[color:var(--text)] text-2xl font-bold">
                                {title}
                            </h2>

                            <button
                                onClick={onClose}
                                className="text-[color:var(--text-secondary)] text-xl hover:text-[color:var(--text)]"
                            >
                                ✕
                            </button>
                        </div>

                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}