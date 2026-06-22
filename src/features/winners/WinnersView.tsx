import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadWinners, setWinnersPage, setSort } from './winnersSlice';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import WinnersTable from './WinnersTable';
import Pagination from '../../components/Pagination';
import type { SortField } from '../../types';

function calculateTotalPages(totalCount: number): number {
  return Math.max(1, Math.ceil(totalCount / WINNERS_PER_PAGE));
}

function useWinnersHandlers(sortField: SortField, sortOrder: 'ASC' | 'DESC') {
  const dispatch = useAppDispatch();

  return {
    onPageChange: (page: number) => dispatch(setWinnersPage(page)),
    onSortClick: (field: SortField) => {
      const nextOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
      dispatch(setSort({ field, order: nextOrder }));
    },
  };
}

function WinnersView(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { winners, totalCount, currentPage, sortField, sortOrder, status } = useAppSelector(
    (state) => state.winners,
  );
  const handlers = useWinnersHandlers(sortField, sortOrder);
  const totalPages = calculateTotalPages(totalCount);

  useEffect(() => {
    dispatch(loadWinners({ page: currentPage, sortField, sortOrder }));
  }, [dispatch, currentPage, sortField, sortOrder]);

  return (
    <section>
      <h1>Winners ({totalCount})</h1>

      {status === 'idle' && winners.length === 0 && <p>No Winners Yet</p>}

      {winners.length > 0 && (
        <WinnersTable
          winners={winners}
          currentPage={currentPage}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortClick={handlers.onSortClick}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlers.onPageChange}
      />
    </section>
  );
}

export default WinnersView;
