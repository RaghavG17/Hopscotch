# Chronos Setup Instructions

## 🔧 Centralized API Key Management

Chronos uses a centralized API key management system that ensures seamless integration across all AI services and external APIs. This architecture allows all team members to use the same API keys consistently.

## 📋 Required API Keys

### 1. Groq AI API Key (Required)
- **Purpose**: AI timeline generation and analysis
- **Get it from**: [https://console.groq.com/](https://console.groq.com/)
- **Steps**:
  1. Sign up or log in to Groq Console
  2. Navigate to API Keys section
  3. Create a new API key
  4. Copy the key

### 2. Google OAuth Credentials (Required for Calendar)
- **Purpose**: Google Calendar integration
- **Get it from**: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- **Steps**:
  1. Create a new project or select existing one
  2. Enable Google Calendar API
  3. Create OAuth 2.0 credentials
  4. Set authorized redirect URI: `http://localhost:3000/api/google-calendar-callback`
  5. Copy Client ID and Client Secret

## 🚀 Quick Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chronos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (AUTOMATIC)**
   ```bash
   npm run setup
   ```
   This automatically creates `.env.local` with all the shared API keys!

4. **Start the development server**
   ```bash
   npm run dev
   ```

**That's it!** No manual configuration needed - all API keys are pre-configured for team use.

## 🏗️ Architecture Overview

The centralized configuration system works as follows:

### **Centralized Configuration (`lib/config.ts`)**
- Loads all API keys from environment variables
- Validates configuration on startup
- Provides service status monitoring
- Enables graceful degradation when services are unavailable

### **Service Integration Flow**
1. **Environment Setup**: API keys loaded from `.env.local`
2. **Configuration Validation**: System checks all required keys
3. **Service Initialization**: All AI services initialized with same keys
4. **Error Handling**: Clear error messages for missing configuration

### **Supported Services**
- ✅ **Groq AI**: Timeline generation and analysis
- ✅ **Google Calendar**: Event integration and OAuth
- ✅ **Firebase**: Authentication and database
- ✅ **SQLite**: Local data storage

## 🔍 Configuration Status

The system automatically logs configuration status on startup:

```
🔧 Chronos Configuration Status:
================================
✅ GROQ: ready
✅ GOOGLE: ready
✅ FIREBASE: ready
✅ DATABASE: ready

🎉 All services configured successfully!
```

## 🛠️ Troubleshooting

### Common Issues

**"Groq AI service is not configured"**
- Ensure `GROQ_API_KEY` is set in `.env.local`
- Verify the API key is valid and active
- Restart the development server

**"Google Calendar service is not properly configured"**
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify OAuth credentials are correct
- Check that redirect URI matches: `http://localhost:3000/api/google-calendar-callback`

**"Firebase API key not configured"**
- This is a warning only - defaults are provided
- For custom Firebase project, set `FIREBASE_API_KEY` in `.env.local`

### Service Status Check

The system provides detailed service status:
- **Ready**: Service is properly configured and available
- **Disabled**: Service is not configured (graceful degradation)
- **Error**: Service configuration is invalid

## 🔐 Security Notes

- Never commit `.env.local` to version control
- API keys are loaded once at startup
- Services gracefully degrade when keys are missing
- All sensitive configuration is centralized in one place

## 📚 Additional Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
