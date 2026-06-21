import React from 'react';

interface RaceControlsProps {
  isRacing: boolean;
  onStartRace: () => void;
  onResetRace: () => void;
  onGenerateRandom: () => void;
}

function RaceControls({
  isRacing,
  onStartRace,
  onResetRace,
  onGenerateRandom,
}: RaceControlsProps): React.ReactElement {
  return (
    <div className="race-controls">
      <button type="button" disabled={isRacing} onClick={onStartRace}>
        Race
      </button>
      <button type="button" onClick={onResetRace}>
        Reset
      </button>
      <button type="button" disabled={isRacing} onClick={onGenerateRandom}>
        Generate 100 Cars
      </button>
    </div>
  );
}

export default RaceControls;
