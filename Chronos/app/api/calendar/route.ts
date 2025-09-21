import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { googleConfig } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    switch (action) {
      case 'list-events':
        const timeMin = searchParams.get('timeMin');
        const timeMax = searchParams.get('timeMax');

        const eventsResponse = await calendar.events.list({
          calendarId: 'primary',
          timeMin: timeMin || new Date().toISOString(),
          timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          singleEvents: true,
          orderBy: 'startTime',
        });

        const events = eventsResponse.data.items?.map(event => ({
          id: event.id,
          title: event.summary || 'No Title',
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          description: event.description,
          location: event.location,
          attendees: event.attendees?.map(attendee => attendee.email) || [],
        })) || [];

        return NextResponse.json({ events });

      case 'create-event':
        const eventData = await request.json();

        const event = {
          summary: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start: {
            dateTime: eventData.start,
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: eventData.end,
            timeZone: 'America/New_York',
          },
        };

        const createdEvent = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });

        return NextResponse.json({ event: createdEvent.data });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to interact with Google Calendar' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, accessToken, ...data } = body;

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    switch (action) {
      case 'create-event':
        const event = {
          summary: data.title,
          description: data.description,
          location: data.location,
          start: {
            dateTime: data.start,
            timeZone: 'America/New_York',
          },
          end: {
            dateTime: data.end,
            timeZone: 'America/New_York',
          },
        };

        const createdEvent = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });

        return NextResponse.json({ event: createdEvent.data });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return NextResponse.json(
      { error: 'Failed to interact with Google Calendar' },
      { status: 500 }
    );
  }
}
