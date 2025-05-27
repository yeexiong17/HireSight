"use client";

import React from 'react';
import { 
  Send, 
  Bot, 
  MessageSquare, 
  Search,
  Briefcase,
  Book,
  TrendingUp,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

export default function AIChatPage() {
  const router = useRouter();
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI career assistant. I can help you with:\n\n• Finding suitable jobs based on your skills\n• Analyzing your interview performance\n• Providing interview preparation tips\n• Answering career-related questions\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      icon: <Briefcase className="w-4 h-4" />,
      label: "Job Recommendations",
      prompt: "Based on my skills and experience, what jobs would you recommend for me?"
    },
    {
      icon: <Book className="w-4 h-4" />,
      label: "Interview Prep",
      prompt: "How should I prepare for my next technical interview?"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Performance Analysis",
      prompt: "Can you analyze my past interview performance and suggest improvements?"
    },
    {
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Best Practices",
      prompt: "What are the best practices for answering behavioral interview questions?"
    }
  ];

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Simulate AI responses based on user input
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('job') && lowerMessage.includes('recommend')) {
      return "Based on your profile and past interview performance, here are some recommendations:\n\n1. Senior Software Engineer roles - Your technical skills are particularly strong in system design\n2. Lead Developer positions - You've shown good communication and leadership potential\n3. Full-Stack Developer roles - Your diverse skill set would be valuable\n\nWould you like more specific job openings in these areas?";
    } 
    else if (lowerMessage.includes('interview') && lowerMessage.includes('prepare')) {
      return "Here's how you can prepare for your technical interviews:\n\n1. Review core CS concepts (data structures, algorithms)\n2. Practice problem-solving on platforms like LeetCode\n3. Prepare for system design questions\n4. Review your past projects\n5. Practice explaining your thought process\n\nWould you like specific resources for any of these areas?";
    }
    else if (lowerMessage.includes('performance') || lowerMessage.includes('improve')) {
      return "Looking at your past interviews, here are key observations:\n\n✓ Strong: System design, communication\n! Improve: Algorithm optimization, edge case handling\n\nRecommended focus areas:\n1. Practice more complex algorithmic problems\n2. Work on time complexity optimization\n3. Consider more edge cases in your solutions\n\nWould you like specific practice problems?";
    }
    else {
      return "I can help you with:\n• Job recommendations\n• Interview preparation\n• Performance analysis\n• Career advice\n\nWhat specific aspect would you like to explore?";
    }
  };

  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header - Fixed Height */}
      <div className="shrink-0 px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center text-slate-600 hover:text-slate-900"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-800">AI Career Assistant</h1>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="h-full max-w-5xl mx-auto">
          <Card className="h-full flex flex-col">
            {/* Messages Area - Scrollable */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-slate-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-2 text-slate-500">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              )}
            </div>

            {/* Quick Actions and Input - Fixed Height */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                      onClick={() => handleSendMessage(action.prompt)}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSendMessage(inputMessage)}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 