"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  LogOut,
  Building,
  FileText,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Dashboard",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Configuration",
    href: "/employer/job-config",
    icon: Settings,
    active: true,
  },
  {
    name: "Jobs",
    href: "/employer/jobs",
    icon: Briefcase,
  },
  {
    name: "Resumes",
    href: "/employer/resumes",
    icon: FileText,
  },
  {
    name: "AI Assistant",
    href: "/employer/ai-assistant",
    icon: Bot,
  },
];

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-slate-900">HR Portal</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <Link href="/" className="flex items-center space-x-2 text-slate-600">
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
