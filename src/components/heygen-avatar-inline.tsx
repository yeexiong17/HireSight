"use client";

import { useEffect, useRef, useState } from 'react';

interface HeyGenAvatarInlineProps {
  onLoad?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const HeyGenAvatarInline = ({ onLoad, onError, className = "" }: HeyGenAvatarInlineProps = {}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Preload the HeyGen iframe by creating a hidden image that points to the domain
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preconnect';
    preloadLink.href = 'https://labs.heygen.com';
    document.head.appendChild(preloadLink);
    
    return () => {
      if (preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    console.log('HeyGen Avatar Inline: Initializing...');

    const initializeHeyGen = () => {
      try {
        console.log('HeyGen Avatar Inline: Creating new instance...');
        
        const host = "https://labs.heygen.com";
        const url = host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJXYXluZV8yMDI0MDcxMSIsInByZXZpZXdJ%0D%0AbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzL2EzZmRiMGM2NTIwMjRmNzk5%0D%0AODRhYWVjMTFlYmYyNjk0XzM0MzUwL3ByZXZpZXdfdGFyZ2V0LndlYnAiLCJuZWVkUmVtb3ZlQmFj%0D%0Aa2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImYyMGIxOTIwZTY5ZjQwYmJhZDUwNjA1%0D%0AMmM3ODIwNjAwIiwidXNlcm5hbWUiOiI2OTc0YmQxOTM4ZmM0OGNlYWIwOWMxMmY5NDdlYzhiOCJ9&inIFrame=1";
        
        // Create iframe directly in the container
        const iframe = document.createElement("iframe");
        iframe.allowFullscreen = false;
        iframe.title = "HeyGen AI Avatar";
        iframe.setAttribute('role', 'dialog');
        iframe.allow = "microphone";
        iframe.src = url;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "0";
        iframe.style.borderRadius = "inherit";
        
        // Set up message listener
        const messageHandler = (e: MessageEvent) => {
          if (e.origin === host && e.data && e.data.type && e.data.type === "streaming-embed") {
            console.log('HeyGen Avatar Inline: Received message', e.data.action);
            
            if (e.data.action === "init") {
              setIsLoaded(true);
              setError(null);
              onLoad?.();
              console.log('HeyGen Avatar Inline: Successfully initialized');
            } else if (e.data.action === "error") {
              console.error('HeyGen Avatar Inline: Error from iframe', e.data);
              const errorMsg = 'Failed to load AI avatar';
              setError(errorMsg);
              onError?.(errorMsg);
            }
          }
        };
        
        // Add iframe load error handling
        iframe.onerror = () => {
          console.error('HeyGen Avatar Inline: Iframe failed to load');
          const errorMsg = 'Failed to load AI avatar iframe';
          setError(errorMsg);
          onError?.(errorMsg);
        };
        
        iframe.onload = () => {
          console.log('HeyGen Avatar Inline: Iframe loaded successfully');
        };
        
        window.addEventListener("message", messageHandler);
        
        // Add iframe to container
        if (containerRef.current) {
          containerRef.current.appendChild(iframe);
        }
        
        console.log('HeyGen Avatar Inline: Iframe added to container');
        
        // Store cleanup function
        cleanupRef.current = () => {
          console.log('HeyGen Avatar Inline: Cleaning up...');
          window.removeEventListener("message", messageHandler);
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        };
        
        // Set a timeout to show error if not loaded within 30 seconds
        setTimeout(() => {
          if (!isLoaded) {
            console.warn('HeyGen Avatar Inline: Taking longer than expected to load');
            const errorMsg = 'AI avatar is taking longer than expected to load';
            setError(errorMsg);
            onError?.(errorMsg);
            
            // Attempt to retry loading once if it fails
            console.log('HeyGen Avatar Inline: Attempting to reload...');
            if (iframe.parentNode) {
              iframe.parentNode.removeChild(iframe);
            }
            
            // Create a new iframe with a different cache-busting parameter
            const newIframe = document.createElement("iframe");
            newIframe.allowFullscreen = false;
            newIframe.title = "HeyGen AI Avatar";
            newIframe.setAttribute('role', 'dialog');
            newIframe.allow = "microphone";
            newIframe.src = `${url}&cacheBust=${Date.now()}`;
            newIframe.style.width = "100%";
            newIframe.style.height = "100%";
            newIframe.style.border = "0";
            newIframe.style.borderRadius = "inherit";
            
            // Add the new iframe to the container
            if (containerRef.current) {
              containerRef.current.appendChild(newIframe);
              console.log('HeyGen Avatar Inline: Reload attempt - new iframe added');
            }
          }
        }, 30000);
        
      } catch (error) {
        console.error('HeyGen Avatar Inline: Error during initialization', error);
        const errorMsg = 'Failed to initialize AI avatar';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const timer = setTimeout(initializeHeyGen, 1000);

    return () => {
      clearTimeout(timer);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isClient, onLoad, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div className={`w-full h-full bg-slate-700 rounded-md flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm">Initializing AI Avatar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-700 rounded-md overflow-hidden"
        style={{ minHeight: '200px' }}
      />
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-slate-700 rounded-md flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 rounded-full bg-slate-600 flex items-center justify-center mx-auto mb-2">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm">Loading AI Avatar...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-100 rounded-md flex flex-col items-center justify-center">
          <div className="text-red-700 text-center p-4">
            <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                // Force reload the component by triggering a state change
                setIsClient(false);
                setTimeout(() => setIsClient(true), 10);
              }}
              className="mt-4 px-4 py-2 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-800 transition-colors"
            >
              Retry Loading
            </button>
          </div>
          <div className="mt-4 text-slate-700 text-xs max-w-xs text-center">
            <p>If this issue persists, please check your internet connection or try again later.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeyGenAvatarInline;
