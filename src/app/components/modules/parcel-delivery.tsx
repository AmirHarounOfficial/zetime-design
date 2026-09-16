import { useState } from 'react';
import { Package, Clock, Zap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ModuleTemplate } from './module-template';

const deliveryTypes = [
  {
    id: "for-now",
    name: "عاجل الآن",
    icon: Zap,
    duration: "توصيل فوري ومباشر",
    description: "أسرع توصيل للطرود العاجلة. استلام فوري من موقعك والتوصيل بمسار مباشر وسريع.",
    badge: "الأسرع",
  },
  {
    id: "scheduled",
    name: "مجدول لاحقاً",
    icon: Clock,
    duration: "اختر وقت وتاريخ التوصيل",
    description: "خطط مسبقاً وجدول توصيل طردك في الوقت والتاريخ المناسبين لك مع خيارات مرنة.",
    badge: "توفير",
  },
];

const timeSlots = [
  "09:00 ص",
  "11:00 ص",
  "01:00 م",
  "03:00 م",
  "05:00 م",
  "07:00 م",
  "09:00 م",
];

export function ParcelDeliveryModule() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getNext7Days = () => {
    const days = [];
    const locale = 'ar-EG';
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      let dayName = date.toLocaleDateString(locale, { weekday: 'short' });
      if (i === 0) dayName = 'اليوم';
      if (i === 1) dayName = 'غداً';
      
      const dayNum = date.toLocaleDateString(locale, { day: 'numeric' });
      const monthName = date.toLocaleDateString(locale, { month: 'short' });
      const dateString = date.toISOString().split('T')[0];
      
      days.push({
        id: dateString,
        dayName,
        dayNum,
        monthName,
      });
    }
    return days;
  };

  const handleContinue = () => {
    if (selectedType) {
      const type = deliveryTypes.find((t) => t.id === selectedType);
      if (type) {
        // Strip non-serializable icon before passing to navigation state
        const { icon, ...serializableType } = type;
        navigate("/parcel-delivery/pickup", {
          state: { 
            deliveryType: {
              ...serializableType,
              scheduledDate: selectedType === 'scheduled' ? selectedDate : null,
              scheduledTime: selectedType === 'scheduled' ? selectedTime : null,
            } 
          },
        });
      }
    }
  };

  const isContinueDisabled = !selectedType || (selectedType === 'scheduled' && (!selectedDate || !selectedTime));

  return (
    <ModuleTemplate
      moduleName="توصيل الطرود"
      icon={Package}
      description="أرسل طرودك إلى أي مكان"
    >
      <div className="space-y-8">
        {/* Hero Card */}
        <div className="bg-[#2952AB] rounded-[15px] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C69815]/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[10px] flex items-center justify-center">
                <Package size={24} className="text-[#C69815]" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black uppercase tracking-widest">
                  إرسال طرد
                </h3>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  اختر خيار التوصيل المناسب لك
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Type Selection */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">
              خيار التوصيل
            </h2>
          </div>

          <div className="space-y-4">
            {deliveryTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    if (type.id !== 'scheduled') {
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }
                  }}
                  className={`w-full text-right rounded-[15px] p-5 border-2 transition-all active:scale-[0.98] ${
                    isSelected
                      ? "bg-[#E4ECF7] border-[#2952AB] shadow-lg shadow-[#2952AB]/10"
                      : "bg-white border-transparent shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-14 h-14 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-[#2952AB] shadow-md"
                          : "bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          isSelected
                            ? "text-[#C69815]"
                            : "text-[#2952AB]"
                        }
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <h3 className="text-sm font-black text-[#2952AB] uppercase tracking-wider">
                          {type.name}
                        </h3>
                        {type.badge && (
                          <span
                            className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#C69815]/10 text-[#C69815]"
                          >
                            {type.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest mb-2">
                        {type.duration}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-relaxed text-right">
                        {type.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <CheckCircle2
                          size={22}
                          className="text-[#2952AB]"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <div className="w-[22px] h-[22px] rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Time Picker for Scheduled */}
        {selectedType === 'scheduled' && (
          <div className="bg-white rounded-[15px] p-5 shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-2 justify-end border-b border-gray-50 pb-2">
              <span className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">تاريخ التوصيل المفضل</span>
              <div className="w-1 h-3 bg-[#C69815] rounded-full" />
            </div>
            
            {/* Days Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-2 justify-end flex-row-reverse" style={{ direction: 'rtl' }}>
              {getNext7Days().map((day) => {
                const isDateSelected = selectedDate === day.id;
                return (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDate(day.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-[12px] min-w-[72px] border-2 transition-all ${
                      isDateSelected
                        ? 'border-[#2952AB] bg-[#E4ECF7] text-[#2952AB] shadow-sm shadow-[#2952AB]/10'
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[9px] font-black">{day.dayName}</span>
                    <span className="text-base font-black tracking-tight my-0.5">{day.dayNum}</span>
                    <span className="text-[8px] font-bold opacity-80">{day.monthName}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 justify-end border-b border-gray-50 pb-2 pt-2">
              <span className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">وقت التوصيل المفضل</span>
              <div className="w-1 h-3 bg-[#C69815] rounded-full" />
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-4 gap-2" style={{ direction: 'rtl' }}>
              {timeSlots.map((slot) => {
                const isTimeSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-1 rounded-[10px] text-[10px] font-black transition-all border text-center ${
                      isTimeSelected
                        ? 'border-[#2952AB] bg-[#2952AB] text-white shadow-sm'
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Note */}
        <div className="bg-[#FEF8E7] rounded-[12px] p-4 border border-[#C69815]/15">
          <p className="text-[10px] font-bold text-[#2952AB] uppercase tracking-widest text-center">
            💡 يتم احتساب عرض السعر بناءً على السائق المختار والوجهات
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={isContinueDisabled}
          className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
        >
          تحديد الاستلام والوجهات
          <ChevronRight
            size={18}
            strokeWidth={3}
            className="rotate-180"
          />
        </button>
      </div>
    </ModuleTemplate>
  );
}
