import React, { useState, FormEvent } from 'react';
import { Briefcase, MapPin, Type, CalendarDays, CheckSquare, Linkedin, Disc, X, Settings, Sparkles, Edit3, Check, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface JobAnalysisResponse {
  suggestedScope: {
    overview: string;
    keyObjectives: string[];
    impactAreas: string[];
  };
  suggestedRequirements: {
    essential: string[];
    preferred: string[];
    experience: string;
    education: string[];
  };
  suggestedResponsibilities: {
    primary: string[];
    secondary: string[];
    collaboration: string[];
  };
  suggestedSkills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  confidence: number;
}

interface EnhancedNewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPost: (jobData: any) => void;
}

const initialFormData = {
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  description: '',
  requirements: '',
  responsibilities: '',
  salaryMin: '',
  salaryMax: '',
  autoPostLinkedIn: false,
  autoPostJobStreet: false,
  aiInterviewerId: '',
};

// Placeholder for AI Interviewer Templates
const aiInterviewerTemplates = [
  {
    id: "conf001",
    name: "Frontend Developer Interview",
    jobRole: "Frontend Developer",
  },
  {
    id: "conf002",
    name: "Backend Engineer Interview",
    jobRole: "Backend Engineer",
  },
  {
    id: "conf003",
    name: "DevOps Specialist Interview",
    jobRole: "DevOps Engineer",
  },
  {
    id: "none",
    name: "No AI Interviewer / Manual Screening",
  }
];

