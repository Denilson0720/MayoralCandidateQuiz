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
    mussabMatchPercentage: number;
    policyAlignment: PolicyAlignment;
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
        url: 'https://res.cloudinary.com/duhazr5mo/image/upload/v1756746053/solomon_tone1_wofhkw.png',
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

// Calculate Mussab Match Percentage using new scoring system
export function calculateMussabMatchPercentage(answers: Record<number, number[]>, questions: Question[], selectedCategories: string[] = []): number {
    const POINTS_PER_QUESTION = 100 / 14; // 7.14% per question
    const FULL_PERCENT = POINTS_PER_QUESTION;
    const PARTIAL_PERCENT = POINTS_PER_QUESTION / 2; // 3.57%
    
    let totalScore = 0;
    
    questions.forEach(question => {
        const userAnswers = answers[question.id];
        if (!userAnswers || userAnswers.length === 0) return;
        
        // Determine if this question belongs to a selected priority category
        const questionCategory = getQuestionCategory(question.id);
        const isPriorityQuestion = selectedCategories.includes(questionCategory);
        
        // Get all Mussab options for this question
        const mussabOptions = question.options.filter(option => 
            option.candidates.includes('Mussab Ali')
        );
        
        if (mussabOptions.length === 0) return;
        
        // Get user's selected options
        const userSelectedOptions = userAnswers
            .map(answerIndex => question.options[answerIndex])
            .filter(option => option !== undefined);
        
        // Check if user selected any Mussab options
        const userMussabSelections = userSelectedOptions.filter(option => 
            option.candidates.includes('Mussab Ali')
        );
        
        if (userMussabSelections.length === 0) {
            // No Mussab selections - no points
            return;
        }
        
        // Determine if this is a full match or partial match
        const hasOnlyMussabOptions = userMussabSelections.every(option => 
            option.candidates.length === 1 && option.candidates[0] === 'Mussab Ali'
        );
        
        let questionScore = 0;
        
        if (hasOnlyMussabOptions) {
            // Full match - user selected only Mussab-only options
            questionScore = FULL_PERCENT;
        } else {
            // Partial match - user selected mix of Mussab-only and Mussab+others
            questionScore = PARTIAL_PERCENT;
            
            // If this is a priority question, upgrade partial to full
            if (isPriorityQuestion) {
                questionScore = FULL_PERCENT;
            }
        }
        
        totalScore += questionScore;
    });
    
    return Math.round(totalScore);
}

export interface PolicyAlignment {
    mussabAlignment: MussabAlignment[];
    noMatch: PolicyNoMatch[];
}

export interface MussabAlignment {
    questionId: number;
    question: string;
    subtopic: string;
    userMussabSelections: {
        optionIndex: number;
        optionText: string;
    }[];
    mussabOtherOptions: {
        optionIndex: number;
        optionText: string;
        explanations?: {
            candidate: string;
            quote?: string;
            explanation: string;
            source: string;
            sourceLink?: string;
            sourceTitle?: string;
            remark?: string;
        }[];
    }[];
}

export interface PolicyNoMatch {
    questionId: number;
    question: string;
    subtopic: string;
    userSelections: {
        optionIndex: number;
        optionText: string;
    }[];
    mussabOptions: {
        optionIndex: number;
        optionText: string;
        explanations?: {
            candidate: string;
            quote?: string;
            explanation: string;
            source: string;
            sourceLink?: string;
            sourceTitle?: string;
            remark?: string;
        }[];
    }[];
}

// Analyze policy alignment between user and Mussab
export function analyzePolicyAlignment(answers: Record<number, number[]>, questions: Question[]): PolicyAlignment {
    const mussabAlignment: MussabAlignment[] = [];
    const noMatch: PolicyNoMatch[] = [];
    
    questions.forEach(question => {
        const userAnswers = answers[question.id];
        if (!userAnswers || userAnswers.length === 0) return;
        
        // Get all Mussab options for this question
        const mussabOptions = question.options
            .map((option, index) => ({ optionIndex: index, optionText: option.text, option }))
            .filter(item => item.option.candidates.includes('Mussab Ali'));
        
        // Get user's selections
        const userSelections = userAnswers
            .filter(answerIndex => question.options[answerIndex] !== undefined)
            .map(answerIndex => ({
                optionIndex: answerIndex,
                optionText: question.options[answerIndex].text,
                option: question.options[answerIndex]
            }));
        
        // Check if user selected any Mussab options
        const userMussabSelections = userSelections.filter(selection => 
            selection.option.candidates.includes('Mussab Ali')
        );
        
        if (userMussabSelections.length > 0) {
            // User selected at least one Mussab option - goes in Mussab Alignment section
            const mussabOtherOptions = mussabOptions.filter(mussabOption => 
                !userMussabSelections.some(userSelection => userSelection.optionIndex === mussabOption.optionIndex)
            );
            
            mussabAlignment.push({
                questionId: question.id,
                question: question.question,
                subtopic: question.subtopic,
                userMussabSelections: userMussabSelections.map(selection => ({
                    optionIndex: selection.optionIndex,
                    optionText: selection.optionText
                })),
                mussabOtherOptions: mussabOtherOptions.map(option => ({
                    optionIndex: option.optionIndex,
                    optionText: option.optionText,
                    explanations: option.option.explanations
                }))
            });
        } else {
            // No match - user selected no Mussab options
            noMatch.push({
                questionId: question.id,
                question: question.question,
                subtopic: question.subtopic,
                userSelections: userSelections.map(selection => ({
                    optionIndex: selection.optionIndex,
                    optionText: selection.optionText
                })),
                mussabOptions: mussabOptions.map(option => ({
                    optionIndex: option.optionIndex,
                    optionText: option.optionText,
                    explanations: option.option.explanations
                }))
            });
        }
    });
    
    return { mussabAlignment, noMatch };
}

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

    // Calculate Mussab Match Percentage
    const mussabMatchPercentage = calculateMussabMatchPercentage(answers, questions, selectedCategories);

    // Analyze policy alignment
    const policyAlignment = analyzePolicyAlignment(answers, questions);

    return {
        candidateMatches: candidateMatchResults,
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).filter(qid => answers[parseInt(qid)] && answers[parseInt(qid)].length > 0).length,
        completionPercentage: Math.round((Object.keys(answers).filter(qid => answers[parseInt(qid)] && answers[parseInt(qid)].length > 0).length / questions.length) * 100),
        mussabMatchPercentage,
        policyAlignment,
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