import { useState } from 'react';
import { Search, MoreHorizontal, Filter, User, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from './bottom-nav';

export function InboxScreen() {
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const chats = [
    {
      id: '1',
      userName: 'Ahmad Al-Saeed',
      userRole: 'Handyman',
      roleType: 'individual',
      lastMessage: 'I can arrive by 4 PM to fix the kitchen sink. Does that work?',
      time: '14:20',
      unreadCount: 2,
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      userName: 'QuickFix Solutions',
      userRole: 'Provider',
      roleType: 'company',
      lastMessage: 'Your property maintenance request has been assigned to a specialist.',
      time: '12:05',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      userName: 'Samer (Delivery Captain)',
      userRole: 'Driver',
      roleType: 'individual',
      lastMessage: 'I am at the gate now. Please share the entry code.',
      time: '09:45',
      unreadCount: 0,
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      userName: 'ZeTime Support',
      userRole: 'Support',
      roleType: 'company',
      lastMessage: 'How was your experience with the last booking?',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop'
    },
    {
      id: '5',
      userName: 'Elite Property Care',
      userRole: 'Provider',
      roleType: 'company',
      lastMessage: 'The cleaning team is on their way to the Skyline apartment.',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      avatar: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop'
    }
  ];

  const filteredChats = activeFilter === 'All' 
    ? chats 
    : chats.filter(chat => chat.userRole === activeFilter || (activeFilter === 'Providers' && chat.userRole === 'Provider'));

  const filterOptions = ['All', 'Providers', 'Handyman', 'Driver'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#2952AB] to-[#3B6EC9] px-6 pt-16 pb-8 rounded-b-[40px] shadow-xl relative">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-[#C69815] rounded-full" />
              <h1 className="text-xl font-black text-white uppercase tracking-[0.2em]">Messages</h1>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`w-10 h-10 ${showFilter ? 'bg-[#C69815] text-[#2952AB]' : 'bg-white/10 text-white'} backdrop-blur-md rounded-[10px] flex items-center justify-center transition-all`}
              >
                <Filter size={20} />
              </button>

              {/* Dropdown Menu */}
              {showFilter && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-[10px] shadow-2xl py-2 z-50 border border-[#C2D1E8]/20 animate-in fade-in zoom-in-95 duration-200">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setActiveFilter(option);
                        setShowFilter(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-[#2952AB] hover:bg-[#FEF8E7] transition-colors"
                    >
                      {option}
                      {activeFilter === option && <CheckCircle2 size={16} className="text-[#C69815]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Integrated Search Bar */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] px-12 py-4 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4">
        <div className="space-y-3">
          {filteredChats.map((chat) => (
            <Link 
              key={chat.id}
              to={`/chat/${chat.id}`}
              className="block bg-white/80 backdrop-blur-xl rounded-[10px] p-4 shadow-lg border border-white hover:border-[#C69815]/30 transition-all animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div className="flex gap-4">
                {/* Avatar with status */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img src={chat.avatar} alt={chat.userName} className="w-full h-full object-cover" />
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.1em] mb-0.5">
                        {chat.userRole}
                      </span>
                      <h3 className="font-bold text-[#2952AB] truncate">
                        {chat.userName}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">
                      {chat.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-xs ${chat.unreadCount > 0 ? 'text-[#2952AB] font-bold' : 'text-gray-500'} line-clamp-1 flex-1 leading-relaxed`}>
                      {chat.lastMessage}
                    </p>
                    
                    {chat.unreadCount > 0 && (
                      <div className="bg-gradient-to-br from-[#C69815] to-[#A88012] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-[#C69815]/30 flex-shrink-0">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredChats.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto text-[#C2D1E8] mb-4" size={48} strokeWidth={1} />
              <p className="text-[#2952AB]/60 font-medium">No conversations found for {activeFilter}</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}