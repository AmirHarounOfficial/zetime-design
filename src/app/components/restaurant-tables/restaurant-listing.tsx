import { useState } from 'react';
import { ChevronLeft, Search, Star, MapPin, Clock, SlidersHorizontal, X, Utensils, Globe, ShieldCheck, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { restaurants, Restaurant } from '../../data/mock-data';

export function RestaurantListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 'All',
    rating: 0,
    area: 'All',
    country: 'All',
    city: 'All'
  });

  const cuisines = ['All', 'Contemporary', 'Italian', 'Japanese', 'Steakhouse', 'Mediterrean'];
  const areas = ['All', 'garden', 'pool', 'street', 'kitchen'];
  
  const locations = [
    { country: 'USA', cities: ['San Francisco', 'New York', 'Los Angeles'] },
    { country: 'UAE', cities: ['Dubai', 'Abu Dhabi'] }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesPrice = filters.priceRange === 'All' || restaurant.priceRange === filters.priceRange;
    const matchesRating = restaurant.rating >= filters.rating;
    const matchesArea = filters.area === 'All' || restaurant.halls.some(h => h.view === filters.area);
    const matchesCountry = filters.country === 'All' || restaurant.country === filters.country;
    const matchesCity = filters.city === 'All' || restaurant.city === filters.city;

    return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesArea && matchesCountry && matchesCity;
  });

  const hallViewIcons: Record<string, string> = {
    garden: '🌿',
    pool: '🏊‍♂️',
    street: '🏙️',
    kitchen: '👨‍🍳'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32">
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#C2D1E8]/20">
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
                <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none mb-1">Dine-In</h1>
                <p className="text-[10px] font-black text-[#C69815] uppercase tracking-widest opacity-80">Book your table</p>
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
                placeholder="Find a restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-[#C2D1E8]/10 pl-11 pr-4 py-3.5 rounded-[10px] text-xs font-bold text-[#2952AB] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={() => setShowFilter(true)}
              className={`w-12 h-12 flex items-center justify-center rounded-[10px] border transition-all ${
                showFilter || filters.priceRange !== 'All' || filters.rating > 0 || filters.area !== 'All' || filters.country !== 'All'
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

      {/* Restaurant List */}
      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="group block bg-white rounded-[10px] overflow-hidden shadow-sm border border-[#C2D1E8]/20 hover:border-[#C69815] transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-56">
                <img src={restaurant.images[0]} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  {restaurant.popular && (
                    <span className="bg-[#C69815] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <Zap size={10} fill="white" />
                      Popular
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-md text-[#2952AB] text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    {restaurant.cuisine}
                  </span>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-1 items-end">
                  <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white text-[9px] font-black px-3 py-1.5 rounded-[8px] shadow-lg flex items-center gap-2">
                     <MapPin size={10} className="text-[#C69815]" />
                     {restaurant.distance}
                  </div>
                  <div className="bg-white/90 backdrop-blur-md text-[#2952AB] text-[8px] font-black px-2 py-1 rounded-[8px] flex items-center gap-1 shadow-sm">
                     <Clock size={10} className="text-[#C69815]" />
                     {restaurant.travelTime}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-lg font-black tracking-tight leading-tight mb-1">{restaurant.name}</h3>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin size={10} className="text-[#C69815]" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{restaurant.city}, {restaurant.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-[#C69815] fill-[#C69815]" />
                        <span className="text-xs font-black">{restaurant.rating}</span>
                        <span className="text-[10px] font-bold text-white/60">({restaurant.reviews} Reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {restaurant.halls.slice(0, 2).map((hall, hidx) => (
                      <div key={hidx} className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[14px]">
                        {hallViewIcons[hall.view]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={12} className="text-[#C69815]" />
                    <p className="text-[10px] font-bold truncate max-w-[200px]">{restaurant.address}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={12} className="text-[#C69815]" />
                    <p className="text-[10px] font-bold">{restaurant.openingHours}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#C69815] uppercase tracking-widest mb-1">Pricing</p>
                  <p className="text-sm font-black text-[#2952AB]">{restaurant.priceRange}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C2D1E8]/20">
              <Utensils size={32} className="text-[#C2D1E8]/40" />
            </div>
            <h3 className="text-lg font-black text-[#2952AB]">No Venues Found</h3>
            <p className="text-sm font-bold text-gray-400 mt-2">Try adjusting your category or filters</p>
          </div>
        )}
      </div>

      {/* Filter Bottom Sheet */}
      {showFilter && (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowFilter(false)} />
          <div className="absolute inset-x-0 bottom-0 bg-[#F2F5FB] rounded-t-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[90vh]">
            <div className="p-8 flex items-center justify-between border-b border-[#C2D1E8]/10 bg-white rounded-t-[40px] sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="text-[#C69815]" size={20} />
                <h2 className="text-lg font-black text-[#2952AB] uppercase tracking-tighter">Advanced Filters</h2>
              </div>
              <button 
                onClick={() => setShowFilter(false)}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[#2952AB]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-white">
              {/* Location Filter */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] px-1">Location Preference</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                    <div className="relative">
                      <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C69815]" />
                      <select 
                        className="w-full bg-gray-50 border border-gray-100 rounded-[10px] pl-9 pr-4 py-3 text-xs font-black text-[#2952AB] appearance-none focus:outline-none focus:ring-2 focus:ring-[#C69815]/20"
                        value={filters.country}
                        onChange={(e) => setFilters({ ...filters, country: e.target.value, city: 'All' })}
                      >
                         <option value="All">All Countries</option>
                         {locations.map(loc => <option key={loc.country} value={loc.country}>{loc.country}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C69815]" />
                      <select 
                        disabled={filters.country === 'All'}
                        className="w-full bg-gray-50 border border-gray-100 rounded-[10px] pl-9 pr-4 py-3 text-xs font-black text-[#2952AB] appearance-none focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 disabled:opacity-50"
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      >
                         <option value="All">All Cities</option>
                         {filters.country !== 'All' && locations.find(l => l.country === filters.country)?.cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                         ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] px-1">Min. Rating</h3>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilters({ ...filters, rating: r })}
                      className={`flex-1 py-3.5 rounded-[10px] text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                        filters.rating === r
                          ? 'bg-[#2952AB] text-white shadow-lg'
                          : 'bg-gray-50 text-[#2952AB]'
                      }`}
                    >
                      {r === 0 ? 'All' : `${r}+`}
                      {r > 0 && <Star size={10} fill={filters.rating === r ? 'white' : '#C69815'} stroke="none" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] px-1">Price Level</h3>
                <div className="flex gap-2">
                  {['All', '$', '$$', '$$$', '$$$$'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setFilters({ ...filters, priceRange: p })}
                      className={`flex-1 py-3.5 rounded-[10px] text-xs font-black transition-all ${
                        filters.priceRange === p
                          ? 'bg-[#C69815] text-white shadow-lg shadow-[#C69815]/20'
                          : 'bg-gray-50 text-[#2952AB]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area View Filter (Lounge Management Logic) */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] px-1">Available Area View</h3>
                <div className="grid grid-cols-2 gap-3">
                  {areas.map((a) => (
                    <button
                      key={a}
                      onClick={() => setFilters({ ...filters, area: a })}
                      className={`py-4 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        filters.area === a
                          ? 'bg-[#2952AB] text-white shadow-lg'
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {a !== 'All' && <span>{hallViewIcons[a]}</span>}
                      {a === 'All' ? 'All Areas' : a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-[#C2D1E8]/10">
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setFilters({ priceRange: 'All', rating: 0, area: 'All', country: 'All', city: 'All' });
                    setSelectedCuisine('All');
                  }}
                  className="flex-1 py-4 text-xs font-black text-[#2952AB] uppercase tracking-widest bg-white border border-[#C2D1E8]/30 rounded-[10px] shadow-sm active:scale-95 transition-all"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowFilter(false)}
                  className="flex-[2] py-4 text-xs font-black text-white uppercase tracking-widest bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] shadow-xl shadow-[#2952AB]/20 active:scale-95 transition-all"
                >
                  Apply Filters
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
