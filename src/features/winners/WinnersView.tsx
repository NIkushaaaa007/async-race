import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadWinners, setWinnersPage, setSort } from './winnersSlice';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import type { SortField } from '../../types';

function WinnersView(): React.ReactElement {
  const dispatch = useAppDispatch();
  const {
    winners, totalCount, currentPage, sortField, sortOrder, status,
  } = useAppSelector((state) => state.winners);

  useEffect(() => {
    dispatch(loadWinners({ page: currentPage, sortField, sortOrder }));
  }, [dispatch, currentPage, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(totalCount / WINNERS_PER_PAGE));

  const goToPage = (page: number): void => {
    dispatch(setWinnersPage(page));
  };

  const handleSortClick = (field: SortField): void => {
    if (sortField === field) {
      dispatch(setSort({ field, order: sortOrder === 'ASC' ? 'DESC' : 'ASC' }));
    } else {
      dispatch(setSort({ field, order: 'ASC' }));
    }
  };

  const sortIndicator = (field: SortField): string => {
    if (sortField !== field) return '';
    return sortOrder === 'ASC' ? ' ▲' : ' ▼';
  };

  return (
    <section>
      <h1>Winners ({totalCount})</h1>

      {status === 'idle' && winners.length === 0 && <p>No Winners Yet</p>}

      {winners.length > 0 && (
        <table className="winners-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Car</th>
              <th>Name</th>
              <th onClick={() => handleSortClick('wins')} className="sortable">
                Wins{sortIndicator('wins')}
              </th>
              <th onClick={() => handleSortClick('time')} className="sortable">
                Best time (s){sortIndicator('time')}
              </th>
            </tr>
          </thead>
          <tbody>
            {winners.map((winner, index) => (
              <tr key={winner.id}>
                <td>{(currentPage - 1) * WINNERS_PER_PAGE + index + 1}</td>
                <td>
                  <svg width="40" height="20" viewBox="0 0 60 30" fill={winner.color}>
                    <rect x="5" y="10" width="50" height="12" rx="3" />
                    <circle cx="15" cy="24" r="5" fill="#333" />
                    <circle cx="45" cy="24" r="5" fill="#333" />
                  </svg>
                </td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default WinnersView;