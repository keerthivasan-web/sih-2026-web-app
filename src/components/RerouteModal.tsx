import React from 'react';
import { useCommand } from '../context/CommandContext';
import { X, CheckCircle2, AlertOctagon, ShieldAlert, ArrowRight } from 'lucide-react';

export const RerouteModal: React.FC = () => {
  const { 
    isRerouteModalOpen, 
    closeRerouteModal, 
    targetRerouteShipmentId, 
    shipments, 
    routes, 
    rerouteShipment 
  } = useCommand();

  if (!isRerouteModalOpen) return null;

  const targetShipment = shipments.find(s => s.id === (targetRerouteShipmentId || 'MED-2045')) || shipments[0];
  const originalRoute = routes.find(r => r.id === targetShipment.routeId) || routes[0];
  const altRoute = routes.find(r => r.id === 'ROUTE-ALT-B') || routes[1];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col relative overflow-hidden animate-in fade-in duration-150 transition-colors">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-600"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] text-blue-700 dark:text-blue-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Emergency Dispatch Protocol • NDMA Standard
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Authorize Tactical Reroute: Convoy {targetShipment.vehicleId}
            </h3>
          </div>
          <button 
            onClick={closeRerouteModal}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cargo & Pathway Telemetry */}
        <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Assigned Cargo:</span>
            <span className="text-slate-900 dark:text-white font-extrabold">{targetShipment.commodity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Destination Facility:</span>
            <span className="text-blue-700 dark:text-blue-400 font-extrabold">{targetShipment.destination}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Blocked Corridor:</span>
            <span className="text-red-600 dark:text-red-400 font-extrabold flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" />
              {originalRoute.name} (+4h 30m Delay Risk)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold">Recommended Bypass:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {altRoute.name}
            </span>
          </div>
        </div>

        {/* ETA Delta Comparison */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-red-50/80 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800 text-center">
            <span className="text-[10px] text-red-700 dark:text-red-300 uppercase font-extrabold">Original Route ETA (Blocked)</span>
            <div className="text-xl font-black text-red-700 dark:text-red-400 mt-0.5">19:45 IST</div>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-bold">+4h 30m Delay Risk</span>
          </div>
          <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-extrabold">Revised ETA via Lava Bypass</span>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">16:30 IST</div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-extrabold">Safe Passage (Save 3h 15m)</span>
          </div>
        </div>

        {/* Explanatory Context */}
        <div className="mt-4 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700/60">
          <p>
            <strong className="text-slate-900 dark:text-white font-extrabold">Explainable Decision Factor:</strong> The Lava-Algarah ridge crest bypasses the flooded Teesta riverbed canyon. Border Roads Organisation (BRO) Project Swastik bulldozers stationed at Algarah guarantee continuous clearance for multi-axle freight.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={closeRerouteModal}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase transition-colors"
          >
            Cancel Override
          </button>
          <button
            onClick={() => rerouteShipment(targetShipment.id)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black uppercase transition-all shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Authorize Immediate Reroute
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

