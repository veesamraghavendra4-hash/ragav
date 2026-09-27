/**
 * Comprehensive Trilingual Internationalization (i18n) Engine
 * Languages:
 *   - en: English
 *   - hi: Hindi (हिंदी)
 *   - te: Telugu (తెలుగు)
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'te';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    'brand.name': 'AI Agriculture Assistant',
    'brand.subtitle': 'Precision Agro Intelligence',
    'brand.tagline': 'Smart farming intelligence for better crops, better decisions and a better tomorrow.',
    'brand.badge': 'AI • WEATHER • CROPS • IRRIGATION • MARKET',
    'brand.powered': 'Intelligent Agriculture • Powered by AI',
    'brand.subfooter': 'Precision Soil • Weather Advisory • Multilingual Voice AI',
    'brand.chooseLanguage': 'Select Preferred Language',

    // Nav
    'nav.today': 'My Farm Today',
    'nav.farm3d': '3D Farm Digital Twin',
    'nav.weather': 'Weather',
    'nav.weather.native': 'Weather Report',
    'nav.plantDoctor': 'AI Doctor',
    'nav.plantDoctor.native': 'Plant Pathology',
    'nav.irrigation': 'Irrigation',
    'nav.market': 'Mandi Market',
    'nav.modules': 'All Modules',
    'nav.voiceAi': 'Voice AI 🎙',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.clean': 'Clean',
    'nav.showUi': 'Show UI',
    'nav.menu': 'Menu',

    // 12 Modules
    'module.plantDoctor.title': '🌱 AI Plant Doctor',
    'module.plantDoctor.desc': 'Multimodal Crop Pathology & Medicines',
    'module.weather.title': '🌦 Agricultural Weather Report',
    'module.weather.desc': 'IST Microclimate Progression & Foliar Spraying Advice',
    'module.irrigation.title': '💧 Irrigation Intelligence',
    'module.irrigation.desc': 'Evapotranspiration & Drip Pulse Cycles',
    'module.crops.title': '🌾 Crop Management',
    'module.crops.desc': '7 Active Loam Beds & Harvest Tracking',
    'module.pesticide.title': '🧪 Pesticide & Fertilizer Report',
    'module.pesticide.desc': 'Safe Dosages, Weather Suitability & PHI',
    'module.market.title': '💰 Market / Merchant Details',
    'module.market.desc': 'Live Mandi Prices, Buyers & Contacts',
    'module.machinery.title': '🚜 Farm Machinery',
    'module.machinery.desc': 'Agri-Trac Telemetry & Pump Automation',
    'module.soil.title': '🌱 Soil Intelligence',
    'module.soil.desc': 'NPK Nutrients, pH & Biological Ecology',
    'module.analytics.title': '📊 Farm Analytics',
    'module.analytics.desc': 'Yield Projections & Water Efficiency',
    'module.voice.title': '🎙 AI Farmer Assistant',
    'module.voice.desc': 'Talk to Your Farm AI in Telugu / Hindi / Eng',
    'module.location.title': '🗺 Farm Location',
    'module.location.desc': 'Change Microclimate GPS & Regional Hub',
    'module.profile.title': '📋 My Farm Profile',
    'module.profile.desc': 'Farmer Name, Land Size & Soil Registry',
    'module.today.title': '🌅 My Farm Today',
    'module.today.desc': 'Daily Status Matrix & Alerts',
    'module.farm3d.title': '🌐 3D Farm Digital Twin',
    'module.farm3d.desc': 'Interactive Spatial Field Visualization',
    'module.modal.title': 'Agriculture Control Center Navigation',

    // Auth & Welcome
    'auth.welcomeTitle': 'Welcome to AI Agriculture Assistant',
    'auth.signIn': 'SIGN IN',
    'auth.login': 'LOGIN',
    'auth.createAccount': 'Create Your Farmer Profile 🌱',
    'auth.welcomeBack': 'Welcome Back, Farmer 🌱',
    'auth.demoFarmer': 'Continue as Demo Farmer (Vignesh · Guntur Agri Zone)',
    'auth.fullName': 'Full Name',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.mobile': 'Mobile Number',
    'auth.farmLocation': 'Farm Location / Village (Optional)',
    'auth.mainCrop': 'Main Crop (Optional)',
    'auth.continueToLogin': 'CONTINUE TO LOGIN →',
    'auth.loginToAssistant': 'LOGIN TO FARM ASSISTANT →',
    'auth.alreadyHaveAccount': 'Already have an account? Login',
    'auth.dontHaveAccount': "Don't have an account? Create New Account",
    'auth.forgotPassword': 'Forgot Password?',

    // Farm Today Brief
    'today.brief': "TODAY'S FARM BRIEF",
    'today.keyActions': 'Key Actions for this Period (IST):',
    'today.matrix': "Today's Farm Status Matrix",
    'today.syncedIst': 'Synced with Indian Standard Time',
    'today.alerts': 'Smart Farm Telemetry Alerts',
    'today.activeTriggers': '3 active automated triggers',
    'today.favorable': 'Favorable',
    'today.ready': 'Ready',
    'today.monitor': 'Monitor',
    'today.healthy': 'Healthy',
    'today.suitable': 'Suitable Now',
    'today.moderate': 'Moderate',

    // 3D Scene & Hero Overlay
    'hero.kicker': 'Spline 3D Spatial Scene · Regenerative Agro-Ecology · Interactive WebGL',
    'hero.title': 'Cultivating Tomorrow from the Soil Up.',
    'hero.desc': 'Experience an interactive, real-time agricultural ecosystem designed in a polished Spline 3D style. Watch the farmer nurture organic crop rows, monitor precision irrigation lines, and inspect sustainable field infrastructure.',
    'hero.observeFarmer': 'Observe Farmer at Work',
    'hero.fieldSpecs': 'Interactive Elements',
    'hero.moisture': 'Loam Moisture',
    'hero.dripHydration': 'Targeted Drip Hydration',
    'hero.rows': 'Parallel Rows',
    'hero.cropTypes': 'Lettuces, Carrots & Sweet Corn',
    'hero.lighting': 'Cinematic Spline Lighting',
    'hero.cam.hero': 'Hero Panorama',
    'hero.cam.farmer': 'Active Farmer',
    'hero.cam.barn': 'Barn & Silo',
    'hero.cam.tractor': 'Tractor Lane',
    'hero.cam.orbit': '360° Drone Orbit',
    'hero.time.dawn': 'Sunrise Dawn',
    'hero.time.noon': 'Midday Sun',
    'hero.time.golden': 'Golden Hour',
    'hero.time.twilight': 'Twilight Indigo',
    'hero.mist': 'Mist Sprinklers',
    'hero.wind': 'Crop Wind',
    'hero.perspective': 'Perspective:',

    // Weather
    'weather.title': 'Agricultural Weather Report',
    'weather.station': 'Agricultural Meteorological Station',
    'weather.demoBadge': 'Demo Weather Data',
    'weather.connectApi': 'Connect Live Weather API',
    'weather.sunrise': 'Sunrise',
    'weather.sunset': 'Sunset',
    'weather.farmingAdvice': 'Farming Advice & Agro-Advisories',
    'weather.humidity': 'Relative Humidity',
    'weather.wind': 'Wind Velocity',
    'weather.soilTemp': 'Soil Temp (10cm)',
    'weather.et0': 'Evapotranspiration',
    'weather.sprayingIndex': 'Spraying Suitability Index',
    'weather.sprayWindow': 'Recommended Spray Window:',
    'weather.hourly': '24-Hour Microclimate Progression (IST Timeline)',
    'weather.sevenDay': '7-Day Agricultural Outlook (IST Week)',
    'weather.subsurface': 'Subsurface Soil Stratification',

    // Irrigation
    'irrigation.title': 'Smart Irrigation Intelligence',
    'irrigation.subtitle': 'Hydrological Automation & Telemetry',
    'irrigation.optimalWindow': 'Irrigation is optimal between 06:00 AM – 08:30 AM',
    'irrigation.desc': 'Morning pulse drip reduces evaporation by 48% compared to afternoon watering.',
    'irrigation.status': 'Recommended',
    'irrigation.nextWindow': 'Next Window',
    'irrigation.waterSaving': 'Water Conservation',
    'irrigation.duration': 'Duration',
    'irrigation.toggleTrigger': 'Trigger 3D Drip Pulse',
    'irrigation.toggleStop': 'Stop Sprinkler Mist',

    // Plant Doctor
    'doctor.title': 'AI Plant Doctor & Diagnostics',
    'doctor.subtitle': 'Multimodal Pathology & Agro-Pharmacy',
    'doctor.upload': 'Upload Plant Photo',
    'doctor.camera': 'Capture with Mobile Camera',
    'doctor.enterSymptoms': 'Describe Crop Symptoms',
    'doctor.sampleCases': 'Sample Presets (1-Click Test):',
    'doctor.warning': 'AI diagnosis is an agricultural assistance tool. Confirm serious crop diseases with a qualified agricultural expert.',
    'doctor.tabMedicines': 'Recommended Medicines',
    'doctor.tabStores': 'Nearby Certified Agro-Stores',
    'doctor.tabSymptoms': 'Detailed Symptoms & Pathogen',

    // Pesticide & Fertilizer
    'pesticide.title': 'Pesticide & Fertilizer Intelligence',
    'pesticide.subtitle': 'Safe Dosages, Weather Suitability & PHI',
    'pesticide.crop': 'Select Crop',
    'pesticide.stage': 'Growth Stage',
    'pesticide.problem': 'Crop Problem / Disease',
    'pesticide.chemical': 'Chemical Recommendation',
    'pesticide.bio': 'Bio-Organic Solution',
    'pesticide.timing': 'Application Timing',
    'pesticide.precautions': 'Safety Precautions',
    'pesticide.disclaimer': 'Always follow product label instructions and local agricultural authority guidance.',

    // Market
    'market.title': 'Agri Market Intelligence',
    'market.subtitle': 'Live e-NAM Mandi Prices, Merchants & Contacts',
    'market.demoBadge': 'Demo Mandi Data · Connect Live Agmarknet API',
    'market.crop': 'Crop Name',
    'market.price': 'Modal Price',
    'market.mandi': 'Market Yard',
    'market.trend': 'Trend',
    'market.nearby': 'Nearby Merchants & Buyers',
    'market.call': 'Call Merchant',

    // Farm Profile
    'profile.title': 'My Farm Profile & Land Registry',
    'profile.subtitle': 'Registered Farmer Profile & Field Attributes',
    'profile.name': 'Farmer Name',
    'profile.mobile': 'Mobile Number',
    'profile.location': 'Village / Location',
    'profile.farmSize': 'Total Land Size',
    'profile.soilType': 'Soil Texture',
    'profile.crops': 'Main Crops Cultivated',
    'profile.irrigation': 'Irrigation Infrastructure',
    'profile.prefLang': 'Preferred Language',
    'profile.save': 'Save Profile & Update Advisories',
    'profile.success': 'Farm profile saved successfully! Personalized advisories updated.',

    // Buttons & Labels
    'btn.changeLocation': 'Change Farm Location',
    'btn.openVoiceAi': 'Open Voice AI',
    'btn.emergencyHelp': 'Emergency Farm Help',
    'btn.viewWeather': 'View Weather Report',
    'btn.plantDoctor': 'AI Plant Doctor',
    'btn.observeFarmer': 'Observe Farmer at Work',
    'btn.exploreField': 'Explore 3D Field Specs',
    'btn.close': 'Close',
    'btn.save': 'Save',
    'btn.back': 'Back',
  },

  hi: {
    // Brand & Header
    'brand.name': 'AI कृषि सहायक',
    'brand.subtitle': 'सटीक कृषि बुद्धिमत्ता',
    'brand.tagline': 'बेहतर फसलों, सही निर्णयों और उज्ज्वल भविष्य के लिए स्मार्ट कृषि बुद्धिमत्ता।',
    'brand.badge': 'एआई • मौसम • फसलें • सिंचाई • मंडी बाजार',
    'brand.powered': 'बुद्धिमान कृषि • एआई द्वारा संचालित',
    'brand.subfooter': 'सटीक मृदा • मौसम सलाह • बहुभाषी वॉयस एआई',
    'brand.chooseLanguage': 'अपनी पसंदीदा भाषा चुनें',

    // Nav
    'nav.today': 'मेरा खेत आज',
    'nav.farm3d': '3D डिजिटल खेत',
    'nav.weather': 'मौसम',
    'nav.weather.native': 'मौसम रिपोर्ट',
    'nav.plantDoctor': 'AI पौधा डॉक्टर',
    'nav.plantDoctor.native': 'फसल रोग निदान',
    'nav.irrigation': 'सिंचाई',
    'nav.market': 'मंडी भाव',
    'nav.modules': 'सभी मॉड्यूल',
    'nav.voiceAi': 'वॉयस एआई 🎙',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.clean': 'क्लीन मोड',
    'nav.showUi': 'UI दिखाएं',
    'nav.menu': 'मेन्यू',

    // 12 Modules
    'module.plantDoctor.title': '🌱 AI पौधा डॉक्टर',
    'module.plantDoctor.desc': 'मल्टीमॉडल फसल रोग निदान और दवाएं',
    'module.weather.title': '🌦 कृषि मौसम रिपोर्ट',
    'module.weather.desc': 'IST माइक्रॉक्लाइमेट और छिड़काव परामर्श',
    'module.irrigation.title': '💧 स्मार्ट सिंचाई प्रणाली',
    'module.irrigation.desc': 'वाष्पोत्सर्जन और ड्रिप सिंचाई चक्र',
    'module.crops.title': '🌾 फसल प्रबंधन',
    'module.crops.desc': '7 सक्रिय क्यारियां और कटाई का हिसाब',
    'module.pesticide.title': '🧪 कीटनाशक और उर्वरक रिपोर्ट',
    'module.pesticide.desc': 'सुरक्षित खुराक, मौसम उपयुक्तता और PHI',
    'module.market.title': '💰 मंडी भाव / व्यापारी विवरण',
    'module.market.desc': 'लाइव ई-नाम मंडी दरें, खरीदार और संपर्क',
    'module.machinery.title': '🚜 कृषि मशीनरी व उपकरण',
    'module.machinery.desc': 'एग्री-ट्रैक टेलीमेट्री और पंप ऑटोमेशन',
    'module.soil.title': '🌱 मृदा स्वास्थ्य व उर्वरता',
    'module.soil.desc': 'NPK पोषक तत्व, pH और जैविक पारिस्थितिकी',
    'module.analytics.title': '📊 कृषि विश्लेषण व उपज',
    'module.analytics.desc': 'उपज पूर्वानुमान और जल संरक्षण दक्षता',
    'module.voice.title': '🎙 AI किसान साथी (वॉयस)',
    'module.voice.desc': 'अपनी भाषा में बोलकर कृषि सलाह पाएं',
    'module.location.title': '🗺 खेत का स्थान',
    'module.location.desc': 'जीपीएस और क्षेत्रीय कृषि केंद्र बदलें',
    'module.profile.title': '📋 मेरी कृषि प्रोफ़ाइल',
    'module.profile.desc': 'किसान का नाम, भूमि का आकार और मिट्टी विवरण',
    'module.today.title': '🌅 मेरा खेत आज',
    'module.today.desc': 'दैनिक स्थिति और स्मार्ट चेतावनियां',
    'module.farm3d.title': '🌐 3D डिजिटल खेत दृश्य',
    'module.farm3d.desc': 'इंटरएक्टिव वास्तविक 3D कृषि परिवेश',
    'module.modal.title': 'कृषि नियंत्रण केंद्र नेविगेशन',

    // Auth & Welcome
    'auth.welcomeTitle': 'AI कृषि सहायक में आपका स्वागत है',
    'auth.signIn': 'साइन इन करें',
    'auth.login': 'लॉगिन करें',
    'auth.createAccount': 'किसान प्रोफ़ाइल बनाएं 🌱',
    'auth.welcomeBack': 'स्वागत है, किसान भाई 🌱',
    'auth.demoFarmer': 'डेमो किसान के रूप में जारी रखें (विग्नेश · गुंटूर)',
    'auth.fullName': 'पूरा नाम',
    'auth.email': 'ईमेल पता',
    'auth.password': 'पासवर्ड',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.mobile': 'मोबाइल नंबर',
    'auth.farmLocation': 'खेत का स्थान / गाँव (वैकल्पिक)',
    'auth.mainCrop': 'मुख्य फसल (वैकल्पिक)',
    'auth.continueToLogin': 'लॉगिन पर आगे बढ़ें →',
    'auth.loginToAssistant': 'फार्म असिस्टेंट में लॉगिन करें →',
    'auth.alreadyHaveAccount': 'पहले से खाता है? लॉगिन करें',
    'auth.dontHaveAccount': 'खाता नहीं है? नया खाता बनाएं',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',

    // Farm Today Brief
    'today.brief': 'आज का कृषि सारांश',
    'today.keyActions': 'इस समय के 3 महत्वपूर्ण कार्य (IST):',
    'today.matrix': 'आज की खेत स्थिति मैट्रिक्स',
    'today.syncedIst': 'भारतीय मानक समय (IST) के साथ समन्वयित',
    'today.alerts': 'स्मार्ट फार्म टेलीमेट्री चेतावनियां',
    'today.activeTriggers': '3 सक्रिय स्वचालित अलर्ट',
    'today.favorable': 'अनुकूल',
    'today.ready': 'तैयार',
    'today.monitor': 'निगरानी रखें',
    'today.healthy': 'स्वस्थ',
    'today.suitable': 'छिड़काव उपयुक्त',
    'today.moderate': 'मध्यम',

    // 3D Scene & Hero Overlay
    'hero.kicker': 'Spline 3D स्थानिक दृश्य · पुनर्योजी कृषि-पारिस्थितिकी · इंटरएक्टिव WebGL',
    'hero.title': 'मिट्टी से शिखर तक कृषि का भविष्य।',
    'hero.desc': 'एक इंटरएक्टिव, वास्तविक समय कृषि पारिस्थितिकी तंत्र का अनुभव करें। किसान को जैविक फसल क्यारियों की देखभाल करते, सटीक ड्रिप सिंचाई लाइनों और खेत के बुनियादी ढांचे का निरीक्षण करते देखें।',
    'hero.observeFarmer': 'खेत में किसान को देखें',
    'hero.fieldSpecs': '3D खेत विवरण',
    'hero.moisture': 'मिट्टी में नमी',
    'hero.dripHydration': 'लक्षित ड्रिप सिंचाई',
    'hero.rows': 'समानांतर फसल क्यारियां',
    'hero.cropTypes': 'सलाद पत्ता, गाजर व स्वीट कॉर्न',
    'hero.lighting': 'सिनेमैटिक 3D लाइटिंग',
    'hero.cam.hero': 'विहंगम पैनोरमा',
    'hero.cam.farmer': 'सक्रिय किसान',
    'hero.cam.barn': 'खलिहान व साइलो',
    'hero.cam.tractor': 'ट्रैक्टर लेन',
    'hero.cam.orbit': '360° ड्रोन चक्कर',
    'hero.time.dawn': 'सूर्योदय भोर',
    'hero.time.noon': 'दोपहर धूप',
    'hero.time.golden': 'सुनहरी शाम',
    'hero.time.twilight': 'गोधूलि बेला',
    'hero.mist': 'फव्वारा छिड़काव',
    'hero.wind': 'फसल की हवा',
    'hero.perspective': 'दृश्य कोण:',

    // Weather
    'weather.title': 'संपूर्ण कृषि मौसम रिपोर्ट',
    'weather.station': 'कृषि मौसम विज्ञान केंद्र',
    'weather.demoBadge': 'डेमो मौसम डेटा',
    'weather.connectApi': 'लाइव मौसम API जोड़ें',
    'weather.sunrise': 'सूर्योदय',
    'weather.sunset': 'सूर्यास्त',
    'weather.farmingAdvice': 'मौसम आधारित कृषि सलाह',
    'weather.humidity': 'सापेक्ष आर्द्रता',
    'weather.wind': 'हवा की गति',
    'weather.soilTemp': 'मिट्टी का तापमान (10cm)',
    'weather.et0': 'वाष्पोत्सर्जन (ET₀)',
    'weather.sprayingIndex': 'छिड़काव उपयुक्तता सूचकांक',
    'weather.sprayWindow': 'अनुशंसित छिड़काव समय:',
    'weather.hourly': '24-घंटे का माइक्रॉक्लाइमेट (IST टाइमलाइन)',
    'weather.sevenDay': '7-दिवसीय कृषि मौसम पूर्वानुमान',
    'weather.subsurface': 'जमीन के अंदर मिट्टी का स्तर',

    // Irrigation
    'irrigation.title': 'स्मार्ट सिंचाई प्रणाली',
    'irrigation.subtitle': 'जल विज्ञान स्वचालन व टेलीमेट्री',
    'irrigation.optimalWindow': 'सिंचाई के लिए सबसे सही समय: सुबह 06:00 से 08:30 बजे',
    'irrigation.desc': 'सुबह का ड्रिप चक्र दोपहर की तुलना में 48% वाष्पीकरण कम करता है।',
    'irrigation.status': 'अनुशंसित',
    'irrigation.nextWindow': 'अगली सिंचाई',
    'irrigation.waterSaving': 'जल संरक्षण',
    'irrigation.duration': 'अवधि',
    'irrigation.toggleTrigger': '3D ड्रिप पल्स शुरू करें',
    'irrigation.toggleStop': 'फव्वारा बंद करें',

    // Plant Doctor
    'doctor.title': 'AI पौधा डॉक्टर व रोग निदान',
    'doctor.subtitle': 'मल्टीमॉडल पैथोलॉजी व कृषि दवा परामर्श',
    'doctor.upload': 'पौधे का फोटो अपलोड करें',
    'doctor.camera': 'मोबाइल कैमरे से फोटो खींचें',
    'doctor.enterSymptoms': 'लक्षण लिखकर बताएं',
    'doctor.sampleCases': 'नमूना परीक्षण (1-क्लिक टेस्ट):',
    'doctor.warning': 'AI निदान एक कृषि सहायता उपकरण है। गंभीर फसल रोगों की पुष्टि के लिए कृषि विशेषज्ञ से संपर्क करें।',
    'doctor.tabMedicines': 'अनुशंसित दवाएं व उपचार',
    'doctor.tabStores': 'निकटतम प्रमाणित कृषि केंद्र',
    'doctor.tabSymptoms': 'विस्तृत लक्षण व रोगजनक',

    // Pesticide & Fertilizer
    'pesticide.title': 'कीटनाशक और उर्वरक रिपोर्ट',
    'pesticide.subtitle': 'सुरक्षित खुराक, मौसम उपयुक्तता व PHI',
    'pesticide.crop': 'फसल चुनें',
    'pesticide.stage': 'वृद्धि अवस्था',
    'pesticide.problem': 'फसल की समस्या / कीट',
    'pesticide.chemical': 'रासायनिक उपचार',
    'pesticide.bio': 'जैविक विकल्प',
    'pesticide.timing': 'छिड़काव का सही समय',
    'pesticide.precautions': 'सुरक्षा सावधानियां',
    'pesticide.disclaimer': 'हमेशा उत्पाद लेबल के निर्देशों और स्थानीय कृषि अधिकारियों की सलाह का पालन करें।',

    // Market
    'market.title': 'मंडी भाव व कृषि बाजार',
    'market.subtitle': 'लाइव ई-नाम मंडी दरें, व्यापारी और संपर्क',
    'market.demoBadge': 'डेमो मंडी डेटा · लाइव API जोड़ें',
    'market.crop': 'फसल का नाम',
    'market.price': 'मॉडल मूल्य',
    'market.mandi': 'मंडी यार्ड',
    'market.trend': 'रुझान',
    'market.nearby': 'निकटतम व्यापारी व खरीदार',
    'market.call': 'व्यापारी को फोन करें',

    // Farm Profile
    'profile.title': 'मेरी कृषि प्रोफ़ाइल व भूमि विवरण',
    'profile.subtitle': 'पंजीकृत किसान प्रोफ़ाइल और खेत की जानकारी',
    'profile.name': 'किसान का नाम',
    'profile.mobile': 'मोबाइल नंबर',
    'profile.location': 'गाँव / क्षेत्र',
    'profile.farmSize': 'कुल भूमि का आकार',
    'profile.soilType': 'मिट्टी का प्रकार',
    'profile.crops': 'मुख्य फसलें',
    'profile.irrigation': 'सिंचाई प्रणाली',
    'profile.prefLang': 'पसंदीदा भाषा',
    'profile.save': 'प्रोफ़ाइल सहेजें व सलाह अपडेट करें',
    'profile.success': 'कृषि प्रोफ़ाइल सफलतापूर्वक सहेजी गई! व्यक्तिगत परामर्श अपडेट हुआ।',

    // Buttons & Labels
    'btn.changeLocation': 'स्थान बदलें',
    'btn.openVoiceAi': 'वॉयस एआई खोलें',
    'btn.emergencyHelp': '🆘 आपातकालीन सहायता',
    'btn.viewWeather': 'मौसम रिपोर्ट देखें',
    'btn.plantDoctor': 'AI पौधा डॉक्टर',
    'btn.observeFarmer': 'खेत में काम देखें',
    'btn.exploreField': '3D खेत विवरण',
    'btn.close': 'बंद करें',
    'btn.save': 'सहेजें',
    'btn.back': 'पीछे जाएं',
  },

  te: {
    // Brand & Header
    'brand.name': 'AI అగ్రికల్చర్ అసిస్టెంట్',
    'brand.subtitle': 'స్మార్ట్ వ్యవసాయ మేధస్సు',
    'brand.tagline': 'మెరుగైన పంటలు, సరైన నిర్ణయాలు మరియు ఉజ్వల భవిష్యత్తు కోసం స్మార్ట్ వ్యవసాయ మేధస్సు.',
    'brand.badge': 'AI • వాతావరణం • పంటలు • నీటిపారుదల • మార్కెట్',
    'brand.powered': 'మేధో వ్యవసాయం • AI ఆధారితం',
    'brand.subfooter': 'ఖచ్చితమైన నేల పరీక్ష • వాతావరణ సలహాలు • బహుభాషా వాయిస్ AI',
    'brand.chooseLanguage': 'మీ ప్రాధాన్య భాషను ఎంచుకోండి',

    // Nav
    'nav.today': 'నా పొలం నేడు',
    'nav.farm3d': '3D డిజిటల్ ఫార్మ్',
    'nav.weather': 'వాతావరణం',
    'nav.weather.native': 'వాతావరణ నివేదిక',
    'nav.plantDoctor': 'AI రైతు డాక్టర్',
    'nav.plantDoctor.native': 'తెగుళ్ల నిర్ధారణ',
    'nav.irrigation': 'నీటిపారుదల',
    'nav.market': 'మండి ధరలు',
    'nav.modules': 'అన్ని మాడ్యూల్స్',
    'nav.voiceAi': 'వాయిస్ AI 🎙',
    'nav.login': 'లాగిన్',
    'nav.logout': 'లాగౌట్',
    'nav.clean': 'క్లీన్ మోడ్',
    'nav.showUi': 'UI చూపించు',
    'nav.menu': 'మెనూ',

    // 12 Modules
    'module.plantDoctor.title': '🌱 AI రైతు డాక్టర్',
    'module.plantDoctor.desc': 'మొక్కల ఫోటోల ద్వారా తెగుళ్లు & మందుల సూచన',
    'module.weather.title': '🌦 వాతావరణ నివేదిక & సలహాలు',
    'module.weather.desc': 'IST మైక్రోక్లైమేట్ & మందుల పిచికారీ సలహాలు',
    'module.irrigation.title': '💧 స్మార్ట్ నీటిపారుదల మేధస్సు',
    'module.irrigation.desc': 'భాష్పోత్సేకం & డ్రిప్ పల్స్ నియంత్రణ',
    'module.crops.title': '🌾 పంటల నిర్వహణ',
    'module.crops.desc': '7 రకాల పంటల సాగు & కోత కౌంట్‌డౌన్',
    'module.pesticide.title': '🧪 పురుగుమందులు & ఎరువుల నివేదిక',
    'module.pesticide.desc': 'సరైన మోతాదు, వాతావరణ అనుకూలత & PHI రక్షణ',
    'module.market.title': '💰 మార్కెట్ / మండి వివరాలు',
    'module.market.desc': 'తాజా మార్కెట్ ధరలు, వ్యాపారులు & ఫోన్ నంబర్లు',
    'module.machinery.title': '🚜 వ్యవసాయ యంత్రాలు & పరికరాలు',
    'module.machinery.desc': 'అగ్రి-ట్రాక్ టెలిమెట్రీ & పంప్ ఆటోమేషన్',
    'module.soil.title': '🌱 నేల జీవశాస్త్రం & పోషకాలు',
    'module.soil.desc': 'NPK పోషకాలు, pH విలువ & జీవ ఎరువులు',
    'module.analytics.title': '📊 వ్యవసాయ విశ్లేషణలు',
    'module.analytics.desc': 'దిగుబడి అంచనాలు & నీటి ఆదా శాతం',
    'module.voice.title': '🎙 AI రైతు వాయిస్ అసిస్టెంట్',
    'module.voice.desc': 'తెలుగులో మాట్లాడి తక్షణ సమాధానం పొందండి',
    'module.location.title': '🗺 వ్యవసాయ ప్రాంతం (లొకేషన్)',
    'module.location.desc': 'వ్యవసాయ జోన్ & GPS మార్చుకోండి',
    'module.profile.title': '📋 నా వ్యవసాయ ప్రొఫైల్',
    'module.profile.desc': 'రైతు పేరు, భూమి విస్తీర్ణం & నేల వివరాలు',
    'module.today.title': '🌅 నా పొలం నేడు',
    'module.today.desc': 'నేటి పొలం స్థితి & హెచ్చరికలు',
    'module.farm3d.title': '🌐 3D పంట క్షేత్రం',
    'module.farm3d.desc': 'ప్రత్యక్ష 3D వ్యవసాయ వాతావరణం',
    'module.modal.title': 'వ్యవసాయ కంట్రోల్ సెంటర్ మాడ్యూల్స్',

    // Auth & Welcome
    'auth.welcomeTitle': 'AI అగ్రికల్చర్ అసిస్టెంట్‌కి స్వాగతం',
    'auth.signIn': 'సైన్ ఇన్ చేయండి',
    'auth.login': 'లాగిన్ అవ్వండి',
    'auth.createAccount': 'మీ రైతు ప్రొఫైల్ సృష్టించండి 🌱',
    'auth.welcomeBack': 'మళ్లీ స్వాగతం, రైతు మిత్రమా 🌱',
    'auth.demoFarmer': 'డెమో రైతుగా కొనసాగండి (విగ్నేష్ · గుంటూరు)',
    'auth.fullName': 'పూర్తి పేరు',
    'auth.email': 'ఈమెయిల్ చిరునామా',
    'auth.password': 'పాస్‌వర్డ్',
    'auth.confirmPassword': 'పాస్‌వర్డ్ నిర్ధారించండి',
    'auth.mobile': 'మొబైల్ నంబర్',
    'auth.farmLocation': 'గ్రామం / ప్రాంతం (ఐచ్ఛికం)',
    'auth.mainCrop': 'ప్రధాన పంట (ఐచ్ఛికం)',
    'auth.continueToLogin': 'లాగిన్‌కు కొనసాగండి →',
    'auth.loginToAssistant': 'ఫార్మ్ అసిస్టెంట్‌లోకి లాగిన్ అవ్వండి →',
    'auth.alreadyHaveAccount': 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి',
    'auth.dontHaveAccount': 'ఖాతా లేదా? కొత్త ఖాతా సృష్టించండి',
    'auth.forgotPassword': 'పాస్‌వర్డ్ మర్చిపోయారా?',

    // Farm Today Brief
    'today.brief': 'నేటి పొలం ముఖ్యాంశాలు',
    'today.keyActions': 'ఈ సమయంలో చేయవలసిన 3 ముఖ్యమైన పనులు (IST):',
    'today.matrix': 'నేటి పొలం సమగ్ర స్థితి',
    'today.syncedIst': 'భారత ప్రామాణిక సమయం (IST)తో అనుసంధానించబడింది',
    'today.alerts': 'స్మార్ట్ ఫార్మ్ హెచ్చరికలు',
    'today.activeTriggers': '3 క్రియాశీల ఆటోమేటెడ్ అలర్ట్‌లు',
    'today.favorable': 'అనుకూలం',
    'today.ready': 'సిద్ధంగా ఉంది',
    'today.monitor': 'పరిశీలించండి',
    'today.healthy': 'ఆరోగ్యకరం',
    'today.suitable': 'పిచికారీకి అనుకూలం',
    'today.moderate': 'మధ్యస్థం',

    // 3D Scene & Hero Overlay
    'hero.kicker': 'Spline 3D ప్రాదేశిక దృశ్యం · సహజ సిద్ధ వ్యవసాయ పర్యావరణం · ప్రత్యక్ష WebGL',
    'hero.title': 'నేల నుండి శిఖరం వరకు వ్యవసాయ భవిష్యత్తు.',
    'hero.desc': 'ఆధునిక Spline 3D శైలిలో రూపొందించబడిన ప్రత్యక్ష వ్యవసాయ పర్యావరణాన్ని అనుభవించండి. రైతు పంట మడుల సంరక్షణ, సూక్ష్మ డ్రిప్ నీటిపారుదల లైన్లు మరియు క్షేత్ర మౌలిక సదుపాయాల పరిశీలనను చూడండి.',
    'hero.observeFarmer': 'పొలంలో రైతు పనితీరు చూడండి',
    'hero.fieldSpecs': '3D పొలం వివరాలు',
    'hero.moisture': 'నేలలో తేమ శాతం',
    'hero.dripHydration': 'లక్ష్యిత డ్రిప్ ఆర్ద్రీకరణ',
    'hero.rows': 'సమాంతర పంట మడులు',
    'hero.cropTypes': 'లెట్యూస్, క్యారెట్ & మొక్కజొన్న',
    'hero.lighting': 'సినిమాటిక్ 3D లైటింగ్',
    'hero.cam.hero': 'విహంగమ వీక్షణం',
    'hero.cam.farmer': 'శ్రమిస్తున్న రైతు',
    'hero.cam.barn': 'గిడ్డంగి & సైలో',
    'hero.cam.tractor': 'ట్రాక్టర్ మార్గం',
    'hero.cam.orbit': '360° డ్రోన్ పరిభ్రమణం',
    'hero.time.dawn': 'సూర్యోదయ ఉషస్సు',
    'hero.time.noon': 'మధ్యాహ్న ఎండ',
    'hero.time.golden': 'సాయంత్రం వెలుగు',
    'hero.time.twilight': 'సంధ్యా సమయం',
    'hero.mist': 'తుంపర పిచికారీ',
    'hero.wind': 'పంట గాలి వేగం',
    'hero.perspective': 'వీక్షణ కోణం:',

    // Weather
    'weather.title': 'పూర్తి వ్యవసాయ వాతావరణ నివేదిక',
    'weather.station': 'వ్యవసాయ వాతావరణ పరిశీలన కేంద్రం',
    'weather.demoBadge': 'డెమో వాతావరణ డేటా',
    'weather.connectApi': 'లైవ్ వెదర్ API కనెక్ట్ చేయండి',
    'weather.sunrise': 'సూర్యోదయం',
    'weather.sunset': 'సూర్యాస్తమయం',
    'weather.farmingAdvice': 'వాతావరణ ఆధారిత రైతు సలహాలు',
    'weather.humidity': 'గాలిలో తేమ (హ్యుమిడిటీ)',
    'weather.wind': 'గాలి వేగం',
    'weather.soilTemp': 'నేల ఉష్ణోగ్రత (10 సెం.మీ)',
    'weather.et0': 'భాష్పోత్సేకం (ET₀)',
    'weather.sprayingIndex': 'మందుల పిచికారీ సూచిక',
    'weather.sprayWindow': 'సిఫార్సు చేయబడిన పిచికారీ సమయం:',
    'weather.hourly': '24-గంటల మైక్రోక్లైమేట్ (IST కాలపట్టిక)',
    'weather.sevenDay': '7 రోజుల వ్యవసాయ వాతావరణ సూచన',
    'weather.subsurface': 'భూగర్భ నేల పోషక స్థాయిలు',

    // Irrigation
    'irrigation.title': 'స్మార్ట్ నీటిపారుదల మేధస్సు',
    'irrigation.subtitle': 'జల శాస్త్ర ఆటోమేషన్ & టెలిమెట్రీ',
    'irrigation.optimalWindow': 'నీటిపారుదలకు అత్యుత్తమ సమయం: ఉదయం 06:00 నుండి 08:30 వరకు',
    'irrigation.desc': 'ఉదయపు డ్రిప్ పల్స్ మధ్యాహ్నం కంటే భాష్పీభవనాన్ని 48% తగ్గిస్తుంది.',
    'irrigation.status': 'సిఫార్సు చేయబడింది',
    'irrigation.nextWindow': 'తదుపరి నీటి విడత',
    'irrigation.waterSaving': 'నీటి ఆదా శాతం',
    'irrigation.duration': 'కాలవ్యవధి',
    'irrigation.toggleTrigger': '3D డ్రిప్ పల్స్ ప్రారంభించండి',
    'irrigation.toggleStop': 'తుంపర ఆపండి',

    // Plant Doctor
    'doctor.title': 'AI రైతు డాక్టర్ & తెగుళ్ల నిర్ధారణ',
    'doctor.subtitle': 'మల్టీమోడల్ పాథాలజీ & వ్యవసాయ మందుల సలహా',
    'doctor.upload': 'మొక్క ఫోటో అప్‌లోడ్ చేయండి',
    'doctor.camera': 'మొబైల్ కెమెరాతో ఫోటో తీయండి',
    'doctor.enterSymptoms': 'తెగులు లక్షణాలు టైప్ చేయండి',
    'doctor.sampleCases': 'నమూనా పరీక్షలు (1-క్లిక్ టెస్ట్):',
    'doctor.warning': 'AI రోగ నిర్ధారణ ఒక వ్యవసాయ సహాయక సాధనం మాత్రమే. తీవ్రమైన పంట తెగుళ్లకు సంబంధిత వ్యవసాయ శాస్త్రవేత్తను సంప్రదించండి.',
    'doctor.tabMedicines': 'సిఫార్సు చేసిన మందులు',
    'doctor.tabStores': 'సమీప ధృవీకృత పురుగుమందుల దుకాణాలు',
    'doctor.tabSymptoms': 'వివరమైన లక్షణాలు & క్రిమి రకం',

    // Pesticide & Fertilizer
    'pesticide.title': 'పురుగుమందులు & ఎరువుల నివేదిక',
    'pesticide.subtitle': 'సరైన మోతాదు, వాతావరణ అనుకూలత & PHI రక్షణ',
    'pesticide.crop': 'పంటను ఎంచుకోండి',
    'pesticide.stage': 'ఎదుగుదల దశ',
    'pesticide.problem': 'పంట సమస్య / తెగులు',
    'pesticide.chemical': 'రసాయన మందుల సిఫార్సు',
    'pesticide.bio': 'సేంద్రీయ / జీవ నివారణ',
    'pesticide.timing': 'పిచికారీ చేయవలసిన సమయం',
    'pesticide.precautions': 'రక్షణ జాగ్రత్తలు',
    'pesticide.disclaimer': 'ఎల్లప్పుడూ ఉత్పత్తి లేబుల్ సూచనలు మరియు స్థానిక వ్యవసాయ అధికారుల సలహాలను పాటించండి.',

    // Market
    'market.title': 'మార్కెట్ & మండి మేధస్సు',
    'market.subtitle': 'లైవ్ e-NAM మండి ధరలు, వ్యాపారులు & ఫోన్ నంబర్లు',
    'market.demoBadge': 'డెమో మండి డేటా · లైవ్ API జోడించండి',
    'market.crop': 'పంట పేరు',
    'market.price': 'మోడల్ ధర',
    'market.mandi': 'మార్కెట్ యార్డ్',
    'market.trend': 'ధర మార్పు',
    'market.nearby': 'సమీప వ్యాపారులు & కొనుగోలుదారులు',
    'market.call': 'వ్యాపారికి కాల్ చేయండి',

    // Farm Profile
    'profile.title': 'నా వ్యవసాయ ప్రొఫైల్ & భూమి వివరాలు',
    'profile.subtitle': 'నమోదైన రైతు ప్రొఫైల్ మరియు క్షేత్ర వివరాలు',
    'profile.name': 'రైతు పేరు',
    'profile.mobile': 'మొబైల్ నంబర్',
    'profile.location': 'గ్రామం / ప్రాంతం',
    'profile.farmSize': 'మొత్తం భూమి విస్తీర్ణం',
    'profile.soilType': 'నేల రకం',
    'profile.crops': 'సాగు చేస్తున్న ప్రధాన పంటలు',
    'profile.irrigation': 'నీటిపారుదల పద్ధతి',
    'profile.prefLang': 'ప్రాధాన్య భాష',
    'profile.save': 'ప్రొఫైల్ సేవ్ చేయండి & సలహాలు పొందండి',
    'profile.success': 'రైతు ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది! వ్యక్తిగత సలహాలు నవీకరించబడ్డాయి.',

    // Buttons & Labels
    'btn.changeLocation': 'ప్రాంతం మార్చండి',
    'btn.openVoiceAi': 'వాయిస్ AI తెరవండి',
    'btn.emergencyHelp': '🆘 అత్యవసర సహాయం',
    'btn.viewWeather': 'వాతావరణం చూడండి',
    'btn.plantDoctor': 'AI రైతు డాక్టర్',
    'btn.observeFarmer': 'రైతు పనితీరు చూడండి',
    'btn.exploreField': '3D పొలం వివరాలు',
    'btn.close': 'మూసివేయి',
    'btn.save': 'సేవ్ చేయండి',
    'btn.back': 'వెనుకకు',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('terraverde_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'te')) {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('terraverde_lang', lang);
      document.documentElement.lang = lang;
    } catch {}
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {}
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict && dict[key]) return dict[key];
    if (translations.en && translations.en[key]) return translations.en[key];
    return fallback || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
