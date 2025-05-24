"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  jobRole: z.string().min(1, "Job role is required"),
  seniority: z.string().min(1, "Seniority level is required"),
  interviewStyle: z.enum(['friendly', 'formal', 'behavioral', 'stress-based']),
  focusTraits: z.string().min(1, "Focus traits are required"),
  requiredSkills: z.string().min(1, "Required skills are required"),
  customQuestions: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export type JobConfigFormData = z.infer<typeof formSchema>;

interface JobConfigFormProps {
  initialValues?: Partial<JobConfigFormData>;
  onFormChange?: (data: JobConfigFormData, isValid: boolean) => void; 
}

export default function JobConfigForm({ initialValues, onFormChange }: JobConfigFormProps) {
  const form = useForm<JobConfigFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change to update parent component
    defaultValues: initialValues || {
      name: "",
      jobRole: "",
      seniority: "",
      interviewStyle: undefined,
      focusTraits: "",
      requiredSkills: "",
      customQuestions: "",
      description: "",
    },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (onFormChange) {
      onFormChange(watchedValues as JobConfigFormData, form.formState.isValid);
    }
  }, [watchedValues, form.formState.isValid, onFormChange]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* No explicit submit button here, form changes are propagated up */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Frontend Developer Interview" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this interview template
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Job Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Frontend Developer" {...field} />
              </FormControl>
              <FormDescription>
                The specific role this template is designed for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seniority"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Seniority Level</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior, Mid-Level, Junior" {...field} />
              </FormControl>
              <FormDescription>
                The experience level this template targets
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="interviewStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Interview Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interview style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="stress-based">Stress-based</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The overall tone and approach of the AI interviewer.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="focusTraits"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Focus Traits</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Problem-solving, Communication, Teamwork" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of key personality traits to assess.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requiredSkills"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Required Skills</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Node.js, Python" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of essential technical skills.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Questions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter custom questions, one per line..."
                  className="resize-none min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specific questions you want the AI to ask.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel><span className="text-red-500">*</span>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add a brief description of this interview template..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional context about this interview template
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
} 