import { ChevronLeft, User, CreditCard, Bell, Shield, HelpCircle, Settings, ChevronRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BottomNav } from './bottom-nav';

export function ProfileScreen() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      navigate('/login');
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', route: '/settings/personal-info' },
        { icon: CreditCard, label: 'Payment Methods', route: '/settings/payment-methods', badge: '2' },
        { icon: Bell, label: 'Notifications', route: '/settings/notifications' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Shield, label: 'Privacy & Security', route: '/settings/security' },
        { icon: Settings, label: 'App Settings', route: '/settings' },
        { icon: HelpCircle, label: 'Help & Support', route: '/settings/help' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1">
              <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-[#2952AB] via-[#3B6EC9] to-[#1D3D7A] rounded-[10px] p-6 text-white mb-6 shadow-xl border border-[#2F0909]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-[#C69815]/20 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
              <User size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Sarah Johnson</h2>
              <p className="text-white/80 text-sm">sarah.j@email.com</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-semibold">24</div>
              <div className="text-xs text-white/70 mt-1">Bookings</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-semibold flex items-center justify-center gap-1">
                <span className="text-[#C69815] drop-shadow-md">★</span>
                4.9
              </div>
              <div className="text-xs text-white/70 mt-1">Rating</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-semibold">$248</div>
              <div className="text-xs text-white/70 mt-1">Saved</div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
              {section.title}
            </h3>
            
            <div className="bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIndex}
                    to={item.route}
                    className="flex items-center justify-between px-4 py-4 hover:bg-gradient-to-r hover:from-[#F2F5FB] hover:to-[#FEFBF3] transition-all border-b border-[#C2D1E8]/20 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center border border-[#C2D1E8]/30">
                        <Icon size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                      </div>
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-[#7A9ACB]" strokeWidth={1.5} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white rounded-[10px] px-4 py-4 text-red-600 shadow-md border border-red-100 hover:bg-red-50 transition-colors mb-6"
        >
          <LogOut size={18} strokeWidth={1.5} />
          <span>Log Out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}