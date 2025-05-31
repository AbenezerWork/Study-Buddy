
import React from 'react';
import { MultipleChoiceQuestion } from '../types';

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
          const isSelected = selectedAnswer === index;
          const isCorrect = mcq.correctAnswerIndex === index;
          
          let buttonClass = `
            w-full text-left p-3 sm:p-3.5 rounded-lg border text-sm sm:text-base transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform active:scale-98
          `;

          if (showFeedback) {
            if (isSelected) {
              buttonClass += isCorrect 
                ? ' bg-green-500 border-green-600 text-white scale-105 shadow-md' 
                : ' bg-red-500 border-red-600 text-white scale-105 shadow-md';
            } else if (isCorrect) {
              buttonClass += ' bg-green-100 border-green-300 text-green-800';
            } else {
              buttonClass += ' bg-slate-100 border-slate-300 text-slate-600 cursor-not-allowed opacity-80';
            }
          } else {
            buttonClass += isSelected 
              ? ' bg-indigo-500 border-indigo-600 text-white shadow-md ring-2 ring-indigo-400' 
              : ' bg-white border-slate-300 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400';
          }

          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={showFeedback}
              className={buttonClass}
              aria-pressed={isSelected}
            >
              <span className="font-medium mr-1.5">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          );
        })}
      </div>
      {showFeedback && mcq.explanation && (
        <div className={`mt-5 sm:mt-6 p-3 sm:p-4 rounded-lg text-xs sm:text-sm ${selectedAnswer === mcq.correctAnswerIndex ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border`}>
          <h4 className="font-semibold mb-1 text-sm">Explanation:</h4>
          <p className="leading-relaxed">{mcq.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizView;
