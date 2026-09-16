import { useState, useMemo } from "react";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Minus,
  Plus,
  MapPin,
  Clock,
  ArrowRight,
  Activity,
  User,
  Info,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../bottom-nav";
import { properties } from "../../data/mock-data";

export function PropertyBooking() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<
    "dates" | "guests" | "payment" | "confirm"
  >("dates");

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isBookingForSelf, setIsBookingForSelf] = useState(true);
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateError, setDateError] = useState<string | null>(null);

  const property = properties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Property not found
      </div>
    );
  }

  const calculateNights = () => {
    if (!dateRange.start || !dateRange.end) return 0;
    const diffTime = Math.abs(
      dateRange.end.getTime() - dateRange.start.getTime(),
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return property.price * calculateNights();
  };

  const handleNext = () => {
    if (step === "dates" && dateRange.start && dateRange.end) {
      setStep("guests");
    } else if (step === "guests") {
      if (isBookingForSelf || (guestInfo.name && guestInfo.phone)) {
        setStep("payment");
      }
    } else if (step === "payment" && paymentMethod) {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    navigate("/", { replace: true });
  };

  const canProceed = () => {
    if (step === "dates") return dateRange.start && dateRange.end;
    if (step === "guests") {
      if (adults < 1) return false;
      if (!isBookingForSelf) {
        return (
          guestInfo.name.length > 2 && guestInfo.phone.length > 5
        );
      }
      return true;
    }
    if (step === "payment") return paymentMethod;
    return true;
  };

  // --- Custom Date Picker Logic ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months = useMemo(() => {
    const result = [];
    const now = new Date();
    // Start from current month
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 0; i < 12; i++) {
      result.push(new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1));
    }
    return result;
  }, []);

  const getDaysInMonth = (month: Date) => {
    const days = [];
    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), i));
    }
    return days;
  };

  const isBlocked = (date: Date) => {
    if (!property.blockedDates) return false;
    const dStr = date.toISOString().split("T")[0];
    return property.blockedDates.includes(dStr);
  };

  const isSelected = (date: Date) => {
    if (
      dateRange.start &&
      date.getTime() === dateRange.start.getTime()
    )
      return true;
    if (
      dateRange.end &&
      date.getTime() === dateRange.end.getTime()
    )
      return true;
    return false;
  };

  const isInRange = (date: Date) => {
    if (!dateRange.start || !dateRange.end) return false;
    return (
      date.getTime() > dateRange.start.getTime() &&
      date.getTime() < dateRange.end.getTime()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isBlocked(date) || date < today) return;
    setDateError(null);

    if (
      !dateRange.start ||
      (dateRange.start && dateRange.end)
    ) {
      setDateRange({ start: date, end: null });
    } else if (date < dateRange.start) {
      setDateRange({ start: date, end: null });
    } else {
      // Check if any blocked dates are in between
      const checkDate = new Date(dateRange.start);
      checkDate.setDate(checkDate.getDate() + 1);
      
      let foundBlocked = false;
      while (checkDate < date) {
        if (isBlocked(checkDate)) {
          foundBlocked = true;
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }

      if (foundBlocked) {
        setDateError("Selected period includes unavailable dates.");
        setDateRange({ start: date, end: null });
      } else {
        setDateRange({ ...dateRange, end: date });
      }
    }
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "--";
    return date.toLocaleDateString("ar-SA-u-ca-gregory", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F5FB] pb-32" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] px-6 pt-16 pb-8 rounded-b-[10px] shadow-xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white hover:bg-white/20 transition-all font-bold"
            >
              <ChevronLeft size={20} strokeWidth={2} className="rotate-180" />
            </button>
            <div className="text-center">
              <h1 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-1">
                عملية الحجز
              </h1>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                {step === "dates" && "اختيار التاريخ"}
                {step === "guests" && "اختيار الضيوف"}
                {step === "payment" && "طريقة الدفع"}
                {step === "confirm" && "تأكيد الحجز"}
              </p>
            </div>
            <div className="w-10" />
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-3">
            {["confirm", "payment", "guests", "dates"].map(
              (s, idx) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    step === s
                      ? "bg-[#C69815] w-10 shadow-lg shadow-[#C69815]/40"
                      : [
                            "dates",
                            "guests",
                            "payment",
                            "confirm",
                          ].indexOf(step) > (3 - idx)
                        ? "bg-white w-4"
                        : "bg-white/20 w-4"
                  }`}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mx-[0px] mt-[-24px] mb-[60px]">
        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[10px] p-6 shadow-xl min-h-[400px]">
          {/* Step 1: Dates & Calendar */}
          {step === "dates" && (
            <div className="flex flex-col h-[520px] overflow-hidden">
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  متاح الآن
                </div>
                <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-widest text-right">
                  اختر فترة الإقامة
                </h3>
              </div>

              {/* Weekday headers - Sticky at the top of scrollable area */}
              <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0 border-b border-gray-100 pb-2">
                {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map((day) => (
                  <div key={day} className="text-center text-[10px] font-bold text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Scrollable Calendar */}
              <div className="flex-1 overflow-y-auto space-y-8 pr-1 -mr-1 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {months.map((month, mIdx) => (
                  <div key={mIdx} className="space-y-4">
                    <h4 className="text-[11px] font-black text-[#2952AB] uppercase tracking-widest text-right sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-20">
                      {month.toLocaleDateString("ar-SA-u-ca-gregory", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h4>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(month).map((day, dIdx) => {
                        if (!day) return <div key={dIdx} />;

                        const blocked = isBlocked(day);
                        const selected = isSelected(day);
                        const inRange = isInRange(day);
                        const past = day < today;

                        return (
                          <button
                            key={dIdx}
                            disabled={blocked || past}
                            onClick={() => handleDateClick(day)}
                            className={`aspect-square rounded-[8px] text-[11px] font-bold flex flex-col items-center justify-center transition-all relative ${
                              selected
                                ? "bg-[#2952AB] text-white shadow-lg scale-105 z-10"
                                : inRange
                                  ? "bg-[#E4ECF7] text-[#2952AB]"
                                  : blocked
                                    ? "text-gray-300 line-through cursor-not-allowed opacity-50"
                                    : past
                                      ? "text-gray-200 cursor-not-allowed"
                                      : "text-[#2952AB] hover:bg-[#E4ECF7]"
                            }`}
                          >
                            {day.getDate()}
                            {blocked && (
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-red-400 rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {dateError && (
                <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest p-3 rounded-[10px] animate-in shake duration-500 text-right flex-shrink-0">
                  {dateError === "Selected period includes unavailable dates." ? "الفترة المختارة تتضمن تواريخ غير متاحة." : dateError}
                </div>
              )}

              {/* Selection Summary */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-[#C2D1E8]/20 mt-4 flex-shrink-0">
                <div className="bg-gray-50/50 p-3 rounded-[10px] border border-white text-right">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    تسجيل الوصول
                  </span>
                  <span className="text-xs font-bold text-[#2952AB]">
                    {formatDisplayDate(dateRange.start)}
                  </span>
                </div>
                <div className="bg-gray-50/50 p-3 rounded-[10px] border border-white text-right">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    تسجيل المغادرة
                  </span>
                  <span className="text-xs font-bold text-[#2952AB]">
                    {formatDisplayDate(dateRange.end)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Guests & Contact */}
          {step === "guests" && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 text-right">
                <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-widest">
                  الحجز لمن؟
                </h3>
                {/* Segment Control / Toggle */}
                <div className="flex p-1.5 bg-[#E4ECF7]/50 rounded-[10px] border border-[#C2D1E8]/30">
                  <button
                    onClick={() => setIsBookingForSelf(false)}
                    className={`flex-1 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${
                      !isBookingForSelf
                        ? "bg-[#2952AB] text-white shadow-lg"
                        : "text-[#2952AB]/40"
                    }`}
                  >
                    لشخص آخر
                  </button>
                  <button
                    onClick={() => setIsBookingForSelf(true)}
                    className={`flex-1 py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${
                      isBookingForSelf
                        ? "bg-[#2952AB] text-white shadow-lg"
                        : "text-[#2952AB]/40"
                    }`}
                  >
                    لنفسي
                  </button>
                </div>
              </div>

              {!isBookingForSelf && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500 text-right">
                  <div className="space-y-1.5 text-right">
                    <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest mr-1">
                      الاسم الكامل للضيف
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: أحمد محمد"
                        value={guestInfo.name}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-5 py-4 text-sm font-bold text-[#2952AB] focus:outline-none focus:border-[#2952AB] focus:ring-4 focus:ring-[#2952AB]/5 transition-all outline-none text-right"
                      />
                      <User
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C2D1E8]"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-right">
                      <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest mr-1">
                        البريد الإلكتروني (اختياري)
                      </label>
                      <input
                        type="email"
                        placeholder="name@email.com"
                        value={guestInfo.email}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-5 py-4 text-sm font-bold text-[#2952AB] focus:outline-none focus:border-[#2952AB] transition-all outline-none text-right"
                      />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest mr-1">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        placeholder="9665..."
                        value={guestInfo.phone}
                        onChange={(e) =>
                          setGuestInfo({
                            ...guestInfo,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-5 py-4 text-sm font-bold text-[#2952AB] focus:outline-none focus:border-[#2952AB] transition-all outline-none text-right"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-[#C2D1E8]/20 text-right">
                <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-widest mb-4">
                  عدد الضيوف
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      id: "adults",
                      label: "بالغين",
                      sub: "13 سنة فأكثر",
                      value: adults,
                      setter: setAdults,
                      max: property.maxGuests.adults,
                    },
                    {
                      id: "children",
                      label: "أطفال",
                      sub: "2-12 سنة",
                      value: children,
                      setter: setChildren,
                      max: property.maxGuests.children,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-5 bg-white rounded-[10px] border border-[#C2D1E8]/30 shadow-sm"
                    >
                      <div className="flex items-center gap-5">
                       <button
                          onClick={() =>
                            item.setter(
                              Math.min(item.max, item.value + 1),
                            )
                          }
                          className="w-10 h-10 bg-[#2952AB] rounded-[10px] flex items-center justify-center text-white hover:bg-[#3B6EC9] transition-colors shadow-lg"
                        >
                          <Plus size={16} />
                        </button>
                        <span className="text-sm font-black text-[#2952AB] w-4 text-center">
                          {item.value}
                        </span>
                        <button
                          onClick={() =>
                            item.setter(
                              Math.max(
                                item.id === "adults" ? 1 : 0,
                                item.value - 1,
                              ),
                            )
                          }
                          className="w-10 h-10 border border-[#C2D1E8] rounded-[10px] flex items-center justify-center text-[#2952AB] hover:bg-[#E4ECF7] transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#2952AB]">
                          {item.label}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#FEF8E7] p-4 rounded-[10px] flex gap-3 border border-[#C69815]/20 justify-end">
                <p className="text-[11px] font-medium text-[#2952AB]/70 leading-relaxed text-right">
                  يتسع هذا العقار لما يصل إلى {property.maxGuests.adults} من
                  البالغين و {property.maxGuests.children} من الأطفال لضمان أقصى درجات الراحة.
                </p>
                <Info size={18} className="text-[#C69815] shrink-0" />
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-widest text-right">
                طريقة الدفع
              </h3>
              <div className="space-y-3">
                {[
                  {
                    id: "digital",
                    name: "آبل باي",
                    icon: Smartphone,
                  },
                  {
                    id: "cash",
                    name: "الدفع عند الوصول",
                    icon: Wallet,
                  },
                  {
                    id: "card",
                    name: "بطاقة ائتمان",
                    icon: CreditCard,
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-[10px] border transition-all duration-300 flex items-center justify-between group ${
                      paymentMethod === method.id
                        ? "bg-[#2952AB] border-[#2952AB] shadow-xl translate-x-[-4px]"
                        : "bg-white border-[#C2D1E8]/30 hover:border-[#2952AB]/40"
                    }`}
                  >
                    {paymentMethod === method.id ? (
                      <div className="w-5 h-5 bg-[#C69815] rounded-full flex items-center justify-center">
                        <CheckCircle2
                          size={12}
                          className="text-white"
                        />
                      </div>
                    ) : <div className="w-5" />}
                    <div className="flex items-center gap-4 justify-end flex-1">
                      <span
                        className={`text-sm font-bold ${
                          paymentMethod === method.id
                            ? "text-white"
                            : "text-[#2952AB]"
                        }`}
                      >
                        {method.name}
                      </span>
                      <div
                        className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-colors ${
                          paymentMethod === method.id
                            ? "bg-white/20 text-white"
                            : "bg-[#E4ECF7] text-[#2952AB]"
                        }`}
                      >
                        <method.icon
                          size={22}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirmation (High-Fidelity Receipt Card) */}
          {step === "confirm" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center pb-2">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-inner">
                  <CheckCircle2
                    size={32}
                    className="text-green-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-black text-[#2952AB] uppercase tracking-wider">
                  المراجعة والتأكيد
                </h3>
              </div>

              <div className="bg-white rounded-[10px] border border-[#C2D1E8]/40 overflow-hidden shadow-2xl relative text-right">
                {/* Receipt Header Style */}
                <div className="bg-[#2952AB] px-6 py-4 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    ID: BK-39214
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                      تفاصيل الحجز
                    </span>
                    <Activity
                      size={14}
                      className="text-[#C69815] animate-pulse"
                    />
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Property Info */}
                  <div className="flex gap-4 justify-end">
                    <div className="min-w-0 text-right">
                      <h4 className="text-sm font-black text-[#2952AB] truncate">
                        {property.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mt-1 uppercase justify-end">
                        {property.city}، {property.area}
                        <MapPin size={10} />
                      </div>
                    </div>
                    <img
                      src={property.images[0]}
                      className="w-16 h-16 rounded-[10px] object-cover shadow-md"
                    />
                  </div>

                  {/* Date/Guest Grid */}
                  <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-dashed border-gray-100">
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">
                        تسجيل المغادرة
                      </span>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-[#2952AB]">
                          {formatDisplayDate(dateRange.end)}
                        </span>
                        <CalendarIcon
                          size={12}
                          className="text-[#C69815]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">
                        تسجيل الوصول
                      </span>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-[#2952AB]">
                          {formatDisplayDate(dateRange.start)}
                        </span>
                        <CalendarIcon
                          size={12}
                          className="text-[#C69815]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">
                        معلومات الضيف
                      </span>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-[#2952AB] truncate max-w-[80px]">
                          {isBookingForSelf
                            ? "شاهر سعيد"
                            : guestInfo.name || "مستخدم ضيف"}
                        </span>
                        <User
                          size={12}
                          className="text-[#C69815]"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">
                        الضيوف
                      </span>
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-bold text-[#2952AB]">
                          {adults} بالغ
                          {children > 0 && `، ${children} طفل`}
                        </span>
                        <Users
                          size={12}
                          className="text-[#C69815]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="pt-4 border-t border-dashed border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                       <span>{calculateTotal()}$</span>
                      <span>{calculateNights()} ليالٍ</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                       <span className="text-xl font-black text-[#C69815]">
                        {calculateTotal()}$
                      </span>
                      <span className="text-sm font-black text-[#400E0E] uppercase">
                        المبلغ الإجمالي
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[48px] -left-3 w-6 h-6 bg-[#F2F5FB] rounded-full border border-[#C2D1E8]/20" />
                <div className="absolute top-[48px] -right-3 w-6 h-6 bg-[#F2F5FB] rounded-full border border-[#C2D1E8]/20" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 mx-[0px] mt-[0px] mb-[60px]">
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl border border-white rounded-[10px] p-4 shadow-2xl flex items-center justify-between gap-6 ring-1 ring-black/5 mx-[0px] my-[10px]">
          <button
            onClick={
              step === "confirm" ? handleConfirm : handleNext
            }
            disabled={!canProceed()}
            className={`flex-1 flex items-center justify-center gap-2 rounded-[10px] font-black transition-all shadow-xl ${ canProceed() ? "bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white shadow-[#2952AB]/20" : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" } px-[6px] py-[16px]`}
          >
            <ChevronRight size={18} strokeWidth={2.5} className="rotate-180" />
            <span className="uppercase tracking-[0.2em] text-[12px]">
              {step === "confirm" ? "تأكيد" : "متابعة"}
            </span>
          </button>
          <div className="space-y-0.5 mr-2 text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {calculateNights() > 0
                  ? `/ ${calculateNights()} ليالٍ`
                  : "/ ليلة"}
              </span>
              <span className="text-2xl font-black text-[#2952AB]">
                {calculateTotal() || property.price}$
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}