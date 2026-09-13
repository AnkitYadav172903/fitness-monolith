const strengthSteps = [
    { label: "Weak", color: "bg-red-500", min: 1 },
    { label: "Fair", color: "bg-orange-500", min: 2 },
    { label: "Good", color: "bg-yellow-500", min: 3 },
    { label: "Strong", color: "bg-lime-500", min: 4 },
    { label: "Excellent", color: "bg-green-500", min: 5 },
];

const getScore = (password) => {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (password.length >= 12) score++;

    return score;
};

export default function PasswordStrength({ password }) {
    const score = getScore(password || "");
    const width = `${(score / 5) * 100}%`;
    const step = strengthSteps[score] || strengthSteps[0];

    return (
        <div className="space-y-1">
            <div className="h-2 surface-secondary border border-theme rounded-full overflow-hidden">
                <div
                    className={`h-full ${step.color} transition-all duration-500`}
                    style={{ width }}
                />
            </div>

            {score > 0 && (
                <p className="text-sm text-[color:var(--text-secondary)]">
                    Password Strength: {step.label}
                </p>
            )}
        </div>
    );
}