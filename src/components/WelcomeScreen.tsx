import React from 'react';
import {
  Sprout,
  ArrowRight,
  LogIn,
  UserPlus,
  CloudSun,
  Droplets,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Bot,
  Compass,
  Leaf,
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface WelcomeScreenProps {
  onOpenSignIn: () => void;
  onOpenLogin: () => void;
  onContinueAsGuest: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenSignIn,
  onOpenLogin,
  onContinueAsGuest,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="relative min-h-screen w-full bg-[#08120a] text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Animated Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft glowing radial gradients */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-emerald-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -left-48 w-[600px] h-[600px] bg-lime-600/12 rounded-full blur-[140px]" />
        <div className="absolute -bottom-24 right-[-10%] w-[750px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px]" />

        {/* Agricultural Furrow & Contour Geometry Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06] text-emerald-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="cropFurrows" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <line x1="0" y1="0" x2="60" y2="0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
              <line x1="0" y1="20" x2="60" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              <line x1="0" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cropFurrows)" />
        </svg>

        {/* Floating Soft Leaves Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { top: '15%', left: '10%', delay: '0s', dur: '7s', rot: '12deg', size: 20 },
            { top: '25%', left: '85%', delay: '1.2s', dur: '8.5s', rot: '-24deg', size: 16 },
            { top: '65%', left: '8%', delay: '2.5s', dur: '9s', rot: '45deg', size: 22 },
            { top: '75%', left: '88%', delay: '0.8s', dur: '7.8s', rot: '-15deg', size: 18 },
            { top: '45%', left: '92%', delay: '3.1s', dur: '8.2s', rot: '30deg', size: 14 },
            { top: '8%', left: '72%', delay: '1.9s', dur: '9.5s', rot: '-35deg', size: 24 },
          ].map((leaf, idx) => (
            <div
              key={idx}
              className="absolute text-emerald-400/25 animate-pulse"
              style={{
                top: leaf.top,
                left: leaf.left,
                transform: `rotate(${leaf.rot})`,
                animationDuration: leaf.dur,
                animationDelay: leaf.delay,
              }}
            >
              <Leaf size={leaf.size} />
            </div>
          ))}

          {/* Glowing Green Particles */}
          {[...Array(24)].map((_, i) => (
            <div
              key={`p_${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/35 blur-[0.5px] animate-pulse"
              style={{
                top: `${(i * 17) % 96}%`,
                left: `${(i * 23) % 94}%`,
                animationDuration: `${3 + (i % 5)}s`,
                animationDelay: `${(i % 7) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation Brand Bar */}
      <header className="relative z-10 w-full px-6 lg:px-16 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-lime-500 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center">
            <div className="w-full h-full bg-[#0a150c] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-white font-display tracking-tight block leading-tight">
              {t('brand.name')}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase block">
              {t('brand.subtitle')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Trilingual Language Selector */}
          <LanguageSelector variant="compact" />

          <button
            onClick={onOpenLogin}
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl transition-colors cursor-pointer hover:bg-white/5"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={onOpenSignIn}
            className="text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02]"
          >
            {t('auth.signIn')}
          </button>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-4xl mx-auto py-12">
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{t('brand.badge')}</span>
        </div>

        {/* Small Brand Subtitle Header */}
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm sm:text-base tracking-wide mb-2">
          <Sprout className="w-4 h-4" />
          <span>{t('brand.name')}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.08] text-balance">
          {language === 'en' ? (
            <>
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-lime-300">
                AI Agriculture Assistant
              </span>
            </>
          ) : (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-200 to-lime-300">
              {t('auth.welcomeTitle')}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed text-balance">
          “{t('brand.tagline')}”
        </p>

        {/* Language Selection Bar for Farmers */}
        <div className="mt-8 w-full max-w-sm">
          <LanguageSelector variant="banner" />
        </div>

        {/* Two Large Buttons with Smooth Hover Animations and Modern Icons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
          <button
            onClick={onOpenSignIn}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-lime-400 hover:from-emerald-300 hover:to-lime-300 shadow-2xl shadow-emerald-950/70 hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.03] cursor-pointer group"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('auth.signIn')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer group"
          >
            <LogIn className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
            <span>{t('auth.login')}</span>
          </button>
        </div>

        {/* Fast-Track Demo Farmer link */}
        <div className="mt-6">
          <button
            onClick={onContinueAsGuest}
            className="text-xs text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer underline underline-offset-4"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('auth.demoFarmer')}</span>
          </button>
        </div>

        {/* Live Feature Highlights in Glassmorphic Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 max-w-3xl text-xs text-slate-300">
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" /> {t('nav.plantDoctor')}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" /> {t('nav.weather')}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> {t('nav.irrigation')}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> {t('nav.market')}
          </span>
        </div>
      </main>

      {/* Small Footer */}
      <footer className="relative z-10 w-full px-6 lg:px-16 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-300">{t('brand.powered')}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          {t('brand.subfooter')}
        </div>
      </footer>
    </div>
  );
};
