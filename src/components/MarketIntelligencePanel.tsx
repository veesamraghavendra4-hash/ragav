import React, { useState } from 'react';
import {
  TrendingUp,
  Store,
  MapPin,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  ShieldCheck,
  Search,
  Clock,
  Coins,
} from 'lucide-react';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';

export const MarketIntelligencePanel: React.FC = () => {
  const { t, language } = useLanguage();
  const [filterCrop, setFilterCrop] = useState('All');

  const mandiPrices = [
    {
      id: 'tomato',
      cropEn: 'Tomato (Hybrid)',
      cropHi: 'टमाटर (हाइब्रिड)',
      cropTe: 'టమోటా (హైబ్రిడ్)',
      marketEn: 'Madanapalle / Guntur Market Yard',
      marketHi: 'मदनापल्ले / गुंटूर मंडी यार्ड',
      marketTe: 'మదనపల్లె / గుంటూరు మార్కెట్ యార్డ్',
      modalPrice: '₹1,850',
      unit: 'Quintal (100 kg)',
      cratePrice: '₹460 / 25kg box',
      change: '+6.2%',
      trend: 'up',
      arrival: '420 Tons',
      updated: '1 hour ago',
    },
    {
      id: 'chili',
      cropEn: 'Chili (Teja / Dry)',
      cropHi: 'सूखी मिर्च (तेजा वैरायटी)',
      cropTe: 'ఎండు మిరప (తేజ రకం)',
      marketEn: 'Guntur Asia Mirchi Yard',
      marketHi: 'गुंटूर एशिया मिर्च मंडी',
      marketTe: 'గుంటూరు ఆసియా మిర్చి యార్డ్',
      modalPrice: '₹19,400',
      unit: 'Quintal',
      cratePrice: '₹194 / kg',
      change: '+2.8%',
      trend: 'up',
      arrival: '1,850 Tons',
      updated: '30 mins ago',
    },
    {
      id: 'corn',
      cropEn: 'Sweet Corn (Maize)',
      cropHi: 'मक्का / स्वीट कॉर्न',
      cropTe: 'మొక్కజొన్న (స్వీట్ కార్న్)',
      marketEn: 'Warangal Enkoor Mandi',
      marketHi: 'वारंगल एनकूर मंडी',
      marketTe: 'వరంగల్ ఎంకూర్ మండి',
      modalPrice: '₹2,280',
      unit: 'Quintal',
      cratePrice: '₹23 / kg cob',
      change: '-1.4%',
      trend: 'down',
      arrival: '680 Tons',
      updated: '2 hours ago',
    },
    {
      id: 'paddy',
      cropEn: 'Paddy Rice (BPT 5204)',
      cropHi: 'धान / चावल (सोना मसूरी)',
      cropTe: 'వరి ధాన్యం (సోనా మసూరి BPT 5204)',
      marketEn: 'Tenali / Miryalaguda Rice Hub',
      marketHi: 'तेनाली / मिर्यालगुडा राइस मंडी',
      marketTe: 'తెనాలి / మిర్యాలగూడ రైస్ హబ్',
      modalPrice: '₹2,450',
      unit: 'Quintal',
      cratePrice: 'MSP + Premium',
      change: '+1.5%',
      trend: 'up',
      arrival: '2,400 Tons',
      updated: '45 mins ago',
    },
    {
      id: 'cotton',
      cropEn: 'Cotton (Medium Staple)',
      cropHi: 'कपास (मीडियम स्टेपल)',
      cropTe: 'పత్తి (మధ్యస్థ పోగు)',
      marketEn: 'Adilabad / Warangal Cotton Market',
      marketHi: 'आदिलाबाद / वारंगल कपास मंडी',
      marketTe: 'ఆదిలాబాద్ / వరంగల్ కాటన్ మార్కెట్',
      modalPrice: '₹7,150',
      unit: 'Quintal',
      cratePrice: '₹71.50 / kg',
      change: '+3.1%',
      trend: 'up',
      arrival: '920 Tons',
      updated: '1 hour ago',
    },
    {
      id: 'carrot',
      cropEn: 'Carrot & Root Crops',
      cropHi: 'गाजर व कंदमूल',
      cropTe: 'క్యారెట్ & దుంప పంటలు',
      marketEn: 'Bowenpally Wholesale Vegetable Hub',
      marketHi: 'बोवेनपल्ली थोक सब्जी मंडी',
      marketTe: 'బోయిన్‌పల్లి హోల్‌సేల్ కూరగాయల మార్కెట్',
      modalPrice: '₹2,600',
      unit: 'Quintal',
      cratePrice: '₹650 / 25kg bag',
      change: '+4.0%',
      trend: 'up',
      arrival: '310 Tons',
      updated: '2 hours ago',
    },
  ];

  const merchants = [
    {
      name: 'Sri Lakshmi Agri Traders & Commission Agent',
      trader: 'K. Venkateswara Rao',
      market: 'Guntur Agricultural Market Yard, Shop #42',
      phone: '+91 98481 44552',
      distance: '3.4 km',
      specialty: 'Chili, Tomato, Cotton',
      rating: 4.8,
    },
    {
      name: 'Balaji Agro Commodities & Export Merchants',
      trader: 'M. Srinivas',
      market: 'Tenali Mandi Bypass Road',
      phone: '+91 94402 33119',
      distance: '12.8 km',
      specialty: 'Paddy Rice, Maize, Pulses',
      rating: 4.7,
    },
    {
      name: 'Annapurna Farmers Producer Company (FPO)',
      trader: 'P. Sambasiva Rao',
      market: 'Mangalagiri Agri Logistics Park',
      phone: '+91 98499 88721',
      distance: '16.5 km',
      specialty: 'Organic Vegetables, Sweet Corn',
      rating: 4.9,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <span>{t('market.subtitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {t('market.title')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'te'
              ? 'నిజ-సమయ e-NAM మార్కెట్ విశ్లేషణ, ధరల ధోరణి మరియు సమీప ధృవీకృత వ్యాపారుల వివరాలు.'
              : language === 'hi'
              ? 'वास्तविक समय ई-नाम मंडी विश्लेषण, मूल्य रुझान और निकटतम प्रमाणित व्यापारियों का विवरण।'
              : 'Real-time e-NAM market intelligence, price trends, and nearby verified agricultural commission merchants.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector variant="compact" />
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>e-NAM Live Index</span>
          </div>
        </div>
      </div>

      {/* Demo Notice & API Connection */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{t('market.demoBadge')}</span>
        </div>
        <button
          onClick={() => alert('Connect Agmarknet / e-NAM Live API Key in Admin Settings.')}
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors cursor-pointer shrink-0"
        >
          {language === 'te' ? 'లైవ్ మార్కెట్ API అనుసంధానం' : language === 'hi' ? 'लाइव मंडी API जोड़ें' : 'Connect Live Market API'}
        </button>
      </div>

      {/* Mandi Price Table */}
      <div className="rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'te' ? 'నేటి ప్రధాన పంటల మండి ధరలు' : language === 'hi' ? 'आज के प्रमुख मंडी भाव' : "Today's Mandi Price Index"}
            </span>
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">{language === 'te' ? 'ఫిల్టర్:' : language === 'hi' ? 'फ़िल्टर:' : 'Filter:'}</span>
            {['All', 'Tomato', 'Chili', 'Paddy'].map((crop) => (
              <button
                key={crop}
                onClick={() => setFilterCrop(crop)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterCrop === crop
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 border-b border-white/10 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">{t('market.crop')}</th>
                <th className="py-3 px-4">{t('market.mandi')}</th>
                <th className="py-3 px-4">{t('market.price')}</th>
                <th className="py-3 px-4">{t('market.trend')}</th>
                <th className="py-3 px-4">
                  {language === 'te' ? 'మార్కెట్ రాబడి' : language === 'hi' ? 'दैनिक आवक' : 'Daily Arrivals'}
                </th>
                <th className="py-3 px-5 text-right">
                  {language === 'te' ? 'తాజా అప్‌డేట్' : language === 'hi' ? 'अपडेट' : 'Last Updated'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {mandiPrices.map((item) => {
                const cropName =
                  language === 'te'
                    ? item.cropTe
                    : language === 'hi'
                    ? item.cropHi
                    : item.cropEn;
                const marketName =
                  language === 'te'
                    ? item.marketTe
                    : language === 'hi'
                    ? item.marketHi
                    : item.marketEn;

                return (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-white">
                      <div>{cropName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{item.cropEn}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{marketName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm font-mono">{item.modalPrice}</div>
                      <div className="text-[10px] text-slate-400">{item.cratePrice}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.trend === 'up'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{item.change}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{item.arrival}</td>
                    <td className="py-3.5 px-5 text-right text-slate-400 text-[11px]">
                      <span className="flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.updated}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nearby Verified Agricultural Commission Merchants */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Store className="w-4 h-4 text-amber-400" />
          <span>{t('market.nearby')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {merchants.map((merchant, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-500/30 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white font-display leading-tight">{merchant.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{merchant.trader}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                  ★ {merchant.rating}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{merchant.market} ({merchant.distance})</span>
                </div>
                <div className="text-[11px] text-emerald-400">
                  {language === 'te' ? 'కొనుగోలు పంటలు:' : language === 'hi' ? 'खरीद फसलें:' : 'Specialty:'} {merchant.specialty}
                </div>
              </div>

              <a
                href={`tel:${merchant.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{merchant.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
