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
  X
} from 'lucide-react';

const EVENT_ICONS = {
  change_event_created: { icon: GitPullRequest, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  impact_result_produced: { icon: Cpu, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  action_created: { icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  action_completed: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  approval_status_changed: { icon: FileCheck2, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' }
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

      <main className="flex-1 p-8 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-7 h-7 text-sky-400" />
            Project Memory (Immutable Log)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Append-only chronological audit trail of all project changes, decisions, actions, and resolutions.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl mb-6 flex flex-col gap-4">
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
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-white transition-colors"
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

          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800/80">
            {EVENT_TYPES.map((et) => (
              <button
                key={et.value}
                onClick={() => setActiveType(et.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeType === et.value
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading memory log timeline...</span>
          </div>
        ) : memoryEntries.length === 0 ? (
          <EmptyState
            title="No memory entries found"
            message="No events match your current filter or keyword search criteria."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {memoryEntries.map((entry) => {
              const config = EVENT_ICONS[entry.eventType] || { icon: History, color: 'text-slate-400 bg-slate-800 border-slate-700' };
              const Icon = config.icon;

              return (
                <div
                  key={entry._id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex items-start gap-4 hover:border-slate-700 transition-all"
                >
                  <div className={`p-2.5 rounded-xl border ${config.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 leading-snug">
                      {entry.summary}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {entry.eventType}
                      </span>
                      <span>•</span>
                      <span>Actor: <strong className="text-slate-200">{entry.actor?.ref?.name || entry.actor?.type || 'System'}</strong></span>
                      <span>•</span>
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
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
