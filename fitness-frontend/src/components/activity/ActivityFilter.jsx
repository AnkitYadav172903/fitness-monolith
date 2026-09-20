const types = [
    "ALL",
    "RUNNING",
    "WALKING",
    "GYM",
    "CYCLING",
    "YOGA",
];

export default function ActivityFilter({
                                           type,
                                           setType,
                                           sort,
                                           setSort,
                                       }) {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="surface-secondary text-[color:var(--text)] rounded-xl p-3 border border-theme outline-none focus:border-blue-500"
            >
                {types.map((item) => (
                    <option key={item}>{item}</option>
                ))}
            </select>

            <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="surface-secondary text-[color:var(--text)] rounded-xl p-3 border border-theme outline-none focus:border-blue-500"
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="caloriesHigh">Calories High → Low</option>
                <option value="caloriesLow">Calories Low → High</option>
            </select>
        </div>
    );
}