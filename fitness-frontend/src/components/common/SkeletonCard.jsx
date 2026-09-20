export default function SkeletonCard() {
    return (
        <div className="surface border border-theme rounded-2xl p-5 animate-pulse">
            <div className="h-4 w-24 surface-secondary rounded"></div>

            <div className="h-8 w-32 surface-secondary rounded mt-6"></div>

            <div className="h-3 w-20 surface-secondary rounded mt-5"></div>
        </div>
    );
}