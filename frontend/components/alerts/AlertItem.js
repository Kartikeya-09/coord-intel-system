import React from 'react';
import { Bell, Check, GitCommit, AlertTriangle } from 'lucide-react';

export default function AlertItem({ alert, onMarkRead }) {
  if (!alert) return null;

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
        alert.isRead
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-gradient-to-r from-sky-500/10 via-slate-900/80 to-slate-900/80 border-sky-500/30 shadow-xl shadow-sky-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div
            className={`p-2 rounded-xl ${
              alert.isRead
                ? 'bg-slate-800 text-slate-400'
                : 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
            }`}
          >
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
            Impact Alert Notification
          </span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(alert.createdAt).toLocaleString()}
          </span>
        </div>

        {!alert.isRead && onMarkRead && (
          <button
            onClick={() => onMarkRead(alert._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition-all shadow-sm shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            Mark Read
          </button>
        )}
      </div>

      <h3 className="text-base font-extrabold text-slate-100 mb-2 leading-snug">
        Change Event: <span className="text-sky-300 font-bold">"{alert.changeEventName}"</span>
      </h3>

      <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
        <span>Affected Entity:</span>
        <strong className="text-slate-100 font-bold">{alert.affectedEntity?.name}</strong>
        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
          {alert.affectedEntity?.model}
        </span>
      </div>

      {alert.reasoningChain && alert.reasoningChain.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs shadow-inner">
          <div className="flex items-center gap-2 text-slate-300 font-extrabold uppercase tracking-wider text-[10px] mb-2.5">
            <GitCommit className="w-3.5 h-3.5 text-sky-400" />
            <span>Traversal Reasoning Path</span>
          </div>
          <div className="flex flex-col gap-1.5 text-slate-300">
            {alert.reasoningChain.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span className="font-mono text-[11px] text-slate-300">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

