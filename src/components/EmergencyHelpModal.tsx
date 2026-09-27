import React from 'react';
import { Phone, ShieldAlert, AlertTriangle, X, ExternalLink, LifeBuoy, MapPin } from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: string;
}

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({
  isOpen,
  onClose,
  location = 'Guntur District',
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  const helplines = [
    {
      title:
        language === 'te'
          ? 'కిసాన్ కాల్ సెంటర్ (భారత ప్రభుత్వం)'
          : language === 'hi'
          ? 'किसान कॉल सेंटर (भारत सरकार)'
          : 'Kisan Call Centre (Govt of India)',
      subtitle:
        language === 'te'
          ? 'రైతు ఉచిత సహాయవాణి · 24/7 శాస్త్రవేత్తల సలహా'
          : language === 'hi'
          ? 'निःशुल्क किसान हेल्पलाइन · 24/7 कृषि विशेषज्ञ सलाह'
          : 'National Toll-Free 24/7 Expert Advice',
      number: '1800-180-1551',
      tel: '18001801551',
      badge: language === 'te' ? 'జాతీయ ఉచిత లైన్' : language === 'hi' ? 'राष्ट्रीय टोल-फ्री' : 'National Toll-Free',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      title:
        language === 'te'
          ? 'జిల్లా వ్యవసాయ అధికారి (DAO) అత్యవసర హెల్ప్‌లైన్'
          : language === 'hi'
          ? 'जिला कृषि अधिकारी (DAO) आपातकालीन सहायता'
          : 'District Agricultural Officer (DAO) Emergency',
      subtitle:
        language === 'te'
          ? `${location} · తెగుళ్ల ఉధృతి & నకిలీ విత్తనాల ఫిర్యాదు`
          : language === 'hi'
          ? `${location} · कीट प्रकोप व बीज गुणवत्ता नियंत्रण`
          : `${location} · Pest Outbreak & Seed Quality Verification`,
      number: '+91 863 2234001',
      tel: '08632234001',
      badge: language === 'te' ? 'జిల్లా కేంద్రం' : language === 'hi' ? 'जिला मुख्यालय' : 'District HQ',
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      title:
        language === 'te'
          ? 'కృషి విజ్ఞాన కేంద్రం (KVK) శాస్త్రవేత్తల డెస్క్'
          : language === 'hi'
          ? 'कृषि विज्ञान केंद्र (KVK) वैज्ञानिक हेल्पलाइन'
          : 'Krishi Vigyan Kendra (KVK) Scientist Helpline',
      subtitle:
        language === 'te'
          ? 'పంట తెగుళ్లు, నేల నమూనా పరీక్ష & రోగ నిర్ధారణ'
          : language === 'hi'
          ? 'फसल पैथोलॉजी, मिट्टी परीक्षण और निदान'
          : 'Crop Pathology, Soil Sampling & Field Diagnostics',
      number: '+91 94401 22334',
      tel: '9440122334',
      badge: 'ICAR KVK',
      color: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    },
    {
      title:
        language === 'te'
          ? 'ప్రకృతి వైపరీత్యాలు & పంట నష్ట బీమా (PMFBY)'
          : language === 'hi'
          ? 'आपदा व ओलावृष्टि फसल बीमा सहायता (PMFBY)'
          : 'Disaster & Hailstorm Crop Damage Relief',
      subtitle:
        language === 'te'
          ? 'రాష్ట్ర ప్రకృతి విపత్తుల నిధి & ప్రధాన మంత్రి ఫసల్ బీమా'
          : language === 'hi'
          ? 'राज्य प्राकृतिक आपदा राहत व फसल बीमा क्लेम'
          : 'State Natural Calamities & PMFBY Crop Insurance Support',
      number: '1800-200-5142',
      tel: '18002005142',
      badge: language === 'te' ? 'పంట బీమా' : language === 'hi' ? 'फसल बीमा' : 'Disaster Relief',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title:
        language === 'te'
          ? 'పశు సంవర్ధక శాఖ & వెటర్నరీ అంబులెన్స్'
          : language === 'hi'
          ? 'पशुपालन व पशु चिकित्सा एम्बुलेंस'
          : 'Veterinary Emergency & Livestock Doctor',
      subtitle:
        language === 'te'
          ? 'పాడి పశువుల అత్యవసర వైద్యం & వ్యాధి నివారణ'
          : language === 'hi'
          ? 'डेयरी पशुओं की आपातकालीन चिकित्सा सेवा'
          : 'Animal Husbandry, Bovine Care & Dairy Health',
      number: '1962',
      tel: '1962',
      badge: 'Ambulance 1962',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1710] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Top Control: Language & Close */}
        <div className="flex items-center justify-between mb-4">
          <LanguageSelector variant="compact" />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>
              {language === 'te'
                ? 'రైతు అత్యవసర సహాయం'
                : language === 'hi'
                ? 'आपातकालीन किसान सहायता'
                : 'Emergency Farm Support'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display mt-2">
            🆘 {t('btn.emergencyHelp')}
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'te'
              ? 'ప్రభుత్వ వ్యవసాయ శాస్త్రవేత్తలు, తెగుళ్ల నివారణ బృందాలు మరియు పంట బీమా అధికారులతో తక్షణ ఫోన్ సంప్రదింపులు.'
              : language === 'hi'
              ? 'सरकारी कृषि वैज्ञानिकों, कीट प्रकोप नियंत्रण टीमों और फसल बीमा अधिकारियों से तुरंत फोन पर बात करें।'
              : 'Immediate phone access to government agricultural scientists, pest outbreak teams, and crop insurance officers.'}
          </p>
        </div>

        {/* Helplines List */}
        <div className="space-y-3">
          {helplines.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white font-display">{item.title}</h4>
                <div className="text-xs text-slate-400 leading-tight">{item.subtitle}</div>
                <div className="text-sm font-bold font-mono text-emerald-300 pt-0.5">
                  {item.number}
                </div>
              </div>

              <a
                href={`tel:${item.tel}`}
                className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>
                  {language === 'te' ? 'ఇప్పుడే కాల్ చేయండి' : language === 'hi' ? 'कॉल करें' : 'Call Now'}
                </span>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] text-slate-500">
          {language === 'te'
            ? 'భారత ప్రభుత్వం & రాష్ట్ర వ్యవసాయ శాఖ అధికారిక సహాయవాణి నంబర్లు. 1800 నంబర్లు పూర్తిగా ఉచితం.'
            : language === 'hi'
            ? 'भारत सरकार और राज्य कृषि विभाग की आधिकारिक हेल्पलाइन। 1800 नंबर किसी भी मोबाइल से पूर्णतः निःशुल्क हैं।'
            : 'Official Government of India & State Agriculture Department helplines. Calls to 1800 numbers are completely free of charge from any mobile.'}
        </div>
      </div>
    </div>
  );
};
