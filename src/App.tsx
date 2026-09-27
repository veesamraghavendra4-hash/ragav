import React, { useState, useEffect } from 'react';
import { FarmScene3D, TimeOfDay, CameraPreset } from './components/FarmScene3D';
import { Navbar, AppPage } from './components/Navbar';
import { HeroOverlay } from './components/HeroOverlay';
import { FieldSpecsModal } from './components/FieldSpecsModal';
import { WeatherPage } from './components/WeatherPage';
import { AiPlantDoctorPage } from './components/AiPlantDoctorPage';
import { OrganizedCropsPanel } from './components/OrganizedCropsPanel';
import { FieldOperationsPanel } from './components/FieldOperationsPanel';
import { SoilBiologyPanel } from './components/SoilBiologyPanel';
import { IrrigationIntelligencePanel } from './components/IrrigationIntelligencePanel';
import { PesticideFertilizerPanel } from './components/PesticideFertilizerPanel';
import { MarketIntelligencePanel } from './components/MarketIntelligencePanel';
import { FarmProfilePanel } from './components/FarmProfilePanel';
import { FarmAnalyticsPanel } from './components/FarmAnalyticsPanel';
import { FarmTodayCommandCenter } from './components/FarmTodayCommandCenter';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthModal } from './components/AuthModal';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { EmergencyHelpModal } from './components/EmergencyHelpModal';
import { FarmerUser } from './components/PhoneLoginModal';
import {
  Compass,
  CloudSun,
  Stethoscope,
  Sparkles,
  LayoutGrid,
  Droplets,
  TrendingUp,
} from 'lucide-react';
import { getISTInfo } from './utils/istTime';
import { useLanguage } from './utils/i18n';

