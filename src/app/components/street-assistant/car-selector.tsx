import { Car, CheckCircle2 } from 'lucide-react';
import { userCars, UserCar } from '../../data/mock-data';

interface CarSelectorProps {
  selectedCar: UserCar | null;
  onSelectCar: (car: UserCar) => void;
}

export function CarSelector({ selectedCar, onSelectCar }: CarSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
        <Car size={16} strokeWidth={1.5} />
        Select Your Car
      </h3>
      <div className="space-y-2">
        {userCars.map((car) => (
          <button
            key={car.id}
            onClick={() => onSelectCar(car)}
            className={`w-full bg-white rounded-[10px] p-4 shadow-sm border transition-all ${
              selectedCar?.id === car.id
                ? 'border-[#2952AB] ring-1 ring-[#2952AB]/20'
                : 'border-[#C2D1E8]/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center overflow-hidden">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Car size={20} className="text-[#2952AB]" strokeWidth={1.5} />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {car.year} {car.make} {car.model}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-gray-600">{car.color}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{car.plateNumber}</span>
                  </div>
                </div>
              </div>
              {selectedCar?.id === car.id && (
                <CheckCircle2 size={20} className="text-[#2952AB]" strokeWidth={2} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
