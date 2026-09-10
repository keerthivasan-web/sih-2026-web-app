import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { ImpactAnalysisService } from '../services/impactService';
import { 
  Activity, 
  Truck, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Zap
} from 'lucide-react';

export const ImpactAnalysisView: React.FC = () => {
  const { 
    routes, 
    shipments, 
    vehicles, 
    openRerouteModal 
  } = useCommand();

  const [selectedBlockedRouteId, setSelectedBlockedRouteId] = useState<string>(
    routes.find(r => r.status === 'BLOCKED')?.id || 'ROUTE-NH-10'
  );

  const impact = ImpactAnalysisService.calculateImpact(
    selectedBlockedRouteId,
    routes,
    shipments,
    vehicles
  );

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Activity className="w-4 h-4" />
            Downstream Impact Radius & Cascade Calculator
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Impact Transmission & Corridor Disruption Analysis
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated simulation of logistics choke-points, facility stockout risks, and ripple delays across the NER network.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Test Disrupted Corridor:</span>
          <select
            value={selectedBlockedRouteId}
            onChange={(e) => setSelectedBlockedRouteId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-800 font-medium text-xs border border-slate-200 outline-none"
          >
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Cascade Banner */}
      <div className="p-5 bg-white rounded-xl border-l-4 border-l-red-600 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span className="text-base font-bold text-slate-900">
              Corridor Impasse: {impact.blockedRouteName}
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
            Disruption Active
          </span>
        </div>

        {/* 4 Impact Stat Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Stranded Shipments</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {impact.affectedShipments.length}
            </span>
            <span className="text-[11px] text-red-600 font-bold">
              {impact.criticalShipments.length} Life-Critical
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Affected Fleet</span>
            <span className="text-2xl font-extrabold text-blue-700 mt-1 block">
              {impact.affectedVehicles.length}
            </span>
            <span className="text-[11px] text-slate-500">Convoys Halted</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Destinations Affected</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {impact.affectedDestinations.length}
            </span>
            <span className="text-[11px] text-slate-500 truncate block">
              {impact.affectedDestinations.join(', ') || 'None'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Estimated Delay</span>
            <span className="text-2xl font-extrabold text-red-600 mt-1 block">
              +{Math.floor(impact.totalDelayMinutes / 60)}h {impact.totalDelayMinutes % 60}m
            </span>
            <span className="text-[11px] text-red-600">Per Cargo Unit</span>
          </div>
        </div>

        {/* AI Tactical Directive */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] text-blue-800 font-bold uppercase tracking-wide">
                Tactical Mitigation Recommendation:
              </span>
              <p className="text-xs text-blue-900 mt-0.5 font-medium leading-relaxed">
                {impact.recommendedAction}
              </p>
            </div>
          </div>

          {impact.criticalShipments.length > 0 && (
            <button
              onClick={() => openRerouteModal(impact.criticalShipments[0].id)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              Reroute Critical Convoy
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Detailed Impacted Assets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Affected Shipments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Impacted Freight & Shipments ({impact.affectedShipments.length})
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Priority Ranked</span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
              {impact.affectedShipments.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No active cargo assigned to this corridor.
                </div>
              ) : (
                impact.affectedShipments.map((s) => (
                  <div 
                    key={s.id}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 bg-white ${
                      s.isCritical ? 'border-red-300 bg-red-50/40' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{s.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {s.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5 font-medium">{s.commodity}</div>
                      <div className="text-[11px] text-slate-500">Dest: {s.destination}</div>
                    </div>

                    <button
                      onClick={() => openRerouteModal(s.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase transition-colors flex-shrink-0"
                    >
                      Reroute
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recommended Alternative Corridors */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Available Bypass Corridors
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">Security Checked</span>
            </div>

            <div className="mt-3 space-y-3">
              {impact.recommendedAlternativeRoute ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">
                      Recommended Contingency
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Open (Safe Passage)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">
                    {impact.recommendedAlternativeRoute.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-medium">Distance</span>
                      <span className="text-slate-900 font-bold">{impact.recommendedAlternativeRoute.distanceKm} km</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px] font-medium">Risk Rating</span>
                      <span className="text-emerald-700 font-bold">{impact.recommendedAlternativeRoute.riskScore}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ridge elevation path avoids Teesta gorge flood risk. Border Roads Organisation (BRO) patrol detachments standing by at Algarah.
                  </p>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No alternate bypass available in registry.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
