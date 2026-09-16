import { ChevronLeft, ChevronRight, Bell, Lock, Globe, CreditCard, HelpCircle, FileText, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function Settings() {
  const navigate = useNavigate();

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', route: '/settings/personal-info' },
        { icon: Lock, label: 'Password & Security', route: '/settings/security' },
        { icon: Bell, label: 'Notifications', route: '/settings/notifications' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Language & Region', route: '/settings/language' },
        { icon: CreditCard, label: 'Payment Methods', route: '/settings/payment-methods' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', route: '/settings/help' },
        { icon: FileText, label: 'Terms & Conditions', route: '/settings/terms' },
        { icon: Shield, label: 'Privacy Policy', route: '/settings/privacy' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
              {section.title}
            </h2>
            <div className="bg-white rounded-[10px] border border-[#C2D1E8]/30 overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => navigate(item.route)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-[#E4ECF7]/30 transition-colors border-b border-[#C2D1E8]/30 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                        <Icon size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                      </div>
                      <span className="text-sm text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="text-center text-xs text-gray-500 pt-4">
          <div className="mb-1">ZeTime Super-App</div>
          <div>Version 1.0.0</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
