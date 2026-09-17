import { X, RotateCcw } from 'lucide-react';
import { BeautyFilterState, beautyBusinessTypesList } from '../../data/beauty-filter-types';
import { beautyCategories, beautyMasterCatalog, beautyBusinesses } from '../../data/beauty-mock-data';

interface BeautyFilterChipsProps {
  filters: BeautyFilterState;
  onRemoveFilter: (key: string, value?: any) => void;
  onClearAll: () => void;
}

export function BeautyFilterChips({ filters, onRemoveFilter, onClearAll }: BeautyFilterChipsProps) {
  const chips: { key: string; label: string; value?: any }[] = [];

  // Service Location
  if (filters.serviceLocation === 'at_home') {
    chips.push({ key: 'serviceLocation', label: 'خدمة منزلية 🏡' });
  } else if (filters.serviceLocation === 'in_branch') {
    chips.push({ key: 'serviceLocation', label: 'في الصالون 🏬' });
  }

  // Audience
  if (filters.audience === 'women') {
    chips.push({ key: 'audience', label: 'نسائي' });
  } else if (filters.audience === 'men') {
    chips.push({ key: 'audience', label: 'رجالي' });
  } else if (filters.audience === 'unisex') {
    chips.push({ key: 'audience', label: 'للجميع' });
  }

  // Location Area
  if (filters.location.selectedArea !== 'all') {
    chips.push({ key: 'area', label: filters.location.selectedArea });
  }

  // Distance
  if (filters.serviceLocation !== 'at_home' && filters.location.maxDistanceKm < 50) {
    chips.push({ key: 'distance', label: `ضمن ${filters.location.maxDistanceKm} كم` });
  }

  // Business Types
  filters.businessTypes.forEach((type) => {
    const found = beautyBusinessTypesList.find((b) => b.id === type);
    chips.push({ key: 'businessType', label: found ? found.label : type, value: type });
  });

  // Category
  if (filters.categoryId !== 'all') {
    const cat = beautyCategories.find((c) => c.id === filters.categoryId);
    chips.push({ key: 'categoryId', label: cat ? cat.name : filters.categoryId });
  }

  // Specific Service
  if (filters.serviceId !== 'all') {
    const srv = beautyMasterCatalog.find((s) => s.id === filters.serviceId);
    chips.push({ key: 'serviceId', label: srv ? srv.name : filters.serviceId });
  }

  // Professional
  if (filters.professionalId !== 'all') {
    const allPros = beautyBusinesses.flatMap((b) => b.professionals);
    const pro = allPros.find((p) => p.id === filters.professionalId);
    chips.push({ key: 'professionalId', label: pro ? pro.name : 'أخصائي محدد' });
  }

  // Availability
  if (filters.availability.timeframe === 'now') {
    chips.push({ key: 'availability', label: 'متاح الآن ⚡' });
  } else if (filters.availability.timeframe === 'today') {
    chips.push({ key: 'availability', label: 'متاح اليوم' });
  } else if (filters.availability.timeframe === 'tomorrow') {
    chips.push({ key: 'availability', label: 'متاح غداً' });
  } else if (filters.availability.timeframe === 'specific_date' && filters.availability.selectedDate) {
    chips.push({ key: 'availability', label: filters.availability.selectedDate });
  }

  // Price Range
  if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
    chips.push({
      key: 'priceRange',
      label: `${filters.priceRange.min} - ${filters.priceRange.max} ر.س`,
    });
  }

  // Rating
  if (filters.minRating > 0) {
    chips.push({ key: 'minRating', label: `${filters.minRating}+ ★` });
  }

  // Offers
  if (filters.onlyActiveOffers) {
    chips.push({ key: 'offers', label: 'عروض حصرية %' });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
      {/* Clear all chip */}
      <button
        onClick={onClearAll}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] whitespace-nowrap transition-all"
      >
        <RotateCcw size={12} />
        <span>مسح الكل ({chips.length})</span>
      </button>

      {/* Individual Filter Chips */}
      {chips.map((chip, idx) => (
        <span
          key={`${chip.key}-${idx}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F5FB] border border-[#2952AB]/30 text-[#2952AB] font-bold text-[11px] whitespace-nowrap shadow-2xs animate-fadeIn"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="hover:bg-[#2952AB]/20 p-0.5 rounded-full transition-colors"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </span>
      ))}
    </div>
  );
}
