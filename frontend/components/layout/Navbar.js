import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/AuthContext';
import { Zap, FolderKanban, LogOut, LogIn, User, Crown, Shield, Sparkles } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  const roleStyles = {
    admin: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'ADMIN / PM', icon: Shield },
    client: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'CLIENT', icon: Crown },
    stakeholder: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', label: 'TEAM', icon: User }
  };

  const userRole = user?.role || 'stakeholder';
  const roleConfig = roleStyles[userRole] || roleStyles.stakeholder;
  const RoleIcon = roleConfig.icon;

  const isProjectsActive = router.pathname.startsWith('/projects');

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 text-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl">
      <Link href="/projects" className="flex items-center gap-3 group">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-all duration-300">
            <Zap className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
              CIS
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.15)] flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Intelligence
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">Coordination Engine</p>
        </div>
      </Link>

      <nav className="flex items-center gap-4">
        <Link
          href="/projects"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
            isProjectsActive
              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border-transparent'
          }`}
        >
          <FolderKanban className="w-4 h-4 text-sky-400" />
          <span>Projects</span>
        </Link>

        <div className="h-4 w-px bg-slate-800/80" />

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-inner">
              <div className={`p-1 rounded-lg ${roleConfig.bg} ${roleConfig.border} border`}>
                <RoleIcon className={`w-3.5 h-3.5 ${roleConfig.text}`} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 leading-none">{user.name}</div>
                <span className={`text-[9px] font-extrabold tracking-wider ${roleConfig.text}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
    </header>
  );
}

