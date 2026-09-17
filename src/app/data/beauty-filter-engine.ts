import {
  BeautyBusiness,
  BeautyBranch,
  BeautyBranchService,
  BeautyProfessional,
  beautyBusinesses,
} from './beauty-mock-data';
import { BeautyFilterState } from './beauty-filter-types';

export interface BookableServiceResult {
  serviceId: string;
  serviceName: string;
  categoryId: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  businessRating: number;
  branchId: string;
  branchName: string;
  branchAddress: string;
  distanceKm: number;
  price: number;
  homePrice?: number;
  durationMin: number;
  confirmationMode: 'AUTOMATIC' | 'MANUAL';
  homeServiceAvailable: boolean;
  eligibleProfessionals: BeautyProfessional[];
  hasActiveOffer: boolean;
  offerDiscount?: number;
}

export interface ProfessionalResult {
  professional: BeautyProfessional;
  business: BeautyBusiness;
  branch: BeautyBranch;
  services: BeautyBranchService[];
  hasHomeService: boolean;
}

/**
 * Filter Businesses according to full multi-dimensional criteria
 */
export function filterBusinesses(
  businesses: BeautyBusiness[],
  filters: BeautyFilterState
): { business: BeautyBusiness; relevantBranch: BeautyBranch }[] {
  const results: { business: BeautyBusiness; relevantBranch: BeautyBranch }[] = [];

  for (const biz of businesses) {
    // 1. Subscription & Approval Rule (Approved + Active + Valid Subscription)
    if (biz.subscriptionStatus !== 'ACTIVE') continue;

    // 2. Search Query (business name, description, services, professionals)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = biz.name.toLowerCase().includes(q) || biz.nameEn.toLowerCase().includes(q);
      const matchDesc = biz.description.toLowerCase().includes(q);
      const matchServices = biz.services.some((s) => s.name.toLowerCase().includes(q));
      const matchPros = biz.professionals.some((p) => p.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchServices && !matchPros) continue;
    }

    // 3. Business Types
    if (filters.businessTypes.length > 0) {
      if (!filters.businessTypes.includes(biz.type as any)) continue;
    }

    // 4. Audience / Gender (Business level or unisex)
    if (filters.audience !== 'all') {
      if (biz.audience !== filters.audience && biz.audience !== 'unisex') continue;
    }

    // 5. Rating
    if (filters.minRating > 0) {
      if (biz.rating < filters.minRating) continue;
    }

    // 6. Offers only
    if (filters.onlyActiveOffers) {
      if (!biz.offers || biz.offers.length === 0) continue;
    }

    // 7. Service Category
    if (filters.categoryId !== 'all') {
      const hasCategory = biz.services.some((s) => s.categoryId === filters.categoryId);
      if (!hasCategory) continue;
    }

    // 8. Specific Service
    if (filters.serviceId !== 'all') {
      const hasService = biz.services.some((s) => s.serviceId === filters.serviceId);
      if (!hasService) continue;
    }

    // 9. Specific Professional
    if (filters.professionalId !== 'all') {
      const hasPro = biz.professionals.some((p) => p.id === filters.professionalId);
      if (!hasPro) continue;
    }

    // 10. Service Location (In-Branch vs At-Home)
    if (filters.serviceLocation === 'at_home') {
      const supportsHome = biz.services.some((s) => s.homeServiceAvailable);
      if (!supportsHome) continue;
    }

    // 11. Branch matching (location, area, distance)
    // Find the best matching branch for this business
    let bestBranch: BeautyBranch | null = null;

    for (const branch of biz.branches) {
      // Area filter
      if (filters.location.selectedArea !== 'all') {
        const area = filters.location.selectedArea;
        const matchesAddress = branch.address.includes(area);
        const matchesSupportedHome = branch.supportedHomeAreas?.includes(area);
        if (filters.serviceLocation === 'at_home') {
          if (!matchesSupportedHome) continue;
        } else {
          if (!matchesAddress && !matchesSupportedHome) continue;
        }
      }

      // Max Distance (for in-branch)
      if (filters.serviceLocation !== 'at_home' && filters.location.maxDistanceKm < 50) {
        if (branch.distanceKm > filters.location.maxDistanceKm) continue;
      }

      // Availability: "Available Now" requires active queue or immediate capacity
      if (filters.availability.timeframe === 'now') {
        if (!branch.queueActive) continue;
      }

      // Price filter check at this branch's services
      if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
        const servicesInRange = biz.services.filter((s) => {
          const price = filters.serviceLocation === 'at_home' && s.homePrice ? s.homePrice : s.price;
          return price >= filters.priceRange.min && price <= filters.priceRange.max;
        });
        if (servicesInRange.length === 0) continue;
      }

      if (!bestBranch || branch.distanceKm < bestBranch.distanceKm) {
        bestBranch = branch;
      }
    }

    if (bestBranch) {
      results.push({ business: biz, relevantBranch: bestBranch });
    }
  }

  // Sorting
  results.sort((a, b) => {
    if (filters.sortBy === 'nearest') {
      return a.relevantBranch.distanceKm - b.relevantBranch.distanceKm;
    }
    if (filters.sortBy === 'rating_desc') {
      return b.business.rating - a.business.rating;
    }
    if (filters.sortBy === 'price_asc') {
      const minPriceA = Math.min(...a.business.services.map((s) => s.price));
      const minPriceB = Math.min(...b.business.services.map((s) => s.price));
      return minPriceA - minPriceB;
    }
    if (filters.sortBy === 'price_desc') {
      const maxPriceA = Math.max(...a.business.services.map((s) => s.price));
      const maxPriceB = Math.max(...b.business.services.map((s) => s.price));
      return maxPriceB - maxPriceA;
    }
    return b.business.rating - a.business.rating;
  });

  return results;
}

