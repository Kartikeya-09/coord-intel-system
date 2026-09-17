import React from 'react';
import { Bell, Check, GitCommit } from 'lucide-react';

export default function AlertItem({ alert, onMarkRead }) {
  if (!alert) return null;

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
        alert.isRead
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-sky-500/5 border-sky-500/30 shadow-lg shadow-sky-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              alert.isRead ? 'bg-slate-800 text-slate-400' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}
          >
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Impact Alert Notification
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">
            {new Date(alert.createdAt).toLocaleString()}
          </span>
        </div>

        {!alert.isRead && onMarkRead && (
          <button
            onClick={() => onMarkRead(alert._id)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Mark Read
          </button>
        )}
      </div>

      <h3 className="text-base font-bold text-slate-100 mb-1">
        Change Event: "{alert.changeEventName}"
      </h3>

      <p className="text-xs text-slate-400 mb-3">
        Affected Entity:{' '}
        <strong className="text-slate-200">{alert.affectedEntity?.name}</strong>{' '}
        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700 ml-1">
          {alert.affectedEntity?.model}
        </span>
      </p>

      {alert.reasoningChain && alert.reasoningChain.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-2">
            <GitCommit className="w-3.5 h-3.5 text-sky-400" />
            Traversal Reasoning Path
          </div>
          <div className="flex flex-col gap-1 text-slate-300">
            {alert.reasoningChain.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
