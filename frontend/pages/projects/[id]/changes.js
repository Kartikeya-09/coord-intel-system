import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import ImpactSummary from '../../../components/impact/ImpactSummary';
import ReasoningChain from '../../../components/impact/ReasoningChain';
import {
  getChangeEvents,
  getProjectActivities,
  getProjectApprovals,
  getProjectStakeholders,
  createChangeEvent
} from '../../../lib/api';
import { GitPullRequest, Zap, ChevronDown, ChevronUp, User, Clock, CheckSquare } from 'lucide-react';

export default function ChangesPage() {
  const router = useRouter();
  const { id } = router.query;

  const [changeEvents, setChangeEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [type, setType] = useState('material change');
  const [description, setDescription] = useState('');
  const [sourceStakeholder, setSourceStakeholder] = useState('');
  const [selectedLinkedEntities, setSelectedLinkedEntities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [events, acts, apps, stks] = await Promise.all([
        getChangeEvents(id),
        getProjectActivities(id),
        getProjectApprovals(id),
        getProjectStakeholders(id)
      ]);

      setChangeEvents(events || []);
      setActivities(acts || []);
      setApprovals(apps || []);
      setStakeholders(stks || []);

      if (stks && stks.length > 0 && !sourceStakeholder) {
        setSourceStakeholder(stks[0].stakeholder._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load change events');
    } finally {
      setLoading(false);
    }
  }

  function toggleLinkedEntity(entityId, model) {
    setSelectedLinkedEntities((prev) => {
      const exists = prev.some((e) => e.entity === entityId);
      if (exists) {
        return prev.filter((e) => e.entity !== entityId);
      } else {
        return [...prev, { entity: entityId, model }];
      }
    });
  }

  async function handleLogChange(e) {
    e.preventDefault();
    if (!description || !sourceStakeholder) {
      setError('Description and Source Stakeholder are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const created = await createChangeEvent({
        project: id,
        type,
        description,
        sourceStakeholder,
        linkedEntities: selectedLinkedEntities
      });

      setDescription('');
      setSelectedLinkedEntities([]);
      setExpandedEventId(created._id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to log change event');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <GitPullRequest className="w-7 h-7 text-sky-400" />
            Change Events & Impact Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Log change events to trigger automatic BFS dependency traversal and produce impact reasoning chains.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-base font-bold text-white mb-4">Logged Change Events</h2>

            {loading ? (
              <div className="flex items-center justify-center p-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
                <span>Loading change events...</span>
              </div>
            ) : changeEvents.length === 0 ? (
              <EmptyState
                title="No change events logged"
                message="Log a change event using the form on the right to trigger automatic BFS analysis."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {changeEvents.map((evt) => {
                  const isExpanded = expandedEventId === evt._id;
                  const impact = evt.impactResult;

                  return (
                    <div
                      key={evt._id}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                            {evt.type}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedEventId(isExpanded ? null : evt._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Impact' : 'View Impact Analysis'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-slate-100 mb-2">
                        {evt.description}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Source: <strong className="text-slate-200">{evt.sourceStakeholder?.name || 'Unknown'}</strong> ({evt.sourceStakeholder?.role})</span>
                      </div>

                      {isExpanded && impact && (
                        <div className="mt-5 pt-5 border-t border-slate-800">
                          <ImpactSummary impactResult={impact} />
                          <ReasoningChain reasoningChains={impact.reasoningChains} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl sticky top-24">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                Log Change Event
              </h3>

              <form onSubmit={handleLogChange} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Change Type *
                  </label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="material change">Material Change</option>
                    <option value="design revision">Design Revision</option>
                    <option value="scope change">Scope Change</option>
                    <option value="delay">Delay</option>
                    <option value="issue">Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Source Stakeholder *
                  </label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={sourceStakeholder}
                    onChange={(e) => setSourceStakeholder(e.target.value)}
                    required
                  >
                    <option value="">Select Stakeholder</option>
                    {stakeholders.map((stk) => (
                      <option key={stk.stakeholder._id} value={stk.stakeholder._id}>
                        {stk.stakeholder.name} ({stk.stakeholder.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description *
                  </label>
                  <textarea
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="Describe what has altered..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Linked Entities (Direct Impact Seeds)
                  </label>
                  <div className="max-h-48 overflow-y-auto rounded-xl bg-slate-950 border border-slate-800 p-3 flex flex-col gap-2">
                    <div className="text-[10px] font-extrabold uppercase text-slate-400">ACTIVITIES</div>
                    {activities.map((act) => {
                      const isSelected = selectedLinkedEntities.some((e) => e.entity === act._id);
                      return (
                        <label key={act._id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                            checked={isSelected}
                            onChange={() => toggleLinkedEntity(act._id, 'Activity')}
                          />
                          <span>{act.name}</span>
                        </label>
                      );
                    })}

                    <div className="text-[10px] font-extrabold uppercase text-slate-400 mt-2">APPROVALS</div>
                    {approvals.map((app) => {
                      const isSelected = selectedLinkedEntities.some((e) => e.entity === app._id);
                      return (
                        <label key={app._id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                            checked={isSelected}
                            onChange={() => toggleLinkedEntity(app._id, 'Approval')}
                          />
                          <span>{app.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-lg shadow-amber-500/20 transition-all duration-200"
                >
                  {submitting ? 'Analyzing & Logging...' : '⚡ Log Change & Run BFS Analysis'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
