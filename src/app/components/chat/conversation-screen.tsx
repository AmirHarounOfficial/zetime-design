import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Phone, Video, Send, Plus, MoreVertical, CheckCheck } from 'lucide-react';
import { Link, useParams } from 'react-router';

export function ConversationScreen() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock conversation data
  const messages = [
    {
      id: '1',
      text: 'Hello! I am regarding your maintenance request for the kitchen sink.',
      sender: 'other',
      time: '14:05',
      status: 'read'
    },
    {
      id: '2',
      text: 'Yes, thank you for reaching out. It seems like a minor leak under the pipe.',
      sender: 'me',
      time: '14:10',
      status: 'read'
    },
    {
      id: '3',
      text: 'I can arrive by 4 PM to fix the kitchen sink. Does that work?',
      sender: 'other',
      time: '14:20',
      status: 'read'
    },
    {
      id: '4',
      text: 'That works perfectly. I will be home by then.',
      sender: 'me',
      time: '14:25',
      status: 'delivered'
    }
  ];

  const participant = {
    name: 'Ahmad Al-Saeed',
    role: 'Handyman',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop',
    isOnline: true
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#2952AB] to-[#3B6EC9] px-6 pt-12 pb-6 rounded-b-[30px] shadow-xl z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/inbox" className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                  <img src={participant.avatar} alt={participant.name} className="w-full h-full object-cover" />
                </div>
                {participant.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#2952AB] rounded-full shadow-sm" />
                )}
              </div>
              <div>
                <h2 className="text-sm font-black text-white truncate">{participant.name}</h2>
                <span className="text-[9px] font-black text-[#C69815] uppercase tracking-widest">{participant.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <Phone size={18} />
            </button>
            <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white hover:bg-white/20 transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide"
      >
        <div className="text-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[80%] group`}>
              <div className={`
                p-4 rounded-[10px] shadow-sm relative transition-all
                ${msg.sender === 'me' 
                  ? 'bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] text-white rounded-tr-none' 
                  : 'bg-white border border-[#C2D1E8]/20 text-[#2952AB] rounded-tl-none'}
              `}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1.5 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span className="text-[9px] font-bold text-gray-400">{msg.time}</span>
                {msg.sender === 'me' && (
                  <CheckCheck size={10} className={msg.status === 'read' ? 'text-[#C69815]' : 'text-gray-300'} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-6 bg-white/30 backdrop-blur-2xl border-t border-[#C2D1E8]/20 rounded-t-[30px] z-20">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button className="w-12 h-12 bg-white rounded-[10px] flex items-center justify-center text-[#2952AB] shadow-lg border border-[#C2D1E8]/20 active:scale-95 transition-all">
            <Plus size={20} />
          </button>
          
          <div className="flex-1 relative group">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="w-full bg-white rounded-[10px] pl-4 pr-12 py-3.5 text-sm text-[#2952AB] placeholder-[#2952AB]/30 border border-[#C2D1E8]/20 shadow-inner focus:outline-none focus:border-[#C69815]/50 transition-all"
            />
            <button 
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-[8px] transition-all
                ${message ? 'bg-[#C69815] text-white shadow-lg' : 'text-gray-300'}
              `}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
