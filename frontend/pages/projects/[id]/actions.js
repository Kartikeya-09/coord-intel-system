import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import ActionCard from '../../../components/actions/ActionCard';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import {
  getProjectActions,
  getProjectStakeholders,
  createAction,
  updateActionStatus
} from '../../../lib/api';
import { CheckSquare, Plus, User } from 'lucide-react';

export default function ActionsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [actionGroups, setActionGroups] = useState({});
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Action Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [groups, stks] = await Promise.all([
        getProjectActions(id),
        getProjectStakeholders(id)
      ]);

      setActionGroups(groups || {});
      setStakeholders(stks || []);

      if (stks && stks.length > 0 && !assignee) {
        setAssignee(stks[0].stakeholder._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load actions');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAction(e) {
    e.preventDefault();
    if (!title || !assignee) {
      setError('Title and Assignee are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await createAction({
        project: id,
        title,
        description,
        assignee,
        dueDate: dueDate || undefined
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to create action');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(actionId, newStatus) {
    try {
      setError(null);
      await updateActionStatus(actionId, newStatus);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update action status');
    }
  }

  const groupKeys = Object.keys(actionGroups);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-sky-400" />
            Actions Board
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track active action items grouped by assigned stakeholder.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
                <span>Loading action board...</span>
              </div>
            ) : groupKeys.length === 0 ? (
              <EmptyState
                title="No active actions"
                message="All action items are completed or none have been generated yet."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {groupKeys.map((key) => {
                  const group = actionGroups[key];
                  return (
                    <div
                      key={key}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-sky-400" />
                          <h3 className="text-sm font-bold text-slate-100">
                            {group.assignee?.name}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-800 text-slate-400 rounded border border-slate-700">
                          {group.assignee?.role}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 mt-1">
                        {group.actions.map((act) => (
                          <ActionCard
                            key={act._id}
                            action={act}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl sticky top-24">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-sky-400" />
                Create Manual Action
              </h3>

              <form onSubmit={handleCreateAction} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Action Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g. Review updated floor plan"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Assignee *
                  </label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    required
                  >
                    <option value="">Select Assignee</option>
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
                    placeholder="Action details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
                >
                  {submitting ? 'Creating...' : 'Create Action'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
