import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  Scissors,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Home as HomeIcon,
  Zap,
  ArrowRight,
  FilterX,
  RotateCcw,
  Store,
  ChevronDown,
} from 'lucide-react';
import {
  BeautyFilterState,
  initialBeautyFilterState,
  BeautySortOption,
  BeautyViewMode,
} from '../../data/beauty-filter-types';
import { beautyBusinesses } from '../../data/beauty-mock-data';
import {
  filterBusinesses,
  filterBookableServices,
  filterProfessionals,
} from '../../data/beauty-filter-engine';
import { BeautyFilterDrawer } from './beauty-filter-drawer';
import { BeautyFilterChips } from './beauty-filter-chips';

export function BeautySearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initial query params
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialService = searchParams.get('service') || 'all';
  const initialView = (searchParams.get('view') as BeautyViewMode) || 'businesses';

  // Filters State
  const [filters, setFilters] = useState<BeautyFilterState>(() => ({
    ...initialBeautyFilterState,
    searchQuery: initialQuery,
    categoryId: initialCategory,
    serviceId: initialService,
    viewMode: initialView,
  }));

  // Drawer visibility
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sorting menu toggle
  const [showSortDropdown, setShowSortDropdown] = useState(false);

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

  // Execute filtering based on viewMode
  const businessResults = useMemo(
    () => filterBusinesses(beautyBusinesses, filters),
    [filters]
  );

  const serviceResults = useMemo(
    () => filterBookableServices(beautyBusinesses, filters),
    [filters]
  );

  const professionalResults = useMemo(
    () => filterProfessionals(beautyBusinesses, filters),
    [filters]
  );

  // Active results count
  const currentCount =
    filters.viewMode === 'services'
      ? serviceResults.length
      : filters.viewMode === 'professionals'
      ? professionalResults.length
      : businessResults.length;

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
      viewMode: prev.viewMode,
      sortBy: prev.sortBy,
    }));
  };

  // Sort labels
  const sortLabels: Record<BeautySortOption, string> = {
    relevance: 'الأكثر صلة',
    nearest: 'الأقرب إليك مسافة',
    rating_desc: 'الأعلى تقييماً ★',
    price_asc: 'السعر: من الأقل للأعلى',
    price_desc: 'السعر: من الأعلى للأقل',
    earliest_avail: 'أقرب موعد متاح',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-16" dir="rtl">
      {/* Sticky Header with Search and Filter Trigger */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 pt-11 pb-3 shadow-xs">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-2xs hover:bg-[#F2F5FB] transition-all flex-shrink-0"
            >
              <ChevronLeft size={20} className="rotate-180" />
            </button>

            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A9ACB]"
              />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="ابحث عن صالون، خدمة، أو أخصائي..."
                className="w-full bg-[#F2F5FB] border border-[#C2D1E8]/40 pr-9 pl-3 py-2 rounded-[10px] text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 focus:border-[#2952AB] transition-all"
              />
            </div>

            {/* Filter Drawer Trigger Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={`p-2 rounded-[10px] border shadow-2xs transition-all relative flex items-center justify-center ${
                activeFiltersCount > 0
                  ? 'bg-[#2952AB] text-white border-[#2952AB]'
                  : 'bg-white text-[#2952AB] border-[#C2D1E8]/60 hover:bg-[#F2F5FB]'
              }`}
            >
              <SlidersHorizontal size={18} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C69815] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* 3 Unified Discovery View Mode Tabs */}
          <div className="flex bg-[#F2F5FB] p-1 rounded-[10px] border border-[#C2D1E8]/40 text-xs font-bold">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'businesses' }))}
              className={`flex-1 py-1.5 rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                filters.viewMode === 'businesses'
                  ? 'bg-white text-[#2952AB] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store size={13} />
              <span>الصالونات ({businessResults.length})</span>
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'services' }))}
              className={`flex-1 py-1.5 rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                filters.viewMode === 'services'
                  ? 'bg-white text-[#2952AB] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Scissors size={13} />
              <span>الخدمات ({serviceResults.length})</span>
            </button>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'professionals' }))}
              className={`flex-1 py-1.5 rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                filters.viewMode === 'professionals'
                  ? 'bg-white text-[#2952AB] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserCheck size={13} />
              <span>الخبراء ({professionalResults.length})</span>
            </button>
          </div>

          {/* Active Filter Chips Bar */}
          <BeautyFilterChips
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {/* Results Count & Sorting Toolbar */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-gray-500 font-medium">
            عرض <strong className="text-gray-900 font-bold">{currentCount}</strong> خيار متاح للحجز
          </span>

          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-[#2952AB] font-bold bg-white px-2.5 py-1 rounded-[8px] border border-[#C2D1E8]/50 shadow-2xs"
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

        {/* VIEW 1: Business-First Discovery */}
        {filters.viewMode === 'businesses' && (
          <div className="space-y-3.5">
            {businessResults.map(({ business, relevantBranch }) => (
              <div
                key={business.id}
                className="bg-white rounded-[14px] border border-[#C2D1E8]/40 shadow-xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Cover & Badges */}
                <div className="relative h-32 w-full">
                  <img
                    src={business.coverUrls[0]}
                    alt={business.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-sm text-white">
                      {business.audience === 'women'
                        ? 'نسائي'
                        : business.audience === 'men'
                        ? 'رجالي'
                        : 'للجميع'}
                    </span>
                    {business.type === 'FREELANCER' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C69815] text-white">
                        مستقل
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-[6px] shadow-xs">
                    <Star size={12} className="fill-[#C69815] text-[#C69815]" />
                    <span className="text-xs font-bold text-gray-900">{business.rating}</span>
                    <span className="text-[10px] text-gray-500">({business.reviewsCount})</span>
                  </div>

                  {business.services.some((s) => s.homeServiceAvailable) && (
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-green-600/90 text-white px-2 py-0.5 rounded-[6px] text-[10px] font-bold">
                      <HomeIcon size={11} />
                      <span>خدمة منزلية</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-sm text-gray-900">{business.name}</h4>
                        {business.verified && <ShieldCheck size={15} className="text-[#2952AB]" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 text-[#2952AB] font-semibold">
                          <MapPin size={11} className="text-[#C69815]" />
                          {relevantBranch.name} • {relevantBranch.distanceKm} كم
                        </span>
                        <span>•</span>
                        <span>{relevantBranch.workingHours}</span>
                      </div>
                    </div>

                    <img
                      src={business.logoUrl}
                      alt={business.name}
                      className="w-10 h-10 rounded-[8px] object-cover border border-gray-100 flex-shrink-0"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
                    <Link
                      to={`/beauty/business/${business.id}?branchId=${relevantBranch.id}`}
                      className="flex-1 py-2 px-3 bg-[#2952AB] hover:bg-[#1D3D7A] text-white rounded-[8px] text-xs font-bold text-center shadow-xs transition-all active:scale-95"
                    >
                      عرض الخدمات والحجز
                    </Link>

                    {relevantBranch.queueActive && (
                      <Link
                        to={`/beauty/queue/${business.id}`}
                        className="py-2 px-3 bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1] rounded-[8px] text-xs font-bold text-center flex items-center gap-1"
                      >
                        <Zap size={12} className="text-[#C69815]" />
                        <span>طابور فوري ({relevantBranch.currentQueueCount})</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 2: Service-First Discovery (Bookable Services Cards) */}
        {filters.viewMode === 'services' && (
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

        {/* VIEW 3: Professional-First Discovery */}
        {filters.viewMode === 'professionals' && (
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

        {/* Intelligent Empty State with Contextual Recovery (US-Empty-States) */}
        {currentCount === 0 && (
          <div className="bg-white rounded-[16px] p-8 border border-[#C2D1E8]/50 shadow-sm text-center space-y-4 my-6">
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
                <span>مسح كافة الفلاتر والبدء من جديد</span>
              </button>

              {filters.serviceLocation === 'at_home' && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, serviceLocation: 'in_branch' }))}
                  className="w-full py-2 px-4 bg-white border border-[#2952AB] text-[#2952AB] rounded-[10px] text-xs font-bold hover:bg-[#F2F5FB] transition-all"
                >
                  التبديل إلى خدمة الصالون (In-Branch)
                </button>
              )}

              {filters.location.maxDistanceKm < 50 && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      location: { ...prev.location, maxDistanceKm: 50, selectedArea: 'all' },
                    }))
                  }
                  className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-[10px] text-xs font-bold hover:bg-gray-50 transition-all"
                >
                  توسيع نطاق المسافة الجغرافية
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Drawer Component */}
      <BeautyFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
}
