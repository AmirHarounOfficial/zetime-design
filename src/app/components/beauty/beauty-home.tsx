import { useState } from 'react';
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  Scissors,
  Smile,
  Palette,
  UserCheck,
  Eye,
  ShieldCheck,
  Home as HomeIcon,
  Store,
  Users,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import {
  beautyCategories,
  beautyBusinesses,
  mockBeautyBookings,
  mockBeautyQueueTicket,
  BeautyBusiness,
} from '../../data/beauty-mock-data';

const categoryIconMap: Record<string, any> = {
  scissors: Scissors,
  sparkles: Sparkles,
  smile: Smile,
  palette: Palette,
  'user-check': UserCheck,
  heart: Heart,
  eye: Eye,
};

export function BeautyHomeModule() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['biz-lumiere']);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState<'all' | 'women' | 'men' | 'unisex'>('all');
  const [homeServiceOnly, setHomeServiceOnly] = useState(false);

  // Active booking if any
  const activeBooking = mockBeautyBookings.find(
    (b) => b.status === 'CONFIRMED' || b.status === 'IN_SERVICE' || b.status === 'PENDING_CONFIRMATION'
  );

  const toggleFavorite = (bizId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(bizId) ? prev.filter((id) => id !== bizId) : [...prev, bizId]
    );
  };

  const filteredBusinesses = beautyBusinesses.filter((biz) => {
    const matchesSearch =
      biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      biz.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAudience =
      audienceFilter === 'all' || biz.audience === audienceFilter || biz.audience === 'unisex';

    const matchesHome = !homeServiceOnly || biz.services.some((s) => s.homeServiceAvailable);

    const matchesCategory =
      !selectedCategory || biz.services.some((s) => s.categoryId === selectedCategory);

    const matchesFilterPill = () => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'today') return true; // available today
      if (selectedFilter === 'now') return biz.branches.some((b) => b.queueActive);
      if (selectedFilter === 'home') return biz.services.some((s) => s.homeServiceAvailable);
      if (selectedFilter === 'women') return biz.audience === 'women';
      if (selectedFilter === 'men') return biz.audience === 'men';
      if (selectedFilter === 'offers') return (biz.offers?.length || 0) > 0;
      if (selectedFilter === 'favs') return favorites.includes(biz.id);
      return true;
    };

    return matchesSearch && matchesAudience && matchesHome && matchesCategory && matchesFilterPill();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-28" dir="rtl">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-md mx-auto">
          {/* Bar with Back, Title, and Provider Hub Switcher */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Link to="/" className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                <ChevronLeft size={24} className="text-[#2952AB] rotate-180" strokeWidth={1.5} />
              </Link>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C69815] animate-pulse" />
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">الجمال والعناية</h1>
                </div>
                <p className="text-xs text-[#2952AB]/70 font-medium">ZeTime Beauty • صالونات وسبا</p>
              </div>
            </div>

            {/* Provider Hub Button */}
            <Link
              to="/beauty/provider-hub"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-full text-xs font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <Store size={14} />
              <span>بوابة الأعمال</span>
            </Link>
          </div>

          {/* Search Bar & Filter Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A9ACB]"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="ابحث عن صالون، خدمة، أو أخصائي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#C2D1E8]/50 pr-10 pl-3 py-2.5 rounded-[10px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 focus:border-[#2952AB] transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className={`p-2.5 rounded-[10px] border shadow-sm transition-all ${
                audienceFilter !== 'all' || homeServiceOnly
                  ? 'bg-[#2952AB] text-white border-[#2952AB]'
                  : 'bg-white text-[#2952AB] border-[#C2D1E8]/50 hover:bg-[#F2F5FB]'
              }`}
            >
              <SlidersHorizontal size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Location & Delivery Mode Indicator */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-600 px-1">
            <div className="flex items-center gap-1 text-[#2952AB] font-medium">
              <MapPin size={14} className="text-[#C69815]" />
              <span>الرياض، حي العليا (الأقرب إليك)</span>
            </div>
            <span className="text-[11px] bg-[#C69815]/10 text-[#A88012] px-2 py-0.5 rounded-full font-semibold">
              متعدد الفروع والدول
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-5">
        {/* Active Booking Live Banner (US-001) */}
        {activeBooking && (
          <Link
            to={`/activity/beauty/${activeBooking.id}`}
            className="block bg-gradient-to-r from-white to-[#FEFBF3] rounded-[12px] p-4 border border-[#C69815]/30 shadow-md hover:border-[#C69815] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C69815] animate-ping" />
                <span className="text-xs font-bold text-[#A88012]">موعد نشط مؤكد</span>
              </div>
              <span className="text-[11px] bg-[#C69815]/15 text-[#8A680F] px-2.5 py-0.5 rounded-full font-bold">
                اليوم {activeBooking.overallStartTime}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={activeBooking.businessLogo}
                alt={activeBooking.businessName}
                className="w-12 h-12 rounded-[10px] object-cover border border-[#C2D1E8]/30 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{activeBooking.businessName}</h4>
                <p className="text-xs text-gray-600 truncate">
                  {activeBooking.items.map((it) => it.serviceName).join(' + ')}
                </p>
                <p className="text-[11px] text-[#2952AB] mt-0.5 font-medium">
                  {activeBooking.branchName} • فترة سماح 15 دقيقة
                </p>
              </div>
              <ChevronLeft size={18} className="text-[#7A9ACB] rotate-180 flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* Live Queue Ticket Notice (US-086, US-088, US-094) */}
        <div className="bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] rounded-[12px] p-3.5 text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-sm text-[#FAEFC1] border border-white/20">
              {mockBeautyQueueTicket.ticketNumber}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white">طابور الانتظار السريع (Walk-In)</p>
                <span className="text-[9px] bg-[#C69815] text-white px-1.5 py-0.2 rounded font-bold">مباشر</span>
              </div>
              <p className="text-[11px] text-white/80">
                أمامك {mockBeautyQueueTicket.customersAhead} عملاء • وقت الانتظار المقدر: ~{mockBeautyQueueTicket.estimatedWaitMinutes} دقيقة
              </p>
            </div>
          </div>
          <Link
            to={`/beauty/queue/${mockBeautyQueueTicket.businessId}`}
            className="px-3 py-1.5 bg-[#C69815] hover:bg-[#A88012] text-white rounded-[8px] text-xs font-bold shadow transition-all active:scale-95"
          >
            متابعة دورك
          </Link>
        </div>

        {/* Filter Tabs Horizontal Scroll (US-006, US-007, US-008) */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'today', label: 'متاح اليوم ⚡' },
            { id: 'now', label: 'متاح الآن (طابور سريع)' },
            { id: 'home', label: 'خدمة منزلية 🏡' },
            { id: 'women', label: 'صالونات نسائية' },
            { id: 'men', label: 'حلاقة رجالية' },
            { id: 'offers', label: 'عروض حصرية %' },
            { id: 'favs', label: 'المفضلة ❤️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedFilter(tab.id);
                if (tab.id === 'women') setAudienceFilter('women');
                else if (tab.id === 'men') setAudienceFilter('men');
                else if (tab.id === 'home') setHomeServiceOnly(true);
                else {
                  setAudienceFilter('all');
                  setHomeServiceOnly(false);
                }
              }}
              className={`px-3.5 py-2 rounded-full font-medium whitespace-nowrap transition-all border ${
                selectedFilter === tab.id
                  ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                  : 'bg-white text-gray-700 border-[#C2D1E8]/50 hover:border-[#2952AB]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Master Categories Grid (US-002, US-035) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-900">فئات خدمات الجمال</h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs text-[#2952AB] hover:underline font-semibold"
              >
                إظهار الكل
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {beautyCategories.map((cat) => {
              const Icon = categoryIconMap[cat.icon] || Sparkles;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`flex flex-col items-center text-center p-2.5 rounded-[12px] border transition-all ${
                    isSelected
                      ? 'bg-[#2952AB]/10 border-[#2952AB] shadow-sm ring-1 ring-[#2952AB]'
                      : 'bg-white border-[#C2D1E8]/30 hover:border-[#2952AB]/30 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center mb-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#2952AB] text-white'
                        : 'bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/15 text-[#2952AB]'
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-900 line-clamp-1 leading-snug">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{cat.servicesCount} خدمة</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Promotional Banner (US-134) */}
        <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-l from-[#2952AB] via-[#1D3D7A] to-[#0F2347] p-4 text-white shadow-lg">
          <div className="absolute -left-6 -bottom-6 w-28 h-28 bg-[#C69815]/30 rounded-full blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C69815] text-white mb-1.5 shadow">
                عرض حصري 25%
              </span>
              <h3 className="text-base font-extrabold text-[#FEFBF3] leading-snug">
                باقة النضارة والتألق الملكية
              </h3>
              <p className="text-xs text-white/80 mt-1 max-w-[220px]">
                احجز قص شعر + مانيكير سبا واحصل على خصم فوري مع خدمة الصالون أو بالمنزل
              </p>
            </div>
            <Link
              to="/beauty/business/biz-lumiere"
              className="px-3.5 py-2 bg-white text-[#2952AB] rounded-[10px] text-xs font-bold shadow hover:bg-gray-50 active:scale-95 transition-all flex-shrink-0"
            >
              استكشف العرض
            </Link>
          </div>
        </div>

        {/* Businesses List (US-004, US-009, US-010) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-sm font-bold text-gray-900">أبرز الصالونات ومراكز التجميل</h2>
              <p className="text-xs text-gray-500">أفضل تقييم بالقرب منك مع حجز فوري ومؤكد</p>
            </div>
            <span className="text-xs text-[#2952AB] font-bold">{filteredBusinesses.length} صالون</span>
          </div>

          <div className="space-y-4">
            {filteredBusinesses.map((biz) => {
              const nearestBranch = biz.branches.find((b) => b.isNearest) || biz.branches[0];
              const isFav = favorites.includes(biz.id);

              return (
                <div
                  key={biz.id}
                  className="bg-white rounded-[14px] border border-[#C2D1E8]/40 shadow-md hover:shadow-lg transition-all overflow-hidden"
                >
                  {/* Business Cover & Badges */}
                  <div className="relative h-36 w-full">
                    <img
                      src={biz.coverUrls[0]}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(biz.id, e)}
                      className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-red-500 shadow-sm transition-all"
                    >
                      <Heart
                        size={16}
                        className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-700'}
                      />
                    </button>

                    {/* Audience & Type Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
                        {biz.audience === 'women'
                          ? 'نسائي'
                          : biz.audience === 'men'
                          ? 'رجالي'
                          : 'للجميع'}
                      </span>
                      {biz.type === 'FREELANCER' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C69815] text-white">
                          مستقلة
                        </span>
                      )}
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-[8px] shadow-sm">
                      <Star size={13} className="fill-[#C69815] text-[#C69815]" />
                      <span className="text-xs font-bold text-gray-900">{biz.rating}</span>
                      <span className="text-[10px] text-gray-500">({biz.reviewsCount})</span>
                    </div>

                    {/* Home service tag */}
                    {biz.services.some((s) => s.homeServiceAvailable) && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-green-600/90 text-white px-2 py-0.5 rounded-[6px] text-[10px] font-bold">
                        <HomeIcon size={11} />
                        <span>خدمة منزلية متوفرة</span>
                      </div>
                    )}
                  </div>

                  {/* Business Details */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="w-12 h-12 rounded-[10px] object-cover border border-[#C2D1E8]/40 shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{biz.name}</h3>
                          {biz.verified && (
                            <ShieldCheck size={16} className="text-[#2952AB] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{biz.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-600">
                          <span className="flex items-center gap-1 text-[#2952AB] font-medium">
                            <MapPin size={12} className="text-[#C69815]" />
                            {nearestBranch.name} • {nearestBranch.distanceKm} كم
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" />
                            {nearestBranch.workingHours}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Popular Services Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                      {biz.services.slice(0, 3).map((srv) => (
                        <span
                          key={srv.serviceId}
                          className="text-[11px] bg-[#F2F5FB] text-[#2952AB] px-2.5 py-1 rounded-[6px] font-medium border border-[#C2D1E8]/30 flex items-center gap-1"
                        >
                          <span>{srv.name}</span>
                          <strong className="text-gray-900">{srv.price} ر.س</strong>
                        </span>
                      ))}
                    </div>

                    {/* Actions: Book Now & Live Queue */}
                    <div className="flex items-center gap-2 mt-3.5 pt-2">
                      <Link
                        to={`/beauty/business/${biz.id}`}
                        className="flex-1 py-2.5 px-3 bg-[#2952AB] hover:bg-[#1D3D7A] text-white rounded-[10px] text-xs font-bold text-center shadow-sm active:scale-95 transition-all"
                      >
                        عرض الخدمات والحجز
                      </Link>

                      {nearestBranch.queueActive && (
                        <Link
                          to={`/beauty/queue/${biz.id}`}
                          className="py-2.5 px-3 bg-gradient-to-r from-[#FEF8E7] to-[#FAEFC1] text-[#8A680F] border border-[#C69815]/30 hover:border-[#C69815] rounded-[10px] text-xs font-bold text-center flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Zap size={13} className="text-[#C69815]" />
                          <span>طابور فوري ({nearestBranch.currentQueueCount})</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Professionals Carousel (US-005, US-012, US-013) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-sm font-bold text-gray-900">أبرز خبراء ومصففي التجميل</h2>
              <p className="text-xs text-gray-500">حجز مؤكد مع أفضل الخبراء المعتمدين</p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {beautyBusinesses
              .flatMap((b) => b.professionals)
              .map((pro) => (
                <Link
                  key={pro.id}
                  to={`/beauty/professional/${pro.id}`}
                  className="min-w-[190px] bg-white rounded-[12px] p-3 border border-[#C2D1E8]/40 shadow-sm hover:border-[#2952AB]/40 hover:shadow-md transition-all text-center flex flex-col items-center flex-shrink-0"
                >
                  <div className="relative mb-2">
                    <img
                      src={pro.photoUrl}
                      alt={pro.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#C69815]/30"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.2 rounded-full border border-gray-200 flex items-center gap-0.5 shadow-sm">
                      <Star size={10} className="fill-[#C69815] text-[#C69815]" />
                      <span className="text-[10px] font-bold text-gray-900">{pro.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-gray-900 truncate max-w-full">{pro.name}</h4>
                  <p className="text-[10px] text-gray-500 truncate max-w-full mt-0.5">{pro.title}</p>
                  <span className="text-[9px] text-[#2952AB] bg-[#F2F5FB] px-2 py-0.5 rounded-full mt-1.5 font-medium truncate max-w-full">
                    {pro.branchName}
                  </span>
                  <div className="mt-2.5 w-full pt-2 border-t border-gray-100 flex items-center justify-center gap-1 text-[#2952AB] text-[11px] font-bold">
                    <span>احجز مع {pro.name.split(' ')[0]}</span>
                    <ArrowRight size={12} className="rotate-180" />
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Walk-In & Smart Gap Info Card (US-094, US-096) */}
        <div className="bg-gradient-to-br from-[#FEF8E7] to-white rounded-[14px] p-4 border border-[#C69815]/30 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#C69815]/10 flex items-center justify-center text-[#C69815] flex-shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900">نظام الطابور الذكي وملء الفراغات</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                هل وصلت الصالون بدون موعد مسبق؟ يقوم نظام ZeTime بحساب الفراغات الزمنية بين المواعيد ويدرجك تلقائياً دون أي تعطيل للمواعيد المحجوزة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal Sheet */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="bg-white rounded-t-[20px] w-full max-w-md p-5 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">خيارات تصفية خدمات الجمال</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-xs text-gray-500 font-semibold p-1 hover:bg-gray-100 rounded"
              >
                إغلاق
              </button>
            </div>

            {/* Audience */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">الفئة المستهدفة</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'الجميع' },
                  { id: 'women', label: 'صالونات نسائية' },
                  { id: 'men', label: 'حلاقة رجالية' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() => setAudienceFilter(aud.id as any)}
                    className={`py-2 px-3 rounded-[8px] text-xs font-semibold border ${
                      audienceFilter === aud.id
                        ? 'bg-[#2952AB] text-white border-[#2952AB]'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Home Service Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[10px] border border-gray-200">
              <div className="flex items-center gap-2">
                <HomeIcon size={18} className="text-[#2952AB]" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">خدمات منزلية فقط (Home Service)</span>
                  <span className="text-[11px] text-gray-500">عرض الصالونات والخبراء الذين يقدمون خدمات بالمنزل</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={homeServiceOnly}
                onChange={(e) => setHomeServiceOnly(e.target.checked)}
                className="w-5 h-5 accent-[#2952AB] rounded cursor-pointer"
              />
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full py-3 bg-[#2952AB] text-white font-bold rounded-[10px] text-sm shadow active:scale-98 transition-all"
            >
              تطبيق التصفية
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
