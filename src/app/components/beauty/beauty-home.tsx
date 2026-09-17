import { useState, useMemo } from 'react';
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
  Users,
  CheckCircle2,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
  FilterX,
  RotateCcw,
  Store,
  ChevronDown,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import {
  beautyCategories,
  beautyBusinesses,
  mockBeautyBookings,
  mockBeautyQueueTicket,
  BeautyBusiness,
} from '../../data/beauty-mock-data';
import {
  BeautyFilterState,
  initialBeautyFilterState,
  BeautySortOption,
  BeautyViewMode,
} from '../../data/beauty-filter-types';
import {
  filterBusinesses,
  filterBookableServices,
  filterProfessionals,
} from '../../data/beauty-filter-engine';
import { BeautyFilterDrawer } from './beauty-filter-drawer';
import { BeautyFilterChips } from './beauty-filter-chips';

const sortLabels: Record<BeautySortOption, string> = {
  relevance: 'الأكثر ملائمة',
  distance: 'الأقرب إليك',
  rating: 'الأعلى تقييماً',
  price_asc: 'السعر: الأقل أولاً',
  price_desc: 'السعر: الأعلى أولاً',
  earliest: 'الأسبق توفراً',
};

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
  const [filters, setFilters] = useState<BeautyFilterState>(initialBeautyFilterState);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedQuickTab, setSelectedQuickTab] = useState('all');
  const [favorites, setFavorites] = useState<string[]>(['biz-lumiere']);

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

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.serviceLocation !== 'all') count++;
    if (filters.audience !== 'all') count++;
    if (filters.location.selectedArea !== 'all') count++;
    if (filters.location.maxDistanceKm < 50) count++;
    if (filters.businessTypes.length > 0) count += filters.businessTypes.length;
    if (filters.categoryId !== 'all') count++;
    if (filters.serviceId !== 'all') count++;
    if (filters.professionalId !== 'all') count++;
    if (filters.minRating > 0) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) count++;
    if (filters.availability.timeframe !== 'any') count++;
    if (filters.onlyActiveOffers) count++;
    return count;
  }, [filters]);

  // Handlers for individual filter chips removal
  const handleRemoveFilter = (key: string, value?: any) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (key === 'serviceLocation') updated.serviceLocation = 'all';
      if (key === 'audience') updated.audience = 'all';
      if (key === 'area') updated.location = { ...prev.location, selectedArea: 'all' };
      if (key === 'distance') updated.location = { ...prev.location, maxDistanceKm: 50 };
      if (key === 'businessType') {
        updated.businessTypes = prev.businessTypes.filter((t) => t !== value);
      }
      if (key === 'categoryId') updated.categoryId = 'all';
      if (key === 'serviceId') updated.serviceId = 'all';
      if (key === 'professionalId') updated.professionalId = 'all';
      if (key === 'minRating') updated.minRating = 0;
      if (key === 'priceRange') updated.priceRange = { min: 0, max: 1000 };
      if (key === 'availability') updated.availability = { timeframe: 'any' };
      if (key === 'offers') updated.onlyActiveOffers = false;
      return updated;
    });
  };

  const handleClearAll = () => {
    setFilters((prev) => ({
      ...initialBeautyFilterState,
      searchQuery: prev.searchQuery,
    }));
    setSelectedQuickTab('all');
  };

  // Perform filtering using engine across all 3 discovery modes
  const businessResults = useMemo(() => {
    let list = filterBusinesses(beautyBusinesses, filters);
    if (selectedQuickTab === 'favs') {
      list = list.filter((b) => favorites.includes(b.id));
    }
    return list;
  }, [filters, selectedQuickTab, favorites]);

  const serviceResults = useMemo(
    () => filterBookableServices(beautyBusinesses, filters),
    [filters]
  );

  const professionalResults = useMemo(
    () => filterProfessionals(beautyBusinesses, filters),
    [filters]
  );

  const currentCount =
    filters.viewMode === 'services'
      ? serviceResults.length
      : filters.viewMode === 'professionals'
      ? professionalResults.length
      : businessResults.length;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-10" dir="rtl">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-md mx-auto">
          {/* Bar with Back & Title */}
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
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-white border border-[#C2D1E8]/50 pr-10 pl-8 py-2.5 rounded-[10px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 focus:border-[#2952AB] transition-all shadow-sm"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`relative p-2.5 rounded-[10px] border shadow-sm transition-all ${
                activeFiltersCount > 0
                  ? 'bg-[#2952AB] text-white border-[#2952AB]'
                  : 'bg-white text-[#2952AB] border-[#C2D1E8]/50 hover:bg-[#F2F5FB]'
              }`}
              title="تصفية الخدمات والصالونات"
            >
              <SlidersHorizontal size={18} strokeWidth={1.5} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C69815] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Location & Active Count Summary */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-600 px-1">
            <div className="flex items-center gap-1 text-[#2952AB] font-medium">
              <MapPin size={14} className="text-[#C69815]" />
              <span>الرياض، {filters.location.selectedArea === 'all' ? 'حي العليا (الأقرب إليك)' : filters.location.selectedArea}</span>
            </div>
            <span className="text-[11px] bg-[#C69815]/10 text-[#A88012] px-2.5 py-0.5 rounded-full font-bold">
              {currentCount} متاح حالياً
            </span>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-2.5 border-t border-[#C2D1E8]/30">
              <BeautyFilterChips
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAll}
              />
            </div>
          )}
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

        {/* Organized Live Turn Tracking Card (بطاقة متابعة الدور المباشر) */}
        <div className="bg-white rounded-[16px] border border-[#C2D1E8]/60 shadow-md hover:shadow-lg transition-all overflow-hidden">
          {/* Card Top Header */}
          <div className="bg-gradient-to-r from-[#1D3D7A] via-[#2952AB] to-[#1D3D7A] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAEFC1] border border-white/20">
                <Clock size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white">بطاقة متابعة الدور المباشر</h3>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                </div>
                <p className="text-[10px] text-white/80">{mockBeautyQueueTicket.businessName} • {mockBeautyQueueTicket.branchName}</p>
              </div>
            </div>
            <div className="bg-white/15 border border-white/25 px-2.5 py-1 rounded-[8px] text-center font-mono">
              <span className="text-[9px] text-[#FAEFC1] block font-sans">تذكرتك</span>
              <strong className="text-sm font-black text-white">{mockBeautyQueueTicket.ticketNumber}</strong>
            </div>
          </div>

          {/* 3 Metrics Row */}
          <div className="p-4 space-y-3.5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F2F5FB] p-2.5 rounded-[10px] border border-[#C2D1E8]/40">
                <span className="text-[10px] text-gray-500 block font-medium">ترتيبك في الدور</span>
                <strong className="text-base font-black text-[#2952AB]">#{mockBeautyQueueTicket.position}</strong>
              </div>
              <div className="bg-[#F2F5FB] p-2.5 rounded-[10px] border border-[#C2D1E8]/40">
                <span className="text-[10px] text-gray-500 block font-medium">أشخاص قبلك</span>
                <strong className="text-base font-black text-gray-800">{mockBeautyQueueTicket.customersAhead} عملاء</strong>
              </div>
              <div className="bg-[#FEF8E7] p-2.5 rounded-[10px] border border-[#FAEFC1]">
                <span className="text-[10px] text-[#8A680F] block font-medium">الوقت التقريبي</span>
                <strong className="text-base font-black text-[#C69815]">~{mockBeautyQueueTicket.estimatedWaitMinutes} دقيقة</strong>
              </div>
            </div>

            {/* Service & Smart Gap Insertion info */}
            <div className="flex items-center justify-between text-xs px-1 text-gray-600">
              <div className="flex items-center gap-1.5 truncate">
                <Scissors size={13} className="text-[#2952AB] flex-shrink-0" />
                <span className="font-semibold truncate text-gray-800">{mockBeautyQueueTicket.serviceName}</span>
              </div>
              {mockBeautyQueueTicket.insertedInGap && (
                <span className="text-[10px] bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1] px-2 py-0.5 rounded-full font-bold flex-shrink-0 flex items-center gap-1">
                  <Zap size={11} className="text-[#C69815]" />
                  <span>فراغ جدول ذكي</span>
                </span>
              )}
            </div>

            {/* CTA to Queue Details */}
            <Link
              to={`/beauty/queue/${mockBeautyQueueTicket.businessId}`}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] hover:from-[#1D3D7A] hover:to-[#2952AB] text-white rounded-[10px] text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            >
              <span>فتح تذكرة الانتظار وإدارة الحضور</span>
              <ChevronLeft size={16} className="rotate-180" />
            </Link>
          </div>
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
          ].map((tab) => {
            const isTabActive =
              tab.id === 'all'
                ? activeFiltersCount === 0 && selectedQuickTab === 'all'
                : tab.id === 'today'
                ? filters.availability.timeframe === 'today'
                : tab.id === 'now'
                ? filters.availability.timeframe === 'now'
                : tab.id === 'home'
                ? filters.serviceLocation === 'at_home'
                : tab.id === 'women'
                ? filters.audience === 'women'
                : tab.id === 'men'
                ? filters.audience === 'men'
                : tab.id === 'offers'
                ? filters.onlyActiveOffers
                : tab.id === 'favs'
                ? selectedQuickTab === 'favs'
                : false;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedQuickTab(tab.id);
                  if (tab.id === 'all') {
                    handleClearAll();
                  } else if (tab.id === 'today') {
                    setFilters((prev) => ({
                      ...prev,
                      availability: {
                        timeframe: prev.availability.timeframe === 'today' ? 'any' : 'today',
                      },
                    }));
                  } else if (tab.id === 'now') {
                    setFilters((prev) => ({
                      ...prev,
                      availability: {
                        timeframe: prev.availability.timeframe === 'now' ? 'any' : 'now',
                      },
                    }));
                  } else if (tab.id === 'home') {
                    setFilters((prev) => ({
                      ...prev,
                      serviceLocation: prev.serviceLocation === 'at_home' ? 'all' : 'at_home',
                    }));
                  } else if (tab.id === 'women') {
                    setFilters((prev) => ({
                      ...prev,
                      audience: prev.audience === 'women' ? 'all' : 'women',
                    }));
                  } else if (tab.id === 'men') {
                    setFilters((prev) => ({
                      ...prev,
                      audience: prev.audience === 'men' ? 'all' : 'men',
                    }));
                  } else if (tab.id === 'offers') {
                    setFilters((prev) => ({
                      ...prev,
                      onlyActiveOffers: !prev.onlyActiveOffers,
                    }));
                  }
                }}
                className={`px-3.5 py-2 rounded-full font-medium whitespace-nowrap transition-all border ${
                  isTabActive
                    ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                    : 'bg-white text-gray-700 border-[#C2D1E8]/50 hover:border-[#2952AB]/30'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Master Categories Grid (US-002, US-035) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-gray-900">فئات خدمات الجمال</h2>
            {filters.categoryId !== 'all' && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, categoryId: 'all' }))}
                className="text-xs text-[#2952AB] hover:underline font-semibold"
              >
                إظهار الكل
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {beautyCategories.map((cat) => {
              const Icon = categoryIconMap[cat.icon] || Sparkles;
              const isSelected = filters.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categoryId: prev.categoryId === cat.id ? 'all' : cat.id,
                    }))
                  }
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

        {/* Discovery Modes Bar (3 View Modes) */}
        <div className="bg-white rounded-[14px] p-1.5 border border-[#C2D1E8]/50 shadow-xs flex items-center gap-1">
          {[
            { id: 'businesses', label: 'الصالونات والمراكز', count: businessResults.length, icon: Store },
            { id: 'services', label: 'الخدمات المتاحة', count: serviceResults.length, icon: Sparkles },
            { id: 'professionals', label: 'الخبراء والمصففين', count: professionalResults.length, icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = filters.viewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilters((prev) => ({ ...prev, viewMode: tab.id as BeautyViewMode }))}
                className={`flex-1 py-2 px-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  isTabActive
                    ? 'bg-[#2952AB] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={13} className={isTabActive ? 'text-[#C69815]' : 'text-gray-400'} />
                <span className="truncate">{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isTabActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Count & Sorting Toolbar */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-gray-500 font-medium">
            عرض <strong className="text-gray-900 font-bold">{currentCount}</strong>{' '}
            {filters.viewMode === 'services'
              ? 'خدمة متاحة'
              : filters.viewMode === 'professionals'
              ? 'أخصائي معتمد'
              : 'صالون ومركز'}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-[#2952AB] font-bold bg-white px-2.5 py-1 rounded-[8px] border border-[#C2D1E8]/50 shadow-2xs hover:bg-gray-50 transition-colors"
            >
              <span>الترتيب: {sortLabels[filters.sortBy]}</span>
              <ChevronDown size={14} />
            </button>

            {showSortDropdown && (
              <div className="absolute left-0 mt-1 w-44 bg-white rounded-[10px] border border-[#C2D1E8] shadow-lg z-20 py-1 text-xs">
                {(Object.keys(sortLabels) as BeautySortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, sortBy: opt }));
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 font-medium transition-colors ${
                      filters.sortBy === opt
                        ? 'bg-[#F2F5FB] text-[#2952AB] font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {sortLabels[opt]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {currentCount === 0 && (
          <div className="bg-white rounded-[16px] p-8 border border-[#C2D1E8]/50 shadow-sm text-center space-y-4 my-2">
            <div className="w-16 h-16 rounded-full bg-[#FEFBF3] border border-[#FAEFC1] flex items-center justify-center mx-auto text-[#C69815]">
              <FilterX size={28} />
            </div>

            <div>
              <h3 className="font-bold text-base text-gray-900">لا توجد نتائج تطابق شروط التصفية</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                قد تكون الفلاتر المحددة مقيدة للغاية أو لا تتوفر مواعيد شاغرة حالياً بنفس الشروط.
              </p>
            </div>

            {/* Recovery Action Buttons */}
            <div className="space-y-2 max-w-xs mx-auto pt-2">
              <button
                onClick={handleClearAll}
                className="w-full py-2.5 px-4 bg-[#2952AB] hover:bg-[#1D3D7A] text-white rounded-[10px] text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>إعادة تعيين الفلاتر بالكامل</span>
              </button>

              {filters.serviceLocation === 'at_home' && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, serviceLocation: 'all' }))}
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-[8px] text-xs font-semibold border border-gray-200 transition-colors"
                >
                  التبديل إلى خدمات الصالون
                </button>
              )}

              {filters.location.maxDistanceKm < 50 && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      location: { ...prev.location, maxDistanceKm: 50 },
                    }))
                  }
                  className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-[8px] text-xs font-semibold border border-gray-200 transition-colors"
                >
                  توسيع نطاق المسافة (حتى 50 كم)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dynamic Results: Mode 1 - Businesses */}
        {filters.viewMode === 'businesses' && currentCount > 0 && (
          <div className="space-y-4">
            {businessResults.map((biz) => {
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
        )}

        {/* Dynamic Results: Mode 2 - Services */}
        {filters.viewMode === 'services' && currentCount > 0 && (
          <div className="space-y-3">
            {serviceResults.map((srv) => (
              <div
                key={`${srv.businessId}-${srv.serviceId}`}
                className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">{srv.serviceName}</h4>
                      {srv.hasActiveOffer && (
                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.2 rounded font-bold border border-red-100">
                          خصم {srv.offerDiscount}%
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/beauty/business/${srv.businessId}`}
                      className="text-xs text-[#2952AB] font-semibold mt-0.5 block hover:underline"
                    >
                      {srv.businessName} • {srv.branchName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#2952AB]" />
                        {srv.durationMin} دقيقة
                      </span>
                      <span>•</span>
                      <span>يبعد {srv.distanceKm} كم</span>
                    </div>
                  </div>

                  <div className="text-left flex-shrink-0">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-black text-[#2952AB]">{srv.price}</span>
                      <span className="text-xs text-gray-500">ر.س</span>
                    </div>
                    {srv.homeServiceAvailable && (
                      <span className="text-[10px] text-gray-500 block">
                        بالمنزل: {srv.homePrice} ر.س
                      </span>
                    )}
                  </div>
                </div>

                {/* Eligible Professionals & Direct Booking CTA */}
                <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-gray-600">
                    <span>متاح مع:</span>
                    <strong className="text-gray-800">
                      {srv.eligibleProfessionals.length > 0
                        ? srv.eligibleProfessionals.map((p) => p.name.split(' ')[0]).join('، ')
                        : 'أي أخصائي متاح'}
                    </strong>
                  </div>

                  <Link
                    to={`/beauty/book/${srv.businessId}?branchId=${srv.branchId}&services=${srv.serviceId}`}
                    className="py-1.5 px-4 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-[8px] text-xs font-bold shadow-2xs hover:shadow active:scale-95 transition-all flex items-center gap-1"
                  >
                    <span>احجز الآن</span>
                    <ArrowRight size={13} className="rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Results: Mode 3 - Professionals */}
        {filters.viewMode === 'professionals' && currentCount > 0 && (
          <div className="space-y-3">
            {professionalResults.map(({ professional, business, branch, services }) => (
              <div
                key={professional.id}
                className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={professional.photoUrl}
                    alt={professional.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs ring-1 ring-[#C69815]/30 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{professional.name}</h4>
                      <div className="flex items-center gap-1 bg-[#FEFBF3] px-2 py-0.5 rounded-[6px] border border-[#FAEFC1]">
                        <Star size={11} className="fill-[#C69815] text-[#C69815]" />
                        <span className="text-xs font-bold text-gray-900">{professional.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#2952AB] font-medium">{professional.title}</p>
                    <span className="text-[11px] text-gray-500 block truncate mt-0.5">
                      {business.name} • {branch.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {professional.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    خبرة {professional.experienceYears} سنوات
                  </span>
                  <Link
                    to={`/beauty/professional/${professional.id}`}
                    className="py-1.5 px-3.5 bg-[#2952AB] text-white rounded-[8px] text-xs font-bold shadow-2xs hover:bg-[#1D3D7A] active:scale-95 flex items-center gap-1"
                  >
                    <span>عرض الملف والحجز</span>
                    <ArrowRight size={13} className="rotate-180" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Progressive Filter Drawer */}
      <BeautyFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onReset={handleClearAll}
      />
    </div>
  );
}
