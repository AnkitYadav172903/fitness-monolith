import { useNavigate } from "react-router-dom";

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Add Activity",
            path: "/activities",
            color: "bg-green-600",
        },
        {
            title: "Analytics",
            path: "/analytics",
            color: "bg-blue-600",
        },
        {
            title: "Recommendations",
            path: "/recommendations",
            color: "bg-purple-600",
        },
    ];

    return (
        <div className="grid md:grid-cols-3 gap-5">
            {actions.map((action) => (
                <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className={`${action.color} rounded-2xl p-6 text-white font-semibold text-lg hover:scale-105 transition`}
                >
                    {action.title}
                </button>
            ))}
        </div>
    );
}