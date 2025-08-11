'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';
import CategorySelection, { categories } from './CategorySelection';
import { questions, type Question } from '@/questions';
import { calculateQuizResults, saveQuizResults, loadQuizResults, type QuizResult, candidateValues } from '@/utilities';

export default function QuizContainer() {

  // track current question by ID instead of array index
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(questions[0].id);
  // keep track of question answers
  const [answers, setAnswers] = useState<Record<number, number>>({});
  // flag for showing progress bar,...etc
  const [quizStarted,setQuizStarted] = useState<boolean>(false);
  // track category selection
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<boolean>(false);
  // track navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  // track quiz completion and results
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState(0);
  const [isViewingQuestions, setIsViewingQuestions] = useState(false);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Helper function to get question index by ID
  const getQuestionIndexById = useCallback((id: number): number => {
    return questions.findIndex(q => q.id === id);
  }, []);



  // Helper function to get next question ID
  const getNextQuestionId = useCallback((currentId: number): number | null => {
    const currentIndex = getQuestionIndexById(currentId);
    if (currentIndex < questions.length - 1) {
      return questions[currentIndex + 1].id;
    }
    return null;
  }, [getQuestionIndexById]);

  // Helper function to get previous question ID
  const getPreviousQuestionId = useCallback((currentId: number): number | null => {
    const currentIndex = getQuestionIndexById(currentId);
    if (currentIndex > 0) {
      return questions[currentIndex - 1].id;
    }
    return null;
  }, [getQuestionIndexById]);

  // Candidate carousel effect
  useEffect(() => {
    if (quizStarted || quizCompleted) return;

    const interval = setInterval(() => {
      setCurrentCandidateIndex((prev) => (prev + 1) % Object.keys(candidateValues).length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  // Load saved results on component mount
  useEffect(() => {
    const savedResults = loadQuizResults();
    if (savedResults) {
      setQuizResults(savedResults);
      setQuizCompleted(true);
    }
  }, []);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // Check if user has reached the end of the quiz
  useEffect(() => {
    const currentIndex = getQuestionIndexById(currentQuestionId);
    if (currentIndex === questions.length - 1 && !showSubmit && !quizCompleted) {
      setShowSubmit(true);
    } else if (currentIndex < questions.length - 1 && showSubmit) {
      setShowSubmit(false);
    }
  }, [currentQuestionId, showSubmit, quizCompleted, getQuestionIndexById]);

  const handleSubmitQuiz = () => {
    // Calculate initial results without category weighting
    const results = calculateQuizResults(answers, questions, []);
    setQuizResults(results);
    setQuizCompleted(true);
    setCategoriesSelected(false); // Reset to show category selection
    setShowSubmit(false);
    
    // Scroll to top for category selection
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };



  // Intersection Observer to track which question is currently visible
  useEffect(() => {
    if (!quizStarted || quizCompleted || isNavigating) return; // Don't observe during navigation

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const questionId = parseInt(entry.target.getAttribute('data-question-id') || '0');
            if (questionId && questionId !== currentQuestionId) {
              console.log('Observer detected question change:', { from: currentQuestionId, to: questionId });
              setCurrentQuestionId(questionId);
            }
          }
        });
      },
      {
        threshold: [0.3, 0.5, 0.7], // Multiple thresholds for better detection
        rootMargin: '-10% 0px -10% 0px' // Smaller margin for more precise detection
      }
    );

    // Observe all question elements
    questionRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [quizStarted, quizCompleted, currentQuestionId, isNavigating]);

  // Additional effect to manually check which question is most visible
  useEffect(() => {
    if (!quizStarted || quizCompleted || isNavigating) return; // Don't check during navigation

    const checkVisibleQuestion = () => {
      const questionElements = questionRefs.current.filter(Boolean);
      let mostVisibleQuestionId = currentQuestionId;
      let maxVisibility = 0;

      questionElements.forEach((element) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is visible
        const visibleTop = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const visibleHeight = Math.min(rect.height, viewportHeight);
        const visibility = visibleTop / visibleHeight;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          const questionId = parseInt(element.getAttribute('data-question-id') || '0');
          if (questionId) {
            mostVisibleQuestionId = questionId;
          }
        }
      });

      if (mostVisibleQuestionId !== currentQuestionId && maxVisibility > 0.3) {
        console.log('Manual check detected question change:', { from: currentQuestionId, to: mostVisibleQuestionId, visibility: maxVisibility });
        setCurrentQuestionId(mostVisibleQuestionId);
      }
    };

    // Check immediately and then on scroll
    checkVisibleQuestion();
    
    const handleScroll = () => {
      // Debounce scroll events
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(checkVisibleQuestion, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout((window as any).scrollTimeout);
    };
  }, [quizStarted, quizCompleted, currentQuestionId, isNavigating]);

  // Effect to track when user is viewing questions vs landing page
  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const checkIfViewingQuestions = () => {
      const questionsSection = document.querySelector('section[class*="pt-16"]');
      if (questionsSection) {
        const rect = questionsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Check if questions section is visible in viewport
        const isVisible = rect.top < viewportHeight && rect.bottom > 0;
        setIsViewingQuestions(isVisible);
      }
    };

    checkIfViewingQuestions();
    
    const handleScroll = () => {
      checkIfViewingQuestions();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [quizStarted, quizCompleted]);

  // Handle smooth scrolling to questions
  useEffect(() => {
    if (quizStarted && !isNavigating && !quizCompleted) {
      const currentIndex = getQuestionIndexById(currentQuestionId);
      const targetElement = questionRefs.current[currentIndex];
      if (targetElement) {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [currentQuestionId, quizStarted, isNavigating, quizCompleted, getQuestionIndexById]);

  const handleNextQuestion = () => {
    const nextId = getNextQuestionId(currentQuestionId);
    if (nextId && !isNavigating) {
      console.log('Next button clicked:', { from: currentQuestionId, to: nextId });
      setIsNavigating(true);
      setCurrentQuestionId(nextId);
      
      // Force immediate scroll to ensure state consistency
      setTimeout(() => {
        const nextIndex = getQuestionIndexById(nextId);
        const targetElement = questionRefs.current[nextIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Keep navigation locked until scroll animation completes
        setTimeout(() => setIsNavigating(false), 800);
      }, 100);
    }
  };

  const handlePreviousQuestion = () => {
    const prevId = getPreviousQuestionId(currentQuestionId);
    if (prevId && !isNavigating) {
      console.log('Previous button clicked:', { from: currentQuestionId, to: prevId });
      setIsNavigating(true);
      setCurrentQuestionId(prevId);
      
      // Force immediate scroll to ensure state consistency
      setTimeout(() => {
        const prevIndex = getQuestionIndexById(prevId);
        const targetElement = questionRefs.current[prevIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Keep navigation locked until scroll animation completes
        setTimeout(() => setIsNavigating(false), 800);
      }, 100);
    }
  };

  const handleSkipQuestion = () => {
    const nextId = getNextQuestionId(currentQuestionId);
    if (nextId && !isNavigating) {
      console.log('Skip button clicked:', { from: currentQuestionId, to: nextId });
      setIsNavigating(true);
      setCurrentQuestionId(nextId);
      
      // Force immediate scroll to ensure state consistency
      setTimeout(() => {
        const nextIndex = getQuestionIndexById(nextId);
        const targetElement = questionRefs.current[nextIndex];
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Keep navigation locked until scroll animation completes
        setTimeout(() => setIsNavigating(false), 800);
      }, 100);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionId(questions[0].id);
    setAnswers({});
    setQuizStarted(false);
    setCategoriesSelected(false);
    setSelectedCategories([]);
    setIsNavigating(false);
    setQuizCompleted(false);
    setQuizResults(null);
    // Clear saved results
    localStorage.removeItem('jerseyCityQuizResults');
    // Scroll back to the landing section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCategoriesSelected(true); // Allow questions to be shown
    setCurrentQuestionId(questions[0].id);
    setIsNavigating(true);
    
    // Scroll to first question after a short delay
    setTimeout(() => {
      const firstQuestion = questionRefs.current[0];
      if (firstQuestion) {
        firstQuestion.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
      setIsNavigating(false);
    }, 100);
  };

  const handleCategoriesSelected = (categories: string[]) => {
    setSelectedCategories(categories);
    setCategoriesSelected(true);
    
    // Recalculate results with category weighting
    if (quizResults) {
      const weightedResults = calculateQuizResults(answers, questions, categories);
      setQuizResults(weightedResults);
      
      // Save final results to localStorage
      saveQuizResults(weightedResults);
    }
    
    // Scroll to results
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const currentQuestionIndex = getQuestionIndexById(currentQuestionId);
  const answeredQuestions = Object.keys(answers).length;
  const completionPercentage = Math.round((answeredQuestions / questions.length) * 100);

  // Calculate topic progress based on the 6 categories
  const calculateTopicProgress = () => {
    const topicProgress: { [topic: string]: { answered: number; total: number } } = {};
    
    // Initialize progress for each category
    categories.forEach(category => {
      topicProgress[category.name] = { answered: 0, total: category.questionIds.length };
    });
    
    // Count answered questions per category
    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const questionIdNum = parseInt(questionId);
      // Find which category this question belongs to
      categories.forEach(category => {
        if (category.questionIds.includes(questionIdNum)) {
          topicProgress[category.name].answered += 1;
        }
      });
    });
    
    return topicProgress;
  };

  const topicProgress = calculateTopicProgress();

  // Show category selection after quiz completion
  if (quizCompleted && quizResults && !categoriesSelected) {
    return (
      <CategorySelection onCategoriesSelected={handleCategoriesSelected} />
    );
  }

  // Show results if quiz is completed and categories are selected
  if (quizCompleted && quizResults && categoriesSelected) {
    return (
      <div className="border-2 border-red-500">
        <ResultsCard 
          results={quizResults} 
          onRetakeQuiz={handleResetQuiz}
        />
      </div>
    );
  }

  return (
    // gradient here from-cyan-200 from- via-slate-50 via-50% to-red-200 to-
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-200 from- via-slate-50 via-50% to-red-200 to- relative" style={{
      // backgroundImage: 'url(/jc_skyline.png)',
      // backgroundSize: 'cover',
      // backgroundPosition: 'bottom',
      // backgroundAttachment: 'fixed',
      // backgroundRepeat: 'no-repeat',
      // minHeight: '100vh'
    }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-200/30 from- via-slate-50/30 via-50% to-red-200/30 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* LANDING PAGE */}
      <section className="min-h-screen text-center flex flex-col lg:flex-row p-10">
          <div className='flex flex-col justify-center items-center w-full lg:w-[60%] px-4 lg:px-8'>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-8 title-font">
              Jersey City Mayoral Candidate Quiz
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 my-4 px-4">
              Who should you support for mayor of Jersey City?
            </p>
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-md'>
              <button 
                onClick={handleStartQuiz}
                disabled={isNavigating}
                className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer border-2 border-black text-black font-semibold py-3 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isNavigating ? 'Starting...' : 'Start Quiz'}
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-300 hover:cursor-pointer border-2 border-black text-black font-semibold py-3 px-6 md:px-8 rounded-lg text-base md:text-lg transition-colors w-full sm:w-auto"
              >
                View Candidates
              </button>
            </div>
        </div>
        <div className='w-full lg:w-[40%] flex flex-col justify-center items-center px-4 lg:px-8 py-8 lg:py-0'>
          {/* Candidate Carousel */}
                      <div className="relative w-full max-w-sm">
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Meet the Candidates</h2>
              <p className="text-sm md:text-base text-gray-600">Take the quiz to see who aligns with your views</p>
            </div>
            
            <div className="relative h-64 md:h-80">
              {Object.entries(candidateValues).map(([key, candidate], index) => (
                <div
                  key={key}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentCandidateIndex
                      ? 'opacity-100 scale-100 translate-x-0'
                      : index === (currentCandidateIndex + 1) % Object.keys(candidateValues).length
                      ? 'opacity-0 scale-95 translate-x-4'
                      : 'opacity-0 scale-95 -translate-x-4'
                  }`}
                >
                  <div className="text-center h-full flex flex-col justify-center">
                    <div className="relative mb-4 lg:mb-6">
                      <img 
                        src={candidate.url} 
                        alt={candidate.name}
                        className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 md:px-4 py-1 rounded-full shadow-md border">
                        <span className="text-xs md:text-sm font-semibold text-gray-800">
                          {index + 1} of {Object.keys(candidateValues).length}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{candidate.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600 max-w-xs mx-auto leading-relaxed px-2">{candidate.bio}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6 lg:mt-8">
              {Object.keys(candidateValues).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCandidateIndex(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentCandidateIndex
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Questions Section - Only show when categories are selected */}
      {categoriesSelected && (
        <section className="pt-16 md:pt-0 pb-20 md:pb-24">
          {/* Sticky Category Progress */}
          <div className={`fixed top-1/2 right-4 z-50 w-80 bg-gray-50/50 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-gray-200/50 hidden lg:block transform -translate-y-1/2 transition-opacity duration-300 ${
            isViewingQuestions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <h3 className="text-xl font-bold text-black mb-3">Category Progress</h3>
            <div className="space-y-2">
              {Object.entries(topicProgress).map(([topic, progress]) => {
                const typedProgress = progress as { answered: number; total: number };
                return (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-lg font-medium text-black truncate pr-2">{topic}</span>
                    <div className="flex space-x-1 flex-shrink-0">
                      {Array.from({ length: typedProgress.total }, (_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full border border-gray-400 ${
                            index < typedProgress.answered ? 'bg-black' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Sticky Progress Dots - Only show on mobile */}
          <div className="sticky top-0 z-50 md:hidden bg-gradient-to-r from-cyan-200 from- via-slate-50 via-50% to-red-200 to- py-3">
            <div className="flex justify-center items-center px-4">
              {/* <button
                onClick={handleResetQuiz}
                disabled={isNavigating}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Reset Quiz
              </button> */}
              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index < currentQuestionIndex
                        ? 'bg-green-500' // Completed questions
                        : index === currentQuestionIndex
                        ? 'bg-blue-500' // Current question
                        : 'bg-gray-300' // Future questions
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 font-medium title-font ml-4">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          </div>
          
          <div className="">
            {questions.map((question, index) => (
              <div 
                key={question.id}
                ref={(el) => { questionRefs.current[index] = el; }}
                id={`question-${question.id}`}
                data-question-id={question.id}
                className=""
              >
                <QuestionCard
                  question={question}
                  questionNumber={index + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={answers[question.id]}
                  onAnswerSelect={(answerIndex) => handleAnswerSelect(question.id, answerIndex)}
                  onNext={handleNextQuestion}
                  onPrevious={handlePreviousQuestion}
                  onSkip={handleSkipQuestion}
                  onSubmit={showSubmit ? handleSubmitQuiz : undefined}
                  isFirst={index === 0}
                  isLast={index === questions.length - 1}
                  canProceed={answers[question.id] !== undefined}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Desktop Footer - Only show on tablet and desktop */}
      {categoriesSelected && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-2 md:p-4 z-50 hidden md:block">
          <div className="max-w-4xl mx-auto">
            {/* Progress - Mobile Stacked */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2 md:mb-0">
              <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-4">
                <span className="text-xs md:text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <div className="w-24 md:w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs md:text-sm text-gray-600">
                  {completionPercentage}% Complete
                </span>
              </div>

              {/* Navigation Buttons - Mobile Optimized */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isNavigating}
                  className={`px-3 md:px-6 py-2 rounded-lg font-semibold transition-colors text-xs md:text-sm ${
                    currentQuestionIndex === 0 || isNavigating
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {isNavigating ? '...' : 'Previous'}
                </button>

                {showSubmit ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={isNavigating}
                    className="px-4 md:px-8 py-2 rounded-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                  >
                    {isNavigating ? '...' : 'Submit Quiz'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1 || isNavigating}
                    className={`px-3 md:px-6 py-2 rounded-lg font-semibold transition-colors text-xs md:text-sm ${
                      currentQuestionIndex === questions.length - 1 || isNavigating
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isNavigating ? '...' : 'Next'}
                  </button>
                )}
                <button
                  onClick={handleResetQuiz}
                  disabled={isNavigating}
                  className="px-3 md:px-6 py-2 rounded-lg font-semibold transition-colors bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                >
                  Reset Quiz
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Sticky Footer - Only show on mobile */}
      {categoriesSelected && (
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-200 from- via-slate-50 via-50% to-red-200 to- p-3 z-50 md:hidden">
          <div className="flex gap-3 max-w-md mx-auto">
            <button
              onClick={handleSkipQuestion}
              className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors text-xs"
            >
              Skip
            </button>
            
            {showSubmit ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={isNavigating}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1 || isNavigating || answers[questions[currentQuestionIndex]?.id] === undefined}
                className={`flex-1 px-3 py-2 font-semibold rounded-lg transition-colors text-xs ${
                  currentQuestionIndex === questions.length - 1 || isNavigating || answers[questions[currentQuestionIndex]?.id] === undefined
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </footer>
      )}

      </div>
    </div>
  );
}