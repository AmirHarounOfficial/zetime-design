import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Video,
  Rotate3d,
  Heart,
  Map as MapIcon,
  List as ListIcon,
  ArrowUpDown,
  Home,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { BottomNav } from "../bottom-nav";
import { properties } from "../../data/mock-data";

export function PropertyListing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [isLocationExpanded, setIsLocationExpanded] =
    useState(false);

  const [viewMode, setViewMode] = useState<"list" | "map">(
    "list",
  );
  const [sortBy, setSortBy] = useState("recommended");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(
    null,
  );

  // Filter states
  const [bedrooms, setBedrooms] = useState<number[]>([]);
  const [bathrooms, setBathrooms] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<
    [number, number]
  >([0, 500]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    [],
  );
  const [amenities, setAmenities] = useState<string[]>([]);
  const [has360View, setHas360View] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const allAmenities = [
    "واي فاي",
    "مطبخ",
    "غسالة",
    "مجفف",
    "تكييف",
    "تدفئة",
    "تلفزيون",
    "موقف سيارات",
    "نادي رياضي",
    "مسبح",
    "فناء خلفي",
    "شواء",
    "مدفأة",
  ];
  const allPropertyTypes = [
    "لوفت",
    "استوديو",
    "منزل",
    "شقة",
    "كوندو",
    "فيلا",
  ];

  const uniqueCountries = Array.from(
    new Set(properties.map((p) => p.country)),
  ).filter(Boolean);
  const uniqueCities = Array.from(
    new Set(
      properties
        .filter(
          (p) =>
            !selectedCountry || p.country === selectedCountry,
        )
        .map((p) => p.city),
    ),
  ).filter(Boolean);
  const uniqueAreas = Array.from(
    new Set(
      properties
        .filter(
          (p) =>
            (!selectedCountry ||
              p.country === selectedCountry) &&
            (!selectedCity || p.city === selectedCity),
        )
        .map((p) => p.area),
    ),
  ).filter(Boolean);

  // Filter properties
  let filteredProperties = properties.filter((property) => {
    if (
      searchQuery &&
      !property.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !property.address
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedCountry && property.country !== selectedCountry)
      return false;
    if (selectedCity && property.city !== selectedCity)
      return false;
    if (selectedArea && property.area !== selectedArea)
      return false;
    if (
      bedrooms.length > 0 &&
      !bedrooms.includes(property.rooms.bedrooms)
    )
      return false;
    if (
      bathrooms.length > 0 &&
      !bathrooms.includes(property.rooms.bathrooms)
    )
      return false;
    if (
      property.price < priceRange[0] ||
      property.price > priceRange[1]
    )
      return false;
    if (
      propertyTypes.length > 0 &&
      !propertyTypes.includes(property.propertyType)
    )
      return false;
    if (
      amenities.length > 0 &&
      !amenities.every((a) => property.amenities.includes(a))
    )
      return false;
    if (has360View && !property.has360View) return false;
    if (hasVideo && !property.hasVideo) return false;
    if (adults > property.maxGuests.adults) return false;
    if (children > property.maxGuests.children) return false;
    return true;
  });

  filteredProperties.sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // recommended
  });

  const toggleFilter = (
    value: any,
    array: any[],
    setter: (arr: any[]) => void,
  ) => {
    if (array.includes(value)) {
      setter(array.filter((v) => v !== value));
    } else {
      setter([...array, value]);
    }
  };

  const clearFilters = () => {
    setBedrooms([]);
    setBathrooms([]);
    setPriceRange([0, 500]);
    setPropertyTypes([]);
    setAmenities([]);
    setHas360View(false);
    setHasVideo(false);
    setAdults(1);
    setChildren(0);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to the link
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fav) => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  // Mock distance and area based on ID for consistency
  const getPropertyStats = (id: string | number) => {
    const strId = String(id);
    const numId = strId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const distance = ((numId % 50) / 10 + 0.5).toFixed(1);
    const area = 60 + (numId % 100);
    const top = 20 + (numId % 60);
    const left = 20 + ((numId * 3) % 60);
    return { distance, area, top, left };
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => navigate(-1)}
                className="p-1"
              >
                <ChevronLeft
                  size={24}
                  className="text-[#2952AB] rotate-180"
                  strokeWidth={1.5}
                />
              </button>
              <h1 className="font-medium text-[#2952AB]">
                تأجير العقارات
              </h1>
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-[10px] shadow-sm border border-[#C2D1E8]/20 flex items-center justify-center"
            >
              <SlidersHorizontal
                size={18}
                className="text-[#2952AB]"
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A9ACB]"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="البحث عن عقارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] pr-11 pl-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 shadow-sm text-sm text-[#2952AB] placeholder:text-[#2952AB]/60 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20"
            />
          </div>
        </div>
      </div>

      {/* Location Filter Toggle */}
      <div className="max-w-md mx-auto px-4 mt-4">
        <button
          onClick={() =>
            setIsLocationExpanded(!isLocationExpanded)
          }
          className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-4 py-3 flex items-center justify-between text-sm text-[#2952AB] shadow-sm hover:bg-[#F2F5FB] transition-colors"
        >
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            <span className="font-medium">
              تحديد الموقع الجغرافي
            </span>
          </div>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${isLocationExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Location Dependent Selects */}
      {isLocationExpanded && (
        <div className="max-w-md mx-auto px-4 mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedCity("");
              setSelectedArea("");
            }}
            className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-4 py-3 text-sm text-[#2952AB] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 h-auto"
          >
            <option value="">اختر الدولة</option>
            {uniqueCountries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedArea("");
            }}
            disabled={!selectedCountry}
            className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-4 py-3 text-sm text-[#2952AB] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">اختر المدينة</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            disabled={!selectedCity}
            className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] px-4 py-3 text-sm text-[#2952AB] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">اختر المنطقة</option>
            {uniqueAreas.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Controls: Sort & View Toggle */}
      <div className="max-w-md mx-auto px-4 mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white rounded-[10px] p-1 border border-[#C2D1E8]/30 shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-[8px] flex items-center gap-1 transition-all ${
              viewMode === "list"
                ? "bg-[#2952AB] text-white"
                : "text-[#7A9ACB] hover:bg-gray-50"
            }`}
          >
            <ListIcon size={16} />
            <span className="text-xs font-medium">قائمة</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`p-2 rounded-[8px] flex items-center gap-1 transition-all ${
              viewMode === "map"
                ? "bg-[#2952AB] text-white"
                : "text-[#7A9ACB] hover:bg-gray-50"
            }`}
          >
            <MapIcon size={16} />
            <span className="text-xs font-medium">خريطة</span>
          </button>
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-[#C2D1E8]/30 rounded-[10px] pl-8 pr-4 py-2 text-sm text-[#2952AB] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20"
          >
            <option value="recommended">الموصى بها</option>
            <option value="price-asc">
              السعر: الأقل للأعلى
            </option>
            <option value="price-desc">
              السعر: الأعلى للأقل
            </option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
          <ArrowUpDown
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A9ACB] pointer-events-none"
          />
        </div>
      </div>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="max-w-md mx-auto px-4 mt-4 h-[55vh] rounded-[15px] overflow-hidden shadow-md border border-[#C2D1E8]/30 relative z-0 bg-[#E4ECF7]">
          {/* Static Map Background */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-multiply grayscale cursor-default"
            onClick={() => setActivePropertyId(null)}
          ></div>

          {filteredProperties.map((property) => {
            const stats = getPropertyStats(property.id);
            const isActive = activePropertyId === property.id;
            return (
              <div
                key={property.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? "z-30" : "z-10"}`}
                style={{
                  top: `${stats.top}%`,
                  left: `${stats.left}%`,
                }}
              >
                {/* Marker */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePropertyId(isActive ? null : property.id);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-2 transition-all cursor-pointer hover:scale-110 ${
                    isActive
                      ? "bg-[#2952AB] border-white scale-125"
                      : "bg-white border-[#2952AB]"
                  }`}
                >
                  <Home
                    size={14}
                    className={isActive ? "text-white" : "text-[#2952AB]"}
                  />
                </div>

                {/* Popup (Controlled by activePropertyId) */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-white rounded-[12px] shadow-2xl p-2.5 transition-all duration-300 origin-bottom pointer-events-auto ${
                    isActive
                      ? "opacity-100 visible translate-y-0 scale-100"
                      : "opacity-0 invisible translate-y-4 scale-90"
                  }`}
                >
                  <div className="relative group">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-28 object-cover rounded-[8px] mb-2.5"
                    />
                    <div className="absolute top-2 right-2 bg-[#C69815] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {property.price}$
                    </div>
                  </div>
                  <h4 className="font-bold text-[13px] mb-1.5 text-[#2952AB] text-right line-clamp-1">
                    {property.name}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] mb-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Star
                        size={10}
                        className="text-[#C69815] fill-[#C69815]"
                      />
                      <span className="font-bold text-[#2952AB]">
                        {property.rating}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {property.propertyType}
                    </span>
                  </div>
                  <Link
                    to={`/property/${property.id}`}
                    className="block w-full text-center bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-2 rounded-[8px] text-[11px] font-bold shadow-lg hover:shadow-[#2952AB]/20 transition-all active:scale-95"
                  >
                    عرض التفاصيل
                  </Link>
                  {/* Triangle for popup */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-white"></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#2952AB]/60">
                لم يتم العثور على عقارات
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => {
              const stats = getPropertyStats(property.id);
              return (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="block bg-white rounded-[10px] overflow-hidden shadow-md border border-[#C2D1E8]/30 hover:border-[#2952AB]/30 transition-all"
                >
                  <div className="relative h-56">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    {property.popular && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-3 py-1 rounded-full shadow-lg">
                        شائع
                      </span>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) =>
                        toggleFavorite(e, property.id)
                      }
                      className="absolute top-3 left-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-colors z-10"
                    >
                      <Heart
                        size={16}
                        className={
                          favorites.includes(property.id)
                            ? "fill-[#C69815] text-[#C69815]"
                            : "text-white"
                        }
                      />
                    </button>

                    {/* Media Badges */}
                    <div className="absolute top-14 left-3 flex flex-col gap-2">
                      {property.has360View && (
                        <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Rotate3d
                            size={10}
                            strokeWidth={1.5}
                          />
                          <span>360°</span>
                        </div>
                      )}
                      {property.hasVideo && (
                        <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Video size={10} strokeWidth={1.5} />
                          <span>فيديو</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Content on Image */}
                    <div className="absolute bottom-3 right-3 left-3">
                      <div className="flex justify-between items-end">
                        <div className="text-right">
                          <div className="flex items-center justify-end flex-wrap gap-1 mb-1">
                            <h3 className="font-semibold text-white text-lg drop-shadow-md">
                              {property.name}
                            </h3>
                            <div
                              className="flex items-center gap-0.5"
                              dir="ltr"
                            >
                              {Array.from({
                                length: Math.round(
                                  property.rating,
                                ),
                              }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={10}
                                  className="text-[#C69815] fill-[#C69815]"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
                            <MapPin size={12} />
                            <span className="drop-shadow-sm">
                              {property.address}
                              {property.area &&
                                `، ${property.area}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Property Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-3 border-b border-[#C2D1E8]/30">
                      <div className="flex items-center gap-1.5">
                        <Home
                          size={16}
                          className="text-[#2952AB]"
                        />
                        <span className="font-medium">
                          {stats.area} م²
                        </span>
                      </div>
                      <div className="w-[1px] h-4 bg-[#C2D1E8]/50"></div>
                      <div className="flex items-center gap-1.5">
                        <MapPin
                          size={16}
                          className="text-[#2952AB]"
                        />
                        <span className="font-medium">
                          {stats.distance} كم للمركز
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="w-auto">
                        {property.rooms.bedrooms} سرير
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="w-auto">
                        {property.rooms.bathrooms} حمام
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="w-auto">
                        {property.propertyType}
                      </span>
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-[8px] p-1 border border-white/20 shadow-lg self-start ml-[0px] mr-[33px] my-[0px]">
                        <div className="flex flex-col items-end leading-tight pr-1">
                          <span className="text-xs font-bold text-[#2952AB]">
                            {property.rating >= 4.8
                              ? "استثنائي"
                              : property.rating >= 4.5
                                ? "ممتاز"
                                : "جيد جداً"}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium">
                            {property.reviews} تقييم
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-t-[6px] rounded-br-[6px] rounded-bl-[2px] bg-[#003580] text-white font-bold flex items-center justify-center text-sm shadow-md">
                          {(property.rating * 2).toFixed(1)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-[#2952AB]">
                          {property.price}$
                        </span>
                        <span className="text-xs text-gray-500">
                          / ليلة
                        </span>
                      </div>
                      <div className="bg-[#2952AB] text-white px-4 py-2 rounded-[10px] text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                        احجز الآن
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end z-50 overflow-y-auto">
          <div className="w-full bg-white rounded-t-[10px] shadow-2xl pb-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#C2D1E8]/30 z-10">
              <div className="max-w-md mx-auto flex items-center justify-between p-4">
                <h3 className="font-medium text-[#2952AB]">
                  الفلاتر
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-[#E4ECF7]"
                >
                  <X
                    size={18}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
              {/* Bedrooms */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  غرف النوم
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        toggleFilter(num, bedrooms, setBedrooms)
                      }
                      className={`py-2 rounded-[10px] border text-sm transition-all ${
                        bedrooms.includes(num)
                          ? "bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]"
                          : "bg-white text-gray-700 border-[#C2D1E8]/30"
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  الحمامات
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        toggleFilter(
                          num,
                          bathrooms,
                          setBathrooms,
                        )
                      }
                      className={`py-2 rounded-[10px] border text-sm transition-all ${
                        bathrooms.includes(num)
                          ? "bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]"
                          : "bg-white text-gray-700 border-[#C2D1E8]/30"
                      }`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  نطاق السعر (لكل ليلة)
                </h4>
                <div className="flex items-center gap-4 w-md">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                    className="flex-1 w-md rounded-[10px] border border-[#C2D1E8]/30 text-sm px-[12px] py-[8px]"
                    placeholder="الأدنى"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || 500,
                      ])
                    }
                    className="flex-1 w-md px-3 py-2 rounded-[10px] border border-[#C2D1E8]/30 text-sm"
                    placeholder="الأقصى"
                  />
                </div>
              </div>

              {/* Property Types */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  نوع العقار
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allPropertyTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        toggleFilter(
                          type,
                          propertyTypes,
                          setPropertyTypes,
                        )
                      }
                      className={`px-4 py-2 rounded-[10px] border text-sm transition-all ${
                        propertyTypes.includes(type)
                          ? "bg-gradient-to-r from-[#C69815] to-[#A88012] text-white border-[#C69815]"
                          : "bg-white text-gray-700 border-[#C2D1E8]/30"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  الضيوف
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      بالغون
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setAdults(Math.max(1, adults - 1))
                        }
                        className="w-8 h-8 rounded-full border border-[#C2D1E8]/30 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-full border border-[#C2D1E8]/30 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      أطفال
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setChildren(Math.max(0, children - 1))
                        }
                        className="w-8 h-8 rounded-full border border-[#C2D1E8]/30 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">
                        {children}
                      </span>
                      <button
                        onClick={() =>
                          setChildren(children + 1)
                        }
                        className="w-8 h-8 rounded-full border border-[#C2D1E8]/30 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  المرافق
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() =>
                        toggleFilter(
                          amenity,
                          amenities,
                          setAmenities,
                        )
                      }
                      className={`px-3 py-2 rounded-[10px] border text-xs transition-all ${
                        amenities.includes(amenity)
                          ? "bg-gradient-to-r from-[#C69815] to-[#A88012] text-white border-[#C69815]"
                          : "bg-white text-gray-700 border-[#C2D1E8]/30"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Options */}
              <div>
                <h4 className="text-sm font-medium text-[#2952AB] mb-3">
                  الوسائط
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setHas360View(!has360View)}
                    className={`w-full px-4 py-3 rounded-[10px] border text-sm text-right transition-all flex items-center gap-2 ${
                      has360View
                        ? "bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]"
                        : "bg-white text-gray-700 border-[#C2D1E8]/30"
                    }`}
                  >
                    <Rotate3d size={16} strokeWidth={1.5} />
                    <span>يحتوي على عرض 360°</span>
                  </button>
                  <button
                    onClick={() => setHasVideo(!hasVideo)}
                    className={`w-full px-4 py-3 rounded-[10px] border text-sm text-right transition-all flex items-center gap-2 ${
                      hasVideo
                        ? "bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]"
                        : "bg-white text-gray-700 border-[#C2D1E8]/30"
                    }`}
                  >
                    <Video size={16} strokeWidth={1.5} />
                    <span>يحتوي على جولة فيديو</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 rounded-[10px] border border-[#C2D1E8]/30 text-[#2952AB] font-medium"
                >
                  مسح الكل
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-3 rounded-[10px] font-medium shadow-md"
                >
                  عرض {filteredProperties.length} عقارات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}