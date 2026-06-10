import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-end w-full">
      <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:-translate-y-0 disabled:hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {pages.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-2 text-slate-400 font-medium tracking-widest">
                  ...
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isCurrent
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm hover:-translate-y-0.5"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 disabled:hover:shadow-none disabled:hover:-translate-y-0 disabled:hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
