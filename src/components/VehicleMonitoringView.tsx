import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Truck, 
  MapPin, 
  Gauge, 
  Phone
} from 'lucide-react';

export const VehicleMonitoringView: React.FC = () => {
  const { 
    vehicles, 
    isGpsSimRunning, 
    startVehicleSimulation, 
    pauseVehicleSimulation, 
    resetVehicleSimulation, 
    setSelectedVehicle, 
    setActiveModule, 
    openRerouteModal,
    showToast 
  } = useCommand();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase()) ||
      v.routeName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* View Header with Live Simulation Controls */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Radio className="w-4 h-4" />
            Telemetry & Fleet Positioning
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Vehicle Monitoring & GPS Fleet Telematics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized GPS breadcrumbs, vehicle speeds, and corridor safety monitoring across NER.
          </p>
        </div>

        {/* Fleet Simulation Controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs font-medium">
          <span className="text-slate-500 px-2 text-[11px] uppercase font-bold">GPS Ticker:</span>
          {isGpsSimRunning ? (
            <button
              onClick={pauseVehicleSimulation}
              className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-all flex items-center gap-1.5 font-bold"
            >
              <Pause className="w-3.5 h-3.5" />
              Pause Motion
            </button>
          ) : (
            <button
              onClick={startVehicleSimulation}
              className="px-3 py-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-all flex items-center gap-1.5 font-bold"
            >
              <Play className="w-3.5 h-3.5" />
              Resume Motion
            </button>
          )}

          <button
            onClick={resetVehicleSimulation}
            className="px-3 py-1.5 rounded-md bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Positions
          </button>
        </div>
      </div>

      {/* Filter and Summary Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle ID, driver, or corridor..."
            className="w-full bg-transparent text-slate-900 text-xs outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Fleet</option>
            <option value="MOVING">Moving</option>
            <option value="HALTED">Halted</option>
            <option value="IDLE">Idle</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredVehicles.map((veh) => {
          const isHalted = veh.status === 'HALTED' || veh.riskLevel === 'CRITICAL';

          return (
            <div
              key={veh.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all bg-white shadow-sm ${
                isHalted
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700">{veh.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHalted ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        ● {veh.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{veh.vehicleNumber}</h4>
                    <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {veh.driverName} ({veh.driverPhone})
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-slate-900 text-xs font-bold">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" />
                      {veh.speedKmh} <span className="text-[10px] text-slate-500">km/h</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Heading: {veh.headingDeg}°</span>
                  </div>
                </div>

                {/* Corridor & GPS */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                  <div className="text-slate-700 truncate">
                    <span className="text-slate-500">Route: </span>
                    <strong>{veh.routeName}</strong>
                  </div>
                  <div className="text-blue-700">
                    <span className="text-slate-500">Cargo: </span>
                    <span className="font-semibold">{veh.commodity}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    GPS: {veh.lat.toFixed(4)}°N, {veh.lng.toFixed(4)}°E
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {isHalted ? (
                  <button
                    onClick={() => openRerouteModal(veh.assignedShipmentId || 'MED-2045')}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-colors text-center"
                  >
                    Authorize Reroute
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedVehicle(veh);
                      setActiveModule('live-gis-map');
                      showToast('FLEET ASSET', `Focusing map on vehicle ${veh.id}`, 'safe');
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors"
                  >
                    Focus on Live Map
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
