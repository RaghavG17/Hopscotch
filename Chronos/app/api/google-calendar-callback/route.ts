import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '@/lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('Callback API received - code:', code, 'error:', error);

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL('/?error=oauth_error', request.url));
    }

    if (code) {
      try {
        console.log('Exchanging code for tokens...');
        const googleCalendarService = new GoogleCalendarService();
        const tokens = await googleCalendarService.getTokens(code);
        console.log('Tokens received:', tokens);

        // Return a page that stores both access and refresh tokens and closes the popup
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Google Calendar Connected</title>
            </head>
            <body>
              <div style="text-align: center; padding: 50px;">
                <h2>Google Calendar Connected Successfully!</h2>
                <p>You can close this window.</p>
              </div>
              <script>
                // Store both access and refresh tokens
                localStorage.setItem('google_calendar_access_token', '${tokens.access_token}');
                localStorage.setItem('google_calendar_refresh_token', '${tokens.refresh_token || ''}');
                localStorage.setItem('google_calendar_token_expiry', '${tokens.expiry_date || Date.now() + 3600000}');
                console.log('Tokens stored:', { access: '${tokens.access_token}', refresh: '${tokens.refresh_token || 'none'}' });
                window.close();
              </script>
            </body>
          </html>
        `;

        return new NextResponse(html, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
      }
    } else {
      console.log('No code received');
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }
  } catch (error) {
    console.error('Callback API error:', error);
    return NextResponse.redirect(new URL('/?error=callback_error', request.url));
  }
}
