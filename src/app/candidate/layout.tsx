"use client";

import { CandidateNav } from "@/components/candidate-nav";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <CandidateNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 