import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'sky' }) {
  const colorMap = {
    sky: {
      border: 'border-sky-500/20',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      glow: 'shadow-sky-500/5'
    },
    amber: {
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/5'
    },
    emerald: {
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/5'
    },
    purple: {
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/5'
    }
  };

  const activeColor = colorMap[color] || colorMap.sky;

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border ${activeColor.border} backdrop-blur-xl flex items-center justify-between shadow-xl ${activeColor.glow} hover:border-slate-700 transition-all duration-200 group`}
    >
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left">
          {value}
        </div>
      </div>

      <div className={`w-12 h-12 rounded-xl ${activeColor.bg} border ${activeColor.border} flex items-center justify-center ${activeColor.text}`}>
        {typeof Icon === 'function' || typeof Icon === 'object' ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span className="text-xl">{Icon}</span>
        )}
      </div>
    </div>
  );
}
