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
            className={`bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl font-semibold w-full shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/25 ${className}`}
            {...props}
        >
            {loading ? "Please Wait..." : children}
        </AnimatedButton>
    );
}