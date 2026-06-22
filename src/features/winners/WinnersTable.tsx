import React from 'react';
import { WINNERS_PER_PAGE } from '../../utils/constants';
import type { WinnerWithCar, SortField } from '../../types';

interface WinnersTableProps {
  winners: WinnerWithCar[];
  currentPage: number;
  sortField: SortField;
  sortOrder: 'ASC' | 'DESC';
  onSortClick: (field: SortField) => void;
}

function getSortIndicator(
  field: SortField,
  sortField: SortField,
  sortOrder: 'ASC' | 'DESC',
): string {
  if (sortField !== field) return '';
  return sortOrder === 'ASC' ? ' ▲' : ' ▼';
}

function WinnersTable({
  winners,
  currentPage,
  sortField,
  sortOrder,
  onSortClick,
}: WinnersTableProps): React.ReactElement {
  return (
    <table className="winners-table">
      <thead>
        <tr>
          <th>№</th>
          <th>Car</th>
          <th>Name</th>
          <th className="sortable">
            <button type="button" onClick={() => onSortClick('wins')}>
              Wins{getSortIndicator('wins', sortField, sortOrder)}
            </button>
          </th>
          <th className="sortable">
            <button type="button" onClick={() => onSortClick('time')}>
              Best time (s){getSortIndicator('time', sortField, sortOrder)}
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner, index) => (
          <tr key={winner.id}>
            <td>{(currentPage - 1) * WINNERS_PER_PAGE + index + 1}</td>
            <td>
              <svg
                width="40"
                height="20"
                viewBox="0 0 60 30"
                fill={winner.color}
                role="img"
                aria-label={`${winner.name} car icon`}
              >
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
  );
}

export default WinnersTable;
