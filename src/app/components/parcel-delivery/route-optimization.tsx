import { useState, useEffect } from 'react';
import { ChevronLeft, Navigation, MapPin, Clock, TrendingUp, Check, User, Building2, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';

interface OptimizedRoute {
  order: number[];
  totalDistance: string;
  estimatedTime: string;
  savings: string;
}

export function RouteOptimization() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, destinations, deliveryType, selectedDriver, totalPrice } = location.state || { destinations: [] };

  const [isOptimizing, setIsOptimizing] = useState(true);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const order = optimizeRoute(destinations.length);
      const totalDistance = calculateDistance(destinations.length);
      const estimatedTime = calculateTime(destinations.length);
      const savings = `${Math.floor(Math.random() * 20 + 10)} min`;

      setOptimizedRoute({ order, totalDistance, estimatedTime, savings });
      setIsOptimizing(false);
    }, 2500);
  }, [destinations]);

  const optimizeRoute = (count: number): number[] => {
    const indices = Array.from({ length: count }, (_, i) => i);
    const optimized: number[] = [];
    let current = 0;
    const remaining = new Set(indices);
    optimized.push(current);
    remaining.delete(current);
    while (remaining.size > 0) {
      let nearest = -1;
      let minDist = Infinity;
      remaining.forEach(idx => {
        const dist = Math.abs(idx - current) + Math.random() * 2;
        if (dist < minDist) { minDist = dist; nearest = idx; }
      });
      if (nearest !== -1) { optimized.push(nearest); remaining.delete(nearest); current = nearest; }
    }
    return optimized;
  };

  const calculateDistance = (count: number): string => {
    const total = 3.5 + (count * 2.2);
    return `${total.toFixed(1)} km`;
  };

  const calculateTime = (count: number): string => {
    const total = 15 + (count * 8);
    return `${total} min`;
  };

  const handleConfirm = () => {
    navigate('/parcel-delivery/payment', {
      state: { pickupLocation, destinations, optimizedRoute, deliveryType, selectedDriver, totalPrice }
    });
  };

  if (!destinations || destinations.length === 0) {
    navigate('/module/parcel-delivery');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-40">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">Route</h1>
            <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">Optimizing your delivery path</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {isOptimizing ? (
          <div className="bg-[#2952AB] text-white rounded-[15px] p-10 text-center">
            <div className="w-16 h-16 border-4 border-white/20 border-t-[#C69815] rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-lg font-black uppercase tracking-widest mb-2">Optimizing Route</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Finding the fastest path for your deliveries...</p>
          </div>
        ) : (
          <>
            {/* Results Card */}
            <div className="bg-green-600 text-white rounded-[15px] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/20 rounded-[10px] flex items-center justify-center">
                  <Check size={22} strokeWidth={3} />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest">Route Optimized!</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-[9px] font-bold opacity-70 uppercase tracking-widest mb-1">Distance</div>
                  <div className="text-lg font-black tracking-tight">{optimizedRoute?.totalDistance}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold opacity-70 uppercase tracking-widest mb-1">Time</div>
                  <div className="text-lg font-black tracking-tight">{optimizedRoute?.estimatedTime}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold opacity-70 uppercase tracking-widest mb-1">Saved</div>
                  <div className="text-lg font-black tracking-tight flex items-center gap-1">
                    <TrendingUp size={14} strokeWidth={2.5} />
                    {optimizedRoute?.savings}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Driver Summary */}
            {selectedDriver && (
              <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                  <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Your Driver</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${
                    selectedDriver.type === 'company-captain' ? 'bg-blue-50' : 'bg-[#FEF8E7]'
                  }`}>
                    <User size={20} className={selectedDriver.type === 'company-captain' ? 'text-blue-600' : 'text-[#C69815]'} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider">{selectedDriver.name}</div>
                    <div className="mt-0.5">
                      {selectedDriver.type === 'freelancer' ? (
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#C69815] bg-[#C69815]/10 px-2 py-0.5 rounded-full">Freelancer</span>
                      ) : (
                        <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedDriver.companyName}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-lg font-black text-[#C69815]">${totalPrice?.toFixed(2)}</div>
                </div>
              </div>
            )}

            {/* Route Visualization */}
            <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 bg-[#C69815] rounded-full" />
                <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Delivery Sequence</h3>
              </div>

              <div className="space-y-0">
                {/* Pickup */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-[10px] flex items-center justify-center">
                      <Navigation size={16} strokeWidth={2} />
                    </div>
                    <div className="w-0.5 h-8 bg-[#C69815]/30" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Pickup</div>
                    <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider">Starting Point</div>
                  </div>
                </div>

                {/* Destinations */}
                {optimizedRoute?.order.map((destIndex, routeIndex) => {
                  const dest = destinations[destIndex];
                  const isLast = routeIndex === optimizedRoute.order.length - 1;
                  return (
                    <div key={dest.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-[#2952AB] text-white rounded-[10px] flex items-center justify-center font-black text-sm">
                          {routeIndex + 1}
                        </div>
                        {!isLast && <div className="w-0.5 h-8 bg-[#C69815]/30" />}
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider mb-0.5">{dest.recipientName}</div>
                        <div className="text-[10px] text-gray-400 font-medium flex items-start gap-1">
                          <MapPin size={10} className="mt-0.5 flex-shrink-0 text-[#C69815]" strokeWidth={2} />
                          <span className="line-clamp-1">{dest.address}</span>
                        </div>
                        <div className="text-[9px] text-gray-300 font-bold mt-1">{dest.packageType}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Route Insights */}
            <div className="bg-[#FEF8E7] rounded-[15px] p-5 border border-[#C69815]/10">
              <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-4">Why This Route?</h3>
              <ul className="space-y-3">
                {[
                  `Minimized total travel distance by ${Math.floor(Math.random() * 30 + 15)}%`,
                  'Reduced backtracking and U-turns',
                  'Optimized for current traffic conditions',
                  'Grouped nearby locations efficiently'
                ].map((reason, i) => (
                  <li key={i} className="flex items-start gap-3 text-[10px] text-gray-500 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C69815] mt-1.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Continue */}
      {!isOptimizing && (
        <div className="fixed bottom-12 left-0 right-0 px-6 z-50">
          <div className="max-w-md mx-auto space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              Continue to Payment
              <ChevronRight size={18} strokeWidth={3} />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[15px] text-[10px] font-black uppercase tracking-widest"
            >
              Change Driver
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
