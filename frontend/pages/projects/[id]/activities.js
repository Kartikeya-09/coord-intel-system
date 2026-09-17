import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import StatusBadge from '../../../components/shared/StatusBadge';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import DependencyGraph from '../../../components/impact/DependencyGraph';
import {
  getProjectActivities,
  getProjectStakeholders,
  getProjectApprovals,
  getDependencies,
  createActivity,
  createDependency
} from '../../../lib/api';
import { GitFork, Plus, Lock, Calendar, User, Network, Sparkles } from 'lucide-react';

export default function ActivitiesPage() {
  const router = useRouter();
  const { id } = router.query;

  const [activities, setActivities] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Activity form state
  const [actName, setActName] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actOwner, setActOwner] = useState('');
  const [actDueDate, setActDueDate] = useState('');

  // New Dependency form state
  const [fromModel, setFromModel] = useState('Activity');
  const [fromEntity, setFromEntity] = useState('');
  const [toModel, setToModel] = useState('Activity');
  const [toEntity, setToEntity] = useState('');

  const [submittingAct, setSubmittingAct] = useState(false);
  const [submittingDep, setSubmittingDep] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [acts, stks, apps, deps] = await Promise.all([
        getProjectActivities(id),
        getProjectStakeholders(id),
        getProjectApprovals(id),
        getDependencies(id)
      ]);

      setActivities(acts || []);
      setApprovals(apps || []);
      setStakeholders(stks || []);
      setDependencies(deps || []);

      if (stks && stks.length > 0 && !actOwner) {
        setActOwner(stks[0].stakeholder._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load page data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateActivity(e) {
    e.preventDefault();
    if (!actName || !actOwner) {
      setError('Activity Name and Owner are required.');
      return;
    }

    try {
      setSubmittingAct(true);
      setError(null);
      await createActivity({
        project: id,
        name: actName,
        description: actDesc,
        owner: actOwner,
        dueDate: actDueDate || undefined
      });

      setActName('');
      setActDesc('');
      setActDueDate('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create activity');
    } finally {
      setSubmittingAct(false);
    }
  }

  async function handleCreateDependency(e) {
    e.preventDefault();
    if (!fromEntity || !toEntity) {
      setError('Please select both upstream and downstream entities.');
      return;
    }

    try {
      setSubmittingDep(true);
      setError(null);
      await createDependency({
        project: id,
        fromEntity,
        fromModel,
        toEntity,
        toModel
      });

      setFromEntity('');
      setToEntity('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create dependency');
    } finally {
      setSubmittingDep(false);
    }
  }

  const fromOptions = fromModel === 'Activity' ? activities : approvals;
  const toOptions = toModel === 'Activity' ? activities : approvals;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GitFork className="w-3.5 h-3.5" />
            <span>Project Tasks & Topology</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Activities & Dependency Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Track activities, assign owners, and construct directed dependency graph edges between tasks and approvals.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-base font-extrabold text-white mb-4">Activities List ({activities.length})</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
                <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Loading activities...</span>
              </div>
            ) : activities.length === 0 ? (
              <EmptyState title="No activities created" message="Create your first activity using the form on the right." />
            ) : (
              <div className="overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/90 border-b border-slate-800/90 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="p-4">Activity Name</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {activities.map((act) => (
                      <tr key={act._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-100">{act.name}</span>
                            {act.isBlocked && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                                <Lock className="w-3 h-3" />
                                BLOCKED
                              </span>
                            )}
                          </div>
                          {act.description && (
                            <div className="text-[11px] text-slate-400 font-normal mt-0.5">{act.description}</div>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-slate-300">
                          {act.owner?.name || 'Unassigned'}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={act.status} />
                        </td>
                        <td className="p-4 text-slate-400 font-mono">
                          {act.dueDate ? new Date(act.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl sticky top-24">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-sky-400" />
                New Activity
              </h3>

              <form onSubmit={handleCreateActivity} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g. Flooring Material Order"
                    value={actName}
                    onChange={(e) => setActName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Owner *
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={actOwner}
                    onChange={(e) => setActOwner(e.target.value)}
                    required
                  >
                    <option value="">Select Stakeholder</option>
                    {stakeholders.map((entry) => (
                      <option key={entry.stakeholder._id} value={entry.stakeholder._id}>
                        {entry.stakeholder.name} ({entry.stakeholder.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="Task details..."
                    value={actDesc}
                    onChange={(e) => setActDesc(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={actDueDate}
                    onChange={(e) => setActDueDate(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAct}
                  className="w-full mt-2 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
                >
                  {submittingAct ? 'Creating...' : 'Create Activity'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Dependency Graph Constructor Section */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-sky-400 mb-1">
            <Network className="w-4 h-4" />
            <span>Graph Builder</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">
            Dependency Edge Constructor
          </h2>
          <p className="text-xs text-slate-400 mb-6 font-normal">
            Connect directed relationships (Upstream → Downstream). Allowed pairs: Activity → Activity, Activity → Approval, Approval → Activity.
          </p>

          <form onSubmit={handleCreateDependency} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end mb-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">From Type</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                value={fromModel}
                onChange={(e) => { setFromModel(e.target.value); setFromEntity(''); }}
              >
                <option value="Activity">Activity</option>
                <option value="Approval">Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Upstream Entity</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                value={fromEntity}
                onChange={(e) => setFromEntity(e.target.value)}
                required
              >
                <option value="">Select Upstream</option>
                {fromOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name || item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">To Type</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                value={toModel}
                onChange={(e) => { setToModel(e.target.value); setToEntity(''); }}
              >
                <option value="Activity">Activity</option>
                <option value="Approval">Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Downstream Entity</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                value={toEntity}
                onChange={(e) => setToEntity(e.target.value)}
                required
              >
                <option value="">Select Downstream</option>
                {toOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name || item.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submittingDep}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
            >
              {submittingDep ? 'Adding...' : '+ Add Directed Edge'}
            </button>
          </form>

          <DependencyGraph dependencies={dependencies} />
        </div>
      </main>
    </div>
  );
}

