import { ChevronLeft, Search, LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { liveActivities } from '../../data/mock-data';

interface ModuleTemplateProps {
  moduleName: string;
  icon: LucideIcon;
  description: string;
  primaryColor?: string;
  children?: React.ReactNode;
}

export function ModuleTemplate({ 
  moduleName, 
  icon: Icon, 
  description,
  primaryColor = '#2952AB',
  children 
}: ModuleTemplateProps) {
  // Check if there's an active order/booking for this module
  const activeActivity = liveActivities.find(activity => 
    activity.title.toLowerCase().includes(moduleName.toLowerCase().split(' ')[0])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-1">
                <ChevronLeft size={24} className="text-[#2952AB] rotate-180" strokeWidth={1.5} />
              </Link>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center border shadow-sm"
                  style={{ 
                    backgroundColor: `${primaryColor}08`,
                    borderColor: `${primaryColor}20`
                  }}
                >
                  <Icon size={20} style={{ color: primaryColor }} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{moduleName}</h1>
                  <p className="text-sm text-[#2952AB]/60">{description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <Link 
            to="/search"
            className="flex items-center gap-3 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm"
          >
            <Search size={18} className="text-[#7A9ACB]" strokeWidth={1.5} />
            <span className="text-[#2952AB]/60 text-sm">البحث في {moduleName}</span>
          </Link>
        </div>
      </div>

      {/* Active Order/Booking Banner */}
      {activeActivity && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div 
            className="bg-white rounded-[10px] p-4 shadow-md border-2"
            style={{ borderColor: `${primaryColor}30` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-sm font-medium" style={{ color: primaryColor }}>
                  نشط الآن
                </span>
              </div>
              <span className="text-xs bg-gradient-to-r from-orange-50 to-[#FEF8E7] text-orange-600 px-2.5 py-1 rounded-full border border-orange-100">
                قيد التنفيذ
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{activeActivity.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{activeActivity.subtitle}</p>
            
            <div className="h-2.5 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full rounded-full transition-all duration-300 shadow-sm"
                style={{ 
                  width: `${activeActivity.progress}%`,
                  background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}CC, ${primaryColor})`
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Module Content */}
      <div className="max-w-md mx-auto px-4 mt-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}