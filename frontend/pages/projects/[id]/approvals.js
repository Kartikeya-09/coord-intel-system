import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import StatusBadge from '../../../components/shared/StatusBadge';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import {
  getProjectApprovals,
  getProjectStakeholders,
  createApproval,
  updateApproval
} from '../../../lib/api';
import { FileCheck2, Plus, Check, X, Hourglass, User } from 'lucide-react';

export default function ApprovalsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [approvals, setApprovals] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Approval form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadData(activeFilter);
    }
  }, [id, activeFilter]);

  async function loadData(filterStatus = '') {
    try {
      setLoading(true);
      setError(null);

      const [apps, stks] = await Promise.all([
        getProjectApprovals(id, filterStatus),
        getProjectStakeholders(id)
      ]);

      setApprovals(apps || []);
      setStakeholders(stks || []);

      if (stks && stks.length > 0 && !owner) {
        setOwner(stks[0].stakeholder._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateApproval(e) {
    e.preventDefault();
    if (!title || !owner) {
      setError('Title and Owner are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createApproval({
        project: id,
        title,
        description,
        owner
      });

      setTitle('');
      setDescription('');
      await loadData(activeFilter);
    } catch (err) {
      setError(err.message || 'Failed to create approval');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(approvalId, newStatus) {
    try {
      setError(null);
      await updateApproval(approvalId, { status: newStatus });
      await loadData(activeFilter);
    } catch (err) {
      setError(err.message || 'Failed to update approval status');
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-sky-400" />
            Approvals & Sign-off Bottlenecks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track required approvals. Toggling approval status automatically updates downstream activity blocking flags.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 w-fit">
              {['', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeFilter === status
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status === '' ? 'All Approvals' : status}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
                <span>Loading approvals...</span>
              </div>
            ) : approvals.length === 0 ? (
              <EmptyState
                title="No approvals found"
                message="Create sign-off items using the form on the right."
              />
            ) : (
              <div className="flex flex-col gap-4">
                {approvals.map((app) => (
                  <div
                    key={app._id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-bold text-slate-100">{app.title}</h3>
                        <StatusBadge status={app.status} />
                      </div>
                      {app.description && (
                        <p className="text-xs text-slate-400 mb-2">{app.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <User className="w-3.5 h-3.5" />
                        <span>Owner: <strong className="text-slate-200">{app.owner?.name || 'Unassigned'}</strong> ({app.owner?.role})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {app.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                      {app.status !== 'pending' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'pending')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                        >
                          <Hourglass className="w-3.5 h-3.5" />
                          Set Pending
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl sticky top-24">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-sky-400" />
                New Approval Item
              </h3>

              <form onSubmit={handleCreateApproval} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Approval Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g. Budget Approval for Materials"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Owner *
                  </label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    required
                  >
                    <option value="">Select Stakeholder</option>
                    {stakeholders.map((stk) => (
                      <option key={stk.stakeholder._id} value={stk.stakeholder._id}>
                        {stk.stakeholder.name} ({stk.stakeholder.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="Sign-off details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
                >
                  {submitting ? 'Creating...' : 'Create Approval'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
