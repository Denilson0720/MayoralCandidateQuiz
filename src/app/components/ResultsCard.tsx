'use client';

import { useState, useRef } from 'react';
import { QuizResult, shareResults } from '@/utilities';
import { questions } from '@/questions';
import { categories } from './CategorySelection';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsCardProps {
  results: QuizResult;
  onRetakeQuiz: () => void;
}

export default function ResultsCard({ results, onRetakeQuiz }: ResultsCardProps) {
  const [copied, setCopied] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const letters = ["A", "B", "C", "D"];
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Create a simplified PDF content manually
      const pdfContent = document.createElement('div');
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.top = '0';
      pdfContent.style.width = '800px';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.padding = '40px';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.color = 'black';
      document.body.appendChild(pdfContent);

      // Create PDF content manually to avoid CSS issues
      const topCandidate = results.candidateMatches[0];
      
      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px; color: #000;">Your Jersey City Mayoral Match Results</h1>
          <p style="font-size: 18px; color: #666; margin-bottom: 20px;">You answered ${results.answeredQuestions} out of ${results.totalQuestions} questions</p>
        </div>

        <div style="border: 2px solid #22c55e; border-radius: 8px; padding: 30px; margin-bottom: 30px; background-color: #f0fdf4;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #000;">Your Top Match</h2>
            <div style="font-size: 48px; font-weight: bold; color: #22c55e; margin-bottom: 20px;">${topCandidate.matchPercentage}%</div>
          </div>
          
          <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #000;">${topCandidate.name}</h3>
            <p style="font-size: 16px; color: #666; margin-bottom: 10px;">${topCandidate.bio}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; color: #000;">All Candidates</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            ${results.candidateMatches.map((candidate, index) => `
              <div style="padding: 20px; border-radius: 8px; border: 2px solid ${index === 0 ? '#22c55e' : index === 1 ? '#3b82f6' : '#d1d5db'}; background-color: ${index === 0 ? '#f0fdf4' : index === 1 ? '#eff6ff' : '#f9fafb'};">
                <div style="text-align: center;">
                  <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 10px; color: #000;">${candidate.name}</h3>
                  <div style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 10px;">${candidate.matchPercentage}%</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Generate PDF
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `jersey-city-mayoral-quiz-results-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(pdfContent);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const topCandidate = results.candidateMatches[0];

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-200 via-slate-50 to-red-200 py-4 md:py-8">
      <div ref={resultsRef} className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Your Jersey City Mayoral Match Results
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            You answered {results.answeredQuestions} out of {results.totalQuestions} questions
          </p>
          {results.selectedCategories && results.selectedCategories.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Your Priority Areas (Weighted 2x):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.selectedCategories.map((category) => {
                  const categoryInfo = categories.find(c => c.id === category);
                  return (
                    <span key={category} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {categoryInfo?.name || category}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Top Match */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8 border-2 border-green-500">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Your Top Match</h2>
            <div className="text-4xl md:text-6xl font-bold text-green-600 mb-3 md:mb-4">
              {topCandidate.matchPercentage}%
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <img 
              src={topCandidate.imageUrl} 
              alt={topCandidate.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-green-500"
            />
          </div>
          
          <div className="text-center mb-4 md:mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{topCandidate.name}</h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{topCandidate.bio}</p>
          </div>

          {/* Candidate Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            {topCandidate.website && (
              <a 
                href={topCandidate.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base text-center"
              >
                Visit Website
              </a>
            )}
            <button 
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Share on Twitter
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Download Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Save Your Results</h2>
            <p className="text-gray-600 mb-6">Download a PDF copy of your quiz results to keep for reference</p>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg flex items-center gap-3 mx-auto"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Results PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* All Candidates */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">All Candidates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {results.candidateMatches.map((candidate, index) => (
              <div 
                key={candidate.candidate}
                className={`p-4 md:p-6 rounded-lg border-2 transition-all ${
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
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto mb-2 md:mb-3"
                  />
                  <h3 className="font-bold text-base md:text-lg mb-1">{candidate.name}</h3>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    {candidate.matchPercentage}%
                  </div>
                  {candidate.website && (
                    <a 
                      href={candidate.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium"
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
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8 hidden">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Share Your Results</h2>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <button 
              onClick={() => handleShare('twitter')}
              className="bg-blue-400 hover:bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Share on Twitter
            </button>
            <button 
              onClick={() => handleShare('facebook')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Share on Facebook
            </button>
            <button 
              onClick={() => handleShare('linkedin')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              Share on LinkedIn
            </button>
            <button 
              onClick={handleCopyLink}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base flex items-center gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* View My Answers Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Review Your Answers</h2>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className="px-6 md:px-8 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors text-sm md:text-base"
            >
              {showAnswers ? 'Hide My Answers' : 'View My Answers'}
            </button>
          </div>
          
          {showAnswers && (
            <div className="space-y-4 md:space-y-6">
              {questions.map((question, index) => {
                const userAnswer = results.answers[question.id];
                const isAnswered = userAnswer !== undefined;
                
                return (
                  <div 
                    key={question.id}
                    className={`p-4 md:p-6 rounded-lg border-2 ${
                      isAnswered 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 md:mb-4">
                      <h3 className="font-semibold text-base md:text-lg text-gray-900">
                        Question {index + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {isAnswered ? (
                          <span className="text-green-600 text-xs md:text-sm font-medium">
                            ✓ Answered {Array.isArray(userAnswer) ? `(${userAnswer.length} selected)` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs md:text-sm font-medium">○ Skipped</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">{question.question}</p>
                    
                    {isAnswered ? (
                      <div className="bg-white p-3 md:p-4 rounded border">
                        <p className="text-xs md:text-sm text-gray-600 mb-2">Your Answers:</p>
                        <div className="space-y-2 md:space-y-3">
                          {Array.isArray(userAnswer) ? (
                            // Multiple selections
                            userAnswer.map((answerIndex, answerNum) => (
                              <div key={answerIndex} className="border-l-4 border-green-500 pl-3">
                                <p className="font-medium text-sm md:text-base text-gray-900">
                                  {letters[answerIndex]}. {question.options[answerIndex].text}
                                </p>
                                <div className="mt-1">
                                  <p className="text-xs text-gray-500 mb-1">Candidates who agree:</p>
                                  <div className="flex flex-wrap gap-1 md:gap-2">
                                    {question.options[answerIndex].candidates.map((candidate, candidateIndex) => (
                                      <span 
                                        key={candidateIndex}
                                        className="inline-block bg-blue-100 text-blue-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full"
                                      >
                                        {candidate}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Single selection (backward compatibility)
                            <div className="border-l-4 border-green-500 pl-3">
                              <p className="font-medium text-sm md:text-base text-gray-900">
                                {letters[userAnswer]}. {question.options[userAnswer].text}
                              </p>
                              <div className="mt-1">
                                <p className="text-xs text-gray-500 mb-1">Candidates who agree:</p>
                                <div className="flex flex-wrap gap-1 md:gap-2">
                                  {question.options[userAnswer].candidates.map((candidate, candidateIndex) => (
                                    <span 
                                      key={candidateIndex}
                                      className="inline-block bg-blue-100 text-blue-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full"
                                    >
                                      {candidate}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-3 md:p-4 rounded border">
                        <p className="text-sm md:text-base text-gray-500 italic">No answer selected</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Follow-up Actions */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">What&apos;s Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="text-center p-4 md:p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Learn More About Candidates</h3>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                Visit candidate websites and social media to learn more about their platforms.
              </p>
              <div className="space-y-1 md:space-y-2">
                {results.candidateMatches.slice(0, 3).map(candidate => (
                  <a 
                    key={candidate.candidate}
                    href={candidate.website || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                  >
                    {candidate.name} →
                  </a>
                ))}
              </div>
            </div>
            
            <div className="text-center p-4 md:p-6 border-2 border-gray-200 rounded-lg">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Get Involved</h3>
                              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                  Make sure you&apos;re registered to vote and stay informed about the election.
                </p>
              <div className="space-y-1 md:space-y-2">
                <a 
                  href="https://voter.svrs.nj.gov/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                >
                  Register to Vote →
                </a>
                <a 
                  href="https://www.nj.gov/state/elections/voter-registration.shtml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                >
                  Check Voter Status →
                </a>
                <a 
                  href="https://www.jcnj.org/elections" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                >
                  Jersey City Elections →
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <button 
              onClick={onRetakeQuiz}
              className="bg-red-600 hover:bg-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors w-full sm:w-auto"
            >
              Retake Quiz
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg transition-colors w-full sm:w-auto"
            >
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 