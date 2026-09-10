import React from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  Home, 
  Map, 
  Package, 
  Truck, 
  Route as RouteIcon, 
  AlertTriangle, 
  Camera, 
  Bell, 
  BarChart3, 
  Clock, 
  Settings,
  User,
  Activity
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'CORE' | 'FLEET' | 'SYSTEM';
  badge?: {
    text: string;
    variant: 'safe' | 'primary' | 'critical' | 'alert' | 'muted';
  };
}

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, kpis, alerts } = useCommand();

  const unacknowledgedAlerts = alerts.filter(a => !a.isAcknowledged).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'CORE' },
    { id: 'live-gis-map', label: 'Live GIS Map', icon: Map, section: 'CORE' },
    
    { 
      id: 'shipments', 
      label: 'Shipments', 
      icon: Package, 
      section: 'FLEET',
      badge: { text: `${kpis.activeShipmentsCount}`, variant: 'primary' } 
    },
    { 
      id: 'vehicle-monitoring', 
      label: 'Vehicles', 
      icon: Truck, 
      section: 'FLEET',
      badge: { text: `${kpis.vehiclesEnRouteCount}`, variant: 'safe' } 
    },
    { 
      id: 'route-intelligence', 
      label: 'Routes', 
      icon: RouteIcon, 
      section: 'FLEET',
      badge: kpis.highRiskRoutesCount > 0 ? { text: `${kpis.highRiskRoutesCount} risk`, variant: 'critical' } : undefined 
    },
    { 
      id: 'incidents-and-hazards', 
      label: 'Incidents', 
      icon: AlertTriangle, 
      section: 'FLEET',
      badge: { text: `${kpis.activeIncidentsCount}`, variant: 'alert' } 
    },
    { id: 'field-evidence', label: 'Field Evidence', icon: Camera, section: 'FLEET' },
    { 
      id: 'alert-center', 
      label: 'Alert Center', 
      icon: Bell, 
      section: 'FLEET',
      badge: unacknowledgedAlerts > 0 ? { text: `${unacknowledgedAlerts}`, variant: 'critical' } : undefined 
    },

    { id: 'analytics-and-telemetry', label: 'Analytics', icon: BarChart3, section: 'SYSTEM' },
    { id: 'audit-trail', label: 'Audit Trail', icon: Clock, section: 'SYSTEM' },
    { id: 'system-settings', label: 'Settings', icon: Settings, section: 'SYSTEM' },
  ];

  const renderNavSection = (sectionKey: 'CORE' | 'FLEET' | 'SYSTEM', sectionTitle: string) => {
    const items = navItems.filter(i => i.section === sectionKey);
    return (
      <div className="mb-4">
        <div className="px-3 py-1 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {sectionTitle}
          </span>
        </div>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-1.5 shadow-2xs ${
                      item.badge.variant === 'safe'
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : item.badge.variant === 'primary'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : item.badge.variant === 'critical'
                        ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse'
                        : item.badge.variant === 'alert'
                        ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-[108px] bottom-0 w-60 lg:w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800/80 z-40 flex flex-col justify-between overflow-y-auto select-none shadow-sm transition-colors duration-300">
      <div className="py-3 px-2">
        {renderNavSection('CORE', 'Core Operations')}
        {renderNavSection('FLEET', 'Fleet & Risk Control')}
        {renderNavSection('SYSTEM', 'System & Telemetry')}
      </div>

      {/* User Section at the bottom */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-2xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">Authority Command</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Logistics Coordinator</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </aside>
  );
};

