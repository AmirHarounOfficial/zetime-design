import { ChevronLeft, MapPin, Calendar, Users, Clock, UtensilsCrossed, Phone, Mail, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function RestaurantReservationActivity() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const reservation = {
    id: reservationId || '1',
    restaurantName: 'The Grand Restaurant',
    restaurantAddress: '789 Fine Dining Ave, Downtown',
    confirmationCode: 'ZT-RT-4567',
    status: 'confirmed',
    date: 'Apr 20, 2026',
    time: '7:00 PM',
    duration: '2 hours',
    guests: 4,
    hallView: 'Garden View',
    tableNumber: 'G-12',
    tableShape: 'circle',
    specialRequests: 'Window seat preferred, celebrating anniversary',
    contactName: 'Restaurant Manager',
    contactPhone: '+1 (555) 789-0123',
    contactEmail: 'reservations@grandrestaurant.com'
  };

  const getViewColors = (view: string) => {
    if (view.includes('Garden')) return 'from-green-500 to-green-600';
    if (view.includes('Street')) return 'from-gray-500 to-gray-600';
    if (view.includes('Kitchen')) return 'from-orange-500 to-orange-600';
    if (view.includes('Pool')) return 'from-blue-500 to-blue-600';
    return 'from-[#2952AB] to-[#3B6EC9]';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">Reservation Details</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {/* Status Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-[10px] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UtensilsCrossed size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-sm opacity-90">Reservation Confirmed</div>
              <div className="text-xl font-semibold">{reservation.confirmationCode}</div>
            </div>
          </div>
          <div className="bg-white/20 rounded-[10px] p-3 text-sm">
            Your table is reserved and ready. Please arrive on time to ensure your booking.
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Restaurant</h2>
          <div className="space-y-2">
            <div className="font-medium text-gray-900">{reservation.restaurantName}</div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span>{reservation.restaurantAddress}</span>
            </div>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-[#2952AB]" strokeWidth={1.5} />
            <h2 className="text-sm font-medium text-[#2952AB]">Reservation Details</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date & Time</span>
              <span className="text-sm font-medium text-gray-900">{reservation.date} at {reservation.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <span className="text-sm font-medium text-gray-900">{reservation.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Number of Guests</span>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                <Users size={14} strokeWidth={1.5} />
                {reservation.guests} people
              </span>
            </div>
          </div>
        </div>

        {/* Table Information */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Table Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Table Number</span>
              <span className="text-base font-semibold text-[#2952AB]">{reservation.tableNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hall View</span>
              <span className={`text-xs bg-gradient-to-r ${getViewColors(reservation.hallView)} text-white px-3 py-1 rounded-full`}>
                {reservation.hallView}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Table Type</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{reservation.tableShape}</span>
            </div>
          </div>

          {/* Table Visual Representation */}
          <div className="mt-4 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] p-6 flex items-center justify-center">
            <div className="text-center">
              {reservation.tableShape === 'circle' && (
                <div className="w-24 h-24 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-semibold">{reservation.tableNumber}</span>
                </div>
              )}
              {reservation.tableShape === 'rectangle' && (
                <div className="w-32 h-20 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-semibold">{reservation.tableNumber}</span>
                </div>
              )}
              {reservation.tableShape === 'square' && (
                <div className="w-24 h-24 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-semibold">{reservation.tableNumber}</span>
                </div>
              )}
              {reservation.tableShape === 'oval' && (
                <div className="w-32 h-20 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-semibold">{reservation.tableNumber}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">Capacity: {reservation.guests} guests</div>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {reservation.specialRequests && (
          <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
            <h2 className="text-sm font-medium text-[#2952AB] mb-2">Special Requests</h2>
            <p className="text-sm text-gray-600">{reservation.specialRequests}</p>
          </div>
        )}

        {/* Restaurant Contact */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h2 className="text-sm font-medium text-[#2952AB] mb-3">Restaurant Contact</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-900">{reservation.contactName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600">{reservation.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500" strokeWidth={1.5} />
              <span className="text-sm text-gray-600">{reservation.contactEmail}</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gradient-to-br from-[#FEF8E7] to-[#E4ECF7] rounded-[10px] p-4 border border-[#C69815]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-2">Important Notes</h3>
          <ul className="space-y-1 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <Clock size={12} className="mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <span>Please arrive 10 minutes before your reservation time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-3 h-3 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
              <span>Table will be held for 15 minutes after reservation time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-3 h-3 flex items-center justify-center flex-shrink-0 mt-0.5">•</span>
              <span>Smart casual dress code applies</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium">
            Get Directions
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Call Restaurant
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-[#2952AB] py-4 rounded-[10px] font-medium">
            Modify Reservation
          </button>
          <button className="w-full bg-white border border-[#C2D1E8]/30 text-red-600 py-4 rounded-[10px] font-medium">
            Cancel Reservation
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
