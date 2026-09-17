import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createProject, createStakeholder } from '../../lib/api';
import ErrorBanner from '../../components/shared/ErrorBanner';
import { FolderPlus, ArrowLeft, Check, Sparkles, Calendar, User, Zap } from 'lucide-react';
import Link from 'next/link';

export default function NewProject() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [phase, setPhase] = useState('Construction');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !clientName) {
      setError('Project Name and Client Name are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 1. Create Client Stakeholder
      const client = await createStakeholder({
        name: clientName,
        role: 'client',
        contact: { email: clientEmail }
      });

      // 2. Create Project
      const project = await createProject({
        name,
        client: client._id,
        phase,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      router.push(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 w-full">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects Workspace</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Project Initializer</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Initialize New Project Container
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
          Set up a new project space and bind its primary client account for coordination intelligence tracking.
        </p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="e.g. Patel Residence Fit-Out"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="e.g. Maya Patel"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Client Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="e.g. maya.patel@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Project Phase
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
            >
              <option value="Concept">Concept</option>
              <option value="Design Revision">Design Revision</option>
              <option value="Procurement">Procurement</option>
              <option value="Construction">Construction</option>
              <option value="Handover">Handover</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Target End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-xl shadow-sky-500/20 transition-all duration-200"
            >
              {submitting ? (
                <span>Initializing Project...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Initialize Project</span>
                </>
              )}
            </button>
            <Link
              href="/projects"
              className="px-5 py-3.5 rounded-2xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-2 sticky top-24">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Live Card Preview</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-sky-500/40 shadow-2xl shadow-sky-500/10 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-full">
                  {phase || 'Construction'}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  Today
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white mb-3">
                {name || 'Patel Residence Fit-Out'}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Client: <strong className="text-slate-100 font-bold">{clientName || 'Maya Patel'}</strong></span>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400">
                <span>Control Dashboard</span>
                <span>➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

