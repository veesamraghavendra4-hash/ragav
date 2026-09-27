import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Droplets,
  Wind,
  FileCheck,
  Info,
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

export const PesticideFertilizerPanel: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedStage, setSelectedStage] = useState('Flowering & Early Fruiting');
  const [selectedProblem, setSelectedProblem] = useState('Early Blight (Alternaria)');

  const problemOptions: Record<string, string[]> = {
    Tomato: [
      'Early Blight (Alternaria)',
      'Fruit Borer (Helicoverpa)',
      'Bacterial Leaf Spot',
      'Blossom End Rot (Calcium Deficiency)',
    ],
    Chili: [
      'Thrips & Mites (Leaf Curl)',
      'Dieback & Anthracnose',
      'Powdery Mildew',
    ],
    Paddy: [
      'Blast Disease (Pyricularia)',
      'Brown Plant Hopper (BPH)',
      'Stem Borer',
    ],
    Cotton: [
      'Pink Bollworm',
      'Whitefly Infestation',
      'Magnesium Deficiency Reddening',
    ],
  };

  const getSolution = (crop: string, problem: string) => {
    if (problem.includes('Early Blight')) {
      return {
        managementApproach:
          language === 'te'
            ? 'సమన్వయ శిలీంద్ర నివారణ: స్పర్శ రక్షణ పిచికారీతో పాటు జీవ సంబంధిత వేరు తడుపు.'
            : language === 'hi'
            ? 'एकीकृत फफूंद प्रबंधन: सुरक्षात्मक संपर्क छिड़काव और जैव कवकनाशी का प्रयोग।'
            : 'Integrated Fungal Management: Contact protective spray combined with bio-drenching.',
        chemicalOption: 'Mancozeb 75% WP (Indofil M-45) @ 2.5g/L water OR Azoxystrobin 23% SC @ 1ml/L',
        bioOption:
          language === 'te'
            ? 'గానుగ వేపనూనె (1500 PPM) @ 5 మి.లీ/లీటర్ + ట్రైకోడెర్మా విరిడి వేరు తడుపు'
            : language === 'hi'
            ? 'कोल्ड-प्रेस्ड नीम का तेल (1500 PPM) @ 5 मिली/लीटर + ट्राइकोडर्मा विरिडी'
            : 'Cold-pressed Neem Oil (1500 PPM) @ 5ml/L + Trichoderma viride soil drench',
        timing:
          language === 'te'
            ? 'ఉదయం 06:30 – 09:30 AM (మంచు ఆరిపోయిన తర్వాత)'
            : language === 'hi'
            ? 'सुबह 06:30 से 09:30 AM (पत्तियों की ओस सूखने के बाद)'
            : 'Early Morning (06:30 AM – 09:30 AM) when leaf surface is dry from morning dew.',
        phi: language === 'te' ? 'కోతకు 7 రోజుల ముందు' : language === 'hi' ? 'कटाई से 7 दिन पूर्व' : '7 Days before harvest',
        weatherCheck:
          language === 'te'
            ? 'వాతావరణం అనుకూలం: గాలి వేగం 11 కి.మీ/గం (సురక్షితం) · 24 గంటల్లో వర్షం లేదు.'
            : language === 'hi'
            ? 'छिड़काव के लिए सुरक्षित: हवा 11 किमी/घंटा · 24 घंटों में बारिश नहीं।'
            : 'Safe to spray: Wind 11 km/h (below 15 km/h drift limit) · No rain in 24 hours.',
        precautions:
          language === 'te'
            ? [
                'మందు కలుపుతున్నప్పుడు చేతి తొడుగులు, మాస్క్ మరియు కళ్ళజోడు ధరించండి.',
                'ఎదురు గాలికి మందులు పిచికారీ చేయవద్దు.',
                'పిచికారీ తర్వాత ట్యాంకును శుభ్రమైన నీటితో కడగండి; నీటి వనరులకు దూరంగా పారవేయండి.',
              ]
            : language === 'hi'
            ? [
                'दवा मिलाते समय सुरक्षात्मक दस्ताने, मास्क और चश्मा पहनें।',
                'हवा की उल्टी दिशा में कभी भी छिड़काव न करें।',
                'छिड़काव के बाद स्प्रेयर टैंक को अच्छी तरह धोएं और पानी को जल स्रोतों से दूर रखें।',
              ]
            : [
                'Wear protective nitrile gloves, face mask, and eye goggles during mixing.',
                'Do not spray against the direction of prevailing wind.',
                'Wash sprayer tank thoroughly with clean water; dispose rinse water away from water sources.',
              ],
      };
    } else if (problem.includes('Fruit Borer') || problem.includes('Bollworm')) {
      return {
        managementApproach:
          language === 'te'
            ? 'లింగాకర్షక బుట్టల ఏర్పాటు + లక్ష్యిత పురుగు నివారణ పిచికారీ.'
            : language === 'hi'
            ? 'फेरोमोन ट्रैप निगरानी + लक्षित कीटनाशक छिड़काव।'
            : 'Pheromone Trap Monitoring + Targeted Larvicide Spray.',
        chemicalOption: 'Emamectin Benzoate 5% SG @ 0.5g/L water OR Chlorantraniliprole 18.5% SC @ 0.3ml/L',
        bioOption:
          language === 'te'
            ? 'బాసిల్లస్ తురింజియెన్సిస్ (Bt) @ 2 గ్రా/లీటర్ + ఎకరానికి 5 లింగాకర్షక బుట్టలు'
            : language === 'hi'
            ? 'बैसिलस थुरिंजिएंसिस (Bt) @ 2 ग्राम/लीटर + प्रति एकड़ 5 फेरोमोन ट्रैप'
            : 'Bacillus thuringiensis (Bt) kurstaki @ 2g/L + Installation of 5 Pheromone Traps/Acre',
        timing:
          language === 'te'
            ? 'సాయంత్రం 04:30 – 06:30 PM (పురుగులు బయటకు వచ్చే సమయం)'
            : language === 'hi'
            ? 'देर शाम 04:30 से 06:30 PM (जब इल्लियां सक्रिय होती हैं)'
            : 'Late Evening (04:30 PM – 06:30 PM) when larvae become active on canopy.',
        phi: language === 'te' ? 'కోతకు 5 రోజుల ముందు' : language === 'hi' ? 'कटाई से 5 दिन पूर्व' : '5 Days before harvest',
        weatherCheck:
          language === 'te'
            ? 'అనుకూల సమయం: పొడి ఆకులు, మితమైన సాయంత్రపు ఉష్ణోగ్రత.'
            : language === 'hi'
            ? 'अनुकूल खिड़की: सूखी पत्तियां, मध्यम शाम का तापमान।'
            : 'Optimal window: Dry canopy, moderate evening temperatures.',
        precautions:
          language === 'te'
            ? [
                'పురుగులకు నిరోధకత రాకుండా మందుల గ్రూపులను మార్చి పిచికారీ చేయండి.',
                'సమీపంలో తేనెటీగల పెట్టెలు ఉంటే పిచికారీ సమయంలో మూసి ఉంచండి.',
              ]
            : language === 'hi'
            ? [
                'कीटनाशक प्रतिरोध से बचने के लिए अलग-अलग रासायनिक समूह की दवाओं का उपयोग करें।',
                'यदि पास में मधुमक्खी के बक्से हैं तो छिड़काव के दौरान उन्हें बंद रखें।',
              ]
            : [
                'Rotate insecticide modes of action (IRAC) to avoid chemical resistance.',
                'Keep honey bee hives closed during spray if nearby.',
              ],
      };
    } else {
      return {
        managementApproach:
          language === 'te'
            ? 'సమతుల్య పోషకాలు & సూక్ష్మ పోషక లోపాల సవరణ.'
            : language === 'hi'
            ? 'संतुलित पर्णीय पोषण और सूक्ष्म पोषक तत्वों की आपूर्ति।'
            : 'Balanced Foliar Nutrition & Micronutrient Chelate Supplementation.',
        chemicalOption: 'Chelated Micronutrient Grade IV (Fe, Zn, Mn, Cu, B) @ 2.0g/L + 19:19:19 NPK @ 5g/L',
        bioOption:
          language === 'te'
            ? 'ద్రవ జీవామృతం (డ్రిప్ ద్వారా 200 లీ/ఎకరం) + పంచగవ్య 3% పిచికారీ'
            : language === 'hi'
            ? 'तरल जीवामृत (200 लीटर/एकड़ ड्रिप से) + पंचगव्य 3% पर्णीय छिड़काव'
            : 'Liquid Jeevamrutham (200 L/Acre via drip) + Panchagavya 3% foliar spray',
        timing:
          language === 'te'
            ? 'ఉదయం లేదా మబ్బుగా ఉన్న వేళల్లో'
            : language === 'hi'
            ? 'सुबह या बादलों वाले दिन'
            : 'Morning or cloudy day with low evaporation rate.',
        phi: '0 Days (Nutritional / Organic)',
        weatherCheck:
          language === 'te'
            ? '32°C లోపు ఉష్ణోగ్రత ఉన్నప్పుడు ఆకులు పోషకాలను బాగా గ్రహిస్తాయి.'
            : language === 'hi'
            ? '32°C से कम तापमान में पौधों द्वारा बेहतर अवशोषण।'
            : 'Ideal absorption conditions below 32°C.',
        precautions:
          language === 'te'
            ? [
                'రాగి (కాపర్) శిలీంద్రనాశినులను అమైనో యాసిడ్ ఎరువులతో కలిపి వాడవద్దు.',
                'కొత్త మందులను కలిపే ముందు చిన్న పాత్రలో జార్ టెస్ట్ చేయండి.',
              ]
            : language === 'hi'
            ? [
                'कॉपर युक्त दवाओं को अमीनो एसिड के साथ एक ही टैंक में न मिलाएं।',
                'नए कृषि उत्पादों को टैंक में मिलाने से पहले जार टेस्ट अवश्य करें।',
              ]
            : [
                'Do not mix copper-based fungicides with amino acid chelates in the same tank.',
                'Always conduct a jar test before tank-mixing new agricultural inputs.',
              ],
      };
    }
  };

  const solution = getSolution(selectedCrop, selectedProblem);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>{t('pesticide.subtitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {t('pesticide.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'te'
              ? 'శాస్త్రీయ మోతాదులు, కోతకు ముందు వ్యవధి (PHI) మరియు వాతావరణ అనుకూలత విశ్లేషణ.'
              : language === 'hi'
              ? 'वैज्ञानिक खुराक, कटाई पूर्व सुरक्षा अंतराल (PHI) और मौसम उपयुक्तता जांच।'
              : 'Scientific application dosages, pre-harvest safety intervals (PHI), and meteorological suitability checks.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector variant="compact" />
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{t('pesticide.disclaimer')}</span>
            <span className="sm:hidden">Safety Guidance</span>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            1. {t('pesticide.crop')}:
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => {
              setSelectedCrop(e.target.value);
              setSelectedProblem(problemOptions[e.target.value]?.[0] || 'Early Blight');
            }}
            className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Tomato" className="bg-slate-900">Tomato (టమోటా / टमाटर)</option>
            <option value="Chili" className="bg-slate-900">Chili (మిరప / मिर्च)</option>
            <option value="Paddy" className="bg-slate-900">Paddy Rice (వరి / धान)</option>
            <option value="Cotton" className="bg-slate-900">Cotton (పత్తి / कपास)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            2. {t('pesticide.stage')}:
          </label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="Seedling / Transplanting" className="bg-slate-900">
              {language === 'te' ? 'మొక్క / నాట్లు వేసే దశ' : language === 'hi' ? 'अंकुरण / रोपाई अवस्था' : 'Seedling / Transplanting'}
            </option>
            <option value="Vegetative Canopy" className="bg-slate-900">
              {language === 'te' ? 'శాకీయ ఎదుగుదల దశ' : language === 'hi' ? 'वानस्पतिक वृद्धि अवस्था' : 'Vegetative Canopy'}
            </option>
            <option value="Flowering & Early Fruiting" className="bg-slate-900">
              {language === 'te' ? 'పూత & పిందె దశ' : language === 'hi' ? 'फूल व प्रारंभिक फलन' : 'Flowering & Early Fruiting'}
            </option>
            <option value="Fruit Maturation" className="bg-slate-900">
              {language === 'te' ? 'కాయ ముదురు దశ' : language === 'hi' ? 'फल पकने की अवस्था' : 'Fruit Maturation'}
            </option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            3. {t('pesticide.problem')}:
          </label>
          <select
            value={selectedProblem}
            onChange={(e) => setSelectedProblem(e.target.value)}
            className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            {(problemOptions[selectedCrop] || []).map((prob) => (
              <option key={prob} value={prob} className="bg-slate-900">
                {prob}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Intelligence Results Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-white/[0.02] to-slate-950 border border-emerald-500/30 shadow-2xl space-y-6">
        <div>
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
            {language === 'te'
              ? `${selectedCrop} కోసం సిఫార్సు చేయబడిన పరిష్కారం (${selectedStage})`
              : language === 'hi'
              ? `${selectedCrop} के लिए अनुशंसित प्रबंधन (${selectedStage})`
              : `Management Approach for ${selectedCrop} (${selectedStage})`}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
            {selectedProblem}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {solution.managementApproach}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chemical Solution */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>{t('pesticide.chemical')}</span>
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">{solution.chemicalOption}</p>
            <div className="text-[11px] text-amber-300 font-mono pt-1">
              PHI: {solution.phi}
            </div>
          </div>

          {/* Bio-Organic Solution */}
          <div className="p-5 rounded-2xl bg-white/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t('pesticide.bio')}</span>
            </div>
            <p className="text-sm font-bold text-emerald-100 leading-relaxed">{solution.bioOption}</p>
            <div className="text-[11px] text-emerald-400 font-mono pt-1">
              {language === 'te' ? 'సేంద్రీయ / సున్నా రసాయన అవశేషాలు' : language === 'hi' ? 'जैविक / शून्य रासायनिक अवशेष' : 'Organic / Zero Residue'}
            </div>
          </div>
        </div>

        {/* Application Timing & Weather Suitability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">{t('pesticide.timing')}:</div>
              <div className="text-slate-300 mt-0.5">{solution.timing}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Wind className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">
                {language === 'te' ? 'వాతావరణ అనుకూలత:' : language === 'hi' ? 'मौसम उपयुक्तता:' : 'Weather Suitability:'}
              </div>
              <div className="text-slate-300 mt-0.5">{solution.weatherCheck}</div>
            </div>
          </div>
        </div>

        {/* Safety Precautions List */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>{t('pesticide.precautions')}:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            {solution.precautions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
