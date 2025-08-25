import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Get most popular candidates (simplified)
      const candidateQuery = `
        SELECT 
          c.name,
          COUNT(qa.id) as total_selections,
          COUNT(DISTINCT qa.quiz_result_id) as unique_quiz_attempts
        FROM candidates c
        LEFT JOIN quiz_option_candidates qoc ON c.id = qoc.candidate_id
        LEFT JOIN quiz_answers qa ON qoc.option_id = qa.option_id
        GROUP BY c.id, c.name
        ORDER BY total_selections DESC
      `;
      
      const candidateResult = await client.query(candidateQuery);
      
      // Get most popular categories (simplified)
      const categoryQuery = `
        SELECT 
          q.category,
          COUNT(qa.id) as total_selections,
          COUNT(DISTINCT qa.quiz_result_id) as unique_attempts
        FROM quiz_questions q
        LEFT JOIN quiz_answers qa ON q.id = qa.question_id
        GROUP BY q.category
        ORDER BY total_selections DESC
      `;
      
      const categoryResult = await client.query(categoryQuery);
      
      // Get recent quiz submissions
      const recentQuery = `
        SELECT 
          qr.id,
          qr.completion_percentage,
          qr.candidate_matches,
          qr.answered_questions,
          qr.total_questions,
          qr.selected_categories
        FROM quiz_results qr
        ORDER BY qr.id DESC
        LIMIT 5
      `;
      
      const recentResult = await client.query(recentQuery);
      
      // Get total submissions count
      const totalQuery = `SELECT COUNT(*) as total FROM quiz_results`;
      const totalResult = await client.query(totalQuery);
      
      return NextResponse.json({
        candidates: candidateResult.rows,
        categories: categoryResult.rows,
        recentSubmissions: recentResult.rows,
        totalSubmissions: parseInt(totalResult.rows[0].total)
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
