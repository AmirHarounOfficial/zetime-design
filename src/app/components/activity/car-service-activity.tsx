import { ChevronLeft, Car, MapPin, Calendar, Clock, User, Phone, Wrench } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function CarServiceActivity() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const service = {
    id: serviceId || '1',
    serviceName: 'Full Car Wash',
    category: 'Car Wash',
    bookingNumber: 'ZT-CS-9012',
    status: 'confirmed',
    provider: 'Premium Auto Care',
    providerRating: 4.8,
    scheduledDate: 'Apr 22, 2026',
    scheduledTime: '10:00 AM',
    duration: '45 minutes',
    address: '555 Auto Plaza, Service Bay 3',
    providerPhone: '+1 (555) 333-4444',
    total: 35.00,
    notes: 'Please focus on interior cleaning',
    technicianName: 'Robert Brown'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Service Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[10px] p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm opacity-90 mb-1">Booking Confirmed</div>
              <div className="text-xl font-semibold">{service.bookingNumber}</div>
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full text-xs">
              Confirmed
            </div>
          </div>
          <div className="bg-white/20 rounded-[10px] p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} strokeWidth={1.5} />
              <span>{service.scheduledDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} strokeWidth={1.5} />
              <span>{service.scheduledTime} ({service.duration})</span>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Car size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Service</h2>
          </div>
          <div className="space-y-2">
            <div className="text-base font-medium text-gray-900">{service.serviceName}</div>
            <div className="text-sm text-gray-600">{service.category}</div>
          </div>
        </div>

        {/* Provider Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Provider</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="font-medium text-gray-900 mb-1">{service.provider}</div>
              <div className="text-sm text-gray-600">Rating: {service.providerRating} ⭐</div>
            </div>
            {service.technicianName && (
              <div className="pt-2 border-t border-[#C2D1E8]/30">
                <div className="text-xs text-gray-500 mb-1">Assigned Technician</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {service.technicianName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{service.technicianName}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} strokeWidth={1.5} />
              <span>{service.providerPhone}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Service Location</h2>
          </div>
          <p className="text-sm text-gray-600 ml-6">{service.address}</p>
        </div>

        {/* Special Instructions */}
        {service.notes && (
          <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
            <h2 className="text-sm font-medium text-[#2952AB] mb-2">Special Instructions</h2>
            <p className="text-sm text-gray-600">{service.notes}</p>
          </div>
        )}

        {/* Payment */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#2952AB]">Total Amount</span>
            <span className="text-lg font-semibold text-[#2952AB]">${service.total.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Payment on service completion</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium">
            Get Directions
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Contact Provider
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Reschedule
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-red-600 py-4 rounded-[10px] font-medium">
            Cancel Booking
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
