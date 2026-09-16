import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Star,
  MessageCircle,
  XCircle,
  RefreshCw,
  Phone,
  ShieldCheck,
  User,
  Scissors,
  HelpCircle,
} from 'lucide-react';
import {
  mockBeautyBookings,
  BeautyBooking,
} from '../../data/beauty-mock-data';

export function BeautyActivityDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Find booking or fallback to first
  const existingBooking =
    mockBeautyBookings.find((b) => b.id === bookingId) || mockBeautyBookings[0];

  const [booking, setBooking] = useState<BeautyBooking>(existingBooking);

  // Modals
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newRescheduleTime, setNewRescheduleTime] = useState('17:00');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('تغيير في جدول مواعيدي الشخصي');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('خدمة ممتازة، التزام بالمواعيد واحترافية عالية جداً.');

  // Lifecycle state transitions
  const handleCheckIn = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'CHECKED_IN',
    }));
  };

  const handleStartService = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'IN_SERVICE',
      items: prev.items.map((it) => ({ ...it, status: 'IN_PROGRESS' })),
    }));
  };

  const handleCompleteService = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'COMPLETED',
      items: prev.items.map((it) => ({ ...it, status: 'COMPLETED' })),
    }));
  };

  const handlePay = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'PAID',
      paymentStatus: 'SUCCESS',
    }));
  };

  const handleCancelBooking = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'CANCELLED_BY_CUSTOMER',
    }));
    setShowCancelModal(false);
  };

  const handleRequestReschedule = () => {
    setBooking((prev) => ({
      ...prev,
      status: 'RESCHEDULE_PENDING',
      overallStartTime: newRescheduleTime,
    }));
    setShowRescheduleModal(false);
  };

  const handleSubmitReview = () => {
    setBooking((prev) => ({
      ...prev,
      reviewSubmitted: true,
    }));
    setShowReviewModal(false);
  };

  // State Stepper list
  const steps = [
    { key: 'CONFIRMED', label: 'مؤكد' },
    { key: 'CHECKED_IN', label: 'تسجيل وصول' },
    { key: 'IN_SERVICE', label: 'قيد التنفيذ' },
    { key: 'COMPLETED', label: 'مكتمل' },
    { key: 'PAID', label: 'تم السداد' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'CHECKED_IN':
        return 2;
      case 'IN_SERVICE':
        return 3;
      case 'COMPLETED':
        return 4;
      case 'PAID':
        return 5;
      default:
        return 1;
    }
  };

  const currentStepIndex = getStepIndex(booking.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/activity')}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB]"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-gray-900 leading-tight">تفاصيل الموعد</h1>
            <p className="text-[11px] text-gray-500 font-mono">{booking.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            booking.status === 'PAID'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'IN_SERVICE'
              ? 'bg-blue-100 text-[#2952AB]'
              : booking.status === 'CANCELLED_BY_CUSTOMER'
              ? 'bg-red-100 text-red-700'
              : 'bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1]'
          }`}
        >
          {booking.status === 'CONFIRMED' && 'موعد مؤكد ✓'}
          {booking.status === 'PENDING_CONFIRMATION' && 'بانتظار موافقة الصالون'}
          {booking.status === 'CHECKED_IN' && 'تم تسجيل الوصول بالصالون'}
          {booking.status === 'IN_SERVICE' && 'الخدمة جارية الآن ✂️'}
          {booking.status === 'COMPLETED' && 'اكتملت الخدمة - بانتظار السداد'}
          {booking.status === 'PAID' && 'مدفوع بالكامل ✓'}
          {booking.status === 'CANCELLED_BY_CUSTOMER' && 'ملغي من العميل'}
          {booking.status === 'RESCHEDULE_PENDING' && 'بانتظار قبول الموعد الجديد'}
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* State Machine Stepper (US-064 - US-067, EPIC 43) */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm">
          <h3 className="text-xs font-bold text-gray-500 mb-3">مراحل سير الموعد</h3>
          <div className="flex items-center justify-between relative">
            {steps.map((step, idx) => {
              const isPast = idx + 1 < currentStepIndex;
              const isCurrent = idx + 1 === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center flex-1 z-10">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-green-600 text-white'
                        : isCurrent
                        ? 'bg-[#2952AB] text-white ring-4 ring-[#2952AB]/20'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-bold ${
                      isCurrent ? 'text-[#2952AB]' : isPast ? 'text-gray-800' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grace Period Alert (US-069) */}
        {booking.status === 'CONFIRMED' && (
          <div className="p-3 bg-[#FEFBF3] border border-[#FAEFC1] rounded-[12px] flex items-start gap-2.5 text-xs text-[#6C510C]">
            <Clock size={16} className="text-[#C69815] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">فترة السماح للحضور: {booking.gracePeriodMins} دقيقة</span>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                موعدك اليوم في {booking.overallStartTime}. يمكنك تسجيل الوصول حتى {booking.overallStartTime} + 15 دقيقة دون إلغاء الحجز.
              </p>
            </div>
          </div>
        )}

        {/* Quick Simulation Testing Toolbar */}
        <div className="p-3 bg-gradient-to-r from-gray-50 to-[#F2F5FB] rounded-[12px] border border-[#C2D1E8]/50 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-gray-700">شريط محاكاة الحالات (Interactive Demo):</span>
            <span className="text-gray-400 text-[10px]">اضغط للانتقال</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            <button
              onClick={handleCheckIn}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded border shadow-2xs"
            >
              تسجيل وصول
            </button>
            <button
              onClick={handleStartService}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-blue-700 font-bold rounded border shadow-2xs"
            >
              بدء الخدمة
            </button>
            <button
              onClick={handleCompleteService}
              className="py-1.5 px-2 bg-white hover:bg-gray-100 text-purple-700 font-bold rounded border shadow-2xs"
            >
              إنهاء الخدمة
            </button>
            <button
              onClick={handlePay}
              className="py-1.5 px-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-2xs"
            >
              دفع الفاتورة
            </button>
          </div>
        </div>

        {/* Business & Branch Details */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={booking.businessLogo}
              alt={booking.businessName}
              className="w-12 h-12 rounded-[10px] object-cover border border-[#C2D1E8]/30 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900">{booking.businessName}</h3>
              <p className="text-xs text-[#2952AB] font-medium">{booking.branchName}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                <MapPin size={12} className="text-[#C69815]" />
                <span className="truncate">{booking.branchAddress}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
            <div className="bg-[#F2F5FB] p-2.5 rounded-[8px]">
              <span className="text-[10px] text-gray-500 block">تاريخ ووقت الموعد</span>
              <strong className="text-gray-900 font-bold block mt-0.5">
                {booking.date} • {booking.overallStartTime}
              </strong>
            </div>
            <div className="bg-[#F2F5FB] p-2.5 rounded-[8px]">
              <span className="text-[10px] text-gray-500 block">المكان</span>
              <strong className="text-gray-900 font-bold block mt-0.5">
                {booking.mode === 'IN_BRANCH' ? 'في فرع الصالون' : 'خدمة منزلية'}
              </strong>
            </div>
          </div>
        </div>

        {/* Booking Service Items Breakdown (EPIC 44: US-044) */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-gray-900">تفاصيل الخدمات المحجوزة</h3>
            <span className="text-xs text-gray-500">المدة: {booking.totalDurationMin} دقيقة</span>
          </div>

          <div className="space-y-2">
            {booking.items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-[10px] border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-900">{item.serviceName}</span>
                    <span className="text-[10px] bg-white text-[#2952AB] px-1.5 py-0.2 rounded border border-gray-200">
                      {item.durationMin} دقيقة
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-0.5">الأخصائي: {item.professionalName}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{item.price} ر.س</span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-2 border-t border-gray-100 text-xs space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span>{booking.subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>ضريبة القيمة المضافة (15%):</span>
              <span>{booking.tax.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between font-black text-sm text-gray-900 pt-1">
              <span>المبلغ الإجمالي:</span>
              <span className="text-[#2952AB]">{booking.totalAmount.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        {/* Payment Card & Single Payment Flow (US-106, US-107, US-112) */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-gray-900">سداد الفاتورة (Payment)</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                booking.paymentStatus === 'SUCCESS'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {booking.paymentStatus === 'SUCCESS' ? 'تم الدفع بنجاح' : 'معلق لحين اكتمال الخدمة'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px] border border-gray-100 text-xs">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#2952AB]" />
              <div>
                <span className="font-bold text-gray-900 block">
                  {booking.paymentMethod === 'APPLE_PAY'
                    ? 'Apple Pay'
                    : booking.paymentMethod === 'CARD_AT_PROVIDER'
                    ? 'جهاز الشبكة بالصالون (POS)'
                    : booking.paymentMethod === 'ONLINE'
                    ? 'بطاقة دفع إلكترونية'
                    : 'نقداً عند الصالون'}
                </span>
                <span className="text-[10px] text-gray-500">لا يتم الخصم إلا بعد اكتمال الخدمة تماماً</span>
              </div>
            </div>

            {booking.status === 'COMPLETED' && booking.paymentStatus !== 'SUCCESS' && (
              <button
                onClick={handlePay}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[8px] text-xs font-bold shadow active:scale-95"
              >
                ادفع الآن ({booking.totalAmount} ر.س)
              </button>
            )}
          </div>
        </div>

        {/* Review Submission (US-124, US-125, US-126, US-127) */}
        {(booking.status === 'COMPLETED' || booking.status === 'PAID') && (
          <div className="bg-gradient-to-br from-[#FEFBF3] to-white rounded-[14px] p-4 border border-[#C69815]/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-gray-900">تقييم الخدمة والأخصائي</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">شاركنا رأيك حول جودة الخدمة والتعامل</p>
              </div>
              {booking.reviewSubmitted ? (
                <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded">
                  تم التقييم بنجاح ✓
                </span>
              ) : (
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-3 py-1.5 bg-[#C69815] text-white rounded-[8px] text-xs font-bold shadow active:scale-95"
                >
                  كتابة تقييم
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions: Check-in, Reschedule, Cancel, Chat */}
        <div className="space-y-2 pt-2">
          {booking.status === 'CONFIRMED' && (
            <button
              onClick={handleCheckIn}
              className="w-full py-3 bg-[#2952AB] text-white font-bold rounded-[10px] text-xs shadow hover:bg-[#1D3D7A] active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              <span>تسجيل الوصول إلى الصالون (Check In)</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setShowRescheduleModal(true)}
              className="flex-1 py-2.5 bg-white border border-gray-300 hover:border-[#2952AB] text-gray-800 rounded-[10px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <RefreshCw size={14} className="text-[#2952AB]" />
              <span>طلب إعادة جدولة</span>
            </button>

            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 py-2.5 bg-white border border-red-200 hover:border-red-400 text-red-600 rounded-[10px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <XCircle size={14} />
              <span>إلغاء الموعد</span>
            </button>
          </div>

          <Link
            to={`/chat/beauty-${booking.businessId}`}
            className="w-full py-2.5 bg-white border border-[#C2D1E8] text-[#2952AB] rounded-[10px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <MessageCircle size={16} />
            <span>مراسلة الصالون عبر المحادثة</span>
          </Link>
        </div>
      </div>

      {/* Reschedule Modal (US-072) */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm p-5 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">طلب إعادة جدولة الموعد</h3>
            <p className="text-xs text-gray-500">اختر الوقت الجديد المقترح لإرساله للصالون للموافقة:</p>
            <div className="grid grid-cols-3 gap-2">
              {['16:00', '17:00', '18:30', '19:30', '20:15'].map((t) => (
                <button
                  key={t}
                  onClick={() => setNewRescheduleTime(t)}
                  className={`py-2 rounded text-xs font-bold border ${
                    newRescheduleTime === t ? 'bg-[#2952AB] text-white' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleRequestReschedule}
                className="flex-1 py-2.5 bg-[#2952AB] text-white text-xs font-bold rounded-[8px]"
              >
                إرسال الطلب
              </button>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-[8px]"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal (US-076) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm p-5 space-y-3">
            <h3 className="font-bold text-sm text-red-600">تأكيد إلغاء الموعد</h3>
            <p className="text-xs text-gray-600">
              يرجى تحديد سبب الإلغاء لتسجيله في سجل المواعيد وحسب سياسة الصالون:
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 p-2 rounded text-xs"
            >
              <option value="تغيير في جدول مواعيدي الشخصي">تغيير في جدول مواعيدي الشخصي</option>
              <option value="حجزت عن طريق الخطأ">حجزت عن طريق الخطأ</option>
              <option value="ظرف طارئ مفاجئ">ظرف طارئ مفاجئ</option>
              <option value="وجدت وقتاً أنسب">وجدت وقتاً أنسب</option>
            </select>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCancelBooking}
                className="flex-1 py-2.5 bg-red-600 text-white text-xs font-bold rounded-[8px]"
              >
                تأكيد الإلغاء
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-[8px]"
              >
                تراجع
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal (US-125) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm p-5 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">تقييم الصالون والخدمة</h3>
            <div className="flex justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((st) => (
                <button key={st} onClick={() => setReviewRating(st)}>
                  <Star
                    size={24}
                    className={
                      st <= reviewRating ? 'fill-[#C69815] text-[#C69815]' : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 p-2 rounded text-xs text-gray-800"
              placeholder="اكتب تعليقك هنا..."
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmitReview}
                className="flex-1 py-2.5 bg-[#2952AB] text-white text-xs font-bold rounded-[8px]"
              >
                نشر التقييم
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-[8px]"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
