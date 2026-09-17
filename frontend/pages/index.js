import React, { useState } from 'react';
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
  CheckCircle2,
  Network,
  Users,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('impact'); // 'impact' | 'graph' | 'rbac' | 'memory'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Mesh Background Grid & Radial Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(255,255,255,0))]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 px-6 max-w-7xl mx-auto w-full text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-extrabold uppercase tracking-widest mb-8 backdrop-blur-xl shadow-[0_0_20px_rgba(14,165,233,0.2)] animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Next-Gen Construction Coordination Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Intelligent Impact Traversal for{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Architecture & Fit-Out Projects
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Eliminate manual chat threads and fragile spreadsheets. CIS uses graph algorithms to trace change ripple effects across activities, trigger sign-off blocks, and notify affected stakeholders automatically.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-2xl shadow-sky-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <FolderKanban className="w-5 h-5" />
            <span>Enter Projects Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-sm bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 text-slate-200 hover:text-white transition-all duration-200 backdrop-blur-xl shadow-lg"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            <span>Try One-Click Demo Roles</span>
          </Link>
        </div>

        {/* Interactive Feature Demo Showcase Mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-sky-500/10 text-left">
          {/* Header Bar with Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="ml-2 font-mono text-xs text-slate-400 font-semibold">CIS Intelligence Engine • Live Preview</span>
            </div>

            {/* Showcase Tab Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
              {[
                { id: 'impact', label: 'BFS Traversal', icon: Zap },
                { id: 'graph', label: 'Graph Topology', icon: Network },
                { id: 'rbac', label: 'Role Access', icon: Users },
                { id: 'memory', label: 'Audit Memory', icon: History }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Tab Content Display */}
          {activeTab === 'impact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-400 mb-2">
                    <GitPullRequest className="w-4 h-4" />
                    Source Change Event
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-2 leading-snug">
                    "Flooring material changed from engineered wood to Italian marble"
                  </h4>
                  <p className="text-xs text-slate-400">Initiated by: Interior Designer (Aria Shen)</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Linked Seed Entities: 2</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono font-bold text-[10px] border border-sky-500/20">
                    STATUS: ANALYZED
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-3">
                    <Zap className="w-4 h-4 fill-amber-300/40 animate-pulse" />
                    Automated Downstream Impact
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="text-slate-200">Vendor Material Order Task: <strong>Blocked</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-slate-200">Site Contractor Schedule: <strong>Affected</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <FileCheck2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-slate-200">Client Budget Approval: <strong>Re-triggered</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] text-amber-300 font-bold flex items-center justify-between">
                  <span>3 Automated Actions Issued</span>
                  <span>100% Graph Traversal Coverage</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-2">
                  <Network className="w-4 h-4 text-sky-400" />
                  Directed Dependency Edge Traversal
                </span>
                <span className="font-mono text-[10px] text-slate-500">Directed Acyclic Graph</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-sky-400 mb-1">Upstream Task</div>
                  <div className="font-bold text-slate-100">Flooring Selection</div>
                  <div className="text-[10px] text-slate-400 mt-1">Status: Complete</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-400 mb-1">Impacted Task</div>
                  <div className="font-bold text-slate-100">Flooring Material Order</div>
                  <div className="text-[10px] text-amber-300 mt-1">Status: Pending Sign-off</div>
                </div>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
                  <div className="text-[10px] uppercase font-bold text-rose-400 mb-1">Downstream Blocked</div>
                  <div className="font-bold text-slate-100">Site Installation Prep</div>
                  <div className="text-[10px] text-rose-300 mt-1">Status: Gated / Blocked</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rbac' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-4 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Role-Based Portal Views
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="font-bold text-purple-300 mb-1">Project Manager (Admin)</div>
                  <p className="text-[11px] text-slate-400">Full control across all 8 modules including graph constructor and change logging.</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="font-bold text-amber-300 mb-1">Property Client</div>
                  <p className="text-[11px] text-slate-400">Focused portal view for budget approvals, impact alerts, and project memory audit log.</p>
                </div>
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <div className="font-bold text-sky-300 mb-1">Specialist Stakeholders</div>
                  <p className="text-[11px] text-slate-400">Task-based access for Designers, Contractors, Vendors, and Consultants.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-2 mb-1">
                <History className="w-4 h-4 text-sky-400" />
                Immutable Append-Only Audit Memory Log
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200">Change event logged: "Flooring material changed..."</span>
                  <span className="font-mono text-[10px] text-slate-400">10:42 AM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200">Impact analysis produced: 2 activities, 1 approval affected</span>
                  <span className="font-mono text-[10px] text-slate-400">10:42 AM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200">Auto-generated action: "Review impact: Flooring Material Order"</span>
                  <span className="font-mono text-[10px] text-slate-400">10:43 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800/80 bg-slate-950/90 py-10 px-6 backdrop-blur-2xl relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Automated BFS Traversal</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-sky-400 tracking-tight">0</div>
            <div className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Missed Dependencies</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-indigo-400 tracking-tight">Real-time</div>
            <div className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Approval Gating</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-purple-400 tracking-tight">Append-Only</div>
            <div className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-wider">Project Memory Audit</div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Multi-Stakeholder Construction Precision
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 max-w-2xl mx-auto leading-relaxed">
            Connect Architects, Designers, Contractors, Vendors, and Clients through a single intelligence graph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl hover:border-sky-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-sky-300 transition-colors">Dependency Graph Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Define directed edges between Activities and Approvals with built-in BFS cycle detection to ensure graph validity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-amber-300 transition-colors">Approval Sign-off Gating</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Automated blocking flags on downstream tasks when approvals transition to pending or rejected status.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-300 transition-colors">Immutable Project Memory</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Every change, decision, action, and resolution is permanently recorded in a searchable audit trail.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Zap className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">
              CIS • Coordination Intelligence System
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            © 2026 Coordination Intelligence System. Node.js, Express, MongoDB Atlas, Next.js & Tailwind CSS.
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

