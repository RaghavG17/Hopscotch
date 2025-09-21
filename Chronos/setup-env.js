#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Chronos environment...\n');

const envContent = `# Chronos Environment Configuration
# This file contains the shared API keys for team use

# =============================================================================
# AI SERVICES
# =============================================================================

# Groq AI API Key (Required for timeline generation)
# Shared API key for team use
GROQ_API_KEY=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

# =============================================================================
# GOOGLE CALENDAR INTEGRATION
# =============================================================================

# Google OAuth Credentials (Required for Calendar features)
# These are test credentials - calendar features will be disabled
GOOGLE_CLIENT_ID=test_google_client_id
GOOGLE_CLIENT_SECRET=test_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google-calendar-callback

# =============================================================================
# FIREBASE CONFIGURATION
# =============================================================================

# Firebase is pre-configured with default values
# No additional setup required
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAikGQVIazlsfaAeJ-xmVddT6VxwnZhPXs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sixseven-5aa55.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sixseven-5aa55
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sixseven-5aa55.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=939319459108
NEXT_PUBLIC_FIREBASE_APP_ID=1:939319459108:web:cd687ae48a8bcae26207b1
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XF7DGRCSHM

# =============================================================================
# DATABASE
# =============================================================================

# SQLite database is automatically configured
# No additional setup required
`;

const envPath = path.join(__dirname, '.env.local');

try {
    // Check if .env.local already exists
    if (fs.existsSync(envPath)) {
        console.log('✅ .env.local already exists');
        console.log('📝 If you need to update the API keys, edit .env.local manually\n');
    } else {
        // Create .env.local file
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Created .env.local with shared API keys');
        console.log('🔑 All API keys are pre-configured for team use\n');
    }

    console.log('🎉 Setup complete! You can now run:');
    console.log('   npm run dev\n');

} catch (error) {
    console.error('❌ Error setting up environment:', error.message);
    process.exit(1);
}
