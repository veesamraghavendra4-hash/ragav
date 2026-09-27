import React, { useState } from 'react';
import {
  X,
  Droplets,
  Gauge,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  Waves,
  Calendar,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';

interface IrrigationIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  irrigationActive: boolean;
  onToggleIrrigation: () => void;
}

export const IrrigationIntelligenceModal: React.FC<IrrigationIntelligenceModalProps> = ({
  isOpen,
  onClose,
  irrigationActive,
  onToggleIrrigation,
}) => {
  const [selectedZone, setSelectedZone] = useState<number>(1);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(true);
  const [dripRate, setDripRate] = useState(4.2); // L/min

  if (!isOpen) return null;

  const zones = [
    { id: 1, name: 'Zone A — Tomato & Chilli Bed', crop: 'Tomato (Heritage)', moisture: 68, target: 70, status: 'Optimal', nextRun: '06:30 AM' },
    { id: 2, name: 'Zone B — Sweet Corn Rows', crop: 'Sweet Corn (Golden Bantam)', moisture: 54, target: 65, status: 'Needs Water', nextRun: 'Now' },
    { id: 3, name: 'Zone C — Savoy Cabbage Bed', crop: 'Savoy Cabbage', moisture: 72, target: 70, status: 'Optimal', nextRun: 'Tomorrow 06:00 AM' },
    { id: 4, name: 'Zone D — Bell Pepper & Eggplant', crop: 'Bell Pepper & Eggplant', moisture: 61, target: 65, status: 'Good', nextRun: '07:15 AM' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0f1b11]/95 border border-emerald-500/30 rounded-2xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] text-slate-100">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>SMART IRRIGATION INTELLIGENCE</span>
              <span>·</span>
              <span>నీటి పారుదల సమాచారం</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Subsurface Drip & Precision Water Management
            </h2>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Main Drip Pump</span>
              <span className={`w-2 h-2 rounded-full ${irrigationActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {irrigationActive ? 'ACTIVE (రన్నింగ్)' : 'STANDBY (స్టాండ్‌బై)'}
            </div>
            <button
              onClick={onToggleIrrigation}
              className={`mt-2 w-full py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                irrigationActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              {irrigationActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{irrigationActive ? 'Pause Drip' : 'Start Drip'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[11px] text-slate-400">Rainwater Reservoir</div>
            <div className="text-lg font-bold text-cyan-300 mt-1 font-mono">38,500 L</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
              <span>Capacity: 85.5%</span>
              <span className="text-emerald-400">Optimal</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[11px] text-slate-400">System Flow Rate</div>
            <div className="text-lg font-bold text-white mt-1 font-mono">{dripRate} L/min</div>
            <div className="text-[11px] text-slate-400 mt-1">Operating pressure: 1.8 Bar</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-[11px] text-slate-400">Water Conservation</div>
            <div className="text-lg font-bold text-emerald-300 mt-1 font-mono">42.8% Saved</div>
            <div className="text-[11px] text-slate-400 mt-1">vs traditional flood irrigation</div>
          </div>
        </div>

        {/* Soil Moisture Depth Profile */}
        <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>Multi-Depth Root-Zone Moisture Sensors (రూట్ జోన్ నేల తేమ)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Calibrated: 15 min ago</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Surface Layer (0–15 cm)</span>
                <span className="font-mono text-cyan-300 font-bold">64%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '64%' }} />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Aeration level: 18% (Good)</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Active Root Zone (15–30 cm)</span>
                <span className="font-mono text-emerald-300 font-bold">71%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '71%' }} />
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">Optimal nutrient uptake range</div>
            </div>

            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Deep Subsoil (30–60 cm)</span>
                <span className="font-mono text-blue-300 font-bold">78%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Stable capillary reservoir</div>
            </div>
          </div>
        </div>

        {/* Interactive Zone Management */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Drip Irrigation Field Zones (పొలంలోని డ్రిప్ జోన్లు)</span>
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">AI Auto-Scheduling:</span>
              <button
                onClick={() => setAutoScheduleEnabled(!autoScheduleEnabled)}
                className={`px-2.5 py-0.5 rounded-full font-semibold transition-colors cursor-pointer ${
                  autoScheduleEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {autoScheduleEnabled ? 'ENABLED' : 'MANUAL'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedZone === zone.id
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                    <p className="text-[11px] text-slate-400">{zone.crop}</p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      zone.status === 'Optimal'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : zone.status === 'Good'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300 animate-pulse'
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    Moisture: <span className="font-mono text-white font-bold">{zone.moisture}%</span>
                    <span className="text-[10px] text-slate-500 ml-1">/ {zone.target}% target</span>
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Run: {zone.nextRun}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Footer */}
        <div className="mt-6 p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-slate-300 flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">AI Evapotranspiration (ET0) Advisory: </span>
            With tomorrow's peak noon temperature forecast of 34°C, a 22-minute subsurface drip cycle at 06:15 AM
            is recommended to maintain optimum stomatal conductivity without evaporation losses.
          </div>
        </div>
      </div>
    </div>
  );
};
