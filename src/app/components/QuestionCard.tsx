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

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 w-full max-w-3xl flex flex-col justify-start items-start">
            {question.options.map((option, index) => (
              <div key={index} className="w-full">
                <div
                  onClick={() => handleOptionClick(index)}
                  className={`flex flex-col items-center w-full text-left py-4 md:py-6 px-3 md:px-4 rounded-t-lg border-2 border-black transition-all duration-300 ease-in-out hover:cursor-pointer ${
                    selectedAnswers.includes(index)
                      ? 'bg-green-200'
                      : 'bg-white p-4 shadow-xl'
                  } ${selectedAnswers.includes(index) && expandedOption === index ? 'rounded-b-none' : 'rounded-b-lg'}`}
                >
                  <div className='flex items-center w-full'>
                    <div className='font-bold text-lg md:text-xl p-1'>{letters[index]}</div>
                    <div className="pl-2 md:pl-4 font-medium text-sm md:text-base flex-1">{option.text}</div>
                  </div>
                  <span className='text-sm font-medium md:text-base hover:underline hover:font-bold '  onClick={(e) => handleToggleDropdown(index, e)}>{expandedOption === index ? 'hide details -' : 'view details +'}</span>

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
                      <ExplanationDropdown
                        option={option as QuestionOption}
                        index={index}
                        showDetails={showDetails}
                        setShowDetails={setShowDetails}
                        candidateValues={candidateValues}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
}