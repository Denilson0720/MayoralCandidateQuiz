"use client";

import { useState, useEffect } from "react";
import { candidateValues } from "@/utilities";
import { categories } from "@/app/components/CategorySelection";

interface QuizSubmission {
  id: string;
  completion_percentage: number;
  candidate_matches: string | any[];
  answered_questions: number;
  total_questions: number;
  selected_categories?: string | string[];
}

interface CandidateStat {
  name: string;
  total_selections: number;
  unique_quiz_attempts: number;
}

interface CategoryStat {
  category: string;
  total_selections: number;
  unique_attempts: number;
}

interface QuestionOption {
  option_id: number;
  option_label: string;
  option_text: string;
  selection_count: number;
  unique_quiz_attempts: number;
  selection_percentage: number;
  candidate_names: string;
}

interface QuestionAnalytics {
  question_id: number;
  category: string;
  question_text: string;
  options: QuestionOption[];
  total_selections: number;
}

interface AnalyticsData {
  recentSubmissions: QuizSubmission[];
  candidates: CandidateStat[];
  categories: CategoryStat[];
  totalSubmissions: number;
  questionAnalytics?: {
    questionsByCategory: { [key: string]: QuestionAnalytics[] };
    totalAttempts: number;
    categories: string[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    recentSubmissions: [],
    candidates: [],
    categories: [],
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuestionAnalytics, setShowQuestionAnalytics] = useState(false);

  useEffect(() => {
    // Load analytics data from database
    const loadAnalyticsData = async () => {
      try {
        const [analyticsResponse, questionAnalyticsResponse] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/question-analytics")
        ]);
        
        if (!analyticsResponse.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        
        const analyticsData = await analyticsResponse.json();
        const questionAnalyticsData = questionAnalyticsResponse.ok ? await questionAnalyticsResponse.json() : null;
        
        setAnalyticsData({
          ...analyticsData,
          questionAnalytics: questionAnalyticsData
        });
      } catch (error) {
        console.error("Error loading analytics data:", error);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  const getMostPopularCandidate = () => {
    if (!analyticsData.candidates || analyticsData.candidates.length === 0)
      return null;
    return analyticsData.candidates[0];
  };

  const getMostPopularCategories = () => {
    if (!analyticsData.categories) return [];
    return analyticsData.categories.slice(0, 3);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mostPopularCandidate = getMostPopularCandidate();
  const mostPopularCategories = getMostPopularCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Insights from Jersey City Mayoral Quiz submissions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Submissions */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Submissions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {analyticsData.totalSubmissions || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Most Popular Candidate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Most Popular Candidate
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {mostPopularCandidate ? mostPopularCandidate.name : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {mostPopularCandidate
                    ? `${mostPopularCandidate.total_selections} selections`
                    : "No data"}
                </p>
              </div>
            </div>
          </div>

          {/* Most Popular Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Most Popular Category
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {mostPopularCategories.length > 0
                    ? mostPopularCategories[0].category
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {mostPopularCategories.length > 0
                    ? `${mostPopularCategories[0].total_selections} selections`
                    : "No data"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Popular Categories */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Most Popular Categories
              </h2>
            </div>
            <div className="p-6">
              {mostPopularCategories && mostPopularCategories.length > 0 ? (
                <div className="space-y-4">
                  {mostPopularCategories.map((category, index) => (
                    <div
                      key={category.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="ml-3 font-medium text-gray-900">
                          {category.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {category.total_selections}
                        </div>
                        <div className="text-sm text-gray-500">selections</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No category data available
                </p>
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Quiz Submissions
              </h2>
            </div>
            <div className="p-6">
              {/* button to log submissions to console */}
              <button
                onClick={() => console.log(analyticsData)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Log Submissions
              </button>
              {analyticsData.recentSubmissions &&
              analyticsData.recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.recentSubmissions.map((submission, index) => {
                    let topCandidate = "Unknown";
                    let matchPercentage = 0;
                    let selectedCategories: string[] = [];

                    try {
                      // Handle candidate matches - it's an array of objects
                      const matches = submission.candidate_matches;

                      if (
                        matches &&
                        Array.isArray(matches) &&
                        matches.length > 0
                      ) {
                        // Get the first candidate (highest match)
                        const topMatch = matches[0];
                        topCandidate = topMatch.candidate || "Unknown";
                        matchPercentage = topMatch.matchPercentage || 0;
                      }

                      // Handle selected categories - it's already an array
                      const categories = submission.selected_categories;
                      selectedCategories = Array.isArray(categories) ? categories : [];
                    } catch (e) {
                      console.error("Error parsing submission data:", e);
                    }

                    return (
                      <div
                        key={submission.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {topCandidate}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {matchPercentage}%
                            </div>
                            <div className="text-xs text-gray-500">match</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {submission.answered_questions}/
                          {submission.total_questions} questions answered
                          {selectedCategories.length > 0 && (
                            <span className="ml-2">
                              • {selectedCategories.length} priority categories
                            </span>
                          )}
                          <span className="ml-2">• Quiz #{submission.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent submissions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Question Analytics */}
        {analyticsData.questionAnalytics && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Question Analytics</h2>
                <button
                  onClick={() => setShowQuestionAnalytics(!showQuestionAnalytics)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showQuestionAnalytics ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            <div className="p-6">
              {showQuestionAnalytics ? (
                <div className="space-y-8">
                  {analyticsData.questionAnalytics?.categories.map(category => {
                    const questions = analyticsData.questionAnalytics?.questionsByCategory[category] || [];
                    return (
                      <div key={category} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{category}</h3>
                        <div className="space-y-6">
                          {questions.map(question => (
                            <div key={question.question_id} className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-medium text-gray-900 mb-3">{question.question_text}</h4>
                              <div className="space-y-2">
                                {question.options.map(option => {
                                  const isMussabOption = option.candidate_names && option.candidate_names.includes('Mussab Ali');
                                  return (
                                    <div 
                                      key={option.option_id} 
                                      className={`flex items-center justify-between p-2 rounded ${
                                        isMussabOption 
                                          ? 'bg-green-50 border border-green-200' 
                                          : 'bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex-1">
                                        <div className={`font-medium text-sm ${
                                          isMussabOption ? 'text-green-800' : 'text-gray-900'
                                        }`}>
                                          {option.option_label}. {option.option_text}
                                          {isMussabOption && (
                                            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                              Mussab Ali
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right ml-4">
                                        <div className={`text-sm font-semibold ${
                                          isMussabOption ? 'text-green-800' : 'text-gray-900'
                                        }`}>
                                          {option.selection_count} selections
                                        </div>
                                        {/* <div className="text-xs text-gray-500">
                                          {option.selection_percentage}% of attempts
                                        </div> */}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Click "Show Details" to see which options are most popular for each question</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analyticsData.questionAnalytics?.categories.map(category => {
                      const questions = analyticsData.questionAnalytics?.questionsByCategory[category] || [];
                      const totalSelections = questions.reduce((sum, q) => sum + q.total_selections, 0);
                      return (
                        <div key={category} className="text-center p-4 border border-gray-200 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{totalSelections}</div>
                          <div className="text-sm text-gray-600 capitalize">{category}</div>
                          <div className="text-xs text-gray-500">{questions.length} questions</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Candidate Breakdown */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Candidate Performance Breakdown
            </h2>
          </div>
          <div className="p-6">
            {analyticsData.candidates && analyticsData.candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.candidates.map((candidate) => {
                  const percentage = (
                    (candidate.total_selections /
                      (analyticsData.totalSubmissions || 1)) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={candidate.name}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        <div>
                          <div className="font-medium text-gray-900">
                            {candidate.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {candidate.total_selections} selections
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {percentage}% of total
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No candidate data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
