import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  User,
  Home as HomeIcon,
  Store,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  Users,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  HelpCircle,
  MapPin,
  Car,
  Navigation,
  Check,
  AlertTriangle,
  Star,
  CheckCircle,
} from 'lucide-react';
import {
  beautyBusinesses,
  BeautyBranchService,
  BeautyProfessional,
  mockBeautyBookings,
  BeautyBooking,
} from '../../data/beauty-mock-data';

// Riyadh districts preset for quick location checking
const RIYADH_DISTRICTS = [
  { name: 'العليا', distance: 3.2, address: 'حي العليا، شارع العروبة، الرياض', inRange: true },
  { name: 'السليمانية', distance: 4.5, address: 'حي السليمانية، شارع التحلية، الرياض', inRange: true },
  { name: 'الملقا', distance: 8.8, address: 'حي الملقا، طريق أنس بن مالك، الرياض', inRange: true },
  { name: 'النخيل', distance: 6.2, address: 'حي النخيل، طريق الإمام سعود، الرياض', inRange: true },
  { name: 'حطين', distance: 9.5, address: 'حي حطين، بالقرب من البوليفارد، الرياض', inRange: true },
  { name: 'الياسمين', distance: 11.2, address: 'حي الياسمين، طريق الملك عبدالعزيز، الرياض', inRange: true },
  { name: 'الصحافة', distance: 13.0, address: 'حي الصحافة، طريق التخصصي، الرياض', inRange: true },
  { name: 'الرمال (خارج النطاق)', distance: 36.5, address: 'حي الرمال، الرياض (يبعد 36 كم)', inRange: false },
];

