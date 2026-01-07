import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({ currentPage, totalPages, onPageChange, totalResults, showingCount }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) end = 4;
        if (currentPage >= totalPages - 2) start = totalPages - 3;

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111] p-6 rounded-2xl border border-gray-900 shadow-xl gap-4 mt-6">
            <p className="text-sm text-gray-400 order-2 sm:order-1">
                Showing <span className="text-white font-bold">{showingCount}</span> of <span className="text-white font-bold">{totalResults}</span> results
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:border-gray-800 transition-all mr-1"
                    title="Previous Page"
                >
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((p, i) => (
                        p === "..." ? (
                            <span key={`dots-${i}`} className="px-2 text-gray-600 font-bold">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`min-w-[42px] h-[42px] rounded-xl font-bold text-sm transition-all ${currentPage === p
                                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                        : "bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-gray-500"
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:border-gray-800 transition-all ml-1"
                    title="Next Page"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
