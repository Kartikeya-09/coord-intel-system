import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
import { Zap, Hand, Users, History, Activity } from 'lucide-react';

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
      <div className="flex">
        <ProjectNav projectId={id} />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center p-12 text-slate-400">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading dashboard data...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {project ? project.name : 'Project Dashboard'}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
              {project?.phase || 'Active'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Client: <strong className="text-slate-200">{project?.client?.name || 'N/A'}</strong>
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Open Actions" value={openActionsCount} icon={Zap} color="sky" />
          <StatCard title="Pending Approvals" value={pendingApprovalsCount} icon={Hand} color="amber" />
          <StatCard title="Stakeholders" value={stakeholdersCount} icon={Users} color="emerald" />
          <StatCard title="Memory Entries" value={recentMemory.length} icon={History} color="purple" />
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              Recent Project Memory Events
            </h2>
            <span className="text-xs text-slate-400">Real-time audit log</span>
          </div>
          <RecentMemoryList memoryEntries={recentMemory} />
        </div>
      </main>
    </div>
  );
}
