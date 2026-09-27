import React, { useState } from 'react';
import { Sprout, Droplets, Camera, Check, Calendar, AlertCircle } from 'lucide-react';
import { CameraPreset } from './FarmScene3D';

interface CropRow {
  id: number;
  rowNumber: number;
  cropName: string;
  variety: string;
  stage: 'Vegetative' | 'Root Sizing' | 'Flowering' | 'Fruiting' | 'Harvest Ready';
  plantedDate: string;
  daysToHarvest: number;
  healthScore: number;
  moistureNeed: 'Optimal' | 'Pulse Needed' | 'Saturated';
  yieldEstKg: number;
  cameraPreset: CameraPreset;
}

interface OrganizedCropsPanelProps {
  onFocusRowIn3D: (preset: CameraPreset) => void;
  onTriggerRowWater: (rowId: number) => void;
}

export const OrganizedCropsPanel: React.FC<OrganizedCropsPanelProps> = ({
  onFocusRowIn3D,
  onTriggerRowWater,
}) => {
  const [rows, setRows] = useState<CropRow[]>([
    {
      id: 1,
      rowNumber: 1,
      cropName: 'Savoy Cabbage',
      variety: 'Emerald Crisp Heirloom',
      stage: 'Vegetative',
      plantedDate: 'Aug 14, 2026',
      daysToHarvest: 18,
      healthScore: 99,
      moistureNeed: 'Optimal',
      yieldEstKg: 420,
      cameraPreset: 'hero',
    },
    {
      id: 2,
      rowNumber: 2,
      cropName: 'Heirloom Carrots',
      variety: 'Kuroda Deep Orange',
      stage: 'Root Sizing',
      plantedDate: 'Jul 28, 2026',
      daysToHarvest: 24,
      healthScore: 97,
      moistureNeed: 'Optimal',
      yieldEstKg: 380,
      cameraPreset: 'hero',
    },
    {
      id: 3,
      rowNumber: 3,
      cropName: 'Bush Roma Tomatoes',
      variety: 'San Marzano Hybrid',
      stage: 'Fruiting',
      plantedDate: 'Jul 10, 2026',
      daysToHarvest: 12,
      healthScore: 95,
      moistureNeed: 'Pulse Needed',
      yieldEstKg: 650,
      cameraPreset: 'farmer',
    },
    {
      id: 4,
      rowNumber: 4,
      cropName: 'Crisp Butterhead Lettuce',
      variety: 'Salinas Butterhead',
      stage: 'Harvest Ready',
      plantedDate: 'Aug 22, 2026',
      daysToHarvest: 2,
      healthScore: 98,
      moistureNeed: 'Optimal',
      yieldEstKg: 310,
      cameraPreset: 'hero',
    },
    {
      id: 5,
      rowNumber: 5,
      cropName: 'Heritage Vine Tomatoes',
      variety: 'Cherokee Purple',
      stage: 'Fruiting',
      plantedDate: 'Jul 04, 2026',
      daysToHarvest: 8,
      healthScore: 96,
      moistureNeed: 'Optimal',
      yieldEstKg: 580,
      cameraPreset: 'farmer',
    },
    {
      id: 6,
      rowNumber: 6,
      cropName: 'Beta Rainbow Carrots',
      variety: 'Cosmic Purple & Amber',
      stage: 'Root Sizing',
      plantedDate: 'Aug 02, 2026',
      daysToHarvest: 30,
      healthScore: 98,
      moistureNeed: 'Optimal',
      yieldEstKg: 410,
      cameraPreset: 'hero',
    },
    {
      id: 7,
      rowNumber: 7,
      cropName: 'Tall Golden Sweet Maize',
      variety: 'Inca Gold Sugar Sweet',
      stage: 'Flowering',
      plantedDate: 'Jun 25, 2026',
      daysToHarvest: 21,
      healthScore: 99,
      moistureNeed: 'Optimal',
      yieldEstKg: 890,
      cameraPreset: 'tractor',
    },
  ]);

  const [wateredRows, setWateredRows] = useState<Record<number, boolean>>({});

  const handlePulseWater = (rowId: number) => {
    onTriggerRowWater(rowId);
    setWateredRows((prev) => ({ ...prev, [rowId]: true }));
    setTimeout(() => {
      setWateredRows((prev) => ({ ...prev, [rowId]: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Organized Crop Row Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time phenological growth stages, yield forecasts, and individual row drip controls.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>7 Active Loam Beds</span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono">3,640 kg Total Yield Forecast</span>
        </div>
      </div>

      {/* Row List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div
            key={row.id}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-emerald-400 font-bold">
                  Bed #{row.rowNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    row.stage === 'Harvest Ready'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : row.stage === 'Fruiting'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-slate-300 border border-white/5'
                  }`}
                >
                  {row.stage}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-display">{row.cropName}</h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{row.variety}</div>

              {/* Progress to Harvest */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Harvest countdown</span>
                  <span className="font-mono text-white font-semibold">
                    {row.daysToHarvest === 0 ? 'Today!' : `${row.daysToHarvest} days left`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-1.5 rounded-full"
                    style={{
                      width: `${Math.max(10, Math.min(100, 100 - row.daysToHarvest * 3.5))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Health Rating:</span>
                  <div className="font-mono font-bold text-emerald-400 tabular-nums">
                    {row.healthScore}% Optimal
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Estimated Yield:</span>
                  <div className="font-mono font-bold text-white tabular-nums">
                    {row.yieldEstKg} kg
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <button
                onClick={() => onFocusRowIn3D(row.cameraPreset)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>View in 3D</span>
              </button>

              <button
                onClick={() => handlePulseWater(row.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  wateredRows[row.id]
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{wateredRows[row.id] ? 'Pulsing Water...' : 'Pulse Drip'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
