"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, MapPin, CalendarDays, ArrowRight, Building, Star, Sparkles, CheckCircle } from 'lucide-react';

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

interface CandidateProfile {
  skills: string[];
  experience: string[];
  scores: {
    technical: number;
    communication: number;
    problemSolving: number;
  };
}

interface JobRecommendationsProps {
  candidateProfile: CandidateProfile;
  availableJobs: Job[];
}

const calculateJobMatch = (job: Job, profile: CandidateProfile): number => {
  let score = 0;
  const maxScore = 100;

  // Match skills
  const skillMatchCount = job.tags.filter(tag => 
    profile.skills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
  ).length;
  score += (skillMatchCount / job.tags.length) * 50; // Skills are 50% of the score

  // Match based on performance scores
  const averagePerformance = (
    profile.scores.technical + 
    profile.scores.communication + 
    profile.scores.problemSolving
  ) / 3;
  score += (averagePerformance / 100) * 50; // Performance is 50% of the score

  return Math.min(Math.round(score), maxScore);
};

const getMatchReasons = (job: Job, profile: CandidateProfile): string[] => {
  const reasons: string[] = [];

  // Skill matches
  const matchedSkills = job.tags.filter(tag => 
    profile.skills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
  );
  if (matchedSkills.length > 0) {
    reasons.push(`Matches ${matchedSkills.length} of your skills: ${matchedSkills.slice(0, 3).join(', ')}${matchedSkills.length > 3 ? '...' : ''}`);
  }

  // Performance-based reasons
  if (profile.scores.technical >= 80) {
    reasons.push('Strong technical performance in interviews');
  }
  if (profile.scores.communication >= 80) {
    reasons.push('Excellent communication skills');
  }
  if (profile.scores.problemSolving >= 80) {
    reasons.push('Strong problem-solving abilities');
  }

  return reasons;
};

export default function JobRecommendations({ candidateProfile, availableJobs }: JobRecommendationsProps) {
  const recommendedJobs = React.useMemo(() => {
    return availableJobs
      .map(job => ({
        ...job,
        matchScore: calculateJobMatch(job, candidateProfile),
        matchReason: getMatchReasons(job, candidateProfile)
      }))
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 3); // Show top 3 recommendations
  }, [availableJobs, candidateProfile]);

  if (recommendedJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-semibold text-slate-800">Recommended for You</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedJobs.map((job) => (
          <Card key={job.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="pb-3">
              {job.companyLogo && (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-3 border border-slate-300 overflow-hidden">
                  <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-full h-full object-cover" />
                </div>
              )}
              {!job.companyLogo && (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-3 border border-slate-300">
                  <Building className="w-8 h-8 text-slate-500" />
                </div>
              )}
              <CardTitle className="text-xl font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                {job.title}
              </CardTitle>
              <div className="flex items-center text-sm text-slate-500 mt-1">
                <Building className="w-4 h-4 mr-1.5 flex-shrink-0" />
                {job.companyName}
              </div>
              {job.matchScore && (
                <div className="mt-2 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-slate-700">{job.matchScore}% Match</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-sm text-slate-600 flex-grow space-y-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-slate-500 flex-shrink-0" />
                {job.location}
              </div>
              <p className="leading-relaxed line-clamp-2">
                {job.description}
              </p>
              {job.matchReason && job.matchReason.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 mb-1.5">Why this matches you:</h4>
                  <ul className="space-y-1">
                    {job.matchReason.slice(0, 2).map((reason, index) => (
                      <li key={index} className="text-xs text-slate-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-500 mb-1.5">Key Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.slice(0, 4).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 4 && (
                    <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-medium">
                      +{job.tags.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-auto">
              <div className="flex justify-between items-center w-full">
                <div className="text-xs text-slate-500 flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                  Posted: {new Date(job.postedDate).toLocaleDateString()}
                </div>
                <Link href={`/candidate/jobs/${job.id}`} passHref legacyBehavior>
                  <Button size="sm" variant="default" className="bg-slate-700 hover:bg-slate-800 group">
                    View Details <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 