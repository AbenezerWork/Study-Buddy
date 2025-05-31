
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface NavigationControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  currentIndex: number;
  totalItems: number;
  itemTypeLabel: string; // e.g., "Card" or "Question"
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  currentIndex,
  totalItems,
  itemTypeLabel,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between mt-6 sm:mt-8 w-full max-w-md sm:max-w-lg mx-auto px-1">
      <button
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 text-sm sm:text-base"
        aria-label="Previous item"
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        Previous
      </button>
      <span className="text-slate-600 font-medium text-xs sm:text-sm">
        {itemTypeLabel} {currentIndex + 1} / {totalItems}
      </span>
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 text-sm sm:text-base"
        aria-label="Next item"
      >
        Next
        <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default NavigationControls;
