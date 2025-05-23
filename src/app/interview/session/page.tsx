"use client";
import CandidateInterview from "@/components/candidate-interview";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CandidateInterviewPage() {
  const router = useRouter();

  return (
    <main className="h-screen flex flex-col items-center justify-center relative">
      <Button 
        variant="outline"
        className="absolute top-4 left-4 flex items-center gap-1"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>
      <CandidateInterview />
    </main>
  );
} 