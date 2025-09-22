import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    console.log('Google Auth API called with action:', action);

    const googleCalendarService = new GoogleCalendarService();

    switch (action) {
      case 'auth-url':
        const authUrl = googleCalendarService.getAuthUrl();
        console.log('Generated auth URL:', authUrl);
        return NextResponse.json({ authUrl });

      case 'callback':
        const code = searchParams.get('code');
        console.log('Callback received with code:', code);
        if (!code) {
          return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
        }

        console.log('Exchanging code for tokens...');
        const tokens = await googleCalendarService.getTokens(code);
        console.log('Tokens received:', tokens);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, refreshToken } = body;

    console.log('Google Auth POST API called with action:', action);

    const googleCalendarService = new GoogleCalendarService();

    switch (action) {
      case 'refresh':
        if (!refreshToken) {
          return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
        }

        console.log('Refreshing access token...');
        const newTokens = await googleCalendarService.refreshToken(refreshToken);
        console.log('New tokens received:', newTokens);
        return NextResponse.json(newTokens);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google OAuth refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh Google OAuth token' },
      { status: 500 }
    );
  }
}
