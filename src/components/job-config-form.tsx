"use client";

import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  jobRole: z.string().min(1, "Job role is required"),
  seniority: z.string().min(1, "Seniority level is required"),
  description: z.string().optional(),
});

export type JobConfigFormData = z.infer<typeof formSchema>;

interface JobConfigFormProps {
  initialValues?: Partial<JobConfigFormData>;
  onSubmit?: (data: JobConfigFormData) => void;
}

export default function JobConfigForm({ initialValues, onSubmit }: JobConfigFormProps) {
  const form = useForm<JobConfigFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
      jobRole: "",
      seniority: "",
      description: "",
    },
  });

  const handleSubmit = (values: JobConfigFormData) => {
    onSubmit?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
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
              <FormLabel>Job Role</FormLabel>
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
              <FormLabel>Seniority Level</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
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