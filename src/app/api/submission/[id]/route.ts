import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
    
    // Fetch submission details
    const submissionQuery = `
      SELECT 
        id,
        completion_percentage,
        candidate_matches,
        answered_questions,
        total_questions,
        selected_categories
      FROM quiz_results 
      WHERE id = $1
    `;
    
    const submissionResult = await pool.query(submissionQuery, [submissionId]);
    
    if (submissionResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }
    
    const submission = submissionResult.rows[0];
    
    // Parse JSON fields
    const candidateMatches = typeof submission.candidate_matches === 'string' 
      ? JSON.parse(submission.candidate_matches) 
      : submission.candidate_matches;
    
    const selectedCategories = typeof submission.selected_categories === 'string'
      ? JSON.parse(submission.selected_categories)
      : submission.selected_categories;
    
    // Fetch answers for this submission
    const answersQuery = `
      SELECT 
        qa.question_id,
        qa.option_id,
        opt.option_label,
        opt.option_text
      FROM quiz_answers qa
      JOIN quiz_options opt ON qa.option_id = opt.id
      WHERE qa.quiz_result_id = $1
      ORDER BY qa.question_id, opt.option_label
    `;
    
    const answersResult = await pool.query(answersQuery, [submissionId]);
    
    // Group answers by question_id and convert to the format expected by the UI
    const answers: Record<number, number[]> = {};
    answersResult.rows.forEach(row => {
      const questionId = row.question_id - 1; // Convert to 0-based for UI
      const optionIndex = parseInt(row.option_label) - 1; // Convert A=0, B=1, etc.
      
      if (!answers[questionId]) {
        answers[questionId] = [];
      }
      answers[questionId].push(optionIndex);
    });
    
               return NextResponse.json({
             id: submission.id,
             completion_percentage: submission.completion_percentage,
             candidate_matches: candidateMatches,
             answered_questions: submission.answered_questions,
             total_questions: submission.total_questions,
             selected_categories: selectedCategories,
             answers: answers,
             submitted_at: new Date().toISOString() // Use current time as fallback
           });
    
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission data' },
      { status: 500 }
    );
  }
}
