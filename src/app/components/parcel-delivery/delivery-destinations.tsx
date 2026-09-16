import { useState } from 'react';
import { ChevronLeft, MapPin, Plus, X, Package, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';

interface Destination {
  id: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  packageType: string;
  packageWeight: string;
  notes?: string;
}

export function DeliveryDestinations() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickupLocation, deliveryType } = location.state || {};

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDestination, setCurrentDestination] = useState<Partial<Destination>>({});

  const savedAddresses = [
    { id: '1', name: 'Home', address: '123 Main Street, Apartment 4B' },
    { id: '2', name: 'Work', address: '456 Business Plaza, Floor 12' },
    { id: '3', name: 'Client Office', address: '789 Corporate Ave, Suite 500' }
  ];

  const packageTypes = ['Documents', 'Small Box', 'Medium Box', 'Large Box', 'Envelope', 'Custom'];

  const addDestination = () => {
    if (currentDestination.address && currentDestination.recipientName &&
        currentDestination.packageType && destinations.length < 5) {
      setDestinations([...destinations, {
        ...currentDestination as Destination,
        id: Date.now().toString()
      }]);
      setCurrentDestination({});
      setShowAddModal(false);
    }
  };

  const removeDestination = (id: string) => {
    setDestinations(destinations.filter(d => d.id !== id));
  };

  const handleContinue = () => {
    if (destinations.length > 0) {
      navigate('/parcel-delivery/select-driver', {
        state: { pickupLocation, destinations, deliveryType }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-40">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl px-6 pt-12 pb-6 border-b border-[#C2D1E8]/10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center text-[#2952AB]">
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-black text-[#2952AB] uppercase tracking-widest leading-none">Destinations</h1>
              <p className="text-[10px] font-bold text-[#C69815] uppercase tracking-widest">Add up to 5 stops</p>
            </div>
            <div className="bg-[#2952AB] text-white text-xs font-black px-3 py-1.5 rounded-[10px]">
              {destinations.length}/5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-6 space-y-4">
        {/* Destinations List */}
        {destinations.map((dest, index) => (
          <div key={dest.id} className="bg-white rounded-[15px] p-5 shadow-sm border border-[#C2D1E8]/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#2952AB] text-white rounded-[10px] flex items-center justify-center font-black text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider mb-1">{dest.recipientName}</div>
                    <div className="text-[10px] text-gray-400 font-medium flex items-start gap-1">
                      <MapPin size={12} className="mt-0.5 flex-shrink-0 text-[#C69815]" strokeWidth={2} />
                      <span>{dest.address}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDestination(dest.id)}
                    className="w-8 h-8 bg-red-50 hover:bg-red-100 flex items-center justify-center rounded-[8px] transition-colors"
                  >
                    <X size={14} className="text-red-500" strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Package size={10} strokeWidth={2} />
                    <span>{dest.packageType}</span>
                  </div>
                  {dest.packageWeight && <span>{dest.packageWeight}</span>}
                </div>
                {dest.notes && (
                  <div className="mt-2 text-[9px] text-gray-400 bg-gray-50 rounded-[8px] p-2 font-medium">
                    Note: {dest.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Destination Button */}
        {destinations.length < 5 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-white border-2 border-dashed border-[#C2D1E8]/40 rounded-[15px] p-5 text-[#2952AB] hover:border-[#C69815]/40 transition-colors active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-widest">Add Destination</span>
            </div>
          </button>
        )}

        {destinations.length === 5 && (
          <div className="bg-[#FEF8E7] border border-[#C69815]/20 rounded-[12px] p-3 text-center">
            <p className="text-[10px] font-black text-[#2952AB] uppercase tracking-widest">Maximum destinations reached</p>
          </div>
        )}
      </div>

      {/* Add Destination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2952AB]/60 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white w-full max-w-md mx-auto rounded-t-[25px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-[#C2D1E8]/10 flex items-center justify-between rounded-t-[25px]">
              <h2 className="text-sm font-black text-[#2952AB] uppercase tracking-widest">Add Destination</h2>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-[10px] text-gray-400">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 pb-10">
              {/* Quick Select Addresses */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-3 block">Select Address</label>
                <div className="space-y-2">
                  {savedAddresses.map(addr => (
                    <button
                      key={addr.id}
                      onClick={() => setCurrentDestination({ ...currentDestination, address: addr.address })}
                      className={`w-full text-left p-4 rounded-[12px] border-2 transition-all ${
                        currentDestination.address === addr.address
                          ? 'border-[#2952AB] bg-[#E4ECF7]'
                          : 'border-transparent bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-black text-[#2952AB] uppercase tracking-wider mb-0.5">{addr.name}</div>
                      <div className="text-[10px] text-gray-400">{addr.address}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Or Enter Manually */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-2 block">Or Enter Address</label>
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  value={currentDestination.address || ''}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, address: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300"
                />
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-2 block">Recipient Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={currentDestination.recipientName || ''}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, recipientName: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300"
                />
              </div>

              {/* Recipient Phone */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-2 block">Recipient Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={currentDestination.recipientPhone || ''}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, recipientPhone: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300"
                />
              </div>

              {/* Package Type */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-3 block">Package Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {packageTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setCurrentDestination({ ...currentDestination, packageType: type })}
                      className={`py-3 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all ${
                        currentDestination.packageType === type
                          ? 'bg-[#2952AB] text-white shadow-md'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package Weight */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-2 block">Package Weight</label>
                <input
                  type="text"
                  placeholder="e.g., 2.5 kg"
                  value={currentDestination.packageWeight || ''}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, packageWeight: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-black text-[#2952AB] uppercase tracking-[0.2em] mb-2 block">Delivery Notes (Optional)</label>
                <textarea
                  placeholder="Special instructions..."
                  value={currentDestination.notes || ''}
                  onChange={(e) => setCurrentDestination({ ...currentDestination, notes: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 rounded-[12px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 placeholder:text-gray-300 resize-none"
                  rows={3}
                />
              </div>

              {/* Add Button */}
              <button
                onClick={addDestination}
                disabled={!currentDestination.address || !currentDestination.recipientName || !currentDestination.packageType}
                className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-40 transition-all active:scale-[0.98]"
              >
                Add Destination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="fixed bottom-12 left-0 right-0 px-6 z-40">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={destinations.length === 0}
            className="w-full bg-[#2952AB] text-white py-5 rounded-[15px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#2952AB]/20 flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:shadow-none active:scale-[0.98]"
          >
            Request Offers from Captains
            <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
