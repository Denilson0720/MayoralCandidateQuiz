import { Question } from '@/questions';

export enum candidateKeys {
    MUSSAB = 'MUSSAB',
    SOLOMON = 'SOLOMON',
    ODEA = 'ODEA',
    WATTERMAN = 'WATTERMAN',
    MCGREEVY = 'MCGREEVY'
}

// Map question IDs to their categories (0-based to match UI question IDs)
function getQuestionCategory(questionId: number): string {
  const categoryMap: Record<number, string> = {
    0: 'transportation',  // Question 1 in UI (0-based)
    1: 'transportation',  // Question 2 in UI (0-based)
    2: 'safety',         // Question 3 in UI (0-based)
    3: 'housing',        // Question 4 in UI (0-based)
    4: 'housing',        // Question 5 in UI (0-based)
    5: 'education',      // Question 6 in UI (0-based)
    6: 'education',      // Question 7 in UI (0-based)
    7: 'social',         // Question 8 in UI (0-based)
    8: 'social',         // Question 9 in UI (0-based)
    9: 'governance',     // Question 10 in UI (0-based)
    10: 'transportation', // Question 11 in UI (0-based)
    11: 'governance',    // Question 12 in UI (0-based)
    12: 'governance',    // Question 13 in UI (0-based)
    13: 'governance'     // Question 14 in UI (0-based)
  };
  return categoryMap[questionId] || 'other';
}

type CandidateInfo = { 
    name: string; 
    url: string;
    website?: string;
    socialMedia?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    bio?: string;
};

export interface QuizResult {
    candidateMatches: CandidateMatch[];
    totalQuestions: number;
    answeredQuestions: number;
    completionPercentage: number;
    timestamp: string;
    answers: Record<number, number[]>;
    selectedCategories: string[];
}

