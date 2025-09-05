import { NextRequest, NextResponse } from 'next/server';
import { setupFirebaseProject, checkFirebaseStatus } from '@/lib/setup-firebase';

export async function GET() {
  try {
    const status = await checkFirebaseStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.message,
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await setupFirebaseProject();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        timestamp: new Date()
      },
      { status: 500 }
    );
  }
}
