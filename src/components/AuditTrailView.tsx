import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  Download, 
  Search, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditTrail, showToast } = useCommand();
  const [search, setSearch] = useState('');

  const filteredLogs = auditTrail.filter(log => 
    log.id.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase()) ||
    log.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(auditTrail, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `EXTRICATE_AUDIT_LOG_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('AUDIT LOG EXPORTED', 'Cryptographic ledger downloaded for NDMA/MoDoNER review.', 'safe');
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Clock className="w-4 h-4" />
            Decision Record & Operational Audit Trail
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Immutable Audit Trail & Command Decision Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident record of all AI route evaluations, operator overrides, tactical reroutes, and verified evidence entries.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Audit Ledger (.json)
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit action, entity, or officer credentials..."
            className="w-full bg-transparent text-slate-900 text-xs outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 text-slate-600">
          <span>Total Logged Events: <strong className="text-slate-900">{auditTrail.length}</strong></span>
          <span>•</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> SHA-256 Verified
          </span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Event ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Action Taken</th>
              <th className="p-3">Authority User</th>
              <th className="p-3">Entity / Target</th>
              <th className="p-3">State Transition</th>
              <th className="p-3">Tactical Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-mono font-bold text-slate-900">{log.id}</td>
                <td className="p-3 text-slate-600 font-mono text-[11px]">{log.timestamp}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    log.action.includes('REROUTE') ? 'bg-emerald-100 text-emerald-800' :
                    log.action.includes('SIMULATE') || log.action.includes('BLOCK') ? 'bg-red-100 text-red-800' :
                    log.action.includes('VERIFY') ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-3 text-slate-800">{log.user}</td>
                <td className="p-3 text-blue-700 font-semibold">{log.entity}</td>
                <td className="p-3 text-slate-600">
                  {log.previousState && log.newState ? (
                    <span>
                      <span className="text-slate-400">{log.previousState}</span> → <strong className="text-slate-800">{log.newState}</strong>
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-3 text-slate-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
