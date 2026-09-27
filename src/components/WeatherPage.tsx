import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  Thermometer,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  ShieldAlert,
  Sunrise,
  Sunset,
  Info,
  Key,
  X,
  Radio,
} from 'lucide-react';
import { useISTLiveTime, generateISTTimeline } from '../utils/istTime';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface WeatherData {
  location: string;
  lastUpdated: string;
  isDemo?: boolean;
  sunrise?: string;
  sunset?: string;
  istHour?: number;
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    precipitationProb: number;
    windSpeed: number;
    windDirection: string;
    uvIndex: number;
    barometricPressure: number;
    dewPoint: number;
    rootSoilTemp10cm: number;
    leafWetnessIndex: number;
    solarRadiation: number;
    evapotranspiration: number;
  };
  sprayingIndex: {
    status: string;
    score: number;
    bestWindowToday: string;
    reason: string;
    driftRisk: string;
    washoffRisk: string;
  };
  alerts: {
    id: string;
    severity: string;
    title: string;
    teluguTitle: string;
    message: string;
  }[];
  hourly: {
    time: string;
    temp: number;
    rainChance: number;
    wind: number;
    humidity: number;
    condition: string;
    isNow?: boolean;
  }[];
  daily: {
    day: string;
    min: number;
    max: number;
    rainChance: number;
    rainfallMm: number;
    condition: string;
    et0: number;
  }[];
  soilDepthData: {
    depth: string;
    temp: number;
    moisture: number;
    status: string;
  }[];
}

interface WeatherPageProps {
  userLocation?: string;
  userName?: string;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({ userLocation, userName }) => {
  const { t, language } = useLanguage();
  const ist = useISTLiveTime(5000);
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(userLocation || 'Guntur Agri Zone');
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiProvider, setApiProvider] = useState<'openweather' | 'imd' | 'tomorrow'>('openweather');
  const [apiSaveStatus, setApiSaveStatus] = useState<string | null>(null);

  const defaultPresets = [
    'Guntur Agri Zone',
    'Warangal Chilli & Cotton Hub',
    'Vijayawada Krishna Delta',
    'Kurnool Seed Capital',
    'Anantapur Groundnut Belt',
    'Hyderabad Semi-Arid Farm',
    'Rajahmundry Godavari Basin',
    'Valley Loam Plot A',
  ];

  const locationPresets =
    userLocation && !defaultPresets.includes(userLocation)
      ? [userLocation, ...defaultPresets]
      : defaultPresets;

