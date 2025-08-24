import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

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
        user_agent,
        ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    // Calculate candidate matches for storage
    const candidateMatches = await calculateCandidateMatches(answers);
    
    const quizResultValues = [
      totalQuestions,
      answeredQuestions,
      completionPercentage,
      JSON.stringify(selectedCategories),
      JSON.stringify(candidateMatches),
      userAgent || null,
      ipAddress || null
    ];

    const quizResult = await pool.query(quizResultQuery, quizResultValues);
    const quizResultId = quizResult.rows[0].id;

    // Insert individual answers
    const answerPromises = Object.entries(answers).map(([questionId, answerIndex]) => {
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

    await Promise.all(answerPromises);

    return NextResponse.json({ 
      success: true, 
      quizResultId,
      candidateMatches 
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

// Helper function to calculate candidate matches
async function calculateCandidateMatches(answers: Record<number, number>) {
  try {
    const candidateScores: Record<string, number> = {};
    
    // Initialize scores for all candidates
    const candidatesQuery = 'SELECT id, name FROM candidates';
    const candidatesResult = await pool.query(candidatesQuery);
    
    candidatesResult.rows.forEach(candidate => {
      candidateScores[candidate.name] = 0;
    });

    // Calculate scores based on answers
    for (const [questionId, answerIndex] of Object.entries(answers)) {
      const optionId = await getOptionId(parseInt(questionId), answerIndex);
      if (optionId) {
        const candidateQuery = `
          SELECT c.name 
          FROM candidates c
          JOIN quiz_option_candidates qoc ON c.id = qoc.candidate_id
          WHERE qoc.option_id = $1
        `;
        
        const candidateResult = await pool.query(candidateQuery, [optionId]);
        candidateResult.rows.forEach(row => {
          candidateScores[row.name] += 1;
        });
      }
    }

    // Calculate percentages
    const totalSelections = Object.values(candidateScores).reduce((sum, score) => sum + score, 0);
    const candidateMatches = Object.entries(candidateScores).map(([name, score]) => ({
      candidate: name,
      matchPercentage: totalSelections > 0 ? Math.round((score / totalSelections) * 100) : 0,
      matchingAnswers: score
    }));

    // Sort by match percentage (highest first)
    candidateMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return candidateMatches;
  } catch (error) {
    console.error('Error calculating candidate matches:', error);
    return [];
  }
}
