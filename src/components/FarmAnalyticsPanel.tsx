import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Droplets,
  Coins,
  Sprout,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';

export const FarmAnalyticsPanel: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Agronomic Yield & Resource Efficiency</span>
            <span>·</span>
            <span>వ్యవసాయ విశ్లేషణలు</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Farm Analytics & Resource Optimization
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Seasonal harvest yield predictions, cumulative water conservation, and input cost versus market margin analysis.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Efficiency Rating: 94.2%</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400">Total Projected Harvest</span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">3,640 kg</div>
          <div className="text-xs text-emerald-400">+12% vs last season</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400">Water Conserved</span>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono">142,000 L</div>
          <div className="text-xs text-cyan-400">38% saved via pulse drip</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400">Input Cost / Acre</span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono">₹14,200</div>
          <div className="text-xs text-emerald-400">-18% organic savings</div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
          <span className="text-xs text-slate-400">Estimated Net Revenue</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">₹1,84,500</div>
          <div className="text-xs text-amber-300">Based on ₹1,850/Qtl mandi rate</div>
        </div>
      </div>

      {/* Seasonal Crop Yield Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-white font-display flex items-center justify-between">
          <span>Crop Yield Distribution (7 Active Beds)</span>
          <span className="text-xs text-slate-400 font-mono">Updated Sep 2026</span>
        </h3>

        <div className="space-y-4">
          {[
            { crop: 'Roma & Vine Tomatoes (Beds 3 & 5)', yieldKg: 1230, pct: 88, status: 'Peak Harvest in 8d' },
            { crop: 'Golden Sweet Maize (Bed 7)', yieldKg: 890, pct: 75, status: 'Tasseling Phase' },
            { crop: 'Heirloom & Beta Carrots (Beds 2 & 6)', yieldKg: 790, pct: 68, status: 'Root Bulking' },
            { crop: 'Savoy & Butterhead Cabbages (Beds 1 & 4)', yieldKg: 730, pct: 95, status: 'Harvesting Now' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{item.crop}</span>
                <span className="font-mono text-emerald-400 font-bold">{item.yieldKg} kg ({item.status})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-lime-400 h-2 rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
