import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { email, quizResultId } = await request.json();

    // Validate input
    if (!email || !quizResultId) {
      return NextResponse.json(
        { error: 'Email and quiz result ID are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if quiz result exists
    const quizCheckQuery = 'SELECT id FROM quiz_results WHERE id = $1';
    const quizCheckResult = await pool.query(quizCheckQuery, [quizResultId]);
    
    if (quizCheckResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Quiz result not found' },
        { status: 404 }
      );
    }

    // Update the quiz result with the email
    const updateQuery = 'UPDATE quiz_results SET email = $1 WHERE id = $2 RETURNING id';
    const updateResult = await pool.query(updateQuery, [email, quizResultId]);

    if (updateResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update quiz result' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email successfully added to newsletter',
      quizResultId: updateResult.rows[0].id
    });

  } catch (error) {
    console.error('Error in newsletter signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
