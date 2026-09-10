import React from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  BarChart3, 
  TrendingUp, 
  Truck, 
  Activity
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { routes, shipments, vehicles } = useCommand();

  const openRoutes = routes.filter(r => r.status === 'OPEN').length;
  const degradedRoutes = routes.filter(r => r.status === 'DEGRADED').length;
  const highRiskRoutes = routes.filter(r => r.status === 'HIGH-RISK').length;
  const blockedRoutes = routes.filter(r => r.status === 'BLOCKED').length;

  const criticalShipments = shipments.filter(s => s.priority === 'CRITICAL').length;
  const highShipments = shipments.filter(s => s.priority === 'HIGH').length;
  const normalShipments = shipments.filter(s => s.priority === 'NORMAL').length;

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <BarChart3 className="w-4 h-4" />
            Operational Logistics Telemetry & Network Resilience
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Analytics & Corridor Performance Telemetry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical aggregation of network throughput, delay distributions, and geological vulnerability indicators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ● Compute Engine: Online
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Metric 1: Corridor Accessibility Distribution */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Corridor Accessibility</span>
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Active state across {routes.length} key transport links</p>

            <div className="mt-4 space-y-3 text-xs font-medium">
              <div>
                <div className="flex justify-between text-emerald-700 mb-1">
                  <span>Open / Safe</span>
                  <span className="font-bold">{openRoutes} ({Math.round((openRoutes / routes.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(openRoutes / routes.length) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-amber-700 mb-1">
                  <span>Degraded / Restricted</span>
                  <span className="font-bold">{degradedRoutes} ({Math.round((degradedRoutes / routes.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${(degradedRoutes / routes.length) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-orange-700 mb-1">
                  <span>High-Risk Hazard</span>
                  <span className="font-bold">{highRiskRoutes} ({Math.round((highRiskRoutes / routes.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: `${(highRiskRoutes / routes.length) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-red-700 mb-1">
                  <span>Severed / Blocked</span>
                  <span className="font-bold">{blockedRoutes} ({Math.round((blockedRoutes / routes.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="bg-red-600 h-full" style={{ width: `${(blockedRoutes / routes.length) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Cargo Priority Breakdown */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Cargo Dispatch Profile</span>
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Priority hierarchy across {shipments.length} consignments</p>

            <div className="mt-6 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-red-600">{criticalShipments}</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Critical Medical</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-amber-600">{highShipments}</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">High Priority</span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold text-slate-700">{normalShipments}</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Standard Freight</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-slate-50 text-xs text-slate-700 space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span>Rerouted En Route:</span>
                <span className="text-emerald-700 font-bold">{shipments.filter(s => s.status === 'REROUTED').length} Units</span>
              </div>
              <div className="flex justify-between">
                <span>Delayed / At Risk:</span>
                <span className="text-red-600 font-bold">{shipments.filter(s => s.status === 'AT RISK' || s.status === 'DELAYED').length} Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Real-Time Fleet Velocity */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900">Convoy Velocity Spread</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Active transit speed and movement tracking</p>

            <div className="mt-4 space-y-3 text-xs">
              {vehicles.map(v => (
                <div key={v.id} className="flex items-center justify-between">
                  <span className="text-slate-800 font-medium">{v.id}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${v.status === 'HALTED' ? 'bg-red-500' : 'bg-blue-600'}`} 
                        style={{ width: `${Math.min(100, (v.speedKmh / 80) * 100)}%` }}
                      ></div>
                    </div>
                    <span className={`w-14 text-right font-bold ${v.status === 'HALTED' ? 'text-red-600' : 'text-slate-900'}`}>
                      {v.speedKmh} km/h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
