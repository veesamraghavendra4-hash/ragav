import React from 'react';
import {
  Sun,
  Droplets,
  Sprout,
  FlaskConical,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Compass,
} from 'lucide-react';
import { useISTLiveTime } from '../utils/istTime';
import { useLanguage } from '../utils/i18n';

interface FarmTodayCommandCenterProps {
  farmerName?: string;
  farmerLocation?: string;
  onNavigateTab: (tab: string) => void;
}

export const FarmTodayCommandCenter: React.FC<FarmTodayCommandCenterProps> = ({
  farmerName = 'Vignesh',
  farmerLocation = 'Guntur Agri Zone',
  onNavigateTab,
}) => {
  const { t, language } = useLanguage();
  // Live Indian Standard Time (IST - Asia/Kolkata UTC+5:30)
  const ist = useISTLiveTime(5000);

  // Dynamic localized greeting
  const localizedGreeting =
    language === 'te'
      ? ist.greetingTelugu
      : language === 'hi'
      ? ist.greetingHindi
      : ist.greeting;

  const alerts = [
    {
      type: 'rain',
      icon: <AlertTriangle className="w-4 h-4 text-cyan-400" />,
      title:
        language === 'te'
          ? 'వర్షపాత సంభావ్యత హెచ్చరిక'
          : language === 'hi'
          ? 'वर्षा संभावना चेतावनी'
          : 'Rain Probability Alert',
      desc:
        language === 'te'
          ? 'తదుపరి 48 గంటల్లో ఒక మోస్తరు జల్లులు కురిసే అవకాశం ఉంది (45%). రసాయనిక ఎరువులు చల్లడం వాయిదా వేయండి.'
          : language === 'hi'
          ? 'अगले 48 घंटों में हल्की से मध्यम बारिश की संभावना (45%)। भारी रासायनिक खाद डालने से बचें।'
          : 'Moderate showers forecast in 48 hours (45% chance). Consider postponing heavy synthetic fertilizer broadcasting.',
      severity: 'info',
    },
    {
      type: 'disease',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      title:
        language === 'te'
          ? 'రాత్రి మంచు & శిలీంద్ర తెగులు ప్రమాదం'
          : language === 'hi'
          ? 'रात की ओस और फफूंद रोग जोखिम'
          : 'Night Dew Fungal Disease Risk',
      desc:
        language === 'te'
          ? 'ఈ రాత్రి గాలిలో తేమ 84% దాటే అవకాశం ఉంది. టమాటా 3 & 5 మడులలో ఆకుమచ్చ తెగులు కోసం పరిశీలించండి.'
          : language === 'hi'
          ? 'आज रात आर्द्रता 84% से अधिक होगी। टमाटर क्यारी #3 और #5 में अगेती झुलसा धब्बों की जांच करें।'
          : 'Relative humidity will peak past 84% tonight. Inspect tomato Bed #3 and Bed #5 for early blight spots.',
      severity: 'warning',
    },
    {
      type: 'harvest',
      icon: <Sprout className="w-4 h-4 text-emerald-400" />,
      title:
        language === 'te'
          ? 'పంట కోత కౌంట్‌డౌన్ హెచ్చరిక'
          : language === 'hi'
          ? 'फसल कटाई उलटी गिनती अलर्ट'
          : 'Harvest Countdown Alert',
      desc:
        language === 'te'
          ? 'బెడ్ #4 లోని బటర్‌హెడ్ లెట్యూస్ కోతకు సిద్ధంగా ఉంది (38వ రోజు). గరిష్ట మార్కెట్ ధర కోసం 48 గంటల్లో కోత షెడ్యూల్ చేయండి.'
          : language === 'hi'
          ? 'क्यारी #4 में बटरहेड लेट्यूस कटाई के लिए तैयार है (दिन 38)। 48 घंटों के भीतर कटाई करें।'
          : 'Butterhead Lettuce in Bed #4 is harvest-ready (Day 38). Harvest scheduled within 48 hours for premium market grade.',
      severity: 'success',
    },
  ];

  // Dynamic actions based on whether it is Morning, Afternoon, or Evening in IST, localized in active language
  const getIstActions = () => {
    if (ist.period === 'morning') {
      if (language === 'te') {
        return [
          {
            num: '1',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'ఉదయపు డ్రిప్ నీటిపారుదల పూర్తి చేయండి',
            desc: 'భాష్పోత్సేకం (ET₀) తక్కువగా ఉన్న సమయంలో 22 నిమిషాల డ్రిప్ పల్స్ అందించండి (06:00 - 09:30 AM).',
          },
          {
            num: '2',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'ఉదయపు మందుల పిచికారీ అనుకూల సమయం',
            desc: 'గాలి వేగం ప్రశాంతంగా ఉంది (<12 కి.మీ/గం). మధ్యాహ్న ఎండకు ముందే వేపనూనె లేదా పోషకాల పిచికారీ చేయండి.',
          },
          {
            num: '3',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'ఉదయపు మంచులో టమాటా ఆకులను పరిశీలించండి',
            desc: 'తేమ ఆరిపోయేలోపే ఆకుల అడుగున ప్రారంభ శిలీంద్రపు మచ్చలు ఉన్నాయేమో చూడండి.',
          },
        ];
      } else if (language === 'hi') {
        return [
          {
            num: '1',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'सुबह की ड्रिप सिंचाई पूरी करें',
            desc: 'वाष्पोत्सर्जन (ET₀) कम होने के दौरान 22 मिनट का ड्रिप चक्र चलाएं (06:00 - 09:30 AM)।',
          },
          {
            num: '2',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'सुबह का छिड़काव समय',
            desc: 'हवा की गति शांत है (<12 किमी/घं)। दोपहर की धूप से पहले नीम के तेल का छिड़काव सर्वोत्तम है।',
          },
          {
            num: '3',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'टमाटर की पत्तियों की जांच करें',
            desc: 'ओस सूखने से पहले क्यारी #3 में फफूंद के शुरुआती लक्षणों का निरीक्षण करें।',
          },
        ];
      } else {
        return [
          {
            num: '1',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'Complete Morning Drip Irrigation',
            desc: 'Execute 22-min drip pulse while ambient evaporation (ET₀) is low (06:00 - 09:30 AM).',
          },
          {
            num: '2',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'Morning Foliar Spraying Window',
            desc: 'Wind speed is calm (<12 km/h). Ideal period for neem or micronutrient spray before noon heat.',
          },
          {
            num: '3',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'Inspect Tomato Beds for Morning Dew',
            desc: 'Check leaf underside in Bed #3 for early fungal spots before high humidity dissipates.',
          },
        ];
      }
    } else if (ist.period === 'afternoon') {
      if (language === 'te') {
        return [
          {
            num: '1',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'మధ్యాహ్న తీవ్ర ఎండ & నీటి ఆవిరిని పర్యవేక్షించండి',
            desc: `ప్రస్తుత ఉష్ణోగ్రత పెరిగింది (${ist.timeString12} IST). సున్నితమైన పంటలకు తేమను తనిఖీ చేయండి.`,
          },
          {
            num: '2',
            color: 'bg-rose-400/20 text-rose-400',
            title: 'మధ్యాహ్నం రసాయనిక పిచికారీ చేయవద్దు',
            desc: 'ఎండలో మందులు వేగంగా ఆవిరై ఆకులు మాడిపోయే ప్రమాదం ఉంది.',
          },
          {
            num: '3',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'సాయంత్రపు నీటిపారుదలకు సిద్ధం చేయండి',
            desc: 'ఎండ తగ్గిన తర్వాత (సాయంత్రం 4:30 తర్వాత) తదుపరి నీటి పల్స్ షెడ్యూల్ చేయండి.',
          },
        ];
      } else if (language === 'hi') {
        return [
          {
            num: '1',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'दोपहर की गर्मी और वाष्पीकरण पर नज़र रखें',
            desc: `तापमान बढ़ गया है (${ist.timeString12} IST)। नाजुक फसलों में नमी की जांच करें।`,
          },
          {
            num: '2',
            color: 'bg-rose-400/20 text-rose-400',
            title: 'दोपहर के समय कीटनाशक छिड़काव न करें',
            desc: 'तेज धूप में रसायन वाष्पीकृत होकर पत्तियों को नुकसान पहुँचा सकते हैं।',
          },
          {
            num: '3',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'शाम की सिंचाई की तैयारी करें',
            desc: 'शाम 4:30 के बाद दूसरा 15 मिनट का ड्रिप चक्र निर्धारित करें।',
          },
        ];
      } else {
        return [
          {
            num: '1',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'Monitor Peak Midday Heat & Evaporation',
            desc: `Current temperature is elevated (${ist.timeString12} IST). Verify root hydration on sensitive crops.`,
          },
          {
            num: '2',
            color: 'bg-rose-400/20 text-rose-400',
            title: 'Avoid Midday Chemical Foliar Spraying',
            desc: 'High midday temperature causes rapid droplet evaporation and leaf scorch hazard.',
          },
          {
            num: '3',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'Prepare Evening Irrigation & Shading',
            desc: 'Plan secondary 15-minute hydration pulse as sun angle lowers past 16:30.',
          },
        ];
      }
    } else {
      // Evening / Night in IST
      if (language === 'te') {
        return [
          {
            num: '1',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'రోజువారీ నీటి వినియోగం & నేల తేమ నమోదు చేయండి',
            desc: 'ఈరోజు నీటి చక్రం పూర్తయింది. 7 పంట పడకల నేల తేమను సమీక్షించండి.',
          },
          {
            num: '2',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'రాత్రి మంచు & ఫంగల్ నివారణ చర్యలు',
            desc: 'రాత్రి వేళల్లో గాలిలో తేమ 80% దాటుతుంది. నీరు నిలవకుండా డ్రైనేజీని చూసుకోండి.',
          },
          {
            num: '3',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'మార్కెట్ మండి ముగింపు ధరలను సమీక్షించండి',
            desc: 'రేపటి పంట కోత కోసం గుంటూరు మరియు మదనపల్లె మార్కెట్ ధరలను పరిశీలించండి.',
          },
        ];
      } else if (language === 'hi') {
        return [
          {
            num: '1',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'दैनिक जल खपत और मिट्टी की नमी दर्ज करें',
            desc: 'आज का सिंचाई चक्र पूरा हुआ। सभी 7 क्यारियों में नमी स्तर की समीक्षा करें।',
          },
          {
            num: '2',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'रात की ओस और फफूंद से सुरक्षा',
            desc: 'रात में नमी 80% से ऊपर जाएगी। क्यारियों में जलभराव न होने दें।',
          },
          {
            num: '3',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'मंडी के अंतिम भाव देखें और कटाई की योजना बनाएं',
            desc: 'कल की कटाई के लिए नजदीकी मंडियों के बंद भाव की जांच करें।',
          },
        ];
      } else {
        return [
          {
            num: '1',
            color: 'bg-cyan-400/20 text-cyan-400',
            title: 'Log Daily Water Consumption & Subsurface Levels',
            desc: 'Daily irrigation cycle completed. Review soil moisture curves across all 7 loam beds.',
          },
          {
            num: '2',
            color: 'bg-amber-400/20 text-amber-400',
            title: 'Night Dew & Fungal Spore Defense',
            desc: 'Relative humidity rises past 80% tonight. Keep furrows well drained to prevent spore germination.',
          },
          {
            num: '3',
            color: 'bg-emerald-400/20 text-emerald-400',
            title: 'Review Mandi Closing Rates & Plan Harvest',
            desc: 'Check Guntur & Madanapalle market yards closing prices for tomato & chili harvest tomorrow.',
          },
        ];
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 🌅 TODAY'S FARM BRIEF (Top Highlight with Live IST Sync) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-[#0e1c12] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {/* IST Badge */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <span>{ist.emoji} {t('today.brief')}</span>
                <span>·</span>
                <span>{farmerLocation}</span>
                <span>·</span>
                <span className="bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-300 font-bold">
                  IST {ist.timeString12}
                </span>
              </div>

              {/* Dynamic Greeting according to IST and Active Language */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display mt-1">
                {localizedGreeting}, {farmerName} 🌱
              </h1>

              <div className="text-xs text-emerald-300/80 mt-1 flex flex-wrap items-center gap-2 font-medium">
                {language !== 'te' && <span>{ist.greetingTelugu}</span>}
                {language !== 'te' && language !== 'hi' && <span>·</span>}
                {language !== 'hi' && <span>{ist.greetingHindi}</span>}
                {language !== 'en' && <span>·</span>}
                {language !== 'en' && <span>{ist.greeting}</span>}
                <span>·</span>
                <span className="text-slate-400 font-mono">IST (Asia/Kolkata UTC+05:30)</span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              <div className="flex items-center justify-end gap-1.5 text-white font-bold">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{ist.timeString}</span>
              </div>
              <div className="text-slate-400 text-[11px]">{ist.dateString}</div>
              <div className="text-emerald-400 font-semibold text-[11px]">
                Microclimate Station #AP-GNT
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">🌤 {t('nav.weather')}</span>
              <div className="text-sm font-bold text-white">29.5°C · {t('today.favorable')}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">💧 {t('nav.irrigation')}</span>
              <div className="text-sm font-bold text-cyan-300">
                {ist.period === 'morning' ? '06:00–08:30 AM' : ist.period === 'afternoon' ? 'Evening 05:00 PM' : 'Resting'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">🧪 {language === 'te' ? 'పిచికారీ' : language === 'hi' ? 'छिड़काव' : 'Spraying'}</span>
              <div className="text-sm font-bold text-emerald-300">
                {ist.period === 'morning' ? t('today.suitable') : ist.period === 'afternoon' ? 'Wait for 16:30' : 'Night Halt'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">🌧 {language === 'te' ? 'వర్ష ప్రమాదం' : language === 'hi' ? 'वर्षा जोखिम' : 'Rain Risk'}</span>
              <div className="text-sm font-bold text-white">15% Minimal</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">🌱 {language === 'te' ? 'పంట ఆరోగ్యం' : language === 'hi' ? 'फसल स्वास्थ्य' : 'Crop Health'}</span>
              <div className="text-sm font-bold text-emerald-400">98.6% {t('today.healthy')}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
              <span className="text-slate-400 text-[11px]">🌾 {language === 'te' ? 'కోత సమయం' : language === 'hi' ? 'कटाई' : 'Harvest'}</span>
              <div className="text-sm font-bold text-amber-300">8 Days (Tomato)</div>
            </div>
          </div>

          {/* 3 Important Actions for Today (Dynamically adjusted to IST phase and Language) */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                {t('today.keyActions')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {language === 'te' ? 'ప్రస్తుత సమయ దశ:' : language === 'hi' ? 'सक्रिय चरण:' : 'Active Phase:'}{' '}
                <strong className="text-white capitalize">{ist.period}</strong> ({ist.timeString12} IST)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {getIstActions().map((action, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center shrink-0 ${action.color}`}>
                    {action.num}
                  </span>
                  <div>
                    <div className="font-semibold text-white">{action.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{action.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TODAY'S FARM STATUS MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-display">
            {t('today.matrix')}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {t('today.syncedIst')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div
            onClick={() => onNavigateTab('weather')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{t('nav.weather')}</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">🟢 {t('today.favorable')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">29.5°C · Sunny</div>
          </div>

          <div
            onClick={() => onNavigateTab('irrigation')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{t('nav.irrigation')}</div>
            <div className="text-lg font-bold text-cyan-300 font-mono mt-1">
              {ist.period === 'morning' ? `🟢 ${t('today.ready')}` : ist.period === 'afternoon' ? `🟡 ${t('today.monitor')}` : '🟢 Settled'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {ist.period === 'morning' ? 'Schedule Now' : ist.period === 'afternoon' ? 'Evening Pulse' : 'Good Soil Reserve'}
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('crops')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{language === 'te' ? 'పంటల ఆరోగ్యం' : language === 'hi' ? 'फसल स्वास्थ्य' : 'Crop Health'}</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">🟢 {t('today.healthy')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">7 Beds Active</div>
          </div>

          <div
            onClick={() => onNavigateTab('pesticide')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{language === 'te' ? 'పిచికారీ' : language === 'hi' ? 'छिड़काव' : 'Spraying'}</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {ist.period === 'morning' ? `🟢 ${t('today.suitable')}` : ist.period === 'afternoon' ? `🟡 ${t('today.monitor')}` : '🌙 Night Halt'}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Wind &lt; 12 km/h</div>
          </div>

          <div
            onClick={() => onNavigateTab('crops')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{language === 'te' ? 'కోత' : language === 'hi' ? 'कटाई' : 'Harvest'}</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">🌾 2 Days</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Butterhead Lettuce</div>
          </div>

          <div
            onClick={() => onNavigateTab('market')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{t('nav.market')}</div>
            <div className="text-lg font-bold text-white font-mono mt-1">₹1,850</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">+6.2% Today</div>
          </div>

          <div
            onClick={() => onNavigateTab('weather')}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/40 transition-all cursor-pointer group text-center"
          >
            <div className="text-xs text-slate-400">{language === 'te' ? 'వర్ష ప్రమాదం' : language === 'hi' ? 'वर्षा जोखिम' : 'Rain Risk'}</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">🟡 {t('today.moderate')}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">45% in 48h</div>
          </div>
        </div>
      </div>

      {/* SMART FARM ALERTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>{t('today.alerts')}</span>
          </h3>
          <span className="text-xs text-slate-400">{t('today.activeTriggers')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alt, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border backdrop-blur-md space-y-2 ${
                alt.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : alt.severity === 'info'
                  ? 'bg-cyan-950/20 border-cyan-500/30'
                  : 'bg-emerald-950/20 border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {alt.icon}
                <h4 className="text-sm font-bold text-white font-display">{alt.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{alt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
