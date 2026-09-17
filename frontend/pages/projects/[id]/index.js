import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProjectNav from '../../../components/layout/ProjectNav';
import StatCard from '../../../components/dashboard/StatCard';
import RecentMemoryList from '../../../components/dashboard/RecentMemoryList';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import {
  getProject,
  getProjectActions,
  getProjectApprovals,
  getProjectMemory
} from '../../../lib/api';
import { Zap, Hand, Users, History, Activity, GitPullRequest, Plus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProjectDashboard() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState(null);
  const [openActionsCount, setOpenActionsCount] = useState(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [recentMemory, setRecentMemory] = useState([]);
  const [stakeholdersCount, setStakeholdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadDashboardData();
    }
  }, [id]);

  async function loadDashboardData() {
    setLoading(true);
    setError(null);

    try {
      const projData = await getProject(id);
      setProject(projData);
      setStakeholdersCount(projData.stakeholders ? projData.stakeholders.length : 0);
    } catch (err) {
      setError(`Failed to load project details: ${err.message}`);
    }

    try {
      const actionsData = await getProjectActions(id);
      let count = 0;
      Object.values(actionsData).forEach((group) => {
        count += group.actions ? group.actions.length : 0;
      });
      setOpenActionsCount(count);
    } catch (err) {
      console.error('Failed to load actions:', err);
    }

    try {
      const approvalsData = await getProjectApprovals(id, 'pending');
      setPendingApprovalsCount(approvalsData ? approvalsData.length : 0);
    } catch (err) {
      console.error('Failed to load approvals:', err);
    }

    try {
      const memoryData = await getProjectMemory(id);
      setRecentMemory(memoryData || []);
    } catch (err) {
      console.error('Failed to load project memory:', err);
    }

    setLoading(false);
  }

  if (loading && !project) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        <ProjectNav projectId={id} />
        <main className="flex-1 p-8 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading project intelligence dashboard...</span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl w-full">
        {/* Header with Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {project ? project.name : 'Project Dashboard'}
              </h1>
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-full shadow-sm">
                {project?.phase || 'Active Construction'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Client Account: <strong className="text-slate-200 font-bold">{project?.client?.name || 'N/A'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/projects/${id}/changes`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Log Change Event</span>
            </Link>
            <Link
              href={`/projects/${id}/activities`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-200 hover:text-white transition-all"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add Activity</span>
            </Link>
          </div>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Open Actions" value={openActionsCount} icon={Zap} color="sky" subtitle="Pending team items" />
          <StatCard title="Pending Approvals" value={pendingApprovalsCount} icon={Hand} color="amber" subtitle="Sign-off bottlenecks" />
          <StatCard title="Stakeholders" value={stakeholdersCount} icon={Users} color="emerald" subtitle="Active team members" />
          <StatCard title="Memory Entries" value={recentMemory.length} icon={History} color="purple" subtitle="Immutable audit events" />
        </div>

        {/* Project Health & Recent Memory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-sky-400" />
                Recent Project Memory Events
              </h2>
              <Link href={`/projects/${id}/memory`} className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1">
                <span>View Full Audit Log</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <RecentMemoryList memoryEntries={recentMemory} />
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col gap-5">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Coordination Intelligence Status
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">BFS Graph Traversal</span>
                <span className="font-extrabold text-emerald-400 uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cycle Detection</span>
                <span className="font-extrabold text-emerald-400 uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  NO CYCLES
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sign-off Gate Flags</span>
                <span className="font-extrabold text-amber-400 uppercase text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  MONITORING
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 text-xs">
              <div className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Quick Tip</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Log any material change or scope revision under <strong>Change Events</strong> to let CIS automatically trace affected tasks and notify assigned stakeholders.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