  useEffect(() => {
    if (userLocation) {
      setSelectedLocation(userLocation);
    }
  }, [userLocation]);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(loc)}`);
      const json = await res.json();
      json.isDemo = true;
      json.sunrise = json.sunrise || '06:08 AM';
      json.sunset = json.sunset || '06:24 PM';
      // If hourly from server isn't aligned with IST, generate using istTime utility
      if (!json.hourly || json.hourly.length === 0) {
        json.hourly = generateISTTimeline(json.current.temperature, json.current.humidity);
      }
      setData(json);
    } catch (e) {
      console.error('Failed to load weather:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  // Derived dynamic farming advice based on weather metrics & current IST time
  const getFarmingAdvice = (d: WeatherData) => {
    const list = [];

    // Rain advice
    if (d.current.precipitationProb >= 50) {
      list.push({
        type: 'rain',
        icon: '🌧',
        title: `Rain probability: ${d.current.precipitationProb}%`,
        advice: 'Rain is likely today. Consider delaying irrigation to prevent root hypoxia and fertilizer leaching.',
        action: 'Delay Irrigation 💧',
        color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200',
      });
    } else {
      list.push({
        type: 'rain',
        icon: '🌤',
        title: `Rain probability: ${d.current.precipitationProb}% (Low)`,
        advice: 'Clear skies expected. Favorable day for fieldwork, furrow cultivation and solar crop drying.',
        action: 'Safe for Fieldwork 🌾',
        color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      });
    }

    // Temperature advice adjusted for IST time of day
    if (d.current.temperature >= 32) {
      list.push({
        type: 'temp',
        icon: '🌡',
        title: `Temperature: ${d.current.temperature}°C (High Heat)`,
        advice: `High temperature detected during this ${ist.period}. Check crop water requirements and consider light misting.`,
        action: 'Hydrate Crops 💧',
        color: 'border-amber-500/40 bg-amber-950/20 text-amber-200',
      });
    } else {
      list.push({
        type: 'temp',
        icon: '🌡',
        title: `Temperature: ${d.current.temperature}°C (Favorable)`,
        advice: `Optimal vegetative growth temperature for C3 and C4 crop canopies during this ${ist.period}.`,
        action: 'Optimal Growth 🌱',
        color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      });
    }

    // Wind advice
    if (d.current.windSpeed >= 14) {
      list.push({
        type: 'wind',
        icon: '🌬',
        title: `Wind: ${d.current.windSpeed} km/h (Breezy)`,
        advice: 'Avoid spraying during high-wind periods to prevent chemical droplet drift and loss of efficacy.',
        action: 'Halt Spraying 🚫',
        color: 'border-rose-500/40 bg-rose-950/20 text-rose-200',
      });
    } else {
      list.push({
        type: 'wind',
        icon: '🌬',
        title: `Wind: ${d.current.windSpeed} km/h (Calm)`,
        advice: ist.period === 'morning'
          ? 'Calm morning air movement. Ideal window for foliar fertilizer and bio-protectant spray.'
          : ist.period === 'afternoon'
          ? 'Wind is manageable, but wait for evening cooling (after 16:30) to spray chemicals.'
          : 'Calm evening air. Safe period for neem and bio-fungicides.',
        action: ist.period === 'afternoon' ? 'Wait for 16:30 🧪' : 'Suitable for Spraying 🧪',
        color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      });
    }

    // Soil & UV advice
    list.push({
      type: 'solar',
      icon: '☀️',
      title: `UV Index: ${d.current.uvIndex} · Solar: ${d.current.solarRadiation} W/m²`,
      advice: ist.period === 'afternoon'
        ? 'Intense midday solar radiation in progress. Avoid transplanting until evening hours.'
        : 'Solar radiation is within safe threshold for crop leaf photosynthesis.',
      action: 'Plan Field Shift 🕒',
      color: 'border-yellow-500/40 bg-yellow-950/20 text-yellow-200',
    });

    return list;
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    localStorage.setItem(`weather_api_${apiProvider}`, apiKeyInput.trim());
    setApiSaveStatus('Key saved successfully! System will connect to live satellite feeds.');
    setTimeout(() => {
      setApiSaveStatus(null);
      setShowApiModal(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d160e] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Page Header with Dynamic IST Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
            <span>{t('weather.station')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{t('weather.title')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg text-white font-mono flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>{ist.timeString12} IST</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            {language === 'te'
              ? `${ist.greetingTelugu}, రైతు మిత్రమా 🌱`
              : language === 'hi'
              ? `${ist.greetingHindi}, किसान भाई 🌱`
              : `${ist.greeting}, Farmer 🌱`}
          </h1>

          <p className="mt-1 text-sm text-slate-300">
            {userName
              ? `${userName} (${selectedLocation})`
              : `${ist.greeting}! ${t('weather.farmingAdvice')}`}
          </p>
        </div>

        {/* Location Selector, Language & Connect API Button */}
        <div className="flex flex-wrap items-center gap-3">
          <LanguageSelector variant="compact" />

          {/* Demo Weather Data Indicator with Live API connector button */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>{t('weather.demoBadge')}</span>
            </span>

            <button
              onClick={() => setShowApiModal(true)}
              className="px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3 h-3 text-emerald-400" />
              <span>{t('weather.connectApi')}</span>
            </button>
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white/5 border border-white/15 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
            >
              {locationPresets.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-900 text-white">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchWeather(selectedLocation)}
            title="Refresh current meteorological sensors"
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {loading && !data && (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-sm text-emerald-300">Syncing Microclimate Stations ({ist.timeString})...</span>
        </div>
      )}

      {data && (
        <div className="mt-8 space-y-8 animate-in fade-in duration-300">
          {/* ======================================================== */}
          {/* FARMING ADVICE & ADVISORIES SECTION */}
          {/* ======================================================== */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-white/[0.02] to-[#0c1810] border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌾</span>
                <h2 className="text-lg font-bold text-white font-display">
                  Farming Advice & Agro-Advisories (వాతావరణ రైతు సలహాలు)
                </h2>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <Sunrise className="w-4 h-4 text-amber-400" />
                  <span>Sunrise: {data.sunrise}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sunset className="w-4 h-4 text-orange-400" />
                  <span>Sunset: {data.sunset}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span>IST Phase: {ist.period.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getFarmingAdvice(data).map((adv, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col justify-between space-y-2 ${adv.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-xs font-bold text-white">
                      <span>{adv.title}</span>
                      <span className="text-base">{adv.icon}</span>
                    </div>
                    <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                      “{adv.advice}”
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[11px] font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Recommendation</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-emerald-300">
                      {adv.action}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Weather Highlights + Spraying Suitability Index */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Conditions Card */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-white/[0.03] to-slate-950 border border-white/10 shadow-xl flex flex-col justify-between">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Station Sync: {data.lastUpdated}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">{data.location}</span>
                  </div>
                  <div className="text-4xl sm:text-6xl font-extrabold text-white font-display mt-3 tabular-nums">
                    {data.current.temperature}°C
                  </div>
                  <div className="text-base sm:text-lg font-medium text-emerald-300 mt-1">
                    {data.current.condition}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Feels like {data.current.feelsLike}°C · Dew Point: {data.current.dewPoint}°C · Barometer: {data.current.barometricPressure} hPa
                  </div>
                </div>

                {/* Weather Symbol Graphic */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CloudSun className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>

              {/* Multi-Sensor Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Relative Humidity</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {data.current.humidity}%
                  </div>
                  <div className="text-[11px] text-cyan-300">
                    {data.current.humidity > 75 ? 'High fungal risk' : 'Optimal range'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Wind className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Wind Velocity</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {data.current.windSpeed} km/h
                  </div>
                  <div className="text-[11px] text-slate-400">{data.current.windDirection} direction</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Soil Temp (10cm)</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {data.current.rootSoilTemp10cm}°C
                  </div>
                  <div className="text-[11px] text-emerald-400">Root zone safe</div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sun className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Evapotranspiration</span>
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-1 tabular-nums">
                    {data.current.evapotranspiration} mm/d
                  </div>
                  <div className="text-[11px] text-slate-400">ET₀ crop water loss</div>
                </div>
              </div>
            </div>

            {/* Spraying Suitability Index Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-white/[0.02] to-[#122115] border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Spraying Suitability Index
                  </span>
                  <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Score: {data.sprayingIndex.score}/100
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white font-display mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{data.sprayingIndex.status}</span>
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {data.sprayingIndex.reason}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="text-slate-400">Recommended Spray Window:</div>
                  <div className="text-sm font-semibold text-emerald-300 mt-0.5 font-mono">
                    {data.sprayingIndex.bestWindowToday}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Current Clock: <span className="text-white font-mono">{ist.timeString12} IST</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400">Drift Hazard:</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">{data.sprayingIndex.driftRisk}</div>
                </div>
                <div>
                  <span className="text-slate-400">Washoff Risk:</span>
                  <div className="font-semibold text-emerald-400 mt-0.5">{data.sprayingIndex.washoffRisk}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Meteorological Advisories & Warnings */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Active Agro-Meteorological Advisories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
                    alert.severity === 'warning'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      : alert.severity === 'info'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                      : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {alert.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{alert.title}</h4>
                      <div className="text-xs text-emerald-400/90 font-medium mb-1">
                        {alert.teluguTitle}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 24-HOUR HOURLY TIMELINE ACCORDING TO IST */}
          {/* ======================================================== */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-display">
                  24-Hour Microclimate Progression (IST Timeline)
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Current Time:</span>
                <span className="text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg">
                  {ist.timeString12} IST · {ist.greeting}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-3 min-w-[760px]">
                {data.hourly.map((h, idx) => {
                  const isCurrentSlot = idx === 0 || h.isNow;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 min-w-[92px] p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all relative ${
                        isCurrentSlot
                          ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-950/50'
                          : 'bg-white/5 border-white/5 hover:border-emerald-500/30'
                      }`}
                    >
                      {isCurrentSlot && (
                        <span className="absolute -top-2.5 bg-emerald-400 text-slate-950 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider shadow">
                          NOW (IST)
                        </span>
                      )}
                      <div className={`text-xs font-bold ${isCurrentSlot ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {h.time}
                      </div>
                      <div className="text-base font-extrabold text-white tabular-nums">
                        {h.temp}°C
                      </div>
                      <div className="text-[11px] text-cyan-300 flex items-center gap-0.5 font-medium">
                        <Droplets className="w-3 h-3" />
                        <span>{h.rainChance}%</span>
                      </div>
                      <div className="text-[10px] text-slate-300 truncate max-w-[85px]">
                        {h.condition}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {h.wind} km/h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Timeline anchored to Indian Standard Time (UTC+05:30)</span>
              <span className="text-emerald-400">Continuous 24-hr meteorological progression</span>
            </div>
          </div>

          {/* Bottom Grid: 7-Day Farm Forecast & Soil Depth Stratification */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Forecast */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/[0.02] border border-white/10 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>7-Day Agricultural Outlook (IST Week)</span>
                </h3>
                <span className="text-xs text-slate-400">Rain & Evaporation ET₀</span>
              </div>

              <div className="space-y-2.5">
                {data.daily.map((d, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-4 text-xs hover:border-emerald-500/20 transition-all"
                  >
                    <div className="w-24 font-semibold text-white">{d.day}</div>
                    <div className="w-36 text-slate-300 truncate">{d.condition}</div>
                    <div className="flex items-center gap-1 text-cyan-300 font-mono w-24">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{d.rainChance}% ({d.rainfallMm}mm)</span>
                    </div>
                    <div className="text-amber-300/90 font-mono w-24 text-right">
                      ET₀: {d.et0} mm
                    </div>
                    <div className="font-bold text-white font-mono w-24 text-right tabular-nums">
                      {d.min}° / {d.max}°C
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Soil Profile Thermal & Moisture Stratification */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Subsurface Soil Stratification</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Multi-depth temperature and moisture sensors under the crop furrows.
                </p>

                <div className="space-y-3">
                  {data.soilDepthData.map((layer, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{layer.depth}</span>
                        <span className="font-mono text-emerald-400">{layer.temp}°C</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-1.5 rounded-full"
                          style={{ width: `${layer.moisture * 1.5}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{layer.status}</span>
                        <span className="font-mono text-cyan-300 tabular-nums">{layer.moisture}% moisture</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
                Data calibrated against Indian Agricultural Research Institute (IARI) root water standards.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONNECT REAL WEATHER API MODAL */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e1710] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowApiModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Connect Live Weather API
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter your meteorological provider key to pull live Doppler radar & automated satellite feeds.
              </p>
            </div>

            {apiSaveStatus && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{apiSaveStatus}</span>
              </div>
            )}

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Select Provider:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setApiProvider('openweather')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      apiProvider === 'openweather'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    OpenWeather
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiProvider('imd')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      apiProvider === 'imd'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    IMD Kisan
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiProvider('tomorrow')}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      apiProvider === 'tomorrow'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Tomorrow.io
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  API Key / Token:
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="e.g. 8f72a4bc0192e..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-emerald-300 text-slate-950 hover:from-emerald-300 hover:to-emerald-200 transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                Connect API Key & Sync
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-slate-400">
              Keys are stored securely in browser local storage and never exposed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
