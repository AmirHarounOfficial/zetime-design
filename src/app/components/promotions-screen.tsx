import {
  ChevronLeft,
  Tag,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { promotions } from "../data/mock-data";
import { BottomNav } from "./bottom-nav";

export function PromotionsScreen() {
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
              <Tag
                size={18}
                className="text-[#C69815]"
                strokeWidth={1.5}
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Promotions & Offers
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {promotions.map((promo) => (
          <Link
            key={promo.id}
            to={`/module/${promo.module_key}`}
            className={`block bg-gradient-to-br ${promo.gradient} rounded-[10px] p-6 shadow-lg border border-white/10`}
          >
            <div className={`${promo.textColor}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs opacity-80 bg-white/20 px-3 py-1 rounded-full">
                  {promo.module}
                </span>
                <ChevronRight size={20} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-bold mb-2">
                {promo.title}
              </h2>
              <p className="text-base opacity-90 mb-4">
                {promo.description}
              </p>

              <div className="flex items-center gap-2 text-sm opacity-80">
                <Calendar size={14} strokeWidth={1.5} />
                <span>Valid until end of month</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Additional Promotions */}
        <div className="bg-white rounded-[10px] p-6 border border-[#C2D1E8]/30">
          <div className="text-center">
            <Tag
              size={32}
              className="text-gray-300 mx-auto mb-3"
              strokeWidth={1.5}
            />
            <h3 className="font-medium text-gray-900 mb-1">
              More Offers Coming Soon
            </h3>
            <p className="text-sm text-gray-500">
              Check back regularly for new promotions
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}