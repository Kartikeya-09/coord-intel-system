import React from 'react';
import { ArrowRight, GitCommit, Layers, AlertCircle } from 'lucide-react';

export default function ReasoningChain({ reasoningChains = [] }) {
  if (!reasoningChains || reasoningChains.length === 0) {
    return <p className="text-xs text-slate-400">No downstream impact chains identified.</p>;
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-sky-400" />
          <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Impact Traversal Reasoning Paths ({reasoningChains.length})
          </h5>
        </div>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Multi-Hop Propagation</span>
      </div>

      <div className="flex flex-col gap-3">
        {reasoningChains.map((chain, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-lg flex flex-col gap-3.5 hover:border-slate-700/80 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)] animate-pulse" />
                <span className="text-sm font-bold text-slate-100">
                  Target Impact: <span className="text-rose-300">{chain.name}</span>
                </span>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-slate-300 rounded-md border border-slate-700">
                {chain.model}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              {chain.steps &&
                chain.steps.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-mono text-[10px] font-extrabold flex items-center justify-center border border-slate-700">
                        {sIdx + 1}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {step.fromModel}
                      </span>
                      <span className="font-bold text-slate-200">{step.fromName}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />

                    {sIdx === chain.steps.length - 1 && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold shadow-sm shadow-rose-500/5">
                        <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 font-mono text-[10px] font-extrabold flex items-center justify-center border border-rose-500/40">
                          {sIdx + 2}
                        </span>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
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
    </div>
  );
}

