import { UtensilsCrossed, MapPin, Star, Clock, Users } from 'lucide-react';
import { ModuleTemplate } from './module-template';

export function RestaurantTablesModule() {
  const restaurants = [
    {
      id: 1,
      name: "حديقة اللبلاب",
      cuisine: "نخبة الطهي",
      location: "وسط المدينة",
      rating: 4.9,
      reviews: 342,
      priceRange: "$$$$",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80",
      availability: "الليلة الساعة 7:00 مساءً",
    },
    {
      id: 2,
      name: "سطح الغروب",
      cuisine: "عصري",
      location: "الواجهة البحرية",
      rating: 4.8,
      reviews: 287,
      priceRange: "$$$",
      imageUrl:
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=400&q=80",
      availability: "الليلة الساعة 8:30 مساءً",
    },
    {
      id: 3,
      name: "مطبخ ماريو الإيطالي",
      cuisine: "إيطالي",
      location: "مركز المدينة",
      rating: 4.7,
      reviews: 198,
      priceRange: "$$",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
      availability: "الليلة الساعة 6:30 مساءً",
    },
  ];

  return (
    <ModuleTemplate
      moduleName="حجز المطاعم"
      icon={UtensilsCrossed}
      description="احجز تجربتك في تناول الطعام"
    >
      <div className="space-y-6">
        {/* Quick Booking */}
        <div className="bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] p-4 text-white">
          <h3 className="font-semibold mb-3 text-right">حجز سريع</h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-white/10 rounded-[10px] p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-xs opacity-80">عدد الأفراد</span>
                <Users size={14} strokeWidth={1.5} />
              </div>
              <select className="bg-transparent text-white font-medium outline-none w-full text-right appearance-none">
                <option value="2" className="text-gray-900">2 أشخاص</option>
                <option value="4" className="text-gray-900">4 أشخاص</option>
                <option value="6" className="text-gray-900">6 أشخاص</option>
              </select>
            </div>

            <div className="bg-white/10 rounded-[10px] p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1 justify-end">
                <span className="text-xs opacity-80">الوقت</span>
                <Clock size={14} strokeWidth={1.5} />
              </div>
              <select className="bg-transparent text-white font-medium outline-none w-full text-right appearance-none">
                <option value="tonight" className="text-gray-900">الليلة</option>
                <option value="tomorrow" className="text-gray-900">غداً</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-[#C69815] text-white py-2.5 rounded-[10px] hover:bg-[#C19F2F] transition-colors font-bold uppercase tracking-wider text-xs">
            البحث عن طاولات متاحة
          </button>
        </div>

        {/* Restaurant List */}
        <div>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 px-1 mb-3 text-right">
            المطاعم الشعبية
          </h2>

          <div className="space-y-3 text-right">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-[10px] overflow-hidden shadow-sm border border-gray-100 hover:border-[#2952AB]/20 transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs px-3 py-1 rounded-full">
                    {restaurant.cuisine}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-gray-900">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1 justify-end">
                        <span>{restaurant.priceRange}</span>
                        <span className="text-gray-300 mx-1">•</span>
                        <span>{restaurant.location}</span>
                        <MapPin size={14} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3 justify-end">
                    <span className="text-xs text-gray-400">
                      ({restaurant.reviews})
                    </span>
                    <span className="text-sm font-medium">
                      {restaurant.rating}
                    </span>
                    <Star
                      size={14}
                      className="text-[#C69815] fill-[#C69815]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="px-6 py-2 bg-[#2952AB] text-white rounded-[10px] text-xs font-bold hover:bg-[#3B6EC9] transition-colors">
                      احجز الآن
                    </button>
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <span>{restaurant.availability}</span>
                      <Clock size={14} strokeWidth={1.5} />
                    </div>
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
