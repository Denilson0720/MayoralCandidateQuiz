export enum candidateKeys {
    MUSSAB = 'MUSSAB',
    SOLOMON = 'SOLOMON',
    ODEA = 'ODEA',
    WATTERMAN = 'WATTERMAN',
    MCGREEVY = 'MCGREEVY'
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
    answers: Record<number, number>;
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
        website: 'https://mussabali.com',
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
        website: 'https://jamessolomon.com',
        socialMedia: {
            twitter: 'https://twitter.com/jamessolomon',
            facebook: 'https://facebook.com/jamessolomon'
        },
        bio: 'City Council member focused on transparency and community-driven development.'
    },
    'Bill Odea':{
        name:'Bill Odea',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1753066661/Smiling_Man_in_Suit_and_Tie_ly0b5o.png',
        website: 'https://billodea.com',
        socialMedia: {
            twitter: 'https://twitter.com/billodea',
            facebook: 'https://facebook.com/billodea'
        },
        bio: 'Experienced public servant with a focus on public safety and infrastructure.'
    },
    'Joyce Watterman':{
        name:'Joyce Watterman',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1753062314/joyce_muculq.png',
        website: 'https://joycewatterman.com',
        socialMedia: {
            twitter: 'https://twitter.com/joycewatterman',
            facebook: 'https://facebook.com/joycewatterman'
        },
        bio: 'City Council President with experience in community development and education.'
    },
    'Jim McGreevy':{
        name:'Jim McGreevy',
        url:'https://res.cloudinary.com/duhazr5mo/image/upload/v1752979606/mcGreevy_j0xaql.png',
        website: 'https://jimmcgreevy.com',
        socialMedia: {
            twitter: 'https://twitter.com/jimmcgreevy',
            facebook: 'https://facebook.com/jimmcgreevy'
        },
        bio: 'Former mayor with experience in economic development and government collaboration.'
    }
};

// Calculate quiz results based on user answers
export function calculateQuizResults(answers: Record<number, number>, questions: any[]): QuizResult {
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
        const userAnswer = answers[question.id];
        if (userAnswer !== undefined) {
            const selectedOption = question.options[userAnswer];
            
            // Count matches for each candidate in the selected option
            selectedOption.candidates.forEach((candidate: string) => {
                candidateScores[candidate]++;
                candidateMatches[candidate]++;
            });
            
            // Count total possible matches for each candidate across all options
            question.options.forEach((option: any) => {
                option.candidates.forEach((candidate: string) => {
                    totalPossibleMatches[candidate]++;
                });
            });
        }
    });

    // Calculate match percentages and create results
    const candidateMatchResults: CandidateMatch[] = Object.keys(candidateValues).map(candidate => {
        const matchPercentage = totalPossibleMatches[candidate] > 0 
            ? Math.round((candidateMatches[candidate] / totalPossibleMatches[candidate]) * 100)
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
        answeredQuestions: Object.keys(answers).length,
        completionPercentage: Math.round((Object.keys(answers).length / questions.length) * 100),
        timestamp: new Date().toISOString(),
        answers
    };
}

// Save results to localStorage
export function saveQuizResults(results: QuizResult): void {
    localStorage.setItem('jerseyCityQuizResults', JSON.stringify(results));
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