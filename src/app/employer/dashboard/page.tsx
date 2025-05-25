'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, Users, CheckCircle, Clock, TrendingUp, Star } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// Types for candidate performance
interface CandidatePerformance {
  id: string;
  name: string;
  jobTitle: string;
  interviewDate: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  status: 'Pending Review' | 'Shortlisted' | 'Rejected' | 'Hired';
}

interface PerformanceMetrics {
  totalCandidates: number;
  averageScore: number;
  hiredCount: number;
  inProgressCount: number;
  skillBreakdown: {
    technical: number;
    communication: number;
    problemSolving: number;
  };
}

// Sample data
const performanceMetrics: PerformanceMetrics = {
  totalCandidates: 150,
  averageScore: 78,
  hiredCount: 25,
  inProgressCount: 45,
  skillBreakdown: {
    technical: 82,
    communication: 75,
    problemSolving: 77
  }
};

const statusDistribution = [
  { name: 'Hired', value: 25 },
  { name: 'Shortlisted', value: 35 },
  { name: 'Rejected', value: 45 },
  { name: 'Pending Review', value: 45 }
];

const monthlyTrends = [
  { month: 'Jan', interviews: 28, hired: 5, averageScore: 76 },
  { month: 'Feb', interviews: 35, hired: 8, averageScore: 75 },
  { month: 'Mar', interviews: 42, hired: 10, averageScore: 79 },
  { month: 'Apr', interviews: 38, hired: 7, averageScore: 77 },
  { month: 'May', interviews: 45, hired: 12, averageScore: 80 },
  { month: 'Jun', interviews: 40, hired: 8, averageScore: 78 }
];

const recentCandidates: CandidatePerformance[] = [
  {
    id: 'c1',
    name: 'Alice Johnson',
    jobTitle: 'Senior Frontend Developer',
    interviewDate: '2024-03-15',
    overallScore: 85,
    technicalScore: 88,
    communicationScore: 82,
    problemSolvingScore: 85,
    status: 'Shortlisted'
  },
  {
    id: 'c2',
    name: 'Bob Smith',
    jobTitle: 'Backend Engineer',
    interviewDate: '2024-03-14',
    overallScore: 92,
    technicalScore: 95,
    communicationScore: 88,
    problemSolvingScore: 93,
    status: 'Hired'
  },
  {
    id: 'c3',
    name: 'Carol White',
    jobTitle: 'Full Stack Developer',
    interviewDate: '2024-03-13',
    overallScore: 72,
    technicalScore: 75,
    communicationScore: 70,
    problemSolvingScore: 71,
    status: 'Pending Review'
  }
];

const COLORS = ['#10B981', '#3B82F6', '#EF4444', '#F59E0B'];

const PerformanceDashboardPage = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Candidate Performance Analytics</h1>
        <p className="text-slate-600 mt-1">
          Track and analyze candidate performance across all interviews
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">{performanceMetrics.totalCandidates}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold text-yellow-500">{performanceMetrics.averageScore}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Hired Candidates</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold text-green-500">{performanceMetrics.hiredCount}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <div className="text-2xl font-bold text-orange-500">{performanceMetrics.inProgressCount}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance Trends */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="interviews"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    name="Total Interviews"
                  />
                  <Area
                    type="monotone"
                    dataKey="hired"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.1}
                    name="Hired"
                  />
                  <Area
                    type="monotone"
                    dataKey="averageScore"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    name="Avg Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Status Distribution */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Candidate Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidates Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Candidates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentCandidates.map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <p className="text-sm text-slate-500">{candidate.jobTitle}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    candidate.status === 'Hired' ? 'bg-green-100 text-green-700' :
                    candidate.status === 'Shortlisted' ? 'bg-blue-100 text-blue-700' :
                    candidate.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {candidate.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Overall Score</span>
                    <span className="font-semibold text-slate-700">{candidate.overallScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Technical</span>
                    <span className="font-semibold text-slate-700">{candidate.technicalScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Communication</span>
                    <span className="font-semibold text-slate-700">{candidate.communicationScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-500">Problem Solving</span>
                    <span className="font-semibold text-slate-700">{candidate.problemSolvingScore}%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push(`/employer/performance/candidate/${candidate.id}`)}
                >
                  View Full Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PerformanceDashboardPage;