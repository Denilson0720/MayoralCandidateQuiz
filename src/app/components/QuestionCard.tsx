'use client';
import { useState } from 'react';
import { candidateValues } from '@/utilities';
import { CandidateExplanation } from '@/questions';

interface Option {
  text: string;
  candidates: string[];
  explanations?: CandidateExplanation[];
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  subtopic: string;
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
const letters = ["A", "B", "C", "D","E"]

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
  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Helper function to parse explanation text and separate quotes from remarks
  const parseExplanation = (explanation: string, remark?: string) => {
    // Check if the text contains a quote (starts with a quote and has a closing quote)
    // Handle both regular quotes and escaped quotes
    const quoteMatch = explanation.match(/^[""]([^""]+)[""]\s*(.+)$/);
    if (quoteMatch) {
      return {
        quote: quoteMatch[1],
        remark: remark || quoteMatch[2].trim()
      };
    }
    // If no quote pattern found, return the entire text as a remark
    return {
      quote: null,
      remark: explanation
    };
  };

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
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Main Content Area - Left aligned */}
        <div className="flex flex-col items-start justify-center">
          {/* Subtopic Label */}
          <div className="uppercase tracking-wide text-xs p-2 rounded-md bg-black text-white mb-4">{question.subtopic}</div>
          
          {/* Question */}
          <div className="flex flex-row mb-6 w-full">
            <span className="rounded-full p-4 bg-black text-white w-8 h-8 flex items-center justify-center">
              {questionNumber}
            </span>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 px-4 py-2 flex items-center">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 w-full max-w-3xl flex flex-col justify-start items-start">
            {question.options.map((option, index) => (
              <div key={index} className="w-full">
                <div
                  onClick={() => handleOptionClick(index)}
                  className={`flex items-center w-full text-left py-4 md:py-6 px-3 md:px-4 rounded-t-lg border-2 border-black transition-all duration-300 ease-in-out hover:cursor-pointer ${
                    selectedAnswer === index
                      ? 'bg-green-200'
                      : 'hover:border-gray-300 hover:bg-gray-50 bg-white'
                  } ${selectedAnswer === index && expandedOption === index ? 'rounded-b-none' : 'rounded-b-lg'}`}
                >
                  <div className='font-bold text-lg md:text-xl p-1'>{letters[index]}</div>
                  <div className="pl-2 md:pl-4 font-medium text-sm md:text-base">{option.text}</div>
                </div>
                
                {/* Dropdown for candidates - improved animation */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out bg-white border-x-2 border-b-2 rounded-b-lg border-t-0
                    ${expandedOption === index 
                      ? 'max-h-[2000px] opacity-100 translate-y-0' 
                      : 'max-h-0 opacity-0 translate-y-2'
                    }
                  `}
                >
                  <div className="p-3 md:p-4">
                    <h4 className="text-xs md:text-sm font-semibold mb-2">
                      Candidates who agree:
                    </h4>
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                      {option.candidates.map((candidate, candidateIndex) => (
                        <div key={`${index}-${candidateIndex}`} className='flex flex-col items-center'>
                          {candidateValues[candidate] ? (
                            <>
                              <img 
                                className='w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg' 
                                src={candidateValues[candidate].url} 
                                alt={candidateValues[candidate].name}
                                onError={(e) => {
                                  // Fallback for broken images
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <span className="text-black text-xs md:text-sm font-medium mt-1 text-center">
                                {candidateValues[candidate].name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className='w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-lg flex items-center justify-center'>
                                <span className="text-white text-xs md:text-sm font-bold">Multiple</span>
                              </div>
                              <span className="text-black text-xs md:text-sm font-medium mt-1 text-center">
                                {candidate}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* More Details Button */}
                    {option.explanations && option.explanations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setShowDetails(showDetails === index ? null : index)}
                          className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium transition-colors"
                        >
                          {showDetails === index ? 'Hide Details' : 'More Details'}
                        </button>
                        
                        {/* Details Dropdown */}
                        {showDetails === index && (
                          <div className="mt-3 space-y-3">
                            {option.explanations.map((explanation, expIndex) => (
                              <div key={expIndex} className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-start gap-3">
                                  {candidateValues[explanation.candidate] ? (
                                    <img 
                                      className='w-8 h-8 rounded-full object-cover flex-shrink-0' 
                                      src={candidateValues[explanation.candidate].url} 
                                      alt={candidateValues[explanation.candidate].name}
                                    />
                                  ) : (
                                    <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0'>
                                      <span className="text-white text-xs font-bold">M</span>
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h5 className="text-xs md:text-sm font-semibold text-gray-900 mb-1">
                                      {candidateValues[explanation.candidate] ? candidateValues[explanation.candidate].name : explanation.candidate}
                                    </h5>
                                    {(() => {
                                      const parsed = parseExplanation(explanation.explanation, explanation.remark);
                                      console.log('Explanation debug:', {
                                        explanation: explanation.explanation,
                                        remark: explanation.remark,
                                        hasRemark: !!explanation.remark,
                                        parsed
                                      });
                                      return (
                                        <div className="space-y-2">
                                          {parsed.quote && (
                                            <blockquote className="text-xs md:text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                                              "{parsed.quote}"{explanation.remark ? ` -- ${explanation.remark}` : ''}
                                            </blockquote>
                                          )}
                                          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                            {parsed.remark}
                                          </p>
                                          {explanation.sourceLink && explanation.sourceTitle && (
                                            <div className="mt-2">
                                              <a 
                                                href={explanation.sourceLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
                                              >
                                                {explanation.sourceTitle}
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row justify-start gap-3 md:gap-4 px-4">
            {isLast && onSubmit && (
              <button
                onClick={onSubmit}
                className="px-6 md:px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors border-2 border-green-700 hover:border-green-800 text-sm md:text-base w-full sm:w-auto"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}