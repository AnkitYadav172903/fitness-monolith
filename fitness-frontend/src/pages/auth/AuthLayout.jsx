import AnimatedPage from "../../components/common/AnimatedPage";

const FEATURES = [
    {
        title: "Track everything",
        description:
            "Calories, workouts, water and streaks — all in one clean dashboard.",
    },
    {
        title: "Smart recommendations",
        description:
            "AI-powered activity suggestions tailored to your progress.",
    },
    {
        title: "Works offline",
        description:
            "Progressive Web App that keeps your data working anywhere.",
    },
];

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[color:var(--background)] flex">
            {/* Brand illustration panel (desktop only) */}
            <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 text-white flex-col justify-between p-12 shrink-0">
                <div className="space-y-10">
                    <div className="text-2xl font-bold tracking-tight">
                        Fitness Monolith
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl font-bold leading-tight">
                            Your complete fitness companion.
                        </h1>
                        <p className="text-blue-100 text-lg">
                            One dashboard for calories, workouts, hydration and
                            progress streaks.
                        </p>
                    </div>

                    <ul className="space-y-5">
                        {FEATURES.map((feature) => (
                            <li
                                key={feature.title}
                                className="flex items-start gap-3"
                            >
                                <span className="mt-2 h-2 w-2 rounded-full bg-blue-300 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        {feature.title}
                                    </p>
                                    <p className="text-blue-200 text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-blue-200 text-sm">
                    © {new Date().getFullYear()} Fitness Monolith
                </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center px-5 py-10">
                <AnimatedPage>
                    <div className="w-full max-w-md">{children}</div>
                </AnimatedPage>
            </div>
        </div>
    );
}