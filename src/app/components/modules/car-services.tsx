import { Car, Wrench, Droplets, Wind as WindIcon, Gauge, Battery, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { ModuleTemplate } from './module-template';
import { serviceCategories } from '../../data/mock-data';

const iconMap: Record<string, any> = {
  'droplets': Droplets,
  'gauge': Gauge,
  'battery': Battery,
  'wind': WindIcon,
  'wrench': Wrench
};

export function CarServicesModule() {
  const categories = serviceCategories.filter(
    (cat) => cat.module === "car-services",
  );

  return (
    <ModuleTemplate
      moduleName="خدمات السيارات"
      icon={Car}
      description="عناية احترافية بالسيارات"
    >
      <div className="space-y-4">
        <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 text-right">
          فئات الخدمة
        </h2>

        {categories.map((category) => {
          const Icon = iconMap[category.icon];
          const totalServices = category.services.length;
          const popularService = category.services.find(
            (s) => s.popular,
          );
          const minPrice =
            category.services.length > 0
              ? Math.min(...category.services.map((s) => s.price))
              : 0;

          return (
            <Link
              key={category.id}
              to={`/module/car-services/${category.id}`}
              className="block bg-white rounded-[10px] p-5 shadow-lg border border-[#C2D1E8]/30 hover:border-[#2952AB]/30 transition-all font-sans"
            >
              <div className="flex items-center gap-4">
                <ChevronLeft
                  size={20}
                  className="text-[#7A9ACB] flex-shrink-0 rotate-180"
                  strokeWidth={1.5}
                />
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="font-bold text-gray-900 text-base">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    {minPrice > 0 && (
                      <>
                        <span className="text-xs font-bold text-[#2952AB]">
                          تبدأ من {minPrice} درهم
                        </span>
                        <span className="text-gray-300">•</span>
                      </>
                    )}
                    <span className="text-xs text-gray-500">
                      {totalServices} خدمة متوفرة
                    </span>
                  </div>
                  {popularService && (
                    <p className="text-[11px] text-[#C69815] mt-1 font-medium bg-[#FEF8E7] inline-block px-2 py-0.5 rounded-full">
                      الأكثر طلباً: {popularService.name}
                    </p>
                  )}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[12px] flex items-center justify-center flex-shrink-0 border border-[#C2D1E8]/20 shadow-sm">
                  <Icon
                    size={28}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ModuleTemplate>
  );
}
