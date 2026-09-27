import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, Check, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected: (locationName: string, coords?: { lat: number; lon: number }) => void;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onLocationSelected,
}) => {
  const { t, language } = useLanguage();
  const [manualMode, setManualMode] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const presets = [
    'Guntur Agri Zone',
    'Warangal Chilli & Cotton Belt',
    'Vijayawada Krishna Delta',
    'Kurnool Seed Capital',
    'Anantapur Groundnut Zone',
    'Hyderabad Semi-Arid Farm',
    'Rajahmundry Godavari Basin',
  ];

  if (!isOpen) return null;

  const handleAllowLocation = () => {
    setIsDetecting(true);
    setDetectError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          const { latitude, longitude } = position.coords;
          const locName = `Farm Microclimate (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`;
          onLocationSelected(locName, { lat: latitude, lon: longitude });
          onClose();
        },
        (error) => {
          setIsDetecting(false);
          setDetectError(
            language === 'te'
              ? 'లొకేషన్ యాక్సెస్ తిరస్కరించబడింది. దయచేసి క్రింది ప్రాంతాలలో ఒకదాన్ని ఎంచుకోండి.'
              : language === 'hi'
              ? 'स्थान पहुंच अस्वीकृत हो गई। कृपया नीचे दिए गए क्षेत्रों में से चुनें।'
              : 'Location access was denied or unavailable. Please choose from regional presets below.'
          );
          setManualMode(true);
        },
        { timeout: 8000 }
      );
    } else {
      setIsDetecting(false);
      setDetectError(
        language === 'te'
          ? 'మీ బ్రౌజర్ లొకేషన్‌ను సపోర్ట్ చేయదు. దయచేసి మీ ప్రాంతాన్ని మాన్యువల్‌గా నమోదు చేయండి.'
          : language === 'hi'
          ? 'आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता है। कृपया स्थान मैन्युअल दर्ज करें।'
          : 'Geolocation is not supported by your browser. Please enter location manually.'
      );
      setManualMode(true);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      onLocationSelected(customCity.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f1811] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top Controls: Language & Close */}
        <div className="flex items-center justify-between mb-4">
          <LanguageSelector variant="compact" />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">
            {language === 'te'
              ? 'వ్యక్తిగత వ్యవసాయ వాతావరణం'
              : language === 'hi'
              ? 'व्यक्तिगत कृषि मौसम'
              : 'Personalized Farm Weather'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
            {language === 'te'
              ? 'మీ పొలం కోసం ప్రత్యేక వాతావరణ హెచ్చరికలు, నేల ఉష్ణోగ్రత మరియు మందుల పిచికారీ సమయాలను తెలుసుకోవడానికి లొకేషన్ అనుమతిని ఇవ్వండి.'
              : language === 'hi'
              ? 'अपने खेतों के लिए सूक्ष्म जलवायु अलर्ट, मिट्टी का तापमान और छिड़काव का सही समय जानने के लिए स्थान की अनुमति दें।'
              : 'Allow location access to provide localized microclimate alerts, soil temperature, and optimal foliar spraying windows for your fields.'}
          </p>
        </div>

        {detectError && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{detectError}</span>
          </div>
        )}

        {!manualMode ? (
          <div className="space-y-3">
            <button
              onClick={handleAllowLocation}
              disabled={isDetecting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>
                {isDetecting
                  ? language === 'te'
                    ? 'స్థానం గుర్తిస్తోంది...'
                    : language === 'hi'
                    ? 'स्थान खोजा जा रहा है...'
                    : 'Detecting Coordinates...'
                  : language === 'te'
                  ? 'లొకేషన్ అనుమతించండి (GPS ఆటో-డిటెక్ట్)'
                  : language === 'hi'
                  ? 'स्थान की अनुमति दें (GPS ऑटो-डिटेक्ट)'
                  : 'Allow Location (Auto-Detect GPS)'}
              </span>
            </button>

            <button
              onClick={() => setManualMode(true)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              {language === 'te'
                ? 'గ్రామం / నగరం మాన్యువల్‌గా నమోదు చేయండి'
                : language === 'hi'
                ? 'स्थान मैन्युअल रूप से दर्ज करें'
                : 'Enter Location Manually'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                {language === 'te'
                  ? 'గ్రామం / మండలం / జిల్లా పేరు:'
                  : language === 'hi'
                  ? 'गाँव / ब्लॉक / जिला दर्ज करें:'
                  : 'Enter Village / District / Town:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="e.g. Guntur, Warangal, Kurnool"
                  className="flex-1 px-3.5 py-2 bg-white/5 border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!customCity.trim()}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                >
                  {language === 'te' ? 'సెట్' : language === 'hi' ? 'सेट' : 'Set'}
                </button>
              </div>
            </form>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                {language === 'te'
                  ? 'లేదా ప్రధాన వ్యవసాయ జోన్‌ను ఎంచుకోండి:'
                  : language === 'hi'
                  ? 'या प्रमुख कृषि क्षेत्र चुनें:'
                  : 'Or select major agricultural hub:'}
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      onLocationSelected(preset);
                      onClose();
                    }}
                    className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-xs text-slate-200 hover:text-emerald-300 border border-white/5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>{preset}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5 text-center text-[11px] text-slate-500">
          {language === 'te'
            ? 'మీ లొకేషన్ స్థానికంగా మాత్రమే నిల్వ చేయబడుతుంది మరియు వాతావరణం కోసం మాత్రమే ఉపయోగించబడుతుంది.'
            : language === 'hi'
            ? 'स्थान स्थानीय रूप से सुरक्षित है और केवल आपके खेत के मौसम डेटा के लिए उपयोग किया जाता है।'
            : 'Location is stored locally and used solely to query meteorological indices for your farm.'}
        </div>
      </div>
    </div>
  );
};
