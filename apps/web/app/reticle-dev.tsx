'use client';
import { useEffect } from 'react';

/** Dev-only: connect Reticle + install the React adapter safely after hydration. */
export function ReticleDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const token = process.env.NEXT_PUBLIC_RETICLE_TOKEN;
    if (!token) return; // Only connect if Reticle token is configured

    void import('@reticlehq/react').then(({ reticle, install, registerCapabilities }) => {
      try {
        install();
        const root = process.env.NEXT_PUBLIC_RETICLE_ROOT;
        reticle.connect({ projectId: 'web-995a1388', token, ...(root ? { root } : {}) });

        registerCapabilities({
          testids: [],
          signals: [],
          stores: [],
        });
      } catch (e) {
        // Silently ignore Reticle connection errors if daemon is offline
      }
    }).catch(() => {});
  }, []);

  return null;
}
