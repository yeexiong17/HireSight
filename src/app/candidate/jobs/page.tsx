"use client"; // May become a server component if data fetching is added later

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Briefcase, MapPin, CalendarDays, ArrowRight, Building } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  postedDate: string;
  tags: string[];
  companyLogo?: string; // Optional: URL to a company logo image
}

// Sample Job Data - to be replaced with API call later
const sampleJobs: Job[] = [
  {
    id: "job001",
    title: "Senior Frontend Developer",
    companyName: "Grab",
    location: "San Francisco, CA",
    description: "Join our dynamic team to build next-gen web applications using React, Next.js, and TypeScript. Seeking experienced developers with a passion for UI/UX.",
    postedDate: "2024-05-20",
    tags: ["React", "Next.js", "TypeScript", "UI/UX", "Frontend"],
    companyLogo: "https://brandlogos.net/wp-content/uploads/2020/08/grab-logo.png" // Example path
  },
  {
    id: "job002",
    title: "Backend Python Engineer",
    companyName: "Meta",
    location: "New York, NY",
    description: "We are looking for a skilled Python developer to design and implement robust backend services, APIs, and database solutions. Experience with Django/Flask is a plus.",
    postedDate: "2024-05-18",
    tags: ["Python", "Django", "Flask", "API", "Backend", "SQL"],
    companyLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy3ZqxYhMdW3qa__685iJWJwGQGhV4VCivoQ&s"
  },
  {
    id: "job003",
    title: "Full-Stack Developer (Remote)",
    companyName: "ConnectSphere Ltd.",
    location: "Remote",
    description: "Exciting opportunity for a versatile Full-Stack Developer to work on a leading communication platform. Proficiency in Node.js, React, and cloud services required.",
    postedDate: "2024-05-22",
    tags: ["Node.js", "React", "AWS", "Full-Stack", "Remote"],
  },
  {
    id: "job004",
    title: "Junior UI/UX Designer",
    companyName: "Google",
    location: "Austin, TX",
    description: "Entry-level position for a creative UI/UX designer to contribute to innovative design projects. Portfolio showcasing design thinking and user-centered design is essential.",
    postedDate: "2024-05-21",
    tags: ["UI Design", "UX Design", "Figma", "Adobe XD", "Prototyping"],
    companyLogo: "https://yt3.googleusercontent.com/2eI1TjX447QZFDe6R32K0V2mjbVMKT5mIfQR-wK5bAsxttS_7qzUDS1ojoSKeSP0NuWd6sl7qQ=s900-c-k-c0x00ffffff-no-rj"
  },
];

export default function JobListPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mb-8 md:mb-12 text-center">
        <Briefcase className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-slate-700" />
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
          Available Job Openings
        </h1>
        <p className="mt-2 md:mt-3 text-md md:text-lg text-slate-600">
          Find your next career opportunity with our AI-powered interview platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {sampleJobs.map((job) => (
          <div key={job.id}>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="pb-3">
                {job.companyLogo && (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-3 border border-slate-300 overflow-hidden">
                    {/* In a real app, this would be an <Image> from next/image */}
                    <img src={job.companyLogo} alt={`${job.companyName} logo`} className="w-full h-full object-cover" />
                  </div>
                )}
                {!job.companyLogo && (
                  <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-3 border border-slate-300">
                    <Building className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                <CardTitle className="text-xl font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  {job.title}
                </CardTitle>
                <div className="flex items-center text-sm text-slate-500 mt-1">
                  <Building className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  {job.companyName}
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 flex-grow space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-500 flex-shrink-0" />
                  {job.location}
                </div>
                <p className="leading-relaxed line-clamp-3">
                  {job.description}
                </p>
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 mb-1.5">Key Skills:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-slate-200 text-slate-700 rounded-full font-medium">
                        +{job.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 mt-auto">
                <div className="flex justify-between items-center w-full">
                  <div className="text-xs text-slate-500 flex items-center">
                    <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <Link href={`/candidate/jobs/${job.id}`} passHref legacyBehavior>
                    <Button size="sm" variant="default" className="bg-slate-700 hover:bg-slate-800 group">
                      View Details <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {sampleJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-600">No Job Openings At The Moment</h2>
          <p className="text-slate-500 mt-2">Please check back later for new opportunities.</p>
        </div>
      )}

      <div className="mt-12 md:mt-16 text-center py-6 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Powered by AI Interview Platform &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
} 