import React from 'react';
import {
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Wind,
  Droplets,
  Camera,
  Compass,
  Sparkles,
  ChevronRight,
  LogIn,
  MapPin,
  UserCheck,
} from 'lucide-react';
import { TimeOfDay, CameraPreset } from './FarmScene3D';
import { FarmerUser } from './PhoneLoginModal';
import { useLanguage } from '../utils/i18n';

interface HeroOverlayProps {
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  cameraPreset: CameraPreset;
  onChangeCameraPreset: (preset: CameraPreset) => void;
  windSpeed: number;
  onChangeWindSpeed: (speed: number) => void;
  irrigationActive: boolean;
  onToggleIrrigation: () => void;
  onExploreField: () => void;
  selectedFeature: { name: string; category: string; description: string; stat?: string } | null;
  onDismissFeature: () => void;
  loggedInUser?: FarmerUser | null;
  onOpenLoginModal?: () => void;
}

export const HeroOverlay: React.FC<HeroOverlayProps> = ({
  timeOfDay,
  onChangeTimeOfDay,
  cameraPreset,
  onChangeCameraPreset,
  windSpeed,
  onChangeWindSpeed,
  irrigationActive,
  onToggleIrrigation,
  onExploreField,
  selectedFeature,
  onDismissFeature,
  loggedInUser,
  onOpenLoginModal,
}) => {
  const { t, language } = useLanguage();

  const timePresets: { id: TimeOfDay; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'dawn', labelKey: 'hero.time.dawn', icon: <Sunrise className="w-3.5 h-3.5" /> },
    { id: 'noon', labelKey: 'hero.time.noon', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'golden', labelKey: 'hero.time.golden', icon: <Sunset className="w-3.5 h-3.5" /> },
    { id: 'twilight', labelKey: 'hero.time.twilight', icon: <Moon className="w-3.5 h-3.5" /> },
  ];

  const cameraOptions: { id: CameraPreset; labelKey: string }[] = [
    { id: 'hero', labelKey: 'hero.cam.hero' },
    { id: 'farmer', labelKey: 'hero.cam.farmer' },
    { id: 'barn', labelKey: 'hero.cam.barn' },
    { id: 'tractor', labelKey: 'hero.cam.tractor' },
    { id: 'orbit', labelKey: 'hero.cam.orbit' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 pt-24 md:pt-28 z-20">
      {/* Top / Main Hero Content Area */}
      <div className="max-w-2xl mt-4 lg:mt-8 pointer-events-auto">
        {/* Metadata Kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
          <span>{t('hero.kicker')}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.08] text-balance">
          {language === 'en' ? (
            <>
              Cultivating Tomorrow <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-lime-300">
                from the Soil Up.
              </span>
            </>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-lime-300">
              {t('hero.title')}
            </span>
          )}
        </h1>

        {/* Hero Body Copy */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
          {t('hero.desc')}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onChangeCameraPreset('farmer')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-950/40 transition-all cursor-pointer group"
          >
            <span>{t('hero.observeFarmer')}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={onExploreField}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-900/80 border border-white/15 backdrop-blur-md rounded-xl transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t('hero.fieldSpecs')}</span>
          </button>

          {/* Front-Page Login or Profile Status */}
          {loggedInUser ? (
            <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 backdrop-blur-md rounded-xl">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {loggedInUser.name} · {loggedInUser.location}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/30 backdrop-blur-md rounded-xl transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-emerald-300" />
              <span>{t('auth.login')}</span>
            </button>
          )}
        </div>

        {/* Metrics Bar */}
        <div className="mt-8 flex items-center gap-6 text-xs text-slate-400 border-t border-white/10 pt-4">
          <div>
            <div className="text-sm font-bold text-white tabular-nums">42% {t('hero.moisture')}</div>
            <div className="text-slate-400">{t('hero.dripHydration')}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-sm font-bold text-white tabular-nums">7 {t('hero.rows')}</div>
            <div className="text-slate-400">{t('hero.cropTypes')}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <div className="text-sm font-bold text-emerald-400 tabular-nums">60 FPS PBR</div>
            <div className="text-slate-400">{t('hero.lighting')}</div>
          </div>
        </div>
      </div>

      {/* Selected 3D Feature Inspection Card */}
      {selectedFeature && (
        <div className="pointer-events-auto self-center lg:self-start lg:ml-2 my-auto bg-[#142318]/90 border border-emerald-500/30 backdrop-blur-xl p-5 rounded-2xl shadow-2xl max-w-md transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span className="font-semibold uppercase tracking-wider">{selectedFeature.category}</span>
            <button
              onClick={onDismissFeature}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
          <h3 className="text-lg font-bold text-white font-display">{selectedFeature.name}</h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">{selectedFeature.description}</p>
          {selectedFeature.stat && (
            <div className="mt-3 pt-2.5 border-t border-white/10 text-xs font-mono tabular-nums text-emerald-300">
              {selectedFeature.stat}
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Control Deck */}
      <div className="pointer-events-auto w-full flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mt-6">
        {/* Left Deck: Camera Presets */}
        <div className="bg-[#0f1710]/85 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl overflow-x-auto max-w-full">
          <div className="px-2 py-1 text-xs text-slate-400 flex items-center gap-1.5 font-medium shrink-0">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t('hero.perspective')}</span>
          </div>
          {cameraOptions.map((cam) => (
            <button
              key={cam.id}
              onClick={() => onChangeCameraPreset(cam.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                cameraPreset === cam.id
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {t(cam.labelKey)}
            </button>
          ))}
        </div>

        {/* Right Deck: Time of Day & Environmental Controls */}
        <div className="bg-[#0f1710]/85 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl flex flex-wrap items-center gap-2 shadow-xl">
          {/* Time of Day Switcher */}
          <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/5">
            {timePresets.map((tItem) => {
              const label = t(tItem.labelKey);
              return (
                <button
                  key={tItem.id}
                  onClick={() => onChangeTimeOfDay(tItem.id)}
                  title={label}
                  className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    timeOfDay === tItem.id
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tItem.icon}
                  <span className="hidden lg:inline">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Irrigation Sprinklers Mist Toggle */}
          <button
            onClick={onToggleIrrigation}
            title={irrigationActive ? t('irrigation.toggleStop') : t('irrigation.toggleTrigger')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              irrigationActive
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 border-white/10 bg-white/5'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('hero.mist')}</span>
          </button>

          {/* Wind Speed Control */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 rounded-xl">
            <Wind className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t('hero.wind')}:</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.2"
              value={windSpeed}
              onChange={(e) => onChangeWindSpeed(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              title={t('hero.wind')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
