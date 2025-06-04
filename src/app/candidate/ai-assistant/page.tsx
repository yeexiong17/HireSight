"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import Link from 'next/link';
import JobRecommendationMessage from '@/components/ai/JobRecommendationMessage';

// Sample jobs data - in a real app, this would come from an API
const sampleJobs = [
  {
    id: "job001",
    title: "Senior Frontend Developer",
    companyName: "Grab",
    location: "San Francisco, CA",
    description: "Join our dynamic team to build next-gen web applications using React, Next.js, and TypeScript. Seeking experienced developers with a passion for UI/UX.",
    postedDate: "2024-05-20",
    tags: ["React", "Next.js", "TypeScript", "UI/UX", "Frontend"],
    companyLogo: "https://brandlogos.net/wp-content/uploads/2020/08/grab-logo.png",
    matchScore: 95,
    matchReason: ["Strong technical performance", "Skills match: React, TypeScript"]
  },
  {
    id: "job002",
    title: "Backend Python Engineer",
    companyName: "Meta",
    location: "New York, NY",
    description: "We are looking for a skilled Python developer to design and implement robust backend services, APIs, and database solutions. Experience with Django/Flask is a plus.",
    postedDate: "2024-05-18",
    tags: ["Python", "Django", "Flask", "API", "Backend", "SQL"],
    companyLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy3ZqxYhMdW3qa__685iJWJwGQGhV4VCivoQ&s",
    matchScore: 88,
    matchReason: ["Skills match: Python, Backend development"]
  }
];

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  type?: 'text' | 'job-recommendations';
  jobRecommendations?: typeof sampleJobs;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI career assistant. I can help you with:\n\n• Finding suitable jobs based on your skills\n• Analyzing your interview performance\n• Providing interview preparation tips\n• Answering career-related questions\n\nWhat would you like to know?",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
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
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse: Message;

      // Check if the message is about job recommendations
      if (inputValue.toLowerCase().includes('job') || inputValue.toLowerCase().includes('position') || inputValue.toLowerCase().includes('work')) {
        aiResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Based on your profile and recent interview performance, I've found some job opportunities that might be a great fit for you:",
          timestamp: new Date(),
          type: 'job-recommendations',
          jobRecommendations: sampleJobs
        };
      } else {
        aiResponse = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I understand you're interested in career opportunities. Would you like me to recommend some jobs based on your profile and skills?",
          timestamp: new Date(),
          type: 'text'
        };
      }

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <Link href="/candidate/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6" />
            AI Career Assistant
          </h1>
        </div>

        <Card className="h-[calc(100vh-12rem)]">
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        {message.role === 'assistant' ? (
                          <Bot className="w-4 h-4 text-slate-600" />
                        ) : (
                          <User className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === 'assistant'
                            ? 'bg-white text-slate-700 shadow-sm'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {message.type === 'job-recommendations' && message.jobRecommendations && (
                          <div className="mt-4">
                            <JobRecommendationMessage jobs={message.jobRecommendations} />
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
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
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