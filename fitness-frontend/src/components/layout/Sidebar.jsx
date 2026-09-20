import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Activity,
    BarChart3,
    Sparkles,
    User,
    Settings,
} from "lucide-react";

const menus = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Activities", path: "/activities", icon: Activity },
    { title: "Analytics", path: "/analytics", icon: BarChart3 },
    { title: "Recommendations", path: "/recommendations", icon: Sparkles },
    { title: "Profile", path: "/profile", icon: User },
    { title: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-72 surface border-r border-theme min-h-screen p-6 shrink-0">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-10 flex items-center gap-2">
                Fitness Monolith
            </h2>

            <nav className="space-y-2 overflow-y-auto">
                {menus.map((menu) => (
                    <NavLink key={menu.path} to={menu.path}>
                        {({ isActive }) => (
                            <span
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                                        : "text-[color:var(--text-secondary)] hover:bg-blue-500/10 hover:text-[color:var(--text)]"
                                }`}
                            >
                                <menu.icon
                                    className={`w-5 h-5 ${
                                        isActive
                                            ? "text-white"
                                            : "text-[color:var(--text-secondary)]"
                                    }`}
                                    strokeWidth={2}
                                />
                                {menu.title}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}