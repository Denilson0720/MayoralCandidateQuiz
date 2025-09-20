import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days');

    // Validate days parameter
    if (!days || isNaN(Number(days)) || Number(days) < 0) {
      return NextResponse.json(
        { error: 'Valid days parameter is required' },
        { status: 400 }
      );
    }

    const daysNumber = Number(days);
    
    // Calculate the date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysNumber);

    // Query to get emails with timestamps within the specified days
    const query = `
      SELECT 
        id,
        email,
        timestamp,
        total_questions,
        answered_questions,
        completion_percentage,
        mussab_match_percentage,
        selected_categories
      FROM quiz_results 
      WHERE email IS NOT NULL 
        AND email != ''
        AND timestamp >= $1
      ORDER BY timestamp DESC
    `;

    const result = await pool.query(query, [dateThreshold]);

    return NextResponse.json({
      success: true,
      emails: result.rows,
      count: result.rows.length,
      dateThreshold: dateThreshold.toISOString(),
      daysFiltered: daysNumber
    });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