export default function App() {
  const { t, language } = useLanguage();
  // Authentication & Flow State
  const [loggedInUser, setLoggedInUser] = useState<FarmerUser | null>(() => {
    try {
      const saved = localStorage.getItem('terraverde_farmer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Determines whether the Welcome / Landing screen is shown first
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('terraverde_farmer_user');
      return !saved; // If no saved user, show Welcome Screen first
    } catch {
      return true;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'login'>('login');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [emergencyHelpOpen, setEmergencyHelpOpen] = useState(false);

  // Active Control Center View
  const [currentPage, setCurrentPage] = useState<AppPage>('today');

  // 3D Scene Controls (Synced to Indian Standard Time preset on launch)
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getISTInfo().timeOfDayPreset);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [windSpeed, setWindSpeed] = useState<number>(1.0);
  const [irrigationActive, setIrrigationActive] = useState<boolean>(true);
  const [isUiHidden, setIsUiHidden] = useState<boolean>(false);
  const [specsModalOpen, setSpecsModalOpen] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    name: string;
    category: string;
    description: string;
    stat?: string;
  } | null>(null);

  const handleOpenSignIn = () => {
    setAuthModalMode('signin');
    setAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: FarmerUser) => {
    setLoggedInUser(user);
    try {
      localStorage.setItem('terraverde_farmer_user', JSON.stringify(user));
    } catch {}
    setShowWelcome(false);
    setAuthModalOpen(false);

    // Ask location permission if not already set or ask to confirm
    const hasLocation = user.location && user.location !== 'Guntur Agri Zone';
    if (!hasLocation) {
      setTimeout(() => {
        setLocationModalOpen(true);
      }, 500);
    }

    setCurrentPage('today');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueAsGuest = () => {
    const demoUser: FarmerUser = {
      name: 'Vignesh Rythu',
      phone: '9848023456',
      location: 'Guntur Agri Zone',
      token: `demo_${Date.now()}`,
    };
    handleAuthSuccess(demoUser);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    try {
      localStorage.removeItem('terraverde_farmer_user');
    } catch {}
    setShowWelcome(true);
  };

  const handleLocationSelected = (locationName: string) => {
    if (loggedInUser) {
      const updated = { ...loggedInUser, location: locationName };
      setLoggedInUser(updated);
      try {
        localStorage.setItem('terraverde_farmer_user', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleUpdateUserProfile = (updated: FarmerUser) => {
    setLoggedInUser(updated);
    try {
      localStorage.setItem('terraverde_farmer_user', JSON.stringify(updated));
    } catch {}
  };

  const handleFocusPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    if (currentPage !== 'farm3d') {
      setCurrentPage('farm3d');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ========================================================
  // 1. WELCOME SCREEN FLOW (BEFORE LOGGING IN)
  // ========================================================
  if (showWelcome && !loggedInUser) {
    return (
      <div className="relative min-h-screen bg-[#08120a] text-slate-100">
        <WelcomeScreen
          onOpenSignIn={handleOpenSignIn}
          onOpenLogin={handleOpenLogin}
          onContinueAsGuest={handleContinueAsGuest}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // ========================================================
  // 2. AFTER LOGIN – AGRICULTURE CONTROL CENTER
  // ========================================================
  return (
    <div className="relative min-h-screen bg-[#0d160e] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 3D Farm Canvas (Active when viewing 3D scene) */}
      <div
        className={`fixed inset-0 w-full h-full z-0 transition-opacity duration-700 ${
          currentPage === 'farm3d' ? 'opacity-100 pointer-events-auto' : 'opacity-20 pointer-events-none'
        }`}
      >
        <FarmScene3D
          timeOfDay={timeOfDay}
          cameraPreset={cameraPreset}
          windSpeed={windSpeed}
          irrigationActive={irrigationActive}
          onSelectFeature={setSelectedFeature}
          isUiHidden={isUiHidden}
        />
      </div>

      {/* Top Bar Navigation (Clean modern UI - removed clutter tabs from top) */}
      <Navbar
        currentPage={currentPage}
        onNavigatePage={setCurrentPage}
        isUiHidden={isUiHidden}
        onToggleUiHidden={() => setIsUiHidden((prev) => !prev)}
        onOpenSpecsModal={() => setSpecsModalOpen(true)}
        loggedInUser={loggedInUser}
        onOpenLoginModal={handleOpenLogin}
        onLogout={handleLogout}
        onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        onOpenEmergencyHelp={() => setEmergencyHelpOpen(true)}
      />

      {/* Mobile Sticky Quick Switcher (Phones & Tablets) */}
      <div className="lg:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#0c160e]/95 backdrop-blur-xl border border-white/15 p-1.5 rounded-2xl flex items-center justify-between shadow-2xl">
        <button
          onClick={() => setCurrentPage('today')}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
            currentPage === 'today' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('nav.today')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('farm3d')}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
            currentPage === 'farm3d' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t('nav.farm3d')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('weather')}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
            currentPage === 'weather' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>{t('nav.weather')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('plantDoctor')}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
            currentPage === 'plantDoctor' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{t('nav.plantDoctor')}</span>
        </button>

        <button
          onClick={() => setCurrentPage('irrigation')}
          className={`flex-1 py-1.5 text-[11px] font-semibold rounded-xl transition-colors flex flex-col items-center gap-0.5 cursor-pointer ${
            currentPage === 'irrigation' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>{t('nav.irrigation')}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW: MY FARM TODAY (Farm Command Center) */}
      {/* ======================================================== */}
      {currentPage === 'today' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <FarmTodayCommandCenter
            farmerName={loggedInUser?.name}
            farmerLocation={loggedInUser?.location}
            onNavigateTab={(tab) => setCurrentPage(tab as AppPage)}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: 3D FARM SCENE (Digital Twin) */}
      {/* ======================================================== */}
      {currentPage === 'farm3d' && (
        <>
          {/* Hero Section Container (100vh) */}
          <section className="relative w-full h-screen flex flex-col justify-between overflow-hidden">
            <div
              className={`transition-opacity duration-500 w-full h-full ${
                isUiHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <HeroOverlay
                timeOfDay={timeOfDay}
                onChangeTimeOfDay={setTimeOfDay}
                cameraPreset={cameraPreset}
                onChangeCameraPreset={setCameraPreset}
                windSpeed={windSpeed}
                onChangeWindSpeed={setWindSpeed}
                irrigationActive={irrigationActive}
                onToggleIrrigation={() => setIrrigationActive((prev) => !prev)}
                onExploreField={() => setSpecsModalOpen(true)}
                selectedFeature={selectedFeature}
                onDismissFeature={() => setSelectedFeature(null)}
                loggedInUser={loggedInUser}
                onOpenLoginModal={handleOpenLogin}
              />
            </div>

            {isUiHidden && (
              <div className="absolute top-20 right-6 z-40 bg-[#0f1710]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs text-slate-300 shadow-xl flex items-center gap-2">
                <span>Clean Mode · Click 3D objects or drag to tilt camera</span>
                <button
                  onClick={() => setIsUiHidden(false)}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer ml-1"
                >
                  Restore UI
                </button>
              </div>
            )}
          </section>

          {/* Preserved Farm Modules Below 3D Canvas */}
          <section className="relative z-20 bg-[#0c140d]/95 border-t border-white/10 backdrop-blur-2xl py-16 px-4 sm:px-6 lg:px-12 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                    Organized Crop Rows, Fleet Machinery & Soil Biology
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Live precision crop cultivation, autonomous tractor operations, and living mycorrhizal soil health.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('weather')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <CloudSun className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Weather Report</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('plantDoctor')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>AI Plant Doctor</span>
                  </button>
                </div>
              </div>

              {/* Module 1: Organized Crops */}
              <div className="space-y-4">
                <OrganizedCropsPanel
                  onFocusRowIn3D={handleFocusPreset}
                  onTriggerRowWater={() => setIrrigationActive(true)}
                />
              </div>

              {/* Module 2: Field Operations & Machinery */}
              <div className="space-y-4 pt-8 border-t border-white/10">
                <FieldOperationsPanel
                  irrigationActive={irrigationActive}
                  onToggleIrrigation={() => setIrrigationActive((prev) => !prev)}
                  onFocusCamera={handleFocusPreset}
                />
              </div>

              {/* Module 3: Soil Biology */}
              <div className="space-y-4 pt-8 border-t border-white/10">
                <SoilBiologyPanel
                  farmerName={loggedInUser?.name}
                  farmerLocation={loggedInUser?.location}
                />
              </div>

              {/* Footer */}
              <footer className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                <div>AI Agriculture Assistant · 3D Spatial Visualization & Agro-Intelligence</div>
                <div className="flex items-center gap-6">
                  <span>WebGL Three.js Engine</span>
                  <span>·</span>
                  <span>Gemini Multimodal Vision</span>
                  <span>·</span>
                  <span>Agro-Meteorological Station</span>
                </div>
              </footer>
            </div>
          </section>
        </>
      )}

      {/* ======================================================== */}
      {/* VIEW: AGRICULTURAL WEATHER REPORT */}
      {/* ======================================================== */}
      {currentPage === 'weather' && (
        <WeatherPage
          userLocation={loggedInUser?.location}
          userName={loggedInUser?.name}
        />
      )}

      {/* ======================================================== */}
      {/* VIEW: AI PLANT DOCTOR & MEDICINES */}
      {/* ======================================================== */}
      {currentPage === 'plantDoctor' && <AiPlantDoctorPage />}

      {/* ======================================================== */}
      {/* VIEW: IRRIGATION INTELLIGENCE */}
      {/* ======================================================== */}
      {currentPage === 'irrigation' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <IrrigationIntelligencePanel
            irrigationActive={irrigationActive}
            onToggleIrrigation={() => setIrrigationActive((prev) => !prev)}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: CROP MANAGEMENT (7 Organized Beds) */}
      {/* ======================================================== */}
      {currentPage === 'crops' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1710]/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
            <OrganizedCropsPanel
              onFocusRowIn3D={handleFocusPreset}
              onTriggerRowWater={() => setIrrigationActive(true)}
            />
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: PESTICIDE & FERTILIZER REPORT */}
      {/* ======================================================== */}
      {currentPage === 'pesticide' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <PesticideFertilizerPanel />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: MARKET / MANDI DETAILS */}
      {/* ======================================================== */}
      {currentPage === 'market' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <MarketIntelligencePanel />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: FARM MACHINERY & FIELD OPERATIONS */}
      {/* ======================================================== */}
      {currentPage === 'machinery' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1710]/95 border border-emerald-500/30 backdrop-blur-xl shadow-2xl">
            <FieldOperationsPanel
              irrigationActive={irrigationActive}
              onToggleIrrigation={() => setIrrigationActive((prev) => !prev)}
              onFocusCamera={handleFocusPreset}
            />
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: SOIL INTELLIGENCE */}
      {/* ======================================================== */}
      {currentPage === 'soil' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <SoilBiologyPanel
            farmerName={loggedInUser?.name}
            farmerLocation={loggedInUser?.location}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: FARM ANALYTICS */}
      {/* ======================================================== */}
      {currentPage === 'analytics' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <FarmAnalyticsPanel />
        </main>
      )}

      {/* ======================================================== */}
      {/* VIEW: MY FARM PROFILE */}
      {/* ======================================================== */}
      {currentPage === 'profile' && (
        <main className="relative z-10 pt-24 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
          <FarmProfilePanel
            user={loggedInUser}
            onUpdateUser={handleUpdateUserProfile}
          />
        </main>
      )}

      {/* ======================================================== */}
      {/* SYSTEM MODALS */}
      {/* ======================================================== */}
      {/* Auth Modal (Sign In / Login) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Location Permission & Hub Selector */}
      <LocationPermissionModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onLocationSelected={handleLocationSelected}
      />

      {/* Voice Assistant Modal (Telugu | Hindi | English) */}
      <VoiceAssistantModal
        isOpen={voiceAssistantOpen}
        onClose={() => setVoiceAssistantOpen(false)}
      />

      {/* 24/7 Emergency Helpline Modal */}
      <EmergencyHelpModal
        isOpen={emergencyHelpOpen}
        onClose={() => setEmergencyHelpOpen(false)}
        location={loggedInUser?.location}
      />

      {/* 3D Field Specifications Raycast Modal */}
      <FieldSpecsModal
        isOpen={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
        onJumpToPreset={(preset) => {
          handleFocusPreset(preset);
          setSpecsModalOpen(false);
        }}
      />
    </div>
  );
}
