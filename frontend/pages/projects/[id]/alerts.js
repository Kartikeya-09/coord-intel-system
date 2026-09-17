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
import { Bell, User } from 'lucide-react';

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

      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-7 h-7 text-sky-400" />
            Alerts Inbox
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Select a stakeholder account to inspect impact notification alerts.
        </p>

        <ErrorBanner message={error} onClose={() => setError(null)} />

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl mb-6 flex items-center gap-3">
          <User className="w-5 h-5 text-sky-400 shrink-0" />
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 shrink-0">
            View Alerts For:
          </label>
          <select
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-sky-500 transition-colors"
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
          <div className="flex items-center justify-center p-12 text-slate-400">
            <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading stakeholder alerts...</span>
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
