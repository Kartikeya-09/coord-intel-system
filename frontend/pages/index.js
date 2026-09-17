import React from 'react';
import Link from 'next/link';
import {
  Zap,
  FolderKanban,
  GitFork,
  GitPullRequest,
  CheckSquare,
  FileCheck2,
  Bell,
  History,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Background Glow Overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-extrabold uppercase tracking-wider mb-6 backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen AIC Coordination Layer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Intelligent Impact Traversal for{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Architecture & Construction
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Replace manual WhatsApp threads and fragmented spreadsheets with a graph-based coordination engine. Log a change, trace downstream ripple effects, block sign-off bottlenecks, and issue automated stakeholder alerts in real-time.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-xl shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02]"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Enter Projects Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>View System Capabilities</span>
          </Link>
        </div>

        {/* Live System Preview Mockup */}
        <div className="mt-16 relative max-w-4xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-sky-500/10">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-400">CIS Core Engine • Impact Preview</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[10px]">
              BFS Active
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch text-left">
            <div className="flex-1 p-5 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-sky-400 mb-2">
                <GitPullRequest className="w-4 h-4" />
                Logged Change Event
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-1">
                "Flooring material changed from wood to Italian marble"
              </h4>
              <p className="text-xs text-slate-400">Source: Interior Designer (Aria Shen)</p>
            </div>

            <div className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-300 mb-2">
                <Zap className="w-4 h-4 fill-amber-300/30" />
                Automated Impact Traversal
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Vendor Order Task: <strong>Blocked</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Site Installation Plan: <strong>Affected</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Client Budget Approval: <strong>Re-triggered</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800/80 bg-slate-950/80 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-white">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Automated Traversal</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-sky-400">0</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Missed Dependencies</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-indigo-400">Real-time</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Approval Blocking</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-400">Append-Only</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Project Memory Audit</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Built for Multi-Stakeholder Precision
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Architects, Interior Designers, Contractors, Vendors, and Clients connected through a single intelligence graph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center mb-4">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Dependency Graph Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define directed edges between Activities and Approvals with built-in BFS cycle detection to ensure graph validity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Approval Sign-off Gating</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated blocking flags on downstream tasks when approvals transition to pending or rejected status.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Immutable Project Memory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every change, decision, action, and resolution is permanently recorded in a searchable audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="font-bold text-base text-white tracking-tight">
              CIS: Coordination Intelligence System
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 Coordination Intelligence System. Built with Node.js, Express, MongoDB, Next.js & Tailwind CSS.
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>Enter Projects Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
