import { useState } from "react";
import {
  MapPin,
  Search,
  Home,
  Car,
  Navigation,
  Building,
  UtensilsCrossed,
  Pizza,
  Package,
  Plus,
  ChevronRight,
  Bell,
  X,
  Tag,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import {
  liveActivities,
  featuredServices,
  promotions,
} from "../data/mock-data";
import { BottomNav } from "./bottom-nav";

const iconMap: Record<string, any> = {
  home: Home,
  car: Car,
  "map-pin": Navigation,
  building: Building,
  utensils: UtensilsCrossed,
  pizza: Pizza,
  package: Package,
  sparkles: Sparkles,
  plus: Plus,
};

export function HomeScreen() {
  const [showLocationPopup, setShowLocationPopup] =
    useState(false);

  const modules = [
    {
      id: "home-services",
      name: "خدمات\nمنزلية",
      icon: "home",
      route: "/module/home-services",
    },
    {
      id: "car-services",
      name: "خدمات\nالسيارات",
      icon: "car",
      route: "/module/car-services",
    },
    {
      id: "street-assistant",
      name: "مساعد\nالطريق",
      icon: "map-pin",
      route: "/module/street-assistant",
    },
    {
      id: "property-rental",
      name: "تأجير\nالعقارات",
      icon: "building",
      route: "/module/property-rental",
    },
    {
      id: "restaurant-tables",
      name: "طاولات\nمطاعم",
      icon: "utensils",
      route: "/module/restaurant-tables",
    },
    {
      id: "food-delivery",
      name: "توصيل\nطعام",
      icon: "pizza",
      route: "/module/food-delivery",
    },
    {
      id: "parcel-delivery",
      name: "توصيل\nطرود",
      icon: "package",
      route: "/module/parcel-delivery",
    },
    {
      id: "beauty",
      name: "الجمال\nوالعناية",
      icon: "sparkles",
      route: "/module/beauty",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto">
          {/* User Welcome & Notifications */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-[#2952AB]/60">
                أهلاً بك مجددًا،
              </p>
              <h1 className="font-medium text-[#2952AB]">
                سارة ويليامز
              </h1>
            </div>
            <Link
              to="/notifications"
              className="relative w-10 h-10 bg-white/80 backdrop-blur-sm rounded-[10px] shadow-sm border border-[#C2D1E8]/20 flex items-center justify-center"
            >
              <Bell
                size={20}
                className="text-[#2952AB]"
                strokeWidth={1.5}
              />
              <span className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-[#C69815] to-[#A88012] rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Link>
          </div>

          {/* Location Selector */}
          <button
            onClick={() => setShowLocationPopup(true)}
            className="flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-[10px] shadow-sm border border-[#C2D1E8]/20 w-full"
          >
            <MapPin
              size={18}
              className="text-[#2952AB]"
              strokeWidth={1.5}
            />
            <span className="text-sm">
              وسط المدينة، دبي
            </span>
            <ChevronRight
              size={16}
              className="text-[#7A9ACB] mr-auto rotate-180"
            />
          </button>

          {/* Global Search Bar */}
          <Link
            to="/search"
            className="flex items-center gap-3 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm"
          >
            <Search
              size={20}
              className="text-[#7A9ACB]"
              strokeWidth={1.5}
            />
            <span className="text-[#2952AB]/60">
              ابحث عن أي شيء في ZeTime
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Live Activity Section */}
        <div className="mt-6 space-y-3">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1">
            التتبع المباشر
          </h2>

          {liveActivities.map((activity) => {
            const getActivityRoute = () => {
              if (activity.type === "food-delivery")
                return `/activity/food-delivery/${activity.id}`;
              if (activity.type === "property-rental")
                return `/activity/property-rental/${activity.id}`;
              if (activity.type === "parcel-delivery")
                return `/activity/parcel-delivery/${activity.id}`;
              if (activity.type === "car-service")
                return `/activity/car-service/${activity.id}`;
              if (activity.type === "restaurant-tables")
                return `/activity/restaurant-reservation/${activity.id}`;
              if (activity.type === "beauty")
                return `/activity/beauty/${activity.id}`;
              return "/activity";
            };

            return (
              <Link
                key={activity.id}
                to={getActivityRoute()}
                className="block bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30 hover:border-[#2952AB]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {activity.subtitle}
                    </p>
                  </div>
                  {activity.type === "food-delivery" && (
                    <span className="text-xs bg-gradient-to-r from-orange-50 to-[#FEF8E7] text-orange-600 px-3 py-1 rounded-full border border-orange-100">
                      قيد التنفيذ
                    </span>
                  )}
                  {activity.type === "property-rental" && (
                    <span className="text-xs bg-gradient-to-r from-green-50 to-[#FEFFB3] text-green-600 px-3 py-1 rounded-full border border-green-100">
                      مؤكد
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-2.5 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#2952AB] via-[#3B6EC9] to-[#1D3D7A] rounded-[10px] transition-all duration-300 shadow-sm"
                      style={{ width: `${activity.progress}%` }}
                    />
                  </div>
                  {activity.type === "food-delivery" && (
                    <p className="text-xs text-gray-500 mt-2">
                      الوقت المتوقع: {activity.estimatedTime}
                    </p>
                  )}
                  {activity.type === "property-rental" && (
                    <p className="text-xs text-gray-500 mt-2">
                       تسجيل الوصول خلال {activity.countdownTime}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Service Hub */}
        <div className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-4">
            الخدمات
          </h2>

          <div className="bg-gradient-to-br from-white via-[#F2F5FB] to-white rounded-[10px] p-5 shadow-md border border-[#C2D1E8]/30">
            <div className="grid grid-cols-4 gap-6">
              {modules.map((module) => {
                const Icon = iconMap[module.icon];
                return (
                  <Link
                    key={module.id}
                    to={module.route}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#2952AB]/5 to-[#C69815]/5 rounded-[10px] flex items-center justify-center border border-[#C2D1E8]/20 shadow-sm">
                      <Icon
                        size={24}
                        className="text-[#2952AB]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-[10px] text-center leading-tight text-gray-700 whitespace-pre-line">
                      {module.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Promotions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Tag
                size={16}
                className="text-[#C69815]"
                strokeWidth={1.5}
              />
              <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60">
                العروض والخصومات
              </h2>
            </div>
            <Link
              to="/promotions"
              className="text-xs text-[#2952AB] bg-[#FEF8E7] px-3 py-1 rounded-full border border-[#C69815]/20"
            >
              عرض الكل
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {promotions.map((promo) => (
              <Link
                key={promo.id}
                to={`/module/${promo.module_key}`}
                className={`flex-shrink-0 w-56 bg-gradient-to-br ${promo.gradient} rounded-[10px] p-4 shadow-md border border-white/10`}
              >
                <div className={`${promo.textColor}`}>
                  <div className="text-xs opacity-80 mb-1">
                    {promo.module}
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {promo.title}
                  </div>
                  <div className="text-sm opacity-90">
                    {promo.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Discovery Section */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60">
              الخدمات المميزة
            </h2>
            <Link
              to="/featured-services"
              className="text-xs text-[#2952AB] bg-[#FEF8E7] px-3 py-1 rounded-full border border-[#C69815]/20"
            >
              عرض الكل
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredServices.map((service) => {
              let toPrefix = "/";
              switch (service.type) {
                case "property":
                  toPrefix = "/property/prop";
                  break;
                case "restaurant":
                  toPrefix = "/restaurant/rest";
                  break;
                default:
                  toPrefix = `/${service.type}/`;
              }

              return (
                <Link
                  key={service.id}
                  to={`${toPrefix}${service.id}`}
                  className="flex-shrink-0 w-64 bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30"
                >
                  <div className="relative h-40">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    {service.badge && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 bg-gradient-to-b from-white to-[#F2F5FB]">
                    <h3 className="font-medium text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {service.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Location Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50">
          <div className="w-full bg-white rounded-t-[10px] shadow-2xl pb-8 animate-slide-up">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#C2D1E8]/30">
                <h3 className="font-medium text-[#2952AB]">
                  اختر الموقع
                </h3>
                <button
                  onClick={() => setShowLocationPopup(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#E4ECF7]"
                >
                  <X
                    size={18}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Current Location */}
              <div className="p-4">
                <button className="w-full flex items-center gap-3 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white px-4 py-3 rounded-[10px] shadow-md">
                  <Navigation size={20} strokeWidth={1.5} />
                  <span className="text-sm font-medium">
                    استخدام الموقع الحالي
                  </span>
                </button>
              </div>

              {/* Recent Locations */}
              <div className="px-4">
                <h4 className="text-xs uppercase tracking-wider text-[#2952AB]/60 mb-3 px-1">
                  المواقع الأخيرة
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      name: "وسط المدينة، دبي",
                      detail: "منطقة شارع الشيخ زايد",
                    },
                    {
                      name: "المنطقة المالية",
                      detail: "مركز دبي المالي العالمي",
                    },
                    {
                      name: "منطقة مرسى دبي",
                      detail: "دبي مارينا",
                    },
                  ].map((location, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setShowLocationPopup(false)
                      }
                      className="w-full flex items-start gap-3 bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 text-right"
                    >
                      <MapPin
                        size={20}
                        className="text-[#2952AB] mt-0.5"
                        strokeWidth={1.5}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-[#2952AB]">
                          {location.name}
                        </div>
                        <div className="text-xs text-[#2952AB]/60 mt-0.5">
                          {location.detail}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}