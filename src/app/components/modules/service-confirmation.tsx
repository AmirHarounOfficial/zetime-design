import { CheckCircle2, Calendar, Clock, MapPin, User, Phone, FileText, Home, Car } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function ServiceConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { service, provider, date, time, address, phone, notes, wantsPickup } = location.state || {};
  const { module, categoryId, serviceId } = useParams();

  if (!service || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">لم يتم العثور على معلومات الحجز</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'مجاني';
    return `${price}$`;
  };

  const servicePrice = provider.price || service.price;
  const pickupFee = wantsPickup ? (provider.pickupFee || 0) : 0;
  const totalWeight = servicePrice + pickupFee;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirmBooking = () => {
    // Navigate to success screen
    navigate(`/module/${module}/${categoryId}/${serviceId}/success`, { 
      state: { service, provider, date, time, address, phone, notes, wantsPickup },
      replace: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] px-4 pt-12 pb-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">راجع حجزك</h1>
          <p className="text-white/80 text-sm">يرجى مراجعة التفاصيل قبل التأكيد</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        {/* Service Details Card */}
        <div className="bg-white rounded-[10px] p-5 shadow-lg border border-[#C2D1E8]/30">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 mb-3">تفاصيل الخدمة</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-[#2952AB] text-lg">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#C2D1E8]/30">
              <span className="text-sm text-gray-600">المدة</span>
              <span className="text-sm font-medium text-gray-900">{service.duration}</span>
            </div>
            <div className="flex items-center justify-between pb-3">
              <span className="text-sm text-gray-600">رسوم الخدمة</span>
              <span className="font-medium text-gray-900">{formatPrice(servicePrice)}</span>
            </div>
            {wantsPickup && (
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <Car size={14} className="text-[#2952AB]" />
                  <span className="text-sm text-gray-600">الاستلام والتوصيل</span>
                </div>
                <span className="font-medium text-gray-900">+{formatPrice(pickupFee)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-[#C2D1E8]/30">
              <span className="font-semibold text-gray-900">السعر الإجمالي</span>
              <span className="text-xl font-bold text-[#2952AB]">{formatPrice(totalWeight)}</span>
            </div>
          </div>
        </div>

        {/* Provider Card */}
        <div className="bg-white rounded-[10px] p-5 shadow-lg border border-[#C2D1E8]/30">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 mb-3">مزود الخدمة</h2>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{provider.name}</span>
                {provider.verified && (
                  <CheckCircle2 size={14} className="text-blue-500" strokeWidth={2} />
                )}
              </div>
              <div className="text-sm text-gray-600 mt-0.5">
                ⭐ {provider.rating} • {provider.reviews} مراجعة
              </div>
              {provider.experience && (
                <div className="text-xs text-gray-500 mt-0.5">خبرة {provider.experience}</div>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-[10px] p-5 shadow-lg border border-[#C2D1E8]/30">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 mb-3">تفاصيل الموعد</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-500">التاريخ</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(date)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-500">الوقت</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-500">عنوان الخدمة</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{address}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 text-right">
                <div className="text-xs text-gray-500">رقم هاتف التواصل</div>
                <div className="text-sm font-medium text-gray-900 mt-0.5">{phone}</div>
              </div>
            </div>

            {notes && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 text-right">
                  <div className="text-xs text-gray-500">ملاحظات إضافية</div>
                  <div className="text-sm font-medium text-gray-900 mt-0.5">{notes}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-gradient-to-r from-[#FEF8E7] to-[#E4ECF7] rounded-[10px] p-4 border border-[#C69815]/20">
          <p className="text-xs text-[#2952AB]/80">
            <strong>ملاحظة:</strong> ستتلقى رسالة تأكيد مع تفاصيل الاتصال بالمزود. يرجى التأكد من تواجد شخص ما في عنوان الخدمة في الوقت المحدد.
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-4 pb-4">
        <div className="max-w-md mx-auto space-y-2">
          <button
            onClick={handleConfirmBooking}
            className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium shadow-lg"
          >
            تأكيد الحجز
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-white text-[#2952AB] py-3 rounded-[10px] font-medium border border-[#C2D1E8]/30"
          >
            الرجوع
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
