import { useState, useEffect } from 'react';
import { 
  ChevronLeft, Star, CheckCircle2, Navigation, MapPin, Clock, 
  Bike, Car, Truck, Building2, User, Package, Shield, ChevronRight,
  TrendingUp, Radio, AlertCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { parcelDrivers, ParcelDriver } from '../../data/mock-data';

export function DriverSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, destinations, deliveryType } = location.state || {};

  const [biddingStarted, setBiddingStarted] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastStep, setBroadcastStep] = useState(0);
  const [receivedOffers, setReceivedOffers] = useState<ParcelDriver[]>([]);
  const [latestOfferToast, setLatestOfferToast] = useState<string | null>(null);

  const [selectedDriver, setSelectedDriver] = useState<ParcelDriver | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'freelancer' | 'company-captain'>('all');

  // Hidden ZeTime Base pricing calculation
  const stopCount = destinations?.length || 0;
  const baseZeTimePrice = 5.0; // ZeTime platform base
  const stopZeTimeFee = stopCount * 2.50; // ZeTime stops base
  const estimatedDistance = 3.5 + (stopCount * 2.2); // Base routing distance
  const distanceCharge = estimatedDistance * 0.50;
  
  // Hidden Baseline determined by ZeTime algorithm
  const hiddenZetimeBaseline = baseZeTimePrice + stopZeTimeFee + distanceCharge;
  const estimateMin = hiddenZetimeBaseline - 1.0;
  const estimateMax = hiddenZetimeBaseline + 1.5;

  useEffect(() => {
    if (!destinations || destinations.length === 0) {
      navigate('/module/parcel-delivery');
    }
  }, [destinations, navigate]);

  // Handle Broadcasting step advancement when bidding starts
  useEffect(() => {
    if (!biddingStarted) return;

    setIsBroadcasting(true);
    setBroadcastStep(0);

    const step1 = setTimeout(() => setBroadcastStep(1), 1000);
    const step2 = setTimeout(() => setBroadcastStep(2), 2000);
    const step3 = setTimeout(() => setBroadcastStep(3), 3000);
    const step4 = setTimeout(() => {
      setIsBroadcasting(false);
    }, 4000);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  }, [biddingStarted]);

  // Live bidding feed pop-in
  useEffect(() => {
    if (!biddingStarted || isBroadcasting) return;

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < parcelDrivers.length) {
        const newDriver = parcelDrivers[currentIdx];
        setReceivedOffers(prev => [...prev, newDriver]);
        setLatestOfferToast(newDriver.name);
        
        // Auto-dismiss toast
        setTimeout(() => setLatestOfferToast(null), 2000);
        
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [biddingStarted, isBroadcasting]);

  if (!destinations || destinations.length === 0) {
    return null;
  }

  const filteredDrivers = receivedOffers.filter(d => filterType === 'all' || d.type === filterType);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'motorcycle': return Bike;
      case 'car': return Car;
      case 'van': return Truck;
      case 'truck': return Truck;
      default: return Car;
    }
  };

  const calculateTotal = (driver: ParcelDriver) => {
    return driver.baseFee + (driver.pricePerStop * stopCount) + distanceCharge;
  };

  const handleContinue = () => {
    if (selectedDriver) {
      navigate('/parcel-delivery/route-optimization', {
        state: { 
          pickupLocation, 
          destinations, 
          deliveryType, 
          selectedDriver, 
          totalPrice: calculateTotal(selectedDriver) 
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-40">
      
      {/* Toast Notification for Incoming Offers */}
      {latestOfferToast && (
        <div className="fixed top-6 left-6 right-6 z-50 bg-green-600 text-white rounded-[12px] p-4 shadow-lg shadow-green-600/20 flex items-center justify-between max-w-md mx-auto transition-all animate-bounce">
          <div className="flex items-center gap-2">
            <Radio size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider font-sans">
              Offer submitted by {latestOfferToast}!
            </span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10 sticky top-0 z-40">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">
                {!biddingStarted ? "ZeTime Estimation" : "Driver Offers"}
              </h1>
              <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">
                {deliveryType?.name || 'Express'} · {stopCount} stop{stopCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 1: PRE-BIDDING ZETIME ESTIMATION SCREEN */}
      {!biddingStarted && (
        <div className="max-w-md mx-auto px-6 mt-6 space-y-6 animate-fadeIn">
          {/* Scheduled Header Info */}
          {deliveryType?.scheduledDate && (
            <div className="bg-[#FEF8E7] rounded-[12px] p-4 border border-[#C69815]/10 flex items-center gap-3">
              <Clock size={18} className="text-[#C69815]" />
              <div className="text-left">
                <div className="text-[9px] font-black text-[#2952AB] uppercase tracking-widest">Scheduled Delivery Time</div>
                <div className="text-xs font-black text-gray-700 mt-0.5">{deliveryType.scheduledDate} at {deliveryType.scheduledTime}</div>
              </div>
            </div>
          )}

          {/* Pricing Estimation Hero */}
          <div className="bg-[#2952AB] rounded-[20px] p-6 text-white text-center relative overflow-hidden shadow-xl shadow-[#2952AB]/15">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C69815]/10 rounded-full -translate-y-8 translate-x-8 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-[#C69815]">
                <TrendingUp size={10} />
                Calculated by ZeTime AI
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Estimated Price Range</p>
                <h2 className="text-4xl font-black tracking-tight text-white font-sans">
                  ${estimateMin.toFixed(2)} - ${estimateMax.toFixed(2)}
                </h2>
              </div>

              <p className="text-[9px] opacity-70 leading-relaxed max-w-xs mx-auto">
                Initial platform calculation based on delivery routing, active destinations ({stopCount} stops), and current traffic baselines.
              </p>
            </div>
          </div>

          {/* Summary Details */}
          <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10 space-y-4 text-left">
            <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] border-b border-gray-50 pb-2">
              Route Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                  <Navigation size={12} />
                </div>
                <div>
                  <div className="text-[8px] font-black text-gray-300 uppercase tracking-wider">Pickup Point</div>
                  <div className="text-[10px] font-bold text-gray-600 line-clamp-1">{pickupLocation === 'current' ? 'GPS Current Location' : 'Saved Location'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center text-[#2952AB] flex-shrink-0 mt-0.5">
                  <MapPin size={12} />
                </div>
                <div>
                  <div className="text-[8px] font-black text-gray-300 uppercase tracking-wider">Stops Count</div>
                  <div className="text-[10px] font-bold text-gray-600">{stopCount} delivery destinations</div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Alert */}
          <div className="bg-amber-50/50 rounded-[12px] p-4 border border-amber-200/40 flex gap-3 text-left">
            <AlertCircle size={18} className="text-[#C69815] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-[#2952AB] uppercase tracking-wider">Arabic / العربية</p>
              <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                💡 **عرض أسعار تقديري:** هذا تقدير أولي للتوصيل. عند الضغط على زر البث في الأسفل، سنرسل طلبك إلى الكباتن القريبين لتقديم عروض أسعارهم الدقيقة والمباشرة لتختار منها الأنسب لك.
              </p>
              <div className="w-full h-px bg-amber-200/20 my-3" />
              <p className="text-[10px] font-bold text-[#2952AB] uppercase tracking-wider">English</p>
              <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                💡 **Bidding Flow Info:** Captains will submit customized bids around this range once requested. You always select and pay the exact price of the offer you choose.
              </p>
            </div>
          </div>

          {/* Primary Action to Start Bidding */}
          <button
            onClick={() => setBiddingStarted(true)}
            className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2952AB]/15 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            Broadcast to Get Offers
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* PHASE 2: RADAR BROADCASTING LOADING ANIMATION */}
      {biddingStarted && isBroadcasting && (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 animate-fadeIn">
          <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#2952AB]/10 animate-ping" />
            <div className="absolute inset-4 rounded-full bg-[#2952AB]/20 animate-pulse" />
            <div className="absolute inset-8 rounded-full bg-[#2952AB]/30" />
            
            <div className="relative w-16 h-16 bg-[#2952AB] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#2952AB]/30 border border-white/10">
              <Package size={28} className="text-[#C69815] animate-bounce" strokeWidth={2} />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-xs">
            <h2 className="text-lg font-black uppercase tracking-widest text-[#2952AB]">Requesting Bids</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Connecting with nearby captains and fleets...
            </p>
            
            <div className="bg-white/80 backdrop-blur-md rounded-[15px] p-5 border border-[#C2D1E8]/10 text-center space-y-3">
              <div className="text-[9px] font-black text-[#2952AB] uppercase tracking-widest animate-pulse h-8 flex items-center justify-center">
                {broadcastStep === 0 && "ZeTime AI: Analyzing optimal routes..."}
                {broadcastStep === 1 && "Broadcasting request to nearby captains..."}
                {broadcastStep === 2 && "ZeTime Algorithm: Calculating baseline rates..."}
                {broadcastStep === 3 && "Receiving bids from available providers..."}
              </div>
              
              <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-[#C69815] h-full transition-all duration-500"
                  style={{ width: `${(broadcastStep + 1) * 25}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: LIVE STAGGERED DRIVER OFFERS INCOMING LIST */}
      {biddingStarted && !isBroadcasting && (
        <div className="max-w-md mx-auto px-6 mt-6 space-y-4 animate-fadeIn">
          {/* Scheduled Details Banner */}
          {deliveryType?.scheduledDate && (
            <div className="bg-[#FEF8E7] rounded-[10px] p-3 border border-[#C69815]/10 flex items-center gap-2">
              <Clock size={14} className="text-[#C69815]" />
              <span className="text-[9px] font-black text-[#2952AB] uppercase tracking-widest">
                Scheduled: {deliveryType.scheduledDate} · {deliveryType.scheduledTime}
              </span>
            </div>
          )}

          {/* Filters & Incoming Offer Stats */}
          <div className="space-y-4 sticky top-[100px] bg-gradient-to-b from-[#F2F5FB] to-transparent pb-3 pt-1 z-30">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All Offers' },
                { id: 'freelancer', label: 'Freelancers' },
                { id: 'company-captain', label: 'Companies' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`flex-1 py-2.5 rounded-[10px] text-[9px] font-black uppercase tracking-widest transition-all ${
                    filterType === tab.id
                      ? 'bg-[#2952AB] text-white shadow-md shadow-[#2952AB]/20'
                      : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-sans">
                  {filteredDrivers.length} offer{filteredDrivers.length !== 1 ? 's' : ''} received
                </p>
              </div>
              {receivedOffers.length < parcelDrivers.length && (
                <span className="text-[8px] font-black text-[#C69815] uppercase tracking-widest animate-pulse">
                  More bids incoming...
                </span>
              )}
            </div>
          </div>

          {/* Offers list */}
          <div className="space-y-4">
            {filteredDrivers.map((driver) => {
              const isSelected = selectedDriver?.id === driver.id;
              const VehicleIcon = getVehicleIcon(driver.vehicleType);
              const totalBidPrice = calculateTotal(driver);

              return (
                <button
                  key={driver.id}
                  onClick={() => setSelectedDriver(driver)}
                  className={`w-full text-left rounded-[15px] border-2 transition-all active:scale-[0.98] overflow-hidden ${
                    isSelected
                      ? 'border-[#2952AB] shadow-xl shadow-[#2952AB]/10'
                      : 'border-transparent shadow-sm bg-white hover:shadow-md'
                  }`}
                >
                  <div className={`p-5 ${isSelected ? 'bg-[#E4ECF7]' : 'bg-white'}`}>
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center ${
                          driver.type === 'company-captain' ? 'bg-blue-50' : 'bg-[#FEF8E7]'
                        }`}>
                          <User size={24} className={driver.type === 'company-captain' ? 'text-blue-600' : 'text-[#C69815]'} strokeWidth={1.5} />
                        </div>
                        {driver.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                            <Shield size={10} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 text-left">
                          <h3 className="text-xs font-black text-[#2952AB] uppercase tracking-wider">{driver.name}</h3>
                        </div>

                        <div className="mb-2 text-left">
                          {driver.type === 'freelancer' ? (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-[#C69815]/10 text-[#C69815] px-2 py-0.5 rounded-full">
                              <User size={8} strokeWidth={3} /> Freelancer
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              <Building2 size={8} strokeWidth={3} /> {driver.companyName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Star size={11} className="text-[#C69815] fill-[#C69815]" />
                            <span className="text-[10px] font-black text-[#2952AB]">{driver.rating}</span>
                            <span className="text-[9px] text-gray-400">({driver.reviews})</span>
                          </div>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Navigation size={10} className="text-[#C69815]" />
                            <span className="font-bold">{driver.distance}</span>
                            <span>·</span>
                            <span className="font-bold">{driver.estimatedTime}</span>
                          </div>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <VehicleIcon size={10} />
                            <span className="font-bold">{driver.vehicleInfo}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-black text-[#2952AB] tracking-tight font-sans">
                          ${totalBidPrice.toFixed(2)}
                        </div>
                        <p className="text-[8px] font-bold text-green-600 uppercase tracking-widest">
                          Bid Offer
                        </p>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="px-5 pb-5 pt-3 border-t border-[#C2D1E8]/20 bg-white space-y-2 text-left">
                      <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Bid Breakdown</h4>
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-gray-500">Base pickup bid</span>
                        <span className="font-black text-[#2952AB] font-sans">${driver.baseFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-gray-500">{stopCount} Stop{stopCount > 1 ? 's' : ''} × ${driver.pricePerStop.toFixed(2)}</span>
                        <span className="font-black text-[#2952AB] font-sans">${(driver.pricePerStop * stopCount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold text-gray-500">Distance charge</span>
                        <span className="font-black text-[#2952AB] font-sans">${distanceCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 border-t border-gray-50">
                        <span className="font-black text-[#2952AB] uppercase tracking-widest">Total Bid</span>
                        <span className="font-black text-[#C69815] text-base font-sans">${totalBidPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
                        <Package size={12} className="text-gray-400" />
                        <span className="text-[9px] font-bold text-gray-400">
                          {driver.completedDeliveries.toLocaleString()} deliveries completed
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}

            {filteredDrivers.length === 0 && (
              <div className="text-center py-16">
                <Car size={48} className="mx-auto mb-4 text-gray-200 animate-pulse" />
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                  Waiting for offers...
                </p>
              </div>
            )}
          </div>

          {/* Selection Confirm Button */}
          <div className="fixed bottom-12 left-0 right-0 px-6 z-40">
            <div className="max-w-md mx-auto">
              <button
                onClick={handleContinue}
                disabled={!selectedDriver}
                className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 flex items-center justify-between px-8 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
              >
                <span className="text-[10px]">Confirm Selected Bid</span>
                {selectedDriver && (
                  <span className="text-xs tracking-tight font-sans">${calculateTotal(selectedDriver).toFixed(2)}</span>
                )}
                {!selectedDriver && <ChevronRight size={18} strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
