import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Medicine, TranslationStrings } from '../types';
import { Award, FileDown, CheckCircle2, TrendingUp, Calendar, Check, Stethoscope } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  medicines: Medicine[];
  t: TranslationStrings;
}

export function ReportsScreen({ medicines, t }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const daysOfWeek = [
    { day: 'Mon', status: 'full' },
    { day: 'Tue', status: 'full' },
    { day: 'Wed', status: 'full' },
    { day: 'Thu', status: 'full' },
    { day: 'Fri', status: 'full' },
    { day: 'Sat', status: 'partial' },
    { day: 'Sun', status: 'full' }
  ];

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      soundManager.playSuccessChime();
      setTimeout(() => setDownloadComplete(false), 4000);
    }, 1800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="p-5 pb-8"
    >
      <div className="pt-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{t.adherence}</h2>
        </div>
        <p className="text-xs text-[#86868B] mt-1">{t.monthlyCompliance}</p>
      </div>

      {/* Adherence Hero Donut Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#34C759]"
              strokeDasharray="94, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-[#1D1D1F]">94%</span>
            <span className="text-[10px] uppercase font-bold text-[#34C759] tracking-wider">Score</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#34C759] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Award className="w-3.5 h-3.5" />
          <span>{t.excellentAdherence}</span>
        </div>

        <p className="text-xs text-[#86868B] mt-2 max-w-xs">
          Only 2 doses delayed beyond 30 minutes in the past 30 days. Blood pressure targets maintained.
        </p>
      </div>

      {/* Weekly Streak Matrix */}
      <div className="mt-4 bg-white p-4.5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">This Week's Log</h3>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">7 / 7 Days On-Track</span>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {daysOfWeek.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-gray-400">{d.day}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                d.status === 'full' 
                  ? 'bg-emerald-500 text-white shadow-xs' 
                  : 'bg-amber-400 text-white'
              }`}>
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Notes Card */}
      <div className="mt-4 p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-start gap-3">
        <Stethoscope className="w-5 h-5 text-[#0071E3] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-blue-900">Doctor's Observation</h4>
          <p className="text-[11px] text-blue-800/90 mt-0.5 leading-relaxed">
            Patient Ravi Kumar has shown exceptional adherence since the interactive phone calls were activated. Systolic BP trending healthy at 122/80.
          </p>
        </div>
      </div>

      {/* Export Action */}
      <div className="mt-5">
        <button 
          onClick={handleExport}
          disabled={downloading}
          className="w-full py-4 bg-[#0071E3] hover:bg-[#0062c4] text-white font-bold rounded-2xl text-sm shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          {downloading ? (
            <span className="animate-pulse">Generating Certified PDF...</span>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              <span>{t.exportPdf}</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {downloadComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="mt-3 p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-center"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Report saved: SmartMed_RaviKumar_Adherence_Report.pdf</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