/**
 * Filter Services - Transforms discovery into actual bookable service cards (Service-First Flow)
 */
export function filterBookableServices(
  businesses: BeautyBusiness[],
  filters: BeautyFilterState
): BookableServiceResult[] {
  const results: BookableServiceResult[] = [];

  for (const biz of businesses) {
    if (biz.subscriptionStatus !== 'ACTIVE') continue;

    if (filters.businessTypes.length > 0 && !filters.businessTypes.includes(biz.type as any)) {
      continue;
    }

    if (filters.audience !== 'all' && biz.audience !== filters.audience && biz.audience !== 'unisex') {
      continue;
    }

    if (filters.minRating > 0 && biz.rating < filters.minRating) {
      continue;
    }

    const hasOffer = (biz.offers?.length || 0) > 0;
    if (filters.onlyActiveOffers && !hasOffer) {
      continue;
    }

    const branch = biz.branches.find((b) => b.isNearest) || biz.branches[0];

    // Check area
    if (filters.location.selectedArea !== 'all') {
      const area = filters.location.selectedArea;
      const matchesAddress = branch.address.includes(area);
      const matchesSupported = branch.supportedHomeAreas?.includes(area);
      if (!matchesAddress && !matchesSupported) continue;
    }

    for (const srv of biz.services) {
      // Query filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = srv.name.toLowerCase().includes(q) || srv.nameEn.toLowerCase().includes(q);
        const matchBiz = biz.name.toLowerCase().includes(q);
        if (!matchName && !matchBiz) continue;
      }

      // Category filter
      if (filters.categoryId !== 'all' && srv.categoryId !== filters.categoryId) {
        continue;
      }

      // Specific service
      if (filters.serviceId !== 'all' && srv.serviceId !== filters.serviceId) {
        continue;
      }

      // Service location
      if (filters.serviceLocation === 'at_home' && !srv.homeServiceAvailable) {
        continue;
      }

      // Price filter
      const price = filters.serviceLocation === 'at_home' && srv.homePrice ? srv.homePrice : srv.price;
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        continue;
      }

      // Eligible professionals for this service
      const eligiblePros = biz.professionals.filter(
        (p) => p.branchId === branch.id && (filters.serviceLocation !== 'at_home' || p.homeServiceAvailable)
      );

      if (filters.professionalId !== 'all') {
        const hasSpecificPro = eligiblePros.some((p) => p.id === filters.professionalId);
        if (!hasSpecificPro) continue;
      }

      results.push({
        serviceId: srv.serviceId,
        serviceName: srv.name,
        categoryId: srv.categoryId,
        businessId: biz.id,
        businessName: biz.name,
        businessLogo: biz.logoUrl,
        businessRating: biz.rating,
        branchId: branch.id,
        branchName: branch.name,
        branchAddress: branch.address,
        distanceKm: branch.distanceKm,
        price: srv.price,
        homePrice: srv.homePrice,
        durationMin: srv.durationMin,
        confirmationMode: srv.confirmationMode,
        homeServiceAvailable: srv.homeServiceAvailable,
        eligibleProfessionals: eligiblePros,
        hasActiveOffer: hasOffer,
        offerDiscount: biz.offers?.[0]?.discountPercent,
      });
    }
  }

  // Sorting
  results.sort((a, b) => {
    if (filters.sortBy === 'price_asc') return a.price - b.price;
    if (filters.sortBy === 'price_desc') return b.price - a.price;
    if (filters.sortBy === 'nearest') return a.distanceKm - b.distanceKm;
    if (filters.sortBy === 'rating_desc') return b.businessRating - a.businessRating;
    return b.businessRating - a.businessRating;
  });

  return results;
}

