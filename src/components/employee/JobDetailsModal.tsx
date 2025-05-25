import React from 'react';
import { Briefcase, MapPin, Type, CalendarDays, Linkedin, Disc, X, CheckCircle, Users, DollarSign, Eye, Settings, Info, Calendar, Building2, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCandidatesByJobId } from '@/lib/mock-db/utils';

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
  platforms: string[];
  requirements?: string;
  responsibilities?: string;
  salaryMin?: string | number;
  salaryMax?: string | number;
  aiInterviewerId?: string;
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

  const candidateCount = getCandidatesByJobId(job.id).length;

  // Placeholder for AI Interviewer name - in real app, you'd fetch this based on aiInterviewerId
  const aiInterviewerName = job.aiInterviewerId && job.aiInterviewerId !== 'none' ? 
                            `AI Profile ID: ${job.aiInterviewerId}` : 
                            (job.aiInterviewerId === 'none' ? 'Manual Screening' : 'Not Specified');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">{job.department}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">{job.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">{job.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">Posted: {job.datePosted}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-slate-500" />
              <span className="text-sm text-slate-600">{candidateCount} Candidate{candidateCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-slate-500" />
              <span className={`text-sm font-medium ${
                job.status === 'Open' ? 'text-green-600' :
                job.status === 'Closed' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {job.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <p className="text-slate-600 whitespace-pre-wrap">{job.responsibilities}</p>
            </div>
          )}

          {/* Salary Range */}
          {(job.salaryMin || job.salaryMax) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Salary Range</h3>
              <p className="text-slate-600">
                {job.salaryMin && job.salaryMax 
                  ? `$${job.salaryMin} - $${job.salaryMax}`
                  : job.salaryMin
                  ? `From $${job.salaryMin}`
                  : `Up to $${job.salaryMax}`
                }
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 