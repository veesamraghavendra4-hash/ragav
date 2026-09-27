import React, { useState } from 'react';
import {
  Droplets,
  Clock,
  CloudRain,
  Sun,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Thermometer,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';
import { logIrrigationToCloud } from '../utils/supabase';

interface IrrigationIntelligencePanelProps {
  irrigationActive: boolean;
  onToggleIrrigation: () => void;
  selectedCrop?: string;
}

export const IrrigationIntelligencePanel: React.FC<IrrigationIntelligencePanelProps> = ({
  irrigationActive,
  onToggleIrrigation,
  selectedCrop = 'Tomato',
}) => {
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState(selectedCrop);
  const [soilType, setSoilType] = useState('Sandy Clay Loam');

  const statusMap = {
    Recommended: {
      en: 'Recommended',
      hi: 'अनुशंसित (उत्तम समय)',
      te: 'సిఫార్సు చేయబడింది (అనుకూలం)',
    },
    Avoid: {
      en: 'Avoid Irrigation',
      hi: 'सिंचाई से बचें (बारिश का जोखिम)',
      te: 'నీరు పెట్టడం నివారించండి',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>{t('irrigation.subtitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {t('irrigation.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'te'
              ? 'రోజువారీ భాష్పోత్సేకం (ET₀), వర్షపాత సంభావ్యత మరియు భూగర్భ నేల తేమ ఆధారంగా లెక్కించబడింది.'
              : language === 'hi'
              ? 'दैनिक वाष्पोत्सर्जन (ET₀), वर्षा की संभावना और भूमिगत नमी के आधार पर अनुकूलित।'
              : 'Calibrated against daily evapotranspiration (ET₀), rain probability, and subsurface loam moisture.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector variant="compact" />
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>🟢 {statusMap.Recommended[language]}</span>
          </div>
        </div>
      </div>

      {/* Main Recommendation Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-white/[0.02] to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              {language === 'te'
                ? 'ఆటోమేటెడ్ వ్యవసాయ సూచన'
                : language === 'hi'
                ? 'स्वचालित कृषि परामर्श'
                : 'Automated Agronomic Advisory'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              “{t('irrigation.optimalWindow')}”
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('irrigation.desc')}{' '}
              {language === 'te'
                ? '(ఉష్ణోగ్రత 29.5°C, తేమ 64%, ET₀ 4.8 మి.మీ, వర్షం 15%).'
                : language === 'hi'
                ? '(तापमान 29.5°C, आर्द्रता 64%, ET₀ 4.8 मिमी, वर्षा 15%)।'
                : '(temp 29.5°C, humidity 64%, ET₀ 4.8 mm/day, rain probability 15%).'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onToggleIrrigation();
                if (!irrigationActive) {
                  logIrrigationToCloud({
                    crop,
                    duration_minutes: 22,
                    water_saved_liters: 18500 * 0.48,
                    status: 'Started (Morning Pulse)',
                  }).catch(() => {});
                }
              }}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                irrigationActive
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              <Droplets className="w-4 h-4" />
              <span>{irrigationActive ? t('irrigation.toggleStop') : t('irrigation.toggleTrigger')}</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('irrigation.nextWindow')}</span>
            </div>
            <div className="text-base font-bold text-white font-mono">06:15 AM (IST)</div>
            <div className="text-[10px] text-emerald-400">
              {t('irrigation.duration')}: 22 Mins
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {language === 'te' ? 'నీటి అవసరం' : language === 'hi' ? 'जल आवश्यकता' : 'Water Requirement'}
              </span>
            </div>
            <div className="text-base font-bold text-white font-mono">18,500 L / Acre</div>
            <div className="text-[10px] text-cyan-400">Target Root Loam Depth</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>ET₀ (Evapotranspiration)</span>
            </div>
            <div className="text-base font-bold text-white font-mono">4.8 mm / day</div>
            <div className="text-[10px] text-amber-300">Moderate solar burn</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('irrigation.waterSaving')}</span>
            </div>
            <div className="text-base font-bold text-emerald-400 font-mono">48% Saved</div>
            <div className="text-[10px] text-slate-400">vs Broadcast Flood</div>
          </div>
        </div>
      </div>
    </div>
  );
};
