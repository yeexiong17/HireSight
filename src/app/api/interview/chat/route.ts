import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure for the recruiter's configuration
interface RecruiterConfig {
  jobRole: string;
  seniority: string;
  interviewStyle: 'formal' | 'friendly' | 'behavioral' | 'stress-based';
  focusTraits: string; // Comma-separated string
  requiredSkills: string; // Comma-separated string
  customQuestions?: string; // Optional, newline-separated string
}

interface ConversationTurn {
  speaker: 'ai' | 'candidate';
  text: string;
  timestamp: string;
}

// Define the expected structure of the request body
interface InterviewChatRequestBody {
  recruiterConfig: RecruiterConfig;
  conversationHistory: ConversationTurn[];
  currentCandidateInput: string;
}

// Define the structure of the response body
interface InterviewChatResponseBody {
  aiResponse: string;
  debugInfo?: any; // For sending back processed info if needed
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as InterviewChatRequestBody;
    const { recruiterConfig, conversationHistory, currentCandidateInput } = body;

    console.log('Received recruiterConfig:', recruiterConfig);
    console.log('Received conversationHistory:', conversationHistory);
    console.log('Received currentCandidateInput:', currentCandidateInput);

    // --- Mock LLM Logic Begins ---
    let aiGreeting = "Hello!";
    if (recruiterConfig.interviewStyle === 'formal') {
      aiGreeting = "Good day. Welcome to this interview.";
    } else if (recruiterConfig.interviewStyle === 'friendly') {
      aiGreeting = `Hi there! Thanks for joining. So, you're applying for the ${recruiterConfig.jobRole} role?`;
    }

    let nextQuestion = "Tell me about yourself.";

    if (conversationHistory.length === 0) {
      // First turn, AI greets
      nextQuestion = aiGreeting;
    } else {
      // Simple mock logic based on keywords or config
      if (currentCandidateInput.toLowerCase().includes('experience')) {
        nextQuestion = `Interesting. Could you elaborate on your experience with ${recruiterConfig.requiredSkills.split(',')[0].trim()}?`;
      } else if (recruiterConfig.customQuestions && recruiterConfig.customQuestions.trim().length > 0) {
        const customQs = recruiterConfig.customQuestions.split('\n');
        nextQuestion = customQs[0] || "What are your salary expectations?"; // Fallback if no custom Q
      } else {
        nextQuestion = `Okay, thank you. Now, regarding ${recruiterConfig.focusTraits.split(',')[0].trim()}, can you give an example?`;
      }
    }
    // --- Mock LLM Logic Ends ---

    const responsePayload: InterviewChatResponseBody = {
      aiResponse: nextQuestion,
      debugInfo: {
        processedConfig: recruiterConfig,
        userLastInput: currentCandidateInput,
        historyLength: conversationHistory.length,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });

  } catch (error) {
    console.error('Error in /api/interview/chat:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 