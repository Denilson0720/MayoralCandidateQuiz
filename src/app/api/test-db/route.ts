import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0]);
    
    // Test quiz_questions table
    const questionsResult = await pool.query('SELECT COUNT(*) as count FROM quiz_questions');
    console.log('Quiz questions count:', questionsResult.rows[0]);
    
    // Test candidates table
    const candidatesResult = await pool.query('SELECT COUNT(*) as count FROM candidates');
    console.log('Candidates count:', candidatesResult.rows[0]);
    
    return NextResponse.json({ 
      success: true,
      currentTime: result.rows[0].current_time,
      questionsCount: questionsResult.rows[0].count,
      candidatesCount: candidatesResult.rows[0].count
    });
    
  } catch (error) {
    console.error('Database connection test failed:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}
