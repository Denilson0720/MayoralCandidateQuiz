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
  email?: string;
  mussab_match_percentage?: number;
  timestamp?: string;
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

interface EmailData {
  id: number;
  email: string;
  timestamp: string;
  total_questions: number;
  answered_questions: number;
  completion_percentage: number;
  mussab_match_percentage: number;
  selected_categories: string[];
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

function EmailManagementBox() {
  const [days, setDays] = useState(7);
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEmails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/emails?days=${days}`);
      const data = await response.json();
      
      if (response.ok) {
        setEmails(data.emails);
      } else {
        setError(data.error || 'Failed to fetch emails');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (emails.length === 0) return;

    const headers = [
      'ID',
      'Email',
      'Timestamp',
      'Total Questions',
      'Answered Questions',
      'Completion Percentage',
      'Mussab Match Percentage',
      'Selected Categories'
    ];

    const csvContent = [
      headers.join(','),
      ...emails.map(email => [
        email.id,
        `"${email.email}"`,
        `"${new Date(email.timestamp).toLocaleString()}"`,
        email.total_questions,
        email.answered_questions,
        email.completion_percentage,
        email.mussab_match_percentage,
        `"${Array.isArray(email.selected_categories) ? email.selected_categories.join('; ') : email.selected_categories || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-emails-${days}-days-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Newsletter Email Management</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="days-filter" className="text-sm font-medium text-gray-700">
              Last
            </label>
            <input
              id="days-filter"
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-20 px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-700">days</span>
          </div>
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Fetch Emails'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {emails.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Found {emails.length} email{emails.length !== 1 ? 's' : ''} from the last {days} days
            </p>
            <button
              onClick={downloadCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mussab Match %
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emails.map((email) => (
                  <tr key={email.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {email.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(email.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {email.mussab_match_percentage}%
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {Array.isArray(email.selected_categories) 
                        ? email.selected_categories.join(', ') 
                        : email.selected_categories || 'None'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {emails.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <p>No emails found for the selected time period.</p>
          <p className="text-sm mt-1">Click "Fetch Emails" to search for newsletter signups.</p>
        </div>
      )}
    </div>
  );
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

        {/* Email Management Box */}
        <EmailManagementBox />

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
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => window.location.href = `/results/submission/${submission.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {index + 1}
                              </span>
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">
                                {topCandidate}
                              </div>
                              {submission.email && (
                                <div className="text-xs text-blue-600">
                                  📧 {submission.email}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex items-center">
                            {submission.mussab_match_percentage !== null && submission.mussab_match_percentage !== undefined ? (
                              <div className="mr-4">
                                <div className="text-sm font-bold text-blue-600">
                                  {submission.mussab_match_percentage}%
                                </div>
                                <div className="text-xs text-gray-500">Mussab</div>
                              </div>
                            ) : (
                              <div className="mr-4">
                                <div className="text-sm font-bold text-gray-400">
                                  N/A
                                </div>
                                <div className="text-xs text-gray-400">Mussab</div>
                              </div>
                            )}
                            <div>
                              <div className="text-lg font-bold text-green-600">
                                {matchPercentage}%
                              </div>
                              <div className="text-xs text-gray-500">match</div>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
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
                          {submission.timestamp && (
                            <span className="ml-2">
                              • {new Date(submission.timestamp).toLocaleDateString()}
                            </span>
                          )}
                          <span className="ml-2">• Quiz #{submission.id}</span>
                          <span className="ml-2 text-blue-600">• Click to view details</span>
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
        <div className="mt-8 bg-white rounded-lg shadow hidden">
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
