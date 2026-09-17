import React from 'react';
import { ArrowRight, GitCommit } from 'lucide-react';

export default function ReasoningChain({ reasoningChains = [] }) {
  if (!reasoningChains || reasoningChains.length === 0) {
    return <p className="text-xs text-slate-400">No downstream impact chains identified.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-2">
        <GitCommit className="w-4 h-4 text-sky-400" />
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Reasoning Chains ({reasoningChains.length})
        </h5>
      </div>

      {reasoningChains.map((chain, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-200">
              Target Impact: {chain.name}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-400 rounded-md border border-slate-700">
              {chain.model}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {chain.steps &&
              chain.steps.map((step, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200">
                    <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-slate-700 text-slate-300">
                      {step.fromModel}
                    </span>
                    <span className="font-semibold">{step.fromName}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />

                  {sIdx === chain.steps.length - 1 && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold">
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-500/20 text-rose-300">
                        {step.toModel}
                      </span>
                      <span>{step.toName}</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
