'use client';

import { useState } from 'react';
import { QuizResult, CandidateMatch, shareResults, saveQuizResults } from '@/utilities';
import { questions } from '@/questions';

interface ResultsCardProps {
  results: QuizResult;
  onRetakeQuiz: () => void;
}

export default function ResultsCard({ results, onRetakeQuiz }: ResultsCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const letters = ["A", "B", "C", "D"];

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    shareResults(results, platform);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const topCandidate = results.candidateMatches[0];
  const secondCandidate = results.candidateMatches[1];

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-200 via-slate-50 to-red-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Jersey City Mayoral Match Results
          </h1>
          <p className="text-xl text-gray-600">
            You answered {results.answeredQuestions} out of {results.totalQuestions} questions
          </p>
        </div>

        {/* Top Match */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-green-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Top Match</h2>
            <div className="text-6xl font-bold text-green-600 mb-4">
              {topCandidate.matchPercentage}%
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <img 
              src={topCandidate.imageUrl} 
              alt={topCandidate.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
            />
          </div>
          
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{topCandidate.name}</h3>
            <p className="text-gray-600 mb-4">{topCandidate.bio}</p>
            <p className="text-sm text-gray-500">
              {topCandidate.matchingAnswers} out of {topCandidate.totalPossibleMatches} possible matches
            </p>
          </div>

          {/* Candidate Actions */}
          <div className="flex justify-center space-x-4 mb-6">
            {topCandidate.website && (
              <a 
                href={topCandidate.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Visit Website
              </a>
            )}
            <button 
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Share on Twitter
            </button>
          </div>
        </div>

        {/* All Candidates */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">All Candidates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.candidateMatches.map((candidate, index) => (
              <div 
                key={candidate.candidate}
                className={`p-6 rounded-lg border-2 transition-all ${
                  index === 0 
                    ? 'border-green-500 bg-green-50' 
                    : index === 1 
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <img 
                    src={candidate.imageUrl} 
                    alt={candidate.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                  />
                  <h3 className="font-bold text-lg mb-1">{candidate.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {candidate.matchPercentage}%
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {candidate.matchingAnswers}/{candidate.totalPossibleMatches} matches
                  </p>
                  {candidate.website && (
                    <a 
                      href={candidate.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Learn More →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sharing Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Share Your Results</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button 
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Share on Twitter
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Share on Facebook
            </button>
            <button 
              onClick={() => handleShare('linkedin')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Share on LinkedIn
            </button>
            <button 
              onClick={handleCopyLink}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* View My Answers Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Review Your Answers</h2>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              {showAnswers ? 'Hide My Answers' : 'View My Answers'}
            </button>
          </div>
          
          {showAnswers && (
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = results.answers[question.id];
                const isAnswered = userAnswer !== undefined;
                
                return (
                  <div 
                    key={question.id}
                    className={`p-6 rounded-lg border-2 ${
                      isAnswered 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {isAnswered ? (
                          <span className="text-green-600 text-sm font-medium">✓ Answered</span>
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">○ Skipped</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{question.question}</p>
                    
                    {isAnswered ? (
                      <div className="bg-white p-4 rounded border">
                        <p className="text-sm text-gray-600 mb-2">Your Answer:</p>
                        <p className="font-medium text-gray-900 mb-3">
                          {letters[userAnswer]}. {question.options[userAnswer].text}
                        </p>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Candidates who agree:</p>
                          <div className="flex flex-wrap gap-2">
                            {question.options[userAnswer].candidates.map((candidate, candidateIndex) => (
                              <span 
                                key={candidateIndex}
                                className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                              >
                                {candidate}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded border">
                        <p className="text-gray-500 italic">No answer selected</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Follow-up Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Learn More About Candidates</h3>
              <p className="text-gray-600 mb-4">
                Visit candidate websites and social media to learn more about their platforms.
              </p>
              <div className="space-y-2">
                {results.candidateMatches.slice(0, 3).map(candidate => (
                  <a 
                    key={candidate.candidate}
                    href={candidate.website || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {candidate.name} →
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Get Involved</h3>
              <p className="text-gray-600 mb-4">
                Make sure you're registered to vote and stay informed about the election.
              </p>
              <div className="space-y-2">
                <a 
                  href="https://voter.svrs.nj.gov/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Register to Vote →
                </a>
                <a 
                  href="https://www.nj.gov/state/elections/voter-registration.shtml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Check Voter Status →
                </a>
                <a 
                  href="https://www.jcnj.org/elections" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium"
                >
                  Jersey City Elections →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button 
            onClick={onRetakeQuiz}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors mr-4"
          >
            Retake Quiz
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Back to Top
          </button>
        </div>
      </div>
    </div>
  );
} 