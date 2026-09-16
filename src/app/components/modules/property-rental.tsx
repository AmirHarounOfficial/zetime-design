import { Building, MapPin, Star, Wifi, Car as CarIcon, Coffee } from 'lucide-react';
import { ModuleTemplate } from './module-template';

export function PropertyRentalModule() {
  const properties = [
    {
      id: 1,
      name: "لوفت فاخر على الواجهة البحرية",
      location: "وسط المدينة",
      price: "1,050 درهم / ليلة",
      rating: 4.9,
      reviews: 124,
      imageUrl:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
      amenities: ["واي فاي", "مواقف", "مطبخ"],
    },
    {
      id: 2,
      name: "استوديو عصري",
      location: "مركز المدينة",
      price: "560 درهم / ليلة",
      rating: 4.7,
      reviews: 89,
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80",
      amenities: ["واي فاي", "قهوة"],
    },
    {
      id: 3,
      name: "شقة سكاي لاين",
      location: "الحي المالي",
      price: "820 درهم / ليلة",
      rating: 4.8,
      reviews: 156,
      imageUrl:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80",
      amenities: ["واي فاي", "مواقف"],
    },
  ];

  return (
    <ModuleTemplate
      moduleName="تأجير العقارات"
      icon={Building}
      description="ابحث عن إقامتك المثالية"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <button className="text-xs font-bold text-[#2952AB]">
            الفلاتر
          </button>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-bold">
            العقارات المتوفرة
          </h2>
        </div>

        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-[15px] overflow-hidden shadow-lg border border-gray-100 hover:border-[#2952AB]/20 transition-all font-sans"
          >
            <div className="relative h-52">
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                شائع
              </span>
            </div>

            <div className="p-5 text-right">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className="text-[#C69815] fill-[#C69815]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-bold">
                    {property.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({property.reviews})
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base leading-tight">
                    {property.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 justify-end">
                    <span>{property.location}</span>
                    <MapPin size={12} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4 justify-end">
                {property.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full flex items-center gap-1 border border-gray-100 font-medium"
                  >
                    {amenity === "واي فاي" && (
                      <Wifi size={10} strokeWidth={1.5} />
                    )}
                    {amenity === "مواقف" && (
                      <CarIcon size={10} strokeWidth={1.5} />
                    )}
                    {amenity === "قهوة" && (
                      <Coffee size={10} strokeWidth={1.5} />
                    )}
                    {amenity === "مطبخ" && (
                      <Building size={10} strokeWidth={1.5} />
                    )}
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white rounded-[10px] text-xs font-bold shadow-md">
                  احجز الآن
                </button>
                <span className="font-bold text-gray-900 text-sm">
                  {property.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ModuleTemplate>
  );
}
