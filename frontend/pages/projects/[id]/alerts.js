import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectNav from '../../../components/layout/ProjectNav';
import AlertItem from '../../../components/alerts/AlertItem';
import ErrorBanner from '../../../components/shared/ErrorBanner';
import EmptyState from '../../../components/shared/EmptyState';
import {
  getProjectStakeholders,
  getAlerts,
  markAlertRead
} from '../../../lib/api';
import { Bell, User, Sparkles } from 'lucide-react';

export default function AlertsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [stakeholders, setStakeholders] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadStakeholders();
    }
  }, [id]);

  useEffect(() => {
    if (selectedStakeholder) {
      loadAlerts(selectedStakeholder);
    }
  }, [selectedStakeholder]);

  async function loadStakeholders() {
    try {
      setLoading(true);
      setError(null);
      const stks = await getProjectStakeholders(id);
      setStakeholders(stks || []);

      if (stks && stks.length > 0) {
        setSelectedStakeholder(stks[0].stakeholder._id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load stakeholders');
      setLoading(false);
    }
  }

  async function loadAlerts(stkId) {
    try {
      setLoading(true);
      setError(null);
      const alertData = await getAlerts(stkId);
      setAlerts(alertData || []);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(alertId) {
    try {
      setError(null);
      await markAlertRead(alertId);
      await loadAlerts(selectedStakeholder);
    } catch (err) {
      setError(err.message || 'Failed to mark alert as read');
    }
  }

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <ProjectNav projectId={id} />

      <main className="flex-1 p-8 max-w-4xl w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Impact Notifications</span>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Alerts Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full animate-pulse shadow-sm">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Inspect automated impact notifications issued to stakeholders when change events propagate through the project graph.
          </p>
        </div>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl mb-8 flex items-center gap-3.5 shadow-xl">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 font-bold">
            <User className="w-4 h-4" />
          </div>
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 shrink-0">
            View Inbox For:
          </label>
          <select
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
            value={selectedStakeholder}
            onChange={(e) => setSelectedStakeholder(e.target.value)}
          >
            {stakeholders.map((stk) => (
              <option key={stk.stakeholder._id} value={stk.stakeholder._id}>
                {stk.stakeholder.name} ({stk.stakeholder.role})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-400 gap-3">
            <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Loading stakeholder notifications...</span>
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState
            title="No alerts for this stakeholder"
            message="Change events affecting this stakeholder will issue automated notifications here."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <AlertItem key={alert._id} alert={alert} onMarkRead={handleMarkRead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

