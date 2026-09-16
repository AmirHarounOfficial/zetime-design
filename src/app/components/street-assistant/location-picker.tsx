import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, ChevronDown, Home, Building, Map, X, Search, LocateFixed, Bookmark } from 'lucide-react';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  icon: 'home' | 'building' | 'map';
  lat: number;
  lng: number;
}

const savedAddresses: SavedAddress[] = [
  { id: 'addr-1', label: 'Home', address: '123 Main Street, San Francisco, CA', icon: 'home', lat: 37.7749, lng: -122.4194 },
  { id: 'addr-2', label: 'Office', address: '456 Market Street, San Francisco, CA', icon: 'building', lat: 37.7899, lng: -122.4009 },
  { id: 'addr-3', label: 'Downtown Garage', address: '789 Mission Street, San Francisco, CA', icon: 'map', lat: 37.7852, lng: -122.3964 },
  { id: 'addr-4', label: 'Mall Parking', address: '1200 Van Ness Ave, San Francisco, CA', icon: 'map', lat: 37.7866, lng: -122.4213 },
];

const iconMap = {
  home: Home,
  building: Building,
  map: Map,
};

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: 'navigation' | 'pin';
}

export function LocationPicker({ label, value, onChange, icon = 'navigation' }: LocationPickerProps) {
  const [showScreen, setShowScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapPin, setMapPin] = useState<{ x: number; y: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>(value);
  const [activeTab, setActiveTab] = useState<'map' | 'saved'>('saved');
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const IconComponent = icon === 'navigation' ? Navigation : MapPin;

  // Focus search when screen opens
  useEffect(() => {
    if (showScreen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 300);
    }
  }, [showScreen]);

  const filteredAddresses = savedAddresses.filter(
    (addr) =>
      addr.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      addr.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMapPin({ x, y });
    setSelectedAddress(`Dropped Pin (${(37.77 + (y / rect.height) * 0.03).toFixed(4)}, ${(-122.43 + (x / rect.width) * 0.05).toFixed(4)})`);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onChange(selectedAddress);
      setShowScreen(false);
    }
  };

  const handleSelectSaved = (addr: SavedAddress) => {
    setSelectedAddress(addr.address);
  };

  const handleUseCurrentLocation = () => {
    setSelectedAddress('Current Location (GPS)');
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
        <MapPin size={16} strokeWidth={1.5} />
        {label}
      </h3>

      {/* Trigger button */}
      <button
        onClick={() => {
          setSelectedAddress(value);
          setShowScreen(true);
        }}
        className="w-full bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm text-left flex items-center gap-3 hover:border-[#2952AB]/30 transition-all active:scale-[0.99]"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
          <IconComponent size={18} className="text-[#2952AB]" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium truncate ${value ? 'text-[#2952AB]' : 'text-[#2952AB]/40'}`}>
            {value || 'Tap to select location'}
          </div>
          <div className="text-xs text-[#2952AB]/50 mt-0.5">
            {value ? 'Tap to change' : 'Choose from map or saved locations'}
          </div>
        </div>
        <ChevronDown size={18} className="text-[#7A9ACB] flex-shrink-0" strokeWidth={1.5} />
      </button>

      {/* Full-screen location selector */}
      {showScreen && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] px-4 pt-12 pb-4">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setShowScreen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white/15 hover:bg-white/25 transition-colors"
                >
                  <X size={20} className="text-white" strokeWidth={1.5} />
                </button>
                <div className="flex-1">
                  <h2 className="font-medium text-white text-base">{label}</h2>
                  <p className="text-xs text-white/70">Choose on map or from saved locations</p>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" strokeWidth={1.5} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full bg-white/15 backdrop-blur-sm pl-10 pr-4 py-2.5 rounded-[10px] text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-colors border border-white/10"
                />
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 mt-3 bg-white/10 p-1 rounded-[10px]">
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 py-2 text-xs font-medium rounded-[8px] transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'saved'
                      ? 'bg-white text-[#2952AB] shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Bookmark size={13} strokeWidth={2} />
                  Saved Locations
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex-1 py-2 text-xs font-medium rounded-[8px] transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'map'
                      ? 'bg-white text-[#2952AB] shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Map size={13} strokeWidth={2} />
                  Choose on Map
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-md mx-auto">

              {/* Map tab */}
              {activeTab === 'map' && (
                <div className="p-4">
                  {/* Map container */}
                  <div
                    ref={mapRef}
                    onClick={handleMapClick}
                    className="relative w-full h-72 bg-[#E4ECF7] rounded-[10px] overflow-hidden border border-[#C2D1E8]/40 shadow-inner cursor-crosshair select-none"
                  >
                    {/* Map grid background */}
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(rgba(41, 82, 171, 0.06) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(41, 82, 171, 0.06) 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px'
                    }} />

                    {/* Map "roads" */}
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#2952AB]/10" />
                    <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-[#2952AB]/10" />
                    <div className="absolute top-0 bottom-0 left-2/3 w-[2px] bg-[#2952AB]/10" />
                    <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-[#2952AB]/06" />
                    <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-[#2952AB]/06" />

                    {/* Saved location markers */}
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={addr.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapPin({ x: (idx + 1) * 70, y: 60 + idx * 40 });
                          setSelectedAddress(addr.address);
                        }}
                        className="absolute group"
                        style={{ left: `${20 + idx * 20}%`, top: `${25 + idx * 12}%` }}
                      >
                        <div className="w-7 h-7 bg-[#2952AB] rounded-full flex items-center justify-center shadow-md border-2 border-white transform transition-transform group-hover:scale-110">
                          <MapPin size={13} className="text-white" strokeWidth={2} />
                        </div>
                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-medium text-[#2952AB] shadow-sm border border-[#C2D1E8]/30">
                          {addr.label}
                        </div>
                      </button>
                    ))}

                    {/* Dropped pin */}
                    {mapPin && (
                      <div
                        className="absolute z-10 transform -translate-x-1/2 -translate-y-full"
                        style={{ left: mapPin.x, top: mapPin.y }}
                      >
                        <div className="flex flex-col items-center animate-bounce">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#C69815] to-[#A88012] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <MapPin size={16} className="text-white" strokeWidth={2} />
                          </div>
                          <div className="w-2 h-2 bg-[#C69815] rounded-full mt-0.5 opacity-40" />
                        </div>
                      </div>
                    )}

                    {/* Center crosshair */}
                    {!mapPin && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center gap-2 text-[#2952AB]/30">
                          <MapPin size={32} strokeWidth={1.5} />
                          <span className="text-xs font-medium">Tap to place pin</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Use current location button */}
                  <button
                    onClick={handleUseCurrentLocation}
                    className={`w-full mt-3 p-3.5 flex items-center gap-3 rounded-[10px] border transition-all ${
                      selectedAddress === 'Current Location (GPS)'
                        ? 'bg-[#2952AB]/5 border-[#2952AB] ring-1 ring-[#2952AB]/20'
                        : 'bg-white border-[#C2D1E8]/30 hover:border-[#2952AB]/30'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center shadow-sm">
                      <LocateFixed size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-[#2952AB]">Use Current Location</div>
                      <div className="text-xs text-[#2952AB]/50">Detect via GPS</div>
                    </div>
                    {selectedAddress === 'Current Location (GPS)' && (
                      <CheckCircle2 size={20} className="text-[#2952AB]" strokeWidth={2} />
                    )}
                  </button>

                  {/* Selected location preview */}
                  {selectedAddress && selectedAddress !== 'Current Location (GPS)' && (
                    <div className="mt-3 bg-gradient-to-r from-[#FEF8E7] to-[#E4ECF7] rounded-[10px] p-3.5 border border-[#C69815]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-[#C69815]" strokeWidth={2} />
                        <span className="text-xs font-medium text-[#C69815]">Selected Location</span>
                      </div>
                      <p className="text-sm text-[#2952AB] font-medium">{selectedAddress}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Saved locations tab */}
              {activeTab === 'saved' && (
                <div className="p-4 space-y-2">
                  {/* Use current location */}
                  <button
                    onClick={handleUseCurrentLocation}
                    className={`w-full p-3.5 flex items-center gap-3 rounded-[10px] border transition-all ${
                      selectedAddress === 'Current Location (GPS)'
                        ? 'bg-[#2952AB]/5 border-[#2952AB] ring-1 ring-[#2952AB]/20'
                        : 'bg-white border-[#C2D1E8]/30 hover:border-[#2952AB]/30'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center shadow-sm">
                      <LocateFixed size={18} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-[#2952AB]">Use Current Location</div>
                      <div className="text-xs text-[#2952AB]/50">Detect via GPS</div>
                    </div>
                    {selectedAddress === 'Current Location (GPS)' && (
                      <CheckCircle2 size={20} className="text-[#2952AB]" strokeWidth={2} />
                    )}
                  </button>

                  {/* Section label */}
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <Bookmark size={13} className="text-[#2952AB]/40" strokeWidth={2} />
                    <span className="text-xs font-medium text-[#2952AB]/50 uppercase tracking-wider">Saved Locations</span>
                    <div className="flex-1 h-px bg-[#C2D1E8]/20" />
                  </div>

                  {/* Saved address cards */}
                  {filteredAddresses.length > 0 ? (
                    filteredAddresses.map((addr) => {
                      const AddrIcon = iconMap[addr.icon];
                      const isSelected = selectedAddress === addr.address;
                      return (
                        <button
                          key={addr.id}
                          onClick={() => handleSelectSaved(addr)}
                          className={`w-full p-3.5 flex items-center gap-3 rounded-[10px] border transition-all ${
                            isSelected
                              ? 'bg-[#2952AB]/5 border-[#2952AB] ring-1 ring-[#2952AB]/20'
                              : 'bg-white border-[#C2D1E8]/30 hover:border-[#2952AB]/30'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#2952AB] to-[#3B6EC9]'
                              : 'bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10'
                          }`}>
                            <AddrIcon size={18} className={isSelected ? 'text-white' : 'text-[#2952AB]'} strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium text-[#2952AB]">{addr.label}</div>
                            <div className="text-xs text-[#2952AB]/50 truncate">{addr.address}</div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 size={20} className="text-[#2952AB] flex-shrink-0" strokeWidth={2} />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Search size={32} className="text-[#2952AB]/20 mx-auto mb-2" strokeWidth={1.5} />
                      <p className="text-sm text-[#2952AB]/40">No locations match your search</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom confirm bar */}
          <div className="border-t border-[#C2D1E8]/20 bg-white px-4 py-4">
            <div className="max-w-md mx-auto">
              {/* Selected preview */}
              {selectedAddress && (
                <div className="mb-3 flex items-center gap-2.5 bg-[#E4ECF7]/50 rounded-[10px] px-3.5 py-2.5">
                  <MapPin size={16} className="text-[#2952AB] flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-[#2952AB] font-medium truncate flex-1">{selectedAddress}</span>
                </div>
              )}
              <button
                onClick={handleConfirm}
                disabled={!selectedAddress}
                className={`w-full py-3.5 rounded-[10px] font-medium text-sm shadow-lg transition-all ${
                  selectedAddress
                    ? 'bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white active:scale-[0.98]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
