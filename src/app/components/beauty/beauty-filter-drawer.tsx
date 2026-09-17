import { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  MapPin,
  Clock,
  Star,
  Sparkles,
  Scissors,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Check,
  Home as HomeIcon,
  Store,
  SlidersHorizontal,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  BeautyFilterState,
  beautySupportedAreas,
  beautyBusinessTypesList,
  beautyPriceTiers,
  BeautyBusinessType,
  initialBeautyFilterState,
} from '../../data/beauty-filter-types';
import {
  beautyCategories,
  beautyMasterCatalog,
  beautyBusinesses,
} from '../../data/beauty-mock-data';
import { getFilterResultsCount } from '../../data/beauty-filter-engine';

interface BeautyFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: BeautyFilterState;
  onApply: (newFilters: BeautyFilterState) => void;
}

export function BeautyFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApply,
}: BeautyFilterDrawerProps) {
  // Local state for editing before applying
  const [localFilters, setLocalFilters] = useState<BeautyFilterState>(filters);

  // Sync with prop when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  // Collapsible section states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    serviceLocation: true,
    location: true,
    businessType: false,
    audience: true,
    category: false,
    specificService: false,
    availability: true,
    price: true,
    rating: false,
    offers: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Live count of matching results for the local edits
  const liveCount = getFilterResultsCount(beautyBusinesses, localFilters);

  // Active filters count
  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.serviceLocation !== 'all') count++;
    if (localFilters.audience !== 'all') count++;
    if (localFilters.location.selectedArea !== 'all') count++;
    if (localFilters.location.maxDistanceKm < 50) count++;
    if (localFilters.businessTypes.length > 0) count += localFilters.businessTypes.length;
    if (localFilters.categoryId !== 'all') count++;
    if (localFilters.serviceId !== 'all') count++;
    if (localFilters.professionalId !== 'all') count++;
    if (localFilters.minRating > 0) count++;
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 1000) count++;
    if (localFilters.availability.timeframe !== 'any') count++;
    if (localFilters.onlyActiveOffers) count++;
    return count;
  };

  const handleReset = () => {
    setLocalFilters({
      ...initialBeautyFilterState,
      searchQuery: localFilters.searchQuery,
      viewMode: localFilters.viewMode,
      sortBy: localFilters.sortBy,
    });
  };

  const handleBusinessTypeToggle = (type: BeautyBusinessType) => {
    setLocalFilters((prev) => {
      const exists = prev.businessTypes.includes(type);
      const newTypes = exists
        ? prev.businessTypes.filter((t) => t !== type)
        : [...prev.businessTypes, type];
      return { ...prev, businessTypes: newTypes };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 transition-all" dir="rtl">
      <div className="bg-white rounded-t-[24px] w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
        {/* Sticky Drawer Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-[24px] sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#2952AB]" />
            <h3 className="font-bold text-base text-gray-900">تصفية نتائج الجمال</h3>
            {getActiveFilterCount() > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-[#A88012] hover:text-[#C69815] flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={13} />
              <span>إعادة تعيين</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 text-xs">
          {/* SECTION 1: Service Location (In Branch vs At Home) */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('serviceLocation')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <Store size={16} className="text-[#2952AB]" />
                <span>مكان تقديم الخدمة (Service Location)</span>
              </div>
              {openSections.serviceLocation ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.serviceLocation && (
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'الكل (كلاهما)' },
                  { id: 'in_branch', label: 'في الصالون 🏬' },
                  { id: 'at_home', label: 'خدمة منزلية 🏡' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        serviceLocation: mode.id as any,
                      }))
                    }
                    className={`py-2.5 px-2 rounded-[10px] text-xs font-bold border transition-all text-center ${
                      localFilters.serviceLocation === mode.id
                        ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Gender / Audience */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('audience')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-[#2952AB]" />
                <span>الفئة المستهدفة (Gender / Audience)</span>
              </div>
              {openSections.audience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.audience && (
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'الجميع' },
                  { id: 'women', label: 'صالونات نسائية' },
                  { id: 'men', label: 'حلاقة رجالية' },
                ].map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        audience: aud.id as any,
                      }))
                    }
                    className={`py-2.5 px-2 rounded-[10px] text-xs font-bold border transition-all text-center ${
                      localFilters.audience === aud.id
                        ? 'bg-[#2952AB] text-white border-[#2952AB] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: Availability Engine */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#C69815]" />
                <span>الموعد والتوفر (Availability Engine)</span>
              </div>
              {openSections.availability ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.availability && (
              <div className="mt-2.5 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'any', label: 'أي وقت' },
                    { id: 'now', label: 'متاح الآن ⚡ (طابور مباشر)' },
                    { id: 'today', label: 'متاح اليوم' },
                    { id: 'tomorrow', label: 'متاح غداً' },
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          availability: { ...prev.availability, timeframe: tf.id as any },
                        }))
                      }
                      className={`py-2.5 px-3 rounded-[10px] text-xs font-bold border transition-all text-center ${
                        localFilters.availability.timeframe === tf.id
                          ? 'bg-[#C69815] text-white border-[#C69815] shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#C69815]/30'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Location & Distance */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('location')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#2952AB]" />
                <span>الموقع والنطاق الجغرافي (Location & Radius)</span>
              </div>
              {openSections.location ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.location && (
              <div className="mt-2.5 space-y-3">
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">اختر الحي أو المنطقة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {beautySupportedAreas.map((area) => (
                      <button
                        key={area.id}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            location: { ...prev.location, selectedArea: area.id },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          localFilters.location.selectedArea === area.id
                            ? 'bg-[#2952AB] text-white border-[#2952AB]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#2952AB]/30'
                        }`}
                      >
                        {area.name}
                      </button>
                    ))}
                  </div>
                </div>

                {localFilters.serviceLocation !== 'at_home' && (
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">أقصى مسافة للصالون:</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { km: 5, label: '5 كم' },
                        { km: 10, label: '10 كم' },
                        { km: 25, label: '25 كم' },
                        { km: 50, label: 'الكل' },
                      ].map((dist) => (
                        <button
                          key={dist.km}
                          onClick={() =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              location: { ...prev.location, maxDistanceKm: dist.km },
                            }))
                          }
                          className={`py-1.5 rounded-[8px] text-xs font-bold border text-center ${
                            localFilters.location.maxDistanceKm === dist.km
                              ? 'bg-[#2952AB] text-white border-[#2952AB]'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {dist.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 5: Business Type */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('businessType')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <Scissors size={16} className="text-[#2952AB]" />
                <span>نوع المركز أو النشاط (Business Type)</span>
              </div>
              {openSections.businessType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.businessType && (
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {beautyBusinessTypesList.map((type) => {
                  const isChecked = localFilters.businessTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleBusinessTypeToggle(type.id)}
                      className={`p-2.5 rounded-[10px] text-xs font-semibold border text-right flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-[#2952AB] bg-[#F2F5FB] text-[#2952AB] font-bold shadow-2xs'
                          : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span>{type.label}</span>
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#2952AB] border-[#2952AB] text-white' : 'border-gray-300'
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 6: Service Category & Specific Service (Service-First Selection) */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('specificService')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#C69815]" />
                <span>تحديد خدمة معينة (Service Filter)</span>
              </div>
              {openSections.specificService ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.specificService && (
              <div className="mt-2.5 space-y-3">
                <div>
                  <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">فئة الخدمة:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          categoryId: 'all',
                          serviceId: 'all',
                        }))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        localFilters.categoryId === 'all'
                          ? 'bg-[#2952AB] text-white border-[#2952AB]'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      كافة الفئات
                    </button>
                    {beautyCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            categoryId: cat.id,
                            serviceId: 'all',
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          localFilters.categoryId === cat.id
                            ? 'bg-[#2952AB] text-white border-[#2952AB]'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-gray-500 block mb-1.5 font-medium">الخدمة المحددة من الكتالوج:</span>
                  <select
                    value={localFilters.serviceId}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        serviceId: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-[10px] text-xs font-medium text-gray-900"
                  >
                    <option value="all">كافة الخدمات (عرض شامل)</option>
                    {beautyMasterCatalog
                      .filter(
                        (s) =>
                          localFilters.categoryId === 'all' || s.categoryId === localFilters.categoryId
                      )
                      .map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} ({srv.defaultDurationMin}د)
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    * اختيار خدمة معينة يحول النتائج مباشرة إلى أسعار ومواعيد محددة قابلة للحجز.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 7: Price Range */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('price')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[#2952AB]" />
                <span>نطاق السعر (Price Range)</span>
              </div>
              {openSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.price && (
              <div className="mt-2.5 space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {beautyPriceTiers.map((tier, idx) => {
                    const isSelected =
                      localFilters.priceRange.min === tier.min &&
                      localFilters.priceRange.max === tier.max;
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            priceRange: { min: tier.min, max: tier.max },
                          }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          isSelected
                            ? 'bg-[#2952AB] text-white border-[#2952AB]'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 8: Rating */}
          <div className="border-b border-gray-100 pb-3.5">
            <button
              onClick={() => toggleSection('rating')}
              className="w-full flex items-center justify-between py-1 font-bold text-gray-900 text-sm"
            >
              <div className="flex items-center gap-2">
                <Star size={16} className="text-[#C69815]" />
                <span>تقييم العملاء (Rating)</span>
              </div>
              {openSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.rating && (
              <div className="mt-2.5 grid grid-cols-4 gap-2">
                {[
                  { rating: 0, label: 'الكل' },
                  { rating: 4.0, label: '4.0+ ★' },
                  { rating: 4.5, label: '4.5+ ★' },
                  { rating: 4.9, label: 'الأعلى ★' },
                ].map((r) => (
                  <button
                    key={r.rating}
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minRating: r.rating,
                      }))
                    }
                    className={`py-2 rounded-[8px] text-xs font-bold border text-center ${
                      localFilters.minRating === r.rating
                        ? 'bg-[#C69815] text-white border-[#C69815]'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 9: Special Offers Toggle */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FEF8E7] to-white rounded-[12px] border border-[#C69815]/30">
            <div>
              <span className="font-bold text-xs text-gray-900 block">عروض وخصومات نشطة فقط %</span>
              <span className="text-[11px] text-gray-500">إظهار الصالونات التي تقدم عروض حصرية حالياً</span>
            </div>
            <input
              type="checkbox"
              checked={localFilters.onlyActiveOffers}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, onlyActiveOffers: e.target.checked }))
              }
              className="w-5 h-5 accent-[#C69815] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Sticky Drawer Footer CTA */}
        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10 flex gap-3">
          <button
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] hover:from-[#1D3D7A] hover:to-[#2952AB] text-white rounded-[12px] text-sm font-bold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>تطبيق التصفية</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono">
              ({liveCount} نتيجة)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
