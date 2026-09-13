import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { sidebarVariants } from "../../animations/sidebarVariants";

const menus = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Activities", path: "/activities" },
    { title: "Analytics", path: "/analytics" },
    { title: "Recommendations", path: "/recommendations" },
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
];

export default function MobileSidebar({ open, setOpen }) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        onClick={() => setOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-40"
                    />

                    <motion.aside
                        variants={sidebarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed left-0 top-0 bottom-0 w-72 surface z-50 p-6"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-[color:var(--text)] text-xl font-bold">
                                Fitness Monolith
                            </h2>

                            <button onClick={() => setOpen(false)}>
                                <X className="text-[color:var(--text)]" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {menus.map((menu) => (
                                <NavLink
                                    key={menu.path}
                                    to={menu.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `block px-4 py-3 rounded-xl transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-[color:var(--text-secondary)] hover:bg-slate-700/30 hover:text-[color:var(--text)]"
                                        }`
                                    }
                                >
                                    {menu.title}
                                </NavLink>
                            ))}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}