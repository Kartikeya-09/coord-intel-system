import React from 'react';
import { Activity, FileCheck, Users, Zap, AlertTriangle } from 'lucide-react';

export default function ImpactSummary({ impactResult }) {
  if (!impactResult) return null;

  const actCount = impactResult.affectedActivities ? impactResult.affectedActivities.length : 0;
  const appCount = impactResult.affectedApprovals ? impactResult.affectedApprovals.length : 0;
  const stkCount = impactResult.affectedStakeholders ? impactResult.affectedStakeholders.length : 0;
  const totalImpact = actCount + appCount + stkCount;

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 backdrop-blur-2xl mb-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Zap className="w-5 h-5 fill-amber-300/30" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span>Impact Traversal Analysis Summary</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold">
                BFS COMPLETED
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium">Automatic ripple propagation detected {totalImpact} total affected entities</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm hover:border-sky-500/30 transition-all">
          <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Affected Activities</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{actCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm hover:border-purple-500/30 transition-all">
          <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Affected Approvals</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{appCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm hover:border-rose-500/30 transition-all">
          <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">Affected Stakeholders</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{stkCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

