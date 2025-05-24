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
import type { Node } from 'reactflow'; // Import Node type

// Dummy data for previousConfigs
const previousConfigs = [
  {
    id: "conf001",
    name: "Frontend Developer Default",
    jobRole: "Frontend Developer",
    seniority: "Senior",
    interviewStyle: "friendly" as const,
    focusTraits: "React, TypeScript, Problem Solving",
    requiredSkills: "React, TypeScript, Next.js, Zustand",
    customQuestions: "Describe a challenging project.\nWhat are your salary expectations?",
    createdAt: "2023-10-01",
    usageCount: 10,
    description: "Default template for frontend roles."
  },
  {
    id: "conf002",
    name: "Backend Developer Standard",
    jobRole: "Backend Developer",
    seniority: "Mid-Level",
    interviewStyle: "formal" as const,
    focusTraits: "Node.js, Databases, System Design",
    requiredSkills: "Node.js, Express, PostgreSQL, Docker",
    customQuestions: "Explain microservices architecture.",
    createdAt: "2023-11-15",
    usageCount: 5,
    description: "Standard template for backend roles."
  },
];

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
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasWorkflowNodes, setHasWorkflowNodes] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // Default to form tab

  useEffect(() => {
    if (isEditing && templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        setSelectedConfig({
          name: template.name,
          jobRole: template.jobRole,
          seniority: template.seniority,
          interviewStyle: template.interviewStyle,
          focusTraits: template.focusTraits,
          requiredSkills: template.requiredSkills,
          customQuestions: template.customQuestions,
          description: template.description || "", 
        });
        // For existing templates, form validity will be set by JobConfigForm's onFormChange based on loaded values
        // We can assume an existing, loaded template might have nodes initially.
        // This might need to be fetched if workflow state isn't part of the template object itself.
        setHasWorkflowNodes(true); // Placeholder: Assume existing templates have a workflow
      } else {
        // Template ID provided but not found, treat as new or redirect
        router.push('/employer/job-config/create'); // Or show a not found message
      }
    } else {
      // Creating a new template
      setSelectedConfig({
        name: "",
        jobRole: "",
        seniority: "",
        interviewStyle: "friendly" as const,
        focusTraits: "",
        requiredSkills: "",
        customQuestions: "",
        description: "",
      });
      setIsFormValid(false); // Form is initially invalid for new templates
      setHasWorkflowNodes(false);
      setActiveTab("form"); // Ensure new templates start on the form tab
    }
  }, [isEditing, templateId, router]);

  const handleFormChange = (data: JobConfigFormData, isValid: boolean) => {
    setSelectedConfig(data);
    setIsFormValid(isValid);
  };

  const handleWorkflowChange = (nodes: Node[], edges: any) => {
    console.log('Workflow updated:', { nodes, edges });
    setHasWorkflowNodes(nodes.length > 0);
  };

  const handleSave = () => {
    console.log('Saving template:', selectedConfig, 'Workflow nodes:', hasWorkflowNodes);
    // In a real app, here you would send data to your API
    // For now, just navigate back
    router.push('/employer/job-config');
  };

  const canSave = isFormValid && hasWorkflowNodes;

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
              {isEditing ? 'Modify the details and workflow of your AI interviewer template.' : 'Configure the details and workflow for your new AI interviewer template.'}
            </p>
          </div>
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!canSave}
            title={!canSave ? "Please fill all required form fields and add at least one stage to the workflow." : "Save this template"}
          >
            Save Template
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="form">Form View</TabsTrigger>
            <TabsTrigger value="workflow" disabled={!isFormValid} title={!isFormValid ? "Complete the Form View first" : "Configure Visual Workflow"}>
              Visual Workflow
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workflow">
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <InterviewWorkflow 
                  onWorkflowChange={handleWorkflowChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <Card className="border-slate-200">
              <CardContent className="p-6 pt-6">
                <JobConfigForm 
                  key={templateId || 'new-template'}
                  initialValues={selectedConfig} 
                  onFormChange={handleFormChange} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 