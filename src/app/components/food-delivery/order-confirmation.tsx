import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, Home, ChevronLeft, MapPin, Search, Star, Zap, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, restaurant, deliveryAddress, total } = location.state || {};

  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'preparing' | 'delivering' | 'delivered'>('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(35);

  useEffect(() => {
    const timer1 = setTimeout(() => setOrderStatus('preparing'), 3000);
    const timer2 = setTimeout(() => setOrderStatus('delivering'), 10000);
    const timer3 = setTimeout(() => setOrderStatus('delivered'), 20000);

    const countdown = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(countdown);
    };
  }, []);

  if (!restaurant) {
    navigate('/module/food-delivery');
    return null;
  }

  const statusSteps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, color: 'bg-green-500' },
    { id: 'preparing', label: 'Preparing Food', icon: ChefHat, color: 'bg-orange-500' },
    { id: 'delivering', label: 'Out for Delivery', icon: Bike, color: 'bg-blue-500' },
    { id: 'delivered', label: 'Delivered', icon: Home, color: 'bg-[#C69815]' }
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.id === orderStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-8 border-b border-[#C2D1E8]/10 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#2952AB] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#2952AB]/20">
            <CheckCircle2 size={32} className="text-[#C69815]" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black text-[#2952AB] uppercase tracking-[0.2em] mb-1">Success!</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #ZT-{Date.now().toString().slice(-6)} is confirmed</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* Status Timeline Card */}
        <div className="bg-white rounded-[20px] p-6 border border-[#C2D1E8]/10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest mb-1">Live Status</h2>
              <p className="text-xs font-bold text-[#C69815] uppercase tracking-tighter">Arriving in approx. {estimatedTime} min</p>
            </div>
            <div className="bg-[#E4ECF7] p-2 rounded-[10px]">
               <Clock size={20} className="text-[#2952AB]" />
            </div>
          </div>

          <div className="relative space-y-8">
            {/* Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-50" />
            <div 
              className="absolute left-5 top-0 w-0.5 bg-[#C69815] transition-all duration-1000" 
              style={{ height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} 
            />

            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex items-center gap-6 relative z-10">
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-500 shadow-lg ${
                    isActive ? step.color : 'bg-gray-100'
                  }`}>
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-300'} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#2952AB]' : 'text-gray-300'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                       <div className="flex items-center gap-1 mt-0.5">
                         <div className="w-1.5 h-1.5 bg-[#C69815] rounded-full animate-pulse" />
                         <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">In Progress</span>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restaurant & Delivery Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[15px] p-4 border border-[#C2D1E8]/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-[10px] flex items-center justify-center mb-3">
               <ChefHat size={20} className="text-[#C69815]" />
            </div>
            <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-wider mb-1">Restaurant</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate w-full">{restaurant.name}</p>
          </div>
          <div className="bg-white rounded-[15px] p-4 border border-[#C2D1E8]/10 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-gray-50 rounded-[10px] flex items-center justify-center mb-3">
               <MapPin size={20} className="text-[#C69815]" />
            </div>
            <h3 className="text-[10px] font-black text-[#2952AB] uppercase tracking-wider mb-1">Destination</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate w-full">{deliveryAddress}</p>
          </div>
        </div>

        {/* Order Details Accordion */}
        <div className="bg-white rounded-[15px] p-6 border border-[#C2D1E8]/10 shadow-sm">
          <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest mb-4">Final Bill</h2>
          <div className="space-y-3">
            {cart.map((ci: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-tight">{ci.quantity}x {ci.item.name}</p>
                  <div className="mt-0.5 space-y-0.5">
                    {Object.values(ci.selectedOptions || {}).map((opt: any) => (
                      <p key={opt.id} className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">— {opt.name}</p>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-black text-[#2952AB]">${(ci.totalItemPrice * ci.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-50 flex justify-between text-sm font-black text-[#2952AB] uppercase tracking-[0.2em]">
               <span>Total Paid</span>
               <span className="text-[#C69815]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#2952AB]/20 active:scale-[0.98] transition-all"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(`/activity/food-delivery/ORD-${Date.now()}`)}
            className="w-full bg-white border-2 border-[#2952AB] text-[#2952AB] py-5 rounded-[15px] font-black uppercase tracking-[0.2em] active:scale-[0.98] transition-all"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}
