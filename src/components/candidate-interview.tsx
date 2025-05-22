"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, CheckCircle2, Info, Video, SendHorizontal, HelpCircle } from 'lucide-react';

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

export default function CandidateInterview() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [candidateInput, setCandidateInput] = useState("");
  const [isLobby, setIsLobby] = useState(true);
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [currentAIQuestion, setCurrentAIQuestion] = useState("AI is preparing your first question...");
  const [showTips, setShowTips] = useState(false);

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

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!candidateInput.trim() || isLoadingAIResponse) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      speaker: "candidate",
      text: candidateInput,
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const submittedInput = candidateInput;
    setCandidateInput("");
    
    await fetchAIResponse(newMessages, submittedInput);
  };

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
                <ul className="space-y-2 text-sm text-gray-700">
                  {[ 
                    "Check that your camera and microphone are working properly.",
                    "Find a quiet place with good lighting and minimal background noise.",
                    `The interview will take approximately ${dummyRecruiterConfig.estimatedDuration} to complete.`,
                    "You can switch between video and text chat modes during the interview (feature coming soon)."
                  ].map(item => (
                    <li key={item} className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border rounded-md text-sm">
                <p><strong>Job Role:</strong> {dummyRecruiterConfig.jobRole}</p>
                <p><strong>Focus Areas:</strong> {dummyRecruiterConfig.focusTraits}</p>
                <p>The AI will ask questions related to these areas and the required skills for the role. Be prepared to discuss your experiences and problem-solving approaches.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-4">
              <Button onClick={startInterview} size="lg" className="w-full md:w-2/3">
                Start Interview
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );

  const InterviewScreen = () => (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 bg-gray-50">
      {/* Left Column: Video */}
      <div className="w-full md:w-3/4 flex flex-col items-center gap-4">
        {/* Candidate Video */}
        <div className="w-11/12 aspect-video bg-black rounded-lg shadow-md overflow-hidden flex-shrink-0">
          <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Right Column: AI Avatar, Chat History */}
      <div className="w-full md:w-1/4 flex flex-col gap-4">
        {/* AI Avatar Placeholder (Top of Right Column) */}
        <Card className="w-full aspect-video bg-gray-700 rounded-lg shadow-md flex items-center justify-center text-white">
          <p className="text-center">AI Avatar</p>
        </Card>

        <Card className="flex-grow flex flex-col min-h-[200px] overflow-hidden">
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Interview Chat</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowTips(!showTips)} className="text-xs flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              <span>Tips</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div ref={chatScrollAreaRef} className="p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-sm text-gray-500 text-center p-2 border border-dashed rounded-md mb-4">
                    <p>The AI interviewer will ask you questions about your experience.</p>
                    <p className="mt-1">Click the <span className="font-medium">Tips</span> button above for interview advice.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-lg max-w-[90%] shadow ${msg.speaker === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground border'}`}>
                      <p className="text-sm font-semibold mb-1">{msg.speaker === 'ai' ? 'AI Agent' : 'You'}</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {isLoadingAIResponse && messages.length > 0 && messages[messages.length-1].speaker === 'candidate' && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg max-w-[90%] shadow bg-primary text-primary-foreground animate-pulse">
                            <p className="text-sm">AI is typing...</p>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t">
            <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
              <Input
                type="text"
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
                placeholder="Speak or type your response..."
                className="flex-grow"
                disabled={isLoadingAIResponse}
              />
              <Button type="submit" disabled={isLoadingAIResponse || !candidateInput.trim()} size="icon">
                <SendHorizontal className="w-5 h-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      {/* Interview Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setShowTips(false)}>
          <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Interview Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                {interviewTips.map(tip => (
                  <li key={tip} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" /> 
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => setShowTips(false)}>Close</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header Bar */}
      <header className="flex-shrink-0 w-full h-12 bg-card border-b flex items-center justify-between px-4 md:px-6">
        <Button variant="outline" size="sm" onClick={() => setIsLobby(true)} disabled={isLobby}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Exit Interview
        </Button>
        <div className="text-sm">
          Job ID: <span className="font-semibold">{dummyRecruiterConfig.jobId}</span> - <span className="font-semibold">{dummyRecruiterConfig.jobRole}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-auto">
        {isLobby ? <LobbyScreen /> : <InterviewScreen />}
      </main>
    </div>
  );
} 