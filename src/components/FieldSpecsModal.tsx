import React from 'react';
import { CameraPreset } from './FarmScene3D';
import { X, Sprout, Tractor, Home, Droplets, User, Gauge } from 'lucide-react';

interface FieldSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToPreset: (preset: CameraPreset) => void;
}

export const FieldSpecsModal: React.FC<FieldSpecsModalProps> = ({
  isOpen,
  onClose,
  onJumpToPreset,
}) => {
  if (!isOpen) return null;

  const farmElements = [
    {
      title: 'Active Agronomist & Farmer',
      category: 'Human Care',
      desc: 'Walking naturally between crop furrows in the mid-background with gentle walk cycles, checking foliage health, and watering plants with animated spray droplets.',
      preset: 'farmer' as CameraPreset,
      icon: <User className="w-4 h-4 text-emerald-400" />,
      detail: 'Equipped with straw hat, denim overalls, and brass-nozzled watering can.',
    },
    {
      title: 'Organized Crop Rows & Furrows',
      category: 'Cultivation',
      desc: 'Seven parallel raised loam beds bearing layered savoy cabbages, feathery carrot fronds with orange crowns, ripening bush tomatoes, and tall golden-tasseled sweet corn.',
      preset: 'hero' as CameraPreset,
      icon: <Sprout className="w-4 h-4 text-emerald-400" />,
      detail: 'Responsive sinusoidal wind swaying dynamically reacting to breeze intensity.',
    },
    {
      title: 'Modern Timber Barn & Silo',
      category: 'Farm Infrastructure',
      desc: 'Heritage red timber barn with slate pitched roof, white cross-braced doors, glowing attic loft window, and an adjacent galvanized metal grain silo.',
      preset: 'barn' as CameraPreset,
      icon: <Home className="w-4 h-4 text-emerald-400" />,
      detail: 'Point-light illumination active during twilight and golden hours.',
    },
    {
      title: 'Autonomous Field Tractor',
      category: 'Modern Machinery',
      desc: 'Parked along the perimeter dirt lane: deep-tread rubber tires with vibrant yellow rims, panoramic tinted operator cab, and vertical exhaust stack.',
      preset: 'tractor' as CameraPreset,
      icon: <Tractor className="w-4 h-4 text-emerald-400" />,
      detail: 'Zero-emission electric drivetrain engineered for gentle soil conservation.',
    },
    {
      title: 'Subsurface Drip & Sprinklers',
      category: 'Irrigation',
      desc: 'Matte slate polymer pipelines running down every furrow with brass-tipped micro sprinkler risers emitting real-time particle mist.',
      preset: 'hero' as CameraPreset,
      icon: <Droplets className="w-4 h-4 text-emerald-400" />,
      detail: 'Connected to the elevated timber trestle rainwater reservoir.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111c13] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Spline 3D Scene Architecture
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
              Farm Environment Specifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {farmElements.map((el, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {el.icon}
                  <h4 className="text-sm font-semibold text-white font-display">{el.title}</h4>
                  <span className="text-xs text-slate-400">· {el.category}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">{el.desc}</p>
                <div className="text-[11px] text-emerald-400/90 font-mono">{el.detail}</div>
              </div>

              <button
                onClick={() => {
                  onJumpToPreset(el.preset);
                  onClose();
                }}
                className="self-start sm:self-center px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                Focus Camera
              </button>
            </div>
          ))}
        </div>

        {/* Rendering Pipeline Specs (Tabular Numerals) */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">PBR Materials</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">Roughness + Metalness</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Shadow Map</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">PCF Soft Shadows</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Atmospheric Fog</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">Exponential Depth</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <div className="text-xs text-slate-400">Wind Simulation</div>
            <div className="text-sm font-semibold text-white font-mono mt-0.5">Sinusoidal Vertex Sway</div>
          </div>
        </div>
      </div>
    </div>
  );
};
