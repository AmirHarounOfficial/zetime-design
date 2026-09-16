import { useState } from 'react';
import { 
  ChevronLeft, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  SlidersHorizontal, 
  X, 
  Utensils, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Navigation,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { foodRestaurants, FoodRestaurant } from '../../data/mock-data';

export function FoodRestaurantListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'All',
    rating: 0,
    country: 'All',
    city: 'All',
    sortBy: 'Fastest'
  });

  const cuisines = ['All', 'Italian', 'Japanese', 'American', 'Chinese', 'Healthy', 'Bakery'];
  
  const locations = [
    { country: 'Turkey', cities: ['Istanbul', 'Ankara', 'Izmir'] },
    { country: 'UAE', cities: ['Dubai', 'Abu Dhabi'] }
  ];

  const popularRestaurants = foodRestaurants.filter(r => r.popular);

  const filteredRestaurants = foodRestaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesRating = restaurant.rating >= filters.rating;
    const matchesCountry = filters.country === 'All' || restaurant.country === filters.country;
    const matchesCity = filters.city === 'All' || restaurant.city === filters.city;

    return matchesSearch && matchesCuisine && matchesRating && matchesCountry && matchesCity;
  });

  const sortRestaurants = (list: FoodRestaurant[]) => {
    switch (filters.sortBy) {
      case 'Rating': return [...list].sort((a, b) => b.rating - a.rating);
      case 'Fastest': return [...list].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
      case 'Cost': return [...list].sort((a, b) => a.deliveryFee - b.deliveryFee);
      default: return list;
    }
  };

  const finalRestaurants = sortRestaurants(filteredRestaurants);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32">
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#C2D1E8]/10">
        <div className="max-w-md mx-auto px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB] shadow-sm active:scale-90 transition-all"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none mb-1">Go Delivery</h1>
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-[#C69815]" strokeWidth={2.5} />
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                    {filters.city !== 'All' ? `${filters.city}, ${filters.country}` : 'Select Location'}
                  </p>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#2952AB] rounded-[10px] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all">
              <Search size={18} />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C69815]" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Hungry for something?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-[#C2D1E8]/10 pl-11 pr-4 py-3.5 rounded-[10px] text-xs font-bold text-[#2952AB] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={() => setShowFilter(true)}
              className={`w-12 h-12 flex items-center justify-center rounded-[10px] border transition-all ${
                showFilter || filters.country !== 'All'
                  ? 'bg-[#C69815] border-[#C69815] text-white shadow-lg shadow-[#C69815]/20'
                  : 'bg-white border-[#C2D1E8]/30 text-[#2952AB]'
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Horizontal Cuisine Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCuisine === c
                    ? 'bg-[#2952AB] text-white shadow-md'
                    : 'bg-white text-gray-400 border border-[#C2D1E8]/20'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Popular Near You - Horizontal Scroll */}
        <section className="mt-6 px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-[#2952AB] uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-[#C69815]" />
              Popular Near You
            </h2>
            <button className="text-[10px] font-black text-[#C69815] uppercase tracking-widest">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
            {popularRestaurants.map((res) => (
              <button
                key={res.id}
                onClick={() => navigate(`/food-delivery/${res.id}`)}
                className="flex-shrink-0 w-64 bg-white rounded-[10px] overflow-hidden border border-[#C2D1E8]/20 shadow-sm active:scale-95 transition-all"
              >
                <div className="relative h-36">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="bg-[#C69815] text-white text-[7px] font-black px-2 py-1 rounded-[5px] uppercase">
                      Top Rated
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-[5px] flex items-center gap-1">
                      <Clock size={10} className="text-[#C69815]" />
                      <span className="text-[8px] font-black text-[#2952AB]">{res.deliveryTime}</span>
                    </div>
                    <div className="bg-[#2952AB] px-2 py-1 rounded-[5px] text-white text-[8px] font-black">
                      ${res.deliveryFee} Fee
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-black text-[#2952AB] truncate mb-1 uppercase tracking-wider">{res.name}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-[#C69815] fill-[#C69815]" />
                      <span className="text-[10px] font-bold text-gray-700">{res.rating}</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span className="text-[10px] font-medium text-gray-500">{res.cuisine}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* All Restaurants List */}
        <section className="mt-8 px-6 pb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-[#2952AB] uppercase tracking-widest">All Restaurants</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
               {finalRestaurants.length} results found
            </div>
          </div>
          
          <div className="space-y-6">
            {finalRestaurants.map((res) => (
              <button
                key={res.id}
                onClick={() => navigate(`/food-delivery/${res.id}`)}
                className="w-full bg-white rounded-[10px] overflow-hidden border border-[#C2D1E8]/20 shadow-sm active:scale-[0.98] transition-all flex h-28 group"
              >
                <div className="w-28 relative flex-shrink-0">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-1 left-1">
                    <div className="bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5">
                      <Star size={8} className="text-[#C69815] fill-[#C69815]" />
                      <span className="text-[8px] font-black text-[#2952AB]">{res.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-xs font-black text-[#2952AB] uppercase tracking-wider">{res.name}</h3>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{res.cuisine}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                      {res.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="flex gap-3">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-[#C69815]" />
                        <span className="text-[9px] font-bold text-gray-600">{res.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Navigation size={12} className="text-[#C69815]" />
                        <span className="text-[9px] font-bold text-gray-600">{res.distance || '2.0 km'}</span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-[#E4ECF7] rounded-[4px] text-[8px] font-black text-[#2952AB]">
                      MIN. ORDER ${res.minimumOrder}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Advanced Filter Dialog */}
      {showFilter && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-[#2952AB]/40 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#C2D1E8]/20 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#2952AB] uppercase tracking-widest">Refine Search</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customize your discovery</p>
              </div>
              <button 
                onClick={() => setShowFilter(false)}
                className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-[10px] text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {/* Location Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                  <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Location</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Country</label>
                    <select 
                      value={filters.country}
                      onChange={(e) => setFilters(f => ({ ...f, country: e.target.value, city: 'All' }))}
                      className="w-full bg-gray-50 border border-[#C2D1E8]/10 px-4 py-3 rounded-[10px] text-xs font-bold text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#C69815]/20"
                    >
                      <option value="All">All Countries</option>
                      {locations.map(l => <option key={l.country} value={l.country}>{l.country}</option>)}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">City</label>
                    <select 
                      disabled={filters.country === 'All'}
                      value={filters.city}
                      onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                      className="w-full bg-gray-50 border border-[#C2D1E8]/10 px-4 py-3 rounded-[10px] text-xs font-bold text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 disabled:opacity-50"
                    >
                      <option value="All">All Cities</option>
                      {locations.find(l => l.country === filters.country)?.cities.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                  <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Sort By</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Fastest', 'Rating', 'Cost'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilters(f => ({ ...f, sortBy: s }))}
                      className={`py-3 rounded-[10px] text-[9px] font-black uppercase tracking-widest transition-all ${
                        filters.sortBy === s
                          ? 'bg-[#2952AB] text-white shadow-lg'
                          : 'bg-gray-50 text-gray-400 border border-[#C2D1E8]/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                  <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Rating</h3>
                </div>
                <div className="flex gap-3">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters(f => ({ ...f, rating: r }))}
                      className={`flex-1 py-3 rounded-[10px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1 ${
                        filters.rating === r
                          ? 'bg-[#C69815] text-white shadow-lg'
                          : 'bg-gray-50 text-gray-400 border border-[#C2D1E8]/10'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                      {r > 0 && <Star size={10} fill={filters.rating === r ? 'white' : 'transparent'} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-[#C2D1E8]/10 bg-gray-50/50 flex gap-4">
              <button 
                onClick={() => {
                  setFilters({ priceRange: 'All', rating: 0, country: 'All', city: 'All', sortBy: 'Fastest' });
                  setSelectedCuisine('All');
                }}
                className="flex-1 py-4 text-[10px] font-black text-[#2952AB] uppercase tracking-widest"
              >
                Reset All
              </button>
              <button 
                onClick={() => setShowFilter(false)}
                className="flex-[2] bg-[#2952AB] text-white py-4 rounded-[10px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#2952AB]/20"
              >
                Show {finalRestaurants.length} Restaurants
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
