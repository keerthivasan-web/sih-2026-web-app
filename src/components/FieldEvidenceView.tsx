import React, { useState } from 'react';
import { useCommand } from '../context/CommandContext';
import { EvidenceItem } from '../types';
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Search, 
  Bot, 
  MapPin, 
  Clock
} from 'lucide-react';

export const FieldEvidenceView: React.FC = () => {
  const { evidence, verifyEvidence, rejectEvidence, duplicateEvidence, showToast } = useCommand();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(evidence[0]);

  const filteredEvidence = evidence.filter(e => {
    const matchesSearch = 
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.locationName.toLowerCase().includes(search.toLowerCase()) ||
      e.aiDetectionLabel.toLowerCase().includes(search.toLowerCase()) ||
      e.reporter.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || e.verificationStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full space-y-5 pb-16">
      {/* Header */}
      <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wide">
            <Camera className="w-4 h-4" />
            Ground Recon & Computer Vision Evidence
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Field Evidence Review & Hazard Validation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifying ground truth photos from field patrols, UAV surveys, and local emergency personnel.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            {evidence.filter(e => e.verificationStatus === 'VERIFIED').length} Verified Ground Proofs
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, location, AI label, or observer..."
            className="w-full bg-transparent text-slate-900 text-xs outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-800 border border-slate-200 outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
            <option value="DUPLICATE">Duplicate</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Evidence Cards List (Left 8 cols) + Detail Inspection (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Evidence List */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvidence.map((item) => {
            const isSelected = selectedEvidence?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedEvidence(item)}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative bg-white shadow-sm ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="relative h-44 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.description}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.verificationStatus === 'VERIFIED' ? 'bg-emerald-600 text-white' :
                        item.verificationStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {item.id} • {item.verificationStatus}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs text-slate-800 shadow-sm">
                      <span className="flex items-center gap-1 text-blue-700 font-semibold">
                        <Bot className="w-3.5 h-3.5" />
                        {item.aiDetectionLabel}
                      </span>
                      <span className="text-emerald-700 font-bold">{item.aiConfidencePct}% Conf</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {item.locationName}
                    </h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.reporter}</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                {/* Direct Action Strip */}
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      verifyEvidence(item.id);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 border border-emerald-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      rejectEvidence(item.id);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1 border border-red-200"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateEvidence(item.id);
                    }}
                    className="p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-all"
                    title="Mark Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Evidence Detail Pane */}
        {selectedEvidence && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] text-blue-700 font-bold uppercase">
                    Evidence Proof Dossier
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {selectedEvidence.id}
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedEvidence.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                  selectedEvidence.verificationStatus === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'
                }`}>
                  {selectedEvidence.verificationStatus}
                </span>
              </div>

              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 h-52 bg-slate-100">
                <img 
                  src={selectedEvidence.imageUrl} 
                  alt={selectedEvidence.description} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="mt-4 space-y-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>AI Model Classification:</span>
                    <span className="text-blue-700 font-bold">{selectedEvidence.aiDetectionLabel}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Inference Confidence:</span>
                    <span className="text-emerald-700 font-bold">{selectedEvidence.aiConfidencePct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Corridor Link:</span>
                    <span className="text-slate-900 font-semibold">{selectedEvidence.routeName}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>GPS Coordinates:</span>
                    <span className="text-slate-900">{selectedEvidence.coordinates.lat.toFixed(4)}°N, {selectedEvidence.coordinates.lng.toFixed(4)}°E</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Observer:</span>
                    <span className="text-slate-900 font-semibold">{selectedEvidence.reporter}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Report Time:</span>
                    <span className="text-slate-500">{selectedEvidence.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-slate-500 font-bold uppercase">Field Narrative:</span>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {selectedEvidence.description}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => verifyEvidence(selectedEvidence.id)}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify & Update Corridor Risk
              </button>
              <button
                onClick={() => rejectEvidence(selectedEvidence.id)}
                className="w-full py-2 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 text-xs font-bold uppercase transition-all border border-slate-300 hover:border-red-300 flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject as False Positive
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
