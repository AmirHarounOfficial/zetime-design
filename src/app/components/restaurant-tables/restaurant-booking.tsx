import { useState } from 'react';
import { ChevronLeft, Calendar, Clock, FileText, CheckCircle2, User, Users, Phone, Mail, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { restaurants, Table } from '../../data/mock-data';

export function RestaurantBooking() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'datetime' | 'hall' | 'table' | 'guests' | 'confirm'>('datetime');

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [notes, setNotes] = useState('');
  
  // Guest Info
  const [isBookingForSelf, setIsBookingForSelf] = useState(true);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const timeSlots = [
    '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
    '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
  ];

  const hall = restaurant.halls.find(h => h.id === selectedHall);

  const handleNext = () => {
    if (step === 'datetime' && selectedDate && selectedTime) {
      setStep('hall');
    } else if (step === 'hall' && selectedHall) {
      setStep('table');
    } else if (step === 'table' && selectedTable) {
      setStep('guests');
    } else if (step === 'guests') {
      if (isBookingForSelf || (guestInfo.name && guestInfo.phone)) {
        setStep('confirm');
      }
    }
  };

  const handleConfirm = () => {
    navigate('/', { replace: true });
  };

  const canProceed = () => {
    if (step === 'datetime') return selectedDate && selectedTime;
    if (step === 'hall') return selectedHall;
    if (step === 'table') return selectedTable;
    if (step === 'guests') return isBookingForSelf || (guestInfo.name.length > 2 && guestInfo.phone.length > 5);
    return true;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const renderTable = (table: Table) => {
    const isSelected = selectedTable?.id === table.id;
    const baseClasses = `absolute cursor-pointer transition-all border outline-none flex items-center justify-center ${
      isSelected
        ? 'bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] border-[#2952AB] text-white shadow-lg scale-110 z-10'
        : table.available
        ? 'bg-white border-[#C2D1E8] hover:border-[#C69815] text-[#2952AB] shadow-sm'
        : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
    }`;

    const style = {
      left: `${table.position.x}px`,
      top: `${table.position.y}px`,
      width: `${table.size.width}px`,
      height: `${table.size.height}px`,
      borderRadius: table.shape === 'circle' ? '100%' : '6px'
    };

    return (
      <button
        key={table.id}
        disabled={!table.available}
        onClick={() => table.available && setSelectedTable(table)}
        className={baseClasses}
        style={style}
      >
        <div className="text-center leading-none">
          <div className="text-[10px] font-black">{table.number}</div>
          <div className="text-[8px] opacity-70">{table.seats}p</div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#2952AB] to-[#3B6EC9] px-6 pt-16 pb-8 rounded-b-[40px] shadow-xl">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-[10px] flex items-center justify-center text-white"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-[0.2em] leading-none mb-1">Reservation</h1>
              <p className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.1em] opacity-80">{restaurant.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {['datetime', 'hall', 'table', 'guests', 'confirm'].map((s, idx) => (
              <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
                <div 
                  className={`h-full transition-all duration-500 ${
                    idx <= ['datetime', 'hall', 'table', 'guests', 'confirm'].indexOf(step)
                      ? 'bg-[#C69815]'
                      : 'w-0'
                  }`} 
                  style={{ width: idx <= ['datetime', 'hall', 'table', 'guests', 'confirm'].indexOf(step) ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8 space-y-8">
        {/* Step 1: DateTime */}
        {step === 'datetime' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div>
              <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
                <Calendar size={14} />
                Preferred Date
              </h3>
              <div className="bg-white rounded-[10px] p-6 shadow-xl border border-white">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50/50 border border-[#C2D1E8]/30 rounded-[10px] px-4 py-4 text-[#2952AB] font-black text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all pointer-events-auto"
                />
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
                <Clock size={14} />
                Available Slots
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-4 rounded-[10px] text-[10px] font-black tracking-tighter transition-all shadow-md ${
                      selectedTime === time
                        ? 'bg-gradient-to-br from-[#C69815] to-[#A88012] text-white'
                        : 'bg-white text-[#2952AB] border border-white'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 px-1">Special Requests</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention allergies, birthdays, or preferences..."
                rows={3}
                className="w-full bg-white rounded-[10px] p-4 text-sm font-bold text-[#2952AB] border border-white shadow-xl placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C69815]/20 transition-all"
              />
            </div>
          </div>
        )}

        {/* Step 2: Hall */}
        {step === 'hall' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 px-1">Select Lounge View</h3>
            <div className="grid gap-4">
              {restaurant.halls.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHall(h.id)}
                  className={`w-full bg-white rounded-[10px] p-5 shadow-lg border transition-all flex items-center justify-between ${
                    selectedHall === h.id ? 'border-[#C69815] scale-[1.02]' : 'border-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center text-xl shadow-inner ${
                      selectedHall === h.id ? 'bg-[#C69815]/10' : 'bg-gray-50'
                    }`}>
                      {h.view === 'garden' && '🌿'}
                      {h.view === 'pool' && '🏊‍♂️'}
                      {h.view === 'street' && '🏙️'}
                      {h.view === 'kitchen' && '👨‍🍳'}
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-[#2952AB] uppercase text-xs tracking-wider">{h.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400">View: {h.view} • {h.capacity} Guests</p>
                    </div>
                  </div>
                  {selectedHall === h.id && <CheckCircle2 size={24} className="text-[#C69815]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Table Layout */}
        {step === 'table' && hall && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 px-1">Choose Your Seat</h3>
            <div className="bg-white rounded-[10px] p-6 shadow-xl border border-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#2952AB] uppercase">{hall.name} Plan</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full border border-[#C2D1E8]" />
                    <span className="text-[9px] font-black text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-100" />
                    <span className="text-[9px] font-black text-gray-400">Taken</span>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-[#FEF8E7]/30 rounded-[10px] border border-dashed border-[#C69815]/20 p-8 h-[360px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C69815 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />
                
                {/* Hall Side View Indicators */}
                <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm border-b border-gray-100 uppercase tracking-[0.3em] text-[8px] font-black text-gray-300">
                  {hall.view === 'street' ? '🏙️ Street View' : '🏢 Building Front'}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm border-t border-gray-100 uppercase tracking-[0.3em] text-[8px] font-black text-gray-300">
                   {hall.view === 'garden' ? '🌿 Garden View' : '🌳 Backyard'}
                </div>
                <div className="absolute top-0 bottom-0 left-0 w-8 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm border-r border-gray-100 uppercase tracking-[0.3em] text-[8px] font-black text-gray-300 pt-[100%] [writing-mode:vertical-lr] rotate-180">
                   {hall.view === 'pool' ? '🏊‍♂️ Pool Area' : '🚪 Entrance'}
                </div>
                <div className="absolute top-0 bottom-0 right-0 w-8 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm border-l border-gray-100 uppercase tracking-[0.3em] text-[8px] font-black text-gray-300 pt-[100%] [writing-mode:vertical-lr]">
                   {hall.view === 'kitchen' ? '👨‍🍳 Kitchen View' : '🌆 City View'}
                </div>

                <div className="relative" style={{ width: '100%', height: '100%' }}>
                  {hall.tables.map(renderTable)}
                </div>
              </div>
              
              {selectedTable && (
                <div className="mt-6 flex items-center justify-between bg-[#2952AB] p-4 rounded-[10px] shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-[8px] flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#C69815] uppercase tracking-widest">Selected Table</p>
                      <p className="text-white font-black">N° {selectedTable.number} • {selectedTable.seats} Seats</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Guests Info */}
        {step === 'guests' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-black text-[#C69815] uppercase tracking-[0.2em] mb-4 px-1">Guest Details</h3>
            
            <div className="bg-white rounded-[10px] p-1 shadow-md border border-white flex mb-6">
              <button 
                onClick={() => setIsBookingForSelf(true)}
                className={`flex-1 py-3 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  isBookingForSelf ? 'bg-[#2952AB] text-white shadow-lg' : 'text-gray-400'
                }`}
              >
                Booking for Me
              </button>
              <button 
                onClick={() => setIsBookingForSelf(false)}
                className={`flex-1 py-3 rounded-[8px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  !isBookingForSelf ? 'bg-[#2952AB] text-white shadow-lg' : 'text-gray-400'
                }`}
              >
                For Someone Else
              </button>
            </div>

            {!isBookingForSelf && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 px-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guest Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter Full Name" 
                      className="w-full bg-white border border-[#C2D1E8]/20 rounded-[10px] pl-12 pr-4 py-4 text-sm font-black text-[#2952AB] placeholder:text-gray-300 focus:outline-none focus:border-[#C69815] transition-all shadow-lg"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C69815]" size={18} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Guest Phone</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      placeholder="+123 456 7890" 
                      className="w-full bg-white border border-[#C2D1E8]/20 rounded-[10px] pl-12 pr-4 py-4 text-sm font-black text-[#2952AB] placeholder:text-gray-300 focus:outline-none focus:border-[#C69815] transition-all shadow-lg"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C69815]" size={18} />
                  </div>
                </div>
              </div>
            )}
            
            {isBookingForSelf && (
              <div className="bg-[#2952AB]/5 border border-dashed border-[#2952AB]/20 rounded-[10px] p-6 text-center">
                <p className="text-xs font-bold text-[#2952AB]/60 italic italic">We'll use your account credentials for this reservation.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Final Confirmation */}
        {step === 'confirm' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-12">
            <div className="bg-white rounded-[10px] shadow-2xl border border-white overflow-hidden">
              <div className="bg-[#2952AB] p-6 text-center text-white relative">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={32} className="text-[#C69815]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">Verify Summary</h3>
                <p className="text-[10px] font-black text-[#C69815] opacity-80 mt-1">One step before confirming</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guest</span>
                    <p className="font-black text-[#2952AB]">{isBookingForSelf ? 'Current User' : guestInfo.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</span>
                    <p className="font-black text-orange-500 uppercase text-[10px]">Pending Confirmation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-4 border-y border-dashed border-[#C2D1E8]/40">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-gray-50 flex items-center justify-center text-[#C69815]">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-gray-400 uppercase">Date</span>
                      <p className="text-[12px] font-black text-[#2952AB]">{selectedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-gray-50 flex items-center justify-center text-[#C69815]">
                      <Clock size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-gray-400 uppercase">Time</span>
                      <p className="text-[12px] font-black text-[#2952AB]">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase">Lounge & Table</span>
                    <p className="text-sm font-black text-[#2952AB]">{hall?.name} • N° {selectedTable?.number}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Seats</span>
                    <p className="text-sm font-black text-[#2952AB]">{selectedTable?.seats} People</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-2xl border-t border-[#C2D1E8]/20 p-6 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button
            onClick={step === 'confirm' ? handleConfirm : handleNext}
            disabled={!canProceed()}
            className={`w-full py-5 rounded-[10px] font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              canProceed()
                ? 'bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] text-white shadow-[#2952AB]/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{step === 'confirm' ? 'Confirm Reservation' : 'Continue Step'}</span>
            <ChevronRight size={18} strokeWidth={3} />
          </button>
          
          {step !== 'datetime' && (
            <button 
              onClick={() => {
                const steps = ['datetime', 'hall', 'table', 'guests', 'confirm'];
                const prev = steps[steps.indexOf(step) - 1] as any;
                setStep(prev);
              }}
              className="w-full py-3 text-[10px] font-black text-[#2952AB] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              Go Back to Previous Step
            </button>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
