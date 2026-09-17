import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'sky', subtitle }) {
  const colorMap = {
    sky: {
      border: 'border-sky-500/20 hover:border-sky-500/40',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      glow: 'shadow-[0_0_20px_rgba(14,165,233,0.1)] hover:shadow-[0_0_25px_rgba(14,165,233,0.2)]'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
    }
  };

  const activeColor = colorMap[color] || colorMap.sky;

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border ${activeColor.border} backdrop-blur-xl flex items-center justify-between shadow-xl ${activeColor.glow} transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden`}
    >
      <div>
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="text-3xl font-extrabold text-white mt-1 group-hover:scale-105 transition-transform origin-left tracking-tight">
          {value}
        </div>
        {subtitle && (
          <div className="text-[10px] text-slate-500 font-medium mt-1">
            {subtitle}
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl ${activeColor.bg} border ${activeColor.border} flex items-center justify-center ${activeColor.text} shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
        {typeof Icon === 'function' || typeof Icon === 'object' ? (
          <Icon className="w-6 h-6" />
        ) : (
          <span className="text-xl">{Icon}</span>
        )}
      </div>
    </div>
  );
}

