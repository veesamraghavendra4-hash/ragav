import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sprout,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FarmerUser } from './PhoneLoginModal';
import { useLanguage } from '../utils/i18n';
import { LanguageSelector } from './LanguageSelector';
import { syncFarmerProfileToCloud } from '../utils/supabase';

export interface UserAccount {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  location: string;
  mainCrop: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'login';
  onClose: () => void;
  onAuthSuccess: (user: FarmerUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onAuthSuccess,
}) => {
  const { t, language } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'login'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Guntur Agri Zone');
  const [mainCrop, setMainCrop] = useState('Tomato');

  // Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Keep state in sync with initialMode when opened
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Simple client-side pseudo-hash abstraction (avoiding raw plaintext)
  const pseudoHash = (pwd: string) => {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      hash = (hash << 5) - hash + pwd.charCodeAt(i);
      hash |= 0;
    }
    return `ph_${Math.abs(hash).toString(36)}_${pwd.length}`;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया अपना पूरा नाम दर्ज करें।'
          : 'Please enter your full name.'
      );
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి సరైన ఈమెయిల్ నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें।'
          : 'Please enter a valid email address.'
      );
      return;
    }
    if (password.length < 6) {
      setErrorMsg(
        language === 'te'
          ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.'
          : language === 'hi'
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(
        language === 'te'
          ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.'
          : language === 'hi'
          ? 'पासवर्ड मेल नहीं खा रहे हैं।'
          : 'Passwords do not match.'
      );
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('terraverde_registered_accounts');
      const users: UserAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg(
          language === 'te'
            ? 'ఈ ఈమెయిల్‌తో ఇప్పటికే ఖాతా ఉంది. దయచేసి లాగిన్ అవ్వండి.'
            : language === 'hi'
            ? 'इस ईमेल के साथ पहले से खाता मौजूद है। कृपया लॉगिन करें।'
            : 'An account with this email address already exists. Please log in.'
        );
        return;
      }

      const newUser: UserAccount = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: pseudoHash(password),
        phone: cleanPhone,
        location: location || 'Guntur Agri Zone',
        mainCrop: mainCrop || 'Tomato',
      };

      users.push(newUser);
      localStorage.setItem('terraverde_registered_accounts', JSON.stringify(users));

      // Asynchronously synchronize with Supabase Cloud
      syncFarmerProfileToCloud({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        location: newUser.location,
        main_crop: newUser.mainCrop,
        preferred_language: language,
      }).catch(() => {});

      setSuccessMsg(
        language === 'te'
          ? 'రైతు ప్రొఫైల్ విజయవంతంగా సృష్టించబడింది! ఇప్పుడు లాగిన్ అవ్వండి.'
          : language === 'hi'
          ? 'किसान प्रोफ़ाइल सफलतापूर्वक बनाई गई! अब लॉगिन करें।'
          : 'Farmer profile created successfully! You can now login.'
      );
      setTimeout(() => {
        setMode('login');
        setSuccessMsg(null);
      }, 1200);
    } catch {
      setErrorMsg('Could not save profile to local storage.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      setErrorMsg(
        language === 'te'
          ? 'దయచేసి మీ ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.'
          : language === 'hi'
          ? 'कृपया अपना ईमेल और पासवर्ड दर्ज करें।'
          : 'Please enter your email and password.'
      );
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('terraverde_registered_accounts');
      const users: UserAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const found = users.find((u) => u.email === cleanEmail);
      if (!found || found.passwordHash !== pseudoHash(password)) {
        setErrorMsg(
          language === 'te'
            ? 'చెల్లని ఈమెయిల్ లేదా పాస్‌వర్డ్. వివరాలు సరిచూసుకోండి.'
            : language === 'hi'
            ? 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें।'
            : 'Invalid email or password. Please check credentials or register.'
        );
        return;
      }

      onAuthSuccess({
        name: found.name,
        phone: found.phone,
        location: found.location,
        token: `auth_${Date.now()}`,
      });
      onClose();
    } catch {
      setErrorMsg('Authentication error. Try demo login.');
    }
  };

  const handleDemoFarmer = () => {
    onAuthSuccess({
      name: 'Vignesh Rythu',
      phone: '9848023456',
      location: 'Guntur Agri Zone',
      token: `demo_${Date.now()}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1710] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/15 blur-2xl pointer-events-none" />

        {/* Top Control Bar: Language, Supabase status & Close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" />
            <span
              title="Cloud database configured: Supabase"
              className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Supabase</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'signin'
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth.signIn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('auth.login')}
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE: SIGN IN (CREATE FARMER PROFILE) */}
        {/* ======================================================== */}
        {mode === 'signin' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-white font-display">
                {t('auth.createAccount')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'te'
                  ? 'వ్యక్తిగతీకరించిన వాతావరణ సలహాలు, స్మార్ట్ నీటిపారుదల & AI తెగుళ్ల నివారణను పొందండి.'
                  : language === 'hi'
                  ? 'व्यक्तिगत कृषि सलाह, स्मार्ट सिंचाई और AI पौधा स्वास्थ्य प्राप्त करें।'
                  : 'Access personalized farm advisory, smart irrigation, and AI plant health.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                {t('auth.fullName')} <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vignesh Patel"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.email')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@kisan.in"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.mobile')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98480 12345"
                    maxLength={10}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.password')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.confirmPassword')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.farmLocation')}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Guntur Agri Zone"
                    className="w-full pl-9 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  {t('auth.mainCrop')}
                </label>
                <div className="relative">
                  <Sprout className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                  <select
                    value={mainCrop}
                    onChange={(e) => setMainCrop(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Tomato" className="bg-slate-900">Tomato (టమోటా / टमाटर)</option>
                    <option value="Chili" className="bg-slate-900">Chili (మిరప / मिर्च)</option>
                    <option value="Paddy" className="bg-slate-900">Paddy Rice (వరి / धान)</option>
                    <option value="Cotton" className="bg-slate-900">Cotton (పత్తి / कपास)</option>
                    <option value="Maize" className="bg-slate-900">Sweet Corn (మొక్కజొన్న / मक्का)</option>
                    <option value="Cabbage" className="bg-slate-900">Cabbage / Greens (క్యాబేజీ / पत्तागोभी)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50 mt-4"
            >
              <span>{t('auth.continueToLogin')}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-emerald-300 cursor-pointer"
              >
                {t('auth.alreadyHaveAccount')}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE: LOGIN */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white font-display">
                {t('auth.welcomeBack')}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'te'
                  ? 'మీ వ్యవసాయ నియంత్రణ కేంద్రాన్ని యాక్సెస్ చేయడానికి వివరాలు నమోదు చేయండి.'
                  : language === 'hi'
                  ? 'अपने कृषि नियंत्रण केंद्र में प्रवेश के लिए विवरण दर्ज करें।'
                  : 'Enter your credentials to access your agriculture control center.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@kisan.in"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">
                  {t('auth.password')}
                </label>
                <button
                  type="button"
                  onClick={() => alert('For this demo version, please use "Continue as Demo Farmer" or create a new profile with your preferred password.')}
                  className="text-[11px] text-emerald-400/90 hover:underline cursor-pointer"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50 mt-4"
            >
              <span>{t('auth.loginToAssistant')}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#0e1710] px-3 text-slate-400">or instant access</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoFarmer}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('auth.demoFarmer')}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs text-slate-400 hover:text-emerald-300 cursor-pointer"
              >
                {t('auth.dontHaveAccount')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
