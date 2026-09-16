import { useState } from 'react';
import { ChevronLeft, MapPin, CreditCard, Clock, Check, ShieldCheck, Wallet, Banknote } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

export function FoodCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, restaurant } = location.state || { cart: [], restaurant: null };

  const [deliveryAddress, setDeliveryAddress] = useState('123 ZeTime Avenue, Istanbul');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [scheduledTime, setScheduledTime] = useState('asap');

  if (!restaurant) {
    navigate('/module/food-delivery');
    return null;
  }

  const subtotal = cart.reduce((sum: number, ci: any) => sum + ci.totalItemPrice * ci.quantity, 0);
  const total = subtotal + restaurant.deliveryFee;

  const handlePlaceOrder = () => {
    navigate(`/food-delivery/${restaurant.id}/confirmation`, {
      state: { cart, restaurant, deliveryAddress, total }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">Checkout</h1>
            <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">{restaurant.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-[15px] p-6 border border-[#C2D1E8]/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-[#C69815] rounded-full" />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Order Summary</h2>
          </div>
          
          <div className="space-y-4">
            {cart.map((ci: any, index: number) => (
              <div key={`${ci.item.id}-${index}`} className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#2952AB] bg-gray-50 px-2 py-0.5 rounded-[4px]">{ci.quantity}x</span>
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-tight">{ci.item.name}</span>
                  </div>
                  {/* Customizations */}
                  <div className="ml-8 mt-1 space-y-0.5">
                    {Object.values(ci.selectedOptions || {}).map((opt: any) => (
                      <p key={opt.id} className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">— {opt.name}</p>
                    ))}
                    {ci.selectedAddons?.map((add: any) => (
                      <p key={add.id} className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">— {add.name}</p>
                    ))}
                  </div>
                </div>
                <span className="text-xs font-black text-[#2952AB]">${(ci.totalItemPrice * ci.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-50 space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Delivery Fee</span>
                <span>${restaurant.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#2952AB] uppercase tracking-widest pt-2 border-t border-[#C2D1E8]/20">
                <span>Total Amount</span>
                <span className="text-lg tracking-tight">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-[15px] p-6 border border-[#C2D1E8]/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-[#C69815]" strokeWidth={2.5} />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Delivery Details</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Address</label>
              <input
                type="text"
                placeholder="Where to deliver?"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full bg-gray-50 border border-[#C2D1E8]/10 px-4 py-3.5 rounded-[10px] text-xs font-bold text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Instructions</label>
              <textarea
                placeholder="Building name, apartment number, etc."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full bg-gray-50 border border-[#C2D1E8]/10 px-4 py-3.5 rounded-[10px] text-xs font-bold text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all shadow-inner resize-none min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-[15px] p-6 border border-[#C2D1E8]/10 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} className="text-[#C69815]" strokeWidth={2.5} />
            <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Payment Method</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'card', name: 'Credit Card', icon: CreditCard },
              { id: 'wallet', name: 'Wallet', icon: Wallet },
              { id: 'cash', name: 'Cash', icon: Banknote }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex items-center justify-between p-4 rounded-[12px] border transition-all ${
                  selectedPayment === method.id
                    ? 'bg-[#E4ECF7] border-[#2952AB] shadow-sm'
                    : 'bg-gray-50 border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-[8px] ${selectedPayment === method.id ? 'bg-[#2952AB] text-white' : 'bg-white text-gray-400 shadow-sm'}`}>
                    <method.icon size={16} />
                  </div>
                  <span className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">{method.name}</span>
                </div>
                {selectedPayment === method.id && (
                  <Check size={18} className="text-[#2952AB]" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={!deliveryAddress}
          className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <ShieldCheck size={20} fill="white" className="text-[#2952AB]" />
          Confirm Order · ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}
