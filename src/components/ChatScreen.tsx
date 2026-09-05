import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Medicine, ChatMessage, TranslationStrings, Language } from '../types';
import { initialChatMessages } from '../data/initialData';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  medicines: Medicine[];
  t: TranslationStrings;
  lang: Language;
}

export function ChatScreen({ medicines, t, lang }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialChatMessages[lang] || initialChatMessages.en);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "What medicines are due after lunch?",
    "Can I take BP tablet with coffee?",
    "Did I miss any medicine today?",
    "Tell my son I took my BP medicine"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('coffee') || q.includes('tea')) {
      return "It is recommended to wait at least 30 to 45 minutes before or after drinking coffee or tea when taking your BP medication, as caffeine can temporarily elevate blood pressure and reduce absorption.";
    }

    if (q.includes('lunch') || q.includes('food') || q.includes('after')) {
      const afterFoodMeds = medicines.filter(m => m.food.toLowerCase().includes('after'));
      if (afterFoodMeds.length > 0) {
        return `You have ${afterFoodMeds.map(m => `${m.name} (${m.time})`).join(' and ')} scheduled to be taken after food!`;
      }
      return "All your scheduled medicines can be checked on your home dashboard.";
    }

    if (q.includes('miss') || q.includes('did i take') || q.includes('status')) {
      const taken = medicines.filter(m => m.status === 'taken');
      const upcoming = medicines.filter(m => m.status === 'upcoming');
      return `You have taken ${taken.length} medicines so far (${taken.map(m => m.name).join(', ') || 'none'}). You still have ${upcoming.length} upcoming (${upcoming.map(m => m.name).join(', ') || 'none'}).`;
    }

    if (q.includes('son') || q.includes('caregiver')) {
      return "I have synced your medicine log with your primary caregiver Arun Kumar (+91 98765 12345). He can see your status in real time!";
    }

    return "I've checked your doctor's clinical prescription. Please ensure you always take your BP tablet after food with a full glass of water, and keep your daily routine consistent.";
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      soundManager.playSuccessChime();
    }, 900);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full bg-[#F5F5F7]"
    >
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1D1D1F] leading-tight">{t.chat}</h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Medical AI Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end gap-2 max-w-[85%]">
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-[#0071E3] flex items-center justify-center shrink-0 mb-1 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div 
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-[#0071E3] text-white rounded-br-none shadow-sm' 
                      : 'bg-white text-[#1D1D1F] border border-gray-200/80 shadow-xs rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.time && (
                    <span className={`text-[10px] block mt-1 text-right ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                      {m.time}
                    </span>
                  )}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mb-1 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-500 italic ml-2">
            <Bot className="w-4 h-4 text-[#0071E3] animate-pulse" />
            <span>SmartMed AI is verifying your prescription...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-white/50 border-t border-gray-200/40 overflow-x-auto flex gap-2 scrollbar-none">
        {quickPrompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-700 font-medium hover:border-[#0071E3] hover:text-[#0071E3] active:scale-95 transition-all shadow-xs flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#0071E3]" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder={t.askAnything} 
          className="flex-1 p-3 bg-[#F5F5F7] rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]" 
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="p-3 bg-[#0071E3] disabled:opacity-40 text-white rounded-xl shadow-md active:scale-90 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
