export default function Pagination({
                                       totalPages,
                                       currentPage,
                                       setCurrentPage,
                                   }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {Array.from({ length: totalPages }).map(
                (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 rounded-lg transition ${
                            currentPage === index + 1
                                ? "bg-blue-600 text-white"
                                : "surface-secondary border border-theme text-[color:var(--text-secondary)]"
                        }`}
                    >
                        {index + 1}
                    </button>
                )
            )}
        </div>
    );
}