import React, { useState } from 'react';
import {
  X,
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  CheckCircle2,
  Calculator,
  Clock,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';

interface PesticideFertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropName?: string;
}

export const PesticideFertilizerModal: React.FC<PesticideFertilizerModalProps> = ({
  isOpen,
  onClose,
  cropName = 'Tomato',
}) => {
  const [selectedCrop, setSelectedCrop] = useState(cropName);
  const [tankSize, setTankSize] = useState<number>(16); // 16L knapsack sprayer
  const [treatmentType, setTreatmentType] = useState<'all' | 'organic' | 'chemical'>('all');

  if (!isOpen) return null;

  const remedies = [
    {
      id: 1,
      target: 'Fungal Blight & Leaf Spot',
      teluguTarget: 'ఆకుమచ్చ మరియు బ్లైట్ తెగులు',
      crop: 'Tomato',
      category: 'organic',
      solution: 'Cold-Pressed Neem Oil (1500 PPM) + Trichoderma',
      teluguSolution: 'వేప నూనె (1500 PPM) + ట్రైకోడెర్మా విరిడే',
      dosagePerLiter: '4.5 ml/L',
      calculatedDosage: (4.5 * tankSize).toFixed(1) + ' ml',
      phiDays: 0,
      safetyLevel: 'Bio-Organic Safe (సురక్షితమైన జీవ నియంత్రణ)',
      timing: 'Early Morning (06:30 - 08:30 AM) with sticking agent',
    },
    {
      id: 2,
      target: 'Early / Late Blight Control',
      teluguTarget: 'ముందస్తు ఆల్టర్నేరియా తెగులు',
      crop: 'Tomato',
      category: 'chemical',
      solution: 'Mancozeb 75% WP (Indofil M-45)',
      teluguSolution: 'మాంకోజెబ్ 75% WP (ఇండోఫిల్ M-45)',
      dosagePerLiter: '2.5 g/L',
      calculatedDosage: (2.5 * tankSize).toFixed(1) + ' grams',
      phiDays: 7,
      safetyLevel: 'Standard Chemical (రక్షణ తొడుగులు తప్పనిసరి)',
      timing: 'Calm wind < 8 km/h, do not apply if rain expected in 4 hrs',
    },
    {
      id: 3,
      target: 'Vegetative Growth & Flowering Boost',
      teluguTarget: 'పూత మరియు పిందె నిలకడ ఎరువు',
      crop: 'All Crops',
      category: 'organic',
      solution: '19:19:19 Balanced Water Soluble NPK + Humic Acid 12%',
      teluguSolution: '19:19:19 ఎన్పీకే స్ప్రే + హ్యూమిక్ యాసిడ్',
      dosagePerLiter: '4.0 g/L + 2.0 ml/L',
      calculatedDosage: (4.0 * tankSize).toFixed(1) + ' g + ' + (2.0 * tankSize).toFixed(1) + ' ml',
      phiDays: 1,
      safetyLevel: 'Fertilizer Nutrient (సూక్ష్మ పోషకాల స్ప్రే)',
      timing: 'Evening (04:30 - 06:00 PM) for maximum stomatal absorption',
    },
    {
      id: 4,
      target: 'Thrips, Whiteflies & Sucking Pests',
      teluguTarget: 'తామర పురుగులు, తెల్లదోమ నివారణ',
      crop: 'Chilli & Tomato',
      category: 'chemical',
      solution: 'Imidacloprid 17.8% SL',
      teluguSolution: 'ఇమిడాక్లోప్రిడ్ 17.8% SL',
      dosagePerLiter: '0.5 ml/L',
      calculatedDosage: (0.5 * tankSize).toFixed(1) + ' ml',
      phiDays: 14,
      safetyLevel: 'Systemic Insecticide (తేనెటీగల సంరక్షణ పాటించండి)',
      timing: 'Apply only during active pest threshold (> 5 thrips/leaf)',
    },
  ];

  const filteredRemedies = remedies.filter(
    (r) => treatmentType === 'all' || r.category === treatmentType
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0f1b11]/95 border border-emerald-500/30 rounded-2xl p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] text-slate-100">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-64 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>PESTICIDE & FERTILIZER ADVISORY REPORT</span>
              <span>·</span>
              <span>పురుగుమందులు & ఎరువుల నివేదిక</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
              Prescriptive Crop Protection & Dosages
            </h2>
          </div>
        </div>

        {/* Interactive Tank Size & Type Bar */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Select Sprayer Tank Size:</span>
            <div className="flex items-center gap-1.5 ml-2">
              {[16, 20, 100, 200].map((size) => (
                <button
                  key={size}
                  onClick={() => setTankSize(size)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                    tankSize === size
                      ? 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {size}L {size === 16 ? '(Backpack)' : size === 200 ? '(Tractor)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setTreatmentType('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                treatmentType === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTreatmentType('organic')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                treatmentType === 'organic' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Bio-Organic 🌱
            </button>
            <button
              onClick={() => setTreatmentType('chemical')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                treatmentType === 'chemical' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
              }`}
            >
              Chemical 🧪
            </button>
          </div>
        </div>

        {/* Remedy Cards */}
        <div className="space-y-4">
          {filteredRemedies.map((remedy) => (
            <div
              key={remedy.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{remedy.target}</span>
                    <span className="text-[11px] text-emerald-400">({remedy.teluguTarget})</span>
                  </div>
                  <h4 className="text-sm font-semibold text-emerald-300 mt-0.5">{remedy.solution}</h4>
                  <p className="text-xs text-slate-400">{remedy.teluguSolution}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Required For {tankSize}L Tank</div>
                  <div className="text-base font-extrabold text-white font-mono">{remedy.calculatedDosage}</div>
                  <div className="text-[11px] text-slate-500 font-mono">({remedy.dosagePerLiter})</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    PHI (హార్వెస్ట్ నిరీక్షణ సమయం): <strong className="text-white font-mono">{remedy.phiDays} days</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{remedy.safetyLevel}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{remedy.timing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statutory Caution */}
        <div className="mt-6 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Agricultural Safety Warning: </strong>
            Always wear safety goggles, face mask, and chemical-resistant nitrile gloves during preparation and spraying.
            Avoid spraying when wind speed exceeds 12 km/h to prevent chemical drift onto neighbouring crops.
          </div>
        </div>
      </div>
    </div>
  );
};
