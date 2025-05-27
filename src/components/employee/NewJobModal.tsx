import React, { useState, FormEvent } from 'react';
import { Briefcase, MapPin, Type, CalendarDays, CheckSquare, Linkedin, Disc, X, Settings } from 'lucide-react';
import Link from 'next/link';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPost: (jobData: any) => void; // Replace 'any' with a proper job data type
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

// Placeholder for AI Interviewer Templates - In a real app, fetch this or pass as prop
const aiInterviewerTemplates = [
  {
    id: "conf001",
    name: "Frontend Developer Interview",
    jobRole: "Frontend Developer",
    // ... other properties as defined in AIInterviewerConfigPage's previousConfigs
  },
  {
    id: "conf002",
    name: "Backend Engineer Interview",
    jobRole: "Backend Engineer",
    // ...
  },
  {
    id: "conf003",
    name: "DevOps Specialist Interview",
    jobRole: "DevOps Engineer",
    // ...
  },
  // Add more templates as needed, or ensure this matches your actual data source
  {
    id: "none",
    name: "No AI Interviewer / Manual Screening",
  }
];

export default function NewJobModal({ isOpen, onClose, onJobPost }: NewJobModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, you'd make an API call here
    console.log("Submitting job data:", formData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onJobPost(formData);
    setIsLoading(false);
    setFormData(initialFormData); // Reset form
    // onClose(); // Keep modal open for now to show submission, or close if preferred
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-800">Post New Job</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-grow">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <div className="relative">
                {/* Consider an icon for department if available */}
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Description, Requirements, Responsibilities */}
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

          {/* AI Interviewer Configuration Selection */}
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
            <p className="mt-1 text-xs text-slate-500">Choose an AI configuration for automated first-round interviews. Select "No AI Interviewer" for manual screening.</p>
            <div className="mt-2">
              <Link href="/employer/job-config" passHref legacyBehavior>
                <a 
                  className="text-xs text-blue-600 hover:text-blue-800 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                >
                  Create or manage AI Interviewer Profiles
                </a>
              </Link>
            </div>
          </div>

          {/* Salary Range - Optional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Auto-posting to Platforms */}
          <fieldset className="border-t border-slate-200 pt-6">
            <legend className="text-base font-medium text-slate-800 mb-3">Automatic Posting</legend>
            <p className="text-sm text-slate-500 mb-4">
              Select platforms where this job should be automatically posted upon creation.
            </p>
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
                <Disc size={20} className="mx-3 text-orange-600" /> {/* Placeholder icon */}
                <span className="text-sm font-medium text-slate-700">Post to JobStreet</span>
              </label>
              {/* Add more platforms here */}
            </div>
          </fieldset>
        </form>

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
              form="new-job-form" // This should match the form's id if you add one, or be removed if submitting via form's own button
              onClick={handleSubmit} // If form has its own submit button, this onClick might be redundant or cause issues
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:bg-blue-400"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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