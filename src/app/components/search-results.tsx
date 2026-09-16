import { useState, useEffect } from 'react';
import { ChevronLeft, Search, TrendingUp, Clock, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { BottomNav } from './bottom-nav';
import { featuredServices } from '../data/mock-data';

export function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState([
    'Car wash near me',
    'Property rental',
    'Italian restaurant',
    'Parcel delivery'
  ]);

  // Mock search results - in real app this would be filtered based on searchQuery
  const modules = [
    { id: 'home-services', name: 'Home Services', route: '/module/home-services', category: 'Services' },
    { id: 'car-services', name: 'Car Services', route: '/module/car-services', category: 'Services' },
    { id: 'street-assistant', name: 'Street Assistant', route: '/module/street-assistant', category: 'Emergency' },
    { id: 'property-rental', name: 'Property Rental', route: '/module/property-rental', category: 'Booking' },
    { id: 'restaurant-tables', name: 'Restaurant Tables', route: '/module/restaurant-tables', category: 'Booking' },
    { id: 'food-delivery', name: 'Food Delivery', route: '/module/food-delivery', category: 'Food' },
    { id: 'parcel-delivery', name: 'Parcel Delivery', route: '/module/parcel-delivery', category: 'Delivery' }
  ];

  const filteredModules = searchQuery
    ? modules.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredServices = searchQuery
    ? featuredServices.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const hasResults = filteredModules.length > 0 || filteredServices.length > 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Search</h1>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search services, restaurants, properties..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="w-full pl-12 pr-12 py-3 bg-white border border-[#C2D1E8]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1"
              >
                <X size={18} className="text-gray-400" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {!searchQuery ? (
          /* Recent Searches & Trending */
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" strokeWidth={1.5} />
                    <h2 className="text-sm font-medium text-[#2952AB]">Recent Searches</h2>
                  </div>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-xs text-gray-500"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white rounded-[10px] p-3 border border-[#C2D1E8]/30"
                    >
                      <button
                        onClick={() => setSearchQuery(search)}
                        className="flex-1 text-left text-sm text-gray-700"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(search)}
                        className="p-1 hover:bg-gray-100 rounded-[10px]"
                      >
                        <X size={14} className="text-gray-400" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-[#C69815]" strokeWidth={1.5} />
                <h2 className="text-sm font-medium text-[#2952AB]">Trending Now</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Car Wash', 'Italian Food', 'Downtown Hotels', 'Emergency Services', 'Home Cleaning'].map((trend, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(trend)}
                    className="px-3 py-2 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] border border-[#C2D1E8]/30 rounded-full text-sm text-gray-700 hover:border-[#C69815]/50 transition-colors"
                  >
                    {trend}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <h2 className="text-sm font-medium text-[#2952AB] mb-3">Quick Access</h2>
              <div className="grid grid-cols-2 gap-3">
                {modules.slice(0, 6).map((module) => (
                  <Link
                    key={module.id}
                    to={module.route}
                    className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 hover:shadow-md transition-all"
                  >
                    <span className="text-xs text-[#C69815] mb-1 block">{module.category}</span>
                    <h3 className="text-sm font-medium text-gray-900">{module.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : hasResults ? (
          /* Search Results */
          <div className="space-y-6">
            {/* Modules Results */}
            {filteredModules.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#2952AB] mb-3">
                  Modules ({filteredModules.length})
                </h2>
                <div className="space-y-2">
                  {filteredModules.map((module) => (
                    <Link
                      key={module.id}
                      to={module.route}
                      className="block bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#C69815] block mb-1">{module.category}</span>
                          <h3 className="font-medium text-gray-900">{module.name}</h3>
                        </div>
                        <div className="w-8 h-8 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                          <Search size={16} className="text-[#2952AB]" strokeWidth={1.5} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Services Results */}
            {filteredServices.length > 0 && (
              <div>
                <h2 className="text-sm font-medium text-[#2952AB] mb-3">
                  Services ({filteredServices.length})
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {filteredServices.map((service) => (
                    <Link
                      key={service.id}
                      to={`/featured-services/${service.id}`}
                      className="bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30"
                    >
                      <div className="relative h-32">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        {service.badge && (
                          <span className="absolute top-2 right-2 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-2 py-0.5 rounded-full">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                          {service.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {service.subtitle}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-500 mb-6">
              Try searching for something else or browse our services
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white px-6 py-3 rounded-[10px] font-medium"
            >
              Browse All Services
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
