import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const googleCalendarService = new GoogleCalendarService();

    switch (action) {
      case 'auth-url':
        const authUrl = googleCalendarService.getAuthUrl();
        return NextResponse.json({ authUrl });

      case 'callback':
        const code = searchParams.get('code');
        if (!code) {
          return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
        }

        const tokens = await googleCalendarService.getTokens(code);
        return NextResponse.json({ tokens });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Failed to handle Google OAuth' },
      { status: 500 }
    );
  }
}
