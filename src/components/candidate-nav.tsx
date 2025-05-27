"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Briefcase, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/candidate/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Jobs",
    href: "/candidate/jobs",
    icon: Briefcase
  },
  {
    name: "Profile",
    href: "/candidate/profile",
    icon: User
  }
];

export function CandidateNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-16 items-center px-4 border-b bg-white">
      <div className="flex items-center gap-2 font-semibold">
        <Briefcase className="h-6 w-6" />
        <span>Interview Portal</span>
      </div>

      <nav className="flex items-center space-x-6 mx-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600",
                pathname === item.href
                  ? "text-blue-600"
                  : "text-slate-600"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center space-x-4">
        <Link href="/candidate/ai-assistant">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </Button>
        </Link>

        <Link
          href="/"
          className="flex items-center space-x-2 text-slate-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </Link>
      </div>
    </div>
  );
} 