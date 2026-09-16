import { useState } from "react";
import {
  ChevronLeft,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Rotate3d,
  Video,
  ChevronRight,
  ChevronDown,
  Lock,
  Share2,
  Snowflake,
  DoorOpen,
  Eye,
  Heart,
  X,
  Play,
  Check,
  Coffee,
  CreditCard,
  Info,
  Leaf,
  Clock,
  Baby,
  Ban,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Tv,
} from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../bottom-nav";
import { properties } from "../../data/mock-data";
import type {
  RoomDetail,
  BathroomDetail,
} from "../../data/mock-data";

export function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [show360Tour, setShow360Tour] = useState(false);
  const [showVideoTour, setShowVideoTour] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState<
    Record<string, boolean>
  >({});
  const [expandedBathrooms, setExpandedBathrooms] = useState<
    Record<string, boolean>
  >({});

  const property = properties.find((p) => p.id === propertyId);

  const t = (str: string) => {
    const arabicTranslations: Record<string, string> = {
      "Master Bedroom": "غرفة النوم الرئيسية",
      "Master Suite": "جناح رئيسي",
      "Queen Room": "غرفة كوين",
      "Queen Bedroom": "غرفة كوين",
      "Guest Bedroom": "غرفة ضيوف",
      "Kids Room": "غرفة أطفال",
      "Twin Room": "غرفة سريرين فرديين",
      "Primary Bedroom": "غرفة النوم الأساسية",
      "Second Bedroom": "غرفة النوم الثانية",
      "Full Room": "غرفة سرير كامل",
      "Studio Room": "غرفة الاستوديو",
      "Open Plan Studio": "استوديو مفتوح",

      "Master Bathroom": "حمام رئيسي",
      "Full Bathroom": "حمام كامل",
      "Guest Bathroom": "حمام ضيوف",
      "Half Bath": "نصف حمام",
      "Family Bathroom": "حمام عائلي",
      "Main Bathroom": "الحمام الرئيسي",
      Bathroom: "حمام",
      Hallway: "الممر",

      King: "كينج",
      Queen: "كوين",
      Twin: "سرير مفرد",
      Full: "سرير كامل",
      "Sofa Bed": "كنبة سرير",

      "Private Bathroom": "حمام خاص",
      AC: "تكييف",
      Wardrobe: "خزانة ملابس",
      Balcony: "شرفة",
      Desk: "مكتب",
      Fireplace: "مدفأة",

      WiFi: "واي فاي",
      Kitchen: "مطبخ",
      Washer: "غسالة",
      Dryer: "مجفف",
      Heating: "تدفئة",
      TV: "تلفزيون",
      Parking: "موقف سيارات",
      Gym: "جيم",
      Pool: "مسبح",
      Backyard: "حديقة خلفية",
      BBQ: "شواء",
    };
    return arabicTranslations[str] || str;
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F5FB]">
        <div className="text-center">
          <div className="text-[#2952AB] font-medium mb-2">
            العقار غير موجود
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-[#2952AB]/60 underline"
          >
            العودة للخدمة
          </button>
        </div>
      </div>
    );
  }

  const toggleRoom = (roomId: string) => {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomId]: !prev[roomId],
    }));
  };

  const toggleBathroom = (bathroomId: string) => {
    setExpandedBathrooms((prev) => ({
      ...prev,
      [bathroomId]: !prev[bathroomId],
    }));
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case "private bathroom":
      case "حمام خاص":
        return <Bath size={14} strokeWidth={1.5} />;
      case "ac":
      case "تكييف":
        return <Snowflake size={14} strokeWidth={1.5} />;
      case "wardrobe":
      case "خزانة ملابس":
        return <DoorOpen size={14} strokeWidth={1.5} />;
      case "balcony":
      case "شرفة":
        return <Eye size={14} strokeWidth={1.5} />;
      case "desk":
      case "مكتب":
        return <DoorOpen size={14} strokeWidth={1.5} />;
      case "fireplace":
      case "مدفأة":
        return <Eye size={14} strokeWidth={1.5} />;
      default:
        return (
          <div className="w-1.5 h-1.5 rounded-full bg-[#C69815]" />
        );
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
      case "واي فاي":
        return <Wifi size={16} className="text-[#008009]" />;
      case "parking":
      case "موقف سيارات":
        return <Car size={16} className="text-[#008009]" />;
      case "kitchen":
      case "مطبخ":
        return <Utensils size={16} className="text-[#008009]" />;
      case "ac":
      case "تكييف":
        return <Snowflake size={16} className="text-[#008009]" />;
      case "pool":
      case "مسبح":
        return <Waves size={16} className="text-[#008009]" />;
      case "gym":
      case "جيم":
        return <Dumbbell size={16} className="text-[#008009]" />;
      case "tv":
      case "تلفزيون":
        return <Tv size={16} className="text-[#008009]" />;
      default:
        return <Check size={16} className="text-[#008009]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5FB] pb-32" dir="rtl">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-[#C2D1E8]/20">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#E4ECF7] rounded-[10px] transition-colors"
            >
              <ChevronLeft
                size={22}
                className="text-[#2952AB] rotate-180"
                strokeWidth={1.5}
              />
            </button>
            <h1 className="font-semibold text-[#2952AB] text-sm">
              تفاصيل العقار
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#E4ECF7] rounded-[10px] transition-colors text-[#2952AB]">
              <Share2 size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-[#E4ECF7] rounded-[10px] transition-colors"
            >
              <Heart
                size={18}
                className={
                  isSaved
                    ? "fill-red-500 text-red-500"
                    : "text-[#2952AB]"
                }
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto pt-16">
        {/* Image Gallery */}
        <div className="relative h-72 group">
          <img
            src={property.images[selectedImage]}
            alt={property.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4">
            {property.images.map((_: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selectedImage === idx
                    ? "bg-white w-8"
                    : "bg-white/40 w-2 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          {property.popular && (
            <span className="absolute top-4 right-4 bg-gradient-to-l from-[#2952AB] to-[#3B6EC9] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-[10px] shadow-xl backdrop-blur-sm">
              عقار مميز
            </span>
          )}
        </div>

        <div className="px-6 mx-[0px] mt-[32px] mb-[80px]">
          {/* Hero Section: Title & Identity */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 flex flex-wrap items-center justify-end gap-2 text-right">
                <div className="flex items-center gap-0.5" dir="ltr">
                  {Array.from({ length: Math.round(property.rating) }).map((_, i) => (
                    <Star key={i} size={14} className="text-[#C69815] fill-[#C69815]" />
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-[#2952AB] leading-tight">
                  {property.name}
                </h2>
              </div>
              <div className="shrink-0 pt-1">
                {(() => {
                  const viewColors: Record<string, string> = {
                    garden:
                      "bg-green-50 text-green-700 border-green-100",
                    street:
                      "bg-gray-50 text-gray-700 border-gray-100",
                    kitchen:
                      "bg-orange-50 text-orange-700 border-orange-100",
                    pool: "bg-blue-50 text-blue-700 border-blue-100",
                  };
                  const viewLabels: Record<string, string> = {
                    garden: "إطلالة على الحديقة",
                    street: "إطلالة على الشارع",
                    kitchen: "إطلالة على المطبخ",
                    pool: "إطلالة على المسبح",
                  };
                  return (
                    null
                  );
                })()}
              </div>
            </div>

            {/* Rating and Location Row */}
            <div className="flex items-center justify-between bg-white p-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm mt-2">
              <div className="flex items-center gap-1.5 text-[#008009] bg-[#E7FDE9] px-2.5 py-1.5 rounded-[6px]">
                <span className="text-[10px] font-bold">
                  موقع ممتاز (9.5)
                </span>
                <MapPin size={12} strokeWidth={2.5} />
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-sm font-bold text-[#2952AB]">
                    {property.rating >= 4.8 ? "استثنائي" : property.rating >= 4.5 ? "ممتاز" : "جيد جداً"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {property.reviews} تقييم
                  </span>
                </div>
                <div className="w-9 h-9 rounded-t-[6px] rounded-br-[6px] rounded-bl-[2px] bg-[#003580] text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {(property.rating * 2).toFixed(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white/50 rounded-[10px] border border-white shrink-0 group transition-all hover:bg-white mx-[0px] mt-[0px] mb-[16px]">
              <div className="w-8 h-8 rounded-[10px] bg-[#E4ECF7] flex items-center justify-center text-[#2952AB]">
                <MapPin size={16} strokeWidth={1.5} />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {property.address}، {property.city}
              </span>
            </div>
          </div>

          {/* Quick Features Bar */}
          <div className="grid grid-cols-3 gap-3 mx-[0px] mt-[0px] mb-[16px]">
            {[
              {
                icon: Bed,
                label: "غرف النوم",
                value: property.rooms.bedrooms,
              },
              {
                icon: Bath,
                label: "الحمامات",
                value: property.rooms.bathrooms,
              },
              {
                icon: Users,
                label: "الضيوف",
                value:
                  property.maxGuests.adults +
                  property.maxGuests.children,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-[10px] p-4 flex flex-col items-center justify-center gap-1 shadow-sm transition-transform hover:scale-[1.02]"
              >
                <item.icon
                  size={20}
                  className="text-[#2952AB] mb-1"
                  strokeWidth={1.2}
                />
                <span className="text-sm font-bold text-[#2952AB]">
                  {item.value}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Sustainable Travel Badge */}
          <div className="mx-[0px] mt-[0px] mb-[16px] bg-white border border-[#C2D1E8]/30 rounded-[10px] p-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#E7FDE9] flex items-center justify-center text-[#008009] shrink-0">
              <Leaf size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 text-right">
              <h3 className="text-sm font-bold text-[#008009]">برنامج السفر المستدام</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">اتخذ مكان الإقامة هذا خطوات مهمة لجعله أكثر استدامة.</p>
            </div>
          </div>

          {/* Booking Benefits (Booking.com Style) */}
          <div className="mx-[0px] mt-[0px] mb-[16px] bg-[#F1FEF2] border border-[#97E59C]/40 rounded-[10px] p-4 text-right shadow-sm">
            <h3 className="text-xs font-bold text-[#008009] mb-3 flex items-center justify-end gap-1.5">
              <span>خيارات الحجز</span>
              <Check size={14} strokeWidth={2.5} />
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 justify-end text-[#008009]">
                <span className="text-sm font-bold">
                  إلغاء مجاني
                </span>
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
              </li>
              <li className="flex items-start gap-2 justify-end text-[#006607]">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold">
                    شامل وجبتين (Half Board)
                  </span>
                  <span className="text-[10px] text-gray-500">
                    فطور وعشاء مشمولان في السعر
                  </span>
                </div>
                <Coffee
                  size={14}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
              </li>
              <li className="flex items-start gap-2 justify-end text-[#006607]">
                <span className="text-xs font-bold">
                  لا يلزم الدفع المسبق - ادفع في مكان الإقامة
                </span>
                <CreditCard
                  size={14}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
              </li>
            </ul>
          </div>

          {/* Description */}
          <div className="mx-[0px] mt-[0px] mb-[16px] text-right">
            <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em] mb-2">
              الأجواء
            </h3>
            <p className="text-sm text-gray-500 leading-[1.8] font-medium">
              {property.description}
            </p>
          </div>

          {/* Media Tour: Glass Look */}
          {(property.has360View || property.hasVideo) && (
            <div className="mx-[0px] mt-[0px] mb-[16px] text-right">
              <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em] mb-2">
                التجربة
              </h3>
              <div className="flex gap-3">
                {property.has360View && (
                  <button
                    onClick={() => setShow360Tour(true)}
                    className="flex-1 bg-white/80 backdrop-blur-sm border border-[#2952AB]/10 text-[#2952AB] py-4 rounded-[10px] flex items-center justify-center gap-2 shadow-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Rotate3d
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#C69815]"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      عرض 360°
                    </span>
                  </button>
                )}
                {property.hasVideo && (
                  <button
                    onClick={() => setShowVideoTour(true)}
                    className="flex-1 bg-white/80 backdrop-blur-sm border border-[#2952AB]/10 text-[#2952AB] py-4 rounded-[10px] flex items-center justify-center gap-2 shadow-sm hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Video
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#C69815]"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      تشغيل الجولة
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Top Facilities */}
          <div className="space-y-4 text-right mx-[0px] mt-[0px] mb-[24px]">
            <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em]">
              أكثر المرافق رواجاً
            </h3>
            <div className="flex flex-wrap gap-2 justify-end">
              {property.amenities.map(
                (amenity: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white border border-[#C2D1E8]/40 px-3 py-2 rounded-[8px] shadow-sm hover:border-[#2952AB]/30 transition-colors cursor-default"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-xs font-bold text-gray-700">
                      {t(amenity)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Room Details: Refined Cards */}
          <div className="space-y-4 text-right">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100/50 px-2.5 py-1 rounded-full uppercase">
                إجمالي {property.rooms.beds} أسرّة
              </span>
              <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em]">
                غرف النوم
              </h3>
            </div>

            <div className="mx-[0px] mt-[0px] mb-[16px]">
              {property.roomDetails.map((room: RoomDetail) => {
                const isExpanded = expandedRooms[room.id];
                const totalBeds = room.beds.reduce(
                  (sum: number, b) => sum + b.count,
                  0,
                );
                return (
                  <div
                    key={room.id}
                    className={`bg-white rounded-[10px] border transition-all duration-500 overflow-hidden ${isExpanded ? "border-[#2952AB]/20 shadow-xl" : "border-[#C2D1E8]/20 shadow-sm"} mx-[0px] my-[8px]`}
                  >
                    <button
                      onClick={() => toggleRoom(room.id)}
                      className="w-full flex items-center justify-between p-5 text-right active:scale-[0.98] transition-transform m-[0px]"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-[#2952AB] text-white rotate-180" : "bg-gray-50 text-gray-400"}`}
                      >
                        <ChevronDown
                          size={18}
                          strokeWidth={2}
                        />
                      </div>
                      <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                        <div className="min-w-0 text-right">
                          <div className="font-bold text-[#2952AB] text-sm">
                            {t(room.name)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium justify-end">
                            <span>{totalBeds} سرير</span>
                            <span className="text-gray-200">
                              |
                            </span>
                            <span className="uppercase tracking-widest">
                              {t(room.type)}
                            </span>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-[10px] bg-[#E4ECF7] flex items-center justify-center flex-shrink-0 text-[#2952AB]">
                          <Bed size={22} strokeWidth={1.2} />
                        </div>
                      </div>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isExpanded ? "800px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="px-5 pb-6 space-y-6">
                        {room.images &&
                          room.images.length > 0 && (
                            <div className="rounded-[10px] overflow-hidden h-40">
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover shadow-inner"
                              />
                            </div>
                          )}

                        <div className="space-y-3 text-right">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            التكوين
                          </div>
                          <div className="space-y-2">
                            {room.beds.map(
                              (bed, bedIdx: number) => (
                                <div
                                  key={bedIdx}
                                  className="flex items-center justify-between bg-gray-50/50 rounded-[10px] px-4 py-3"
                                >
                                  <span className="text-xs font-bold text-[#2952AB] bg-white px-2.5 py-1 rounded-[10px] border border-gray-100">
                                    ×{bed.count}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-700">
                                      {t(bed.type)}
                                    </span>
                                    <div className="text-[#2952AB]/40">
                                      <Bed
                                        size={16}
                                        strokeWidth={1.5}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {room.features.length > 0 && (
                          <div className="space-y-3 text-right">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              المميزات
                            </div>
                            <div className="flex flex-wrap gap-2 justify-end">
                              {room.features.map(
                                (
                                  feature: string,
                                  fIdx: number,
                                ) => (
                                  <span
                                    key={fIdx}
                                    className="inline-flex items-center gap-2 text-[10px] font-bold bg-[#FEF8E7] text-[#2952AB] px-3.5 py-2 rounded-[10px] uppercase tracking-wider border border-[#C2D1E8]/20"
                                  >
                                    {t(feature)}
                                    {getFeatureIcon(feature)}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bathroom Details */}
          <div className="space-y-4 text-right">
            <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em]">
              تفاصيل الحمامات
            </h3>
            <div className="m-[0px]">
              {property.bathroomDetails.map(
                (bathroom: BathroomDetail) => {
                  const isExpanded =
                    expandedBathrooms[bathroom.id];
                  return (
                    <div
                      key={bathroom.id}
                      className={`bg-white rounded-[10px] border transition-all duration-500 overflow-hidden ${isExpanded ? "border-[#2952AB]/20 shadow-xl" : "border-[#C2D1E8]/20 shadow-sm"} mx-[0px] my-[8px]`}
                    >
                      <button
                        onClick={() =>
                          toggleBathroom(bathroom.id)
                        }
                        className="w-full flex items-center justify-between p-5 text-right active:scale-[0.98] transition-transform m-[0px]"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-[#2952AB] text-white rotate-180" : "bg-gray-50 text-gray-400"}`}
                        >
                          <ChevronDown
                            size={18}
                            strokeWidth={2}
                          />
                        </div>
                        <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-[10px] ${
                              bathroom.access === "private"
                                ? "bg-green-50 text-green-700"
                                : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {bathroom.access === "private"
                              ? "خاص"
                              : "مشترك"}
                          </span>
                          <div className="min-w-0 text-right">
                            <div className="font-bold text-[#2952AB] text-sm">
                              {t(bathroom.name)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium justify-end">
                              <span className="uppercase tracking-widest">
                                {t(bathroom.type)}
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-[10px] bg-blue-50/50 flex items-center justify-center flex-shrink-0 text-blue-900/40">
                            <Bath size={22} strokeWidth={1.2} />
                          </div>
                        </div>
                      </button>

                      <div
                        className="overflow-hidden transition-all duration-500"
                        style={{
                          maxHeight: isExpanded
                            ? "600px"
                            : "0px",
                          opacity: isExpanded ? 1 : 0,
                        }}
                      >
                        <div className="px-5 pb-6 space-y-6">
                          {bathroom.images &&
                            bathroom.images.length > 0 && (
                              <div className="rounded-[10px] overflow-hidden h-40">
                                <img
                                  src={bathroom.images[0]}
                                  alt={bathroom.name}
                                  className="w-full h-full object-cover shadow-inner"
                                />
                              </div>
                            )}

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50/80 rounded-[10px] p-4 space-y-1 text-right">
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                الخصوصية
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <span className="text-sm font-bold text-gray-700">
                                  {bathroom.access === "private"
                                    ? "خاص"
                                    : "مشترك"}
                                </span>
                                {bathroom.access ===
                                "private" ? (
                                  <Lock
                                    size={14}
                                    className="text-green-600"
                                  />
                                ) : (
                                  <Share2
                                    size={14}
                                    className="text-orange-500"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="bg-gray-50/80 rounded-[10px] p-4 space-y-1 text-right">
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                النوع
                              </div>
                              <div className="text-sm font-bold text-gray-700">
                                {t(bathroom.type)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-[#FEF8E7] rounded-[10px] p-4 border border-[#C2D1E8]/10 justify-end">
                            <div className="space-y-0.5 text-right flex-1">
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                نقطة الوصول
                              </div>
                              <div className="text-sm font-bold text-[#2952AB]">
                                {t(bathroom.location)}
                              </div>
                            </div>
                            <MapPin
                              size={18}
                              className="text-[#C69815]"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* House Rules */}
          <div className="space-y-4 text-right mx-[0px] mt-[32px] mb-[16px]">
            <h3 className="text-xs font-bold text-[#2952AB] uppercase tracking-[0.2em]">
              شروط مكان الإقامة
            </h3>
            <div className="bg-white rounded-[10px] border border-[#C2D1E8]/30 shadow-sm p-4 space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Clock size={18} className="text-[#2952AB] shrink-0 mt-0.5" />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-gray-800">تسجيل الوصول</h4>
                  <p className="text-xs text-gray-500 mt-1">اعتباراً من الساعة 2:00 مساءً حتى 11:30 مساءً</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Clock size={18} className="text-[#2952AB] shrink-0 mt-0.5" />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-gray-800">تسجيل المغادرة</h4>
                  <p className="text-xs text-gray-500 mt-1">حتى الساعة 12:00 مساءً</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Baby size={18} className="text-[#2952AB] shrink-0 mt-0.5" />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-gray-800">سياسات الأطفال</h4>
                  <p className="text-xs text-gray-500 mt-1">يرحب بالأطفال من جميع الأعمار.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <Ban size={18} className="text-[#2952AB] shrink-0 mt-0.5" />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-gray-800">الحيوانات الأليفة</h4>
                  <p className="text-xs text-gray-500 mt-1">الحيوانات الأليفة غير مسموح بها.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-[#2952AB] shrink-0 mt-0.5" />
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-gray-800">طرق الدفع المقبولة</h4>
                  <div className="flex gap-2 mt-2 justify-start">
                    <span className="text-[10px] font-bold bg-[#F2F5FB] text-[#2952AB] px-2 py-1 rounded">Visa</span>
                    <span className="text-[10px] font-bold bg-[#F2F5FB] text-[#2952AB] px-2 py-1 rounded">Mastercard</span>
                    <span className="text-[10px] font-bold bg-[#F2F5FB] text-[#2952AB] px-2 py-1 rounded">Cash</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar: Premium Glassmorphism */}
      <div className="fixed bottom-0 left-0 right-0 z-50 m-[0px] px-[24px] pt-[0px] pb-[24px]">
        <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl border border-white rounded-[10px] p-4 shadow-2xl flex items-center justify-between gap-6 ring-1 ring-black/5 mx-[0px] my-[80px]">
          <button
            onClick={() =>
              navigate(`/property/${property.id}/book`)
            }
            className="flex-1 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-bold shadow-xl shadow-[#2952AB]/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <ChevronRight
              size={18}
              strokeWidth={2.5}
              className="rotate-180"
            />
            <span className="text-sm uppercase tracking-widest">
              احجز الآن
            </span>
          </button>
          <div className="space-y-1 mr-2 text-right flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400">
              لـ 1 ليلة،{" "}
              {property.maxGuests.adults +
                property.maxGuests.children}{" "}
              ضيوف
            </span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl font-black text-[#2952AB]">
                {property.price}$
              </span>
            </div>
            <div className="text-[10px] text-gray-500 font-medium">
              + الضرائب والرسوم (14% VAT)
            </div>
          </div>
        </div>
      </div>

      <BottomNav />

      {/* 360° View Modal */}
      {show360Tour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2952AB]/60 backdrop-blur-md"
            onClick={() => setShow360Tour(false)}
          />
          <div className="relative bg-white w-full max-w-md aspect-[4/5] rounded-[10px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShow360Tour(false)}
              className="absolute top-6 left-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all shadow-lg"
            >
              <X size={20} strokeWidth={2} />
            </button>
            <div className="absolute inset-0 group">
              <img
                src={property.images[0]}
                alt="360 View"
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse ring-4 ring-white/10">
                  <Rotate3d
                    size={32}
                    strokeWidth={1}
                    className="animate-spin"
                  />
                </div>
                <div className="text-center px-8">
                  <h4 className="text-xl font-bold mb-2 uppercase tracking-widest">
                    جولة 360° تفاعلية
                  </h4>
                  <p className="text-xs text-white/70 font-medium">
                    تنقل حول العقار أو حرك هاتفك لاستكشافه من كل
                    زاوية.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[10px] text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                تجربة غامرة
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Tour Modal */}
      {showVideoTour && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#2952AB]/60 backdrop-blur-md"
            onClick={() => setShowVideoTour(false)}
          />
          <div className="relative bg-black w-full max-w-md aspect-video rounded-[10px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowVideoTour(false)}
              className="absolute top-4 left-4 z-10 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all font-bold"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={property.images[1] || property.images[0]}
                alt="Video Thumbnail"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <button className="w-20 h-20 bg-[#C69815] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#C69815]/40 hover:scale-110 active:scale-95 transition-all outline outline-white/20">
                <Play size={40} className="fill-white mr-2" />
              </button>
            </div>
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                <span>0:00 / 2:45</span>
                <span className="text-[#C69815]">
                  جولة مميزة
                </span>
              </div>
              <div className="h-1 bg-white/20 rounded-[10px] overflow-hidden">
                <div className="h-full bg-[#C69815] w-0 rounded-[10px]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}