import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const correctCode = process.env.ACCESS_CODE;

    if (!correctCode) {
      console.error('ACCESS_CODE is not set in environment variables.');
      return NextResponse.json({ success: false, error: 'Server configuration error.' }, { status: 500 });
    }

    if (code === correctCode) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect code.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in check-code API:', error);
    return NextResponse.json({ success: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
} 