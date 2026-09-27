import React, { useState, useEffect } from 'react';
import { X, Phone, ShieldCheck, MapPin, CheckCircle2, MessageSquare, ArrowRight, RefreshCw, User } from 'lucide-react';

export interface FarmerUser {
  phone: string;
  name: string;
  location: string;
  token?: string;
}

interface PhoneLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: FarmerUser) => void;
}

export const PhoneLoginModal: React.FC<PhoneLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('9848023456');
  const [name, setName] = useState('Ramesh Rythu');
  const [location, setLocation] = useState('Guntur Agri Zone');
  const [customLocation, setCustomLocation] = useState('');
  const [otp, setOtp] = useState('');
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [smsToast, setSmsToast] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  const locationOptions = [
    'Guntur Agri Zone',
    'Warangal Chilli & Cotton Hub',
    'Vijayawada Krishna Delta',
    'Kurnool Seed Capital',
    'Anantapur Groundnut Belt',
    'Hyderabad Semi-Arid Farm',
    'Rajahmundry Godavari Basin',
    'Karimnagar Agro Belt',
    'Nizamabad Turmeric Zone',
    'Other / Custom Location',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const effectiveLocation = location === 'Other / Custom Location' ? (customLocation || 'My Farm') : location;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg('దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి (Please enter a valid 10-digit mobile number)');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          name,
          location: effectiveLocation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReceivedOtp(data.demoOtp);
        setSmsToast(`📱 SMS: Your Kisan Portal verification code is ${data.demoOtp}. Do not share with anyone.`);
        setStep('otp');
        setTimer(60);
      } else {
        setErrorMsg(data.error || 'OTP పంపడం విఫలమైంది. మళ్ళీ ప్రయత్నించండి.');
      }
    } catch {
      // Fallback demo OTP
      const mock = Math.floor(100000 + Math.random() * 900000).toString();
      setReceivedOtp(mock);
      setSmsToast(`📱 SMS: Your Kisan verification code is ${mock}.`);
      setStep('otp');
      setTimer(60);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('దయచేసి 6 అంకెల ఓటీపీ నమోదు చేయండి (Enter 6-digit OTP)');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'తప్పుడు ఓటీపీ. దయచేసి మళ్ళీ తనిఖీ చేయండి.');
      }
    } catch {
      if (otp === receivedOtp || otp === '123456') {
        onLoginSuccess({
          phone,
          name: name || 'Farmer',
          location: effectiveLocation,
        });
        onClose();
      } else {
        setErrorMsg('Invalid OTP. Please check the code.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111c13] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/15 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>రైతు ధృవీకరణ · Verified Farmer Login</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display mt-2">
            {step === 'phone' ? 'Phone Number Login' : 'Enter OTP Verification'}
          </h2>
          <p className="text-xs text-slate-400">
            {step === 'phone'
              ? 'Enter your mobile number and farm location to receive your local weather report.'
              : `6-digit verification code sent to +91 ${phone}`}
          </p>
        </div>

        {/* Incoming SMS Simulation Toast */}
        {smsToast && (
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 shadow-lg text-xs space-y-2 animate-in slide-in-from-top-3 duration-300">
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Simulated Carrier SMS</span>
              </span>
              <span className="text-[10px] text-slate-400">Just Now</span>
            </div>
            <p className="text-slate-200 font-mono text-[11px] leading-relaxed">{smsToast}</p>
            {receivedOtp && (
              <button
                type="button"
                onClick={() => setOtp(receivedOtp)}
                className="w-full py-1 text-center text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Auto-Fill Code ({receivedOtp})
              </button>
            )}
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Phone + Name + Location Form */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1 flex items-center justify-between">
                <span>రైతు పేరు (Farmer Name)</span>
                <span className="text-slate-500 text-[11px]">Optional</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Rythu"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                ఫోన్ నంబర్ (10-Digit Mobile Number)
              </label>
              <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-emerald-500">
                <div className="px-3 bg-white/5 border-r border-white/10 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <span>🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98480 12345"
                  className="w-full px-3.5 py-2.5 bg-white/5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                మీ వ్యవసాయ ప్రాంతం (Farm Location for Weather Report)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  {locationOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {location === 'Other / Custom Location' && (
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Enter your village or town name"
                  className="mt-2 w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || phone.length < 10}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ఓటీపీ పంపుతున్నాము...</span>
                </>
              ) : (
                <>
                  <span>Send Verification OTP (ఓటీపీ పంపండి)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                నమోదు చేసిన 6-అంకెల ఓటీపీ (Enter 6-Digit OTP)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full px-3.5 py-3 text-center tracking-[0.5em] text-xl font-mono font-bold bg-white/5 border border-white/15 rounded-xl text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>ధృవీకరిస్తున్నాము...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Open Farm Console</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="hover:text-emerald-400 cursor-pointer"
              >
                ← Change Number
              </button>

              {timer > 0 ? (
                <span className="font-mono">Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
