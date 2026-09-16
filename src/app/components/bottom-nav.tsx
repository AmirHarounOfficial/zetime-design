import { Home, Search, Clock, Inbox, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: Search, label: 'البحث', path: '/search' },
    { icon: Clock, label: 'النشاط', path: '/activity' },
    { icon: Inbox, label: 'الرسائل', path: '/inbox' },
    { icon: User, label: 'الملف', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#C2D1E8]/30 z-50 shadow-lg" dir="rtl">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1 px-3 min-w-[60px] relative"
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#2952AB] via-[#3B6EC9] to-[#2952AB] rounded-full" />
                )}
                <div className={`p-1.5 rounded-[10px] transition-all ${isActive ? 'bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10' : ''}`}>
                  <Icon 
                    size={22} 
                    strokeWidth={1.5}
                    className={isActive ? 'text-[#2952AB]' : 'text-gray-500'}
                  />
                </div>
                <span className={`text-[10px] ${isActive ? 'text-[#2952AB]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}