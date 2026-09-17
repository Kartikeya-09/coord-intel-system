import React, { useState } from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, Layers, Network, Lock, ShieldCheck } from 'lucide-react';

export default function DependencyGraph({ dependencies = [], affectedIds = [] }) {
  const [viewMode, setViewMode] = useState('canvas'); // 'canvas' | 'cards'
  const affectedSet = new Set(affectedIds.map((id) => id.toString()));

  if (!dependencies || dependencies.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-slate-400 text-xs">
        <Network className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="font-semibold">No dependency edges defined for this project yet.</p>
        <p className="text-[11px] text-slate-500 mt-1">Use the graph constructor form above to link activities and approvals.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* View Switcher Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Directed Graph Topology ({dependencies.length} Edge{dependencies.length > 1 ? 's' : ''})
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('canvas')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'canvas'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Visual Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'cards'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Edge List</span>
          </button>
        </div>
      </div>

      {viewMode === 'canvas' ? (
        /* Visual Graph Topology Canvas */
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-2xl overflow-x-auto relative">
          {/* Subtle Canvas Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

          <div className="relative flex flex-col gap-6 min-w-[650px] py-2">
            {dependencies.map((dep, index) => {
              const fromId = dep.fromEntity?._id?.toString() || dep.fromEntity?.toString();
              const toId = dep.toEntity?._id?.toString() || dep.toEntity?.toString();

              const isFromAffected = affectedSet.has(fromId);
              const isToAffected = affectedSet.has(toId);
              const isEdgeAffected = isFromAffected || isToAffected;

              const fromName = dep.fromEntity?.name || dep.fromEntity?.title || 'Upstream Entity';
              const toName = dep.toEntity?.name || dep.toEntity?.title || 'Downstream Entity';

              return (
                <div
                  key={dep._id || index}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative group flex items-center justify-between gap-4 ${
                    isEdgeAffected
                      ? 'bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-rose-950/40 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)]'
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Upstream Node Box */}
                  <div className="flex-1 min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md border shrink-0 ${
                          dep.fromModel === 'Activity'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {dep.fromModel}
                      </span>
                      <span
                        className={`text-xs font-bold truncate ${
                          isFromAffected ? 'text-rose-300' : 'text-slate-100'
                        }`}
                      >
                        {fromName}
                      </span>
                    </div>
                    {isFromAffected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        AFFECTED
                      </span>
                    )}
                  </div>

                  {/* Flow Arrow Connector */}
                  <div className="flex flex-col items-center justify-center shrink-0 px-2 group">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 font-mono">
                      {isEdgeAffected ? 'RISK PROPAGATION' : 'DEPENDS ON'}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`h-0.5 w-12 rounded-full transition-all ${
                        isEdgeAffected
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 animate-pulse'
                          : 'bg-gradient-to-r from-slate-700 to-sky-500 group-hover:from-sky-500 group-hover:to-indigo-500'
                      }`} />
                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                        isEdgeAffected ? 'text-rose-400' : 'text-sky-400'
                      }`} />
                    </div>
                  </div>

                  {/* Downstream Node Box */}
                  <div className="flex-1 min-w-0 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md border shrink-0 ${
                          dep.toModel === 'Activity'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}
                      >
                        {dep.toModel}
                      </span>
                      <span
                        className={`text-xs font-bold truncate ${
                          isToAffected ? 'text-rose-300' : 'text-slate-100'
                        }`}
                      >
                        {toName}
                      </span>
                    </div>
                    {isToAffected && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 animate-pulse">
                        <Lock className="w-3 h-3" />
                        BLOCKED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Edge Cards List Mode */
        <div className="flex flex-col gap-2.5">
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
                    className={`text-xs font-semibold ${
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
                    className={`text-xs font-semibold ${
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
      )}
    </div>
  );
}

