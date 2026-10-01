import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Home as HomeIcon,
  Store,
  Sparkles,
  Scissors,
  Check,
  Plus,
  Trash2,
  Users,
  MessageCircle,
  Share2,
  Heart,
  Zap,
  Info,
  ChevronDown,
  Building,
  AlertCircle,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { beautyBusinesses, BeautyBranchService, BeautyBranch } from '../../data/beauty-mock-data';

export function BeautyBusinessDetail() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const business = beautyBusinesses.find((b) => b.id === businessId) || beautyBusinesses[0];

  // Selected Branch state (default to nearest branch - US-010)
  const defaultBranch = business.branches.find((b) => b.isNearest) || business.branches[0];
  const [selectedBranch, setSelectedBranch] = useState<BeautyBranch>(defaultBranch);
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'services' | 'team' | 'reviews' | 'about'>('services');

  // Initial Location Selection Mode from URL or default (IN_BRANCH vs AT_HOME)
  const queryMode = searchParams.get('mode');
  const [locationMode, setLocationMode] = useState<'IN_BRANCH' | 'AT_HOME'>(
    queryMode === 'AT_HOME' ? 'AT_HOME' : 'IN_BRANCH'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [locationNotice, setLocationNotice] = useState<string | null>(null);

  // ============================================
  // Date & Time for IN-SALON (Mandatory step before services)
  // ============================================
  const queryDate = searchParams.get('date');
  const queryTime = searchParams.get('time');

  const salonDateOptions = [
    { date: '2026-09-16', day: 'اليوم', dayName: 'الأربعاء' },
    { date: '2026-09-17', day: 'غداً', dayName: 'الخميس' },
    { date: '2026-09-18', day: '18 سبتمبر', dayName: 'الجمعة' },
    { date: '2026-09-19', day: '19 سبتمبر', dayName: 'السبت' },
    { date: '2026-09-20', day: '20 سبتمبر', dayName: 'الأحد' },
  ];
  const inSalonTimeSlots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '21:15'];

  const [inSalonSelectedDate, setInSalonSelectedDate] = useState(queryDate || '2026-09-17');
  const [inSalonSelectedTimeSlot, setInSalonSelectedTimeSlot] = useState(queryTime || '14:30');
  const [inSalonDateTimeConfirmed, setInSalonDateTimeConfirmed] = useState(true);

  // ============================================
  // AT-HOME Flow: 1- Specify Location First & Zone Check
  // 2- Date and Time Selection (only if in zone)
  // 3- Choice of Services
  // ============================================
  const HOME_SERVICE_DISTRICTS = [
    { name: 'العليا', distance: 3.2, address: 'حي العليا، شارع العروبة، الرياض', inZone: true },
    { name: 'السليمانية', distance: 4.5, address: 'حي السليمانية، شارع التحلية، الرياض', inZone: true },
    { name: 'النخيل', distance: 6.8, address: 'حي النخيل، طريق الإمام سعود، الرياض', inZone: true },
    { name: 'الملقا', distance: 8.8, address: 'حي الملقا، طريق أنس بن مالك، الرياض', inZone: true },
    { name: 'حطين', distance: 9.5, address: 'حي حطين، بالقرب من البوليفارد، الرياض', inZone: true },
    { name: 'الياسمين', distance: 11.2, address: 'حي الياسمين، طريق الملك عبدالعزيز، الرياض', inZone: true },
    { name: 'الصحافة', distance: 13.0, address: 'حي الصحافة، طريق التخصصي، الرياض', inZone: true },
    { name: 'الرمال (خارج النطاق)', distance: 36.5, address: 'حي الرمال، الرياض (يبعد 36.5 كم)', inZone: false },
    { name: 'المزاحمية (خارج النطاق)', distance: 48.0, address: 'محافظة المزاحمية (يبعد 48 كم)', inZone: false },
  ];

  const queryDistrict = searchParams.get('district');
  const queryAddress = searchParams.get('address');
  const queryDistance = searchParams.get('distance');

  const [homeDistrict, setHomeDistrict] = useState(queryDistrict || 'العليا');
  const [homeAddress, setHomeAddress] = useState(queryAddress || 'حي العليا، شارع العروبة، فيلا 24، الرياض');
  const [homeDistanceKm, setHomeDistanceKm] = useState(queryDistance ? parseFloat(queryDistance) : 3.2);
  const [isLocatingGps, setIsLocatingGps] = useState(false);

  const maxServiceZoneKm = selectedBranch.maxHomeDeliveryKm || 25;
  const isWithinServiceZone = homeDistanceKm <= maxServiceZoneKm;

  // Home Date & Time Selection (Step 2 - appears only if in zone)
  const homeDispatchSlots = ['10:30', '13:00', '15:30', '18:00', '20:30'];
  const [homeSelectedDate, setHomeSelectedDate] = useState(queryDate || '2026-09-17');
  const [homeSelectedTimeSlot, setHomeSelectedTimeSlot] = useState(queryTime || '13:00');

  // Check if a service is available at the selected date & time for Home Service
  const getHomeServiceSlotAvailability = (
    service: BeautyBranchService,
    slot: string
  ): { available: boolean; reason?: string } => {
    if (!service.homeServiceAvailable) {
      return { available: false, reason: 'تتطلب تجهيزات الفرع (متاحة بالصالون فقط)' };
    }

    const [hourStr] = slot.split(':');
    const slotHour = parseInt(hourStr, 10);

    // Filter home service professionals on shift during slot
    const homeProsOnShift = business.professionals.filter((pro) => {
      if (!pro.homeServiceAvailable) return false;
      const start = pro.shiftStartHour ?? 10;
      const end = pro.shiftEndHour ?? 20; // Home dispatch shifts end at 20:00
      return slotHour >= start && slotHour < end;
    });

    if (homeProsOnShift.length === 0) {
      return {
        available: false,
        reason: `طاقم الخدمة المنزلية غير متاح في الوقت المحدد (${slot}). اختر موعداً آخر.`,
      };
    }

    return { available: true };
  };

  // Multi-service selection cart (US-052)
  const [selectedServices, setSelectedServices] = useState<BeautyBranchService[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Category labels and icons dictionary
  const categoryMeta: Record<string, { name: string; icon: string }> = {
    'hair': { name: 'شعر وتسريحات', icon: '✂️' },
    'nails': { name: 'أظافر ومانيكير', icon: '💅' },
    'facial-skincare': { name: 'بشرة وعناية', icon: '💆‍♀️' },
    'makeup': { name: 'مكياج وسهرات', icon: '💄' },
    'spa-massage': { name: 'مساج وسبا', icon: '🌿' },
    'barber': { name: 'حلاقة رجالية', icon: '💈' },
  };

  // Switch location mode (Salon vs. Home)
  const handleLocationModeChange = (mode: 'IN_BRANCH' | 'AT_HOME') => {
    if (mode === locationMode) return;
    setLocationMode(mode);

    // If switching to home, ensure selected services are available for home at the chosen slot
    if (mode === 'AT_HOME') {
      const incompatibleServices = selectedServices.filter(
        (s) => !getHomeServiceSlotAvailability(s, homeSelectedTimeSlot).available
      );
      if (incompatibleServices.length > 0) {
        setSelectedServices(
          selectedServices.filter(
            (s) => getHomeServiceSlotAvailability(s, homeSelectedTimeSlot).available
          )
        );
        setLocationNotice(
          `يرجى تحديد وقت وتاريخ الخدمة أولاً. تمت إزالة ${incompatibleServices.length} خدمة غير متاحة منزلياً في هذا الوقت.`
        );
        setTimeout(() => setLocationNotice(null), 4000);
      } else {
        setLocationNotice('قم أولاً باختيار تاريخ ووقت الزيارة المنزلية قبل تحديد الخدمات.');
        setTimeout(() => setLocationNotice(null), 4000);
      }
    } else {
      setLocationNotice(null);
    }
  };

  // Handle Home Time Slot Change
  const handleHomeTimeSlotChange = (newSlot: string) => {
    setHomeSelectedTimeSlot(newSlot);
    if (locationMode === 'AT_HOME') {
      const incompatible = selectedServices.filter(
        (s) => !getHomeServiceSlotAvailability(s, newSlot).available
      );
      if (incompatible.length > 0) {
        setSelectedServices((prev) =>
          prev.filter((s) => getHomeServiceSlotAvailability(s, newSlot).available)
        );
        setLocationNotice(
          `تم تحديث الموعد إلى ${newSlot}. تمت إزالة ${incompatible.length} خدمة غير متوفرة في هذا الوقت.`
        );
        setTimeout(() => setLocationNotice(null), 4000);
      }
    }
  };

  // Toggle service selection
  const toggleService = (service: BeautyBranchService) => {
    // If in home mode, verify availability for chosen date & time
    if (locationMode === 'AT_HOME') {
      const avail = getHomeServiceSlotAvailability(service, homeSelectedTimeSlot);
      if (!avail.available) {
        setLocationNotice(`عذراً، خدمة "${service.name}" غير متاحة في الموعد المحدد: ${avail.reason}`);
        setTimeout(() => setLocationNotice(null), 4000);
        return;
      }
    }

    if (selectedServices.some((s) => s.serviceId === service.serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s.serviceId !== service.serviceId));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Computed Categories with counts based on active mode
  const availableCategories = useMemo(() => {
    const counts = new Map<string, number>();
    business.services.forEach((s) => {
      // In home mode, count only available home services for chosen slot
      if (locationMode === 'AT_HOME') {
        const avail = getHomeServiceSlotAvailability(s, homeSelectedTimeSlot);
        if (!avail.available) return;
      }
      counts.set(s.categoryId, (counts.get(s.categoryId) || 0) + 1);
    });

    const list = Array.from(counts.entries()).map(([catId, count]) => ({
      id: catId,
      name: categoryMeta[catId]?.name || catId,
      icon: categoryMeta[catId]?.icon || '✨',
      count,
    }));

    return list;
  }, [business.services, locationMode, homeSelectedTimeSlot]);

  // Filtered services based on Category & Location Mode
  const filteredServices = useMemo(() => {
    return business.services.filter((s) => {
      const matchCategory = selectedCategory === 'ALL' || s.categoryId === selectedCategory;
      return matchCategory;
    });
  }, [business.services, selectedCategory]);

  // Simulate GPS detection for Home Service
  const handleSimulateHomeGps = () => {
    setIsLocatingGps(true);
    setTimeout(() => {
      setHomeDistrict('العليا (GPS)');
      setHomeAddress('شارع التحلية، حي العليا، الرياض');
      setHomeDistanceKm(2.4);
      setIsLocatingGps(false);
      setLocationNotice('تم تحديد موقعك بدقة عبر GPS (ضمن نطاق الصالون: 2.4 كم)');
      setTimeout(() => setLocationNotice(null), 3000);
    }, 600);
  };

  // Select Quick District for Home Service
  const handleSelectDistrict = (item: (typeof HOME_SERVICE_DISTRICTS)[0]) => {
    setHomeDistrict(item.name);
    setHomeAddress(item.address);
    setHomeDistanceKm(item.distance);
    if (!item.inZone) {
      setSelectedServices([]);
      setLocationNotice(`الموقع المحدد (${item.name}) يبعد ${item.distance} كم ويقع خارج نطاق تغطية الصالون.`);
      setTimeout(() => setLocationNotice(null), 4000);
    } else {
      setLocationNotice(`تم اعتماد الموقع: ${item.name} (${item.distance} كم) - ضمن نطاق التغطية.`);
      setTimeout(() => setLocationNotice(null), 3000);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => {
    const currentPrice = locationMode === 'AT_HOME' && s.homePrice ? s.homePrice : s.price;
    return sum + currentPrice;
  }, 0);

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMin, 0);

  const handleProceedToBooking = () => {
    if (selectedServices.length === 0) return;
    const serviceIds = selectedServices.map((s) => s.serviceId).join(',');
    const dateVal = locationMode === 'AT_HOME' ? homeSelectedDate : inSalonSelectedDate;
    const timeVal = locationMode === 'AT_HOME' ? homeSelectedTimeSlot : inSalonSelectedTimeSlot;
    const addressParam =
      locationMode === 'AT_HOME'
        ? `&address=${encodeURIComponent(homeAddress)}&district=${encodeURIComponent(homeDistrict)}&distance=${homeDistanceKm}`
        : '';
    navigate(
      `/beauty/book/${business.id}?branchId=${selectedBranch.id}&mode=${locationMode}&services=${serviceIds}&date=${dateVal}&time=${timeVal}${addressParam}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32" dir="rtl">
      {/* Sticky Header with Back, Title & Actions */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB] transition-all"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <span className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{business.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-gray-600 hover:text-red-500 shadow-sm transition-all"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: business.name, url: window.location.href }).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB] transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Cover Photos Carousel */}
        <div className="relative h-56 w-full">
          <img
            src={business.coverUrls[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Audience & Type Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-sm text-white">
              {business.audience === 'women' ? 'صالون نسائي' : business.audience === 'men' ? 'حلاقة رجالية' : 'مركز تجميل'}
            </span>
            {business.type === 'FREELANCER' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#C69815] text-white">
                خبير مستقل
              </span>
            )}
          </div>

          {/* Rating floating overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[10px] shadow">
            <Star size={16} className="fill-[#C69815] text-[#C69815]" />
            <span className="text-sm font-bold text-gray-900">{business.rating}</span>
            <span className="text-xs text-gray-500">({business.reviewsCount} تقييم موثق)</span>
          </div>
        </div>

        {/* Business Header Info */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-[#C2D1E8]/30">
          <div className="flex items-start gap-3.5">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-16 h-16 rounded-[12px] object-cover border-2 border-white shadow-md -mt-8 relative z-10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-gray-900 leading-snug">{business.name}</h1>
                {business.verified && <ShieldCheck size={18} className="text-[#2952AB] flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{business.description}</p>
            </div>
          </div>

          {/* Branch Selector Bar (US-010, US-011, US-024) */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">الفرع المحدد للخدمة:</span>
              <button
                onClick={() => setShowBranchModal(true)}
                className="text-[#2952AB] font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>تغيير الفرع ({business.branches.length})</span>
                <ChevronDown size={14} />
              </button>
            </div>

            <div
              onClick={() => setShowBranchModal(true)}
              className="flex items-center justify-between p-2.5 bg-[#F2F5FB] rounded-[10px] border border-[#C2D1E8]/40 cursor-pointer hover:border-[#2952AB]/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#2952AB]/10 flex items-center justify-center text-[#2952AB]">
                  <Building size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-900">{selectedBranch.name}</span>
                    {selectedBranch.isNearest && (
                      <span className="text-[10px] bg-[#C69815] text-white px-1.5 py-0.2 rounded font-bold">
                        الأقرب لك
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block truncate max-w-[240px]">
                    {selectedBranch.address} • {selectedBranch.distanceKm} كم
                  </span>
                </div>
              </div>
              <ChevronLeft size={16} className="text-[#7A9ACB] rotate-180" />
            </div>

            {/* Live Queue Banner for Selected Branch (US-088) */}
            {selectedBranch.queueActive && (
              <div className="mt-2.5 flex items-center justify-between p-2.5 bg-gradient-to-r from-[#FEF8E7] to-white rounded-[10px] border border-[#C69815]/30 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C69815] animate-ping" />
                  <span className="font-bold text-[#8A680F]">
                    طابور الحضور السريع متاح الآن ({selectedBranch.currentQueueCount} في الانتظار)
                  </span>
                </div>
                <Link
                  to={`/beauty/queue/${business.id}`}
                  className="px-2.5 py-1 bg-[#C69815] text-white rounded-[6px] text-[11px] font-bold shadow-sm"
                >
                  انضم للطابور
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C2D1E8]/30 bg-white sticky top-14 z-20">
          {[
            { id: 'services', label: 'الخدمات والأسعار' },
            { id: 'team', label: `فريق العمل (${business.professionals.length})` },
            { id: 'reviews', label: `التقييمات (${business.reviewsCount})` },
            { id: 'about', label: 'المعلومات والسياسات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2952AB] text-[#2952AB]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* TAB 1: Services List & Multi-select (US-038, US-052) */}
          {activeTab === 'services' && (
            <div className="space-y-3.5">
              {/* Step 0 / Initial Choice: Service Location Selector (Salon vs. Home) */}
              <div className="bg-white rounded-[16px] p-4 border border-[#C2D1E8]/60 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                      •
                    </span>
                    <h3 className="font-bold text-xs text-gray-900">اختر مكان تقديم الخدمة:</h3>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {locationMode === 'IN_BRANCH' ? 'أسعار الصالون' : 'خدمة منزلية معتمدة'}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 mb-2.5 leading-relaxed">
                  يرجى تحديد رغبتك، حيث تتبع كل تجربة خطوات حجز مخصصة بحسب نوع الخدمة والمكان.
                </p>

                {/* Segmented Location Buttons */}
                <div className="grid grid-cols-2 gap-2 bg-[#F2F5FB] p-1 rounded-[12px] border border-[#C2D1E8]/40">
                  <button
                    type="button"
                    onClick={() => handleLocationModeChange('IN_BRANCH')}
                    className={`py-2.5 px-3 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      locationMode === 'IN_BRANCH'
                        ? 'bg-[#2952AB] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Store size={16} />
                    <span>في الصالون (In-Salon)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLocationModeChange('AT_HOME')}
                    className={`py-2.5 px-3 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      locationMode === 'AT_HOME'
                        ? 'bg-[#2952AB] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <HomeIcon size={16} />
                    <span>في المنزل (At Home)</span>
                  </button>
                </div>

                {/* Location Mode Context Banner */}
                {locationMode === 'AT_HOME' ? (
                  <div className="mt-2.5 p-2.5 bg-[#FEFBF3] rounded-[9px] border border-[#FAEFC1] flex items-center justify-between text-[11px] text-[#8A680F]">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#C69815] flex-shrink-0" />
                      <span>تصلك خبيرات الصالون لمنزلك • يلزم التحقق من موقعك أولاً</span>
                    </div>
                    <span className="text-[10px] bg-[#C69815] text-white font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      نطاق {maxServiceZoneKm} كم
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 p-2.5 bg-[#F2F5FB] rounded-[9px] border border-[#C2D1E8]/40 flex items-center justify-between text-[11px] text-[#2952AB]">
                    <div className="flex items-center gap-1.5">
                      <Building size={14} className="text-[#2952AB] flex-shrink-0" />
                      <span>تقديم الخدمة داخل {selectedBranch.name} • يلزم اختيار الموعد أولاً</span>
                    </div>
                    <span className="text-[10px] bg-[#2952AB]/10 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      تأكيد مباشر
                    </span>
                  </div>
                )}
              </div>

              {/* Toast / Warning Notification */}
              {locationNotice && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[10px] text-xs text-amber-900 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
                  <span>{locationNotice}</span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FLOW A: IN-SALON (في الصالون) */}
              {/* Requirement: "If the customer selects 'In-Salon,' they must choose the date and time before selecting the required services." */}
              {/* ========================================================================= */}
              {locationMode === 'IN_BRANCH' && (
                <div className="bg-white rounded-[16px] p-4 border-2 border-[#2952AB]/30 shadow-md space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                        1
                      </span>
                      <div>
                        <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                          <span>اختر تاريخ ووقت الحجز أولاً</span>
                          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.2 rounded-full font-bold">
                            إلزامي قبل اختيار الخدمات
                          </span>
                        </h3>
                        <p className="text-[11px] text-gray-500">حدد موعدك للتحقق من الأوقات الشاغرة ومقاعد الصالون</p>
                      </div>
                    </div>
                    {inSalonDateTimeConfirmed && (
                      <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check size={12} />
                        <span>موعد محدد</span>
                      </span>
                    )}
                  </div>

                  {/* Date Selector */}
                  <div>
                    <label className="text-[11px] text-gray-700 font-bold block mb-1.5 flex items-center gap-1">
                      <Clock size={13} className="text-[#2952AB]" />
                      <span>اختر تاريخ الزيارة:</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {salonDateOptions.map((opt) => (
                        <button
                          key={opt.date}
                          type="button"
                          onClick={() => {
                            setInSalonSelectedDate(opt.date);
                            setInSalonDateTimeConfirmed(true);
                          }}
                          className={`p-2 rounded-[10px] border text-center transition-all ${
                            inSalonSelectedDate === opt.date
                              ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm font-bold'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                          }`}
                        >
                          <span className="text-[10px] block opacity-80">{opt.dayName}</span>
                          <span className="text-xs font-bold block mt-0.5">{opt.day}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots Selector */}
                  <div>
                    <label className="text-[11px] text-gray-700 font-bold block mb-1.5 flex items-center justify-between">
                      <span>اختر توقيت الحجز داخل الصالون:</span>
                      <span className="text-[#2952AB] font-bold font-mono text-[11px]">الوقت: {inSalonSelectedTimeSlot}</span>
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {inSalonTimeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setInSalonSelectedTimeSlot(slot);
                            setInSalonDateTimeConfirmed(true);
                          }}
                          className={`py-2 rounded-[8px] text-xs font-bold border transition-all ${
                            inSalonSelectedTimeSlot === slot
                              ? 'bg-[#C69815] text-white border-[#C69815] shadow-sm'
                              : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-[#FEFBF3]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirmed Banner */}
                  <div className="p-2.5 bg-[#F2F5FB] rounded-[10px] border border-[#C2D1E8]/50 flex items-center justify-between text-xs text-[#2952AB]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
                      <span>
                        الموعد المحدد: <strong>{salonDateOptions.find((d) => d.date === inSalonSelectedDate)?.day || inSalonSelectedDate}</strong> الساعة <strong>{inSalonSelectedTimeSlot}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                      تم التفعيل ✓
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* FLOW B: AT-HOME (في المنزل) */}
              {/* Requirement: "If the customer selects 'At Home,' they must specify the location first. Based on whether the location falls within the salon's service zone, the date and time selection option will appear, followed by the choice of services." */}
              {/* ========================================================================= */}
              {locationMode === 'AT_HOME' && (
                <div className="space-y-3.5">
                  {/* STEP 1: SPECIFY LOCATION FIRST & ZONE CHECK */}
                  <div className={`bg-white rounded-[16px] p-4 border-2 shadow-md space-y-3 transition-all ${
                    !isWithinServiceZone ? 'border-red-400 bg-red-50/15' : 'border-[#2952AB]/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                          1
                        </span>
                        <div>
                          <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                            <span>حدد موقعك أولاً للتحقق من نطاق التغطية</span>
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-bold">
                              خطوة إلزامية
                            </span>
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            يجب التأكد من وقوع موقعك ضمن نطاق خدمة الصالون (أقصى نطاق: {maxServiceZoneKm} كم)
                          </p>
                        </div>
                      </div>

                      {isWithinServiceZone ? (
                        <span className="text-[10px] bg-green-100 text-green-800 border border-green-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Check size={12} />
                          <span>ضمن النطاق ({homeDistanceKm} كم)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-red-100 text-red-700 border border-red-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>خارج النطاق ({homeDistanceKm} كم)</span>
                        </span>
                      )}
                    </div>

                    {/* Address Input & GPS Simulation */}
                    <div className="space-y-2">
                      <div className="relative">
                        <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={homeAddress}
                          onChange={(e) => setHomeAddress(e.target.value)}
                          placeholder="أدخل عنوان منزلك بالتفصيل..."
                          className="w-full bg-[#F2F5FB] border border-[#C2D1E8]/50 pr-9 pl-24 py-2.5 rounded-[10px] text-xs text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20"
                        />
                        <button
                          type="button"
                          onClick={handleSimulateHomeGps}
                          disabled={isLocatingGps}
                          className="absolute left-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#2952AB] hover:bg-[#1D3D7A] text-white rounded-[7px] text-[10px] font-bold flex items-center gap-1 transition-all shadow-xs"
                        >
                          <Navigation size={11} className={isLocatingGps ? 'animate-spin' : ''} />
                          <span>{isLocatingGps ? 'جارِ التحديد...' : 'تحديد GPS'}</span>
                        </button>
                      </div>

                      {/* Quick District selection buttons */}
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold block mb-1">
                          أو اختر حياً للتحقق السريع من النطاق:
                        </span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                          {HOME_SERVICE_DISTRICTS.map((item) => (
                            <button
                              key={item.name}
                              type="button"
                              onClick={() => handleSelectDistrict(item)}
                              className={`px-2.5 py-1 rounded-[8px] border whitespace-nowrap transition-all flex items-center gap-1 ${
                                homeDistrict === item.name
                                  ? item.inZone
                                    ? 'bg-[#2952AB] text-white border-[#2952AB] font-bold shadow-xs'
                                    : 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                                  : item.inZone
                                  ? 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/40'
                                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              <span>{item.name}</span>
                              <span className="text-[9px] opacity-80 font-mono">({item.distance} كم)</span>
                              {!item.inZone && (
                                <span className="text-[9px] font-bold text-white bg-red-800 px-1 rounded">خارج</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ZONE VALIDATION ALERT / RESULT */}
                    {!isWithinServiceZone ? (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] space-y-2 text-xs text-red-900 animate-fadeIn">
                        <div className="flex items-start gap-2">
                          <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold block text-red-950">الموقع خارج نطاق الخدمة المنزلية لهذا الصالون</strong>
                            <p className="text-[11px] text-red-800 mt-0.5 leading-relaxed">
                              يبعد موقعك الحالي (<strong>{homeDistanceKm} كم</strong>)، بينما الحد الأقصى لنطاق الخدمة المنزلية هو <strong>{maxServiceZoneKm} كم</strong>.
                              لا يمكن عرض المواعيد أو الخدمات المنزلية لهذا الموقع.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-red-200/60">
                          <button
                            type="button"
                            onClick={() => handleLocationModeChange('IN_BRANCH')}
                            className="flex-1 py-2 px-3 bg-[#2952AB] text-white rounded-[8px] text-[11px] font-bold text-center hover:bg-[#1D3D7A] transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Store size={13} />
                            <span>التحويل للحجز داخل الصالون بدلاً من ذلك</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectDistrict(HOME_SERVICE_DISTRICTS[0])}
                            className="py-2 px-3 bg-white border border-red-300 text-red-800 rounded-[8px] text-[11px] font-bold hover:bg-red-100 transition-all"
                          >
                            اختيار موقع داخل النطاق
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-green-50 border border-green-200 rounded-[10px] flex items-center justify-between text-xs text-green-900 animate-fadeIn">
                        <div className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                          <span>
                            الموقع معتمد: <strong>{homeDistrict}</strong> (يبعد {homeDistanceKm} كم) • رسوم التوصيل: {selectedBranch.homeDeliveryBaseFee || 40} ر.س
                          </span>
                        </div>
                        <span className="text-[10px] bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">
                          مشمول بالتغطية ✓
                        </span>
                      </div>
                    )}
                  </div>

                  {/* STEP 2: DATE AND TIME SELECTION (ONLY APPEARS BASED ON LOCATION FALLING WITHIN SERVICE ZONE) */}
                  {isWithinServiceZone ? (
                    <div className="bg-white rounded-[16px] p-4 border-2 border-[#2952AB]/30 shadow-md space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                            2
                          </span>
                          <div>
                            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                              <span>حدد موعد وصول فريق الصالون لمنزلك</span>
                              <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.2 rounded-full font-bold">
                                ظهر بعد تأكيد الموقع
                              </span>
                            </h3>
                            <p className="text-[11px] text-gray-500">اختر التاريخ والوقت المناسبين لحضور طاقم التجميل</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1] px-2 py-0.5 rounded font-bold">
                          جاهزية الفريق
                        </span>
                      </div>

                      {/* Date Selector */}
                      <div>
                        <label className="text-[11px] text-gray-700 font-bold block mb-1.5">اختر تاريخ الزيارة المنزلية:</label>
                        <div className="grid grid-cols-5 gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                          {salonDateOptions.map((opt) => (
                            <button
                              key={opt.date}
                              type="button"
                              onClick={() => setHomeSelectedDate(opt.date)}
                              className={`p-2 rounded-[10px] border text-center transition-all ${
                                homeSelectedDate === opt.date
                                  ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm font-bold'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                              }`}
                            >
                              <span className="text-[10px] block opacity-80">{opt.dayName}</span>
                              <span className="text-xs font-bold block mt-0.5">{opt.day}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slots Selector */}
                      <div>
                        <label className="text-[11px] text-gray-700 font-bold block mb-1.5 flex items-center justify-between">
                          <span>اختر وقت وصول الفريق لمنزلك:</span>
                          <span className="text-[#C69815] font-bold font-mono text-[11px]">الوقت: {homeSelectedTimeSlot}</span>
                        </label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {homeDispatchSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleHomeTimeSlotChange(slot)}
                              className={`py-2 rounded-[8px] text-xs font-bold border transition-all ${
                                homeSelectedTimeSlot === slot
                                  ? 'bg-[#C69815] text-white border-[#C69815] shadow-sm'
                                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-[#FEFBF3]'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-2 bg-[#FEFBF3] rounded-[9px] border border-[#FAEFC1] text-[11px] text-[#8A680F] flex items-center gap-1.5">
                        <Clock size={14} className="text-[#C69815] flex-shrink-0" />
                        <span>
                          تم اعتماد موعد الزيارة: <strong>{salonDateOptions.find((d) => d.date === homeSelectedDate)?.day || homeSelectedDate}</strong> الساعة <strong>{homeSelectedTimeSlot}</strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Locked placeholder if outside zone */
                    <div className="p-3 bg-gray-100/70 border border-dashed border-gray-300 rounded-[12px] text-center text-xs text-gray-500">
                      🔒 خيار تحديد التاريخ والوقت سيظهر فور تحديد موقع يقع ضمن نطاق خدمة الصالون.
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================================= */}
              {/* STEP: CHOICE OF SERVICES */}
              {/* For In-Salon: Appears as Step 2 after choosing date & time */}
              {/* For At-Home: Follows after location falls within zone and date/time is selected */}
              {/* ========================================================================= */}
              {locationMode === 'AT_HOME' && !isWithinServiceZone ? null : (
                <div className="space-y-3 pt-2">

              {/* Service Categories Display */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-[11px] font-bold flex items-center justify-center">
                      {locationMode === 'AT_HOME' ? 3 : 2}
                    </span>
                    <h4 className="font-bold text-xs text-gray-900">
                      {locationMode === 'AT_HOME' ? 'الخدمات المتاحة في الموعد المحدد:' : 'أقسام وتصنيفات الخدمات:'}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-500">
                    {filteredServices.length} خدمة متوفرة
                  </span>
                </div>

                {/* Category Horizontal Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      selectedCategory === 'ALL'
                        ? 'bg-[#2952AB] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-[#C2D1E8]/50 hover:bg-[#F2F5FB]'
                    }`}
                  >
                    <span>⭐ الكل</span>
                    <span className="text-[10px] opacity-80">({business.services.length})</span>
                  </button>

                  {availableCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-[#2952AB] text-white shadow-xs'
                          : 'bg-white text-gray-700 border border-[#C2D1E8]/50 hover:bg-[#F2F5FB]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-80">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Cards List */}
              <div className="space-y-2.5">
                {filteredServices.map((srv) => {
                  const isSelected = selectedServices.some((s) => s.serviceId === srv.serviceId);
                  const slotCheck =
                    locationMode === 'AT_HOME'
                      ? getHomeServiceSlotAvailability(srv, homeSelectedTimeSlot)
                      : { available: true };
                  const isUnavailable = !slotCheck.available;
                  const activePrice = locationMode === 'AT_HOME' && srv.homePrice ? srv.homePrice : srv.price;

                  return (
                    <div
                      key={srv.serviceId}
                      onClick={() => toggleService(srv)}
                      className={`p-3.5 rounded-[12px] border transition-all ${
                        isUnavailable
                          ? 'bg-gray-50/80 border-dashed border-gray-300 opacity-75 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#2952AB] shadow-md ring-1 ring-[#2952AB] bg-[#F2F5FB]/30 cursor-pointer'
                          : 'border-[#C2D1E8]/40 hover:border-[#2952AB]/30 shadow-sm bg-white cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              className={`font-bold text-sm ${
                                isUnavailable ? 'text-gray-500' : 'text-gray-900'
                              }`}
                            >
                              {srv.name}
                            </h4>
                            {srv.popular && (
                              <span className="text-[10px] bg-[#FEF8E7] text-[#C69815] px-2 py-0.5 rounded-full font-bold border border-[#FAEFC1]">
                                الأكثر طلباً
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-[#2952AB]" />
                              {srv.durationMin} دقيقة
                            </span>
                            <span>•</span>
                            <span>
                              تأكيد{' '}
                              {srv.confirmationMode === 'AUTOMATIC' ? (
                                <strong className="text-green-600">فوري</strong>
                              ) : (
                                <strong className="text-orange-600">خلال مهلة 25%</strong>
                              )}
                            </span>
                          </div>

                          {/* Dynamic Location Eligibility Tag */}
                          {locationMode === 'AT_HOME' ? (
                            slotCheck.available ? (
                              <div className="flex items-center gap-1.5 text-[11px] text-green-700 mt-2 font-medium bg-green-50 px-2 py-0.5 rounded w-fit border border-green-200">
                                <HomeIcon size={12} className="text-green-600" />
                                <span>متاح للخدمة المنزلية في موعد {homeSelectedTimeSlot} ✓</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[11px] text-red-700 mt-2 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200/80 w-fit">
                                <AlertCircle size={12} className="text-red-600" />
                                <span>{slotCheck.reason}</span>
                              </div>
                            )
                          ) : (
                            srv.homeServiceAvailable && (
                              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1.5 font-medium">
                                <HomeIcon size={12} className="text-gray-400" />
                                <span>متاح أيضاً بالمنزل ({srv.homePrice} ر.س)</span>
                              </div>
                            )
                          )}
                        </div>

                        {/* Price & Selection Checkbox */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-right">
                            <span
                              className={`text-base font-extrabold ${
                                isUnavailable ? 'text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {activePrice}
                            </span>
                            <span className="text-xs text-gray-500 mr-1">ر.س</span>
                            <span className="block text-[9px] text-gray-400">
                              {locationMode === 'AT_HOME' ? 'سعر المنزل' : 'سعر الصالون'}
                            </span>
                          </div>

                          {isUnavailable ? (
                            <div
                              className="w-6 h-6 rounded-[6px] border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-400"
                              title={slotCheck.reason}
                            >
                              <AlertCircle size={13} />
                            </div>
                          ) : (
                            <div
                              className={`w-6 h-6 rounded-[6px] border flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-[#2952AB] border-[#2952AB] text-white shadow-sm'
                                  : 'border-[#C2D1E8] bg-white'
                              }`}
                            >
                              {isSelected && <Check size={14} strokeWidth={2.5} />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

          {/* TAB 2: Professionals (US-012, US-031) */}
          {activeTab === 'team' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 px-1">
                خبراء ومصففو الشعر المعتمدون في فرع {selectedBranch.name}
              </p>

              {business.professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm flex items-start gap-3.5"
                >
                  <img
                    src={pro.photoUrl}
                    alt={pro.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-[#2952AB]/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{pro.name}</h4>
                      <div className="flex items-center gap-1 bg-[#FEFBF3] px-2 py-0.5 rounded-[6px] border border-[#FAEFC1]">
                        <Star size={12} className="fill-[#C69815] text-[#C69815]" />
                        <span className="text-xs font-bold text-gray-900">{pro.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#2952AB] font-medium mt-0.5">{pro.title}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{pro.bio}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {pro.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">خبرة {pro.experienceYears} سنوات</span>
                      <Link
                        to={`/beauty/professional/${pro.id}`}
                        className="text-xs font-bold text-[#2952AB] hover:underline"
                      >
                        عرض الملف والحجز &larr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Reviews (US-128, US-129) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-[#F2F5FB] p-4 rounded-[12px] border border-[#C2D1E8]/30 flex items-center justify-around text-center">
                <div>
                  <span className="text-3xl font-extrabold text-[#2952AB]">{business.rating}</span>
                  <div className="flex justify-center gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-[#C69815] text-[#C69815]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500">{business.reviewsCount} تقييم موثق</span>
                </div>
                <div className="w-px h-12 bg-[#C2D1E8]" />
                <div className="text-right text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">معايير التقييم:</p>
                  <p>• دقة المواعيد: 4.9/5</p>
                  <p>• النظافة والتعقيم: 5.0/5</p>
                  <p>• مهارة الأخصائيين: 4.9/5</p>
                </div>
              </div>

              <div className="space-y-3">
                {business.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2952AB]/15 to-[#C69815]/15 flex items-center justify-center font-bold text-xs text-[#2952AB]">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">{rev.customerName}</span>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-[#C69815] text-[#C69815]" />
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded inline-block mb-1.5">
                      الخدمة: {rev.serviceName} • مع: {rev.professionalName}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                    {/* Provider Reply (US-129) */}
                    {rev.providerReply && (
                      <div className="mt-2.5 p-2.5 bg-[#FEFBF3] border-r-2 border-[#C69815] rounded-[6px] text-xs text-gray-700">
                        <span className="font-bold text-[#8A680F] block text-[11px] mb-0.5">
                          رد الصالون ({rev.providerReply.date}):
                        </span>
                        <p className="text-[11px] text-gray-600">{rev.providerReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: About & Policies (US-069, US-076) */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-gray-700">
              <div className="bg-white p-4 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-gray-900">ساعات العمل والموقع</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#2952AB]" />
                    <span>ساعات العمل اليومية: {selectedBranch.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#C69815]" />
                    <span>{selectedBranch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span dir="ltr">{selectedBranch.phone}</span>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white p-4 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-gray-900">سياسات المواعيد والحضور</h3>
                <div className="p-3 bg-[#FEF8E7] rounded-[8px] border border-[#FAEFC1] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#8A680F] font-bold text-xs">
                    <Info size={14} />
                    <span>فترة السماح عند التأخير: {business.gracePeriodMins} دقيقة (US-069)</span>
                  </div>
                  <p className="text-[11px] text-[#6C510C] leading-relaxed">
                    يرجى الحضور في الموعد المحدد. يمنح الصالون فترة سماح مدتها 15 دقيقة قبل تعديل أو إعادة جدولة الموعد لضمان عدم تأخير العملاء اللاحقين.
                  </p>
                </div>

                <div className="p-3 bg-[#F2F5FB] rounded-[8px] border border-[#C2D1E8]/40 space-y-1">
                  <span className="font-bold text-[#2952AB] text-xs block">سياسة الإلغاء والاسترجاع (US-076):</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{business.cancellationPolicy}</p>
                </div>
              </div>

              {/* Chat with Salon (US-131) */}
              <Link
                to={`/chat/beauty-${business.id}`}
                className="w-full py-3 bg-white border border-[#2952AB] text-[#2952AB] font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#F2F5FB] active:scale-98 transition-all"
              >
                <MessageCircle size={18} />
                <span>مراسلة الصالون مباشرة</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar (US-052) */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#C2D1E8]/40 p-4 shadow-xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center">
                  {selectedServices.length}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {locationMode === 'AT_HOME' ? 'خدمات منزلية' : 'خدمات بالصالون'}
                </span>
                <span className="text-[11px] text-gray-500">({totalDuration} دقيقة)</span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-xl font-black text-[#2952AB]">{totalPrice}</span>
                <span className="text-xs text-gray-600">ر.س</span>
                {locationMode === 'AT_HOME' && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded">
                    + رسوم التوصيل
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleProceedToBooking}
              className="py-3 px-5 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-[10px] text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{locationMode === 'AT_HOME' ? 'حجز خدمة منزلية' : 'حجز في الصالون'}</span>
              <span>&larr;</span>
            </button>
          </div>
        </div>
      )}

      {/* Branch Selection Modal (US-010) */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="bg-white rounded-t-[20px] w-full max-w-md p-5 max-h-[75vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">اختر فرع {business.name}</h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-xs text-gray-500 font-semibold p-1 hover:bg-gray-100 rounded"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-2.5">
              {business.branches.map((br) => (
                <div
                  key={br.id}
                  onClick={() => {
                    setSelectedBranch(br);
                    setShowBranchModal(false);
                  }}
                  className={`p-3.5 rounded-[12px] border cursor-pointer transition-all ${
                    selectedBranch.id === br.id
                      ? 'border-[#2952AB] bg-[#F2F5FB] shadow-sm'
                      : 'border-gray-200 hover:border-[#2952AB]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{br.name}</span>
                      {br.isNearest && (
                        <span className="text-[10px] bg-[#C69815] text-white px-1.5 py-0.2 rounded font-bold">
                          الأقرب
                        </span>
                      )}
                    </div>
                    {selectedBranch.id === br.id && <Check size={16} className="text-[#2952AB]" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{br.address}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                    <span>يبعد {br.distanceKm} كم</span>
                    <span>ساعات العمل: {br.workingHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
