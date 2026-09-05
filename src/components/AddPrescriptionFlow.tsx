import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Medicine, TranslationStrings } from '../types';
import { X, UploadCloud, Camera, Sparkles, Check, FileCheck, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  close: () => void;
  setMedicines: Dispatch<SetStateAction<Medicine[]>>;
  t: TranslationStrings;
}

export function AddPrescriptionFlow({ close, setMedicines, t }: Props) {
  const [step, setStep] = useState<'select' | 'scanning' | 'review'>('select');
  const [extractedData, setExtractedData] = useState({
    name: 'Atorvastatin 10mg',
    time: '09:00 PM',
    dose: '1 Tablet',
    food: 'After Dinner',
    type: 'tablet' as Medicine['type']
  });

  const handleUploadOrCamera = () => {
    setStep('scanning');
    setTimeout(() => {
      soundManager.playSuccessChime();
      setStep('review');
    }, 2400);
  };

  const handleConfirmSave = () => {
    const newMed: Medicine = {
      id: Date.now(),
      name: extractedData.name,
      time: extractedData.time,
      dose: extractedData.dose,
      food: extractedData.food,
      status: 'upcoming',
      type: extractedData.type,
      color: '#34C759'
    };

    setMedicines(prev => [...prev, newMed]);
    soundManager.playSuccessChime();
    close();
  };

  return (
    <motion.div 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }} 
      transition={{ type: "spring", damping: 25, stiffness: 220 }}
      className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-6"
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0071E3] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">{t.addPrescription}</h2>
        </div>
        <button 
          onClick={close} 
          className="w-9 h-9 bg-[#F5F5F7] hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="my-auto space-y-4"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-[#1D1D1F]">Scan or Upload Prescription</h3>
              <p className="text-xs text-[#86868B] mt-1 max-w-xs mx-auto">
                Our medical AI will automatically extract medicine names, dosages, timings, and dietary instructions.
              </p>
            </div>

            <button 
              onClick={handleUploadOrCamera} 
              className="w-full p-6 border-2 border-dashed border-blue-200 rounded-3xl flex flex-col items-center justify-center text-[#0071E3] bg-gradient-to-b from-blue-50/40 to-blue-50/10 active:scale-98 transition-all hover:border-[#0071E3] group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-3 text-[#0071E3] group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <span className="font-bold text-base text-[#1D1D1F]">{t.uploadTitle}</span>
              <span className="text-xs text-[#86868B] mt-0.5">Supports PDF, JPG, PNG Rx photos</span>
            </button>

            <button 
              onClick={handleUploadOrCamera} 
              className="w-full p-6 border-2 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center text-[#34C759] bg-gradient-to-b from-emerald-50/40 to-emerald-50/10 active:scale-98 transition-all hover:border-[#34C759] group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-3 text-[#34C759] group-hover:scale-105 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <span className="font-bold text-base text-[#1D1D1F]">{t.cameraTitle}</span>
              <span className="text-xs text-[#86868B] mt-0.5">Instant camera snap with edge detection</span>
            </button>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="my-auto flex flex-col items-center text-center px-4"
          >
            <div className="relative w-44 h-56 bg-slate-100 rounded-2xl border-2 border-blue-400 overflow-hidden shadow-xl flex flex-col p-4 mb-6">
              {/* Simulated prescription lines */}
              <div className="h-3 w-16 bg-blue-300 rounded mb-4" />
              <div className="h-2 w-32 bg-gray-300 rounded mb-2" />
              <div className="h-2 w-28 bg-gray-300 rounded mb-2" />
              <div className="h-2 w-36 bg-gray-200 rounded mb-4" />
              <div className="h-3 w-20 bg-blue-400 rounded mb-2" />
              <div className="h-2 w-30 bg-gray-300 rounded mb-2" />

              {/* Animated scanning laser */}
              <motion.div 
                animate={{ y: [0, 180, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_12px_#0071E3]"
              />
            </div>

            <h3 className="text-lg font-bold text-[#1D1D1F]">Reading Prescription with AI...</h3>
            <p className="text-xs text-[#86868B] mt-1">Extracting doctor handwriting, dosage, and frequency.</p>

            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#0071E3] bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Vision OCR Processing in progress</span>
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="my-auto space-y-4"
          >
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs font-semibold">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>1 New Medicine Detected with 99.4% Accuracy</span>
            </div>

            <h3 className="font-bold text-[#1D1D1F] text-base">Review & Edit Details</h3>

            <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-gray-200 space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Medicine Name</label>
                <input 
                  type="text" 
                  value={extractedData.name} 
                  onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-white rounded-xl border border-gray-200 text-sm font-bold text-[#1D1D1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Scheduled Time</label>
                  <input 
                    type="text" 
                    value={extractedData.time} 
                    onChange={(e) => setExtractedData({ ...extractedData, time: e.target.value })}
                    className="w-full mt-1 p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold text-[#0071E3]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Dosage</label>
                  <input 
                    type="text" 
                    value={extractedData.dose} 
                    onChange={(e) => setExtractedData({ ...extractedData, dose: e.target.value })}
                    className="w-full mt-1 p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868B]">Food Instruction</label>
                <input 
                  type="text" 
                  value={extractedData.food} 
                  onChange={(e) => setExtractedData({ ...extractedData, food: e.target.value })}
                  className="w-full mt-1 p-2 bg-white rounded-xl border border-gray-200 text-xs font-semibold"
                />
              </div>
            </div>

            <button 
              onClick={handleConfirmSave} 
              className="w-full py-4 bg-[#34C759] hover:bg-[#2eb34f] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t.confirmSave}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center text-[11px] text-[#86868B]">
        SmartMed Care Vision OCR • Verified by Certified Clinical Engine
      </div>
    </motion.div>
  );
}
