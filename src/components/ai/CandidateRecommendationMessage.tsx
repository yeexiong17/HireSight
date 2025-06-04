import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Candidate {
  id: string;
  name: string;
  role: string;
  interviewDate: string;
  skills: string[];
  performanceScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

interface CandidateRecommendationMessageProps {
  candidates: Candidate[];
}

export default function CandidateRecommendationMessage({
  candidates,
}: CandidateRecommendationMessageProps) {
  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <Card key={candidate.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-slate-500">{candidate.role}</p>
            </div>
            <Badge
              variant={
                candidate.performanceScore >= 90 ? "default" : "secondary"
              }
              className="ml-2"
            >
              Score: {candidate.performanceScore}
            </Badge>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-green-600">Strengths:</p>
                <ul className="list-disc list-inside pl-2">
                  {candidate.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>

              {candidate.weaknesses.length > 0 && (
                <div>
                  <p className="font-medium text-amber-600">
                    Areas for Development:
                  </p>
                  <ul className="list-disc list-inside pl-2">
                    {candidate.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 pt-2 border-t">
                <p className="font-medium">
                  Recommendation:{" "}
                  <span className="text-blue-600">
                    {candidate.recommendation}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
