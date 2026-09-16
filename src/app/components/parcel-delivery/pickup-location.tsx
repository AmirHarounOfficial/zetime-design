import { useState } from 'react';
import { ChevronLeft, MapPin, Search, Navigation, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';

export function PickupLocation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deliveryType } = location.state || {};
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const savedAddresses = [
    { id: '1', name: 'Home', address: '123 Main Street, Apartment 4B', type: 'home' },
    { id: '2', name: 'Work', address: '456 Business Plaza, Floor 12', type: 'work' },
    { id: '3', name: 'Mom\'s House', address: '789 Oak Avenue, Unit 3', type: 'other' }
  ];

  const recentLocations = [
    { id: '4', address: '321 Pine Street, Building C' },
    { id: '5', address: '555 Elm Road, Suite 200' }
  ];

  const filteredAddresses = savedAddresses.filter(addr =>
    addr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecent = recentLocations.filter(addr =>
    addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedLocation) {
      navigate('/parcel-delivery/destinations', { state: { pickupLocation: selectedLocation, deliveryType } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-40">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">Pickup</h1>
              <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">{deliveryType?.name || 'Standard'} Delivery</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* Current Location */}
        <button
          onClick={() => setSelectedLocation('current')}
          className={`w-full rounded-[15px] p-5 border-2 transition-all text-left active:scale-[0.98] ${
            selectedLocation === 'current'
              ? 'bg-[#E4ECF7] border-[#2952AB] shadow-lg shadow-[#2952AB]/10'
              : 'bg-white border-transparent shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#2952AB] rounded-[10px] flex items-center justify-center shadow-md">
              <Navigation size={20} className="text-[#C69815]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider">Use Current Location</div>
              <div className="text-[10px] text-gray-400 font-medium">GPS location</div>
            </div>
            {selectedLocation === 'current' && <CheckCircle2 size={20} className="text-[#2952AB]" />}
          </div>
        </button>

        {/* Saved Addresses */}
        {filteredAddresses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-[#C69815] rounded-full" />
              <h2 className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em]">Saved Addresses</h2>
            </div>
            <div className="space-y-3">
              {filteredAddresses.map(address => (
                <button
                  key={address.id}
                  onClick={() => setSelectedLocation(address.id)}
                  className={`w-full rounded-[15px] p-5 border-2 transition-all text-left active:scale-[0.98] ${
                    selectedLocation === address.id
                      ? 'bg-[#E4ECF7] border-[#2952AB] shadow-lg shadow-[#2952AB]/10'
                      : 'bg-white border-transparent shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
                      address.type === 'home' ? 'bg-blue-50' : address.type === 'work' ? 'bg-purple-50' : 'bg-gray-50'
                    }`}>
                      <MapPin size={18} className={
                        address.type === 'home' ? 'text-blue-600' : address.type === 'work' ? 'text-purple-600' : 'text-gray-600'
                      } strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider mb-0.5">{address.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{address.address}</div>
                    </div>
                    {selectedLocation === address.id && <CheckCircle2 size={20} className="text-[#2952AB]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Locations */}
        {filteredRecent.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-gray-200 rounded-full" />
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recent</h2>
            </div>
            <div className="space-y-3">
              {filteredRecent.map(address => (
                <button
                  key={address.id}
                  onClick={() => setSelectedLocation(address.id)}
                  className={`w-full rounded-[12px] p-4 border-2 transition-all text-left active:scale-[0.98] ${
                    selectedLocation === address.id
                      ? 'bg-[#E4ECF7] border-[#2952AB]'
                      : 'bg-white border-transparent shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-[8px] flex items-center justify-center">
                      <MapPin size={14} className="text-gray-400" strokeWidth={1.5} />
                    </div>
                    <div className="text-[10px] text-gray-600 font-medium flex-1">{address.address}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add New Address */}
        <button className="w-full bg-white border-2 border-dashed border-[#C2D1E8]/40 rounded-[15px] p-4 text-[#2952AB] hover:border-[#C69815]/40 transition-colors active:scale-[0.98]">
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} strokeWidth={2} />
            <span className="text-[10px] font-black uppercase tracking-widest">Add New Address</span>
          </div>
        </button>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-12 left-0 right-0 px-6 z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedLocation}
            className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-40 disabled:shadow-none"
          >
            Continue
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
