import React from 'react';
import EmptyState from '../shared/EmptyState';
import {
  GitPullRequest,
  Cpu,
  Zap,
  CheckCircle2,
  FileCheck2,
  History
} from 'lucide-react';

const EVENT_ICONS = {
  change_event_created: { icon: GitPullRequest, color: 'text-sky-400 bg-sky-500/15 border-sky-500/30' },
  impact_result_produced: { icon: Cpu, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
  action_created: { icon: Zap, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
  action_completed: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  approval_status_changed: { icon: FileCheck2, color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30' }
};

export default function RecentMemoryList({ memoryEntries = [] }) {
  if (!memoryEntries || memoryEntries.length === 0) {
    return (
      <EmptyState
        title="No recent project memory"
        message="Events logged on this project will appear here automatically."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {memoryEntries.slice(0, 5).map((entry, idx) => {
        const config = EVENT_ICONS[entry.eventType] || { icon: History, color: 'text-slate-400 bg-slate-800 border-slate-700' };
        const Icon = config.icon;

        return (
          <div
            key={entry._id || idx}
            className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm hover:shadow-md group"
          >
            <div className={`p-2.5 rounded-xl border ${config.color} shrink-0 group-hover:scale-105 transition-transform`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-100 leading-relaxed group-hover:text-sky-300 transition-colors">
                {entry.summary}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  {entry.eventType}
                </span>
                <span>•</span>
                <span>Actor: <strong className="text-slate-300 font-bold">{entry.actor?.ref?.name || entry.actor?.type || 'System'}</strong></span>
                <span>•</span>
                <span className="font-mono text-slate-500">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

