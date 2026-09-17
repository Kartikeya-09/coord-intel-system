import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import {
  getProjectStakeholders,
  createStakeholder,
  addStakeholderToProject,
  removeStakeholderFromProject
} from '../../../lib/api';
import { Users, UserPlus, Trash2, Mail, Tag } from 'lucide-react';

export default function StakeholdersPage() {
  const router = useRouter();
  const { id } = router.query;

  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('architect');
  const [email, setEmail] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStakeholders();
    }
  }, [id]);

  async function fetchStakeholders() {
    try {
      setLoading(true);
      const data = await getProjectStakeholders(id);
      setStakeholders(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load stakeholders');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStakeholder(e) {
    e.preventDefault();
    if (!name || !role) {
      setError('Name and Role are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const newStk = await createStakeholder({
        name,
        role,
        contact: { email }
      });

      const respAreas = responsibility
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await addStakeholderToProject(id, newStk._id, respAreas);

      setName('');
      setEmail('');
      setResponsibility('');
      await fetchStakeholders();
    } catch (err) {
      setError(err.message || 'Failed to add stakeholder');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(stakeholderId) {
    try {
      setError(null);
      await removeStakeholderFromProject(id, stakeholderId);
      await fetchStakeholders();
    } catch (err) {
      setError(err.message || 'Failed to remove stakeholder');
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-400" />
            Project Stakeholders
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage team members, roles, and responsibility areas for this project.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center p-12 text-slate-400">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
                <span>Loading stakeholders...</span>
              </div>
            ) : stakeholders.length === 0 ? (
              <EmptyState
                title="No stakeholders assigned"
                message="Use the form to assign project team members."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stakeholders.map((entry) => {
                  const stk = entry.stakeholder || {};
                  return (
                    <div
                      key={stk._id}
                      className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base font-bold text-slate-100">{stk.name}</h3>
                          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full shrink-0">
                            {stk.role}
                          </span>
                        </div>

                        {stk.contact?.email && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{stk.contact.email}</span>
                          </div>
                        )}

                        {entry.responsibilityAreas && entry.responsibilityAreas.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-slate-800">
                            <Tag className="w-3 h-3 text-slate-400" />
                            {entry.responsibilityAreas.map((area, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-end">
                        <button
                          onClick={() => handleRemove(stk._id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
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
                <UserPlus className="w-5 h-5 text-sky-400" />
                Add Stakeholder
              </h3>

              <form onSubmit={handleAddStakeholder} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g. James Okoye"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Role *
                  </label>
                  <select
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="client">Client</option>
                    <option value="architect">Architect</option>
                    <option value="interior designer">Interior Designer</option>
                    <option value="project manager">Project Manager</option>
                    <option value="contractor">Contractor</option>
                    <option value="vendor">Vendor</option>
                    <option value="consultant">Consultant</option>
                    <option value="site team">Site Team</option>
                    <option value="specialist">Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="e.g. james@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Responsibility Areas
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                    placeholder="Comma-separated e.g. Flooring, Lighting"
                    value={responsibility}
                    onChange={(e) => setResponsibility(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-2.5 rounded-xl font-semibold text-xs bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition-all duration-200"
                >
                  {submitting ? 'Adding...' : 'Add to Project'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
