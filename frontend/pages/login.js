import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import ErrorBanner from '../components/shared/ErrorBanner';
import { Zap, LogIn, Lock, Mail, Shield, User, Crown, Paintbrush, HardHat, Truck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await login(email, password);
      router.push('/projects');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickLogin(userEmail) {
    try {
      setSubmitting(true);
      setError(null);
      await demoLogin(null, userEmail);
      router.push('/projects');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  }

  const demoAccounts = [
    {
      role: 'ADMIN / PM',
      name: 'Leila Hassan',
      email: 'leila.hassan@example.com',
      icon: Shield,
      color: 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:border-purple-500/60'
    },
    {
      role: 'CLIENT',
      name: 'Maya Patel',
      email: 'maya.patel@example.com',
      icon: Crown,
      color: 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:border-amber-500/60'
    },
    {
      role: 'INTERIOR DESIGNER',
      name: 'Aria Shen',
      email: 'aria.shen@example.com',
      icon: Paintbrush,
      color: 'border-sky-500/30 bg-sky-500/10 text-sky-300 hover:border-sky-500/60'
    },
    {
      role: 'SITE CONTRACTOR',
      name: 'BuildFast Co',
      email: 'buildfast@example.com',
      icon: HardHat,
      color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/60'
    },
    {
      role: 'PROCUREMENT VENDOR',
      name: 'Ravi Logistics',
      email: 'ravi.logistics@example.com',
      icon: Truck,
      color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:border-indigo-500/60'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 bg-slate-950">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-xl shadow-sky-500/20 mb-3">
            <Zap className="w-7 h-7 text-white fill-white/20" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign In to CIS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your coordination intelligence workspace and role-scoped portal.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        {/* Standard Credentials Form */}
        <form onSubmit={handleLogin} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="e.g. leila.hassan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo One-Click Login Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              One-Click Demo Switcher
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">
            Click any role below to instantly switch portals without typing:
          </p>

          <div className="flex flex-col gap-2">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.email}
                  onClick={() => handleQuickLogin(acc.email)}
                  disabled={submitting}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${acc.color}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-xs font-bold leading-none">{acc.name}</div>
                      <div className="text-[10px] font-mono opacity-80 mt-0.5">{acc.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-900/60 border border-slate-700/50">
                    Switch ➔
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
