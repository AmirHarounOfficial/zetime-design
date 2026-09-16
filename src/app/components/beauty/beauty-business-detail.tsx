import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Home as HomeIcon,
  Sparkles,
  Scissors,
  Check,
  Plus,
  Trash2,
  Users,
  MessageCircle,
  Share2,
  Heart,
  Zap,
  Info,
  ChevronDown,
  Building,
} from 'lucide-react';
import { beautyBusinesses, BeautyBranchService, BeautyBranch } from '../../data/beauty-mock-data';

export function BeautyBusinessDetail() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const business = beautyBusinesses.find((b) => b.id === businessId) || beautyBusinesses[0];

  // Selected Branch state (default to nearest branch - US-010)
  const defaultBranch = business.branches.find((b) => b.isNearest) || business.branches[0];
  const [selectedBranch, setSelectedBranch] = useState<BeautyBranch>(defaultBranch);
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'services' | 'team' | 'reviews' | 'about'>('services');

  // Multi-service selection cart (US-052)
  const [selectedServices, setSelectedServices] = useState<BeautyBranchService[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle service selection
  const toggleService = (service: BeautyBranchService) => {
    if (selectedServices.some((s) => s.serviceId === service.serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s.serviceId !== service.serviceId));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMin, 0);

  const handleProceedToBooking = () => {
    if (selectedServices.length === 0) return;
    const serviceIds = selectedServices.map((s) => s.serviceId).join(',');
    navigate(`/beauty/book/${business.id}?branchId=${selectedBranch.id}&services=${serviceIds}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-32" dir="rtl">
      {/* Sticky Header with Back, Title & Actions */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB] transition-all"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <span className="font-bold text-sm text-gray-900 truncate max-w-[200px]">{business.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-gray-600 hover:text-red-500 shadow-sm transition-all"
          >
            <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: business.name, url: window.location.href }).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB] transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Cover Photos Carousel */}
        <div className="relative h-56 w-full">
          <img
            src={business.coverUrls[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Audience & Type Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-sm text-white">
              {business.audience === 'women' ? 'صالون نسائي' : business.audience === 'men' ? 'حلاقة رجالية' : 'مركز تجميل'}
            </span>
            {business.type === 'FREELANCER' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#C69815] text-white">
                خبير مستقل
              </span>
            )}
          </div>

          {/* Rating floating overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-[10px] shadow">
            <Star size={16} className="fill-[#C69815] text-[#C69815]" />
            <span className="text-sm font-bold text-gray-900">{business.rating}</span>
            <span className="text-xs text-gray-500">({business.reviewsCount} تقييم موثق)</span>
          </div>
        </div>

        {/* Business Header Info */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-[#C2D1E8]/30">
          <div className="flex items-start gap-3.5">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-16 h-16 rounded-[12px] object-cover border-2 border-white shadow-md -mt-8 relative z-10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-gray-900 leading-snug">{business.name}</h1>
                {business.verified && <ShieldCheck size={18} className="text-[#2952AB] flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{business.description}</p>
            </div>
          </div>

          {/* Branch Selector Bar (US-010, US-011, US-024) */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">الفرع المحدد للخدمة:</span>
              <button
                onClick={() => setShowBranchModal(true)}
                className="text-[#2952AB] font-bold flex items-center gap-0.5 hover:underline"
              >
                <span>تغيير الفرع ({business.branches.length})</span>
                <ChevronDown size={14} />
              </button>
            </div>

            <div
              onClick={() => setShowBranchModal(true)}
              className="flex items-center justify-between p-2.5 bg-[#F2F5FB] rounded-[10px] border border-[#C2D1E8]/40 cursor-pointer hover:border-[#2952AB]/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[#2952AB]/10 flex items-center justify-center text-[#2952AB]">
                  <Building size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-gray-900">{selectedBranch.name}</span>
                    {selectedBranch.isNearest && (
                      <span className="text-[10px] bg-[#C69815] text-white px-1.5 py-0.2 rounded font-bold">
                        الأقرب لك
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block truncate max-w-[240px]">
                    {selectedBranch.address} • {selectedBranch.distanceKm} كم
                  </span>
                </div>
              </div>
              <ChevronLeft size={16} className="text-[#7A9ACB] rotate-180" />
            </div>

            {/* Live Queue Banner for Selected Branch (US-088) */}
            {selectedBranch.queueActive && (
              <div className="mt-2.5 flex items-center justify-between p-2.5 bg-gradient-to-r from-[#FEF8E7] to-white rounded-[10px] border border-[#C69815]/30 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C69815] animate-ping" />
                  <span className="font-bold text-[#8A680F]">
                    طابور الحضور السريع متاح الآن ({selectedBranch.currentQueueCount} في الانتظار)
                  </span>
                </div>
                <Link
                  to={`/beauty/queue/${business.id}`}
                  className="px-2.5 py-1 bg-[#C69815] text-white rounded-[6px] text-[11px] font-bold shadow-sm"
                >
                  انضم للطابور
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C2D1E8]/30 bg-white sticky top-14 z-20">
          {[
            { id: 'services', label: 'الخدمات والأسعار' },
            { id: 'team', label: `فريق العمل (${business.professionals.length})` },
            { id: 'reviews', label: `التقييمات (${business.reviewsCount})` },
            { id: 'about', label: 'المعلومات والسياسات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#2952AB] text-[#2952AB]'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* TAB 1: Services List & Multi-select (US-038, US-052) */}
          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-gray-500 font-medium">
                  يمكنك تحديد خدمة واحدة أو عدة خدمات معاً لحجز موعد موحد
                </p>
              </div>

              {business.services.map((srv) => {
                const isSelected = selectedServices.some((s) => s.serviceId === srv.serviceId);

                return (
                  <div
                    key={srv.serviceId}
                    onClick={() => toggleService(srv)}
                    className={`p-3.5 rounded-[12px] border transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#2952AB] shadow-md ring-1 ring-[#2952AB] bg-[#F2F5FB]/30'
                        : 'border-[#C2D1E8]/40 hover:border-[#2952AB]/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-gray-900">{srv.name}</h4>
                          {srv.popular && (
                            <span className="text-[10px] bg-[#FEF8E7] text-[#C69815] px-2 py-0.5 rounded-full font-bold border border-[#FAEFC1]">
                              الأكثر طلباً
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[#2952AB]" />
                            {srv.durationMin} دقيقة
                          </span>
                          <span>•</span>
                          <span>
                            تأكيد{' '}
                            {srv.confirmationMode === 'AUTOMATIC' ? (
                              <strong className="text-green-600">فوري</strong>
                            ) : (
                              <strong className="text-orange-600">خلال مهلة 25%</strong>
                            )}
                          </span>
                        </div>

                        {srv.homeServiceAvailable && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1.5 font-medium">
                            <HomeIcon size={12} className="text-[#2952AB]" />
                            <span>متاح بالمنزل: {srv.homePrice} ر.س</span>
                          </div>
                        )}
                      </div>

                      {/* Price & Selection Checkbox */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gray-900">{srv.price}</span>
                          <span className="text-xs text-gray-500 mr-1">ر.س</span>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-[6px] border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#2952AB] border-[#2952AB] text-white shadow-sm'
                              : 'border-[#C2D1E8] bg-white'
                          }`}
                        >
                          {isSelected && <Check size={14} strokeWidth={2.5} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Professionals (US-012, US-031) */}
          {activeTab === 'team' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 px-1">
                خبراء ومصففو الشعر المعتمدون في فرع {selectedBranch.name}
              </p>

              {business.professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm flex items-start gap-3.5"
                >
                  <img
                    src={pro.photoUrl}
                    alt={pro.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-[#2952AB]/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{pro.name}</h4>
                      <div className="flex items-center gap-1 bg-[#FEFBF3] px-2 py-0.5 rounded-[6px] border border-[#FAEFC1]">
                        <Star size={12} className="fill-[#C69815] text-[#C69815]" />
                        <span className="text-xs font-bold text-gray-900">{pro.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#2952AB] font-medium mt-0.5">{pro.title}</p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{pro.bio}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {pro.specialties.map((spec, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">خبرة {pro.experienceYears} سنوات</span>
                      <Link
                        to={`/beauty/professional/${pro.id}`}
                        className="text-xs font-bold text-[#2952AB] hover:underline"
                      >
                        عرض الملف والحجز &larr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Reviews (US-128, US-129) */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-[#F2F5FB] p-4 rounded-[12px] border border-[#C2D1E8]/30 flex items-center justify-around text-center">
                <div>
                  <span className="text-3xl font-extrabold text-[#2952AB]">{business.rating}</span>
                  <div className="flex justify-center gap-0.5 my-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-[#C69815] text-[#C69815]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500">{business.reviewsCount} تقييم موثق</span>
                </div>
                <div className="w-px h-12 bg-[#C2D1E8]" />
                <div className="text-right text-xs text-gray-600 space-y-1">
                  <p className="font-semibold text-gray-900">معايير التقييم:</p>
                  <p>• دقة المواعيد: 4.9/5</p>
                  <p>• النظافة والتعقيم: 5.0/5</p>
                  <p>• مهارة الأخصائيين: 4.9/5</p>
                </div>
              </div>

              <div className="space-y-3">
                {business.reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2952AB]/15 to-[#C69815]/15 flex items-center justify-center font-bold text-xs text-[#2952AB]">
                          {rev.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">{rev.customerName}</span>
                          <span className="text-[10px] text-gray-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} className="fill-[#C69815] text-[#C69815]" />
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded inline-block mb-1.5">
                      الخدمة: {rev.serviceName} • مع: {rev.professionalName}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>

                    {/* Provider Reply (US-129) */}
                    {rev.providerReply && (
                      <div className="mt-2.5 p-2.5 bg-[#FEFBF3] border-r-2 border-[#C69815] rounded-[6px] text-xs text-gray-700">
                        <span className="font-bold text-[#8A680F] block text-[11px] mb-0.5">
                          رد الصالون ({rev.providerReply.date}):
                        </span>
                        <p className="text-[11px] text-gray-600">{rev.providerReply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: About & Policies (US-069, US-076) */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-gray-700">
              <div className="bg-white p-4 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-gray-900">ساعات العمل والموقع</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#2952AB]" />
                    <span>ساعات العمل اليومية: {selectedBranch.workingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#C69815]" />
                    <span>{selectedBranch.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span dir="ltr">{selectedBranch.phone}</span>
                  </div>
                </div>
              </div>

              {/* Policies */}
              <div className="bg-white p-4 rounded-[12px] border border-[#C2D1E8]/40 shadow-sm space-y-3">
                <h3 className="font-bold text-sm text-gray-900">سياسات المواعيد والحضور</h3>
                <div className="p-3 bg-[#FEF8E7] rounded-[8px] border border-[#FAEFC1] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#8A680F] font-bold text-xs">
                    <Info size={14} />
                    <span>فترة السماح عند التأخير: {business.gracePeriodMins} دقيقة (US-069)</span>
                  </div>
                  <p className="text-[11px] text-[#6C510C] leading-relaxed">
                    يرجى الحضور في الموعد المحدد. يمنح الصالون فترة سماح مدتها 15 دقيقة قبل تعديل أو إعادة جدولة الموعد لضمان عدم تأخير العملاء اللاحقين.
                  </p>
                </div>

                <div className="p-3 bg-[#F2F5FB] rounded-[8px] border border-[#C2D1E8]/40 space-y-1">
                  <span className="font-bold text-[#2952AB] text-xs block">سياسة الإلغاء والاسترجاع (US-076):</span>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{business.cancellationPolicy}</p>
                </div>
              </div>

              {/* Chat with Salon (US-131) */}
              <Link
                to={`/chat/beauty-${business.id}`}
                className="w-full py-3 bg-white border border-[#2952AB] text-[#2952AB] font-bold rounded-[10px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#F2F5FB] active:scale-98 transition-all"
              >
                <MessageCircle size={18} />
                <span>مراسلة الصالون مباشرة</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar (US-052) */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#C2D1E8]/40 p-4 shadow-xl">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-[#2952AB] text-white text-xs font-bold flex items-center justify-center">
                  {selectedServices.length}
                </span>
                <span className="text-xs font-bold text-gray-900">خدمات محددة</span>
                <span className="text-xs text-gray-500">({totalDuration} دقيقة)</span>
              </div>
              <div className="mt-0.5">
                <span className="text-lg font-black text-[#2952AB]">{totalPrice}</span>
                <span className="text-xs text-gray-600 mr-1">ر.س الإجمالي</span>
              </div>
            </div>

            <button
              onClick={handleProceedToBooking}
              className="py-3 px-6 bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white rounded-[10px] text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              متابعة الحجز &larr;
            </button>
          </div>
        </div>
      )}

      {/* Branch Selection Modal (US-010) */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center p-0">
          <div className="bg-white rounded-t-[20px] w-full max-w-md p-5 max-h-[75vh] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm">اختر فرع {business.name}</h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-xs text-gray-500 font-semibold p-1 hover:bg-gray-100 rounded"
              >
                إغلاق
              </button>
            </div>

            <div className="space-y-2.5">
              {business.branches.map((br) => (
                <div
                  key={br.id}
                  onClick={() => {
                    setSelectedBranch(br);
                    setShowBranchModal(false);
                  }}
                  className={`p-3.5 rounded-[12px] border cursor-pointer transition-all ${
                    selectedBranch.id === br.id
                      ? 'border-[#2952AB] bg-[#F2F5FB] shadow-sm'
                      : 'border-gray-200 hover:border-[#2952AB]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{br.name}</span>
                      {br.isNearest && (
                        <span className="text-[10px] bg-[#C69815] text-white px-1.5 py-0.2 rounded font-bold">
                          الأقرب
                        </span>
                      )}
                    </div>
                    {selectedBranch.id === br.id && <Check size={16} className="text-[#2952AB]" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{br.address}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                    <span>يبعد {br.distanceKm} كم</span>
                    <span>ساعات العمل: {br.workingHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
