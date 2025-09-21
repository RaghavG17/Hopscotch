import { google } from 'googleapis';
import { googleConfig } from './config';

export class GoogleCalendarService {
  private oauth2Client: any;

  constructor() {
    // Validate Google OAuth configuration
    if (!googleConfig.enabled) {
      console.warn('⚠️  Google Calendar service is not properly configured. Calendar features will be disabled.');
      console.warn('   Please check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
      // Don't throw error, just disable the service
      this.oauth2Client = null;
      return;
    }

    this.oauth2Client = new google.auth.OAuth2(
      googleConfig.clientId,
      googleConfig.clientSecret,
      googleConfig.redirectUri
    );
  }

  // Generate the authorization URL for OAuth2 flow
  getAuthUrl(): string {
    if (!this.oauth2Client) {
      throw new Error('Google Calendar service is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  // Set credentials for API calls
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  // Get calendar events
  async getEvents(timeMin?: string, timeMax?: string) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items?.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      description: event.description,
      location: event.location,
      attendees: event.attendees?.map(attendee => attendee.email) || [],
    })) || [];
  }

  // Create a new event
  async createEvent(eventData: {
    title: string;
    description?: string;
    location?: string;
    start: string;
    end: string;
  }) {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

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

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  }
}
