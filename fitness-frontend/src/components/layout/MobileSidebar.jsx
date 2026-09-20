import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    LayoutDashboard,
    Activity,
    BarChart3,
    Sparkles,
    User,
    Settings,
} from "lucide-react";

import { sidebarVariants } from "../../animations/sidebarVariants";

const menus = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Activities", path: "/activities", icon: Activity },
    { title: "Analytics", path: "/analytics", icon: BarChart3 },
    { title: "Recommendations", path: "/recommendations", icon: Sparkles },
    { title: "Profile", path: "/profile", icon: User },
    { title: "Settings", path: "/settings", icon: Settings },
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
                        className="fixed left-0 top-0 bottom-0 w-72 surface z-50 p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-[color:var(--text)] text-xl font-bold">
                                Fitness Monolith
                            </h2>

                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="w-10 h-10 flex items-center justify-center rounded-xl surface-secondary border border-theme"
                            >
                                <X className="text-[color:var(--text)]" />
                            </button>
                        </div>

                        <nav className="space-y-2 overflow-y-auto">
                            {menus.map((menu) => (
                                <NavLink
                                    key={menu.path}
                                    to={menu.path}
                                    onClick={() => setOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                                : "text-[color:var(--text-secondary)] hover:bg-blue-500/10 hover:text-[color:var(--text)]"
                                        }`
                                    }
                                >
                                    <menu.icon className="w-5 h-5" strokeWidth={2} />
                                    {menu.title}
                                </NavLink>
                            ))}
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}