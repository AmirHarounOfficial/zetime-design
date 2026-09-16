import { CheckCircle2, MapPin, Package, Clock, Navigation, User, Star, Building2, Truck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function ParcelConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, destinations, optimizedRoute, total, deliveryType, selectedDriver } = location.state || {};

  if (!destinations || !optimizedRoute) {
    navigate('/module/parcel-delivery');
    return null;
  }

  const trackingNumber = `ZT-PD-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-8">
      {/* Success Header */}
      <div className="bg-[#2952AB] px-6 pt-14 pb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#C69815]/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
            <CheckCircle2 size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest mb-2">Delivery Confirmed!</h1>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Your driver is on the way</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-4 space-y-6">
        {/* Tracking Card */}
        <div className="bg-white rounded-[15px] p-6 shadow-lg border border-[#C2D1E8]/10 text-center">
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Tracking Number</div>
          <div className="text-2xl font-black text-[#2952AB] tracking-wider mb-4">{trackingNumber}</div>
          {deliveryType && (
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-[#FEF8E7] text-[#C69815] text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {deliveryType.name} · {deliveryType.duration}
              </div>
              {deliveryType.scheduledDate && (
                <div className="text-[10px] font-black text-[#2952AB] uppercase tracking-wider">
                  📅 Scheduled: {deliveryType.scheduledDate} · {deliveryType.scheduledTime}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Driver Card */}
        {selectedDriver && (
          <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#C69815] rounded-full" />
              <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Assigned Driver</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center ${
                selectedDriver.type === 'company-captain' ? 'bg-blue-50' : 'bg-[#FEF8E7]'
              }`}>
                <User size={24} className={selectedDriver.type === 'company-captain' ? 'text-blue-600' : 'text-[#C69815]'} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider">{selectedDriver.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  {selectedDriver.type === 'freelancer' ? (
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#C69815] bg-[#C69815]/10 px-2 py-0.5 rounded-full">Freelancer</span>
                  ) : (
                    <span className="text-[8px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{selectedDriver.companyName}</span>
                  )}
                  <span className="flex items-center gap-1 text-[10px]">
                    <Star size={10} className="text-[#C69815] fill-[#C69815]" />
                    <span className="font-black text-[#2952AB]">{selectedDriver.rating}</span>
                  </span>
                </div>
                <div className="text-[9px] text-gray-400 font-bold mt-1">{selectedDriver.vehicleInfo} · Arriving in {selectedDriver.estimatedTime}</div>
              </div>
            </div>
          </div>
        )}

        {/* Route Summary */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Route Summary</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="text-center">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stops</div>
              <div className="text-lg font-black text-[#2952AB]">{destinations.length}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Distance</div>
              <div className="text-lg font-black text-[#2952AB]">{optimizedRoute.totalDistance}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Time</div>
              <div className="text-lg font-black text-[#2952AB]">{optimizedRoute.estimatedTime}</div>
            </div>
          </div>
          <div className="bg-[#FEF8E7] rounded-[10px] p-3 flex items-center gap-2">
            <Clock size={14} className="text-[#C69815]" strokeWidth={2} />
            <span className="text-[10px] font-bold text-gray-500">Saved {optimizedRoute.savings} with smart routing</span>
          </div>
        </div>

        {/* Delivery Sequence */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Delivery Sequence</h2>
          </div>
          <div className="space-y-0">
            {/* Pickup */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-[8px] flex items-center justify-center">
                  <Navigation size={14} strokeWidth={2} />
                </div>
                <div className="w-0.5 h-6 bg-[#C69815]/30" />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Pickup</div>
                <div className="text-[10px] font-black text-[#2952AB] uppercase tracking-wider">Starting Point</div>
              </div>
            </div>

            {/* Destinations */}
            {optimizedRoute.order.map((destIndex: number, routeIndex: number) => {
              const dest = destinations[destIndex];
              const isLast = routeIndex === optimizedRoute.order.length - 1;
              return (
                <div key={dest.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-[#2952AB] text-white rounded-[8px] flex items-center justify-center text-[10px] font-black">
                      {routeIndex + 1}
                    </div>
                    {!isLast && <div className="w-0.5 h-6 bg-[#C69815]/30" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="text-[10px] font-black text-[#2952AB] uppercase tracking-wider">{dest.recipientName}</div>
                    <div className="text-[9px] text-gray-400 font-medium line-clamp-1">{dest.address}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#2952AB] uppercase tracking-widest">Total Paid</span>
            <span className="text-xl font-black text-[#C69815] tracking-tight">${total?.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate(`/activity/parcel-delivery/${trackingNumber}`)}
            className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 active:scale-[0.98] transition-all"
          >
            Track Delivery
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[15px] text-[10px] font-black uppercase tracking-widest"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
