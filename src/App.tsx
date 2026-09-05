import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ScreenType, TabType, Language, Medicine } from './types';
import { translations } from './data/translations';
import { initialMedicines } from './data/initialData';
import { SplashScreen } from './components/SplashScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { MedicinesScreen } from './components/MedicinesScreen';
import { AddPrescriptionFlow } from './components/AddPrescriptionFlow';
import { PhoneCallSimulation } from './components/PhoneCallSimulation';
import { CaregiverScreen } from './components/CaregiverScreen';
import { ChatScreen } from './components/ChatScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('splash');
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [currentTime, setCurrentTime] = useState('9:41');

  const t = translations[lang] || translations.en;
  const isRTL = lang === 'ur';

  // Splash auto-transition
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('language');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setScreen(tab as ScreenType);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <SplashScreen t={t} onStart={() => setScreen('language')} />;
      case 'language':
        return (
          <LanguageScreen 
            currentLang={lang} 
            setLang={setLang} 
            next={() => setScreen('login')} 
            onBack={() => setScreen('splash')}
            t={t} 
          />
        );
      case 'login':
        return (
          <LoginScreen 
            next={() => { setScreen('home'); setActiveTab('home'); }} 
            t={t} 
          />
        );
      case 'home':
        return (
          <HomeScreen 
            medicines={medicines} 
            setMedicines={setMedicines} 
            navigate={(sc) => {
              setScreen(sc);
              if (sc === 'medicines' || sc === 'caregiver' || sc === 'chat' || sc === 'profile' || sc === 'reports') {
                setActiveTab(sc as TabType);
              }
            }} 
            t={t} 
          />
        );
      case 'medicines':
        return (
          <MedicinesScreen 
            medicines={medicines} 
            setMedicines={setMedicines} 
            navigate={setScreen} 
            t={t} 
          />
        );
      case 'add_prescription':
        return (
          <AddPrescriptionFlow 
            close={() => setScreen('home')} 
            setMedicines={setMedicines} 
            t={t} 
          />
        );
      case 'phone_call':
        return (
          <PhoneCallSimulation 
            close={() => setScreen('home')} 
            medicines={medicines} 
            setMedicines={setMedicines} 
            t={t} 
            lang={lang}
          />
        );
      case 'caregiver':
        return <CaregiverScreen t={t} />;
      case 'chat':
        return <ChatScreen medicines={medicines} t={t} lang={lang} />;
      case 'reports':
        return <ReportsScreen medicines={medicines} t={t} />;
      case 'profile':
        return (
          <ProfileScreen 
            currentLang={lang} 
            setLang={setLang} 
            t={t} 
            logout={() => setScreen('login')} 
            onNavigateToCaregiver={() => setScreen('caregiver')}
          />
        );
      default:
        return (
          <HomeScreen 
            medicines={medicines} 
            setMedicines={setMedicines} 
            navigate={setScreen} 
            t={t} 
          />
        );
    }
  };

  const isFullscreenModal = screen === 'phone_call' || screen === 'add_prescription';
  const showBottomNav = !['splash', 'language', 'login', 'phone_call', 'add_prescription'].includes(screen);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 p-2 sm:p-4 text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Controls Bar for Quick Multilingual and Simulation Access */}
      <header className="w-full max-w-[420px] mb-2 px-3 py-1.5 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <img 
            src="/app-logo.png" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://www.image2url.com/r2/default/images/1788602801147-04408589-eef8-4f09-b739-692ee2b681ae.png';
            }}
            alt="Logo" 
            className="w-5 h-5 rounded-md object-contain bg-white p-0.5"
            referrerPolicy="no-referrer"
          />
          <span className="font-bold text-neutral-200 tracking-wide">SmartMed</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
            Care AI
          </span>
        </div>

        {/* Quick Language switcher pill */}
        <div className="flex items-center gap-0.5 bg-neutral-900/90 border border-neutral-800 p-1 rounded-full overflow-x-auto max-w-[210px] scrollbar-none">
          {(['en', 'ta', 'te', 'ml', 'kn', 'hi', 'ur'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all shrink-0 ${
                lang === l 
                  ? 'bg-[#0071E3] text-white shadow-xs' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile Device Enclosure simulating Apple iPhone proportions with Dynamic Island */}
      <div 
        className={`w-full max-w-[400px] h-[844px] bg-[#F5F5F7] rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden relative border-[8px] border-[#2C2C2E] flex flex-col ${
          isRTL ? 'rtl font-urdu' : 'ltr'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="h-11 px-7 pt-3 flex items-center justify-between select-none z-30 shrink-0 bg-transparent">
          <span className="text-xs font-semibold tracking-tight text-[#1D1D1F]">
            {currentTime}
          </span>

          {/* Dynamic Island pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-[#1D1D1F]">
            <Wifi className="w-3.5 h-3.5" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Screen Content Container */}
        <div className={`flex-1 overflow-y-auto ${showBottomNav ? 'pb-22' : screen === 'splash' ? 'pb-0' : 'pb-4'} scrollbar-none relative flex flex-col h-full`}>
          <AnimatePresence mode="wait">
            <div key={screen} className="flex-1 flex flex-col h-full w-full">
              {renderScreen()}
            </div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Thumb-Zone */}
        {showBottomNav && !isFullscreenModal && (
          <BottomNav 
            activeTab={activeTab} 
            setActiveTab={handleTabSwitch} 
            onCallAI={() => setScreen('phone_call')} 
            t={t} 
          />
        )}
      </div>

      {/* Under-shell helper hints */}
      <footer className="w-full max-w-[420px] mt-2 px-3 flex items-center justify-between text-[11px] text-neutral-500">
        <button 
          onClick={() => setScreen('splash')}
          className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors font-medium"
          title="Preview Splash Screen"
        >
          <Sparkles className="w-3 h-3 text-blue-400" /> Replay Splash
        </button>
        <button 
          onClick={() => setScreen('phone_call')}
          className="text-blue-400 hover:text-blue-300 font-semibold"
        >
          Test AI Call →
        </button>
      </footer>
    </div>
  );
}