export default function EnhancedNewJobModal({ isOpen, onClose, onJobPost }: EnhancedNewJobModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<JobAnalysisResponse | null>(null);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const analyzeJobWithAI = async () => {
    if (!formData.title.trim()) {
      setAnalysisError('Please enter a job title before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/jobs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: formData.title,
          jobDescription: formData.description,
          department: formData.department,
          location: formData.location,
          jobType: formData.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze job');
      }

      const analysis = await response.json();
      setAiAnalysis(analysis);
      setShowAiSuggestions(true);

      // Auto-populate salary range if not already set
      if (!formData.salaryMin && !formData.salaryMax) {
        setFormData(prev => ({
          ...prev,
          salaryMin: analysis.salaryRange.min.toString(),
          salaryMax: analysis.salaryRange.max.toString(),
        }));
      }

    } catch (error) {
      console.error('Error analyzing job:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze job');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setEditingField(null);
  };

  const formatArrayAsList = (items: string[]) => {
    return items.map(item => `• ${item}`).join('\n');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, you'd make an API call here
      console.log("Submitting job data:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onJobPost(formData);
      setIsLoading(false);
      setFormData(initialFormData);
      setAiAnalysis(null);
      setShowAiSuggestions(false);
      setEditingField(null);
    } catch (error) {
      setIsLoading(false);
      console.error('Error posting job:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800">Post New Job with AI Assistant</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-hidden flex">
          {/* Left Panel - Form */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <div className="relative">
                    <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      placeholder="e.g., Technology"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        placeholder="e.g., Remote, New York"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Job Type</label>
                  <div className="relative">
                    <Type size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      name="type"
                      id="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Temporary</option>
                    </select>
                  </div>
                </div>

                {/* AI Analysis Button */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-blue-900">AI Job Analysis</h3>
                    <button
                      type="button"
                      onClick={analyzeJobWithAI}
                      disabled={isAnalyzing || !formData.title.trim()}
                      className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 size={16} className="mr-1.5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} className="mr-1.5" />
                          Analyze Job
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-blue-700">
                    Get AI-powered suggestions using ChatGPT for job description, requirements, and responsibilities based on the job title.
                  </p>
                  {analysisError && (
                    <div className="mt-2 flex items-center text-red-600 text-xs">
                      <AlertCircle size={14} className="mr-1" />
                      {analysisError}
                    </div>
                  )}
                </div>
              </div>

              {/* Description, Requirements, Responsibilities */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Provide a detailed description of the role..."
                  />
                </div>

                <div>
                  <label htmlFor="responsibilities" className="block text-sm font-medium text-slate-700 mb-1">Key Responsibilities</label>
                  <textarea
                    name="responsibilities"
                    id="responsibilities"
                    rows={3}
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="List the primary responsibilities (one per line recommended)..."
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-slate-700 mb-1">Requirements & Qualifications</label>
                  <textarea
                    name="requirements"
                    id="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="List required skills and qualifications (one per line recommended)..."
                  />
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salaryMin" className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Min)</label>
                  <input
                    type="number"
                    name="salaryMin"
                    id="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="e.g., 70000"
                  />
                </div>
                <div>
                  <label htmlFor="salaryMax" className="block text-sm font-medium text-slate-700 mb-1">Salary Range (Max)</label>
                  <input
                    type="number"
                    name="salaryMax"
                    id="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="e.g., 90000"
                  />
                </div>
              </div>

              {/* AI Interviewer Configuration */}
              <div>
                <label htmlFor="aiInterviewerId" className="block text-sm font-medium text-slate-700 mb-1">AI Interviewer Profile</label>
                <div className="relative">
                  <Settings size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="aiInterviewerId"
                    id="aiInterviewerId"
                    value={formData.aiInterviewerId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Select an AI interviewer profile...</option>
                    {aiInterviewerTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name} {template.id !== "none" && template.jobRole ? `(${template.jobRole})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-1 text-xs text-slate-500">Choose an AI configuration for automated first-round interviews.</p>
                <div className="mt-2">
                  <Link href="/employer/job-config" passHref legacyBehavior>
                    <a className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                      Create or manage AI Interviewer Profiles
                    </a>
                  </Link>
                </div>
              </div>

              {/* Auto-posting to Platforms */}
              <fieldset className="border-t border-slate-200 pt-6">
                <legend className="text-base font-medium text-slate-800 mb-3">Automatic Posting</legend>
                <div className="space-y-3">
                  <label htmlFor="autoPostLinkedIn" className="flex items-center p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="autoPostLinkedIn"
                      id="autoPostLinkedIn"
                      checked={formData.autoPostLinkedIn}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-slate-400 rounded focus:ring-blue-500"
                    />
                    <Linkedin size={20} className="mx-3 text-blue-700" />
                    <span className="text-sm font-medium text-slate-700">Post to LinkedIn</span>
                  </label>
                  <label htmlFor="autoPostJobStreet" className="flex items-center p-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="autoPostJobStreet"
                      id="autoPostJobStreet"
                      checked={formData.autoPostJobStreet}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-500 border-slate-400 rounded focus:ring-orange-500"
                    />
                    <Disc size={20} className="mx-3 text-orange-600" />
                    <span className="text-sm font-medium text-slate-700">Post to JobStreet</span>
                  </label>
                </div>
              </fieldset>
            </form>
          </div>

          {/* Right Panel - AI Suggestions */}
          <div className="w-1/2 p-6 overflow-y-auto bg-slate-50">
            {showAiSuggestions && aiAnalysis ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">AI Suggestions</h3>
                  <div className="flex items-center text-sm text-slate-600">
                    <Sparkles size={16} className="mr-1 text-blue-500" />
                    {aiAnalysis.confidence}% confidence
                  </div>
                </div>

                {/* Job Description Suggestion */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-700">Job Description</h4>
                    <button
                      type="button"
                      onClick={() => applySuggestion('description', aiAnalysis.suggestedScope.overview)}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Check size={14} className="mr-1" />
                      Apply
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{aiAnalysis.suggestedScope.overview}</p>
                </div>

                {/* Responsibilities Suggestion */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-700">Key Responsibilities</h4>
                    <button
                      type="button"
                      onClick={() => applySuggestion('responsibilities', formatArrayAsList([
                        ...aiAnalysis.suggestedResponsibilities.primary,
                        ...aiAnalysis.suggestedResponsibilities.secondary
                      ]))}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Check size={14} className="mr-1" />
                      Apply
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Primary</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {aiAnalysis.suggestedResponsibilities.primary.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Secondary</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {aiAnalysis.suggestedResponsibilities.secondary.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Requirements Suggestion */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-700">Requirements & Qualifications</h4>
                    <button
                      type="button"
                      onClick={() => applySuggestion('requirements', formatArrayAsList([
                        ...aiAnalysis.suggestedRequirements.essential,
                        ...aiAnalysis.suggestedRequirements.preferred
                      ]))}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Check size={14} className="mr-1" />
                      Apply
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Essential</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {aiAnalysis.suggestedRequirements.essential.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Preferred</h5>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {aiAnalysis.suggestedRequirements.preferred.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-2">Skills Breakdown</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Technical Skills</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiAnalysis.suggestedSkills.technical.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-slate-500 uppercase">Soft Skills</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {aiAnalysis.suggestedSkills.soft.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Range Suggestion */}
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-700 mb-2">Suggested Salary Range</h4>
                  <div className="text-lg font-semibold text-green-600">
                    ${aiAnalysis.salaryRange.min.toLocaleString()} - ${aiAnalysis.salaryRange.max.toLocaleString()} {aiAnalysis.salaryRange.currency}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Based on role, location, and market data</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-500 mb-2">AI Assistant Ready</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Fill in the job title and click "Analyze Job" to get AI-powered suggestions for your job posting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:bg-blue-400"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Posting...
                </div>
              ) : 'Post Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
