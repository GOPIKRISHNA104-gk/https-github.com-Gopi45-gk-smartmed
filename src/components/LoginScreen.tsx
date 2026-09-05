import { useState } from 'react';
import { motion } from 'motion/react';
import { TranslationStrings } from '../types';
import { Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  next: () => void;
  t: TranslationStrings;
}

export function LoginScreen({ next, t }: Props) {
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['4', '8', '2', '9']);

  const handleContinue = () => {
    if (!otpSent) {
      setOtpSent(true);
    } else {
      next();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full p-6 justify-between bg-white"
    >
      <div className="mt-8">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm mb-6 border border-blue-100 bg-white p-1.5 flex items-center justify-center">
          <img 
            src="/app-logo.png" 
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://www.image2url.com/r2/default/images/1788602801147-04408589-eef8-4f09-b739-692ee2b681ae.png';
            }}
            alt="SmartMed Logo" 
            className="w-full h-full object-contain rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>

        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{t.enterMobile}</h2>
        <p className="text-[#86868B] text-sm mt-1.5 leading-relaxed">{t.enterMobileSub}</p>

        {!otpSent ? (
          <div className="mt-8">
            <label className="text-xs font-semibold text-[#86868B] uppercase tracking-wider block mb-2">
              {t.mobileLabel}
            </label>
            <div className="relative">
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="+91 98765 43210" 
                className="w-full p-4 bg-[#F5F5F7] rounded-2xl border border-gray-200 text-lg font-medium text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all shadow-inner" 
              />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#86868B]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Used exclusively for your scheduled AI care reminder calls</span>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#86868B] uppercase tracking-wider">
                Verification Code
              </label>
              <button 
                onClick={() => setOtpSent(false)} 
                className="text-xs text-[#0071E3] font-medium"
              >
                Change Number
              </button>
            </div>
            <p className="text-xs text-[#86868B] mb-3">Sent 4-digit code to {phone}</p>
            <div className="flex gap-3 justify-between">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-14 h-14 bg-[#F5F5F7] rounded-2xl border border-gray-200 text-center text-xl font-bold text-[#1D1D1F] focus:border-[#0071E3] focus:bg-white focus:outline-none"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="pb-4">
        <button 
          onClick={handleContinue} 
          className="w-full py-4 bg-[#0071E3] hover:bg-[#0062c4] text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>{otpSent ? 'Verify & Continue' : t.getOtpBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
