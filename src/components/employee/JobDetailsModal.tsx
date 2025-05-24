import React from 'react';
import { Briefcase, MapPin, Type, CalendarDays, Linkedin, Disc, X, CheckCircle, Users, DollarSign, Eye, Settings, Info } from 'lucide-react';

// Re-define JobPost interface (or import from a shared types file if available)
interface JobPost {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  datePosted: string;
  status: 'Open' | 'Closed' | 'Draft';
  description: string;
  applications: number;
  platforms: string[];
  requirements?: string;
  responsibilities?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  aiInterviewerId?: string; // Added this to match potential data
}

// Platform Icons Mapping - can be shared or passed if needed
const platformIcons: { [key: string]: React.ElementType } = {
  LinkedIn: Linkedin,
  JobStreet: Disc, // Using Disc as a placeholder
};

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPost | null;
}

const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | React.ReactNode; className?: string }> = ({ icon: Icon, label, value, className }) => {
  if (!value && typeof value !== 'number') return null;
  return (
    <div className={`flex items-start ${className}`}>
      <Icon size={18} className="text-slate-500 mr-3 mt-1 flex-shrink-0" />
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        {typeof value === 'string' || typeof value === 'number' ? <p className="text-sm text-slate-700 break-words">{value}</p> : value}
      </div>
    </div>
  );
};

const Section: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={className}>
    {title && <h3 className="text-md font-semibold text-slate-800 mb-3 border-b pb-2">{title}</h3>}
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

export default function JobDetailsModal({ isOpen, onClose, job }: JobDetailsModalProps) {
  if (!isOpen || !job) return null;

  // Placeholder for AI Interviewer name - in real app, you'd fetch this based on aiInterviewerId
  const aiInterviewerName = job.aiInterviewerId && job.aiInterviewerId !== 'none' ? 
                            `AI Profile ID: ${job.aiInterviewerId}` : 
                            (job.aiInterviewerId === 'none' ? 'Manual Screening' : 'Not Specified');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <div className="flex items-center">
            <Briefcase size={24} className="text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-slate-800">{job.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 flex-grow">
          <Section className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <DetailItem icon={Info} label="Department" value={job.department} />
            <DetailItem icon={MapPin} label="Location" value={job.location} />
            <DetailItem icon={Type} label="Job Type" value={job.type} />
            <DetailItem icon={CalendarDays} label="Date Posted" value={job.datePosted} />
            <DetailItem icon={CheckCircle} label="Status" value={job.status} />
            <DetailItem icon={Users} label="Applications" value={`${job.applications} applicant${job.applications !== 1 ? 's' : ''}`} />
          </Section>

          {(job.salaryMin || job.salaryMax) && (
            <Section title="Salary Range">
              <DetailItem 
                icon={DollarSign} 
                label="Compensation" 
                value={`S${job.salaryMin || 'N/A'} - S${job.salaryMax || 'N/A'}`}
              />
            </Section>
          )}

          <Section title="Job Description">
            <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{job.description}</p>
          </Section>

          {job.responsibilities && (
            <Section title="Key Responsibilities">
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 pl-1">
                {job.responsibilities.split('\n').map((item, index) => item.trim() && <li key={index}>{item}</li>)}
              </ul>
            </Section>
          )}

          {job.requirements && (
            <Section title="Requirements & Qualifications">
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 pl-1">
                {job.requirements.split('\n').map((item, index) => item.trim() && <li key={index}>{item}</li>)}
              </ul>
            </Section>
          )}
          
          <Section title="AI Interviewer Configuration">
            <DetailItem icon={Settings} label="Selected Profile" value={aiInterviewerName} />
          </Section>

          {job.platforms && job.platforms.length > 0 && (
            <Section title="Posted On">
              <div className="flex items-center space-x-3">
                {job.platforms.map(platformName => {
                  const IconComponent = platformIcons[platformName];
                  return IconComponent ? (
                    <div key={platformName} className="flex items-center text-sm text-slate-700">
                      <IconComponent size={20} className="mr-1.5" /> {platformName}
                    </div>
                  ) : null;
                })}
              </div>
            </Section>
          )}

        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
          >
            Close
          </button>
          {/* Future: Add Edit button here, e.g., onClick={() => { onClose(); onEdit(job); }} */}
        </div>
      </div>
    </div>
  );
} 