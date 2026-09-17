import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import { getProjectMemory } from '../../../lib/api';
import {
  History,
  Search,
  GitPullRequest,
  Cpu,
  Zap,
  CheckCircle2,
  FileCheck2,
  X,
  Clock,
  Sparkles
} from 'lucide-react';

const EVENT_ICONS = {
  change_event_created: { icon: GitPullRequest, color: 'text-sky-400 bg-sky-500/15 border-sky-500/30 shadow-[0_0_12px_rgba(14,165,233,0.2)]' },
  impact_result_produced: { icon: Cpu, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]' },
  action_created: { icon: Zap, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]' },
  action_completed: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]' },
  approval_status_changed: { icon: FileCheck2, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]' }
};

const EVENT_TYPES = [
  { label: 'All Events', value: '' },
  { label: 'Change Created', value: 'change_event_created' },
  { label: 'Impact Produced', value: 'impact_result_produced' },
  { label: 'Action Created', value: 'action_created' },
  { label: 'Action Completed', value: 'action_completed' },
  { label: 'Approval Changed', value: 'approval_status_changed' }
];

export default function MemoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [memoryEntries, setMemoryEntries] = useState([]);
  const [activeType, setActiveType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadMemory();
    }
  }, [id, activeType]);

  async function loadMemory(query = searchQuery) {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeType) params.type = activeType;
      if (query) params.q = query;

      const data = await getProjectMemory(id, params);
      setMemoryEntries(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load project memory');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadMemory(searchQuery);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-5xl w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Immutable Audit Trail</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Project Memory Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Append-only chronological audit trail recording every change event, BFS impact analysis, action dispatch, and sign-off resolution.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-8 flex flex-col gap-4 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="Search project memory log by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors shadow-md shadow-sky-500/20"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  loadMemory('');
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-800/80">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => setActiveType(et.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeType === et.value
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-950 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
            <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Loading memory log timeline...</span>
          </div>
        ) : memoryEntries.length === 0 ? (
          <EmptyState
            title="No memory entries found"
            message="No events match your current filter or keyword search criteria."
          />
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-indigo-500 before:to-slate-800">
            {memoryEntries.map((entry, idx) => {
              const config = EVENT_ICONS[entry.eventType] || { icon: History, color: 'text-slate-400 bg-slate-800 border-slate-700' };
              const Icon = config.icon;

              return (
                <div
                  key={entry._id || idx}
                  className="relative flex items-start gap-4 p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700/80 transition-all shadow-xl group"
                >
                  <div className={`p-2.5 rounded-2xl border ${config.color} shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-100 leading-snug group-hover:text-sky-300 transition-colors">
                      {entry.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400 flex-wrap">
                      <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 font-extrabold">
                        {entry.eventType}
                      </span>
                      <span>•</span>
                      <span>Actor: <strong className="text-slate-200 font-bold">{entry.actor?.ref?.name || entry.actor?.type || 'System'}</strong></span>
                      <span>•</span>
                      <span className="font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

