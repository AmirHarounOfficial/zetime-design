import { ChevronLeft, Search, TrendingUp, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BottomNav } from './bottom-nav';
import { useState } from 'react';

export function SearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
    }
  };

  const recentSearches = [
    'Italian restaurants',
    'Car wash nearby',
    'Downtown apartments',
    'Plumber service'
  ];

  const trendingSearches = [
    'Best brunch spots',
    'Weekend getaway rentals',
    'Express delivery',
    'Parking downtown'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1">
              <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </Link>
            
            <div className="flex-1 flex items-center gap-3 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm">
              <Search size={20} className="text-[#7A9ACB]" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search anything in ZeTime"
                className="flex-1 bg-transparent text-gray-900 placeholder-[#2952AB]/40 outline-none"
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Recent Searches */}
        {!searchQuery && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <Clock size={14} className="text-[#7A9ACB]" />
                <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60">Recent</h2>
              </div>
              
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-4 py-3 bg-white rounded-[10px] border border-[#C2D1E8]/30 hover:border-[#C69815]/40 hover:bg-gradient-to-r hover:from-[#F2F5FB] hover:to-[#FEFBF3] transition-all shadow-sm"
                  >
                    <span className="text-gray-900">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <TrendingUp size={14} className="text-[#C69815]" />
                <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60">Trending</h2>
              </div>
              
              <div className="space-y-2">
                {trendingSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-4 py-3 bg-white rounded-[10px] border border-[#C2D1E8]/30 hover:border-[#C69815]/40 hover:bg-gradient-to-r hover:from-[#F2F5FB] hover:to-[#FEFBF3] transition-all shadow-sm"
                  >
                    <span className="text-gray-900">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      <BottomNav />
    </div>
  );
}