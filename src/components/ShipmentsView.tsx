import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { PriorityLevel, ShipmentStatus } from '../types';
import { 
  Package, 
  Search, 
  Plus, 
  UserCheck, 
  MapPin, 
  Clock, 
  X,
  Phone,
  ArrowRight
} from 'lucide-react';

export const ShipmentsView: React.FC = () => {
  const { 
    shipments, 
    routes, 
    vehicles, 
    createShipment, 
    assignDriverVehicle, 
    changeShipmentPriority, 
    rerouteShipment,
    openRerouteModal 
  } = useCommand();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeShipmentId, setActiveShipmentId] = useState<string | null>(null);

  // New Shipment Form State
  const [newCommodity, setNewCommodity] = useState('');
  const [newOrigin, setNewOrigin] = useState('Guwahati Central Depot [AS]');
  const [newDest, setNewDest] = useState('Gangtok STNM Hospital [SK]');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('CRITICAL');
  const [newWeight, setNewWeight] = useState(5.0);

  // Assign Driver Form State
  const [assignDriverName, setAssignDriverName] = useState('');
  const [assignDriverPhone, setAssignDriverPhone] = useState('+91 94350 ');
  const [assignVehicleId, setAssignVehicleId] = useState('');

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = 
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.commodity.toLowerCase().includes(search.toLowerCase()) ||
      s.destination.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommodity) return;

    createShipment({
      commodity: newCommodity,
      priority: newPriority,
      isCritical: newPriority === 'CRITICAL',
      origin: newOrigin,
      destination: newDest,
      assignedFacility: newDest,
      routeId: routes[0].id,
      routeName: routes[0].name,
      status: 'PLANNED',
      eta: 'Est. 4h 30m',
      riskScore: 25,
      weightTonnes: newWeight,
      cargoWeightTonnes: newWeight,
      tempControlled: true,
      driverName: 'Unassigned',
      driverPhone: '-',
      vehicleId: 'Unassigned',
      notes: 'New urgent manifest registered by Authority.',
    });

    setIsCreateOpen(false);
    setNewCommodity('');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipmentId || !assignDriverName || !assignVehicleId) return;

    assignDriverVehicle(activeShipmentId, assignDriverName, assignDriverPhone, assignVehicleId);
    setIsAssignOpen(false);
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Top Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Package className="w-4 h-4" />
            Consignment Tracking & Manifest Registry
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Shipment Management & Vehicle Assignment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of critical life-safety payloads, disaster relief supplies, and regional transits.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Shipment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, commodity, destination, driver..."
            className="w-full bg-transparent text-slate-900 text-xs outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN TRANSIT">In Transit</option>
              <option value="AT RISK">At Risk</option>
              <option value="REROUTED">REROUTED</option>
              <option value="DELAYED">Delayed</option>
              <option value="ASSIGNED">Assigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">Cargo ID</th>
              <th className="p-3">Commodity</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Origin → Destination</th>
              <th className="p-3">Assigned Vehicle & Driver</th>
              <th className="p-3">Route</th>
              <th className="p-3">Status</th>
              <th className="p-3">ETA</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredShipments.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-mono font-bold text-slate-900">{s.id}</td>

                <td className="p-3">
                  <div className="font-bold text-slate-900">{s.commodity}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{s.cargoWeightTonnes || s.weightTonnes || 4.5} Tonnes Payload</div>
                </td>

                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.priority === 'CRITICAL'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : s.priority === 'HIGH'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {s.priority}
                  </span>
                </td>

                <td className="p-3">
                  <div className="text-slate-800 font-semibold">{s.destination}</div>
                  <div className="text-[11px] text-slate-500">From: {s.origin}</div>
                </td>

                <td className="p-3">
                  <div className="font-semibold text-slate-800">{s.vehicleId || 'Unassigned'}</div>
                  <div className="text-[11px] text-slate-500">{s.driverName} ({s.driverPhone})</div>
                </td>

                <td className="p-3">
                  <div className="text-slate-800">{s.routeName}</div>
                </td>

                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    s.status === 'AT RISK'
                      ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                      : s.status === 'REROUTED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : s.status === 'DELAYED'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {s.status === 'AT RISK' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                    {s.status === 'REROUTED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                    {s.status}
                  </span>
                </td>

                <td className="p-3 font-medium text-slate-800">
                  {s.eta}
                </td>

                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {s.status === 'AT RISK' ? (
                      <button
                        onClick={() => rerouteShipment(s.id, 'ROUTE-ALT-B')}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        Reroute
                      </button>
                    ) : (
                      <button
                        onClick={() => openRerouteModal(s.id)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        Options
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveShipmentId(s.id);
                        setAssignDriverName(s.driverName || '');
                        setAssignDriverPhone(s.driverPhone || '+91 94350 ');
                        setAssignVehicleId(s.vehicleId || '');
                        setIsAssignOpen(true);
                      }}
                      className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold"
                      title="Assign Driver / Vehicle"
                    >
                      Assign
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE SHIPMENT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Create New Manifest
              </h3>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Commodity / Supplies Description:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Trauma Medical Supplies"
                  value={newCommodity}
                  onChange={(e) => setNewCommodity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Level:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (Medical / Oxygen)</option>
                    <option value="HIGH">HIGH (Rations / Reroute)</option>
                    <option value="NORMAL">NORMAL (Bulk Freight)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payload Weight (Tonnes):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Origin Point:</label>
                <input
                  type="text"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Destination Facility:</label>
                <input
                  type="text"
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Register Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN DRIVER / VEHICLE MODAL */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Assign Driver & Fleet Vehicle
              </h3>
              <button 
                onClick={() => setIsAssignOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Driver Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Das"
                  value={assignDriverName}
                  onChange={(e) => setAssignDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Driver Contact Phone:</label>
                <input
                  type="text"
                  required
                  placeholder="+91 94350 XXXXX"
                  value={assignDriverPhone}
                  onChange={(e) => setAssignDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Vehicle Unit:</label>
                <select
                  value={assignVehicleId}
                  onChange={(e) => setAssignVehicleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 outline-none"
                  required
                >
                  <option value="">Select Available Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.vehicleNumber} ({v.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
