import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No data available',
  message = 'There are no items to display at this time.'
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-4 text-slate-400">
        <Inbox className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">{message}</p>
    </div>
  );
}
