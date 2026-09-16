import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Globe,
  Scissors,
  Building,
  ArrowRight,
  Heart,
  Share2,
} from 'lucide-react';
import { beautyBusinesses } from '../../data/beauty-mock-data';

export function BeautyProfessionalDetail() {
  const { professionalId } = useParams();
  const navigate = useNavigate();

  // Find professional and affiliated business
  let foundPro: any = null;
  let affiliatedBiz: any = null;

  for (const biz of beautyBusinesses) {
    const pro = biz.professionals.find((p) => p.id === professionalId);
    if (pro) {
      foundPro = pro;
      affiliatedBiz = biz;
      break;
    }
  }

  // Fallback if not found
  if (!foundPro) {
    foundPro = beautyBusinesses[0].professionals[0];
    affiliatedBiz = beautyBusinesses[0];
  }

  // Find affiliated branch
  const affiliatedBranch =
    affiliatedBiz.branches.find((b: any) => b.id === foundPro.branchId) || affiliatedBiz.branches[0];

  // Services offered by this business that this professional can perform
  const availableServices = affiliatedBiz.services;

  const handleBookWithProfessional = (serviceId?: string) => {
    // US-013: Professional -> Business -> Branch -> Service -> Time -> Booking
    const query = serviceId
      ? `?branchId=${affiliatedBranch.id}&services=${serviceId}&proId=${foundPro.id}`
      : `?branchId=${affiliatedBranch.id}&proId=${foundPro.id}`;
    navigate(`/beauty/book/${affiliatedBiz.id}${query}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB]"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <span className="font-bold text-sm text-gray-900">ملف الأخصائي</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-gray-600">
            <Heart size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB]">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-[16px] p-5 border border-[#C2D1E8]/40 shadow-md text-center relative overflow-hidden">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-[#C69815]/30 mb-3">
            <img src={foundPro.photoUrl} alt={foundPro.name} className="w-full h-full object-cover" />
          </div>

          <h2 className="text-lg font-bold text-gray-900">{foundPro.name}</h2>
          <p className="text-xs text-[#2952AB] font-semibold mt-0.5">{foundPro.title}</p>

          <div className="flex items-center justify-center gap-1.5 mt-2 bg-[#FEFBF3] px-3 py-1 rounded-full border border-[#FAEFC1] inline-flex">
            <Star size={14} className="fill-[#C69815] text-[#C69815]" />
            <span className="text-xs font-bold text-gray-900">{foundPro.rating}</span>
            <span className="text-[11px] text-gray-500">({foundPro.reviewsCount} تقييم)</span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed mt-3 px-2">{foundPro.bio}</p>

          {/* Experience & Language Badges */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-xs">
            <div className="bg-[#F2F5FB] p-2.5 rounded-[10px] flex items-center gap-2 text-right">
              <Award size={18} className="text-[#2952AB]" />
              <div>
                <span className="text-[10px] text-gray-500 block">الخبرة العملية</span>
                <strong className="text-gray-900">{foundPro.experienceYears} سنوات خبرة</strong>
              </div>
            </div>

            <div className="bg-[#FEF8E7] p-2.5 rounded-[10px] flex items-center gap-2 text-right">
              <Globe size={18} className="text-[#C69815]" />
              <div>
                <span className="text-[10px] text-gray-500 block">اللغات</span>
                <strong className="text-gray-900">{foundPro.languages.join(' • ')}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliated Salon / Business Relationship (US-013) */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm">
          <span className="text-xs text-gray-400 font-bold block mb-2">الصالون والفرع التابع له:</span>
          <Link
            to={`/beauty/business/${affiliatedBiz.id}`}
            className="flex items-center justify-between p-3 bg-[#F2F5FB] rounded-[10px] border border-[#C2D1E8]/30 hover:border-[#2952AB]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={affiliatedBiz.logoUrl}
                alt={affiliatedBiz.name}
                className="w-10 h-10 rounded-[8px] object-cover border border-[#C2D1E8]/30"
              />
              <div>
                <h4 className="font-bold text-xs text-gray-900">{affiliatedBiz.name}</h4>
                <p className="text-[11px] text-[#2952AB]">{affiliatedBranch.name} • {affiliatedBranch.city}</p>
              </div>
            </div>
            <ChevronLeft size={16} className="text-[#7A9ACB] rotate-180" />
          </Link>
          <p className="text-[10px] text-gray-500 mt-2">
            * وفقاً لسياسة المنصة، تتم المواعيد والمدفوعات دائماً من خلال الصالون التابع له الأخصائي لضمان الحماية والضمان.
          </p>
        </div>

        {/* Specialties */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm">
          <h3 className="font-bold text-xs text-gray-900 mb-2">التخصصات والمهارات</h3>
          <div className="flex flex-wrap gap-1.5">
            {foundPro.specialties.map((spec: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-[#F2F5FB] text-[#2952AB] border border-[#C2D1E8]/40 rounded-full text-xs font-semibold"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Services provided by this specialist */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-gray-900">الخدمات التي يقدمها الأخصائي</h3>
          <div className="space-y-2">
            {availableServices.map((srv: any) => (
              <div
                key={srv.serviceId}
                className="flex items-center justify-between p-3 rounded-[10px] border border-gray-100 hover:border-[#2952AB]/20 transition-all"
              >
                <div>
                  <h4 className="font-bold text-xs text-gray-900">{srv.name}</h4>
                  <span className="text-[11px] text-gray-500">{srv.durationMin} دقيقة</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#2952AB]">{srv.price} ر.س</span>
                  <button
                    onClick={() => handleBookWithProfessional(srv.serviceId)}
                    className="px-3 py-1.5 bg-[#2952AB] text-white text-xs font-bold rounded-[6px] shadow-sm hover:bg-[#1D3D7A] active:scale-95"
                  >
                    حجز
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Booking CTA (US-013) */}
        <div className="pt-2">
          <button
            onClick={() => handleBookWithProfessional()}
            className="w-full py-3.5 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-[12px] font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>احجز موعداً مع {foundPro.name.split(' ')[0]}</span>
            <ArrowRight size={16} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
