import { Grid } from "antd";
const { useBreakpoint } = Grid;
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const screens = useBreakpoint();

  const maxPageButtons = screens.md ? 10 : screens.sm ? 5 : 3;

  if (!totalPages || totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const buttonBaseClasses =
    "px-3.5 py-1.5 text-dark-text-primary rounded-md transition-colors font-medium";
  const inactiveButtonClasses = `${buttonBaseClasses} bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer`;
  const disabledButtonClasses = `${buttonBaseClasses} bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-tertiary dark:text-dark-text-tertiary opacity-50 cursor-not-allowed`;
  const activeButtonClasses = `${buttonBaseClasses} bg-blue-500 hover:bg-blue-600`;
  const navButtonClasses = (isDisabled) =>
    isDisabled
      ? disabledButtonClasses
      : `${buttonBaseClasses} bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer`;

  return (
    <div className="flex justify-center gap-2 text-sm">
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className={navButtonClasses(currentPage === 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={inactiveButtonClasses}
          >
            1
          </button>
          {startPage > 2 && (
            <span className="px-2 text-light-text-secondary dark:text-dark-text-secondary">
              ...
            </span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={
            currentPage === num ? activeButtonClasses : inactiveButtonClasses
          }
          title={`Go to page ${num}`}
        >
          {num}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-light-text-secondary dark:text-dark-text-secondary">
              ...
            </span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={inactiveButtonClasses}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        className={navButtonClasses(currentPage === totalPages)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
