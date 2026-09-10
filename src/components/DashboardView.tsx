import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  Truck, 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Clock,
  Compass,
  Zap,
  Phone
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    kpis, 
    routes, 
    shipments, 
    vehicles, 
    incidents, 
    alerts, 
    activeScenario,
    simulateLandslide, 
    simulateFlood, 
    resetSimulation, 
    openRerouteModal,
    rerouteShipment,
    setActiveModule,
    setSelectedRoute,
    setSelectedShipment,
    showToast
  } = useCommand();

  const [filterQuery, setFilterQuery] = useState('');

  const nh10Route = routes.find(r => r.id === 'ROUTE-NH-10') || routes[0];
  const altBRoute = routes.find(r => r.id === 'ROUTE-ALT-B') || routes[1];
  const medShipment = shipments.find(s => s.id === 'MED-2045') || shipments[0];
  const affectedShipmentsOnNh10 = shipments.filter(s => s.routeId === 'ROUTE-NH-10' || (s.id === 'MED-2045' && s.status === 'AT RISK'));

  const isNh10Blocked = nh10Route.status === 'BLOCKED' || activeScenario === 'LANDSLIDE';
  const isMedRerouted = medShipment.status === 'REROUTED';

  return (
    <div className="flex flex-col w-full space-y-6 pb-12 transition-colors duration-300">
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Logistics & Route Command Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Real-time route risk detection and emergency shipment safeguarding for the North Eastern Region.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
            ⚡ LIVE TELEMETRY
          </span>
          <button
            onClick={() => setActiveModule('live-gis-map')}
            className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Open Live GIS Map</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CORE 4 QUESTIONS EXECUTIVE BRIEFING (Interactive Glass Cards) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-800">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                EXTRICATE Core Intelligence: Executive 4 Answers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous operational awareness for government and emergency coordinators
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Feed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Question 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
              What is happening?
            </div>
            <div className="my-2.5">
              {isNh10Blocked ? (
                <div className="text-sm font-black text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                  Major Landslide Blockage
                </div>
              ) : activeScenario === 'FLOOD' ? (
                <div className="text-sm font-black text-amber-600 dark:text-amber-400">
                  River Flood Surge Warning
                </div>
              ) : (
                <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  Normal Corridor Flow
                </div>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {isNh10Blocked 
                  ? 'Heavy shale rockfall at 29th Mile. Carriageway completely buried.' 
                  : 'Monsoon sensors active. Corridor telemetry nominal.'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md ${
                isNh10Blocked ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {isNh10Blocked ? '🔴 Severe Blockage' : '🟢 Corridor Clear'}
              </span>
            </div>
          </div>

          {/* Question 2 */}
          <div 
            onClick={() => { setSelectedRoute(nh10Route); setActiveModule('live-gis-map'); }}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                Where is the problem?
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="my-2.5">
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {isNh10Blocked ? 'NH-10 (Siliguri - Gangtok)' : 'Sector 02-NER Mountain Spine'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {isNh10Blocked ? 'KM 29+400, Teesta Canyon (Kalimpong / Sikkim)' : 'All 10 monitoring corridors reporting nominal friction.'}
              </p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 w-fit">
              {isNh10Blocked ? '📍 Inspect Mile 29 on Map' : '📍 Monitored Corridor'}
            </span>
          </div>

          {/* Question 3 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-all">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              Which shipments affected?
            </div>
            <div className="my-2.5">
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {isNh10Blocked 
                  ? (isMedRerouted ? '1 Staged, 1 Secured' : 'MED-2045 (Critical At Risk)') 
                  : '0 Delays Currently'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {isNh10Blocked 
                  ? (isMedRerouted 
                      ? 'MED-2045 rerouted on Alt-B Lava route.' 
                      : 'Hemodialysis fluid supply stranded.') 
                  : 'All consignments tracking on time.'}
              </p>
            </div>
            {isNh10Blocked && !isMedRerouted ? (
              <button
                onClick={() => openRerouteModal('MED-2045')}
                className="w-full py-1 text-[11px] font-extrabold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                <span>Execute Safe Reroute</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md w-fit ${
                isNh10Blocked ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}>
                {isNh10Blocked ? '✅ Secured on Alt-B' : '🟢 Safe / On Schedule'}
              </span>
            )}
          </div>

          {/* Question 4 */}
          <div 
            onClick={() => { setSelectedRoute(altBRoute); setActiveModule('route-intelligence'); }}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
          >
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                Safest Route Bypass?
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="my-2.5">
              <div className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                Corridor Alt-B (Via Lava)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                Elevated ridge highway. Clear weather, BRO teams deployed.
              </p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 w-fit">
              🛡️ Risk Score: 12% (Recommended)
            </span>
          </div>
        </div>
      </section>

      {/* 4 CORE KPI METRICS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1: Active Shipments */}
        <div 
          onClick={() => setActiveModule('shipments')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Active Shipments
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-2xs group-hover:scale-105 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.activeShipmentsCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 font-extrabold text-[11px] border border-red-200 dark:border-red-800">
                {kpis.criticalShipmentsCount} Critical
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">En route</span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View Shipments <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* KPI 2: Vehicles Tracked */}
        <div 
          onClick={() => setActiveModule('vehicle-monitoring')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Vehicles Tracked
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shadow-2xs group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.vehiclesEnRouteCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800">
                🟢 Live GPS
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Telematics Active</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Track Fleet <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* KPI 3: High Risk / Blocked Corridors */}
        <div 
          onClick={() => setActiveModule('route-intelligence')}
          className={`p-4 rounded-2xl border shadow-xs cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group ${
            isNh10Blocked 
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 hover:border-red-500' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              Corridor Risk Status
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform ${
              isNh10Blocked ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700' : 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className={`text-3xl font-black tracking-tight ${isNh10Blocked ? 'text-red-700 dark:text-red-400 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
              {isNh10Blocked ? '1 Blocked' : `${kpis.highRiskRoutesCount} High Risk`}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] border ${
                isNh10Blocked ? 'bg-red-200 dark:bg-red-900/80 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700' : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}>
                {isNh10Blocked ? '🔴 Blocked NH-10' : '🟠 High Risk'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">Mile 29</span>
            </div>
          </div>
          <span className={`text-xs font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform ${isNh10Blocked ? 'text-red-700 dark:text-red-400 font-extrabold' : 'text-amber-600 dark:text-amber-400'}`}>
            Inspect Corridors <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* KPI 4: Active Incidents */}
        <div 
          onClick={() => setActiveModule('incidents-and-hazards')}
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Active Incidents
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2.5">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{kpis.activeIncidentsCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] border border-blue-200 dark:border-blue-800">
                Verified Reports
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Field Active</span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            Review Incidents <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </section>

      {/* CORE SIH DEMO SCENARIO INTERACTIVE HERO PANEL */}
      <section className={`rounded-xl border p-5 transition-all shadow-sm ${
        isNh10Blocked 
          ? 'bg-red-50/60 border-red-300' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${
              isNh10Blocked ? 'bg-red-600 text-white animate-pulse' : 'bg-blue-600 text-white'
            }`}>
              {isNh10Blocked ? <AlertTriangle className="w-5 h-5" /> : <Compass className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-slate-900">
                  {isNh10Blocked ? 'CRISIS RESPONSE: NH-10 BLOCKED - 3 SHIPMENTS AFFECTED' : 'PRIMARY LOGISTICS CORRIDOR: NH-10 (SILIGURI - GANGTOK)'}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isNh10Blocked ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isNh10Blocked ? 'Red: BLOCKED' : 'Green: Safe / Open'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isNh10Blocked 
                  ? 'Landslide debris cascade at KM 29+400 (Teesta Canyon). Immediate tactical reroute recommended.'
                  : 'Main arterial highway to Sikkim STNM Hospital. Elevation 1,650m to 2,120m.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNh10Blocked ? (
              <button
                onClick={simulateLandslide}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Landslide on NH-10</span>
              </button>
            ) : (
              <button
                onClick={resetSimulation}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm transition-colors"
              >
                Reset Corridor
              </button>
            )}
          </div>
        </div>

        {/* Affected Critical Shipment & Recommended Alternative Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Critical Shipment Detail */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Tracked Shipment:</span>
                  <span className="font-mono text-sm font-bold text-slate-900">{medShipment.id}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  medShipment.status === 'AT RISK'
                    ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                    : medShipment.status === 'REROUTED'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {medShipment.status === 'AT RISK' 
                    ? 'Red: CRITICAL / AT RISK' 
                    : medShipment.status === 'REROUTED' 
                    ? 'Green: REROUTED' 
                    : 'Blue: IN TRANSIT'}
                </span>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-bold text-slate-900">{medShipment.commodity}</h4>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{medShipment.origin} → <strong className="text-slate-700">{medShipment.destination}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-500">Vehicle / Driver:</span>
                  <div className="font-medium text-slate-800 flex items-center gap-1 mt-0.5">
                    <span>{medShipment.vehicleId}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{medShipment.driverName} ({medShipment.driverPhone})</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500">Current ETA:</span>
                  <div className={`font-bold mt-0.5 ${isNh10Blocked && !isMedRerouted ? 'text-red-600' : 'text-slate-800'}`}>
                    {medShipment.eta}
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {isNh10Blocked && !isMedRerouted ? 'Delayed by +4h 30m' : 'Nominal progress'}
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-3 text-xs text-slate-600 italic bg-amber-50 p-2 rounded border border-amber-200">
              {medShipment.notes}
            </div>
          </div>

          {/* Right: Route Comparison & Direct Reroute Action */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase">AI Route Comparison</span>
                <span className="text-xs font-medium text-blue-700">EXTRICATE Heuristic Engine</span>
              </div>

              {/* Route 1: Current NH-10 */}
              <div className={`p-3 rounded-lg border my-3 transition-colors ${
                isNh10Blocked ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">Route 1: NH-10 (Via Teesta Canyon)</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                    isNh10Blocked ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isNh10Blocked ? 'Red: BLOCKED (Risk 96%)' : 'Green: Safe / Open (Risk 28%)'}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Distance: 114 km</span>
                  <span>Delay: {isNh10Blocked ? '+270 mins (Road Blocked)' : '0 mins'}</span>
                  <span>Passage: {isNh10Blocked ? 'Impassable at Mile 29' : 'Open'}</span>
                </div>
              </div>

              {/* Route 2: Alternative Alt-B */}
              <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-900">Route 2: Corridor Alt-B (Via Lava - Algarah - Reshi)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-600 text-white">
                    Green: RECOMMENDED SAFER ROUTE
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-emerald-800">
                  <span>Distance: 142 km (+28 km)</span>
                  <span>ETA: 4h 45m (16:30 IST)</span>
                  <span>Risk Score: 24% (Low)</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1.5">
                  High-altitude elevated ridge corridor completely bypassing low-lying Teesta canyon. BRO cleared.
                </p>
              </div>
            </div>

            {/* ACTION BUTTON: USE SAFER ROUTE */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {isMedRerouted ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Shipment MED-2045 rerouted via Alt-B. Driver alerted.
                  </span>
                ) : isNh10Blocked ? (
                  <span className="text-red-700 font-medium">
                    Authority action required to divert medical convoy.
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Contingency corridor pre-calculated and ready.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isNh10Blocked && !isMedRerouted && (
                  <button
                    onClick={() => rerouteShipment('MED-2045', 'ROUTE-ALT-B')}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <span>USE SAFER ROUTE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => openRerouteModal('MED-2045')}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Configure Reroute
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT SHIPMENTS IN TRANSIT TABLE */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Active Shipments & Route Assignments
            </h3>
            <p className="text-xs text-slate-500">
              Real-time monitoring of all government and medical cargo in the North Eastern Region
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search shipment, commodity, destination..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Shipment ID</th>
                <th className="py-2.5 px-3">Commodity & Priority</th>
                <th className="py-2.5 px-3">Assigned Route</th>
                <th className="py-2.5 px-3">Vehicle / Driver</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">ETA</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {shipments
                .filter(s => 
                  s.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  s.commodity.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  s.destination.toLowerCase().includes(filterQuery.toLowerCase())
                )
                .map((shipment) => {
                  const isBlocked = shipment.status === 'AT RISK' || (shipment.routeId === 'ROUTE-NH-10' && isNh10Blocked && shipment.status !== 'REROUTED');

                  return (
                    <tr key={shipment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {shipment.id}
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{shipment.commodity}</div>
                        <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-semibold mt-0.5 ${
                          shipment.priority === 'CRITICAL' 
                            ? 'bg-red-100 text-red-700' 
                            : shipment.priority === 'HIGH' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {shipment.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{shipment.routeName}</div>
                        <span className="text-[11px] text-slate-500">Route ID: {shipment.routeId}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{shipment.vehicleId || 'Unassigned'}</div>
                        <div className="text-[11px] text-slate-500">{shipment.driverName}</div>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700">
                        {shipment.destination}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          shipment.status === 'AT RISK'
                            ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                            : shipment.status === 'REROUTED'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : shipment.status === 'DELAYED'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {shipment.status === 'AT RISK' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                          {shipment.status === 'REROUTED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                          {shipment.status === 'IN TRANSIT' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          {shipment.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700">
                        {shipment.eta}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {shipment.status === 'AT RISK' ? (
                          <button
                            onClick={() => rerouteShipment(shipment.id, 'ROUTE-ALT-B')}
                            className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            Reroute Now
                          </button>
                        ) : (
                          <button
                            onClick={() => openRerouteModal(shipment.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                          >
                            Manage
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
