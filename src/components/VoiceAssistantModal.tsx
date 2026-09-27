import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { getISTInfo, useISTLiveTime } from '../utils/istTime';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLanguage?: 'te' | 'hi' | 'en';
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  defaultLanguage = 'te',
}) => {
  const ist = useISTLiveTime(5000);
  const [lang, setLang] = useState<'te' | 'hi' | 'en'>(defaultLanguage);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState('');

  const getInitialGreeting = (selectedLang: 'te' | 'hi' | 'en') => {
    const currentIst = getISTInfo();
    if (selectedLang === 'te') {
      return `${currentIst.greetingTelugu}! నేను మీ AI అగ్రికల్చర్ అసిస్టెంట్‌ని. మీ పంటలు, చీడపీడలు, ఎరువులు లేదా వాతావరణం గురించి ఏదైనా మాట్లాడండి.`;
    } else if (selectedLang === 'hi') {
      return `${currentIst.greetingHindi}! मैं आपका AI एग्रीकल्चर असिस्टेंट हूँ। अपनी फसल, खाद या मौसम के बारे में कुछ भी पूछें।`;
    } else {
      return `${currentIst.greeting}! I am your AI Agriculture Assistant. Ask me anything about your crops, spraying, irrigation, or weather.`;
    }
  };

  const [conversation, setConversation] = useState<{ role: 'farmer' | 'ai'; text: string; lang: string }[]>([
    {
      role: 'ai',
      text: getInitialGreeting(defaultLanguage),
      lang: defaultLanguage,
    },
  ]);

  const recognitionRef = useRef<any>(null);

  // Pre-configured expert agronomic Q&As for natural speech answers
  const knowledgeBase: Record<string, Record<string, string>> = {
    te: {
      default:
        'మీరు అడిగిన ప్రశ్నకు మా AI రైతు సలహా: పంట వేర్లకు సమతుల్య తేమను అందించి, సాయంత్రం వేళల్లో వేపనూనె లేదా తగిన జీవ శిలీంద్రనాశిని వాడటం శ్రేయస్కరం.',
      yellowLeaves:
        'టమాటా ఆకులు పసుపుగా మారడానికి సాధారణంగా నత్రజని లోపం లేదా ఎర్లీ బ్లైట్ తెగులు కారణం కావచ్చు. కిందటి ఆకులపై మచ్చలు ఉంటే వెంటనే మాంకోజెబ్ (2.5 గ్రా/లీ) లేదా వేపనూనె (1500 ppm) పిచికారీ చేయండి.',
      weatherSpraying:
        `ప్రస్తుత సమయం ${ist.timeString12} IST. ఈరోజు మీ ప్రాంతంలో గాలి వేగం 11 కి.మీ/గం ఉంది. ఉదయం 7:00 నుండి 10:00 గంటల మధ్య లేదా సాయంత్రం 4:30 తర్వాత మందులు పిచికారీ చేయడానికి చాలా అనుకూలమైన సమయం.`,
      irrigation:
        `ఈరోజు భాష్పోత్సేకం (ET₀) 4.8 మి.మీ గా ఉంది. ఉదయం వేళల్లో డ్రిప్ ద్వారా ఎకరానికి 18,000 లీటర్ల నీరు అందించడం ఉత్తమం.`,
    },
    hi: {
      default:
        'नमस्ते किसान भाई! फसल की अच्छी बढ़वार के लिए खेत में उचित नमी बनाए रखें और जैविक कीटनाशक का प्रयोग करें।',
      yellowLeaves:
        'टमाटर की पत्तियों का पीला पड़ना नाइट्रोजन की कमी या अगेती झुलसा का संकेत हो सकता है। इंडोफिल एम-45 (2.5 ग्राम प्रति लीटर) का छिड़काव करें।',
      weatherSpraying:
        `अभी का समय ${ist.timeString12} IST है। सुबह 7:00 से 10:00 बजे के बीच या शाम को छिड़काव करना सबसे उपयुक्त रहेगा।`,
      irrigation:
        'आज तेज धूप रहने की संभावना है। सुबह के समय ड्रिप सिंचाई से पौधों को पानी दें।',
    },
    en: {
      default:
        'Hello farmer! For optimal crop health, maintain steady root loam moisture and inspect your plants early morning for pest activity.',
      yellowLeaves:
        'Yellowing lower leaves in tomato typically indicates Early Blight or Nitrogen deficiency. Apply Mancozeb 75% WP @ 2.5g/L or 1500 PPM Neem Oil.',
      weatherSpraying:
        `Current time is ${ist.timeString12} IST with wind speed of 11 km/h. Your optimal foliar spraying window is morning 07:00 AM - 10:30 AM or late afternoon after 04:30 PM.`,
      irrigation:
        'Evapotranspiration today is 4.8 mm/day. A 20-minute drip pulse during early morning hours is recommended.',
    },
  };

  const sampleVoicePrompts: Record<'te' | 'hi' | 'en', { label: string; query: string }[]> = {
    te: [
      {
        label: 'టమాటా ఆకులు పసుపుగా మారుతున్నాయి',
        query: 'నా టమాటా మొక్కలకు ఆకులు పసుపుగా మారుతున్నాయి, ఏం చేయాలి?',
      },
      {
        label: 'ఈరోజు మందులు పిచికారీ చేయవచ్చా?',
        query: 'ఈరోజు వాతావరణం మందులు పిచికారీ చేయడానికి అనుకూలమా?',
      },
      {
        label: 'ఎప్పుడు నీరు పెట్టాలి?',
        query: 'నా పంటకు ఈరోజు ఎప్పుడు ఎంత నీరు పెట్టాలి?',
      },
    ],
    hi: [
      {
        label: 'टमाटर की पत्तियां पीली हो रही हैं',
        query: 'टमाटर के पत्तों पर पीले धब्बे आ रहे हैं, क्या उपाय करें?',
      },
      {
        label: 'आज स्प्रे करने का सही समय',
        query: 'क्या आज मौसम कीटनाशक छिड़काव के लिए सही है?',
      },
      {
        label: 'सिंचाई कब करनी चाहिए?',
        query: 'मेरी फसल में आज सिंचाई का सही समय क्या है?',
      },
    ],
    en: [
      {
        label: 'Tomato leaves turning yellow',
        query: 'My tomato leaves are turning yellow, what should I do?',
      },
      {
        label: 'Can I spray pesticide today?',
        query: 'Is the weather suitable for foliar spraying today?',
      },
      {
        label: 'When should I irrigate?',
        query: 'What is the recommended irrigation schedule for my crops?',
      },
    ],
  };

  // Browser Speech Synthesis (TTS)
  const speakText = (text: string, languageCode: 'te' | 'hi' | 'en') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (languageCode === 'te') utterance.lang = 'te-IN';
    else if (languageCode === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserSpeech(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [lang]);

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      if (lang === 'te') recognitionRef.current.lang = 'te-IN';
      else if (lang === 'hi') recognitionRef.current.lang = 'hi-IN';
      else recognitionRef.current.lang = 'en-US';

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    } else {
      // If browser doesn't support Web Speech API, use first sample prompt
      handleUserSpeech(sampleVoicePrompts[lang][0].query);
    }
  };

  const handleUserSpeech = (query: string) => {
    if (!query.trim()) return;

    const newConvo = [...conversation, { role: 'farmer' as const, text: query, lang }];
    setConversation(newConvo);
    setInputText('');

    // Formulate response
    const qLower = query.toLowerCase();
    let reply = knowledgeBase[lang].default;

    if (qLower.includes('పసుపు') || qLower.includes('yellow') || qLower.includes('पीली')) {
      reply = knowledgeBase[lang].yellowLeaves;
    } else if (qLower.includes('పిచికారీ') || qLower.includes('spray') || qLower.includes('छिड़काव')) {
      reply = knowledgeBase[lang].weatherSpraying;
    } else if (qLower.includes('నీరు') || qLower.includes('irrigate') || qLower.includes('सिंचाई')) {
      reply = knowledgeBase[lang].irrigation;
    }

    setTimeout(() => {
      setConversation((prev) => [...prev, { role: 'ai' as const, text: reply, lang }]);
      speakText(reply, lang);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1710] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/15 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with IST Status */}
        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>రైతు వాయిస్ అసిస్టెంట్ · AI Voice Companion</span>
            <span>·</span>
            <span className="font-mono text-white">{ist.timeString12} IST</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
            Talk to Your Farm AI 🎙
          </h2>
          <p className="text-xs text-slate-400">
            {ist.greeting}! Ask questions using your voice in your mother tongue. Instant spoken answers.
          </p>
        </div>

        {/* Language Selector with IST Greetings */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10 mb-4 max-w-xs mx-auto">
          <button
            onClick={() => {
              setLang('te');
              const welcome = `${ist.greetingTelugu}! అడగండి.`;
              speakText(welcome, 'te');
              setConversation((prev) => [
                ...prev,
                { role: 'ai', text: `${ist.greetingTelugu}! నేను మీ AI అసిస్టెంట్‌ని. అడగండి.`, lang: 'te' },
              ]);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              lang === 'te' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            తెలుగు
          </button>
          <button
            onClick={() => {
              setLang('hi');
              const welcome = `${ist.greetingHindi}! पूछिए।`;
              speakText(welcome, 'hi');
              setConversation((prev) => [
                ...prev,
                { role: 'ai', text: `${ist.greetingHindi}! मैं आपका AI असिस्टेंट हूँ। पूछिए।`, lang: 'hi' },
              ]);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              lang === 'hi' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => {
              setLang('en');
              const welcome = `${ist.greeting}! How can I assist with your crops right now?`;
              speakText(welcome, 'en');
              setConversation((prev) => [
                ...prev,
                { role: 'ai', text: welcome, lang: 'en' },
              ]);
            }}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              lang === 'en' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 my-2 max-h-56">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs ${
                msg.role === 'farmer' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                  msg.role === 'farmer'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Tap Voice Prompts */}
        <div className="pt-2">
          <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1.5">
            Or tap to speak:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoicePrompts[lang].map((sample, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleUserSpeech(sample.query)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 transition-colors text-left cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Mic Action */}
        <div className="pt-4 flex flex-col items-center justify-center gap-2">
          <button
            onClick={toggleMic}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30'
                : isSpeaking
                ? 'bg-cyan-400 text-slate-950 ring-6 ring-cyan-400/30'
                : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 hover:scale-105'
            }`}
          >
            {isListening ? (
              <Mic className="w-7 h-7" />
            ) : isSpeaking ? (
              <Volume2 className="w-7 h-7 animate-bounce" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
          <span className="text-xs font-semibold text-emerald-300">
            {isListening
              ? 'వింటున్నాను... మాట్లాడండి (Listening...)'
              : isSpeaking
              ? 'మాట్లాడుతున్నాను... (Speaking...)'
              : 'Tap Mic to Speak (నొక్కండి)'}
          </span>
        </div>
      </div>
    </div>
  );
};