export function BeautyBookingFlow() {
  const { businessId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const business = beautyBusinesses.find((b) => b.id === businessId) || beautyBusinesses[0];

  // Selected Branch (from query or nearest)
  const branchIdParam = searchParams.get('branchId');
  const selectedBranch =
    business.branches.find((b) => b.id === branchIdParam) ||
    business.branches.find((b) => b.isNearest) ||
    business.branches[0];

  // Service Location Mode: "Salon" (IN_BRANCH) vs "Home Service" (AT_HOME)
  const modeParam = searchParams.get('mode');
  const [serviceLocationMode, setServiceLocationMode] = useState<'IN_BRANCH' | 'AT_HOME'>(
    modeParam === 'AT_HOME' ? 'AT_HOME' : 'IN_BRANCH'
  );

  // Initial services from query or default first
  const serviceIdsParam = searchParams.get('services')?.split(',') || [];
  const initialServices = useMemo(() => {
    let list =
      serviceIdsParam.length > 0
        ? business.services.filter((s) => serviceIdsParam.includes(s.serviceId))
        : [business.services[0]];

    // If home service, ensure services are home-eligible
    if (modeParam === 'AT_HOME') {
      const homeEligible = list.filter((s) => s.homeServiceAvailable);
      if (homeEligible.length > 0) return homeEligible;
      // fallback to first home eligible service
      const firstHome = business.services.find((s) => s.homeServiceAvailable);
      return firstHome ? [firstHome] : [business.services[0]];
    }

    return list;
  }, [business.services, modeParam, serviceIdsParam]);

  const proIdParam = searchParams.get('proId');

  // Booking Flow States
  const [selectedServices, setSelectedServices] = useState<BeautyBranchService[]>(initialServices);
  const [selectedDate, setSelectedDate] = useState('2026-09-17'); // Tomorrow
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    modeParam === 'AT_HOME' ? '13:00' : '15:00'
  );
  const [paymentMethod, setPaymentMethod] = useState<'APPLE_PAY' | 'ONLINE' | 'CARD_AT_PROVIDER' | 'CASH'>('APPLE_PAY');
  const [customerNotes, setCustomerNotes] = useState('');

  // Location / Service Range Checker States (Crucial for Home Service)
  const [selectedDistrictName, setSelectedDistrictName] = useState('العليا');
  const [homeAddress, setHomeAddress] = useState('حي العليا، شارع العروبة، فيلا 24، الرياض');
  const [customDistanceKm, setCustomDistanceKm] = useState(3.2);
  const [locationChecking, setLocationChecking] = useState(false);
  const [gpsSimulated, setGpsSimulated] = useState(false);

  const maxServiceRangeKm = selectedBranch.maxHomeDeliveryKm || 25;
  const isDistanceWithinRange = customDistanceKm <= maxServiceRangeKm;

  // Per-service professional assignment: [serviceId]: professionalId | 'ANY'
  const [serviceProAssignments, setServiceProAssignments] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialServices.forEach((s) => {
      map[s.serviceId] = proIdParam || 'ANY';
    });
    return map;
  });

  // Dates for next 5 days
  const dateOptions = [
    { date: '2026-09-16', day: 'اليوم', dayName: 'الأربعاء' },
    { date: '2026-09-17', day: 'غداً', dayName: 'الخميس' },
    { date: '2026-09-18', day: '18 سبتمبر', dayName: 'الجمعة' },
    { date: '2026-09-19', day: '19 سبتمبر', dayName: 'السبت' },
    { date: '2026-09-20', day: '20 سبتمبر', dayName: 'الأحد' },
  ];

  // Salon Operating Time Slots
  const salonTimeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '21:15'];

  // Home Service Dispatch Slots (Includes transit buffer)
  const homeDispatchSlots = ['10:30', '13:00', '15:30', '18:00', '20:30'];

  const currentTimeSlots = serviceLocationMode === 'AT_HOME' ? homeDispatchSlots : salonTimeSlots;

  // Handle location mode toggle inside the booking screen
  const handleToggleMode = (mode: 'IN_BRANCH' | 'AT_HOME') => {
    if (mode === serviceLocationMode) return;
    setServiceLocationMode(mode);

    if (mode === 'AT_HOME') {
      // Filter out services that cannot be done at home
      const eligible = selectedServices.filter((s) => s.homeServiceAvailable);
      if (eligible.length > 0) {
        setSelectedServices(eligible);
      } else {
        const firstHome = business.services.find((s) => s.homeServiceAvailable);
        if (firstHome) setSelectedServices([firstHome]);
      }
      setSelectedTimeSlot('13:00');
    } else {
      setSelectedTimeSlot('15:00');
    }
  };

  // Quick select district for Home Service
  const handleSelectDistrict = (d: (typeof RIYADH_DISTRICTS)[0]) => {
    setSelectedDistrictName(d.name);
    setHomeAddress(d.address);
    setCustomDistanceKm(d.distance);
    setGpsSimulated(false);
  };

  // Simulate GPS detection
  const handleSimulateGps = () => {
    setLocationChecking(true);
    setTimeout(() => {
      setSelectedDistrictName('العليا (موقعي الحالي GPS)');
      setHomeAddress('شارع الأمير سلطان بن عبدالعزيز، حي العليا، الرياض');
      setCustomDistanceKm(2.4);
      setGpsSimulated(true);
      setLocationChecking(false);
    }, 600);
  };

  // Add / Remove service in booking
  const handleToggleService = (srv: BeautyBranchService) => {
    if (selectedServices.some((s) => s.serviceId === srv.serviceId)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((s) => s.serviceId !== srv.serviceId));
    } else {
      setSelectedServices([...selectedServices, srv]);
      setServiceProAssignments((prev) => ({ ...prev, [srv.serviceId]: 'ANY' }));
    }
  };

  // Assign professional for a service
  const handleAssignPro = (serviceId: string, proId: string) => {
    setServiceProAssignments((prev) => ({
      ...prev,
      [serviceId]: proId,
    }));
  };

  // Check if a professional is on shift during the selected slot
  const isProfessionalOnShift = (pro: BeautyProfessional, slot: string): boolean => {
    const [hourStr] = slot.split(':');
    const slotHour = parseInt(hourStr, 10);
    const start = pro.shiftStartHour ?? 10;
    const end = pro.shiftEndHour ?? 22;
    return slotHour >= start && slotHour < end;
  };

  // Filtered available professionals for a service based on working hours and mode
  const getAvailableProfessionalsForService = (srv: BeautyBranchService) => {
    return business.professionals.filter((pro) => {
      // If home service, must be enabled for home service
      if (serviceLocationMode === 'AT_HOME' && !pro.homeServiceAvailable) {
        return false;
      }
      return true;
    });
  };

  // Availability Engine & Timeline Calculation (US-045, US-053, US-054)
  const timelineBreakdown = useMemo(() => {
    let currentStartMinutes = 15 * 60;
    const [h, m] = selectedTimeSlot.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) {
      currentStartMinutes = h * 60 + m;
    }

    const assignedPros = selectedServices.map((s) => serviceProAssignments[s.serviceId] || 'ANY');
    const allSamePro = assignedPros.length > 1 && assignedPros.every((p) => p !== 'ANY' && p === assignedPros[0]);

    let maxEndMinutes = currentStartMinutes;
    let runningMinutes = currentStartMinutes;

    const items = selectedServices.map((srv) => {
      const proId = serviceProAssignments[srv.serviceId] || 'ANY';
      const proObj = business.professionals.find((p) => p.id === proId);
      const proName = proId === 'ANY' ? 'أي أخصائي متاح (تعيين الصالون)' : proObj?.name || 'الأخصائي المحدد';

      let start = runningMinutes;
      let end = runningMinutes + srv.durationMin;

      if (!allSamePro && assignedPros.filter((p) => p === proId).length <= 1) {
        // Concurrent execution
        start = currentStartMinutes;
        end = currentStartMinutes + srv.durationMin;
      } else {
        // Sequential execution
        runningMinutes = end;
      }

      if (end > maxEndMinutes) maxEndMinutes = end;

      const formatTime = (minutes: number) => {
        const hh = Math.floor(minutes / 60);
        const mm = minutes % 60;
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
      };

      const price = serviceLocationMode === 'AT_HOME' && srv.homePrice ? srv.homePrice : srv.price;

      return {
        serviceId: srv.serviceId,
        serviceName: srv.name,
        durationMin: srv.durationMin,
        proId,
        proName,
        price,
        formattedStart: formatTime(start),
        formattedEnd: formatTime(end),
      };
    });

    const formatOverallTime = (minutes: number) => {
      const hh = Math.floor(minutes / 60);
      const mm = minutes % 60;
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    return {
      items,
      overallStart: formatOverallTime(currentStartMinutes),
      overallEnd: formatOverallTime(maxEndMinutes),
      totalDurationMin: maxEndMinutes - currentStartMinutes,
      isConcurrent: !allSamePro && selectedServices.length > 1,
    };
  }, [selectedServices, serviceProAssignments, selectedTimeSlot, serviceLocationMode, business.professionals]);

  // Pricing calculations
  const subtotal = timelineBreakdown.items.reduce((sum, it) => sum + it.price, 0);

  // Transportation fee: prominent itemized fee ONLY if Home Service
  const transportationFee = serviceLocationMode === 'AT_HOME' ? (selectedBranch.homeDeliveryBaseFee || 40) : 0;
  const tax = (subtotal + transportationFee) * 0.15;
  const totalAmount = subtotal + transportationFee + tax;

  // Confirmation mode (US-055, US-056, US-057)
  const requiresManualConfirmation = selectedServices.some((s) => s.confirmationMode === 'MANUAL');

  // Submit Booking
  const handleConfirmBooking = () => {
    if (serviceLocationMode === 'AT_HOME' && !isDistanceWithinRange) {
      alert('الموقع المحدد يقع خارج نطاق خدمة الصالون (الحد الأقصى 25 كم). يرجى تعديل العنوان للاستمرار.');
      return;
    }

    const bookingId = `BK-BEAUTY-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BeautyBooking = {
      id: bookingId,
      businessId: business.id,
      businessName: business.name,
      businessLogo: business.logoUrl,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name,
      branchAddress: selectedBranch.address,
      mode: serviceLocationMode,
      homeAddress: serviceLocationMode === 'AT_HOME' ? homeAddress : undefined,
      date: selectedDate,
      overallStartTime: timelineBreakdown.overallStart,
      overallEndTime: timelineBreakdown.overallEnd,
      totalDurationMin: timelineBreakdown.totalDurationMin,
      items: timelineBreakdown.items.map((it, idx) => ({
        id: `item-${idx + 1}`,
        serviceId: it.serviceId,
        serviceName: it.serviceName,
        professionalId: it.proId,
        professionalName: it.proName,
        price: it.price,
        durationMin: it.durationMin,
        startTime: it.formattedStart,
        endTime: it.formattedEnd,
        status: it.proId === 'ANY' ? 'ASSIGNED' : 'SCHEDULED',
      })),
      subtotal,
      homeServiceFee: transportationFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'PENDING',
      confirmationMode: requiresManualConfirmation ? 'MANUAL' : 'AUTOMATIC',
      status: requiresManualConfirmation ? 'PENDING_CONFIRMATION' : 'CONFIRMED',
      confirmationDeadline: requiresManualConfirmation ? 'مهلة 25% (حوالي 45 دقيقة)' : undefined,
      gracePeriodMins: business.gracePeriodMins,
      createdAt: new Date().toISOString(),
      customerName: 'سارة ويليامز',
      customerPhone: '+966 50 123 4567',
      notes: customerNotes,
    };

    mockBeautyBookings.unshift(newBooking);
    navigate(`/activity/beauty/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-36" dir="rtl">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB]"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-gray-900 leading-tight">
              {serviceLocationMode === 'AT_HOME' ? 'حجز خدمة منزلية' : 'حجز موعد بالصالون'}
            </h1>
            <p className="text-[11px] text-gray-500">{business.name} • {selectedBranch.name}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1] px-2 py-0.5 rounded-full">
          {serviceLocationMode === 'AT_HOME' ? 'خدمة منزلية معتمدة' : 'حجز فوري بالصالون'}
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {/* Top Location Mode Switcher */}
        <div className="bg-white rounded-[14px] p-3 border border-[#C2D1E8]/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-900">نوع الحجز والموقع:</span>
            <span className="text-[11px] text-[#2952AB] font-bold">
              {serviceLocationMode === 'IN_BRANCH' ? 'في الصالون' : 'خدمة منزلية'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#F2F5FB] p-1 rounded-[12px] border border-[#C2D1E8]/40">
            <button
              type="button"
              onClick={() => handleToggleMode('IN_BRANCH')}
              className={`py-2 px-3 rounded-[9px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                serviceLocationMode === 'IN_BRANCH'
                  ? 'bg-[#2952AB] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store size={15} />
              <span>في الصالون</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleMode('AT_HOME')}
              className={`py-2 px-3 rounded-[9px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                serviceLocationMode === 'AT_HOME'
                  ? 'bg-[#2952AB] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HomeIcon size={15} />
              <span>خدمة منزلية (Home)</span>
            </button>
          </div>

          {/* Interactive Steps Roadmap Badge */}
          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span className="text-gray-700 font-bold">خطوات الحجز:</span>
            {serviceLocationMode === 'IN_BRANCH' ? (
              <span>1. الخدمات ← 2. الوقت ← 3. الأخصائي ← 4. الدفع</span>
            ) : (
              <span>1. نطاق الموقع ← 2. وقت الانتقال ← 3. الخدمات والأخصائي ← 4. النقل والدفع</span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ===================== FLOW A: SALON (في الصالون) ========================= */}
        {/* ========================================================================= */}
        {serviceLocationMode === 'IN_BRANCH' && (
          <>
            {/* STEP 1: Services Selection (Salons begin with selecting services) */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">الخدمات المحددة في الصالون</h3>
                </div>
                <span className="text-[11px] text-[#2952AB] font-bold">
                  {selectedServices.length} خدمات
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedServices.map((srv) => (
                  <div
                    key={srv.serviceId}
                    className="p-3 bg-[#F2F5FB]/40 rounded-[10px] border border-[#C2D1E8]/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{srv.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#2952AB]" />
                          {srv.durationMin} دقيقة
                        </span>
                        <span>•</span>
                        <span className="text-gray-600">سعر الصالون</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-[#2952AB]">{srv.price} ر.س</span>
                      {selectedServices.length > 1 && (
                        <button
                          onClick={() => handleToggleService(srv)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-all"
                          title="حذف الخدمة"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add more salon services */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">أضف خدمة أخرى للصالون:</span>
                <div className="flex flex-wrap gap-1.5">
                  {business.services
                    .filter((s) => !selectedServices.some((sel) => sel.serviceId === s.serviceId))
                    .map((srv) => (
                      <button
                        key={srv.serviceId}
                        onClick={() => handleToggleService(srv)}
                        className="text-[11px] bg-white text-gray-700 border border-[#C2D1E8]/60 px-2.5 py-1 rounded-full hover:border-[#2952AB] hover:text-[#2952AB] flex items-center gap-1 transition-all"
                      >
                        <Plus size={12} />
                        <span>{srv.name} (+{srv.price} ر.س)</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* STEP 2: Date and Time Selection */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">تحديد اليوم والوقت بالصالون</h3>
                </div>
                <span className="text-[10px] text-gray-500">ساعات عمل الفرع</span>
              </div>

              {/* Date Picker */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.date}
                    onClick={() => setSelectedDate(opt.date)}
                    className={`flex-1 min-w-[70px] p-2.5 rounded-[10px] border text-center transition-all ${
                      selectedDate === opt.date
                        ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{opt.dayName}</span>
                    <span className="text-xs font-bold block mt-0.5">{opt.day}</span>
                  </button>
                ))}
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="text-[11px] text-gray-500 block mb-2 font-medium">
                  اختر وقت الحضور للصالون ({selectedTimeSlot}):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {salonTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-[8px] text-xs font-bold border transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-[#C69815] text-white border-[#C69815] shadow-sm'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-[#FEFBF3]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: Staff Selection (Filtered based on working hours for the chosen slot) */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">اختيار الأخصائي وفق ساعات العمل</h3>
                </div>
                <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded border border-green-200">
                  مفلتر حسب وقت: {selectedTimeSlot}
                </span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                قائمة الأخصائيين مفلترة تلقائياً بناءً على جداول الورديات وساعات عملهم في الموعد المحدد ({selectedTimeSlot}).
              </p>

              <div className="space-y-3.5">
                {selectedServices.map((srv) => {
                  const currentProId = serviceProAssignments[srv.serviceId] || 'ANY';
                  const availablePros = getAvailableProfessionalsForService(srv);

                  return (
                    <div key={srv.serviceId} className="p-3 bg-[#F2F5FB]/50 rounded-[10px] border border-[#C2D1E8]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{srv.name}</span>
                        <span className="text-[10px] text-gray-500">{srv.durationMin} دقيقة</span>
                      </div>

                      <select
                        value={currentProId}
                        onChange={(e) => handleAssignPro(srv.serviceId, e.target.value)}
                        className="w-full bg-white border border-[#C2D1E8] p-2.5 rounded-[8px] text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#2952AB]"
                      >
                        <option value="ANY">⭐ أي أخصائي متاح (تعيين تلقائي من إدارة الصالون)</option>
                        {availablePros.map((pro) => {
                          const onShift = isProfessionalOnShift(pro, selectedTimeSlot);
                          return (
                            <option key={pro.id} value={pro.id}>
                              {onShift ? '✓ [متاح الآن] ' : '⏰ [خارج ساعات العمل] '}
                              {pro.name} ({pro.title} • {pro.workingHoursDisplay || 'دوام كامل'})
                            </option>
                          );
                        })}
                      </select>

                      {/* Active Pro Shift Details Pill */}
                      {currentProId !== 'ANY' && (() => {
                        const proObj = business.professionals.find((p) => p.id === currentProId);
                        if (!proObj) return null;
                        const onShift = isProfessionalOnShift(proObj, selectedTimeSlot);

                        return (
                          <div
                            className={`p-2 rounded-[8px] text-[11px] flex items-center justify-between ${
                              onShift
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {onShift ? <CheckCircle size={13} className="text-green-600" /> : <Clock size={13} className="text-amber-600" />}
                              <span>
                                {proObj.name} ({proObj.title})
                              </span>
                            </div>
                            <span className="font-bold">
                              {onShift ? `متاح في ${selectedTimeSlot} ✓` : `الدوام: ${proObj.workingHoursDisplay}`}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* ================== FLOW B: HOME SERVICE (خدمة منزلية) =================== */}
        {/* ========================================================================= */}
        {serviceLocationMode === 'AT_HOME' && (
          <>
            {/* STEP 1: Specify Location & Range Checker */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">تحديد موقعك ونطاق الخدمة</h3>
                </div>
                <span className="text-[10px] text-gray-500">نطاق التغطية: حتى {maxServiceRangeKm} كم</span>
              </div>

              <p className="text-[11px] text-gray-600 leading-relaxed">
                حدد موقعك للتحقق من وقوعه ضمن نطاق خدمة فرع {selectedBranch.name} قبل إتمام حجز انتقال الطاقم.
              </p>

              {/* Quick District Picker */}
              <div>
                <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">أحياء الرياض السريعة:</span>
                <div className="flex flex-wrap gap-1.5">
                  {RIYADH_DISTRICTS.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => handleSelectDistrict(d)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        selectedDistrictName === d.name
                          ? 'bg-[#2952AB] text-white border-[#2952AB] font-bold shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {d.name} ({d.distance} كم)
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Input & GPS */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-700 font-bold block">العنوان بالتفصيل:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    className="flex-1 bg-white border border-[#C2D1E8] p-2.5 rounded-[8px] text-xs text-gray-800"
                    placeholder="أدخل الحي، اسم الشارع، رقم الفيلا أو الشقة..."
                  />
                  <button
                    onClick={handleSimulateGps}
                    disabled={locationChecking}
                    className="px-3 bg-[#F2F5FB] border border-[#C2D1E8] rounded-[8px] text-[#2952AB] text-xs font-bold flex items-center gap-1 hover:bg-[#E4ECF9] transition-all whitespace-nowrap"
                  >
                    <Navigation size={13} className={locationChecking ? 'animate-spin' : ''} />
                    <span>GPS</span>
                  </button>
                </div>
              </div>

              {/* Distance & Range Verification Status Card */}
              <div
                className={`p-3 rounded-[10px] border text-xs space-y-1.5 transition-all ${
                  isDistanceWithinRange
                    ? 'bg-green-50/80 border-green-200 text-green-900'
                    : 'bg-red-50/80 border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    {isDistanceWithinRange ? (
                      <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-600" />
                    )}
                    <span>
                      {isDistanceWithinRange
                        ? 'ضمن نطاق التغطية المعتمد لانتقال الفريق ✓'
                        : 'خارج نطاق التغطية للخدمة المنزلية'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono">
                    المسافة: {customDistanceKm.toFixed(1)} كم
                  </span>
                </div>

                <p className="text-[11px] opacity-90 leading-relaxed">
                  {isDistanceWithinRange
                    ? `موقعك يبعد ${customDistanceKm.toFixed(1)} كم عن فرع ${selectedBranch.name}. رسوم النقل والتوصيل (40 ر.س) تُعرض في مرحلة الدفع.`
                    : `المسافة (${customDistanceKm.toFixed(1)} كم) تتجاوز الحد الأقصى لنطاق التوصيل (${maxServiceRangeKm} كم). يرجى اختيار فرع أقرب أو تعديل العنوان.`}
                </p>
              </div>
            </div>

            {/* STEP 2: Date and Time Selection for Home Service */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">مواعيد الخدمة المنزلية المتوفرة</h3>
                </div>
                <span className="text-[10px] bg-blue-50 text-[#2952AB] font-bold px-2 py-0.5 rounded">
                  تشمل مهلة الانتقال
                </span>
              </div>

              {/* Date Picker */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {dateOptions.map((opt) => (
                  <button
                    key={opt.date}
                    onClick={() => setSelectedDate(opt.date)}
                    className={`flex-1 min-w-[70px] p-2.5 rounded-[10px] border text-center transition-all ${
                      selectedDate === opt.date
                        ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                    }`}
                  >
                    <span className="text-[10px] block opacity-80">{opt.dayName}</span>
                    <span className="text-xs font-bold block mt-0.5">{opt.day}</span>
                  </button>
                ))}
              </div>

              {/* Home Dispatch Slots */}
              <div>
                <label className="text-[11px] text-gray-500 block mb-2 font-medium">
                  اختر وقت وصول الفريق لمنزلك ({selectedTimeSlot}):
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {homeDispatchSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 rounded-[8px] text-xs font-bold border transition-all ${
                        selectedTimeSlot === slot
                          ? 'bg-[#C69815] text-white border-[#C69815] shadow-sm'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-[#FEFBF3]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: Select Required Services & Staff for Home Service */}
            <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-bold text-xs text-gray-900">الخدمات والأخصائيين للخدمة المنزلية</h3>
                </div>
                <span className="text-[10px] bg-[#FEF8E7] text-[#8A680F] font-bold px-2 py-0.5 rounded border border-[#FAEFC1]">
                  أسعار الخدمة المنزلية
                </span>
              </div>

              <div className="space-y-3">
                {selectedServices.map((srv) => {
                  const currentProId = serviceProAssignments[srv.serviceId] || 'ANY';
                  const availablePros = getAvailableProfessionalsForService(srv);
                  const price = srv.homePrice || srv.price;

                  return (
                    <div key={srv.serviceId} className="p-3 bg-[#FEFBF3]/40 rounded-[10px] border border-[#FAEFC1] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-gray-900">{srv.name}</h4>
                          <span className="text-[10px] text-gray-500">المدة: {srv.durationMin} دقيقة</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-xs text-[#2952AB]">{price} ر.س</span>
                          <span className="text-[9px] text-gray-400 block">سعر المنزل</span>
                        </div>
                      </div>

                      {/* Select Staff for Home Service */}
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1 font-medium">
                          الخبير المطلوب للانتقال معك:
                        </label>
                        <select
                          value={currentProId}
                          onChange={(e) => handleAssignPro(srv.serviceId, e.target.value)}
                          className="w-full bg-white border border-[#C2D1E8] p-2 rounded-[8px] text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#2952AB]"
                        >
                          <option value="ANY">⭐ أي خبيرة متاحة للخدمة المنزلية (تعيين الصالون)</option>
                          {availablePros.map((pro) => {
                            const onShift = isProfessionalOnShift(pro, selectedTimeSlot);
                            return (
                              <option key={pro.id} value={pro.id}>
                                {onShift ? '✓ [متاح بالموعد] ' : '⏰ [خارج ساعات العمل] '}
                                {pro.name} ({pro.title} • {pro.workingHoursDisplay || 'دوام كامل'})
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Add more home-eligible services */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">
                  أضف خدمة منزلية أخرى لموعدك:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {business.services
                    .filter((s) => s.homeServiceAvailable && !selectedServices.some((sel) => sel.serviceId === s.serviceId))
                    .map((srv) => (
                      <button
                        key={srv.serviceId}
                        onClick={() => handleToggleService(srv)}
                        className="text-[11px] bg-white text-gray-700 border border-[#C2D1E8]/60 px-2.5 py-1 rounded-full hover:border-[#2952AB] hover:text-[#2952AB] flex items-center gap-1 transition-all"
                      >
                        <Plus size={12} />
                        <span>{srv.name} (+{srv.homePrice || srv.price} ر.س)</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================================= */}
        {/* =============== COMMON STEP 4: TIMELINE, PAYMENT & SUMMARY ============== */}
        {/* ========================================================================= */}
        {/* Calculated Timeline Sequencing */}
        <div className="bg-gradient-to-br from-[#FEFBF3] to-white rounded-[14px] p-4 border border-[#C69815]/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#C69815]" />
              <h3 className="font-bold text-xs text-gray-900">الجدول الزمني المحسوب لخدماتك</h3>
            </div>
            <span className="text-[10px] bg-[#C69815]/15 text-[#8A680F] px-2 py-0.5 rounded-full font-bold">
              {timelineBreakdown.isConcurrent ? 'تنفيذ متزامن ذكي' : 'تنفيذ متتابع'}
            </span>
          </div>

          <div className="space-y-2 border-r-2 border-[#C69815] pr-3 mr-1">
            {timelineBreakdown.items.map((it) => (
              <div key={it.serviceId} className="relative">
                <span className="absolute -right-[17px] top-1.5 w-2 h-2 rounded-full bg-[#C69815]" />
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{it.serviceName}</span>
                    <span className="text-[10px] text-gray-500 block">مع: {it.proName}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2952AB]">
                    {it.formattedStart} - {it.formattedEnd}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-gray-800">
            <span>إجمالي وقت الحجز:</span>
            <span className="text-[#2952AB]">
              {timelineBreakdown.overallStart} إلى {timelineBreakdown.overallEnd} ({timelineBreakdown.totalDurationMin} دقيقة)
            </span>
          </div>
        </div>

        {/* Confirmation Mode Notice (US-055, US-056, US-057) */}
        <div className="bg-white rounded-[14px] p-3.5 border border-[#C2D1E8]/40 shadow-sm text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-gray-900">
            <ShieldCheck size={16} className="text-green-600" />
            <span>نوع التأكيد ومهلة الرد</span>
          </div>
          {requiresManualConfirmation ? (
            <p className="text-gray-600 leading-relaxed text-[11px]">
              تتطلب بعض الخدمات مراجعة مقدم الخدمة. سيتم تطبيق <strong>قاعدة مهلة الـ 25%</strong> بحيث يلتزم الصالون بقبول الطلب قبل انتهاء الربع الأول من المدة المتبقية، وإلا يتم الإلغاء تلقائياً لحفظ وقتك.
            </p>
          ) : (
            <p className="text-green-700 leading-relaxed text-[11px]">
              تأكيد فوري ومباشر مع الصالون بمجرد الضغط على تأكيد الحجز.
            </p>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-xs text-gray-900">طريقة الدفع ومرحلة التأكيد</h3>
            </div>
            <span className="text-[10px] text-[#A88012] bg-[#FEF8E7] px-2 py-0.5 rounded font-bold">
              الدفع بعد اكتمال الخدمة فقط
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'APPLE_PAY', label: 'Apple Pay' },
              { id: 'ONLINE', label: 'بطاقة مدى / ائتمان' },
              { id: 'CARD_AT_PROVIDER', label: serviceLocationMode === 'AT_HOME' ? 'جهاز POS مع الخبير' : 'شبكة بالصالون (POS)' },
              { id: 'CASH', label: 'نقداً عند الخدمة' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-2.5 rounded-[10px] border text-right transition-all flex items-center justify-between ${
                  paymentMethod === method.id
                    ? 'border-[#2952AB] bg-[#F2F5FB] font-bold text-[#2952AB]'
                    : 'border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-xs">{method.label}</span>
                {paymentMethod === method.id && <CheckCircle2 size={16} className="text-[#2952AB]" />}
              </button>
            ))}
          </div>

          {/* Guarantee Box (US-105) */}
          <div className="p-2.5 bg-[#FEFBF3] border border-[#FAEFC1] rounded-[8px] flex items-start gap-2 text-[11px] text-[#6C510C]">
            <Info size={14} className="text-[#C69815] flex-shrink-0 mt-0.5" />
            <span>
              <strong>ضمان ZeTime:</strong> لن يتم خصم أو احتجاز أي مبلغ الآن. الدفع الفعلي يتم بعد انتهائك من تلقي الخدمة ورضاك عنها.
            </span>
          </div>
        </div>

        {/* Transportation Fee Callout Card for Home Service */}
        {serviceLocationMode === 'AT_HOME' && (
          <div className="bg-gradient-to-r from-[#F2F5FB] to-white rounded-[14px] p-3.5 border border-[#2952AB]/30 shadow-xs text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2952AB]/10 flex items-center justify-center text-[#2952AB]">
                  <Car size={15} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">رسوم النقل والتوصيل للخدمة المنزلية</span>
                  <span className="text-[10px] text-gray-500">تغطية الانتقال ومعدات التعقيم المحمولة</span>
                </div>
              </div>
              <span className="font-extrabold text-[#2952AB] text-sm">{transportationFee.toFixed(2)} ر.س</span>
            </div>
          </div>
        )}

        {/* Summary of Price Breakdown */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm text-xs space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>
              {serviceLocationMode === 'AT_HOME' ? 'مجموع الخدمات المنزلية:' : 'مجموع خدمات الصالون:'}
            </span>
            <span>{subtotal.toFixed(2)} ر.س</span>
          </div>

          {/* Display Transportation Fee conditionally based on mode */}
          {serviceLocationMode === 'AT_HOME' ? (
            <div className="flex justify-between text-gray-700 font-medium bg-[#F2F5FB] p-1.5 rounded">
              <span className="flex items-center gap-1">
                <Car size={12} className="text-[#2952AB]" />
                <span>رسوم النقل والتوصيل (خدمة منزلية):</span>
              </span>
              <span className="font-bold text-[#2952AB]">{transportationFee.toFixed(2)} ر.س</span>
            </div>
          ) : (
            <div className="flex justify-between text-gray-500">
              <span>رسوم النقل والتوصيل:</span>
              <span className="text-green-600 font-bold">مجاناً (تقديم داخل الصالون)</span>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span>ضريبة القيمة المضافة (15%):</span>
            <span>{tax.toFixed(2)} ر.س</span>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between font-extrabold text-sm text-gray-900">
            <span>المبلغ الإجمالي المستحق:</span>
            <span className="text-[#2952AB] text-base">{totalAmount.toFixed(2)} ر.س</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#C2D1E8]/40 p-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-500 block">
              {serviceLocationMode === 'AT_HOME' ? 'إجمالي المنزل شامل النقل' : 'الإجمالي بالصالون'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#2952AB]">{totalAmount.toFixed(2)}</span>
              <span className="text-xs text-gray-600">ر.س</span>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            className="flex-1 py-3.5 px-5 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-[10px] text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-center"
          >
            تأكيد حجز الموعد الآن &larr;
          </button>
        </div>
      </div>
    </div>
  );
}
