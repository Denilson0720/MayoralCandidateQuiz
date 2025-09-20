import React, { useState, useEffect } from 'react';
import { CandidateExplanation, Option as QuestionOption } from '@/questions';

interface CandidateInfo {
  url: string;
  name: string;
}

interface ExplanationDropdownProps {
  option: QuestionOption;
  index: number;
  showDetails: number | null;
  setShowDetails: (index: number | null) => void;
  candidateValues: Record<string, CandidateInfo>;
  isExpanded: boolean;
}

const ExplanationDropdown: React.FC<ExplanationDropdownProps> = ({
  option,
  index,
  showDetails,
  setShowDetails,
  candidateValues,
  isExpanded,
}) => {
  // Local state to track if user has explicitly hidden details for this option
  const [userHiddenDetails, setUserHiddenDetails] = useState(false);

  // Reset userHiddenDetails when the option is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setUserHiddenDetails(false);
    }
  }, [isExpanded]);
  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <button
        onClick={() => {
          // Toggle the userHiddenDetails state
          setUserHiddenDetails(!userHiddenDetails);
          console.log(option.explanations);
        }}
        className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium transition-colors"
      >
        {userHiddenDetails ? 'More Details' : 'Hide Details'}
      </button>
      {/* Details Dropdown */}
      {!userHiddenDetails && (showDetails === index || isExpanded) && option.explanations && option.explanations.length > 0 && (
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
                  <div className="space-y-2">
                  {explanation.explanation && (
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {explanation.explanation}
                      </p>
                    )}
                    {explanation.quote && (
                      <blockquote className="text-xs md:text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                        "{explanation.quote}"{explanation.remark ? ` -- ${explanation.remark}` : ''}
                      </blockquote>
                    )}
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
                    {/* OPTIONAL ADDITIONAL LINKS */}
                    {explanation.addtionaLinks && explanation.addtionaLinks.length > 0 && (
                      <div className="mt-2 flex flex-col gap-1">
                        {explanation.addtionaLinks.map((link, index) => (
                          <a key={index} href={link.link} target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-blue-600 hover:text-blue-800 underline font-medium transition-colors">
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplanationDropdown;