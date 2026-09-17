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
  History,
  Shield,
  Crown,
  UserCheck
} from 'lucide-react';

export default function ProjectNav({ projectId }) {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role || 'admin';

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

  const roleLabels = {
    admin: { label: 'Admin Control', icon: Shield, badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    client: { label: 'Client Portal', icon: Crown, badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    stakeholder: { label: 'Team Workspace', icon: UserCheck, badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30' }
  };

  const currentRoleConfig = roleLabels[role] || roleLabels.admin;
  const HeaderIcon = currentRoleConfig.icon;

  return (
    <aside className="w-64 bg-slate-950/70 backdrop-blur-2xl border-r border-slate-800/80 p-4 flex flex-col gap-1 min-h-[calc(100vh-4rem)] shrink-0 sticky top-16 z-40">
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
          <HeaderIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>{currentRoleConfig.label}</span>
        </div>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${currentRoleConfig.badge}`}>
          {role}
        </span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {visibleItems.map((item) => {
          const isActive = router.asPath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 via-sky-500/10 to-transparent text-sky-300 border border-sky-500/30 shadow-md shadow-sky-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              )}
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

