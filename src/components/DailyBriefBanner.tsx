import React, { useState } from 'react';
import { Sun, Droplets, FlaskConical, CloudRain, Sprout, Calendar, CheckSquare, Sparkles, ChevronDown, ChevronUp, Bell } from 'lucide-react';

interface DailyBriefBannerProps {
  farmerName?: string;
  cropName?: string;
  onNavigateTab?: (tab: string) => void;
}

export const DailyBriefBanner: React.FC<DailyBriefBannerProps> = ({
  farmerName = 'Vignesh',
  cropName = 'Tomato',
  onNavigateTab,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#122316]/80 to-slate-900/60 border border-emerald-500/30 backdrop-blur-xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Ambient background accent */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <span className="text-base">🌅</span>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>TODAY'S FARM BRIEF</span>
              <span>·</span>
              <span className="text-slate-400 font-normal">AI Crop Advisory</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Good morning, {farmerName} 🌱
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-emerald-300/90 hidden sm:block bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse brief' : 'Expand brief'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 pt-3 border-t border-white/10 animate-in fade-in duration-200">
          {/* Quick Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Weather</span>
              </div>
              <div className="font-semibold text-white">Mostly Sunny</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Irrigation</span>
              </div>
              <div className="font-semibold text-emerald-300">Rec. at 6:30 AM</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spraying</span>
              </div>
              <div className="font-semibold text-white">7:00–10:00 AM</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                <span>Rain Risk</span>
              </div>
              <div className="font-semibold text-white font-mono">15% Low</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Sprout className="w-3.5 h-3.5 text-lime-400" />
                <span>Crop Health</span>
              </div>
              <div className="font-semibold text-emerald-300">Good (98.6%)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Harvest</span>
              </div>
              <div className="font-semibold text-amber-300">{cropName} – 8d left</div>
            </div>
          </div>

          {/* 3 Important Actions for Today */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
            <div className="text-emerald-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>3 Important Actions for Today (నేటి ముఖ్యమైన వ్యవసాయ పనులు):</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-200">
              <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                <span className="font-bold text-emerald-400">1.</span>
                <span>Check {cropName} lower foliage for early fungal spore spots after night dew.</span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                <span className="font-bold text-emerald-400">2.</span>
                <span>Complete 18-minute subsurface drip irrigation cycle before 8:30 AM heat.</span>
              </div>
              <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg">
                <span className="font-bold text-emerald-400">3.</span>
                <span>Review evening relative humidity forecast; delay foliar spray if rain > 40%.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
