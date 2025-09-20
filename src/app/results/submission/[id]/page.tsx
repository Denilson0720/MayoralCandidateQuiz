'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { questions } from '@/questions';
import { candidateValues } from '@/utilities';

interface QuizSubmission {
  id: string;
  completion_percentage: number;
  candidate_matches: Array<{
    candidate: string;
    matchPercentage: number;
    matchingAnswers: number;
    totalPossibleMatches: number;
  }>;
  answered_questions: number;
  total_questions: number;
  selected_categories: string[];
  mussab_match_percentage?: number;
  email?: string;
  answers: Record<number, number[]>;
  submitted_at: string;
}

interface QuizAnswer {
  question_id: number;
  option_id: number;
  option_label: string;
  option_text: string;
  candidate_names: string[];
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissionData = async () => {
      try {
        const submissionId = params.id as string;
        
        // Fetch submission details
        const submissionResponse = await fetch(`/api/submission/${submissionId}`);
        if (!submissionResponse.ok) {
          throw new Error('Failed to fetch submission data');
        }
        
        const submissionData = await submissionResponse.json();
        setSubmission(submissionData);
        
        // Fetch detailed answers
        const answersResponse = await fetch(`/api/submission/${submissionId}/answers`);
        if (answersResponse.ok) {
          const answersData = await answersResponse.json();
          setQuizAnswers(answersData);
        }
        
      } catch (error) {
        console.error('Error loading submission data:', error);
        setError('Failed to load submission data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSubmissionData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error || 'Submission not found'}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const topCandidate = submission.candidate_matches[0];
  const submittedDate = new Date(submission.submitted_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quiz Submission #{submission.id}
              </h1>
              <p className="text-gray-600">
                Submitted on {submittedDate}
                {submission.email && (
                  <span className="ml-4 text-blue-600">
                    📧 {submission.email}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              ← Back to Analytics
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Results Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Top Match */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Top Match</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {topCandidate.matchPercentage}%
              </div>
              <div className="text-lg font-medium text-green-800">
                {topCandidate.candidate}
              </div>
            </div>

            {/* Mussab Match */}
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Mussab Match</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {submission.mussab_match_percentage !== null && submission.mussab_match_percentage !== undefined 
                  ? `${submission.mussab_match_percentage}%` 
                  : 'N/A'}
              </div>
              <div className="text-lg font-medium text-blue-800">
                Mussab Ali
              </div>
            </div>

            {/* Completion */}
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Completion</h3>
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {submission.completion_percentage}%
              </div>
              <div className="text-sm text-gray-600">
                {submission.answered_questions} of {submission.total_questions} questions
              </div>
            </div>

            {/* Categories */}
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Priority Categories</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {submission.selected_categories.length}
              </div>
              <div className="text-sm text-purple-600">
                {submission.selected_categories.join(', ') || 'None selected'}
              </div>
            </div>
          </div>
        </div>

        {/* All Candidates */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Candidates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submission.candidate_matches.map((candidate, index) => (
              <div 
                key={candidate.candidate}
                className={`p-4 rounded-lg border-2 ${
                  index === 0 
                    ? 'border-green-500 bg-green-50' 
                    : index === 1 
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <img 
                    src={candidateValues[candidate.candidate]?.url || '/placeholder.png'} 
                    alt={candidate.candidate}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                  />
                  <h3 className="font-bold text-base mb-1">{candidate.candidate}</h3>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {candidate.matchPercentage}%
                  </div>
                  <p className="text-xs text-gray-600">
                    {candidate.matchingAnswers} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Flow */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Flow</h2>
          <div className="space-y-6">
            {questions.map((question, questionIndex) => {
              const userAnswers = submission.answers[question.id] || [];
              const hasAnswered = userAnswers.length > 0;
              
              return (
                <div 
                  key={question.id} 
                  className={`border rounded-lg p-4 ${
                    hasAnswered ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        hasAnswered ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {questionIndex + 1}
                      </div>
                      <div className="ml-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                          {question.subtopic}
                        </div>
                        <h3 className="font-medium text-gray-900">{question.question}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        hasAnswered ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {hasAnswered ? 'Answered' : 'Skipped'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswers.includes(optionIndex);
                      const letters = ["A", "B", "C", "D", "E"];
                      
                      return (
                        <div 
                          key={optionIndex}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            isSelected 
                              ? 'border-green-500 bg-green-100' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                              isSelected 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {letters[optionIndex]}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{option.text}</div>
                              {option.candidates.length > 0 && (
                                <div className="text-sm text-gray-600 mt-1">
                                  Candidates: {option.candidates.join(', ')}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <div className="ml-3">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
