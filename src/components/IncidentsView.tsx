import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { IncidentType, IncidentSeverity } from '../types';
import { 
  AlertOctagon, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  MapPin, 
  X
} from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const { 
    incidents, 
    routes, 
    verifyIncident, 
    rejectIncident, 
    duplicateIncident, 
    addIncident, 
    showToast 
  } = useCommand();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Incident Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<IncidentType>('LANDSLIDE');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('CRITICAL');
  const [newLocation, setNewLocation] = useState('NH-10 Mile 29 Sevoke');
  const [newRouteId, setNewRouteId] = useState(routes[0].id);
  const [newDesc, setNewDesc] = useState('');

  const filteredIncidents = incidents.filter(i => {
    const matchesSearch = 
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.locationName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || i.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || i.verificationStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addIncident({
      type: newType,
      severity: newSeverity,
      title: newTitle,
      description: newDesc || 'Ground sensor anomaly flagged by local authorities.',
      locationName: newLocation,
      location: { lat: 26.8845, lng: 88.4735 },
      routeId: newRouteId,
      routeName: routes.find(r => r.id === newRouteId)?.name || 'Highway Corridor',
      timestamp: 'Just now',
      verificationStatus: 'PENDING',
      reportedBy: 'Field Observation Unit (Authority Entry)',
      estimatedClearanceHours: 4.5,
      isBlockade: newSeverity === 'CRITICAL',
    });

    setIsAddOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* View Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4" />
            Ground Hazard Surveillance & Road Blocks
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Incident Intelligence & Verification Registry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time catalog of verified geological disruptions, landslides, washouts, and carriageway blockages.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Report Incident
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hazard by title, sector, or ID..."
            className="w-full bg-transparent text-slate-900 text-xs outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Hazard Types</option>
            <option value="LANDSLIDE">Landslide</option>
            <option value="FLOOD">Flood</option>
            <option value="ROCKFALL">Rockfall</option>
            <option value="ROAD COLLAPSE">Road Collapse</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending Verification</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIncidents.map((inc) => {
          const isCritical = inc.severity === 'CRITICAL' || inc.type === 'LANDSLIDE';

          return (
            <div
              key={inc.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all bg-white shadow-sm ${
                isCritical
                  ? 'border-l-4 border-l-red-600 border-slate-200'
                  : 'border-l-4 border-l-amber-500 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] text-slate-500 font-bold uppercase">{inc.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    inc.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    inc.verificationStatus === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-red-100 text-red-700'
                  }`}>
                    ● {inc.verificationStatus}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1.5">{inc.title}</h3>
                <div className="flex items-center gap-1 text-xs text-blue-700 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {inc.locationName}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                  {inc.description}
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Corridor:</span>
                    <span className="text-slate-900 font-semibold truncate">{inc.routeName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Severity:</span>
                    <span className={`font-bold ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Clearance Est:</span>
                    <span className="text-slate-900 font-medium">{inc.estimatedClearanceHours} hours</span>
                  </div>
                </div>
              </div>

              {/* Verification Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => verifyIncident(inc.id)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 border border-emerald-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verify
                </button>
                <button
                  onClick={() => rejectIncident(inc.id)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 border border-red-200"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  onClick={() => duplicateIncident(inc.id)}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all"
                  title="Mark duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Report Incident */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 border border-slate-200 shadow-xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                Report Field Hazard Incident
              </h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Rockslide at Sevoke KM 29"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Hazard Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IncidentType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                  >
                    <option value="LANDSLIDE">Landslide</option>
                    <option value="FLOOD">Flood</option>
                    <option value="ROCKFALL">Rockfall</option>
                    <option value="ROAD COLLAPSE">Road Collapse</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                  >
                    <option value="CRITICAL">Critical (Total Blockade)</option>
                    <option value="HIGH">High (Single Lane Impaired)</option>
                    <option value="MODERATE">Moderate (Slow Traffic)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Affected Highway Corridor</label>
                <select
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Specific Location / Milestone</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Description & Clearance Details</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Estimated debris volume, equipment dispatched, civilian advisory..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
