import { CheckCircle2, Home, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function BookingSuccess() {
  const navigate = useNavigate();
  const { module } = useParams();
  const location = useLocation();
  const { provider, service, date, time } = location.state || {};

  const getTrackLink = () => {
    switch (module) {
      case 'car-services':
        return `/activity/car-service/${service?.id || '1'}`;
      case 'street-assistant':
        return '/activity';
      default:
        return '/activity';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] flex flex-col items-center pt-24 px-6 pb-24" dir="rtl">
      <div className="w-24 h-24 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-full flex items-center justify-center shadow-2xl mb-8 animate-in zoom-in duration-500">
        <CheckCircle2 size={48} className="text-white" strokeWidth={1.5} />
      </div>

      <h1 className="text-2xl font-bold text-[#2952AB] mb-2 text-center">تم الحجز بنجاح!</h1>
      <p className="text-gray-500 text-center mb-8 max-w-xs">
        تم تأكيد حجزك. سيتم إخطار المزود وسيصل في الوقت المحدد.
      </p>

      {/* Summary Card */}
      <div className="w-full max-w-md bg-white rounded-[20px] p-6 shadow-xl border border-[#C2D1E8]/30 mb-8 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-[#C2D1E8]/20">
          <div className="w-12 h-12 bg-[#2952AB]/10 rounded-full flex items-center justify-center">
            <CheckCircle2 size={24} className="text-[#2952AB]" />
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-[#2952AB]">{service?.name || 'حجز خدمة'}</h3>
            <p className="text-xs text-gray-500">{provider?.name || 'فني محترف'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#C69815]" />
            <span className="text-xs font-medium text-gray-700">{date || 'اليوم'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#C69815]" />
            <span className="text-xs font-medium text-gray-700">{time || '9:00 ص'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => navigate(getTrackLink())}
          className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[15px] font-semibold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <ChevronRight size={18} className="rotate-180" />
          تتبع حجزي
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white text-[#2952AB] py-4 rounded-[15px] font-semibold border border-[#C2D1E8]/60 shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          <Home size={18} />
          الذهاب للرئيسية
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
