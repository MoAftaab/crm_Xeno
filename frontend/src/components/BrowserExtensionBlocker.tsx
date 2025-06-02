'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface BrowserExtensionBlockerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Component that helps prevent browser extensions from interfering with React hydration
 * by suppressing hydration warnings and using specific isolation techniques
 */
const BrowserExtensionBlocker: React.FC<BrowserExtensionBlockerProps> = ({ 
  children, 
  className 
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Attempt to clean up any extension elements
    const cleanup = () => {
      try {
        // Known extension elements to look for and clean up
        const extensionSelectors = [
          '[id^="loom-companion"]',
          '[ext-id]',
          '[id="shadow-host-companion"]'
        ];
        
        extensionSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        });
      } catch (error) {
        console.debug('Extension cleanup error:', error);
      }
    };
    
    // Run cleanup on mount and before unmount
    cleanup();
    return cleanup;
  }, []);
  
  return (
    <div 
      className={className}
      suppressHydrationWarning 
      style={{ isolation: 'isolate' }}
      data-extension-protected="true"
    >
      {isMounted ? children : null}
    </div>
  );
};

export default BrowserExtensionBlocker; 
 