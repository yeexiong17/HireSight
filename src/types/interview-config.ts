export interface InterviewConfig {
  id: string;
  name: string;
  jobRole: string;
  seniority: string;
  interviewStyle: 'friendly' | 'formal' | 'behavioral' | 'stress-based';
  focusTraits: string;
  requiredSkills: string;
  customQuestions: string;
  createdAt: string;
  usageCount: number;
}

export interface InterviewStageConfig {
  label: string;
  config: {
    questions: string[];
    duration: string;
    type: 'screening' | 'technical' | 'behavioral' | 'assessment' | 'custom';
  };
} 