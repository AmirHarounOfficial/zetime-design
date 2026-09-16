import { ChevronLeft, Star, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { featuredServices } from "../data/mock-data";
import { BottomNav } from "./bottom-nav";

export function FeaturedServicesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1"
            >
              <ChevronLeft
                size={24}
                className="text-[#2952AB]"
                strokeWidth={1.5}
              />
            </button>
            <div className="flex items-center gap-2">
              <Star
                size={18}
                className="text-[#C69815]"
                strokeWidth={1.5}
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Featured Services
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Filter/Sort Section */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white rounded-full text-sm">
            All Services
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-[#C2D1E8]/30 text-gray-700 rounded-full text-sm">
            Popular
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-[#C2D1E8]/30 text-gray-700 rounded-full text-sm">
            New
          </button>
          <button className="flex-shrink-0 px-4 py-2 bg-white border border-[#C2D1E8]/30 text-gray-700 rounded-full text-sm">
            Trending
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
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
                className="bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30 hover:shadow-lg transition-all"
              >
                <div className="relative h-40">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  {service.badge && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 bg-gradient-to-b from-white to-[#F2F5FB]">
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {service.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More Coming Soon */}
        <div className="bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] p-6 border border-[#C2D1E8]/30 text-center mb-6">
          <TrendingUp
            size={32}
            className="text-[#2952AB] mx-auto mb-3"
            strokeWidth={1.5}
          />
          <h3 className="font-medium text-[#2952AB] mb-1">
            More Services Coming
          </h3>
          <p className="text-sm text-gray-600">
            We're constantly adding new featured services
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}