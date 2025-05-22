'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Settings, Briefcase, Users, LogOut } from 'lucide-react';

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/employer/performance', icon: <BarChart3 className="w-5 h-5" />, label: 'Performance Dashboard' },
    { href: '/employer/job-config', icon: <Settings className="w-5 h-5" />, label: 'Job Configuration' },
    // Add more employer navigation items as needed
    // { href: '/employer/candidates', icon: <Users className="w-5 h-5" />, label: 'Candidates' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
        {/* Company/App Logo */}
        <div className="p-6 flex items-center space-x-3 border-b border-slate-700">
          <Briefcase className="w-8 h-8 text-slate-300" />
          <span className="text-lg font-semibold text-white">HR Portal</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-grow py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-slate-700 text-white' 
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span className={`mr-3 ${isActive ? 'text-blue-400' : ''}`}>{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-auto"></span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer/Log Out Section */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <Link 
            href="/" 
            className="flex items-center py-2 px-4 text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-slate-700/50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 