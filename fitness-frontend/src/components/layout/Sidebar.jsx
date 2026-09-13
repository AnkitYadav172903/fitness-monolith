import { NavLink } from "react-router-dom";

const menus = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Activities", path: "/activities" },
    { title: "Analytics", path: "/analytics" },
    { title: "Recommendations", path: "/recommendations" },
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-72 surface border-r border-theme min-h-screen p-6 shrink-0">
            <h2 className="text-[color:var(--text)] text-xl font-bold mb-10">
                Fitness Monolith
            </h2>

            <nav className="space-y-4">
                {menus.map((menu) => (
                    <NavLink
                        key={menu.path}
                        to={menu.path}
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
            </nav>
        </aside>
    );
}