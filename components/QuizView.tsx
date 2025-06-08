
import React from 'react';
import { MultipleChoiceQuestion } from '../types';
import { CheckIcon, XMarkIcon } from './icons';

interface QuizViewProps {
  mcq: MultipleChoiceQuestion;
  onAnswerSelect: (optionIndex: number) => void;
  selectedAnswer: number | null;
  showFeedback: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({ mcq, onAnswerSelect, selectedAnswer, showFeedback }) => {
  return (
    <div className="w-full max-w-md sm:max-w-lg mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-800 mb-4 sm:mb-6 text-center">{mcq.question}</h2>
      <div className="space-y-2.5 sm:space-y-3">
        {mcq.options.map((option, index) => {
          const userPickedThisOption = selectedAnswer === index;
          const isCorrectOption = mcq.correctAnswerIndex === index;
          
          let buttonClass = `
            w-full text-left p-3 sm:p-3.5 rounded-lg border text-sm sm:text-base transition-all duration-200 ease-in-out
            flex items-center justify-between group
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform active:scale-98
          `;
          let iconElement = null;

          if (showFeedback) {
            if (userPickedThisOption) {
              if (isCorrectOption) {
                buttonClass += ' bg-green-500 border-green-600 text-white scale-105 shadow-md';
                iconElement = <CheckIcon className="w-5 h-5 text-white" />;
              } else {
                buttonClass += ' bg-red-500 border-red-600 text-white scale-105 shadow-md';
                iconElement = <XMarkIcon className="w-5 h-5 text-white" />;
              }
            } else if (isCorrectOption) {
              // Highlight the correct answer if user picked incorrectly or didn't pick
              buttonClass += ' bg-green-100 border-green-400 text-green-800 ring-2 ring-green-500 shadow-sm';
              iconElement = <CheckIcon className="w-5 h-5 text-green-700" />;
            } else {
              // Other incorrect options
              buttonClass += ' bg-slate-100 border-slate-300 text-slate-500 opacity-70 cursor-not-allowed';
            }
          } else {
            // Before feedback is shown (i.e., user is actively answering)
            buttonClass += userPickedThisOption 
              ? ' bg-indigo-500 border-indigo-600 text-white shadow-md ring-2 ring-indigo-400' 
              : ' bg-white border-slate-300 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400';
          }

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={showFeedback}
              className={buttonClass}
              aria-pressed={userPickedThisOption}
              aria-describedby={showFeedback && isCorrectOption ? `explanation-${mcq.id}` : undefined}
            >
              <span className="flex-grow">
                <span className="font-medium mr-1.5">{String.fromCharCode(65 + index)}.</span> {option}
              </span>
              {iconElement && <span className="ml-2 flex-shrink-0">{iconElement}</span>}
            </button>
          );
        })}
      </div>
      {showFeedback && mcq.explanation && (
        <div 
          id={`explanation-${mcq.id}`}
          className={`mt-5 sm:mt-6 p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${selectedAnswer === mcq.correctAnswerIndex ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border`}
        >
          <h4 className="font-semibold mb-1 text-sm">Explanation:</h4>
          <p className="leading-relaxed">{mcq.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizView;
