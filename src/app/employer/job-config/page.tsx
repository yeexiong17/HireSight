'use client';

import { useState } from "react";
import JobConfigForm from "@/components/job-config-form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Copy, Tag, CheckCircle2, Calendar } from "lucide-react";
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
  const [selectedConfig, setSelectedConfig] = useState<JobConfigFormData | undefined>(undefined);
  
  // Handler for when a user selects an existing configuration
  const handleUseConfig = (config: typeof previousConfigs[0]) => {
    // Extract just the fields that JobConfigForm expects
    const formData: JobConfigFormData = {
      jobRole: config.jobRole,
      seniority: config.seniority,
      interviewStyle: config.interviewStyle as any, // The type is more specific in the form
      focusTraits: config.focusTraits,
      requiredSkills: config.requiredSkills,
      customQuestions: config.customQuestions
    };
    
    // Set this configuration as selected
    setSelectedConfig(formData);
    
    // Scroll to the form section
    document.getElementById("ai-config-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">AI Interviewer Configuration</h1>
        <p className="text-slate-600 mt-1">
          Configure AI interview parameters and create reusable templates for your interviewers.
        </p>
      </header>
      
      {/* Previously Configured AI Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Previously Configured AI Templates</h2>
          <Button variant="outline" size="sm">
            View All Templates
          </Button>
        </div>
        
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
              
              <CardFooter className="pt-2 border-t">
                <Button 
                  onClick={() => handleUseConfig(config)}
                  variant="secondary" 
                  className="w-full flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-1.5" />
                  Use This Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* AI Configuration Section */}
      <div id="ai-config-form-section" className="max-w-5xl mx-auto pb-10 mb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Create New AI Interviewer Template
          </h2>
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
            Save AI Template
          </Button>
        </div>
        
        <Card className="border-slate-200">
          <CardContent className="p-6 pt-6">
            <div className="space-y-4">
              <div className="mb-4">
                {selectedConfig ? (
                  <p className="text-sm bg-blue-50 text-blue-700 p-3 rounded-md border border-blue-100">
                    Using template: <span className="font-semibold">{
                      previousConfigs.find(config => 
                        config.jobRole === selectedConfig.jobRole && 
                        config.interviewStyle === selectedConfig.interviewStyle
                      )?.name || "Custom Template"
                    }</span>
                  </p>
                ) : (
                  <p className="text-sm text-slate-600">
                    Configure how the AI interviewer should behave and what skills to assess. You can save this configuration as a new template.
                  </p>
                )}
              </div>
              <JobConfigForm initialValues={selectedConfig} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 