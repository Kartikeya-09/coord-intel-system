import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  let colorConfig = {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400'
  };

  if (['complete', 'approved', 'done'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      dot: 'bg-emerald-400'
    };
  } else if (['blocked', 'rejected'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      dot: 'bg-rose-400'
    };
  } else if (['in-progress'].includes(normalized)) {
    colorConfig = {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/20',
      dot: 'bg-sky-400'
    };
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border uppercase ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.dot}`} />
      {status}
    </span>
  );
}
