import { ChevronLeft, MapPin, Calendar, Users, Key, Phone, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function PropertyRentalActivity() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const booking = {
    id: bookingId || '1',
    propertyName: 'Luxury Downtown Apartment',
    propertyAddress: '456 Oak Avenue, Downtown',
    checkIn: 'Apr 25, 2026',
    checkOut: 'Apr 28, 2026',
    nights: 3,
    guests: { adults: 2, children: 1 },
    status: 'confirmed',
    confirmationCode: 'ZT-PR-1234',
    total: 450.00,
    pricePerNight: 150.00,
    hostName: 'Sarah Johnson',
    hostPhone: '+1 (555) 987-6543',
    hostEmail: 'sarah.j@example.com',
    checkInTime: '3:00 PM',
    checkOutTime: '11:00 AM'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Booking Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[10px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Key size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm opacity-90">Booking Confirmed</div>
              <div className="text-xl font-semibold">{booking.confirmationCode}</div>
            </div>
          </div>
          <div className="bg-white/20 rounded-[10px] p-3 text-sm">
            Your reservation is confirmed. Check-in instructions will be sent 24 hours before arrival.
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Property</h2>
          <div className="space-y-2">
            <div className="font-medium text-gray-900">{booking.propertyName}</div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span>{booking.propertyAddress}</span>
            </div>
          </div>
        </div>

        {/* Check-in/out Details */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Stay Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">Check-in</div>
                <div className="text-sm font-medium text-gray-900">{booking.checkIn}</div>
                <div className="text-xs text-gray-500">After {booking.checkInTime}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Check-out</div>
                <div className="text-sm font-medium text-gray-900">{booking.checkOut}</div>
                <div className="text-xs text-gray-500">Before {booking.checkOutTime}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#C2D1E8]/30">
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="text-sm font-medium text-gray-900">{booking.nights} nights</div>
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Guests</h2>
          </div>
          <div className="text-sm text-gray-600">
            {booking.guests.adults} {booking.guests.adults === 1 ? 'Adult' : 'Adults'}
            {booking.guests.children > 0 && `, ${booking.guests.children} ${booking.guests.children === 1 ? 'Child' : 'Children'}`}
          </div>
        </div>

        {/* Host Information */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Host Information</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white rounded-full flex items-center justify-center font-medium">
                {booking.hostName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-900">{booking.hostName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone size={14} strokeWidth={1.5} />
              <span>{booking.hostPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={14} strokeWidth={1.5} />
              <span>{booking.hostEmail}</span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">${booking.pricePerNight} x {booking.nights} nights</span>
              <span className="text-gray-900">${booking.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-[#2952AB] pt-2 border-t border-[#C2D1E8]/30">
              <span>Total Paid</span>
              <span>${booking.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium">
            Contact Host
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Get Directions
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
