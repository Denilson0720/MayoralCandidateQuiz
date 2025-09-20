'use client';
import { useState } from 'react';
import { candidateValues } from '@/utilities';
import { CandidateExplanation, Option as QuestionOption } from '@/questions';
import ExplanationDropdown from './ExplanationDropdown';

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
  selectedAnswers?: number[];
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
  selectedAnswers = [],
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

  const handleOptionClick = (index: number) => {
    // Only select/deselect the option
    onAnswerSelect(index);
  };



  const handleToggleDropdown = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the main click handler
    setExpandedOption(expandedOption === index ? null : index);
  };

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Main Content Area - Left aligned */}
        {/* transparent background effect with blur */}
        <div className="flex flex-col items-start justify-center">
          {/* Subtopic Label */}
          <div className="uppercase tracking-wide text-xs p-2 rounded-md bg-black text-white mb-4">{question.subtopic}</div>
          
          {/* Question */}
          <div className="flex flex-row mb-6 w-full">

            <span className="rounded-md p-4 bg-black text-white w-8 h-8 flex items-center justify-center">
              {questionNumber}
            </span>
          {/* <div className="uppercase tracking-wide text-xs p-2 rounded-md bg-black text-white mb-4">{question.subtopic}</div> */}
            
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 px-4 flex items-center">
              {question.question}
            </h2>

          </div>

          {/* Multi-select instruction */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 You can select multiple options that you agree with. Click on an option to select/deselect it.
            </p>
          </div>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 You can view the candidates who agree with each option by clicking the expansion button.
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 w-full max-w-3xl flex flex-col justify-start items-start">
            {question.options.map((option, index) => (
              <div key={index} className="w-full">
                <div className="flex items-stretch w-full gap-2">
                  {/* Main Option Button */}
                  <div
                    onClick={() => handleOptionClick(index)}
                    className={`flex-1 flex items-center text-left py-4 md:py-6 px-3 md:px-4 rounded-lg border-2 border-black transition-all duration-300 ease-in-out hover:cursor-pointer ${
                      selectedAnswers.includes(index)
                        ? 'bg-green-200'
                        : 'bg-white shadow-xl'
                    }`}
                  >
                    <div className='font-bold text-lg md:text-xl p-1'>{letters[index]}</div>
                    <div className="pl-2 md:pl-4 font-medium text-sm md:text-base flex-1">{option.text}</div>
                  </div>
                  
                  {/* Details Toggle Button */}
                  <button
                    onClick={(e) => handleToggleDropdown(index, e)}
                    className="w-12 flex items-center justify-center rounded-lg border-2 border-black transition-all duration-300 ease-in-out hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-inset bg-yellow-50"
                    title={expandedOption === index ? 'Hide details' : 'View details'}
                    aria-label={expandedOption === index ? 'Hide candidate details' : 'View candidate details'}
                  >
                    <svg 
                      className={`w-5 h-5 text-yellow-700 hover:text-yellow-900 transition-transform duration-200 ${
                        expandedOption === index ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </button>
                </div>
                

                {/* Dropdown for candidates - improved animation */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out bg-white border-2 border-black rounded-lg mt-2
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
                      <ExplanationDropdown
                        option={option as QuestionOption}
                        index={index}
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                        candidateValues={candidateValues}
                        isExpanded={expandedOption === index}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Skip Question Option - Only show if no regular answers are selected */}
            {!selectedAnswers.some(answer => answer !== -1) && (
              <div className="w-full">
                <div className="flex items-stretch w-full">
                  <div
                    onClick={() => handleOptionClick(-1)} // Use -1 as skip indicator
                    className={`flex-1 flex items-center text-left py-4 md:py-6 px-3 md:px-4 rounded-l-lg border-2 border-r-0 border-black transition-all duration-300 ease-in-out hover:cursor-pointer ${
                      selectedAnswers.includes(-1)
                        ? 'bg-yellow-200'
                        : 'bg-white shadow-xl'
                    }`}
                  >
                    <div className='font-bold text-lg md:text-xl p-1'>⏭️</div>
                    <div className="pl-2 md:pl-4 font-medium text-sm md:text-base flex-1">Skip this question</div>
                  </div>
                  
                  {/* Details Toggle Button - matching regular options */}
                  <div className={`w-12 flex items-center justify-center border-2 border-l-0 border-black transition-all duration-300 ease-in-out ${
                    selectedAnswers.includes(-1) ? 'bg-yellow-200' : 'bg-yellow-50'
                  } rounded-r-lg`}>
                    <span className="text-xl font-bold text-yellow-700">⏭️</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}