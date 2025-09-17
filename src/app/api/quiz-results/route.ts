import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { calculateMussabMatchPercentage } from '@/utilities';
import { questions } from '@/questions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      answers,
      selectedCategories,
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      userAgent,
      ipAddress
    } = body;

    // Insert quiz result
    const quizResultQuery = `
      INSERT INTO quiz_results (
        total_questions,
        answered_questions,
        completion_percentage,
        selected_categories,
        candidate_matches,
        mussab_match_percentage,
        user_agent,
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;

    // Calculate candidate matches for storage
    const candidateMatches = await calculateCandidateMatches(answers, selectedCategories);
    
    // Calculate Mussab Match Percentage using the new scoring system
    const mussabMatchPercentage = calculateMussabMatchPercentage(answers, questions, selectedCategories);
    
    const quizResultValues = [
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      JSON.stringify(selectedCategories),
      JSON.stringify(candidateMatches),
      mussabMatchPercentage,
      userAgent || null,
      ipAddress || null
    ];

    const quizResult = await pool.query(quizResultQuery, quizResultValues);
    const quizResultId = quizResult.rows[0].id;

    // Insert individual answers
    const answerPromises = Object.entries(answers).flatMap(([questionId, answerIndices]) => {
      const answerIndicesArray = Array.isArray(answerIndices) ? answerIndices : [answerIndices];
      
      return answerIndicesArray.map(answerIndex => {
        const answerQuery = `
          INSERT INTO quiz_answers (
            quiz_result_id,
            question_id,
            option_id
          ) VALUES ($1, $2, $3)
        `;
        
        // Get the option ID based on question ID and answer index
        return getOptionId(parseInt(questionId), answerIndex as number).then(optionId => {
          if (optionId) {
            return pool.query(answerQuery, [quizResultId, parseInt(questionId), optionId]);
          }
        });
      });
    });

    await Promise.all(answerPromises);

    return NextResponse.json({ 
      success: true, 
      quizResultId,
      candidateMatches,
      mussabMatchPercentage
    });

  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz results' },
      { status: 500 }
    );
  }
}

// Helper function to get option ID based on question ID and answer index
async function getOptionId(questionId: number, answerIndex: number): Promise<number | null> {
  try {
    const query = `
      SELECT id FROM quiz_options 
      WHERE question_id = $1 
      ORDER BY option_label 
      LIMIT 1 OFFSET $2
    `;
    
    const result = await pool.query(query, [questionId, answerIndex]);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error getting option ID:', error);
    return null;
  }
}

// Helper function to calculate candidate matches (matching UI logic)
async function calculateCandidateMatches(answers: Record<number, number[]>, selectedCategories: string[] = []) {
  try {
    const candidateScores: Record<string, number> = {};
    const candidateMatches: Record<string, number> = {};
    const totalPossibleMatches: Record<string, number> = {};
    
    // Initialize scores for all candidates
    const candidatesQuery = 'SELECT id, name FROM candidates';
    const candidatesResult = await pool.query(candidatesQuery);
    
    candidatesResult.rows.forEach(candidate => {
      candidateScores[candidate.name] = 0;
      candidateMatches[candidate.name] = 0;
      totalPossibleMatches[candidate.name] = 0;
    });

    // Get all questions and their categories
    const questionsQuery = `
      SELECT q.id, q.category, q.question_text, opt.id as option_id, opt.option_label, opt.option_text, c.name as candidate_name
      FROM quiz_questions q
      JOIN quiz_options opt ON q.id = opt.question_id
      LEFT JOIN quiz_option_candidates qoc ON opt.id = qoc.option_id
      LEFT JOIN candidates c ON qoc.candidate_id = c.id
      ORDER BY q.id, opt.option_label
    `;
    
    const questionsResult = await pool.query(questionsQuery);
    
    // Group by question
    const questionsMap: { [key: number]: any[] } = {};
    questionsResult.rows.forEach(row => {
      if (!questionsMap[row.id]) {
        questionsMap[row.id] = [];
      }
      questionsMap[row.id].push(row);
    });

    // Calculate scores based on answers (matching UI logic)
    for (const [questionId, answerIndices] of Object.entries(answers)) {
      const answerIndicesArray = Array.isArray(answerIndices) ? answerIndices : [answerIndices];
      // Convert UI question ID (0-based) to database question ID (1-based)
      const databaseQuestionId = parseInt(questionId) + 1;
      const questionData = questionsMap[databaseQuestionId];
      
      console.log(`DB: Processing question ${questionId} (DB: ${databaseQuestionId}), answers: ${answerIndicesArray}, data:`, questionData);
      
      if (questionData && answerIndicesArray.length > 0) {
        // Determine if this question belongs to a selected category
        const questionCategory = questionData[0].category;
        
        // Map UI category names to database category names
        const categoryMapping: Record<string, string[]> = {
          'housing': ['Housing Affordability', 'Housing', 'Development and Gentrification'],
          'education': ['Charter Schools', 'Education', 'Public Schools', 'Education Quality'],
          'social': ['Healthcare Access', 'Social Services', 'Community', 'Immigration'],
          'transportation': ['Street Usage', 'Transportation', 'Transit', 'Turnpike Expansion'],
          'safety': ['Public Safety', 'Crime Prevention'],
          'governance': ['Government Collaboration', 'Transparency and Trust', 'Government', 'Leadership Style', 'Climate Resilience']
        };
        
        // Check if any of the selected categories match this question's category
        const isWeightedQuestion = selectedCategories.some(selectedCat => {
          const mappedCategories = categoryMapping[selectedCat] || [selectedCat];
          return mappedCategories.includes(questionCategory);
        });
        
        const weight = isWeightedQuestion ? 2 : 1; // Double points for selected categories
        
        // Count matches for each selected option
        answerIndicesArray.forEach(answerIndex => {
          // Convert answerIndex (0,1,2,3) to option_label ('A','B','C','D')
          const optionLabels = ['A', 'B', 'C', 'D', 'E'];
          const targetOptionLabel = optionLabels[answerIndex];
          
          // Find all options with this answerIndex (there might be multiple candidates per option)
          const selectedOptions = questionData.filter(option => 
            option.option_label === targetOptionLabel
          );
          
          if (selectedOptions.length > 0) {
            selectedOptions.forEach(selectedOption => {
              if (selectedOption.candidate_name) {
                candidateScores[selectedOption.candidate_name] += weight;
                candidateMatches[selectedOption.candidate_name] += weight;
              }
            });
          }
        });
        
        // Count total possible matches for each candidate across all options
        questionData.forEach(option => {
          if (option.candidate_name) {
            totalPossibleMatches[option.candidate_name] += weight;
          }
        });
      }
    }

    // Calculate the total points accrued by all candidates (matching UI logic)
    const totalPointsAccrued = Object.values(candidateScores).reduce((sum, val) => sum + val, 0);

    // Calculate match percentages and create results (matching UI logic)
    const candidateMatchesResult = Object.keys(candidateScores).map(candidate => {
      const matchPercentage = totalPointsAccrued > 0 ? Math.round((candidateScores[candidate] / totalPointsAccrued) * 100) : 0;
      return {
        candidate,
        matchPercentage,
        matchingAnswers: candidateMatches[candidate],
        totalPossibleMatches: totalPossibleMatches[candidate]
      };
    });

    // Sort by match percentage (highest first)
    candidateMatchesResult.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return candidateMatchesResult;
  } catch (error) {
    console.error('Error calculating candidate matches:', error);
    return [];
  }
}
