import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { RouteIntelligenceService } from '../services/routeService';
import { RouteCandidate, PriorityLevel } from '../types';
import { 
  GitBranch, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Compass,
  MapPin
} from 'lucide-react';

export const RouteIntelligenceView: React.FC = () => {
  const { openRerouteModal, showToast } = useCommand();

  const [origin, setOrigin] = useState<string>('Siliguri Logistics Hub [WB]');
  const [destination, setDestination] = useState<string>('STNM Hospital, Gangtok [SK]');
  const [shipmentType, setShipmentType] = useState<string>('Peritoneal Dialysis & Cryo-Pharma');
  const [priority, setPriority] = useState<PriorityLevel>('CRITICAL');
  const [vehicleType, setVehicleType] = useState<string>('Multi-Axle Heavy Cold-Chain (16 Tonne)');

  const [analysis, setAnalysis] = useState(() => 
    RouteIntelligenceService.analyzeRoutes({
      origin,
      destination,
      shipmentType,
      priority,
      vehicleType,
    })
  );

  const [selectedCandidate, setSelectedCandidate] = useState<RouteCandidate>(analysis.recommendedRoute);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    const result = RouteIntelligenceService.analyzeRoutes({
      origin,
      destination,
      shipmentType,
      priority,
      vehicleType,
    });
    setAnalysis(result);
    setSelectedCandidate(result.recommendedRoute);
    showToast('ROUTE INTELLIGENCE RECALCULATED', 'Evaluated 3 corridor options. Safest route selected.', 'safe');
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* View Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <GitBranch className="w-4 h-4" />
            Tactical Route Optimization
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Route Intelligence & Safety Optimization Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            EXTRICATE prioritizes structural safety, soil saturation stability, and corridor resilience over naive shortest distance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Safe-First Heuristic Active
          </span>
        </div>
      </div>

      {/* Inputs Configuration Form */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-[11px] text-slate-600 uppercase font-bold mb-1.5">
              Origin Node
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 uppercase font-bold mb-1.5">
              Destination Facility
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 uppercase font-bold mb-1.5">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:border-blue-500 outline-none font-medium"
            >
              <option value="CRITICAL">Critical (Life-Safety)</option>
              <option value="HIGH">High (Utility / Fuel)</option>
              <option value="NORMAL">Normal (Freight)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-600 uppercase font-bold mb-1.5">
              Fleet / Vehicle Class
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:border-blue-500 outline-none font-medium"
            >
              <option value="Multi-Axle Heavy Cold-Chain (16 Tonne)">Multi-Axle Heavy (16T+)</option>
              <option value="Medium 4x4 Disaster Response Truck (8 Tonne)">Medium 4x4 Truck (8T)</option>
              <option value="Light High-Clearance 4x4 Van (3.5 Tonne)">Light 4x4 Van (3.5T)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Analyze Pathways
            </button>
          </div>
        </form>
      </div>

      {/* Decision Rationale Banner */}
      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-900 font-extrabold uppercase tracking-wide">
              EXTRICATE Decision Matrix Recommendation:
            </span>
            <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
              {analysis.analysisSummary}
            </p>
          </div>
        </div>

        <button
          onClick={() => openRerouteModal('MED-2045')}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex-shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          <span>Dispatch Recommended Route</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysis.candidates.map((candidate) => {
          return (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative bg-white shadow-sm ${
                candidate.isRecommended
                  ? 'border-emerald-500 ring-2 ring-emerald-100'
                  : candidate.riskLevel === 'CRITICAL'
                  ? 'border-red-300 hover:border-red-400'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              {candidate.isRecommended && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-600 text-white text-[10px] font-extrabold uppercase rounded-bl-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Recommended Safe Route
                </div>
              )}

              <div>
                <div className="text-[11px] text-slate-500 uppercase font-bold">
                  {candidate.id}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1 pr-14">
                  {candidate.name}
                </h3>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Distance</span>
                    <span className="text-slate-900 font-bold text-sm">{candidate.distanceKm} km</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Reliability</span>
                    <span className={`font-bold text-sm ${candidate.reliabilityPct > 75 ? 'text-emerald-700' : 'text-red-700'}`}>
                      {candidate.reliabilityPct}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Risk Index:</span>
                    <span className={`font-bold ${candidate.riskScore > 75 ? 'text-red-700' : candidate.riskScore > 40 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {candidate.riskScore}/100 ({candidate.riskLevel})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Duration:</span>
                    <span className="text-slate-800 font-medium">{candidate.estimatedDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Passage Status:</span>
                    <span className={`font-bold ${candidate.accessibility === 'BLOCKED' ? 'text-red-700' : 'text-emerald-700'}`}>
                      {candidate.accessibility}
                    </span>
                  </div>
                </div>

                {/* Explanatory Rationale */}
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {candidate.rationale}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {candidate.waypoints.length} GPS Waypoints
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('GPS PROFILE', `Previewing GPS coordinates for ${candidate.name}`, 'safe');
                  }}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  View Route Profile →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
