import React from 'react';
import { CheckCircle, TrendingUp, MessageSquare, ListChecks, Star, AlertTriangle } from 'lucide-react';

// Mock data for demonstration
const mockPerformanceData = {
  overallScore: 85, // Percentage
  scoreLabel: "Great Performance!",
  breakdown: [
    { category: "Technical Skills", score: 90, feedback: "Excellent grasp of core concepts and practical application." },
    { category: "Problem Solving", score: 80, feedback: "Approached complex problems logically, could refine solution optimization." },
    { category: "Communication", score: 88, feedback: "Articulate and clear in explanations." },
    { category: "Cultural Fit", score: 75, feedback: "Good alignment with team values, some nervousness noted." },
  ],
  strengths: [
    "Strong analytical abilities.",
    "Clear and concise communication.",
    "Proactive in asking clarifying questions."
  ],
  areasForImprovement: [
    "Consider edge cases more thoroughly in problem-solving.",
    "Practice articulating thought process under pressure."
  ],
  recentActivity: [
    { id: 1, jobTitle: "Software Engineer", date: "2024-05-20", status: "Completed", performanceLink: "#" },
    { id: 2, jobTitle: "Frontend Developer", date: "2024-05-15", status: "Feedback Pending", performanceLink: "#" },
  ]
};

// Helper component for star ratings
const StarRating = ({ score }: { score: number }) => {
  const totalStars = 5;
  const filledStars = Math.round((score / 100) * totalStars);
  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < filledStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default function CandidateDashboardPage() {
  const performance = mockPerformanceData;

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-slate-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Interview Performance</h1>
        <p className="mt-1 text-slate-600">Here's an overview of your recent interview performance.</p>
      </header>

      {/* Overall Performance Summary */}
      <section className="mb-8 p-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Overall Summary</h2>
            <p className={`text-4xl font-bold ${performance.overallScore >= 80 ? 'text-green-500' : performance.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
              {performance.overallScore}%
            </p>
            <p className="text-slate-500 mt-1">{performance.scoreLabel}</p>
          </div>
          <div className="text-green-500">
            <TrendingUp size={48} />
          </div>
        </div>
      </section>

      {/* Performance Breakdown by Category */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Performance Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performance.breakdown.map((item, index) => (
            <div key={index} className="p-6 bg-white shadow-lg rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-slate-800">{item.category}</h3>
                <StarRating score={item.score} />
              </div>
              <p className="text-2xl font-semibold text-slate-700 mb-2">{item.score}/100</p>
              <p className="text-sm text-slate-500 leading-relaxed">{item.feedback}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths and Areas for Improvement */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center mb-3">
            <CheckCircle size={24} className="text-green-500 mr-3" />
            <h3 className="text-lg font-medium text-slate-800">Key Strengths</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {performance.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center mb-3">
            <AlertTriangle size={24} className="text-yellow-500 mr-3" />
            <h3 className="text-lg font-medium text-slate-800">Areas for Improvement</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {performance.areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Recent Interview Activity - Placeholder */}
      <section>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Activity</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {performance.recentActivity.map(activity => (
              <li key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{activity.jobTitle}</p>
                    <p className="text-sm text-slate-500">Interview Date: {activity.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    activity.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
} 