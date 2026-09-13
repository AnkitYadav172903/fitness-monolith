export default function CaloriesRemaining({
                                              calories,
                                              goal,
                                          }) {
    const remaining = goal - calories;

    return (
        <div className="surface border border-theme rounded-3xl p-6">
            <h2 className="text-[color:var(--text)] font-bold text-xl">
                Calories Remaining
            </h2>

            <h1 className="text-green-500 text-5xl font-bold mt-5">
                {remaining > 0 ? remaining : 0}
            </h1>

            <p className="text-[color:var(--text-secondary)] mt-3">
                Goal : {goal}
            </p>
        </div>
    );
}