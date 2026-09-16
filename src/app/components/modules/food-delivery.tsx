import { Pizza, Star, Clock, Truck } from 'lucide-react';
import { ModuleTemplate } from './module-template';

export function FoodDeliveryModule() {
  const cuisines = [
    { id: 1, name: "إيطالي", emoji: "🍝" },
    { id: 2, name: "آسيوي", emoji: "🍜" },
    { id: 3, name: "مكسيكي", emoji: "🌮" },
    { id: 4, name: "بيتزا", emoji: "🍕" },
    { id: 5, name: "برجر", emoji: "🍔" },
  ];

  const restaurants = [
    {
      id: 1,
      name: "مطبخ ماريو الإيطالي",
      cuisine: "إيطالي",
      deliveryTime: "25-35 دقيقة",
      rating: 4.8,
      reviews: 520,
      deliveryFee: "مجاني",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
      badge: "شائع",
    },
    {
      id: 2,
      name: "طوكيو إكسبريس",
      cuisine: "ياباني",
      deliveryTime: "30-40 دقيقة",
      rating: 4.9,
      reviews: 412,
      deliveryFee: "12 درهم",
      imageUrl:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
      badge: "الأعلى تقييماً",
    },
    {
      id: 3,
      name: "بيت البرجر",
      cuisine: "أمريكي",
      deliveryTime: "20-30 دقيقة",
      rating: 4.7,
      reviews: 348,
      deliveryFee: "مجاني",
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    },
  ];

  return (
    <ModuleTemplate
      moduleName="توصيل الطعام"
      icon={Pizza}
      description="اطلب من المطاعم المحلية"
    >
      <div className="space-y-6">
        {/* Cuisine Categories */}
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            تصفح حسب نوع المطبخ
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide flex-row-reverse">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine.id}
                className="flex-shrink-0 bg-white rounded-[10px] px-4 py-3 shadow-md border border-[#C2D1E8]/30 hover:border-[#C69815]/40 hover:bg-gradient-to-br hover:from-white hover:to-[#FEFBF3] transition-all"
              >
                <div className="text-2xl mb-1">
                  {cuisine.emoji}
                </div>
                <span className="text-sm text-gray-900 whitespace-nowrap">
                  {cuisine.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurants */}
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            متاح الآن
          </h2>

          <div className="space-y-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30 hover:border-[#C69815]/40 transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {restaurant.badge && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-3 py-1 rounded-full shadow-lg">
                      {restaurant.badge}
                    </span>
                  )}
                </div>

                <div className="p-4 bg-gradient-to-b from-white to-[#F2F5FB]/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1 bg-[#FEF8E7] px-2 py-1 rounded-[10px] border border-[#C69815]/20">
                      <Star
                        size={14}
                        className="text-[#C69815] fill-[#C69815]"
                        strokeWidth={1.5}
                      />
                      <span className="text-sm font-medium">
                        {restaurant.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({restaurant.reviews})
                      </span>
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-bold text-gray-900">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {restaurant.cuisine}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 justify-end">
                    <div className="flex items-center gap-1">
                      <span>توصيل {restaurant.deliveryFee}</span>
                      <Truck size={12} strokeWidth={1.5} />
                    </div>
                    <span className="text-[#C2D1E8]">•</span>
                    <div className="flex items-center gap-1">
                      <span>{restaurant.deliveryTime}</span>
                      <Clock size={12} strokeWidth={1.5} />
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-gradient-to-r from-[#2952AB] via-[#3B6EC9] to-[#2952AB] text-white rounded-[10px] hover:from-[#3B6EC9] hover:via-[#2952AB] hover:to-[#3B6EC9] transition-all shadow-md font-bold text-sm uppercase tracking-wider">
                    عرض القائمة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleTemplate>
  );
}