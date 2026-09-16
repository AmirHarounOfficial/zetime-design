import { Navigation, MapPin, Truck, Fuel, KeyRound, Battery, Wrench, Settings, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { ModuleTemplate } from './module-template';
import { parkingSpots } from '../../data/mock-data';

export function StreetAssistantModule() {
  const services = [
    {
      id: "car-towing",
      name: "سحب السيارات",
      icon: Truck,
      description: "خدمة سحب في حالات الطوارئ",
      route: "/street-assistant/car-towing",
    },
    {
      id: "fuel-delivery",
      name: "توصيل الوقود",
      icon: Fuel,
      description: "يتم توصيل الوقود إليك",
      route: "/street-assistant/fuel-delivery",
    },
    {
      id: "car-opening",
      name: "فتح باب السيارة",
      icon: KeyRound,
      description: "فتح سيارتك المقفلة",
      route: "/street-assistant/car-opening",
    },
    {
      id: "battery-revive",
      name: "إنعاش البطارية",
      icon: Battery,
      description: "خدمة بدء تشغيل البطارية",
      route: "/street-assistant/battery-revive",
    },
    {
      id: "tyre-fixing",
      name: "إصلاح الإطارات",
      icon: Settings,
      description: "إصلاح الإطارات المسطحة",
      route: "/street-assistant/tyre-fixing",
    },
    {
      id: "global-fixing",
      name: "إصلاح عام",
      icon: Wrench,
      description: "إصلاح عام على الطريق",
      route: "/street-assistant/global-fixing",
    },
  ];

  return (
    <ModuleTemplate
      moduleName="مساعد الطريق"
      icon={Navigation}
      description="مساعد الملاحة والخدمات الحضرية"
    >
      <div className="space-y-6">
        {/* Emergency Services */}
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            خدمات الطوارئ
          </h2>
          <div className="space-y-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.id}
                  to={service.route}
                  className="block bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30 hover:border-[#2952AB]/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <ChevronLeft
                      size={20}
                      className="text-[#7A9ACB] flex-shrink-0 rotate-180"
                      strokeWidth={1.5}
                    />
                    <div className="flex-1 min-w-0 text-right">
                      <h3 className="font-bold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {service.description}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center flex-shrink-0 border border-[#C2D1E8]/20">
                      <Icon
                        size={24}
                        className="text-[#2952AB]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Nearby Parking */}
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            مواقف سيارات قريبة
          </h2>
          <div className="space-y-3">
            {parkingSpots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      spot.availability > 10
                        ? "bg-green-50 text-green-600"
                        : spot.availability > 5
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {spot.availability} / {spot.total} متاح
                  </span>
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-gray-900">
                      {spot.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {spot.address}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3 justify-end">
                  {spot.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] text-[#2952AB]/70 px-2 py-0.5 rounded-full font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#C2D1E8]/30">
                  <button className="px-5 py-2 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white rounded-[10px] text-xs font-bold shadow-md">
                    ملاحة
                  </button>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-bold text-[#2952AB]">
                      {spot.price} درهم / {spot.priceUnit}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>{spot.distance}</span>
                    <MapPin size={14} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleTemplate>
  );
}
