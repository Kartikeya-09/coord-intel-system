import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createProject, createStakeholder } from '../../lib/api';
import ErrorBanner from '../../components/shared/ErrorBanner';
import { FolderPlus, ArrowLeft, Check } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderPlus className="w-7 h-7 text-sky-400" />
          Create New Project
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Initialize a project container and set up its primary client account.
        </p>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Project Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              placeholder="e.g. client@example.com"
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
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
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
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
          >
            {submitting ? (
              <span>Creating...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Initialize Project</span>
              </>
            )}
          </button>
          <Link
            href="/projects"
            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
