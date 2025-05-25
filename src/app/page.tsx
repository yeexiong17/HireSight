"use client"; // Required for useState and useRouter

import Link from "next/link";
import { useRouter } from "next/navigation"; // For programmatic navigation
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, Settings, PlayCircle, Briefcase, UserCheck, Building } from "lucide-react"; 

export default function HomePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleProceed = () => {
    if (selectedRole === "employer") {
      router.push("/employer/dashboard");
    } else if (selectedRole === "candidate") {
      router.push("/candidate/dashboard");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-8 text-slate-800">
      <div className="max-w-lg w-full"> {/* Adjusted max-width for a more focused card */}
        <div className="text-center mb-10">
          <Briefcase className="w-16 h-16 mx-auto mb-5 text-slate-700" /> 
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            AI Interview Platform
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Streamline your hiring process with intelligent, AI-powered interviews.
          </p>
        </div>

        <Card className="bg-white shadow-xl border border-slate-200 w-full">
          <CardHeader className="pt-8">
            <CardTitle className="text-xl font-semibold text-slate-700 text-center">
              Select Your Role to Continue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 py-6 px-8">
            <RadioGroup 
              value={selectedRole || ""} 
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              <Label 
                htmlFor="employer-role" 
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all 
                          ${selectedRole === "employer" ? "bg-slate-700 text-white border-slate-700 shadow-md" : "bg-white hover:bg-slate-50 border-slate-300"}`}>
                <RadioGroupItem value="employer" id="employer-role" className={`${selectedRole === "employer" ? "border-white text-white" : "border-slate-400"}`} />
                <div className="ml-3 flex items-center">
                  <Building className={`w-6 h-6 mr-3 transition-colors ${selectedRole === "employer" ? "text-slate-300" : "text-slate-500"}`} />
                  <div>
                    <span className={`font-medium ${selectedRole === "employer" ? "text-white" : "text-slate-800"}`}>Employer</span>
                    <p className={`text-xs mt-0.5 ${selectedRole === "employer" ? "text-slate-300" : "text-slate-500"}`}>Configure interviews & view reports.</p>
                  </div>
                </div>
              </Label>
              <Label 
                htmlFor="candidate-role" 
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all 
                          ${selectedRole === "candidate" ? "bg-slate-700 text-white border-slate-700 shadow-md" : "bg-white hover:bg-slate-50 border-slate-300"}`}>
                <RadioGroupItem value="candidate" id="candidate-role" className={`${selectedRole === "candidate" ? "border-white text-white" : "border-slate-400"}`} />
                <div className="ml-3 flex items-center">
                  <UserCheck className={`w-6 h-6 mr-3 transition-colors ${selectedRole === "candidate" ? "text-slate-300" : "text-slate-500"}`} />
                  <div>
                    <span className={`font-medium ${selectedRole === "candidate" ? "text-white" : "text-slate-800"}`}>Candidate</span>
                    <p className={`text-xs mt-0.5 ${selectedRole === "candidate" ? "text-slate-300" : "text-slate-500"}`}>Browse jobs & start your AI interview.</p>
                  </div>
                </div>
              </Label>
            </RadioGroup>

            <Button 
              onClick={handleProceed} 
              disabled={!selectedRole}
              size="lg"
              className="w-full mt-6 py-3 bg-slate-700 hover:bg-slate-800 text-base disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Proceed to Portal <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} AI Interview Platform. All Rights Reserved.
        </p>
      </div>
    </main>
  );
}
