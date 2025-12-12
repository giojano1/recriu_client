'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

export function UnhandledRejectionHandler() {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection detected', {
        action: 'unhandled_promise_rejection',
        error: event.reason?.message || String(event.reason),
        metadata: {
          stack: event.reason?.stack,
        },
      });

      // Check if it's an auth-related error
      const errorMessage = event.reason?.message?.toLowerCase() || '';
      if (errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
        logger.warn('Auth-related unhandled rejection - this should not happen', {
          action: 'auth_unhandled_rejection',
        });
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => window.removeEventListener('unhandledrejection', handleRejection);
  }, []);

  return null;
}
