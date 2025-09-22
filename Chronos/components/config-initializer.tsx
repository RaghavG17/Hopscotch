'use client';

import { useEffect } from 'react';
import { logConfigurationStatus } from '@/lib/config';

/**
 * Configuration Initializer Component
 * 
 * This component runs on the client side to log configuration status
 * and provide helpful information about the current setup.
 */
export function ConfigInitializer() {
    useEffect(() => {
        // Log configuration status on startup
        logConfigurationStatus();
    }, []);

    // This component doesn't render anything
    return null;
}
