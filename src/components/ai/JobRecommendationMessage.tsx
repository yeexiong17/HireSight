"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Building, MapPin, Star } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  postedDate: string;
  tags: string[];
  companyLogo?: string;
  matchScore?: number;
  matchReason?: string[];
}

interface JobRecommendationMessageProps {
  jobs: Job[];
  explanation?: string;
}

export default function JobRecommendationMessage({ jobs, explanation }: JobRecommendationMessageProps) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mt-2">
      {explanation && (
        <p className="text-slate-600 text-sm">{explanation}</p>
      )}
      
      <div className="space-y-2">
        {jobs.slice(0, 3).map((job) => (
          <Link 
            key={job.id} 
            href={`/candidate/jobs/${job.id}`}
            className="block bg-slate-50 hover:bg-slate-100 rounded-lg p-3 transition-colors"
          >
            <div className="flex items-start gap-3">
              {job.companyLogo ? (
                <div className="w-8 h-8 rounded bg-white flex-shrink-0 overflow-hidden border border-slate-200">
                  <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded bg-white flex items-center justify-center flex-shrink-0 border border-slate-200">
                  <Building className="w-4 h-4 text-slate-500" />
                </div>
              )}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-900 truncate">{job.title}</h3>
                  {job.matchScore && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-slate-700">{job.matchScore}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-xs text-slate-500 truncate">
                    <span className="font-medium">{job.companyName}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                    {job.location}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 text-xs bg-white text-slate-600 rounded border border-slate-200">
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs bg-white text-slate-600 rounded border border-slate-200">
                      +{job.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end">
        <Link href="/candidate/jobs" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View all jobs →
        </Link>
      </div>
    </div>
  );
} 