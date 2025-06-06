"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChevronLeft, CheckCircle2, Info, Video, SendHorizontal, HelpCircle, User, UserRound, MessageCircle } from 'lucide-react';
import { HeyGenAvatarInline } from './heygen-avatar-inline';

// Dummy Recruiter Config - this would eventually be fetched or passed via props/context
const dummyRecruiterConfig = {
  jobId: "JOB123",
  jobRole: "Senior Frontend Developer",
  companyName: "TechCorp Inc.",
  interviewStyle: "friendly" as "friendly" | "formal" | "behavioral" | "stress-based",
  focusTraits: "problem-solving, communication, frontend expertise",
  requiredSkills: "React, TypeScript, Next.js, TailwindCSS",
  customQuestions: "Describe a complex UI you built and the challenges you faced.\nHow do you stay updated with frontend technologies?",
  estimatedDuration: "15-20 minutes",
};

interface Message {
  id: string;
  speaker: "ai" | "candidate";
  text: string;
  timestamp: string;
}

const interviewTips = [
  "Speak clearly and at a moderate pace.",
  "Use specific examples from your experience.",
  "Structure your answers with a beginning, middle, and end.",
  "It's okay to take a moment to think before answering."
];

// Add this new component for the chat input
const ChatInput = ({ onSendMessage, isLoadingAIResponse }: { 
  onSendMessage: (message: string) => void;
  isLoadingAIResponse: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoadingAIResponse) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your response..."
        disabled={isLoadingAIResponse}
        className="flex-grow"
      />
      <Button 
        type="submit" 
        disabled={!inputValue.trim() || isLoadingAIResponse}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default function CandidateInterview() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [isLobby, setIsLobby] = useState(true);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [currentAIQuestion, setCurrentAIQuestion] = useState("AI is preparing your first question...");
  const [showChat, setShowChat] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatScrollAreaRef.current) {
      chatScrollAreaRef.current.scrollTo({ top: chatScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startPreviewWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); // Audio false for preview
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        alert("getUserMedia not supported on this browser!");
      }
    } catch (err) {
      console.error("Error accessing webcam for preview:", err);
      alert("Could not access webcam for preview. Please ensure permissions are granted and no other app is using it.");
    }
  };

  // Start webcam preview when lobby is shown
  useEffect(() => {
    if (isLobby) {
      startPreviewWebcam();
    }
    // Cleanup function to stop tracks when leaving lobby or unmounting
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isLobby]);

  const startInterview = async () => {
    setIsLobby(false);
    // Ensure webcam is running with audio for the actual interview
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      fetchAIResponse([], "INITIAL_GREETING");
    } catch (err) {
      console.error("Error accessing webcam for interview:", err);
      alert("Could not access webcam for the interview. Please ensure permissions are granted.");
      setIsLobby(true); // Go back to lobby if webcam fails
    }
  };

  const fetchAIResponse = async (currentHistory: Message[], currentInput: string) => {
    setIsLoadingAIResponse(true);
    setCurrentAIQuestion("AI is thinking...");
    try {
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterConfig: dummyRecruiterConfig, // Using the more detailed dummy config
          conversationHistory: currentHistory,
          currentCandidateInput: currentInput,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }
      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString() + "-ai",
        speaker: "ai",
        text: data.aiResponse,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setCurrentAIQuestion(data.aiResponse); // Set the AI's response as the current question
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorText = `Sorry, I encountered an error. ${error instanceof Error ? error.message : 'Please try again.'}`;
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        speaker: "ai",
        text: errorText,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentAIQuestion(errorText);
    } finally {
      setIsLoadingAIResponse(false);
    }
  };

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoadingAIResponse) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      speaker: "candidate",
      text: message,
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    await fetchAIResponse(newMessages, message);
  }, [messages, isLoadingAIResponse]);

  const LobbyScreen = () => (
    <div className="w-full h-full mx-auto p-4 overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-6 h-full max-w-6xl mx-auto">
        {/* Left Side - Video Preview */}
        <div className="md:w-1/2 flex-shrink-0">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Video Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center">
              <div className="w-full aspect-video bg-gray-900 rounded-md relative overflow-hidden">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                {(!videoRef.current || !videoRef.current.srcObject) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-400 text-center p-4 text-sm">Camera preview will appear here.<br />Your camera will activate when you start the interview.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Content */}
        <div className="md:w-1/2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Ready to Start Your Interview?
              </CardTitle>
              <CardDescription className="mt-1">
                You're applying for the {dummyRecruiterConfig.jobRole} position at {dummyRecruiterConfig.companyName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <div>
                <h3 className="font-semibold mb-2">Before you begin:</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  <li>Ensure your camera and microphone are working properly.</li>
                  <li>Find a quiet place with good lighting.</li>
                  <li>This interview will take approximately {dummyRecruiterConfig.estimatedDuration}.</li>
                  <li>Your responses will be evaluated based on the job requirements.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Required Skills:</h3>
                <p className="text-sm">{dummyRecruiterConfig.requiredSkills}</p>
              </div>
              
              <Button 
                onClick={startInterview} 
                size="lg" 
                className="w-full bg-slate-700 hover:bg-slate-800"
              >
                Start Interview <Video className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const InterviewScreen = () => (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row gap-4 p-4 relative">
      {/* Main Container - Video (Expanded when chat is hidden) */}
      <div className={`${showChat ? "md:w-2/3" : "md:w-full"} flex-shrink-0 h-full flex flex-col gap-4`}>
        <Card className="flex-grow flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mr-2 h-8 w-8 p-0" 
                  onClick={() => setIsLobby(true)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                Live Interview
              </CardTitle>
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Tips</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <h4 className="text-sm font-medium mb-1.5">Interview Tips:</h4>
                    <ul className="text-xs space-y-1 list-disc pl-4">
                      {interviewTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </HoverCardContent>
                </HoverCard>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{showChat ? "Hide Chat" : "Show Chat"}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-2">
            <div className="w-full h-full flex gap-4">
              {/* AI Avatar - Now using HeyGen */}
              <div className="w-1/4 h-full flex flex-col">
                <div className="aspect-square mb-2 relative">
                  <HeyGenAvatarInline className="w-full h-full" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black bg-opacity-50 rounded px-2 py-1">
                      <p className="text-white text-xs font-medium text-center">AI Interviewer</p>
                    </div>
                  </div>
                </div>
                <Card className="bg-slate-50 flex-grow">
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm flex items-center">
                      <Info className="h-4 w-4 mr-2 text-slate-500" />
                      Current Question
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-slate-700 text-sm">{currentAIQuestion}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Candidate Video */}
              <div className="w-3/4 bg-gray-900 rounded-md overflow-hidden">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel (Toggleable) */}
      {showChat && (
        <div className="md:w-1/3 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 shrink-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Interview Chat</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
              <ScrollArea className="h-full" ref={chatScrollAreaRef}>
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.speaker === 'ai' 
                            ? 'bg-slate-200 text-slate-800' 
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                      </div>
                    </div>
                  ))}
                  {isLoadingAIResponse && (
                    <div className="flex justify-start">
                      <div className="bg-slate-200 text-slate-500 rounded-lg p-3 flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 pt-2 shrink-0 border-t bg-white">
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoadingAIResponse={isLoadingAIResponse}
              />
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Floating chat button for mobile (only shows when chat is hidden) */}
      {!showChat && (
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg"
          onClick={() => setShowChat(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="h-full w-full">
      {isLobby ? <LobbyScreen /> : <InterviewScreen />}
    </div>
  );
}
