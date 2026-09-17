export type BeautyBusinessType =
  | 'SALON'
  | 'BARBERSHOP'
  | 'SPA'
  | 'BEAUTY_CENTER'
  | 'NAIL_LASH_STUDIO'
  | 'FREELANCER';

export type BeautyAudience = 'all' | 'women' | 'men' | 'unisex';

export type BeautyServiceLocationMode = 'all' | 'in_branch' | 'at_home';

export type BeautyAvailabilityTimeframe =
  | 'any'
  | 'now'
  | 'today'
  | 'tomorrow'
  | 'specific_date';

export type BeautySortOption =
  | 'relevance'
  | 'nearest'
  | 'rating_desc'
  | 'price_asc'
  | 'price_desc'
  | 'earliest_avail';

export type BeautyViewMode = 'businesses' | 'services' | 'professionals';

export interface BeautyFilterLocation {
  mode: 'current' | 'selected_area';
  selectedArea: string; // 'all' or specific area like 'العليا'
  maxDistanceKm: number; // 5, 10, 25, 50
  homeAddress: string;
}

export interface BeautyFilterAvailability {
  timeframe: BeautyAvailabilityTimeframe;
  selectedDate?: string;
  selectedTimeSlot?: string;
}

export interface BeautyPriceRange {
  min: number;
  max: number;
}

export interface BeautyFilterState {
  searchQuery: string;
  location: BeautyFilterLocation;
  businessTypes: BeautyBusinessType[];
  audience: BeautyAudience;
  categoryId: string; // 'all' or category id
  serviceId: string; // 'all' or master service id
  professionalId: string; // 'all' or professional id
  minRating: number; // 0, 3, 4, 4.5, 5
  priceRange: BeautyPriceRange;
  availability: BeautyFilterAvailability;
  onlyActiveOffers: boolean;
  serviceLocation: BeautyServiceLocationMode;
  sortBy: BeautySortOption;
  viewMode: BeautyViewMode;
}

export const initialBeautyFilterState: BeautyFilterState = {
  searchQuery: '',
  location: {
    mode: 'current',
    selectedArea: 'all',
    maxDistanceKm: 25,
    homeAddress: 'حي العليا، الرياض',
  },
  businessTypes: [],
  audience: 'all',
  categoryId: 'all',
  serviceId: 'all',
  professionalId: 'all',
  minRating: 0,
  priceRange: {
    min: 0,
    max: 1000,
  },
  availability: {
    timeframe: 'any',
  },
  onlyActiveOffers: false,
  serviceLocation: 'all',
  sortBy: 'relevance',
  viewMode: 'businesses',
};

// Supported Areas in Riyadh
export const beautySupportedAreas = [
  { id: 'all', name: 'كافة الأحياء' },
  { id: 'العليا', name: 'حي العليا (وسط الرياض)' },
  { id: 'النخيل', name: 'حي النخيل (شمال الرياض)' },
  { id: 'الملقا', name: 'حي الملقا (شمال الرياض)' },
  { id: 'حطين', name: 'حي حطين (شمال غرب)' },
  { id: 'الياسمين', name: 'حي الياسمين' },
  { id: 'الصحافة', name: 'حي الصحافة' },
  { id: 'السليمانية', name: 'حي السليمانية' },
];

// Business types definitions
export const beautyBusinessTypesList: { id: BeautyBusinessType; label: string; icon: string }[] = [
  { id: 'SALON', label: 'صالون تجميل', icon: 'scissors' },
  { id: 'BARBERSHOP', label: 'حلاقة رجالية', icon: 'user-check' },
  { id: 'SPA', label: 'سبا واستجمام', icon: 'heart' },
  { id: 'BEAUTY_CENTER', label: 'مركز عناية شامل', icon: 'sparkles' },
  { id: 'NAIL_LASH_STUDIO', label: 'استوديو أظافر ورموش', icon: 'eye' },
  { id: 'FREELANCER', label: 'أخصائي/خبير مستقل', icon: 'palette' },
];

// Quick Price Tiers
export const beautyPriceTiers = [
  { label: 'الكل', min: 0, max: 1000 },
  { label: 'أقل من 100 ر.س', min: 0, max: 100 },
  { label: '100 - 250 ر.س', min: 100, max: 250 },
  { label: '250 - 500 ر.س', min: 250, max: 500 },
  { label: 'أكثر من 500 ر.س', min: 500, max: 1000 },
];
