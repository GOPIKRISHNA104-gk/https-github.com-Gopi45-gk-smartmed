import { Medicine, Caregiver, ChatMessage } from '../types';

export const initialMedicines: Medicine[] = [
  { 
    id: 1, 
    name: 'Telmisartan 40mg', 
    time: '1:00 PM', 
    dose: '1 Tablet', 
    food: 'After Food', 
    status: 'upcoming', 
    type: 'tablet',
    color: '#0071E3'
  },
  { 
    id: 2, 
    name: 'Cough Syrup', 
    time: '8:00 PM', 
    dose: '10 ml', 
    food: 'After Food', 
    status: 'upcoming', 
    type: 'liquid',
    color: '#34C759'
  },
  { 
    id: 3, 
    name: 'Vitamin D3 60K', 
    time: '8:00 AM', 
    dose: '1 Capsule', 
    food: 'Before Food', 
    status: 'taken', 
    type: 'capsule',
    takenAt: '8:15 AM',
    color: '#FF9500'
  },
  { 
    id: 4, 
    name: 'Metformin 500mg', 
    time: '9:30 PM', 
    dose: '1 Tablet', 
    food: 'With Dinner', 
    status: 'upcoming', 
    type: 'tablet',
    color: '#AF52DE'
  }
];

export const initialCaregivers: Caregiver[] = [
  {
    id: 1,
    name: 'Arun Kumar',
    relation: 'Son',
    phone: '+91 98765 12345',
    isPrimary: true,
    alertEnabled: true
  },
  {
    id: 2,
    name: 'Dr. Priya Menon',
    relation: 'Cardiologist',
    phone: '+91 98401 98765',
    isPrimary: false,
    alertEnabled: true
  }
];

export const initialChatMessages: Record<string, ChatMessage[]> = {
  en: [
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Hello Ravi! You have your BP tablet scheduled for 1:00 PM today. Remember to take it after your lunch. How can I help you today?',
      time: '12:45 PM'
    }
  ],
  ta: [
    { 
      id: '1', 
      sender: 'ai', 
      text: 'வணக்கம் ரவி ஐயா! இன்று மதியம் 1:00 மணிக்கு உங்கள் பிபி மாத்திரை அட்டவணைப்படுத்தப்பட்டுள்ளது. மதிய உணவுக்குப் பின் உட்கொள்ளவும். நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      time: '12:45 PM'
    }
  ],
  hi: [
    { 
      id: '1', 
      sender: 'ai', 
      text: 'नमस्ते रवि जी! आज दोपहर 1:00 बजे आपकी बीपी की गोली का समय है। कृपया दोपहर के भोजन के बाद लें। मैं आज आपकी क्या मदद कर सकता हूँ?',
      time: '12:45 PM'
    }
  ],
  ur: [
    { 
      id: '1', 
      sender: 'ai', 
      text: 'السلام علیکم روی صاحب! آج دوپہر 1:00 بجے آپ کی بی پی کی گولی کا شیڈول ہے۔ لنچ کے بعد ضرور لیں۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟',
      time: '12:45 PM'
    }
  ]
};
