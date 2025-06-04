"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import Link from "next/link";
import CandidateRecommendationMessage from "@/components/ai/CandidateRecommendationMessage";

// Sample candidates data - in a real app, this would come from an API
const sampleCandidates = [
  {
    id: "cand001",
    name: "John Smith",
    role: "Senior Frontend Developer",
    interviewDate: "2024-05-20",
    skills: ["React", "Next.js", "TypeScript", "UI/UX"],
    performanceScore: 95,
    strengths: [
      "Strong technical knowledge",
      "Excellent problem-solving skills",
      "Great communication",
    ],
    weaknesses: ["Could improve system design knowledge"],
    recommendation: "Strong Hire",
  },
  {
    id: "cand002",
    name: "Sarah Johnson",
    role: "Backend Python Engineer",
    interviewDate: "2024-05-18",
    skills: ["Python", "Django", "Flask", "SQL"],
    performanceScore: 88,
    strengths: ["Solid backend experience", "Good database knowledge"],
    weaknesses: [
      "Communication could be more clear",
      "Limited experience with microservices",
    ],
    recommendation: "Hire",
  },
];

interface CandidateRecommendation {
  candidate: (typeof sampleCandidates)[0];
  analysis: string;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  type?: "text" | "candidate-recommendations";
  candidateRecommendations?: CandidateRecommendation[];
}

export default function EmployerAIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI hiring assistant. I can help you with:\n\n" +
        "• Analyzing candidate interview performance\n" +
        "• Identifying top candidates for positions\n" +
        "• Providing insights on candidate strengths and weaknesses\n" +
        "• Answering hiring-related questions\n\n" +
        "What would you like to know about your candidates?",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      // Check if the message is about candidate recommendations
      if (
        inputValue.toLowerCase().includes("candidate") ||
        inputValue.toLowerCase().includes("hire") ||
        inputValue.toLowerCase().includes("interview")
      ) {
        const recommendations: CandidateRecommendation[] = sampleCandidates.map(
          (candidate) => ({
            candidate,
            analysis:
              `${candidate.name} shows ${
                candidate.performanceScore >= 90 ? "exceptional" : "good"
              } potential. ` +
              `Key strengths include ${candidate.strengths.join(", ")}. ` +
              `Areas for development: ${candidate.weaknesses.join(", ")}.`,
          })
        );

        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Based on recent interviews and assessments, here are my recommendations for candidates:",
          timestamp: new Date(),
          type: "candidate-recommendations",
          candidateRecommendations: recommendations,
        };
      } else {
        aiResponse = {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I can help you evaluate candidates and make hiring decisions. Would you like me to analyze recent candidate performances or provide specific insights about any candidates?",
          timestamp: new Date(),
          type: "text",
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mt-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6" />
            AI Hiring Assistant
          </h1>
        </div>

        <Card className="h-[calc(100vh-12rem)]">
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === "assistant"
                          ? "flex-row"
                          : "flex-row-reverse"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        {message.role === "assistant" ? (
                          <Bot className="w-4 h-4 text-slate-600" />
                        ) : (
                          <User className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "assistant"
                            ? "bg-white text-slate-700 shadow-sm"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                        {message.type === "candidate-recommendations" &&
                          message.candidateRecommendations && (
                            <div className="mt-4">
                              <CandidateRecommendationMessage
                                candidates={message.candidateRecommendations.map(
                                  (rec) => rec.candidate
                                )}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about candidates or hiring decisions..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
