import React from 'react';
import { CommandProvider, useCommand } from './context/CommandContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RerouteModal } from './components/RerouteModal';
import { Toast } from './components/Toast';

import { DashboardView } from './components/DashboardView';
import { LiveMapView } from './components/LiveMapView';
import { RouteIntelligenceView } from './components/RouteIntelligenceView';
import { ShipmentsView } from './components/ShipmentsView';
import { VehicleMonitoringView } from './components/VehicleMonitoringView';
import { IncidentsView } from './components/IncidentsView';
import { FieldEvidenceView } from './components/FieldEvidenceView';
import { ImpactAnalysisView } from './components/ImpactAnalysisView';
import { AlertCenterView } from './components/AlertCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditTrailView } from './components/AuditTrailView';
import { SystemSettingsView } from './components/SystemSettingsView';

import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeModule } = useCommand();

  const renderActiveView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'live-gis-map':
        return <LiveMapView />;
      case 'route-intelligence':
        return <RouteIntelligenceView />;
      case 'shipments':
        return <ShipmentsView />;
      case 'vehicle-monitoring':
        return <VehicleMonitoringView />;
      case 'incidents-and-hazards':
        return <IncidentsView />;
      case 'field-evidence':
        return <FieldEvidenceView />;
      case 'impact-analysis':
        return <ImpactAnalysisView />;
      case 'alert-center':
        return <AlertCenterView />;
      case 'analytics-and-telemetry':
        return <AnalyticsView />;
      case 'audit-trail':
        return <AuditTrailView />;
      case 'system-settings':
        return <SystemSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* Fixed Government Command Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex pt-[108px]">
        {/* Left Fixed Sidebar */}
        <Sidebar />

        {/* Dynamic Operational Content Viewport */}
        <main className="flex-1 ml-60 lg:ml-64 p-4 lg:p-6 overflow-y-auto max-w-[1600px] transition-all duration-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <RerouteModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CommandProvider>
      <MainContent />
    </CommandProvider>
  );
}
