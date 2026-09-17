import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/AuthContext';
import { Zap, FolderKanban, LogOut, LogIn, User, Crown, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  const roleStyles = {
    admin: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'ADMIN / PM', icon: Shield },
    client: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'CLIENT', icon: Crown },
    stakeholder: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', label: 'TEAM', icon: User }
  };

  const userRole = user?.role || 'stakeholder';
  const roleConfig = roleStyles[userRole] || roleStyles.stakeholder;
  const RoleIcon = roleConfig.icon;

  return (
    <header className="h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white flex items-center justify-between px-6 sticky top-0 z-50 shadow-lg">
      <Link href="/projects" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
          <Zap className="w-5 h-5 text-white fill-white/20" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
              CIS
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
              Intelligence
            </span>
          </div>
          <p className="text-[11px] text-slate-400 -mt-1 font-medium">Coordination Intelligence System</p>
        </div>
      </Link>

      <nav className="flex items-center gap-4">
        <Link
          href="/projects"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700"
        >
          <FolderKanban className="w-4 h-4 text-sky-400" />
          <span>Projects</span>
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <RoleIcon className={`w-4 h-4 ${roleConfig.text}`} />
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 leading-none">{user.name}</div>
                <span className={`text-[9px] font-extrabold tracking-wider ${roleConfig.text}`}>
                  {roleConfig.label}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
