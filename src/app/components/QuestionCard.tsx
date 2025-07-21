'use client';
import { useState } from 'react';
import { candidateValues } from '@/utilities';

interface Option {
  text: string;
  candidates: string[];
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerSelect: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onSubmit?: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
}
const letters = ["A", "B", "C", "D"]

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onSkip,
  onSubmit,
  isFirst,
  isLast,
  canProceed
}: QuestionCardProps) {
  const [expandedOption, setExpandedOption] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedAnswer === index) {
      // If clicking the same option, toggle the dropdown
      setExpandedOption(expandedOption === index ? null : index);
    } else {
      // If clicking a different option, select it and expand its dropdown
      onAnswerSelect(index);
      setExpandedOption(index);
    }
  };

  return (
    <div className="h-screen text-center flex flex-col items-center justify-center bg-gradient-to-r from-cyan-200 from- via-slate-50 via-50% to-red-200">
        {/* Question */}
        <h2 className="w-[80%] text-2xl font-bold text-gray-900 mb-8">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="space-y-4 mb-8 w-full flex flex-col justify-center items-center">
          {question.options.map((option, index) => (
            <div key={index} className="w-[80%]">
              <div
                onClick={() => handleOptionClick(index)}
                className={`flex items-center w-full text-left py-6 px-4 rounded-t-lg border-2 border-black transition-all duration-300 ease-in-out hover:cursor-pointer ${
                  selectedAnswer === index
                    ? 'bg-green-200'
                    : 'hover:border-gray-300 hover:bg-gray-50 bg-white'
                } ${selectedAnswer === index && expandedOption === index ? 'rounded-b-none' : 'rounded-b-lg'}`}
              >
                <div className='font-bold text-xl p-1'>{letters[index]}</div>
                <div className="pl-4 font-medium">{option.text}</div>
              </div>
              
              {/* Dropdown for candidates - improved animation */}
              <div 
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out bg-white border-x-2 border-b-2 rounded-b-lg border-t-0
                  ${expandedOption === index 
                    ? 'max-h-96 opacity-100 translate-y-0' 
                    : 'max-h-0 opacity-0 translate-y-2'
                  }
                `}
              >
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Candidates who agree:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.candidates.map((candidate, candidateIndex) => (
                      <div key={`${index}-${candidateIndex}`} className='flex flex-col items-center'>
                        <img 
                          className='w-20 h-20 object-cover rounded-lg' 
                          src={candidateValues[candidate].url} 
                          alt={candidateValues[candidate].name}
                          onError={(e) => {
                            // Fallback for broken images
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <span className="text-black text-sm font-medium mt-1">
                          {candidateValues[candidate].name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-[80%] flex justify-center space-x-4">
          <button
            onClick={onSkip}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors border-2 border-yellow-600 hover:border-yellow-700"
          >
            Skip This Question
          </button>
          
          {isLast && onSubmit && (
            <button
              onClick={onSubmit}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors border-2 border-green-700 hover:border-green-800"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
  );
}