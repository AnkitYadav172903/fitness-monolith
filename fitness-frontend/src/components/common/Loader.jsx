import SkeletonCard from "./SkeletonCard";

export default function Loader() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((card) => (
                <SkeletonCard key={card} />
            ))}
        </div>
    );
}