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
  change_event_created: { icon: GitPullRequest, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
  impact_result_produced: { icon: Cpu, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  action_created: { icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  action_completed: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  approval_status_changed: { icon: FileCheck2, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' }
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
    <div className="flex flex-col gap-3">
      {memoryEntries.slice(0, 3).map((entry) => {
        const config = EVENT_ICONS[entry.eventType] || { icon: History, color: 'text-slate-400 bg-slate-800 border-slate-700' };
        const Icon = config.icon;

        return (
          <div
            key={entry._id}
            className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-all"
          >
            <div className={`p-2.5 rounded-xl border ${config.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 leading-snug">
                {entry.summary}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                <span>•</span>
                <span className="font-semibold text-slate-400">
                  {entry.actor?.ref?.name || entry.actor?.type || 'System'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
