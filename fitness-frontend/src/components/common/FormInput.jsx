export default function FormInput({ label, name, register, error, ...props }) {
    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm text-[color:var(--text-secondary)]">
                    {label}
                </label>
            )}

            <input
                {...register(name)}
                {...props}
                className={`w-full rounded-xl p-3 surface-secondary border text-[color:var(--text)] outline-none transition focus:border-blue-500 ${
                    error ? "border-red-500" : "border-theme"
                }`}
            />

            {error && <p className="text-red-400 text-sm">{error.message}</p>}
        </div>
    );
}