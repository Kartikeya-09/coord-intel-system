import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DependencyGraph({ dependencies = [], affectedIds = [] }) {
  const affectedSet = new Set(affectedIds.map((id) => id.toString()));

  if (!dependencies || dependencies.length === 0) {
    return <p className="text-xs text-slate-400">No dependency edges defined.</p>;
  }

  return (
    <div className="flex flex-col gap-2.5 mt-2">
      {dependencies.map((dep) => {
        const fromId = dep.fromEntity?._id?.toString() || dep.fromEntity?.toString();
        const toId = dep.toEntity?._id?.toString() || dep.toEntity?.toString();

        const isFromAffected = affectedSet.has(fromId);
        const isToAffected = affectedSet.has(toId);
        const isEdgeAffected = isFromAffected || isToAffected;

        return (
          <div
            key={dep._id}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              isEdgeAffected
                ? 'bg-rose-500/10 border-rose-500/30 shadow-lg shadow-rose-500/5'
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-slate-800 text-slate-400 rounded-md border border-slate-700">
                {dep.fromModel}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isFromAffected ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {dep.fromEntity?.name || dep.fromEntity?.title || dep.fromEntity}
              </span>
              {isFromAffected && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            </div>

            <div className="flex items-center gap-2 px-3">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                depends on
              </span>
              <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
            </div>

            <div className="flex items-center gap-2.5">
              {isToAffected && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
              <span
                className={`text-sm font-semibold ${
                  isToAffected ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {dep.toEntity?.name || dep.toEntity?.title || dep.toEntity}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-slate-800 text-slate-400 rounded-md border border-slate-700">
                {dep.toModel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
