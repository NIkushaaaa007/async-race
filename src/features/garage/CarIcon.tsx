import React from 'react';

interface CarIconProps {
  color: string;
  translateX: number;
  transitionMs: number;
  onTransitionEnd?: () => void;
}

function CarIcon({
  color,
  translateX,
  transitionMs,
  onTransitionEnd,
}: CarIconProps): React.ReactElement {
  return (
    <svg
      className="car-icon"
      width="60"
      height="30"
      viewBox="0 0 60 30"
      fill={color}
      role="img"
      aria-label="car"
      onTransitionEnd={onTransitionEnd}
      style={{
        transform: `translateX(${translateX}px)`,
        transition: transitionMs > 0 ? `transform ${transitionMs}ms linear` : 'none',
      }}
    >
      <rect x="5" y="10" width="50" height="12" rx="3" />
      <circle cx="15" cy="24" r="5" fill="#333" />
      <circle cx="45" cy="24" r="5" fill="#333" />
    </svg>
  );
}

CarIcon.defaultProps = {
  onTransitionEnd: undefined,
};

export default CarIcon;
