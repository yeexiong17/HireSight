"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Check, DollarSign, MapPin, Clock, Briefcase, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  employmentType: z.enum(["full-time", "part-time", "contract", "internship", "remote"]),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  salaryRange: z.string().optional(),
  applicationDeadline: z.string().optional(),
  startDate: z.string().optional(),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  requirements: z.string().min(10, {
    message: "Requirements must be at least 10 characters.",
  }),
  benefits: z.string().optional(),
});

export type JobSpecificationFormData = z.infer<typeof formSchema>;

interface JobSpecificationFormProps {
  initialValues?: JobSpecificationFormData;
}

export default function JobSpecificationForm({ initialValues }: JobSpecificationFormProps = {}) {
  const [isJobSaved, setIsJobSaved] = useState(false);

  const form = useForm<JobSpecificationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      jobTitle: "",
      department: "",
      employmentType: "full-time",
      location: "",
      salaryRange: "",
      applicationDeadline: "",
      startDate: "",
      jobDescription: "",
      requirements: "",
      benefits: "",
    },
  });

  function onSubmit(values: JobSpecificationFormData) {
    console.log("Job Specification Form Values:", values);
    setIsJobSaved(true);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setIsJobSaved(false);
    }, 3000);
  }

  return (
    <Card className="w-full mx-auto border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle>Job Specification</CardTitle>
        <CardDescription>
          Define the details for the job posting that candidates will see.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {isJobSaved && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <div className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  <AlertDescription>Job specification successfully saved!</AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input placeholder="e.g., Senior Software Engineer" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Engineering, Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input placeholder="e.g., New York, NY or Remote" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input placeholder="e.g., $80,000 - $100,000" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input type="date" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <Input type="date" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role, responsibilities, and what a typical day looks like."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the required qualifications, experience, and skills needed."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any benefits, perks, or unique aspects about working at your company."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4 pb-4">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Reset Form
            </Button>
            <Button type="submit">Save Job Specification</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
} 