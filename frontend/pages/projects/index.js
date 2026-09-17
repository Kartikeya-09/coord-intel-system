import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects } from '../../lib/api';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, FolderKanban, ArrowRight, User, Calendar, Search, Filter, Layers, LayoutGrid } from 'lucide-react';

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch = proj.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = !phaseFilter || proj.phase?.toLowerCase() === phaseFilter.toLowerCase();
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Projects Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Select a project to access its coordination intelligence dashboard, BFS impact traversal engine, and audit trail.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white shadow-xl shadow-sky-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="Search projects by name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['', 'Concept', 'Design Revision', 'Procurement', 'Construction', 'Handover'].map((phase) => (
            <button
              key={phase}
              onClick={() => setPhaseFilter(phase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                phaseFilter === phase
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {phase === '' ? 'All Phases' : phase}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
          <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading workspace projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          message={searchQuery || phaseFilter ? "No projects match your search filters." : "Click '+ New Project' above to initialize your first project."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <Link key={proj._id} href={`/projects/${proj._id}`} className="group">
              <div className="h-full p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-full shadow-sm">
                      {proj.phase || 'Construction'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors mb-3 leading-snug">
                    {proj.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Client: <strong className="text-slate-200 font-bold">{proj.client?.name || 'N/A'}</strong></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-extrabold text-sky-400 group-hover:text-sky-300">
                  <span>Enter Control Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

