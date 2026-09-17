import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No data available',
  message = 'There are no items to display at this time.',
  action
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-inner relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.15)] animate-float">
        <Inbox className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-extrabold text-slate-100 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed font-medium">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

