import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  disabled = false,
  onPageChange,
}: PaginationProps): React.ReactElement {
  return (
    <div className="pagination">
      <button
        type="button"
        disabled={currentPage <= 1 || disabled}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>
      <span>
        Page {currentPage} / {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages || disabled}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}

Pagination.defaultProps = {
  disabled: false,
};

export default Pagination;