/**
 * Filter Professionals (Professional-First Flow)
 */
export function filterProfessionals(
  businesses: BeautyBusiness[],
  filters: BeautyFilterState
): ProfessionalResult[] {
  const results: ProfessionalResult[] = [];

  for (const biz of businesses) {
    if (biz.subscriptionStatus !== 'ACTIVE') continue;

    if (filters.businessTypes.length > 0 && !filters.businessTypes.includes(biz.type as any)) {
      continue;
    }

    if (filters.audience !== 'all' && biz.audience !== filters.audience && biz.audience !== 'unisex') {
      continue;
    }

    for (const pro of biz.professionals) {
      if (pro.status !== 'ACTIVE') continue;

      if (filters.professionalId !== 'all' && pro.id !== filters.professionalId) {
        continue;
      }

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = pro.name.toLowerCase().includes(q) || pro.nameEn.toLowerCase().includes(q);
        const matchSpecialty = pro.specialties.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchSpecialty) continue;
      }

      if (filters.minRating > 0 && pro.rating < filters.minRating) {
        continue;
      }

      if (filters.serviceLocation === 'at_home' && !pro.homeServiceAvailable) {
        continue;
      }

      const branch = biz.branches.find((b) => b.id === pro.branchId) || biz.branches[0];

      if (filters.location.selectedArea !== 'all') {
        const area = filters.location.selectedArea;
        const matchesAddress = branch.address.includes(area);
        const matchesSupported = branch.supportedHomeAreas?.includes(area);
        if (!matchesAddress && !matchesSupported) continue;
      }

      results.push({
        professional: pro,
        business: biz,
        branch,
        services: biz.services,
        hasHomeService: pro.homeServiceAvailable,
      });
    }
  }

  // Sorting
  results.sort((a, b) => {
    if (filters.sortBy === 'rating_desc') return b.professional.rating - a.professional.rating;
    if (filters.sortBy === 'nearest') return a.branch.distanceKm - b.branch.distanceKm;
    return b.professional.rating - a.professional.rating;
  });

  return results;
}

/**
 * Get accurate total results count for live filter button
 */
export function getFilterResultsCount(
  businesses: BeautyBusiness[],
  filters: BeautyFilterState
): number {
  if (filters.viewMode === 'services') {
    return filterBookableServices(businesses, filters).length;
  }
  if (filters.viewMode === 'professionals') {
    return filterProfessionals(businesses, filters).length;
  }
  return filterBusinesses(businesses, filters).length;
}
