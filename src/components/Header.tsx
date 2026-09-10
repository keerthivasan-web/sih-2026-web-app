import React, { useState, useEffect } from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Clock, 
  RotateCcw, 
  CloudRain, 
  Waves, 
  Mountain,
  Sun,
  Moon,
  Search,
  X,
  Activity
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    simulateLandslide, 
    simulateFlood, 
    simulateHeavyRain, 
    resetSimulation,
    activeScenario,
    showToast
  } = useCommand();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`IST ${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header bg-white/95 dark:bg-[#0f172a]/95 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      {/* Top Main Command Bar */}
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Crest & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-md glow-blue">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-lg font-black tracking-wider text-slate-900 dark:text-white uppercase bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
                EXTRICATE
              </span>
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 shadow-xs">
                AI Logistics Command • NER
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Government Fleet & Route Emergency Intelligence System
            </span>
          </div>
        </div>

        {/* Global Quick Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick search routes, shipments, vehicles, alerts..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* System Telemetry, Theme Switcher & Credentials */}
        <div className="flex items-center gap-3">
          {/* Clock & Status (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>LIVE SYSTEM</span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{currentTime || 'IST --:--:--'}</span>
            </div>
          </div>

          {/* Theme Switcher Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark Command'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Rajeev Sharma
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Director • Logistics NER
              </span>
            </div>

            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-sm ring-2 ring-blue-500/30">
                RS
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </div>

            <button 
              onClick={() => showToast('AUTHORITY VERIFIED', 'Logged in as Logistics Director (NER Command). Session active & secure.', 'safe')}
              className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
              title="Authority Credentials Active"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Crisis Simulation Override Bar */}
      <div className="h-11 w-full bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            CRISIS SIMULATOR:
          </span>

          <button
            onClick={simulateLandslide}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border shadow-xs ${
              activeScenario === 'LANDSLIDE'
                ? 'bg-red-600 text-white border-red-700 ring-2 ring-red-400 glow-red'
                : 'bg-white dark:bg-slate-800 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40'
            }`}
            title="Simulate landslide on NH-10 (Siliguri - Gangtok)"
          >
            <Mountain className="w-3.5 h-3.5" />
            Landslide (NH-10)
          </button>

          <button
            onClick={simulateFlood}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border shadow-xs ${
              activeScenario === 'FLOOD'
                ? 'bg-amber-500 text-white border-amber-600 ring-2 ring-amber-300 glow-amber'
                : 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
            title="Simulate river flooding on NH-27"
          >
            <Waves className="w-3.5 h-3.5" />
            River Flood (NH-27)
          </button>

          <button
            onClick={simulateHeavyRain}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border shadow-xs ${
              activeScenario === 'RAIN'
                ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300 glow-blue'
                : 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40'
            }`}
            title="Simulate heavy rainfall on NH-6"
          >
            <CloudRain className="w-3.5 h-3.5" />
            Heavy Rain (NH-6)
          </button>

          <button
            onClick={resetSimulation}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-1 shadow-xs"
            title="Reset system to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset Baseline
          </button>
        </div>

        {/* Live Scenario Status Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Scenario Status:</span>
          {activeScenario === 'LANDSLIDE' && (
            <span className="px-2.5 py-0.5 font-extrabold rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 animate-pulse glow-red-sm">
              🚨 Active: Landslide Blocking NH-10 (Mile 29)
            </span>
          )}
          {activeScenario === 'FLOOD' && (
            <span className="px-2.5 py-0.5 font-extrabold rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              🌊 Active: River Flood Alert on NH-27
            </span>
          )}
          {activeScenario === 'RAIN' && (
            <span className="px-2.5 py-0.5 font-extrabold rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              🌧️ Active: Monsoon Heavy Rain on NH-6
            </span>
          )}
          {activeScenario === 'NONE' && (
            <span className="px-2.5 py-0.5 font-semibold rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ✅ Baseline Normal Traffic Flow
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

