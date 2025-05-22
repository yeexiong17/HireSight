"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  jobRole: z.string().min(2, {
    message: "Job role must be at least 2 characters.",
  }),
  seniority: z.string().min(2, {
    message: "Seniority must be at least 2 characters.",
  }),
  interviewStyle: z.enum(["formal", "friendly", "behavioral", "stress-based"]),
  focusTraits: z.string().min(5, {
    message: "Focus traits must be at least 5 characters.",
  }),
  requiredSkills: z.string().min(5, {
    message: "Required skills must be at least 5 characters.",
  }),
  customQuestions: z.string().optional(),
});

export type JobConfigFormData = z.infer<typeof formSchema>;

interface JobConfigFormProps {
  initialValues?: JobConfigFormData;
}

export default function JobConfigForm({ initialValues }: JobConfigFormProps) {
  const [generatedJson, setGeneratedJson] = useState<string | null>(null);
  const [isConfigSaved, setIsConfigSaved] = useState(false);

  const form = useForm<JobConfigFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      jobRole: "",
      seniority: "",
      interviewStyle: "friendly",
      focusTraits: "",
      requiredSkills: "",
      customQuestions: "",
    },
  });

  // Reset form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  function onSubmit(values: JobConfigFormData) {
    console.log("AI Config Values:", values);
    const configJson = JSON.stringify(values, null, 2);
    console.log("Generated JSON Config:", configJson);
    setGeneratedJson(configJson);
    setIsConfigSaved(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setIsConfigSaved(false);
    }, 3000);
  }

  return (
    <>
      <Card className="w-full mx-auto border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle>AI Interview Configuration</CardTitle>
          <CardDescription>
            Configure how the AI interviewer will behave and what skills it will assess.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-5">
              {isConfigSaved && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    <AlertDescription>AI configuration successfully saved!</AlertDescription>
                  </div>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role for AI Context</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormDescription>
                        The specific title that the AI will use to contextualize questions.
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
                        The experience level that affects interview question difficulty.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="interviewStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an interview style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
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
                    <FormLabel>Focus Traits</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., communication, problem-solving, cultural fit (comma-separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Key personality traits or soft skills the AI will assess (comma-separated).
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
                    <FormLabel>Required Skills / Keywords</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., React, Node.js, Python, SQL (comma-separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Technical skills the AI will focus on during the interview (comma-separated).
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
                    <FormLabel>Custom Interview Questions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any custom questions you'd like the AI to ask, one per line."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add specific questions the AI will include in the interview. List one question per line.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 pb-4">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Reset Form
              </Button>
              <Button type="submit">Save AI Configuration</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {generatedJson && (
        <Card className="w-full mx-auto mt-6 mb-0 border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle>Generated AI Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto text-sm">
              {generatedJson}
            </pre>
          </CardContent>
        </Card>
      )}
    </>
  );
} 