import { ChevronLeft, Package, MapPin, User, Phone, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function ParcelDeliveryActivity() {
  const navigate = useNavigate();
  const { deliveryId } = useParams();

  const delivery = {
    id: deliveryId || '1',
    trackingNumber: 'ZT-PD-5678',
    status: 'in-transit',
    pickupAddress: '789 Elm Street, Building A',
    deliveryAddress: '321 Pine Avenue, Suite 200',
    packageDetails: 'Medium Box - Documents',
    weight: '2.5 kg',
    estimatedDelivery: 'Today, 4:00 PM',
    driverName: 'Mike Wilson',
    driverPhone: '+1 (555) 456-7890',
    total: 12.50,
    pickupTime: '1:45 PM',
    recipientName: 'Alice Cooper',
    recipientPhone: '+1 (555) 111-2222'
  };

  const trackingSteps = [
    { id: 'picked-up', label: 'Picked Up', time: '1:45 PM', completed: true },
    { id: 'in-transit', label: 'In Transit', time: '2:30 PM', completed: false },
    { id: 'nearby', label: 'Nearby', time: '', completed: false },
    { id: 'delivered', label: 'Delivered', time: '', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Delivery Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[10px] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm opacity-90 mb-1">Tracking Number</div>
              <div className="text-xl font-semibold mb-3">{delivery.trackingNumber}</div>
              <div className="flex items-center gap-2">
                <Clock size={16} strokeWidth={1.5} />
                <span className="text-sm">Est. Delivery: {delivery.estimatedDelivery}</span>
              </div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
              In Transit
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-4">Tracking Status</h2>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const isActive = step.id === delivery.status;
              const isPast = step.completed;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isPast || isActive
                        ? 'bg-gradient-to-r from-[#2952AB] to-[#3B6EC9]'
                        : 'bg-gray-200'
                    }`}>
                      {isPast ? (
                        <CheckCircle2 size={16} className="text-white" strokeWidth={1.5} />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className={`text-sm font-medium ${isPast || isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                      {step.time && (
                        <div className="text-xs text-gray-500 mt-0.5">{step.time}</div>
                      )}
                    </div>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-px h-6 ml-4 ${isPast ? 'bg-[#2952AB]' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Package size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Package Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="text-gray-900">{delivery.packageDetails}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight</span>
              <span className="text-gray-900">{delivery.weight}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-green-600" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#2952AB]">Pickup</h3>
            </div>
            <p className="text-sm text-gray-600 ml-6">{delivery.pickupAddress}</p>
            <p className="text-xs text-gray-500 ml-6 mt-1">Picked up at {delivery.pickupTime}</p>
          </div>
          <div className="border-t border-[#C2D1E8]/30 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-red-600" strokeWidth={1.5} />
              <h3 className="text-sm font-medium text-[#2952AB]">Delivery</h3>
            </div>
            <p className="text-sm text-gray-600 ml-6">{delivery.deliveryAddress}</p>
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <User size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Recipient</h2>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">{delivery.recipientName}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} strokeWidth={1.5} />
              <span>{delivery.recipientPhone}</span>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Driver</h2>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white rounded-full flex items-center justify-center text-sm font-medium">
                {delivery.driverName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-900">{delivery.driverName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} strokeWidth={1.5} />
              <span>{delivery.driverPhone}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#2952AB]">Total Paid</span>
            <span className="text-lg font-semibold text-[#2952AB]">${delivery.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium">
            Contact Driver
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Report Issue
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
