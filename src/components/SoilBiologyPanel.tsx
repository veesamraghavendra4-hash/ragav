import React, { useState } from 'react';
import {
  Layers,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  FlaskConical,
  Bug,
  BookOpen,
  Sliders,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface SoilBiologyPanelProps {
  farmerName?: string;
  farmerLocation?: string;
}

export const SoilBiologyPanel: React.FC<SoilBiologyPanelProps> = ({
  farmerName = 'Ramesh Patel (రైతు)',
  farmerLocation = 'Valley Loam Plot A',
}) => {
  const [activeSection, setActiveSection] = useState<'nutrients' | 'labCard' | 'phDoctor' | 'jeevamrutham'>('nutrients');
  const [simulatedPh, setSimulatedPh] = useState<number>(6.6);

  // Dynamic feedback based on interactive pH slider
  const getPhDiagnosis = (ph: number) => {
    if (ph < 5.8) {
      return {
        status: 'Acidic Loam (ఆమ్ల నేల)',
        color: 'text-amber-400',
        advice: 'Aluminum & Manganese toxicity risk. Phosphorus is bound. Apply Agricultural Lime (CaCO₃) @ 400 kg/acre before next irrigation.',
        optimalFor: 'Tea, Potato, Blueberries',
      };
    } else if (ph <= 7.2) {
      return {
        status: 'Optimal Balanced Soil (సమతుల్య సారవంతమైన నేల)',
        color: 'text-emerald-400',
        advice: 'Peak biological nutrient bioavailability. Mycorrhizal fungi and nitrogen-fixing bacteria thrive in this range.',
        optimalFor: 'Tomato, Cabbage, Carrot, Sweet Corn, Chili, Paddy',
      };
    } else {
      return {
        status: 'Alkaline Calcareous Soil (క్షార నేల)',
        color: 'text-rose-400',
        advice: 'Iron, Zinc, and Boron lockout causing leaf chlorosis. Apply Agricultural Gypsum (CaSO₄) @ 500 kg/acre and elemental sulfur.',
        optimalFor: 'Barley, Sugarbeet, Asparagus',
      };
    }
  };

  const phDiag = getPhDiagnosis(simulatedPh);

  const primaryNutrients = [
    {
      name: 'Available Nitrogen (N)',
      telugu: 'నత్రజని',
      value: '245 kg/ha',
      target: '220–280 kg/ha',
      status: 'Optimal',
      pct: 78,
      desc: 'Essential for vigorous vegetative leafy canopy in cabbages and sweet corn stalks.',
    },
    {
      name: 'Available Phosphorus (P₂O₅)',
      telugu: 'భాస్వరం',
      value: '48 kg/ha',
      target: '35–55 kg/ha',
      status: 'Optimal',
      pct: 82,
      desc: 'Drives deep taproot development for Kuroda carrots and early flowering in tomatoes.',
    },
    {
      name: 'Available Potassium (K₂O)',
      telugu: 'పొటాష్',
      value: '290 kg/ha',
      target: '250–320 kg/ha',
      status: 'Optimal',
      pct: 85,
      desc: 'Regulates leaf stomatal conductance and improves fruit firmness and sweetness.',
    },
    {
      name: 'Organic Carbon (SOC)',
      telugu: 'సేంద్రీయ కార్బన్',
      value: '2.4%',
      target: '> 1.5% Good',
      status: 'Rich Loam',
      pct: 92,
      desc: 'High organic carbon provides sponge-like water retention and fungal habitat.',
    },
  ];

  const microNutrients = [
    { name: 'Calcium (Ca)', value: '1,840 ppm', status: 'High', ideal: '1200–2000 ppm' },
    { name: 'Magnesium (Mg)', value: '240 ppm', status: 'Optimal', ideal: '180–300 ppm' },
    { name: 'Sulfur (S)', value: '32 ppm', status: 'Optimal', ideal: '20–40 ppm' },
    { name: 'Zinc (Zn)', value: '1.45 ppm', status: 'Optimal', ideal: '0.8–2.0 ppm' },
    { name: 'Iron (Fe)', value: '6.8 ppm', status: 'Optimal', ideal: '4.5–10 ppm' },
    { name: 'Boron (B)', value: '0.92 ppm', status: 'Optimal', ideal: '0.5–1.5 ppm' },
    { name: 'Electrical Conductivity (EC)', value: '0.42 dS/m', status: 'Non-Saline', ideal: '< 1.0 dS/m' },
    { name: 'Cation Exchange (CEC)', value: '22 meq/100g', status: 'High Loam', ideal: '15–25 meq' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <span>Comprehensive Soil Science</span>
            <span>·</span>
            <span>మృత్తిక జీవశాస్త్రం</span>
            <span>·</span>
            <span>Microbiome & Mineral Analysis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Soil Biology & Precision Nutrient Profile
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered for {farmerName} · {farmerLocation}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-right">
            <div className="text-xs font-bold text-emerald-400 font-mono">Soil Health Score: 98.6%</div>
            <div className="text-[10px] text-slate-400">Class 1 Prime Fertile Loam</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
        <button
          onClick={() => setActiveSection('nutrients')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'nutrients'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>NPK & Micro-Nutrients</span>
        </button>

        <button
          onClick={() => setActiveSection('phDoctor')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'phDoctor'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive pH Simulator</span>
        </button>

        <button
          onClick={() => setActiveSection('labCard')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'labCard'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Soil Health Card (ల్యాబ్ రిపోర్ట్)</span>
        </button>

        <button
          onClick={() => setActiveSection('jeevamrutham')}
          className={`px-3.5 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSection === 'jeevamrutham'
              ? 'bg-emerald-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>జీవామృతం తయారీ (Natural Inputs)</span>
        </button>
      </div>

      {/* SECTION 1: NPK & Micro-Nutrient Dashboard */}
      {activeSection === 'nutrients' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 4 Key Biological Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Current Soil pH</div>
              <div className="text-2xl font-bold text-white font-mono">6.6 pH</div>
              <div className="text-xs text-emerald-400 font-medium">Optimal slightly acidic</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Mycorrhizae Colonization</div>
              <div className="text-2xl font-bold text-white font-mono">88% Active</div>
              <div className="text-xs text-emerald-400 font-medium">Hyphal root symbiotic network</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Earthworm Count</div>
              <div className="text-2xl font-bold text-white font-mono">14 / sq ft</div>
              <div className="text-xs text-emerald-400 font-medium">Vibrant natural aeration</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <div className="text-[11px] text-slate-400">Soil Organic Carbon (SOC)</div>
              <div className="text-2xl font-bold text-white font-mono">2.4%</div>
              <div className="text-xs text-emerald-400 font-medium">Spongy moisture retention</div>
            </div>
          </div>

          {/* Primary Macronutrient Bars */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center justify-between">
              <span>Primary Macronutrients (NPK)</span>
              <span className="text-xs text-slate-400 font-normal">Calibrated for furrow beds</span>
            </h3>

            <div className="space-y-4">
              {primaryNutrients.map((n, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{n.name}</span>
                      <span className="text-[11px] text-emerald-400">({n.telugu})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400">Target: {n.target}</span>
                      <span className="text-emerald-400 font-bold tabular-nums">{n.value}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-lime-400 h-2 rounded-full"
                      style={{ width: `${n.pct}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400">{n.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary & Trace Micronutrients Grid */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-display">
              Secondary & Micronutrient Mineral Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {microNutrients.map((m, mIdx) => (
                <div key={mIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
                  <div className="text-[11px] text-slate-400">{m.name}</div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">{m.value}</div>
                  <div className="text-[10px] text-emerald-400">
                    {m.status} (Ideal: {m.ideal})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Interactive Soil pH Simulator */}
      {activeSection === 'phDoctor' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>Interactive Soil pH Simulator & Diagnosis</span>
              </h3>
              <span className="text-xs text-slate-400">Drag slider to test soil conditions</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Observe how soil acidity and alkalinity directly govern plant root nutrient uptake, fungal disease susceptibility, and recommended mineral conditioners.
            </p>
          </div>

          {/* pH Slider */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Simulate Soil pH Value:</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{simulatedPh.toFixed(1)} pH</span>
            </div>

            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={simulatedPh}
              onChange={(e) => setSimulatedPh(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-red-500 via-emerald-400 to-indigo-500 rounded-lg appearance-none cursor-pointer accent-white"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>4.5 (Strongly Acidic)</span>
              <span>6.5 (Neutral Optimal)</span>
              <span>9.0 (Strongly Alkaline)</span>
            </div>
          </div>

          {/* Real-time Diagnosis Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold font-display ${phDiag.color}`}>
                {phDiag.status}
              </span>
              <span className="text-xs font-mono text-slate-300">Target Range: 6.2 - 7.0 pH</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              <strong className="text-emerald-300">Agronomist Recommendation:</strong> {phDiag.advice}
            </p>

            <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
              <span className="font-semibold text-white">Ideal Crops for this pH:</span>{' '}
              {phDiag.optimalFor}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Official Soil Health Card (మృత్తిక ఆరోగ్య పత్రం) */}
      {activeSection === 'labCard' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Government Certified Agro Lab Analysis
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Soil Health Card (మృత్తిక ఆరోగ్య పత్రం)
              </h3>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              <div>Sample ID: AP-GNT-2026-8841</div>
              <div>Tested: Sep 2026</div>
            </div>
          </div>

          {/* Farmer & Field Credentials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[11px]">రైతు పేరు (Farmer):</span>
              <div className="font-semibold text-white mt-0.5">{farmerName}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[11px]">ప్రాంతం (Location):</span>
              <div className="font-semibold text-white mt-0.5">{farmerLocation}</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[11px]">నేల రకం (Soil Texture):</span>
              <div className="font-semibold text-emerald-400 mt-0.5">Sandy Clay Loam</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <span className="text-slate-400 text-[11px]">డ్రైనేజ్ (Drainage):</span>
              <div className="font-semibold text-emerald-400 mt-0.5">Well Drained Furrows</div>
            </div>
          </div>

          {/* Test Scores Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="p-3">Parameter (పరామితి)</th>
                  <th className="p-3">Lab Reading</th>
                  <th className="p-3">Standard Benchmark</th>
                  <th className="p-3">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">pH (1:2.5 Suspension)</td>
                  <td className="p-3 font-mono text-emerald-400">6.60</td>
                  <td className="p-3 font-mono">6.50 – 7.50</td>
                  <td className="p-3 text-emerald-300">Normal (సహజం)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Electrical Conductivity (EC)</td>
                  <td className="p-3 font-mono text-emerald-400">0.42 dS/m</td>
                  <td className="p-3 font-mono">&lt; 1.00 dS/m</td>
                  <td className="p-3 text-emerald-300">Non-Saline (చౌడు లేనిది)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Organic Carbon (SOC)</td>
                  <td className="p-3 font-mono text-emerald-400">2.40%</td>
                  <td className="p-3 font-mono">&gt; 0.75%</td>
                  <td className="p-3 text-emerald-300">High Fertile (అధిక సారం)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Available Nitrogen (N)</td>
                  <td className="p-3 font-mono text-emerald-400">245 kg/ha</td>
                  <td className="p-3 font-mono">280 kg/ha</td>
                  <td className="p-3 text-emerald-300">Medium-Optimal</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Available Phosphorus (P)</td>
                  <td className="p-3 font-mono text-emerald-400">48.2 kg/ha</td>
                  <td className="p-3 font-mono">25 – 50 kg/ha</td>
                  <td className="p-3 text-emerald-300">Sufficient (తగినంత)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Available Potassium (K)</td>
                  <td className="p-3 font-mono text-emerald-400">290 kg/ha</td>
                  <td className="p-3 font-mono">150 – 300 kg/ha</td>
                  <td className="p-3 text-emerald-300">Optimal (ఉత్తమం)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: Authentic Jeevamrutham Natural Preparation Guide */}
      {activeSection === 'jeevamrutham' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Natural Farming Biological Formulations
            </div>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              జీవామృతం & బీజామృతం తయారీ విధానం (Jeevamrutham Preparation)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Multiplies billions of beneficial soil microorganisms and mycorrhizal fungi per milliliter without chemical inputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jeevamrutham 200L Barrel Recipe */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>1. జీవామృతం కావలసిన పదార్థాలు (For 1 Acre):</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>దేశవాళీ ఆవు పేడ (Desi Cow Dung):</strong> 10 కేజీలు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>దేశవాళీ ఆవు మూత్రం (Desi Cow Urine):</strong> 5 నుండి 10 లీటర్లు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>నల్ల బెల్లం (Black Jaggery):</strong> 2 కేజీలు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>ద్విదళ ధాన్యాల పిండి (Pulse Flour / శనగ పిండి):</strong> 2 కేజీలు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>రసాయనాలు లేని గట్టు మట్టి (Live Virgin Soil):</strong> దోసెడు (500 గ్రాములు)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">▪</span>
                  <span><strong>శుభ్రమైన నీరు (Clean Water):</strong> 200 లీటర్ల డ్రమ్ము</span>
                </li>
              </ul>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300">
                <strong>వాడే విధానం:</strong> 48 గంటలు నీడలో ఉంచి, రోజుకు రెండుసార్లు కర్రతో గడియారం ముల్లు తిరిగే దిశలో కలపాలి. 3వ రోజు నుండి డ్రిప్ లేదా పంట కాలువ నీటితో పాటు ఎకరానికి 200 లీటర్లు అందించాలి.
              </div>
            </div>

            {/* Beejamrutham Seed Inoculation */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-lime-400 font-bold text-sm">
                <FlaskConical className="w-4 h-4" />
                <span>2. విత్తన శుద్ధి - బీజామృతం (Beejamrutham):</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                విత్తనాలు నాటే ముందు బీజామృతంతో శుద్ధి చేయడం వల్ల నేల ద్వారా వచ్చే శిలీంధ్రాలు (Fungal root rot, damping off) నశిస్తాయి.
              </p>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">▪</span>
                  <span>ఆవు పేడ 5 కేజీలు + ఆవు మూత్రం 5 లీటర్లు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">▪</span>
                  <span>సున్నం 50 గ్రాములు + పుట్టమట్టి దోసెడు</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">▪</span>
                  <span>20 లీటర్ల నీటిలో రాత్రంతా నానబెట్టి, ఉదయం విత్తనాలపై చల్లి నీడలో ఆరబెట్టాలి.</span>
                </li>
              </ul>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300">
                <strong>ప్రయోజనం:</strong> విత్తన అంకురోత్పత్తి 98% పెరుగుతుంది మరియు మొలక దశలోనే మైకోరైజల్ వేరు వ్యవస్థ ప్రారంభమవుతుంది.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
