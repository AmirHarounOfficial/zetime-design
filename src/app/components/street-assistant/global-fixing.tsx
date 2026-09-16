import { useState } from 'react';
import { ChevronLeft, CreditCard, Wallet, Smartphone, CheckCircle2, Clock, Star, Wrench, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';
import { streetAssistantProviders, UserCar } from '../../data/mock-data';
import { LocationPicker } from './location-picker';
import { CarSelector } from './car-selector';

export function GlobalFixing() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'location' | 'payment' | 'provider' | 'waiting'>('location');

  const [currentLocation, setCurrentLocation] = useState('');
  const [selectedCar, setSelectedCar] = useState<UserCar | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState(60);

  const providers = streetAssistantProviders['global-fixing'];

  const paymentMethods = [
    { id: 'card', name: 'Credit Card', icon: CreditCard, details: '**** 4242' },
    { id: 'cash', name: 'Cash', icon: Wallet, details: 'Pay on arrival' },
    { id: 'digital', name: 'Digital Wallet', icon: Smartphone, details: 'Apple Pay' }
  ];

  const handleNext = () => {
    if (step === 'location' && currentLocation && selectedCar) {
      setStep('payment');
    } else if (step === 'payment' && paymentMethod) {
      setStep('provider');
    } else if (step === 'provider' && selectedProvider) {
      setStep('waiting');
      const timer = setInterval(() => {
        setWaitingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => navigate('/activity'), 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const canProceed = () => {
    if (step === 'location') return currentLocation && selectedCar;
    if (step === 'payment') return paymentMethod;
    if (step === 'provider') return selectedProvider;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] px-4 pt-12 pb-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)} className="p-1">
              <ChevronLeft size={24} className="text-white" strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="font-medium text-white">Global Fixing</h1>
              <p className="text-sm text-white/80">General roadside repair service</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            {['location', 'payment', 'provider', 'waiting'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-1 flex-1 rounded-full ${
                  step === s || ['location', 'payment', 'provider', 'waiting'].indexOf(step) > idx
                    ? 'bg-[#C69815]'
                    : 'bg-white/30'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Step 1: Car & Location */}
        {step === 'location' && (
          <>
            <CarSelector selectedCar={selectedCar} onSelectCar={setSelectedCar} />

            <LocationPicker
              label="Vehicle Location"
              value={currentLocation}
              onChange={setCurrentLocation}
              icon="navigation"
            />

            <div className="bg-gradient-to-r from-[#FEF8E7] to-[#E4ECF7] rounded-[10px] p-4 border border-[#C69815]/20">
              <p className="text-sm text-[#2952AB] mb-2">
                <strong>Pricing Upon Inspection:</strong> Our mobile mechanics will diagnose the issue and provide a quote before starting any work.
              </p>
              <p className="text-xs text-[#2952AB]/70 mb-2">
                Common services include:
              </p>
              <ul className="text-xs text-[#2952AB]/70 space-y-1 pl-4">
                <li>• Engine diagnostics and repairs</li>
                <li>• Belt and hose replacement</li>
                <li>• Fluid leaks and top-ups</li>
                <li>• Brake inspections</li>
                <li>• Minor electrical issues</li>
              </ul>
            </div>
          </>
        )}

        {/* Step 2: Payment Method */}
        {step === 'payment' && (
          <div>
            <h3 className="text-sm font-medium text-[#2952AB] mb-3">Select Payment Method</h3>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full bg-white rounded-[10px] p-4 shadow-sm border transition-all ${
                      paymentMethod === method.id
                        ? 'border-[#2952AB] ring-2 ring-[#2952AB]/20'
                        : 'border-[#C2D1E8]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center">
                          <Icon size={20} className="text-[#2952AB]" strokeWidth={1.5} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.details}</div>
                        </div>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircle2 size={20} className="text-[#2952AB]" strokeWidth={2} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select Provider */}
        {step === 'provider' && (
          <div>
            <h3 className="text-sm font-medium text-[#2952AB] mb-3">Available Mechanics</h3>
            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`w-full bg-white rounded-[10px] p-4 shadow-md border transition-all ${
                    selectedProvider === provider.id
                      ? 'border-[#2952AB] ring-2 ring-[#2952AB]/20'
                      : 'border-[#C2D1E8]/30'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Wrench size={20} className="text-[#2952AB]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{provider.name}</span>
                        {provider.verified && (
                          <CheckCircle2 size={14} className="text-blue-500" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={12} className="text-[#C69815] fill-[#C69815]" strokeWidth={1.5} />
                        <span className="text-xs text-gray-600">{provider.rating}</span>
                        <span className="text-xs text-gray-500">• {provider.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#C69815]">Upon Viewing</div>
                      {selectedProvider === provider.id && (
                        <CheckCircle2 size={18} className="text-[#2952AB] mt-1 ml-auto" strokeWidth={2} />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#C2D1E8]/30">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} strokeWidth={1.5} />
                        <span>{provider.distance}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} strokeWidth={1.5} />
                        <span>{provider.estimatedTime} away</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Waiting */}
        {step === 'waiting' && (
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={40} className="text-[#2952AB] animate-pulse" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-[#2952AB] mb-2">Waiting for Provider Response</h3>
            <p className="text-gray-500 mb-4">
              Your request has been sent. The provider will respond within 1 minute.
            </p>
            <div className="text-3xl font-semibold text-[#C69815]">
              {Math.floor(waitingTime / 60)}:{(waitingTime % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-500 mt-1">Time remaining</div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {step !== 'waiting' && (
        <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-4 pb-4">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-[10px] font-medium shadow-lg ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 'location' && 'Continue to Payment'}
              {step === 'payment' && 'Continue to Select Provider'}
              {step === 'provider' && 'Request Repair Service'}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
