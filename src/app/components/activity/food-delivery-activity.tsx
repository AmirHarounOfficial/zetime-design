import { ChevronLeft, Clock, MapPin, Phone, CheckCircle2, ChefHat, Bike } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function FoodDeliveryActivity() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const order = {
    id: orderId || '1',
    restaurant: 'Mario\'s Italian Kitchen',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 14.99 },
      { name: 'Caesar Salad', quantity: 1, price: 8.99 }
    ],
    status: 'delivering',
    deliveryAddress: '123 Main St, Apartment 4B',
    estimatedTime: '15-20 min',
    total: 28.48,
    deliveryFee: 4.50,
    orderTime: '2:30 PM',
    driverName: 'John Smith',
    driverPhone: '+1 (555) 123-4567'
  };

  const statusSteps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, completed: true },
    { id: 'preparing', label: 'Preparing', icon: ChefHat, completed: true },
    { id: 'delivering', label: 'Out for Delivery', icon: Bike, completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Order Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white rounded-[10px] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Estimated Delivery</div>
              <div className="text-2xl font-semibold">{order.estimatedTime}</div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
              {order.status === 'delivering' ? 'Out for Delivery' : 'Preparing'}
            </div>
          </div>

          <div className="space-y-3">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === order.status || step.completed;
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-white/30' : 'bg-white/10'
                  }`}>
                    <Icon size={16} strokeWidth={1.5} />
                  </div>
                  <span className={`text-sm ${isActive ? '' : 'opacity-50'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Restaurant</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
              <ChefHat size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-medium text-gray-900">{order.restaurant}</div>
              <div className="text-xs text-gray-500">Ordered at {order.orderTime}</div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        {order.status === 'delivering' && (
          <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
            <h2 className="text-sm font-medium text-[#2952AB] mb-3">Driver Information</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white rounded-full flex items-center justify-center font-medium">
                  {order.driverName.charAt(0)}
                </div>
                <span className="text-gray-900">{order.driverName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} strokeWidth={1.5} />
                <span>{order.driverPhone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Delivery Address</h2>
          </div>
          <p className="text-sm text-gray-600 ml-6">{order.deliveryAddress}</p>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Order Items</h2>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="text-gray-900">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-2 border-t border-[#C2D1E8]/30">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-[#2952AB] pt-2 border-t border-[#C2D1E8]/30">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium">
            Contact Driver
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Get Help
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