export interface CandidateMatch {
    candidate: string;
    name: string;
    imageUrl: string;
    matchPercentage: number;
    matchingAnswers: number;
    totalPossibleMatches: number;
    website?: string;
    socialMedia?: {
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    bio?: string;
}

export const candidateValues: Record<string, CandidateInfo> = {
    'Mussab Ali': {
        name: 'Mussab Ali',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1752979616/mussab_fjezhm.png',
        website: 'https://www.ali2025.com',
        socialMedia: {
            twitter: 'https://twitter.com/mussabali',
            facebook: 'https://facebook.com/mussabali',
            instagram: 'https://instagram.com/mussabali'
        },
        bio: 'Community organizer and advocate for progressive policies in Jersey City.'
    },
    'James Solomon': {
        name: 'James Solomon',
        url: 'https://res.cloudinary.com/duhazr5mo/image/upload/v1753058211/solomon_gxhl1q.png',
        website: 'https://solomonforjc.com',
        socialMedia: {
            twitter: 'https://twitter.com/jamessolomon',
            facebook: 'https://facebook.com/jamessolomon'
        },
        bio: 'City Council member focused on transparency and community-driven development.'
    },
    'Bill Odea':{
        name:'Bill Odea',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1753066661/Smiling_Man_in_Suit_and_Tie_ly0b5o.png',
        website: 'https://www.billodeajc.com',
        socialMedia: {
            twitter: 'https://twitter.com/billodea',
            facebook: 'https://facebook.com/billodea'
        },
        bio: 'Experienced public servant with a focus on public safety and infrastructure.'
    },
    'Joyce Watterman':{
        name:'Joyce Watterman',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1753062314/joyce_muculq.png',
        website: 'https://www.joyceforjc.com',
        socialMedia: {
            twitter: 'https://twitter.com/joycewatterman',
            facebook: 'https://facebook.com/joycewatterman'
        },
        bio: 'City Council President with experience in community development and education.'
    },
    'Jim McGreevy':{
        name:'Jim McGreevy',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1752979606/mcGreevy_j0xaql.png',
        website: 'https://jim2025.com',
        socialMedia: {
            twitter: 'https://twitter.com/jimmcgreevy',
            facebook: 'https://facebook.com/jimmcgreevy'
        },
        bio: 'Former mayor with experience in economic development and government collaboration.'
    }
};

// Calculate quiz results based on user answers
export function calculateQuizResults(answers: Record<number, number[]>, questions: Question[], selectedCategories: string[] = []): QuizResult {
    const candidateScores: Record<string, number> = {};
    const candidateMatches: Record<string, number> = {};
    const totalPossibleMatches: Record<string, number> = {};
    
    // Initialize scores for all candidates
    Object.keys(candidateValues).forEach(candidate => {
        candidateScores[candidate] = 0;
        candidateMatches[candidate] = 0;
        totalPossibleMatches[candidate] = 0;
    });

    // Calculate scores based on answers
    questions.forEach(question => {
      const userAnswers = answers[question.id];
      if (userAnswers && userAnswers.length > 0) {
        // Determine if this question belongs to a selected category
        const questionCategory = getQuestionCategory(question.id);
        const isWeightedQuestion = selectedCategories.includes(questionCategory);
        const weight = isWeightedQuestion ? 2 : 1; // Double points for selected categories
        
        // Count matches for each selected option
        userAnswers.forEach(answerIndex => {
          const selectedOption = question.options[answerIndex];
          if (selectedOption) {
            selectedOption.candidates.forEach((candidate: string) => {
              candidateScores[candidate] += weight;
              candidateMatches[candidate] += weight;
            });
          }
        });
        
        // Count total possible matches for each candidate across all options
        question.options.forEach((option) => {
          option.candidates.forEach((candidate: string) => {
            totalPossibleMatches[candidate] += weight;
          });
        });
      }
    });

    // Calculate the total points accrued by all candidates
    const totalPointsAccrued = Object.values(candidateScores).reduce((sum, val) => sum + val, 0);

    // Calculate match percentages and create results
    const candidateMatchResults: CandidateMatch[] = Object.keys(candidateValues).map(candidate => {
        const matchPercentage = totalPointsAccrued > 0 
            ? Math.round((candidateScores[candidate] / totalPointsAccrued) * 100)
            : 0;
        return {
            candidate,
            name: candidateValues[candidate].name,
            imageUrl: candidateValues[candidate].url,
            matchPercentage,
            matchingAnswers: candidateMatches[candidate],
            totalPossibleMatches: totalPossibleMatches[candidate],
            website: candidateValues[candidate].website,
            socialMedia: candidateValues[candidate].socialMedia,
            bio: candidateValues[candidate].bio
        };
    });

    // Sort by match percentage (highest first)
    candidateMatchResults.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return {
        candidateMatches: candidateMatchResults,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).filter(qid => answers[parseInt(qid)] && answers[parseInt(qid)].length > 0).length,
        completionPercentage: Math.round((Object.keys(answers).filter(qid => answers[parseInt(qid)] && answers[parseInt(qid)].length > 0).length / questions.length) * 100),
        timestamp: new Date().toISOString(),
        answers,
        selectedCategories
    };
}

// Save results to database and localStorage
export async function saveQuizResults(results: QuizResult): Promise<boolean> {
    try {
        // Save to localStorage for immediate access
        localStorage.setItem('jerseyCityQuizResults', JSON.stringify(results));
        
        // Save to database
        const response = await fetch('/api/quiz-results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: results.answers,
                selectedCategories: results.selectedCategories,
                totalQuestions: results.totalQuestions,
                answeredQuestions: results.answeredQuestions,
                completionPercentage: results.completionPercentage,
                userAgent: navigator.userAgent,
                ipAddress: null // Will be captured server-side
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save to database');
        }

        const data = await response.json();
        console.log('Quiz results saved to database:', data);
        return true;
    } catch (error) {
        console.error('Error saving quiz results:', error);
        // Still save to localStorage even if database save fails
        return false;
    }
}

// Load results from localStorage
export function loadQuizResults(): QuizResult | null {
    const saved = localStorage.getItem('jerseyCityQuizResults');
    return saved ? JSON.parse(saved) : null;
}

// Share results on social media
export function shareResults(results: QuizResult, platform: 'twitter' | 'facebook' | 'linkedin'): void {
    const topCandidate = results.candidateMatches[0];
    const text = `I took the Jersey City Mayoral Candidate Quiz and my top match is ${topCandidate.name} with ${topCandidate.matchPercentage}% alignment! Take the quiz at `;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}