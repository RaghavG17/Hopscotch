/**
 * Centralized API Key Management System
 * 
 * This module provides a centralized way to manage all API keys and external service configurations.
 * Similar to the architecture used in the previous project, this ensures seamless API key sharing
 * across all AI services and external integrations.
 */

// Environment variable validation and loading
export const config = {
    // AI Services
    groq: {
        apiKey: process.env.GROQ_API_KEY,
        enabled: !!process.env.GROQ_API_KEY,
    },

    // Google Services
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-calendar-callback',
        enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },

    // Firebase Configuration
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAikGQVIazlsfaAeJ-xmVddT6VxwnZhPXs",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "sixseven-5aa55.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "sixseven-5aa55",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "sixseven-5aa55.firebasestorage.app",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "939319459108",
        appId: process.env.FIREBASE_APP_ID || "1:939319459108:web:cd687ae48a8bcae26207b1",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-XF7DGRCSHM",
        enabled: true, // Firebase is always enabled as it's core to the app
    },

    // Database Configuration
    database: {
        path: process.env.DATABASE_PATH || './data/chronos.db',
        enabled: true,
    },

    // Application Configuration
    app: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
};

// Validation function to check if all required API keys are configured
export function validateConfiguration(): { isValid: boolean; missingKeys: string[]; warnings: string[] } {
    const missingKeys: string[] = [];
    const warnings: string[] = [];

    // Check required AI service keys
    if (!config.groq.apiKey) {
        missingKeys.push('GROQ_API_KEY');
    }

    // Check Google OAuth configuration
    if (!config.google.clientId) {
        missingKeys.push('GOOGLE_CLIENT_ID');
    }
    if (!config.google.clientSecret) {
        missingKeys.push('GOOGLE_CLIENT_SECRET');
    }

    // Check if services are properly configured
    if (!config.groq.enabled) {
        warnings.push('Groq AI service is disabled - timeline generation will not work');
    }

    if (!config.google.enabled) {
        warnings.push('Google Calendar integration is disabled - calendar features will not work');
    }

    return {
        isValid: missingKeys.length === 0,
        missingKeys,
        warnings,
    };
}

// Service initialization status
export function getServiceStatus() {
    return {
        groq: {
            enabled: config.groq.enabled,
            status: config.groq.enabled ? 'ready' : 'disabled',
        },
        google: {
            enabled: config.google.enabled,
            status: config.google.enabled ? 'ready' : 'disabled',
        },
        firebase: {
            enabled: config.firebase.enabled,
            status: 'ready',
        },
        database: {
            enabled: config.database.enabled,
            status: 'ready',
        },
    };
}

// Log configuration status on startup
export function logConfigurationStatus() {
    const validation = validateConfiguration();
    const serviceStatus = getServiceStatus();

    console.log('\n🔧 Chronos Configuration Status:');
    console.log('================================');

    Object.entries(serviceStatus).forEach(([service, status]) => {
        const icon = status.enabled ? '✅' : '❌';
        console.log(`${icon} ${service.toUpperCase()}: ${status.status}`);
    });

    if (validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        validation.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    if (!validation.isValid) {
        console.log('\n❌ Missing Required Configuration:');
        validation.missingKeys.forEach(key => console.log(`   - ${key}`));
        console.log('\n📝 Please check your .env.local file and ensure all required API keys are set.');
    } else {
        console.log('\n🎉 All services configured successfully!');
    }
    console.log('================================\n');
}

// Auto-log configuration status when this module is imported
if (typeof window === 'undefined') {
    // Only run on server side
    logConfigurationStatus();
}

// Export individual service configurations for easy importing
export const groqConfig = config.groq;
export const googleConfig = config.google;
export const firebaseConfig = config.firebase;
export const databaseConfig = config.database;
export const appConfig = config.app;
