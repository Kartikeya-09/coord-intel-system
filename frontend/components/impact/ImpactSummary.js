import React from 'react';
import { Activity, FileCheck, Users, Zap } from 'lucide-react';

export default function ImpactSummary({ impactResult }) {
  if (!impactResult) return null;

  const actCount = impactResult.affectedActivities ? impactResult.affectedActivities.length : 0;
  const appCount = impactResult.affectedApprovals ? impactResult.affectedApprovals.length : 0;
  const stkCount = impactResult.affectedStakeholders ? impactResult.affectedStakeholders.length : 0;

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 backdrop-blur-xl mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
        <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">
          Impact Traversal Analysis Summary
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Affected Activities</div>
            <div className="text-lg font-bold text-slate-100">{actCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Affected Approvals</div>
            <div className="text-lg font-bold text-slate-100">{appCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Affected Stakeholders</div>
            <div className="text-lg font-bold text-slate-100">{stkCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
