# Google Calendar Integration Setup Guide

## Overview
The calendar component has been updated to integrate with Google Calendar API, allowing users to:
- View their existing Google Calendar events
- Add suggested tasks directly to their Google Calendar
- Sync events in real-time

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### 2. OAuth2 Credentials Setup

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Set application type to "Web application"
5. Add authorized redirect URIs:
   - `http://localhost:3000/google-calendar-callback` (for development)
   - `https://yourdomain.com/google-calendar-callback` (for production)

### 3. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/google-calendar-callback
```

### 4. Required Scopes

The integration requests the following Google Calendar scopes:
- `https://www.googleapis.com/auth/calendar.readonly` - Read calendar events
- `https://www.googleapis.com/auth/calendar.events` - Create calendar events

## How It Works

### Authentication Flow
1. User clicks "Connect Google Calendar"
2. OAuth popup opens with Google's authorization page
3. User grants permissions
4. Google redirects to `/google-calendar-callback`
5. Callback page exchanges authorization code for access token
6. Access token is stored in localStorage
7. Calendar events are loaded and displayed

### API Endpoints

#### `/api/google-auth`
- `GET ?action=auth-url` - Returns Google OAuth authorization URL
- `GET ?action=callback&code=...` - Exchanges authorization code for tokens

#### `/api/calendar`
- `GET ?action=list-events&accessToken=...` - Fetches calendar events
- `POST` with `action=create-event` - Creates new calendar event

### Features

1. **Real-time Event Loading**: Fetches events from Google Calendar
2. **Task Integration**: Adds suggested tasks directly to Google Calendar
3. **Error Handling**: Comprehensive error handling with user-friendly messages
4. **Loading States**: Shows loading indicators during API calls
5. **Token Management**: Securely stores and manages OAuth tokens

## Security Considerations

- Access tokens are stored in localStorage (consider using secure storage for production)
- All API calls are made server-side to protect client secrets
- OAuth2 flow follows Google's security best practices

## Testing

1. Start your development server: `npm run dev`
2. Navigate to the calendar component
3. Click "Connect Google Calendar"
4. Complete the OAuth flow
5. Verify that your Google Calendar events appear
6. Test adding a suggested task to your calendar

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Ensure the redirect URI in Google Cloud Console matches your environment variable
2. **"Access token required"**: User needs to complete OAuth flow first
3. **"Failed to load calendar events"**: Check if Google Calendar API is enabled and credentials are correct

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are loaded correctly
3. Test API endpoints directly using tools like Postman
4. Check Google Cloud Console for API usage and errors

## Production Deployment

1. Update `GOOGLE_REDIRECT_URI` to your production domain
2. Add production redirect URI to Google Cloud Console
3. Consider implementing token refresh logic for long-lived sessions
4. Add proper error monitoring and logging
