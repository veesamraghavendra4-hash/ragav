import React from 'react';
import { Languages, Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '../utils/i18n';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'full' | 'dropdown' | 'banner';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { language, setLanguage, t } = useLanguage();

  const options: { code: Language; label: string; native: string; flag: string }[] = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🌱' },
  ];

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1 p-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-md shadow-sm transition-all ${className}`}
        role="group"
        aria-label="Language selection"
      >
        <div className="flex items-center gap-1 px-1.5 text-emerald-400 shrink-0">
          <Languages className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-0.5">
          {options.map((opt) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                title={`${opt.label} (${opt.native})`}
                aria-pressed={isActive}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-950/40 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{opt.native}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`w-full max-w-md mx-auto p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl backdrop-blur-xl shadow-xl ${className}`}>
        <div className="text-[11px] text-center font-medium text-emerald-300/90 mb-1.5 flex items-center justify-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{t('brand.chooseLanguage')} / भाषा चुनें / భాషను ఎంచుకోండి</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {options.map((opt) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 border ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 to-lime-400 text-slate-950 font-bold border-emerald-300 shadow-lg shadow-emerald-950/50 scale-[1.03]'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-sm font-bold leading-tight">{opt.native}</span>
                <span className={`text-[10px] ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Variant === 'full'
  return (
    <div className={`flex flex-col gap-2 p-3 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
        <Globe className="w-4 h-4" />
        <span>Select Display Language / भाषा / భాష</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => {
          const isActive = language === opt.code;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 border ${
                isActive
                  ? 'bg-emerald-400 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-950/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isActive && <Check className="w-3.5 h-3.5 text-slate-950 shrink-0" />}
              <div>
                <div className="font-bold">{opt.native}</div>
                <div className={`text-[9px] ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{opt.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
