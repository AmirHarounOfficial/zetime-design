import { useState } from 'react';
import { ChevronLeft, Search, Star, SlidersHorizontal, X } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { serviceCategories, Service } from '../../data/mock-data';

export function ServiceListing() {
  const { module, categoryId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');

  const category = serviceCategories.find(c => c.id === categoryId && c.module === module);

  if (!category) {
    return <div>Category not found</div>;
  }

  // Filter and sort services
  let filteredServices = category.services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Price filter
  if (priceRange === 'under-50') {
    filteredServices = filteredServices.filter(s => s.price < 50);
  } else if (priceRange === '50-100') {
    filteredServices = filteredServices.filter(s => s.price >= 50 && s.price <= 100);
  } else if (priceRange === 'over-100') {
    filteredServices = filteredServices.filter(s => s.price > 100);
  }

  // Sort
  if (selectedSort === 'price-low') {
    filteredServices.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'price-high') {
    filteredServices.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'rating') {
    filteredServices.sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === 'popular') {
    filteredServices.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  const formatPrice = (service: Service) => {
    if (service.price === 0) return 'مجاني';

    // Calculate price range from providers
    const providerPrices = service.providers
      .map(p => p.price || service.price)
      .filter(p => p > 0);

    if (providerPrices.length > 0) {
      const minPrice = Math.min(...providerPrices);
      const maxPrice = Math.max(...providerPrices);

      if (minPrice === maxPrice) {
        return `${minPrice}$`;
      }
      return `تبدأ من ${minPrice}$`;
    }

    return `تبدأ من ${service.price}$`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => navigate(-1)} className="p-1">
                <ChevronLeft size={24} className="text-[#2952AB] rotate-180" strokeWidth={1.5} />
              </button>
              <div>
                <h1 className="font-medium text-[#2952AB]">{category.name}</h1>
                <p className="text-xs text-[#2952AB]/60">{category.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-[10px] shadow-sm border border-[#C2D1E8]/20 flex items-center justify-center"
            >
              <SlidersHorizontal size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A9ACB]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder={`ابحث عن خدمات ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] pr-11 pl-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm text-sm text-[#2952AB] placeholder:text-[#2952AB]/60 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20"
            />
          </div>
        </div>
      </div>

      {/* Service List */}
      <div className="max-w-md mx-auto px-4 mt-6 space-y-3">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#2952AB]/60">لم يتم العثور على خدمات</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <Link
              key={service.id}
              to={`/module/${module}/${categoryId}/${service.id}`}
              className="block bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30 hover:border-[#2952AB]/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    {service.popular && (
                      <span className="text-[10px] bg-gradient-to-r from-[#C69815] to-[#A88012] text-white px-2 py-0.5 rounded-full">
                        شائع
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#C2D1E8]/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-[#C69815] fill-[#C69815]" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                    <span className="text-xs text-gray-500">({service.reviews})</span>
                  </div>
                  <span className="text-xs text-gray-500">{service.duration}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[#2952AB]">{formatPrice(service)}</div>
                  <div className="text-xs text-green-600">{service.availability}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-white rounded-t-[10px] shadow-2xl pb-8">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#C2D1E8]/30">
                <h3 className="font-medium text-[#2952AB]">الفلاتر</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#E4ECF7]"
                >
                  <X size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium text-[#2952AB] mb-3">ترتيب حسب</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'popular', label: 'الأكثر شهرة' },
                      { id: 'rating', label: 'الأعلى تقييماً' },
                      { id: 'price-low', label: 'السعر: من الأقل للأعلى' },
                      { id: 'price-high', label: 'السعر: من الأعلى للأقل' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedSort(option.id)}
                        className={`w-full px-4 py-3 rounded-[10px] border text-sm text-right transition-all ${
                          selectedSort === option.id
                            ? 'bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]'
                            : 'bg-white text-gray-700 border-[#C2D1E8]/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-[#2952AB] mb-3">نطاق السعر</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'جميع الأسعار' },
                      { id: 'under-50', label: 'أقل من 50$' },
                      { id: '50-100', label: '50$ - 100$' },
                      { id: 'over-100', label: 'أكثر من 100$' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPriceRange(option.id)}
                        className={`w-full px-4 py-3 rounded-[10px] border text-sm text-right transition-all ${
                          priceRange === option.id
                            ? 'bg-gradient-to-r from-[#C69815] to-[#A88012] text-white border-[#C69815]'
                            : 'bg-white text-gray-700 border-[#C2D1E8]/30'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-3 rounded-[10px] font-medium shadow-md"
                >
                  تطبيق الفلاتر
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
