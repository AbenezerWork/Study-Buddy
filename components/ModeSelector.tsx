
import React from 'react';
import { StudyMode } from '../types';
import { BookOpenIcon, QuestionMarkCircleIcon, LightBulbIcon } from './icons';

interface ModeSelectorProps {
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  disabled: boolean;
}

const ModeButton: React.FC<{
  mode: StudyMode;
  currentMode: StudyMode;
  onClick: () => void;
  label: string;
  icon: React.ReactElement<{ className?: string }>; // Changed this line
  disabled: boolean;
}> = ({ mode, currentMode, onClick, label, icon, disabled }) => {
  const isActive = currentMode === mode;
  return (
    <button
      onClick={onClick}
      disabled={disabled && !isActive} 
      className={`
        flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-md 
        text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        transform active:scale-95
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg scale-105' 
          : 'bg-white text-slate-700 hover:bg-indigo-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70'
        }
      `}
      aria-pressed={isActive}
    >
      {React.cloneElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
      {label}
    </button>
  );
};


const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-200 rounded-lg shadow mb-4 sm:mb-6">
      <ModeButton
        mode={StudyMode.FLASHCARD}
        currentMode={currentMode}
        onClick={() => onSelectMode(StudyMode.FLASHCARD)}
        label="Flashcards"
        icon={<BookOpenIcon />}
        disabled={disabled}
      />
      <ModeButton
        mode={StudyMode.QUIZ}
        currentMode={currentMode}
        onClick={() => onSelectMode(StudyMode.QUIZ)}
        label="Quiz"
        icon={<QuestionMarkCircleIcon />}
        disabled={disabled}
      />
      <ModeButton
        mode={StudyMode.STUDY_MATERIAL}
        currentMode={currentMode}
        onClick={() => onSelectMode(StudyMode.STUDY_MATERIAL)}
        label="Study Material"
        icon={<LightBulbIcon />}
        disabled={disabled}
      />
    </div>
  );
};

export default ModeSelector;
