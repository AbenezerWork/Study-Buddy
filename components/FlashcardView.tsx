
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { RefreshCwIcon } from './icons';

interface FlashcardViewProps {
  flashcard: Flashcard;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false); // Reset flip state when flashcard changes
  }, [flashcard]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto perspective flex flex-col items-center">
      <div 
        className={`relative w-full h-72 sm:h-80 md:h-96 preserve-3d transition-transform duration-700 ease-in-out cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleFlip() : null}
        aria-label={`Flashcard: ${isFlipped ? 'Back, click to show front' : 'Front, click to show back'}.`}
        aria-live="polite"
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-xl p-4 sm:p-6 flex flex-col justify-center items-center text-center backface-hidden overflow-auto ring-1 ring-slate-200 group-hover:ring-indigo-400 transition-shadow group-focus:ring-2 group-focus:ring-indigo-500">
          <p className="text-slate-400 text-xs mb-1 sm:mb-2 uppercase tracking-wider">Front</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800">{flashcard.front}</p>
        </div>

        {/* Back of the card */}
        <div className="absolute w-full h-full bg-indigo-600 text-white rounded-xl shadow-xl p-4 sm:p-6 flex flex-col justify-center items-center text-center backface-hidden rotate-y-180 overflow-auto ring-1 ring-indigo-700 group-hover:ring-indigo-500 transition-shadow group-focus:ring-2 group-focus:ring-indigo-500">
           <p className="text-indigo-200 text-xs mb-1 sm:mb-2 uppercase tracking-wider">Back</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">{flashcard.back}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleFlip(); }}
        className="mt-4 sm:mt-6 mx-auto flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 text-sm sm:text-base"
        aria-label="Flip card"
      >
        <RefreshCwIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        Flip Card
      </button>
    </div>
  );
};

export default FlashcardView;
