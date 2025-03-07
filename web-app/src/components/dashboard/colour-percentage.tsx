import React from 'react';
import { cn } from '~/lib/utils';

interface ColorizedPercentageProps {
  value: number;
  className?: string;
  showPercentSign?: boolean;
  invert?: boolean;
}

export const getColorForPercentage = (value: number, invert: boolean = false): string => {
  // Ensure the value is within 0-100 range
  const clampedValue = Math.max(0, Math.min(100, value));
  
  // Use inverted value for color selection if invert is true
  const colorValue = invert ? 100 - clampedValue : clampedValue;
  
  // Color ranges based on shadcn/ui color palette
  if (colorValue < 25) {
    return 'text-destructive'; // Red for low values (0-24%)
  } else if (colorValue < 50) {
    return 'text-orange-500'; // Orange for below average values (25-49%)
  } else if (colorValue < 75) {
    return 'text-amber-500'; // Amber for above average values (50-74%)
  } else if (colorValue < 90) {
    return 'text-lime-500'; // Light green for good values (75-89%)
  } else {
    return 'text-green-500'; // Green for excellent values (90-100%)
  }
};

export const ColourPercentage: React.FC<ColorizedPercentageProps> = ({
  value,
  className,
  showPercentSign = true,
  invert = false,
}) => {
  const colorClass = getColorForPercentage(value, invert);
  
  return (
    <div className={cn('font-bold', colorClass, className)}>
      {value}
      {showPercentSign && '%'}
    </div>
  );
};

export default ColourPercentage;
