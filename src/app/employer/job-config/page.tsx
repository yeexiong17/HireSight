'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Copy, Tag, CheckCircle2, Calendar, Plus, Pencil } from "lucide-react";
import type { JobConfigFormData } from "@/components/job-config-form";

// Sample data for previously configured AI setups
const previousConfigs = [
  {
    id: "conf001",
    name: "Frontend Developer Interview",
    jobRole: "Frontend Developer",
    seniority: "Mid-Level",
    interviewStyle: "friendly",
    focusTraits: "communication, problem-solving, creativity, attention to detail",
    requiredSkills: "React, JavaScript, CSS, HTML, TypeScript, Redux",
    customQuestions: "Describe your experience with state management in React.\nHow do you approach responsive design?\nExplain how you've used TypeScript in previous projects.",
    createdAt: "2024-04-15",
    usageCount: 8
  },
  {
    id: "conf002",
    name: "Backend Engineer Interview",
    jobRole: "Backend Engineer",
    seniority: "Senior",
    interviewStyle: "behavioral",
    focusTraits: "leadership, problem-solving, system design, mentorship",
    requiredSkills: "Python, Django, PostgreSQL, Docker, AWS, API design",
    customQuestions: "Describe a complex system you designed from scratch.\nHow do you approach database optimization?\nExplain your experience with microservices architecture.",
    createdAt: "2024-03-22",
    usageCount: 12
  },
  {
    id: "conf003",
    name: "DevOps Specialist Interview",
    jobRole: "DevOps Engineer",
    seniority: "Mid-Level to Senior",
    interviewStyle: "formal",
    focusTraits: "problem-solving, attention to detail, crisis management, communication",
    requiredSkills: "Kubernetes, Docker, AWS, CI/CD pipelines, Terraform, Linux",
    customQuestions: "Describe your experience with infrastructure as code.\nHow do you approach monitoring and alerting?\nWhat strategies do you use for disaster recovery?",
    createdAt: "2024-05-01",
    usageCount: 4
  }
];

export default function AIInterviewerConfigPage() {
  const router = useRouter();
  const [selectedConfig, setSelectedConfig] = useState<JobConfigFormData | undefined>(undefined);

  return (
    <div className="p-6">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">AI Interviewer Templates</h1>
            <p className="text-slate-600 mt-1">
              Manage and configure your AI interviewer templates.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/employer/job-config/create')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {previousConfigs.map((config) => (
          <Card key={config.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-slate-700">{config.name}</CardTitle>
                <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {config.usageCount} uses
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4 pt-2">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Tag className="w-4 h-4 text-slate-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-slate-500">Role & Seniority</p>
                    <p className="text-sm text-slate-700">{config.jobRole} • {config.seniority}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Settings className="w-4 h-4 text-slate-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-slate-500">Interview Style</p>
                    <p className="text-sm text-slate-700 capitalize">{config.interviewStyle}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-4 h-4 text-slate-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-slate-500">Created On</p>
                    <p className="text-sm text-slate-700">{config.createdAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 border-t flex gap-2">
              <Button
                onClick={() => router.push(`/employer/job-config/edit?id=${config.id}`)}
                variant="outline"
                className="flex-1"
              >
                <Pencil className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 