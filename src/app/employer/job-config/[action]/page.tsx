'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import JobConfigForm from "@/components/job-config-form";
import InterviewWorkflow from "@/components/interview-workflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { JobConfigFormData } from "@/components/job-config-form";

// This would come from your API/database in a real application
const getTemplateById = (id: string) => {
  return previousConfigs.find(config => config.id === id);
};

export default function AIInterviewerTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const isEditing = params.action === 'edit';
  const templateId = typeof params.id === 'string' ? params.id : null;
  
  const [selectedConfig, setSelectedConfig] = useState<JobConfigFormData | undefined>(undefined);

  useEffect(() => {
    if (isEditing && templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedConfig({
          jobRole: template.jobRole,
          seniority: template.seniority,
          interviewStyle: template.interviewStyle as any,
          focusTraits: template.focusTraits,
          requiredSkills: template.requiredSkills,
          customQuestions: template.customQuestions
        });
      }
    }
  }, [isEditing, templateId]);

  const handleSave = () => {
    // Save logic here
    console.log('Saving template:', selectedConfig);
    router.push('/employer/job-config');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.push('/employer/job-config')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800">
              {isEditing ? 'Edit AI Interviewer Template' : 'Create New AI Interviewer Template'}
            </h1>
            <p className="text-slate-600 mt-1">
              Configure how the AI interviewer should behave and what skills to assess.
            </p>
          </div>
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Template
          </Button>
        </div>

        <Tabs defaultValue="workflow" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="workflow">Visual Workflow</TabsTrigger>
            <TabsTrigger value="form">Form View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflow">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <InterviewWorkflow 
                  onWorkflowChange={(nodes, edges) => {
                    console.log('Workflow updated:', { nodes, edges });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <Card className="border-slate-200">
              <CardContent className="p-6 pt-6">
                <JobConfigForm initialValues={selectedConfig} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 