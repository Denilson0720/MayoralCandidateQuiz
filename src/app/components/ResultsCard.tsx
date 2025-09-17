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
  const [showPolicyBreakdown, setShowPolicyBreakdown] = useState(true);
  const [showMussabAlignment, setShowMussabAlignment] = useState(true);
  const [showNoMatch, setShowNoMatch] = useState(true);
  const [isImageFlipped, setIsImageFlipped] = useState(false);
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
            How Well Do You Align With Mussab Ali?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            You answered {results.answeredQuestions} out of {results.totalQuestions} questions
          </p>
        </div>

        {/* Mussab Match Percentage - Primary Focus */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 mb-6 md:mb-8 border-4 border-blue-500 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Your Mussab Match</h2>
              <div className="text-6xl md:text-8xl font-bold text-blue-600 mb-4">
                {results.mussabMatchPercentage}%
              </div>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                {results.mussabMatchPercentage >= 80 ? "Excellent alignment! You share many of Mussab's views." :
                 results.mussabMatchPercentage >= 60 ? "Good alignment! You agree with Mussab on many key issues." :
                 results.mussabMatchPercentage >= 40 ? "Moderate alignment. You agree with Mussab on some important issues." :
                 "Limited alignment. You have different perspectives on many issues."}
              </p>
            </div>
            
            <div className="flex items-center justify-center mb-6 md:mb-8">
              <div 
                className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer"
                onMouseEnter={() => setIsImageFlipped(true)}
                onMouseLeave={() => setIsImageFlipped(false)}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-700 ease-in-out ${
                    isImageFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isImageFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front side - original image */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-full border-4 border-blue-500 shadow-lg"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img 
                      src="/mussab.png" 
                      alt="Mussab Ali"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  
                  {/* Back side - new image */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-full border-4 border-blue-500 shadow-lg"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <img 
                      src="https://res.cloudinary.com/duhazr5mo/image/upload/v1758079278/mussab_ellitb.jpg" 
                      alt="Mussab Ali"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Mussab Ali</h3>
              <p className="text-base md:text-lg text-gray-600 mb-4 max-w-2xl mx-auto">
                Community organizer and advocate for progressive policies in Jersey City. 
                Focused on housing affordability, public safety, education, and transportation improvements.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <a 
                href="https://www.ali2025.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-colors text-base md:text-lg text-center"
              >
                Learn More About Mussab
              </a>
              <button 
                onClick={() => handleShare('twitter')}
                className="bg-blue-400 hover:bg-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-colors text-base md:text-lg"
              >
                Share Your Match
              </button>
            </div>
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

        {/* Mussab Match Explanation */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-3 text-center">💡How Your Mussab Match is Calculated</h3>
          <div className="space-y-3 text-sm md:text-base text-blue-800">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <div>
                <strong>Base Scoring:</strong> Each question is worth 7.14% (100% ÷ 14 questions)
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <div>
                <strong>Full Match (7.14%):</strong> When you select only Mussab-only options for a question
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <div>
                <strong>Partial Match (3.57%):</strong> When you select a mix of Mussab-only and Mussab+others options
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
              <div>
                <strong>Priority Bonus:</strong> Partial matches in your priority areas get upgraded to full percentage (7.14%)
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">5</div>
              <div>
                <strong>Maximum Score:</strong> 100% if you match Mussab on all questions (with priority bonuses)
              </div>
            </div>
          </div>
        </div>


        {results.selectedCategories && results.selectedCategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
              <p className="text-lg text-green-800 font-medium mb-2 text-center">
                Your Priority Areas:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.selectedCategories.map((category) => {
                  const categoryInfo = categories.find(c => c.id === category);
                  return (
                    <span key={category} className="bg-green-100 text-green-800 text-md font-medium px-3 py-1 rounded-full">
                      {categoryInfo?.name || category}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        {/* Policy Alignment Breakdown */}
        <div className="space-y-6 md:space-y-8">
          {/* Mussab Alignment - Green */}
          {results.policyAlignment.mussabAlignment.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-green-900">
                  🟢 Your Alignment with Mussab
                </h3>
                <button
                  onClick={() => setShowMussabAlignment(!showMussabAlignment)}
                  className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-2"
                >
                  {showMussabAlignment ? 'Hide Section' : 'Show Section'}
                  <svg 
                    className={`w-4 h-4 transition-transform ${showMussabAlignment ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showMussabAlignment && (
                <div className="space-y-4 md:space-y-6">
                  {results.policyAlignment.mussabAlignment.map((alignment) => (
                  <div key={alignment.questionId} className="bg-white rounded-lg p-4 md:p-6 border border-green-200">
                    <div className="mb-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                        {alignment.subtopic}
                      </span>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        {alignment.question}
                      </h4>
                    </div>
                    
                    {/* User's Mussab selections */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-green-800 mb-2">✅ You selected:</p>
                      <div className="space-y-2">
                        {alignment.userMussabSelections.map((selection, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-3">
                            <p className="text-sm md:text-base text-gray-800">
                              {selection.optionText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What else Mussab can do */}
                    {alignment.mussabOtherOptions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-2">💡 What else Mussab can do for you:</p>
                        <div className="space-y-2">
                          {alignment.mussabOtherOptions.map((option, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-3">
                              <p className="text-sm md:text-base text-gray-800 font-bold">
                                {option.optionText}
                              </p>
                              {option.explanations && option.explanations.length > 0 && (
                                <div className="mt-2">
                                  {option.explanations
                                    .filter((explanation: any) => explanation.candidate === 'Mussab Ali')
                                    .map((explanation: any, expIndex: number) => (
                                      <div key={expIndex} className="text-xs md:text-sm text-gray-600 mt-1">
                                        {explanation.quote && (
                                          <blockquote className="italic border-l-2 border-green-300 pl-2 mb-1">
                                            "{explanation.quote}"
                                          </blockquote>
                                        )}
                                        {explanation.explanation && (
                                          <p>{explanation.explanation}</p>
                                        )}
                                        {explanation.sourceLink && (
                                          <a 
                                            href={explanation.sourceLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                                          >
                                            Learn more →
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Policies Where You Didn't Match - Red */}
          {results.policyAlignment.noMatch.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 md:p-6 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-red-900">
                  🔴 Policies Where You Didn't Match
                </h3>
                <button
                  onClick={() => setShowNoMatch(!showNoMatch)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                >
                  {showNoMatch ? 'Hide Section' : 'Show Section'}
                  <svg 
                    className={`w-4 h-4 transition-transform ${showNoMatch ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {showNoMatch && (
                <div className="space-y-4 md:space-y-6">
                  {results.policyAlignment.noMatch.map((noMatch) => (
                  <div key={noMatch.questionId} className="bg-white rounded-lg p-4 md:p-6 border border-red-200">
                    <div className="mb-3">
                      <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                        {noMatch.subtopic}
                      </span>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        {noMatch.question}
                      </h4>
                    </div>
                    
                    {/* User's selections */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-red-800 mb-2">❌ You selected:</p>
                      <div className="space-y-2">
                        {noMatch.userSelections.map((selection, index) => (
                          <div key={index} className="border-l-4 border-red-500 pl-3">
                            <p className="text-sm md:text-base text-gray-800">
                              {selection.optionText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mussab's options */}
                    <div>
                      <p className="text-sm font-medium text-green-800 mb-2">✅ Mussab's position:</p>
                      <div className="space-y-2">
                        {noMatch.mussabOptions.map((option, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-3">
                            <p className="text-sm md:text-base text-gray-800 font-bold">
                              {option.optionText}
                            </p>
                            {option.explanations && option.explanations.length > 0 && (
                              <div className="mt-2">
                                {option.explanations
                                  .filter((explanation: any) => explanation.candidate === 'Mussab Ali')
                                  .map((explanation: any, expIndex: number) => (
                                    <div key={expIndex} className="text-xs md:text-sm text-gray-600 mt-1">
                                      {explanation.quote && (
                                        <blockquote className="italic border-l-2 border-green-300 pl-2 mb-1">
                                          "{explanation.quote}"
                                        </blockquote>
                                      )}
                                      {explanation.explanation && (
                                        <p>{explanation.explanation}</p>
                                      )}
                                      {explanation.sourceLink && (
                                        <a 
                                          href={explanation.sourceLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 text-xs underline"
                                        >
                                          Learn more →
                                        </a>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* block that transitions to across all candidates section */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 my-10 text-center">View Your Match Across All Candidates</h1>
        {results.selectedCategories && results.selectedCategories.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
              <p className="text-lg text-green-800 font-medium mb-2 text-center">
                Your Priority Areas (Weighted 2x):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {results.selectedCategories.map((category) => {
                  const categoryInfo = categories.find(c => c.id === category);
                  return (
                    <span key={category} className="bg-green-100 text-green-800 text-md font-medium px-3 py-1 rounded-full">
                      {categoryInfo?.name || category}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

        {/* Priority Areas Section - Only show if Mussab is the top result */}
        {topCandidate.name === 'Mussab Ali' && results.selectedCategories && results.selectedCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                🎉Your Priority Areas Matched These Policies for Mussab Ali🎉
              </h2>
              <button
                onClick={() => setShowPolicyBreakdown(!showPolicyBreakdown)}
                className="px-4 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm md:text-base flex items-center gap-2 mx-auto"
              >
                {showPolicyBreakdown ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Policy Details
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    View Policy Details
                  </>
                )}
              </button>
            </div>
            
            {showPolicyBreakdown && (
              <div className="space-y-4 md:space-y-6">
              {results.selectedCategories.map((categoryId) => {
                const categoryInfo = categories.find(c => c.id === categoryId);
                if (!categoryInfo) return null;
                
                // First, collect all valid questions for this category
                const validQuestions = categoryInfo.questionIds
                  .map((questionId) => {
                    const question = questions[questionId];
                    if (!question) return null;
                    
                    const userAnswer = results.answers[questionId];
                    if (!userAnswer || userAnswer.length === 0) return null;
                    
                    // Find Mussab's options for this question
                    const mussabOptions = question.options.filter(option => 
                      option.candidates.includes('Mussab Ali')
                    );
                    
                    if (mussabOptions.length === 0) return null;
                    
                    return {
                      questionId,
                      question,
                      mussabOptions
                    };
                  })
                  .filter((item): item is { questionId: number; question: any; mussabOptions: any[] } => item !== null);
                
                // Only render the category box if there are valid questions
                if (validQuestions.length === 0) return null;
                
                return (
                  <div key={categoryId} className="border-2 border-green-200 rounded-lg p-4 md:p-6 bg-green-50">
                    <h3 className="text-lg md:text-xl font-bold text-green-800 mb-3 md:mb-4">
                      {categoryInfo.name}
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                      {validQuestions.map(({ questionId, question, mussabOptions }) => (
                        <div key={questionId} className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                          {/* <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-2">
                            {question.question}
                          </h4> */}
                          <div className="space-y-2">
                            {mussabOptions.map((option: any, optionIndex: number) => (
                              <div key={optionIndex} className="border-l-4 border-green-500 pl-3">
                                <p className="text-sm md:text-base text-gray-800 font-bold">
                                  💡{option.text}
                                </p>
                                {option.explanations && option.explanations.length > 0 && (
                                  <div className="mt-2">
                                    {option.explanations
                                      .filter((explanation: any) => explanation.candidate === 'Mussab Ali')
                                      .map((explanation: any, expIndex: number) => (
                                        <div key={expIndex} className="text-xs md:text-sm text-gray-600 mt-1">
                                          {explanation.quote && (
                                            <blockquote className="italic border-l-2 border-green-300 pl-2 mb-1">
                                              "{explanation.quote}"
                                            </blockquote>
                                          )}
                                          {explanation.explanation && (
                                            <p>{explanation.explanation}</p>
                                          )}
                                          {explanation.sourceLink && (
                                            <a 
                                              href={explanation.sourceLink} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                                            >
                                              Learn more →
                                            </a>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}
           {/* Candidate Match Explanation */}
           <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-3 text-center">💡How Candidate Match Percentages are Calculated</h3>
          <div className="space-y-3 text-sm md:text-base text-blue-700">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
              <div>
                <strong>Base Scoring:</strong> Each option you select gives points to all candidates who support that position
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
              <div>
                <strong>Priority Weighting:</strong> Options in your selected priority areas count as 2x points
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
              <div>
                <strong>Percentage Calculation:</strong> Each candidate's percentage = (Their total points ÷ All candidates' total points) × 100
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
              <div>
                <strong>Example:</strong> If you selected 10 options and 3 were in priority areas, candidates get points for all 10 options, with the 3 priority options counting double
              </div>
            </div>
          </div>
        </div>

        {/* All Candidates */}
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-6 md:mb-8 mt-8">
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