import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearWinnerBanner } from './raceSlice';

function WinnerBanner(): React.ReactElement | null {
  const dispatch = useAppDispatch();
  const { winnerId, winnerName, winnerTime } = useAppSelector((state) => state.race);

  if (winnerId === null || winnerName === null) {
    return null;
  }

  const handleDismiss = (): void => {
    dispatch(clearWinnerBanner());
  };

  return (
    <div className="winner-banner" role="alert">
      <span className="winner-banner-text">
        🏆 {winnerName} wins! ({winnerTime?.toFixed(2)}s)
      </span>
      <button type="button" className="winner-banner-close" onClick={handleDismiss}>
        ✕
      </button>
    </div>
  );
}

export default WinnerBanner;
