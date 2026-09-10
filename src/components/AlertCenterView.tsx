import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { AlertItem } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, openRerouteModal } = useCommand();

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterAck, setFilterAck] = useState<'ALL' | 'UNACK' | 'ACK'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesAck = 
      filterAck === 'ALL' || 
      (filterAck === 'UNACK' && !a.isAcknowledged) || 
      (filterAck === 'ACK' && a.isAcknowledged);
    return matchesSev && matchesAck;
  });

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wide">
            <Bell className="w-4 h-4" />
            Real-Time Dispatch Warnings & Escalation Broadcasts
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Alert Center & Crisis Dispatch Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts routed to Command HQ, NDRF, and field convoy drivers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
            {alerts.filter(a => !a.isAcknowledged).length} Unacknowledged Alerts
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={filterAck}
            onChange={(e) => setFilterAck(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Notifications</option>
            <option value="UNACK">Action Required (Unacknowledged)</option>
            <option value="ACK">Acknowledged</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-xl border flex flex-col justify-between transition-all bg-white shadow-sm ${
              alert.severity === 'CRITICAL'
                ? 'border-l-4 border-l-red-600 border-slate-200'
                : alert.severity === 'HIGH'
                ? 'border-l-4 border-l-amber-500 border-slate-200'
                : 'border-l-4 border-l-yellow-400 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                  alert.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  ● {alert.severity} • {alert.type}
                </span>
                <span className="text-[11px] text-slate-500">{alert.timestamp}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                {alert.title}
              </h3>

              <div className="flex items-center gap-1 text-xs text-blue-700 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {alert.location}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {alert.cause}
              </p>

              {/* Advisory note */}
              <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                {alert.affectedRouteName && (
                  <div className="flex justify-between text-slate-600">
                    <span>Corridor:</span>
                    <span className="text-slate-900 font-semibold truncate">{alert.affectedRouteName}</span>
                  </div>
                )}
                {alert.affectedShipmentId && (
                  <div className="flex justify-between text-slate-600">
                    <span>Priority Shipment:</span>
                    <span className="text-blue-700 font-bold">{alert.affectedShipmentId}</span>
                  </div>
                )}
                <div className="text-emerald-800 text-xs pt-1 font-medium">
                  <strong>Advisory: </strong>{alert.recommendedAction}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {alert.affectedShipmentId && (
                <button
                  onClick={() => openRerouteModal(alert.affectedShipmentId!)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  Dispatch Reroute
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {!alert.isAcknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold uppercase border border-slate-300 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Acknowledge
                </button>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Acknowledged
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
