import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  LogIn,
  UserCheck,
  MapPin,
  LogOut,
  LayoutGrid,
  Mic,
  Sprout,
  CloudSun,
  Droplets,
  FlaskConical,
  TrendingUp,
  Tractor,
  Layers,
  BarChart3,
  User,
  ShieldAlert,
  Compass,
  X,
  Sparkles,
  Clock,
} from 'lucide-react';
import { farmAudio } from '../utils/audioEngine';
import { FarmerUser } from './PhoneLoginModal';
import { useISTLiveTime } from '../utils/istTime';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

export type AppPage =
  | 'today'
  | 'farm3d'
  | 'plantDoctor'
  | 'weather'
  | 'irrigation'
  | 'crops'
  | 'pesticide'
  | 'market'
  | 'machinery'
  | 'soil'
  | 'analytics'
  | 'profile';

interface NavbarProps {
  currentPage: AppPage;
  onNavigatePage: (page: AppPage) => void;
  isUiHidden: boolean;
  onToggleUiHidden: () => void;
  onOpenSpecsModal: () => void;
  loggedInUser: FarmerUser | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenVoiceAssistant: () => void;
  onOpenLocationModal: () => void;
  onOpenEmergencyHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigatePage,
  isUiHidden,
  onToggleUiHidden,
  onOpenSpecsModal,
  loggedInUser,
  onOpenLoginModal,
  onLogout,
  onOpenVoiceAssistant,
  onOpenLocationModal,
  onOpenEmergencyHelp,
}) => {
  const { t, language } = useLanguage();
  const [soundOn, setSoundOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ist = useISTLiveTime(5000);

  const handleSoundToggle = () => {
    const active = farmAudio.toggle();
    setSoundOn(active);
  };

  // 12 Core Agriculture Control Center Modules with trilingual support
  const navModules = [
    {
      id: 'today',
      label: `${ist.emoji} ${t('module.today.title')}`,
      sub: `${ist.timeString12} IST · ${t('module.today.desc')}`,
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigatePage('today');
        setMenuOpen(false);
      },
    },
    {
      id: 'plantDoctor',
      label: t('module.plantDoctor.title'),
      sub: t('module.plantDoctor.desc'),
      icon: <Sprout className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigatePage('plantDoctor');
        setMenuOpen(false);
      },
    },
    {
      id: 'weather',
      label: t('module.weather.title'),
      sub: t('module.weather.desc'),
      icon: <CloudSun className="w-5 h-5 text-cyan-400" />,
      action: () => {
        onNavigatePage('weather');
        setMenuOpen(false);
      },
    },
    {
      id: 'irrigation',
      label: t('module.irrigation.title'),
      sub: t('module.irrigation.desc'),
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      action: () => {
        onNavigatePage('irrigation');
        setMenuOpen(false);
      },
    },
    {
      id: 'crops',
      label: t('module.crops.title'),
      sub: t('module.crops.desc'),
      icon: <Sprout className="w-5 h-5 text-lime-400" />,
      action: () => {
        onNavigatePage('crops');
        setMenuOpen(false);
      },
    },
    {
      id: 'pesticide',
      label: t('module.pesticide.title'),
      sub: t('module.pesticide.desc'),
      icon: <FlaskConical className="w-5 h-5 text-purple-400" />,
      action: () => {
        onNavigatePage('pesticide');
        setMenuOpen(false);
      },
    },
    {
      id: 'market',
      label: t('module.market.title'),
      sub: t('module.market.desc'),
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      action: () => {
        onNavigatePage('market');
        setMenuOpen(false);
      },
    },
    {
      id: 'machinery',
      label: t('module.machinery.title'),
      sub: t('module.machinery.desc'),
      icon: <Tractor className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigatePage('machinery');
        setMenuOpen(false);
      },
    },
    {
      id: 'soil',
      label: t('module.soil.title'),
      sub: t('module.soil.desc'),
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      action: () => {
        onNavigatePage('soil');
        setMenuOpen(false);
      },
    },
    {
      id: 'analytics',
      label: t('module.analytics.title'),
      sub: t('module.analytics.desc'),
      icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
      action: () => {
        onNavigatePage('analytics');
        setMenuOpen(false);
      },
    },
    {
      id: 'voice',
      label: t('module.voice.title'),
      sub: t('module.voice.desc'),
      icon: <Mic className="w-5 h-5 text-emerald-400" />,
      action: () => {
        setMenuOpen(false);
        onOpenVoiceAssistant();
      },
    },
    {
      id: 'location',
      label: t('module.location.title'),
      sub: t('module.location.desc'),
      icon: <MapPin className="w-5 h-5 text-emerald-400" />,
      action: () => {
        setMenuOpen(false);
        onOpenLocationModal();
      },
    },
    {
      id: 'profile',
      label: t('module.profile.title'),
      sub: t('module.profile.desc'),
      icon: <User className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigatePage('profile');
        setMenuOpen(false);
      },
    },
    {
      id: 'farm3d',
      label: t('module.farm3d.title'),
      sub: t('module.farm3d.desc'),
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      action: () => {
        onNavigatePage('farm3d');
        setMenuOpen(false);
      },
    },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-6 lg:px-12 py-3 bg-[#0d160e]/92 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        {/* Left: Brand Logo & Control Center Launcher Button */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigatePage('today');
            }}
            className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-white hover:text-emerald-300 transition-colors font-display shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-4 h-4" />
            </div>
            <span>{t('brand.name')}</span>
          </a>

          {/* Master Control Menu Trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              menuOpen
                ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t('nav.modules')} (12)</span>
            <span className="sm:hidden">{t('nav.menu')}</span>
          </button>
        </div>

        {/* Center: Clean Core Quick Links */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onNavigatePage('today')}
            className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentPage === 'today' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <span>{t('nav.today')}</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
              {ist.timeString12}
            </span>
          </button>

          <button
            onClick={() => onNavigatePage('farm3d')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'farm3d' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            {t('nav.farm3d')}
          </button>

          <button
            onClick={() => onNavigatePage('weather')}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              currentPage === 'weather' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <span>{t('nav.weather')}</span>
            <span className="text-[10px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-emerald-300">
              {language === 'en' ? 'Weather' : language === 'hi' ? 'मौसम' : 'వాతావరణం'}
            </span>
          </button>

          <button
            onClick={() => onNavigatePage('plantDoctor')}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
              currentPage === 'plantDoctor' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            <span>{t('nav.plantDoctor')}</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              {language === 'te' ? 'రైతు డాక్టర్' : language === 'hi' ? 'पौधा डॉक्टर' : 'AI Doctor'}
            </span>
          </button>

          <button
            onClick={() => onNavigatePage('irrigation')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'irrigation' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            {t('nav.irrigation')}
          </button>

          <button
            onClick={() => onNavigatePage('market')}
            className={`transition-colors cursor-pointer ${
              currentPage === 'market' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
            }`}
          >
            {t('nav.market')}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trilingual Switcher (English | हिंदी | తెలుగు) */}
          <LanguageSelector variant="compact" />

          {/* Live Indian Standard Time (IST) Clock Badge */}
          <div
            title={`Indian Standard Time: ${ist.timeString} · ${ist.greeting} (${ist.period})`}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-white font-semibold">{ist.timeString12}</span>
            <span className="text-[10px] text-emerald-400 uppercase">IST</span>
          </div>

          {/* Voice AI Trigger */}
          <button
            onClick={onOpenVoiceAssistant}
            title={t('module.voice.desc')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">{t('nav.voiceAi')}</span>
          </button>

          {/* Procedural Nature Audio Ambience */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute nature ambience' : 'Play peaceful farm breeze & birdsong'}
            className={`flex items-center gap-1 p-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
              soundOn
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Toggle UI Clean Mode for 3D View */}
          {currentPage === 'farm3d' && (
            <button
              onClick={onToggleUiHidden}
              title={isUiHidden ? t('nav.showUi') : t('nav.clean')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl transition-colors cursor-pointer"
            >
              {isUiHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isUiHidden ? t('nav.showUi') : t('nav.clean')}</span>
            </button>
          )}

          {/* Farmer Profile Badge or Login */}
          {loggedInUser ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 pl-2.5 pr-1.5 py-1 rounded-xl">
              <button
                onClick={() => onNavigatePage('profile')}
                className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-white truncate max-w-[80px] sm:max-w-[110px]">
                    {loggedInUser.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono truncate max-w-[80px] sm:max-w-[110px]">
                    {loggedInUser.location}
                  </span>
                </div>
              </button>

              <button
                onClick={onLogout}
                title={t('nav.logout')}
                className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.login')}</span>
            </button>
          )}
        </div>
      </header>

      {/* MASTER MODULES LAUNCHER MODAL */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#0c150e] border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <span>{t('brand.name')}</span>
                  <span>·</span>
                  <span className="text-white font-mono">{ist.timeString}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                  {t('module.modal.title')}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <LanguageSelector variant="compact" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {navModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={mod.action}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3.5 group ${
                    currentPage === mod.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md'
                      : 'bg-white/[0.02] border-white/10 hover:border-emerald-500/40 hover:bg-white/5'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {mod.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display group-hover:text-emerald-300">
                      {mod.label}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{mod.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Action Tools Bar */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLocationModal();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('btn.changeLocation')}</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenVoiceAssistant();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('btn.openVoiceAi')}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenEmergencyHelp();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('btn.emergencyHelp')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
