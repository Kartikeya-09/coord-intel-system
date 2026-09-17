import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let colorConfig = {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
  };

  if (['complete', 'approved', 'done'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
    };
  } else if (['blocked', 'rejected'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)] animate-pulse'
    };
  } else if (['in-progress'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] animate-pulse'
    };
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border uppercase ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.dot}`} />
      <span>{status}</span>
    </span>
  );
}

