import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  Database, 
  RotateCcw
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const { showToast } = useCommand();

  const [rainWeight, setRainWeight] = useState(25);
  const [hazardWeight, setHazardWeight] = useState(35);
  const [soilWeight, setSoilWeight] = useState(20);
  const [evidenceWeight, setEvidenceWeight] = useState(10);
  const [historicalWeight, setHistoricalWeight] = useState(10);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('WEIGHTS CALIBRATED', 'Risk Engine heuristics updated across all corridor calculations.', 'safe');
  };

  const handleResetDefaults = () => {
    setRainWeight(25);
    setHazardWeight(35);
    setSoilWeight(20);
    setEvidenceWeight(10);
    setHistoricalWeight(10);
    showToast('WEIGHTS RESTORED', 'Default SIH demo heuristic weights restored.', 'safe');
  };

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Sliders className="w-4 h-4" />
            Governance, Model Configuration & Protocols
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            System Settings & Risk Engine Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Heuristic weighting control for the Prototype Risk Engine and parameters for ML microservices.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ● Platform: EXTRICATE-v4.2-NER
        </div>
      </div>

      {/* Transparent Prototype Risk Engine Banner */}
      <div className="p-5 bg-blue-50 rounded-xl border-l-4 border-l-blue-600 border border-blue-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs text-blue-800 font-bold uppercase">
          <Cpu className="w-4 h-4 text-blue-700" />
          Prototype Risk Engine (Multi-Factor Heuristic)
        </div>
        <p className="text-xs text-blue-900 leading-relaxed">
          <strong>Architecture Notice:</strong> EXTRICATE utilizes a transparent, rule-based prototype risk engine combining real-time meteorological rainfall, ground hazard reports, soil saturation, and field recon. The code is modularly structured so that an external FastAPI or Flask XGBoost / Scikit-learn service can seamlessly plug in without modifying UI consumers.
        </p>
      </div>

      {/* Model Weights Tuner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Risk Engine Heuristic Weight Adjustment
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Adjust the relative influence of environmental and hazard indicators on composite corridor risk scores.
        </p>

        <form onSubmit={handleSaveWeights} className="space-y-5 text-xs max-w-2xl">
          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Rainfall & Precipitation Factor Weight</span>
              <span className="text-blue-700 font-bold">{rainWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={rainWeight}
              onChange={(e) => setRainWeight(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Severe Incident & Landslide Blockade Weight</span>
              <span className="text-red-600 font-bold">{hazardWeight}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              value={hazardWeight}
              onChange={(e) => setHazardWeight(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Soil Saturation & Moisture Index Weight</span>
              <span className="text-amber-600 font-bold">{soilWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={soilWeight}
              onChange={(e) => setSoilWeight(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Verified Field Evidence Density Weight</span>
              <span className="text-emerald-700 font-bold">{evidenceWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={evidenceWeight}
              onChange={(e) => setEvidenceWeight(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-700 mb-1.5 font-medium">
              <span>Historical Geological Vulnerability Weight</span>
              <span className="text-slate-700 font-bold">{historicalWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={historicalWeight}
              onChange={(e) => setHistoricalWeight(Number(e.target.value))}
              className="w-full accent-slate-600"
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase transition-all shadow-sm"
            >
              Save Heuristic Calibration
            </button>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold uppercase border border-slate-300 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Defaults
            </button>
          </div>
        </form>
      </div>

      {/* Operational Disclaimer & Authority Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Government Command Integration
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Authorized for disaster logistics simulation and emergency medical supply line management under NDMA (National Disaster Management Authority) guidelines for North Eastern Region (NER) hilly and landslide-prone terrain corridors.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-900 text-sm font-bold">
            <Database className="w-4 h-4 text-blue-600" />
            Data Retention & Cryptographic Audit
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All tactical reroutes and vehicle dispatch directives are logged with SHA-256 state signatures to provide absolute operational accountability during inquiries or post-disaster audits.
          </p>
        </div>
      </div>
    </div>
  );
};
