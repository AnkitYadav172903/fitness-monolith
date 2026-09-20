import AnimatedButton from "./AnimatedButton";

export default function SubmitButton({
    loading,
    disabled,
    className = "",
    children,
    ...props
}) {
    return (
        <AnimatedButton
            type="submit"
            disabled={disabled || loading}
            className={`bg-blue-600 disabled:opacity-50 text-white p-3 rounded-xl font-semibold w-full ${className}`}
            {...props}
        >
            {loading ? "Please Wait..." : children}
        </AnimatedButton>
    );
}