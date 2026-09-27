import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  Languages,
  CheckCircle2,
  Save,
  ShieldCheck,
} from 'lucide-react';
import { FarmerUser } from './PhoneLoginModal';
import { useLanguage, Language } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';
import { syncFarmerProfileToCloud, testSupabaseConnection } from '../utils/supabase';

interface FarmProfilePanelProps {
  user: FarmerUser | null;
  onUpdateUser: (updated: FarmerUser) => void;
}

export const FarmProfilePanel: React.FC<FarmProfilePanelProps> = ({ user, onUpdateUser }) => {
  const { t, language, setLanguage } = useLanguage();
  const [name, setName] = useState(user?.name || 'Vignesh Rythu');
  const [phone, setPhone] = useState(user?.phone || '9848023456');
  const [location, setLocation] = useState(user?.location || 'Guntur Agri Zone');
  const [farmSize, setFarmSize] = useState('3.5 Acres');
  const [soilType, setSoilType] = useState('Sandy Clay Loam');
  const [mainCrops, setMainCrops] = useState('Tomato, Chili, Sweet Corn');
  const [irrigationType, setIrrigationType] = useState('Subsurface Drip Irrigation');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<boolean | null>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name,
      phone,
      location,
      token: user?.token || 'profile_updated',
    });

    // Cloud synchronize with user's Supabase database
    const cloudOk = await syncFarmerProfileToCloud({
      name,
      phone,
      location,
      main_crop: mainCrops,
      preferred_language: language,
      farm_size: farmSize,
      soil_type: soilType,
      irrigation_type: irrigationType,
    });
    setCloudSynced(cloudOk);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>{t('profile.subtitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {t('profile.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'te'
              ? 'మీ భూమి వివరాలు వ్యక్తిగత వాతావరణం, నీటిపారుదల చక్రాలు మరియు తెగుళ్ల హెచ్చరికలను నిర్దేశిస్తాయి.'
              : language === 'hi'
              ? 'आपकी भूमि की जानकारी व्यक्तिगत मौसम, सिंचाई चक्र और फसल रोग चेतावनियों को कॉन्फ़िगर करती है।'
              : 'Your land parameters configure personalized weather thresholds, irrigation cycles, and disease vulnerability alerts.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <LanguageSelector variant="compact" />

          {/* Supabase Database Connection Badge */}
          <div
            title="Connected to Supabase Project: qcffuxdxuqsplxxiebba"
            className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Supabase Cloud Sync</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID #AP-GNT-2026</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2.5 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('profile.success')}</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            {cloudSynced ? 'Cloud Synced (Supabase)' : 'Saved (Local & Cache)'}
          </span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Farmer Name */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.name')}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.mobile')}</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.location')}</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Farm Size */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.farmSize')}</span>
            </label>
            <input
              type="text"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              placeholder="e.g. 3.5 Acres"
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Soil Type */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.soilType')}</span>
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Sandy Clay Loam" className="bg-slate-900">Sandy Clay Loam (సారవంతమైన ఒండ్రు నేల / बलुई दोमट)</option>
              <option value="Black Cotton Soil" className="bg-slate-900">Black Cotton (నల్లరేగడి నేల / काली कपासी मिट्टी)</option>
              <option value="Red Sandy Loam" className="bg-slate-900">Red Sandy Loam (ఎర్ర నేల / लाल रेतीली दोमट)</option>
              <option value="Alluvial Delta Soil" className="bg-slate-900">Alluvial Delta Soil (డెల్టా నేల / जलोढ़ मिट्टी)</option>
            </select>
          </div>

          {/* Irrigation Type */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('profile.irrigation')}</span>
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Subsurface Drip Irrigation" className="bg-slate-900">Subsurface Drip (బిందు సేద్యం / ड्रिप सिंचाई)</option>
              <option value="Micro-Sprinklers" className="bg-slate-900">Micro-Sprinklers (తుంపర సేద్యం / फव्वारा सिंचाई)</option>
              <option value="Furrow Flood Channel" className="bg-slate-900">Furrow Channel (కాలువ నీరు / नाली सिंचाई)</option>
            </select>
          </div>

          {/* Main Crops */}
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.crops')}</span>
            </label>
            <input
              type="text"
              value={mainCrops}
              onChange={(e) => setMainCrops(e.target.value)}
              placeholder="e.g. Tomato, Chili, Sweet Corn, Cabbage"
              className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Preferred Language Switcher */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('profile.prefLang')} (Language / भाषा / భాష)</span>
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full p-2.5 bg-white/5 border border-emerald-500/40 rounded-xl text-sm text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
            >
              <option value="en" className="bg-slate-900 text-white">English (English)</option>
              <option value="hi" className="bg-slate-900 text-white">Hindi (हिंदी)</option>
              <option value="te" className="bg-slate-900 text-white">Telugu (తెలుగు)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {language === 'te'
              ? 'భాషను మార్చడం ద్వారా వెబ్‌సైట్ మొత్తం తక్షణమే ఆ భాషలోకి మారుతుంది.'
              : language === 'hi'
              ? 'भाषा बदलने से पूरी वेबसाइट तुरंत चुनी गई भाषा में बदल जाती है।'
              : 'Changing language instantly converts the entire website to that language.'}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-emerald-950/50"
          >
            <Save className="w-4 h-4" />
            <span>{t('profile.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
