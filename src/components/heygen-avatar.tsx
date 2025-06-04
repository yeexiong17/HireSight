"use client";

import { useEffect, useRef, useState } from 'react';

interface HeyGenAvatarProps {
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const HeyGenAvatar = ({ onLoad, onError }: HeyGenAvatarProps = {}) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    console.log('HeyGen Avatar: Initializing...');

    // Check if already exists and remove it
    const existingEmbed = document.getElementById('heygen-streaming-embed');
    if (existingEmbed) {
      console.log('HeyGen Avatar: Removing existing instance');
      existingEmbed.remove();
    }

    const initializeHeyGen = () => {
      try {
        console.log('HeyGen Avatar: Creating new instance...');
        
        const host = "https://labs.heygen.com";
        const shareToken = "eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJLYXR5YV9DYXN1YWxMb29rX3B1YmxpYyIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3YzLzViMWRiN2UyMDgwZjQxMDZhODViOTg3NDM3NDMwYTI0XzU1ODYwL3ByZXZpZXdfdGFyZ2V0LndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6IjEwYjY0MmEyMzg5MTQ5MWI4NDVjYTczMTIxYzE0OTYyIiwidXNlcm5hbWUiOiJkMTA1NzZmZDA5ZDc0ZDRmYjJkM2M0NGU1MmI3Yjg2OCJ9";
        const url = `${host}/guest/streaming-embed?share=${shareToken}&inIFrame=1`;
        const clientWidth = document.body.clientWidth;
        
        // Create wrapper div
        const wrapDiv = document.createElement("div");
        wrapDiv.id = "heygen-streaming-embed";
        
        // Create container
        const container = document.createElement("div");
        container.id = "heygen-streaming-container";
        
        // Create and add styles
        const stylesheet = document.createElement("style");
        stylesheet.id = "heygen-styles";
        stylesheet.innerHTML = `
          #heygen-streaming-embed {
            z-index: 9999;
            position: fixed;
            left: 40px;
            bottom: 40px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
            transition: all linear 0.1s;
            overflow: hidden;
            opacity: 0;
            visibility: hidden;
            background: #f3f4f6;
          }
          #heygen-streaming-embed.show {
            opacity: 1;
            visibility: visible;
          }
          #heygen-streaming-embed.expand {
            ${clientWidth < 540 ? "height: 266px; width: 96%; left: 50%; transform: translateX(-50%);" : "height: 366px; width: calc(366px * 16 / 9);"}
            border: 0;
            border-radius: 8px;
          }
          #heygen-streaming-container {
            width: 100%;
            height: 100%;
          }
          #heygen-streaming-container iframe {
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: inherit;
          }
        `;
        
        // Create iframe
        const iframe = document.createElement("iframe");
        iframe.allowFullscreen = false;
        iframe.title = "HeyGen AI Avatar";
        iframe.setAttribute('role', 'dialog');
        iframe.allow = "microphone";
        iframe.src = url;
        
        // Set up message listener
        let visible = false;
        let initial = false;
        
        const messageHandler = (e: MessageEvent) => {
          if (e.origin === host && e.data && e.data.type && e.data.type === "streaming-embed") {
            console.log('HeyGen Avatar: Received message', e.data.action);
            
            if (e.data.action === "init") {
              initial = true;
              wrapDiv.classList.add("show");
              setIsLoaded(true);
              setError(null);
              onLoad?.();
              console.log('HeyGen Avatar: Successfully initialized and shown');
            } else if (e.data.action === "show") {
              visible = true;
              wrapDiv.classList.add("expand");
              console.log('HeyGen Avatar: Expanded');
            } else if (e.data.action === "hide") {
              visible = false;
              wrapDiv.classList.remove("expand");
              console.log('HeyGen Avatar: Collapsed');
            } else if (e.data.action === "error") {
              console.error('HeyGen Avatar: Error from iframe', e.data);
              const errorMsg = 'Failed to load AI avatar';
              setError(errorMsg);
              onError?.(errorMsg);
            }
          }
        };
        
        // Add iframe load error handling
        iframe.onerror = () => {
          console.error('HeyGen Avatar: Iframe failed to load');
          const errorMsg = 'Failed to load AI avatar iframe';
          setError(errorMsg);
          onError?.(errorMsg);
        };
        
        iframe.onload = () => {
          console.log('HeyGen Avatar: Iframe loaded successfully');
        };
        
        window.addEventListener("message", messageHandler);
        
        // Assemble the components
        container.appendChild(iframe);
        wrapDiv.appendChild(stylesheet);
        wrapDiv.appendChild(container);
        document.body.appendChild(wrapDiv);
        
        console.log('HeyGen Avatar: DOM elements created and added');
        
        // Store cleanup function
        cleanupRef.current = () => {
          console.log('HeyGen Avatar: Cleaning up...');
          window.removeEventListener("message", messageHandler);
          const embed = document.getElementById('heygen-streaming-embed');
          const styles = document.getElementById('heygen-styles');
          if (embed) {
            embed.remove();
          }
          if (styles) {
            styles.remove();
          }
        };
        
        // Set a timeout to show error if not loaded within 15 seconds
        setTimeout(() => {
          if (!isLoaded) {
            console.warn('HeyGen Avatar: Taking longer than expected to load');
            const errorMsg = 'AI avatar is taking longer than expected to load';
            setError(errorMsg);
            onError?.(errorMsg);
          }
        }, 15000);
        
      } catch (error) {
        console.error('HeyGen Avatar: Error during initialization', error);
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
    return null;
  }

  return (
    <div>
      {!isLoaded && !error && (
        <div className="fixed bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Loading AI Avatar...
        </div>
      )}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm z-50 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default HeyGenAvatar;
