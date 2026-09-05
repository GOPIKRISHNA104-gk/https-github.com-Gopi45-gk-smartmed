import { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Medicine, TranslationStrings, Language } from '../types';
import { Phone, PhoneOff, Mic, CheckCircle, Volume2, ShieldCheck, Clock } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  close: () => void;
  medicines: Medicine[];
  setMedicines: Dispatch<SetStateAction<Medicine[]>>;
  t: TranslationStrings;
  lang: Language;
}

export function PhoneCallSimulation({ close, medicines, setMedicines, t, lang }: Props) {
  const [callState, setCallState] = useState<'incoming' | 'connected' | 'responded'>('incoming');
  const [patientReply, setPatientReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAnswerCall = () => {
    if (ringTimerRef.current) {
      clearTimeout(ringTimerRef.current);
      ringTimerRef.current = null;
    }
    soundManager.stopRinging();
    setCallState('connected');
    setIsSpeaking(true);

    // AI voice speaks prompt
    soundManager.speak(t.aiSpeakingPrompt.replace(/"/g, ''), lang);
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3800);
  };

  // Incoming call ring sequence
  useEffect(() => {
    soundManager.startRinging();
    ringTimerRef.current = setTimeout(() => {
      handleAnswerCall();
    }, 2800);

    return () => {
      if (ringTimerRef.current) {
        clearTimeout(ringTimerRef.current);
      }
      soundManager.stopRinging();
      soundManager.stopSpeaking();
    };
  }, []);

  const handleResponse = (taken: boolean) => {
    soundManager.stopSpeaking();
    const replyText = taken ? t.replyTaken : t.replySnooze;
    setPatientReply(replyText);
    setCallState('responded');

    if (taken) {
      soundManager.playSuccessChime();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Update the first upcoming medicine or BP Tablet
      setMedicines(prev => prev.map(m => {
        if (m.status === 'upcoming') {
          return { ...m, status: 'taken', takenAt: nowStr };
        }
        return m;
      }));
    }

    setTimeout(() => {
      close();
    }, 3200);
  };

  const handleEndCall = () => {
    soundManager.stopRinging();
    soundManager.stopSpeaking();
    close();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      className="fixed inset-0 bg-[#121214] text-white flex flex-col justify-between p-6 z-50 overflow-hidden font-sans"
    >
      {/* Top Bar Header */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.aiVoiceAssistant}</span>
        </div>

        <h2 className="text-3xl font-extrabold mt-3 tracking-tight">
          {callState === 'incoming' ? t.incomingCall : 'SmartMed AI Care'}
        </h2>

        <p className="text-sm mt-1 flex items-center justify-center gap-1.5 font-medium">
          {callState === 'incoming' && (
            <span className="text-amber-400 animate-pulse">{t.connectingCall}</span>
          )}
          {callState === 'connected' && (
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {t.connectedTwoWay}
            </span>
          )}
          {callState === 'responded' && (
            <span className="text-blue-400">{t.statusUpdated}</span>
          )}
        </p>
      </div>

      {/* Center Phone Visual / Pulsing Audio Waveform */}
      <div className="flex flex-col items-center justify-center my-auto space-y-6">
        <div className="relative">
          {/* Animated concentric pulse rings */}
          {callState === 'incoming' && (
            <>
              <motion.div 
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-[#0071E3]/40"
              />
              <motion.div 
                animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-[#0071E3]/20"
              />
            </>
          )}

          <div className="w-28 h-28 bg-gradient-to-tr from-[#0071E3] to-[#4299e1] rounded-full flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/40 relative z-10">
            {callState === 'connected' ? (
              <Mic className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Phone className="w-12 h-12 text-white animate-bounce" />
            )}
          </div>
        </div>

        {/* AI Speaking Speech Balloon */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-5 rounded-3xl w-full max-w-sm text-center shadow-lg">
          <div className="flex items-center justify-center gap-1.5 text-xs text-blue-300 font-bold mb-1.5">
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-emerald-400' : ''}`} />
            <span>AI Speaking (Natural Voice):</span>
          </div>
          <p className="text-sm font-medium text-gray-100 leading-relaxed">
            {t.aiSpeakingPrompt}
          </p>

          {/* Audio Waveform visualization */}
          <div className="flex items-center justify-center gap-1 mt-3.5 h-6">
            {[40, 75, 100, 60, 90, 45, 80, 50, 70].map((h, i) => (
              <motion.span
                key={i}
                animate={isSpeaking ? { height: [`${h * 0.2}%`, `${h}%`, `${h * 0.3}%`] } : { height: '20%' }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                className="w-1 bg-[#0071E3] rounded-full"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Patient Speech Response Card */}
        {callState === 'responded' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/20 text-emerald-300 p-4 rounded-2xl w-full max-w-sm text-center border border-emerald-500/40 shadow-lg"
          >
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{t.patientRepliedLabel}:</p>
            <p className="text-sm font-bold mt-1 text-white">{patientReply}</p>
            <div className="flex items-center justify-center gap-1.5 text-xs mt-2 text-emerald-300 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>{t.statusUpdated}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Call Interaction Controls (Thumb-Zone Optimized) */}
      <div className="pb-6 w-full max-w-sm mx-auto">
        {callState === 'incoming' && (
          <div className="flex items-center justify-around">
            <button 
              onClick={handleEndCall}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform">
                <PhoneOff className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-gray-300">Decline</span>
            </button>

            <button 
              onClick={handleAnswerCall}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 active:scale-90 transition-transform">
                <Phone className="w-7 h-7" />
              </div>
              <span className="text-xs font-medium text-gray-300">Answer</span>
            </button>
          </div>
        )}

        {callState === 'connected' && (
          <div className="space-y-3">
            <p className="text-center text-xs text-gray-400 font-medium">
              Simulate Patient Two-Way Speech:
            </p>

            <button 
              onClick={() => handleResponse(true)} 
              className="w-full py-4 bg-[#34C759] hover:bg-[#2eb34f] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{t.replyTaken}</span>
            </button>

            <button 
              onClick={() => handleResponse(false)} 
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Clock className="w-5 h-5" />
              <span>{t.replySnooze}</span>
            </button>

            <button 
              onClick={handleEndCall} 
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-gray-300 font-medium rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <PhoneOff className="w-4 h-4 text-red-400" />
              <span>{t.endCall}</span>
            </button>
          </div>
        )}

        {callState === 'responded' && (
          <button 
            onClick={handleEndCall} 
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>{t.endCall}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
