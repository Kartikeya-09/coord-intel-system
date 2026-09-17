import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import {
  LayoutDashboard,
  Users,
  GitFork,
  GitPullRequest,
  CheckSquare,
  FileCheck2,
  Bell,
  History
} from 'lucide-react';

export default function ProjectNav({ projectId }) {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role || 'admin'; // default to full view if role unassigned

  const allNavItems = [
    { label: 'Dashboard', path: `/projects/${projectId}`, icon: LayoutDashboard, roles: ['admin', 'stakeholder', 'client'] },
    { label: 'Stakeholders', path: `/projects/${projectId}/stakeholders`, icon: Users, roles: ['admin', 'stakeholder'] },
    { label: 'Activities & Graph', path: `/projects/${projectId}/activities`, icon: GitFork, roles: ['admin', 'stakeholder'] },
    { label: 'Change Events', path: `/projects/${projectId}/changes`, icon: GitPullRequest, roles: ['admin', 'stakeholder'] },
    { label: 'Actions Board', path: `/projects/${projectId}/actions`, icon: CheckSquare, roles: ['admin', 'stakeholder'] },
    { label: 'Approvals Tracker', path: `/projects/${projectId}/approvals`, icon: FileCheck2, roles: ['admin', 'client', 'stakeholder'] },
    { label: 'Alerts Inbox', path: `/projects/${projectId}/alerts`, icon: Bell, roles: ['admin', 'stakeholder', 'client'] },
    { label: 'Project Memory', path: `/projects/${projectId}/memory`, icon: History, roles: ['admin', 'stakeholder', 'client'] }
  ];

  const visibleItems = allNavItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-950/60 border-r border-slate-800/80 p-4 flex flex-col gap-1 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
        <span>{role === 'client' ? 'Client Portal' : role === 'admin' ? 'Admin Control' : 'Team Workspace'}</span>
        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700">
          {role}
        </span>
      </div>
      <nav className="flex flex-col gap-1 mt-1">
        {visibleItems.map((item) => {
          const isActive = router.asPath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/15 to-indigo-500/10 text-sky-400 border border-sky-500/20 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
