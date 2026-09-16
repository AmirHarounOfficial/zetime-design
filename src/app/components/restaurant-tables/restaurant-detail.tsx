import { useState } from 'react';
import { ChevronLeft, Star, MapPin, Clock, ChevronRight, Utensils, Users, Info, Maximize2, X, Share2, Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { restaurants, MenuItem } from '../../data/mock-data';

export function RestaurantDetail() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showMenuPopup, setShowMenuPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const hallViewIcons = {
    garden: '🌿',
    pool: '🏊‍♂️',
    street: '🏙️',
    kitchen: '👨‍🍳'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32">
      {/* Premium Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-12 pb-6 bg-gradient-to-b from-[#2952AB] to-transparent pointer-events-none">
        <div className="max-w-md mx-auto flex items-center justify-between pointer-events-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] flex items-center justify-center text-white shadow-lg"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[10px] flex items-center justify-center text-white shadow-lg">
            <Info size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Gallery Carousel */}
        <div className="relative h-[380px] overflow-hidden rounded-b-[40px] shadow-2xl">
          <img 
            src={restaurant.images[selectedImage]} 
            alt={restaurant.name} 
            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 px-4">
            {restaurant.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selectedImage === idx ? 'bg-[#C69815] w-8' : 'bg-white/40 w-2'
                }`}
              />
            ))}
          </div>
          
          <div className="absolute bottom-12 left-6">
            <span className="bg-[#C69815] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg mb-2 inline-block">
              {restaurant.cuisine}
            </span>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">{restaurant.name}</h1>
          </div>
        </div>

        <div className="px-6 -mt-8 relative z-30">
          {/* Quick Info Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[10px] p-5 shadow-xl border border-white space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star size={20} className="text-[#C69815] fill-[#C69815]" />
                <span className="font-black text-[#2952AB]">{restaurant.rating}</span>
                <span className="text-xs font-bold text-gray-400">({restaurant.reviews} Reviews)</span>
              </div>
              <span className="text-sm font-black text-[#C69815]">{restaurant.priceRange}</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-[10px] bg-[#FEF8E7] flex items-center justify-center text-[#C69815]">
                  <MapPin size={16} />
                </div>
                <span className="text-xs font-bold leading-tight">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-8 h-8 rounded-[10px] bg-[#FEF8E7] flex items-center justify-center text-[#C69815]">
                  <Clock size={16} />
                </div>
                <span className="text-xs font-bold">{restaurant.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-2 px-1">About Restaurant</h3>
            <p className="text-sm text-gray-500 font-bold leading-relaxed px-1">
              {restaurant.description}
            </p>
          </div>

          {/* View Menu Trigger */}
          <button
            onClick={() => setShowMenuPopup(true)}
            className="w-full bg-white border-2 border-dashed border-[#C69815]/30 rounded-[10px] p-6 flex flex-col items-center justify-center gap-2 group hover:border-[#C69815] transition-all mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-[#C69815] to-[#A88012] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#C69815]/20 group-hover:scale-110 transition-transform">
              <Utensils size={24} />
            </div>
            <span className="font-black text-[#2952AB] tracking-tighter uppercase text-sm">Explore Menu</span>
            <span className="text-[10px] font-bold text-gray-400">View choices and specialties</span>
          </button>

          {/* Halls / Zones Selection (Provider Logic) */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 px-1">Available Lounges</h3>
            <div className="grid grid-cols-2 gap-4">
              {restaurant.halls.map((hall) => (
                <div 
                  key={hall.id}
                  className="bg-white border border-[#C2D1E8]/20 rounded-[10px] p-4 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[20px]">{hallViewIcons[hall.view]}</span>
                    <span className="text-[10px] font-black bg-gray-100 text-[#2952AB] px-2 py-0.5 rounded-full uppercase">
                      {hall.view}
                    </span>
                  </div>
                  <h4 className="font-black text-[#2952AB] text-sm mb-1">{hall.name}</h4>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <div className="flex -space-x-1 overflow-hidden">
                       <Users size={12} />
                    </div>
                    <span className="text-[10px] font-bold ml-1">Limit: {hall.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Reservation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-[#C2D1E8]/20 p-6 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starting from</span>
            <span className="text-xl font-black text-[#2952AB]">Free <span className="text-xs text-gray-300 font-bold">Reservation</span></span>
          </div>
          <button
            onClick={() => navigate(`/restaurant/${restaurant.id}/book`)}
            className="flex-1 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] text-white py-4 px-6 rounded-[10px] font-black uppercase tracking-[0.1em] text-sm shadow-xl shadow-[#2952AB]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span>Book a Table</span>
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Menu Modal Overlay */}
      {showMenuPopup && (
        <div className="fixed inset-0 z-[100] animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowMenuPopup(false)} />
          <div className="absolute inset-x-0 bottom-0 top-12 bg-[#F2F5FB] rounded-t-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500">
            <div className="p-6 flex items-center justify-between border-b border-[#C2D1E8]/20">
              <div className="flex items-center gap-3">
                <Utensils className="text-[#C69815]" size={24} />
                <h2 className="text-xl font-black text-[#2952AB] uppercase tracking-tighter">Restaurant Menu</h2>
              </div>
              <button 
                onClick={() => setShowMenuPopup(false)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#2952AB] shadow-md border border-[#C2D1E8]/20"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-12">
              {restaurant.menu.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-[#C69815]/20" />
                    <h3 className="text-[12px] font-black text-[#C69815] uppercase tracking-[0.2em]">{category.name}</h3>
                    <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-[#C69815]/20" />
                  </div>
                  
                  <div className="grid gap-4">
                    {category.items.map((item) => (
                      <button 
                        key={item.id} 
                        onClick={() => setSelectedItem(item)}
                        className="bg-white rounded-[10px] p-4 border border-white shadow-sm flex gap-4 text-left group active:scale-[0.98] transition-all"
                      >
                        <div className="w-20 h-20 rounded-[10px] bg-gray-100 flex-shrink-0 overflow-hidden shadow-inner flex items-center justify-center relative">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                          ) : (
                            <Utensils size={24} className="text-gray-300" />
                          )}
                          {item.popular && (
                             <div className="absolute top-1 right-1 bg-[#C69815] text-white p-1 rounded-full shadow-lg">
                                <Star size={8} fill="white" />
                             </div>
                          )}
                        </div>
                        <div className="flex-1 py-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-black text-[#2952AB] text-sm group-hover:text-[#C69815] transition-colors">{item.name}</h4>
                            <span className="font-black text-[#C69815] text-sm">${item.price}</span>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Bottom Sheet */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
           <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 max-h-[85vh]">
              <div className="relative h-64 w-full overflow-hidden rounded-t-[40px]">
                 {selectedItem.image ? (
                    <img src={selectedItem.image} className="w-full h-full object-cover" alt={selectedItem.name} />
                 ) : (
                    <div className="w-full h-full bg-[#FEF8E7] flex items-center justify-center">
                       <Utensils size={64} className="text-[#C69815]/20" />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                 >
                    <X size={20} />
                 </button>
                 
                 <div className="absolute bottom-6 left-8 right-8">
                    {selectedItem.popular && (
                       <span className="bg-[#C69815] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg mb-2 inline-block">Popular Choice</span>
                    )}
                    <h2 className="text-2xl font-black text-white">{selectedItem.name}</h2>
                 </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-2xl font-black text-[#2952AB]">${selectedItem.price}</div>
                       <div className="h-6 w-[1px] bg-gray-100" />
                       <div className="flex items-center gap-1.5">
                          <Star size={16} className="text-[#C69815] fill-[#C69815]" />
                          <span className="font-black text-[#2952AB] text-sm">4.8</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="w-10 h-10 bg-gray-50 rounded-[10px] flex items-center justify-center text-gray-400">
                          <Heart size={18} />
                       </button>
                       <button className="w-10 h-10 bg-gray-50 rounded-[10px] flex items-center justify-center text-gray-400">
                          <Share2 size={18} />
                       </button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em]">Description</h3>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">
                       {selectedItem.description}. This dish is prepared with the finest seasonal ingredients, following our traditional culinary techniques to ensure the most authentic and exquisite flavor profile.
                    </p>
                 </div>

                 <div className="pt-4">
                    <button className="w-full bg-[#2952AB] text-white py-4 rounded-[10px] font-black uppercase tracking-widest text-sm shadow-xl shadow-[#2952AB]/20 active:scale-95 transition-all">
                       Add to Selection
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
