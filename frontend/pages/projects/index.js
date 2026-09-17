import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects } from '../../lib/api';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, FolderKanban, ArrowRight, User, Calendar } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-sky-400" />
            Projects Workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select a project to access its coordination intelligence dashboard and impact analysis system.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {loading ? (
        <div className="flex items-center justify-center p-12 text-slate-400">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
          <span>Loading workspace projects...</span>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          message="Click '+ New Project' above to initialize your first project."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Link key={proj._id} href={`/projects/${proj._id}`} className="group">
              <div className="h-full p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                      {proj.phase || 'Construction'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition-colors mb-2">
                    {proj.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Client: <strong className="text-slate-200 font-medium">{proj.client?.name || 'N/A'}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:text-sky-300">
                  <span>Control Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
