import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Get question analytics with option popularity and candidate associations
      const questionAnalyticsQuery = `
        SELECT 
          q.id as question_id,
          q.category,
          q.question_text,
          opt.id as option_id,
          opt.option_label,
          opt.option_text,
          COUNT(qa.id) as selection_count,
          COUNT(DISTINCT qa.quiz_result_id) as unique_quiz_attempts,
          ROUND(COUNT(qa.id) * 100.0 / NULLIF(COUNT(DISTINCT qa.quiz_result_id), 0), 1) as selection_percentage,
          STRING_AGG(DISTINCT c.name, ', ') as candidate_names
        FROM quiz_questions q
        JOIN quiz_options opt ON q.id = opt.question_id
        LEFT JOIN quiz_answers qa ON opt.id = qa.option_id
        LEFT JOIN quiz_option_candidates qoc ON opt.id = qoc.option_id
        LEFT JOIN candidates c ON qoc.candidate_id = c.id
        GROUP BY q.id, q.category, q.question_text, opt.id, opt.option_label, opt.option_text
        ORDER BY q.id, selection_count DESC
      `;
      
      const questionResult = await client.query(questionAnalyticsQuery);
      
      // Get total quiz attempts for percentage calculations
      const totalAttemptsQuery = `SELECT COUNT(DISTINCT quiz_result_id) as total_attempts FROM quiz_answers`;
      const totalAttemptsResult = await client.query(totalAttemptsQuery);
      const totalAttempts = parseInt(totalAttemptsResult.rows[0]?.total_attempts || '0');
      
      // Group results by question
      const questionsByCategory: { [key: string]: any[] } = {};
      
      questionResult.rows.forEach(row => {
        const category = row.category;
        if (!questionsByCategory[category]) {
          questionsByCategory[category] = [];
        }
        
        // Find or create question entry
        let question = questionsByCategory[category].find(q => q.question_id === row.question_id);
        if (!question) {
          question = {
            question_id: row.question_id,
            category: row.category,
            question_text: row.question_text,
            options: [],
            total_selections: 0
          };
          questionsByCategory[category].push(question);
        }
        
        // Add option data
        question.options.push({
          option_id: row.option_id,
          option_label: row.option_label,
          option_text: row.option_text,
          selection_count: parseInt(row.selection_count),
          unique_quiz_attempts: parseInt(row.unique_quiz_attempts),
          selection_percentage: parseFloat(row.selection_percentage || '0'),
          candidate_names: row.candidate_names || ''
        });
        
        question.total_selections += parseInt(row.selection_count);
      });
      
      // Sort questions by total selections within each category
      Object.keys(questionsByCategory).forEach(category => {
        questionsByCategory[category].sort((a, b) => b.total_selections - a.total_selections);
      });
      
      return NextResponse.json({
        questionsByCategory,
        totalAttempts,
        categories: Object.keys(questionsByCategory)
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error fetching question analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question analytics' },
      { status: 500 }
    );
  }
}
