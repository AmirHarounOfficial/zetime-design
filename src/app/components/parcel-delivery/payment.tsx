import { useState } from 'react';
import { ChevronLeft, CreditCard, Wallet, DollarSign, Check, User, Building2, MapPin, Package, Star } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function ParcelPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, destinations, optimizedRoute, deliveryType, selectedDriver, totalPrice } = location.state || {};

  const [selectedPayment, setSelectedPayment] = useState('card');

  if (!destinations || !optimizedRoute || !selectedDriver) {
    navigate('/module/parcel-delivery');
    return null;
  }

  // Price comes from the selected driver's custom bid
  const driverBaseFee = selectedDriver.baseFee;
  const driverStopFee = selectedDriver.pricePerStop * destinations.length;
  const distanceCharge = parseFloat(optimizedRoute.totalDistance) * 0.50;
  
  // Use the exact bid price passed from driver selection, or fallback
  const subtotal = totalPrice || (driverBaseFee + driverStopFee + distanceCharge);
  const serviceFee = 1.50;
  const total = subtotal + serviceFee;

  const handleConfirm = () => {
    navigate('/parcel-delivery/confirmation', {
      state: { pickupLocation, destinations, optimizedRoute, total, selectedPayment, deliveryType, selectedDriver }
    });
  };

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'wallet', icon: Wallet, label: 'Digital Wallet' },
    { id: 'cash', icon: DollarSign, label: 'Cash on Pickup' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">Payment</h1>
            <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">Review and confirm</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* Driver Summary */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Your Driver</h2>
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
              <div className="text-[9px] text-gray-400 font-bold mt-1">{selectedDriver.vehicleInfo} · {selectedDriver.vehicleType}</div>
            </div>
          </div>
        </div>

        {/* Scheduled Delivery Banner */}
        {deliveryType?.scheduledDate && (
          <div className="bg-[#FEF8E7] rounded-[15px] p-4 border border-[#C69815]/15 flex items-center gap-3">
            <Clock size={16} className="text-[#C69815]" />
            <div className="text-left">
              <div className="text-[9px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Scheduled Delivery Time</div>
              <div className="text-xs font-black text-[#C69815] mt-0.5">{deliveryType.scheduledDate} · {deliveryType.scheduledTime}</div>
            </div>
          </div>
        )}

        {/* Delivery Summary */}
        <div className="bg-[#FEF8E7] rounded-[15px] p-5 border border-[#C69815]/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stops</div>
              <div className="text-lg font-black text-[#2952AB]">{destinations.length}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Distance</div>
              <div className="text-lg font-black text-[#2952AB]">{optimizedRoute.totalDistance}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Time</div>
              <div className="text-lg font-black text-[#2952AB]">{optimizedRoute.estimatedTime}</div>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Price Breakdown</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-gray-500">Driver Base Fee</span>
              <span className="font-black text-[#2952AB]">${driverBaseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-gray-500">{destinations.length} Stop{destinations.length > 1 ? 's' : ''} × ${selectedDriver.pricePerStop.toFixed(2)}</span>
              <span className="font-black text-[#2952AB]">${driverStopFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-gray-500">Distance ({optimizedRoute.totalDistance})</span>
              <span className="font-black text-[#2952AB]">${distanceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] pt-3 border-t border-gray-50">
              <span className="font-bold text-gray-500">Subtotal</span>
              <span className="font-black text-[#2952AB]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="font-bold text-gray-500">Service Fee</span>
              <span className="font-black text-[#2952AB]">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#C2D1E8]/20">
              <span className="text-xs font-black text-[#2952AB] uppercase tracking-widest">Total</span>
              <span className="text-xl font-black text-[#C69815] tracking-tight">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Payment Method</h2>
          </div>
          <div className="space-y-3">
            {paymentMethods.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-[12px] border-2 transition-all flex items-center justify-between ${
                    selectedPayment === method.id
                      ? 'border-[#2952AB] bg-[#E4ECF7]'
                      : 'border-transparent bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                    <span className="text-xs font-bold text-[#2952AB]">{method.label}</span>
                  </div>
                  {selectedPayment === method.id && (
                    <Check size={18} className="text-[#2952AB]" strokeWidth={2.5} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          Confirm & Book · ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
