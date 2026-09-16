import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Star,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Home,
  Car,
  Plus,
  X,
  Palette,
  Hash,
  Type,
  CalendarDays,
  Camera,
  Image as ImageIcon,
  Mic,
  MicOff,
  Square,
  Trash2,
  ChevronDown,
  Navigation,
  Play,
  Pause,
  Search,
  SlidersHorizontal,
  MessageSquare,
  PhoneCall,
  Award,
  Briefcase,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "../ui/drawer";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../bottom-nav";
import {
  serviceCategories,
  ServiceProvider,
  userCars,
  UserCar,
} from "../../data/mock-data";

const CAR_MODULES = ["car-services", "street-assistant"];

export function ServiceBooking() {
  const { module, categoryId, serviceId } = useParams();
  const navigate = useNavigate();

  const category = serviceCategories.find(
    (c) => c.id === categoryId && c.module === module,
  );
  const service = category?.services.find(
    (s) => s.id === serviceId,
  );

  const requiresCarSelection = CAR_MODULES.includes(
    module || "",
  );

  const [cars, setCars] = useState<UserCar[]>(userCars);
  const [selectedCar, setSelectedCar] =
    useState<UserCar | null>(
      requiresCarSelection ? userCars[0] || null : null,
    );
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProvider | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState(
    "منطقة شارع الشيخ زايد، دبي",
  );
  const [phone, setPhone] = useState("+971 50 123 4567");
  const [notes, setNotes] = useState("");
  const [selectedPickup, setSelectedPickup] = useState(false);
  const [providerSearchQuery, setProviderSearchQuery] =
    useState("");
  const [providerSortBy, setProviderSortBy] = useState<
    "recommended" | "distance" | "rating" | "price"
  >("recommended");
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [viewingProvider, setViewingProvider] = useState<ServiceProvider | null>(null);

  // Photo upload state
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceRecording, setVoiceRecording] = useState<{
    url: string;
    duration: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Address selection state
  const [showAddressPicker, setShowAddressPicker] =
    useState(false);
  const savedAddresses = [
    {
      id: "addr-1",
      label: "المنزل",
      address: "منطقة شارع الشيخ زايد، دبي",
      icon: "home",
    },
    {
      id: "addr-2",
      label: "المكتب",
      address: "مركز دبي المالي العالمي، دبي",
      icon: "building",
    },
    {
      id: "addr-3",
      label: "وسط المدينة",
      address: "منطقة بوليفارد محمد بن راشد، دبي",
      icon: "map",
    },
  ];

  // Photo handlers
  const handlePhotoSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setPhotos((prev) => [
            ...prev,
            ev.target!.result as string,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceRecording({
          url: audioUrl,
          duration: recordingDuration,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      alert(
        "Microphone access is required to record voice notes.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const deleteRecording = () => {
    if (voiceRecording) {
      URL.revokeObjectURL(voiceRecording.url);
      setVoiceRecording(null);
      setRecordingDuration(0);
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (!voiceRecording) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const audio = new Audio(voiceRecording.url);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current)
        clearInterval(recordingIntervalRef.current);
      if (voiceRecording)
        URL.revokeObjectURL(voiceRecording.url);
    };
  }, []);

  // Add New Car drawer state
  const [addCarOpen, setAddCarOpen] = useState(false);
  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
  });
  const [addCarErrors, setAddCarErrors] = useState<
    Record<string, string>
  >({});

  const validateNewCar = () => {
    const errors: Record<string, string> = {};
    if (!newCar.make.trim()) errors.make = "الماركة مطلوبة";
    if (!newCar.model.trim()) errors.model = "الموديل مطلوب";
    if (!newCar.year.trim()) {
      errors.year = "السنة مطلوبة";
    } else {
      const y = parseInt(newCar.year);
      if (isNaN(y) || y < 1900 || y > 2030)
        errors.year = "أدخل سنة صحيحة";
    }
    if (!newCar.color.trim()) errors.color = "اللون مطلوب";
    if (!newCar.plateNumber.trim())
      errors.plateNumber = "رقم اللوحة مطلوب";
    return errors;
  };

  const handleAddCar = () => {
    const errors = validateNewCar();
    setAddCarErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const car: UserCar = {
      id: `car-${Date.now()}`,
      make: newCar.make.trim(),
      model: newCar.model.trim(),
      year: parseInt(newCar.year),
      color: newCar.color.trim(),
      plateNumber: newCar.plateNumber.trim().toUpperCase(),
    };
    setCars((prev) => [...prev, car]);
    setSelectedCar(car);
    setNewCar({
      make: "",
      model: "",
      year: "",
      color: "",
      plateNumber: "",
    });
    setAddCarErrors({});
    setAddCarOpen(false);
  };

  if (!category || !service) {
    return <div>الخدمة غير موجودة</div>;
  }

  const formatPrice = () => {
    if (service.price === 0) return "مجاني";

    // Calculate price range from providers
    const providerPrices = service.providers
      .map((p) => p.price || service.price)
      .filter((p) => p > 0);

    if (providerPrices.length > 0) {
      const minPrice = Math.min(...providerPrices);
      const maxPrice = Math.max(...providerPrices);

      if (minPrice === maxPrice) {
        return `${minPrice} درهم`;
      }
      return `تبدأ من ${minPrice} درهم`;
    }

    return `تبدأ من ${service.price} درهم`;
  };

  const formatProviderPrice = (provider: ServiceProvider) => {
    const price = provider.price || service.price;
    if (price === 0) return "مجاني";
    return `${price} درهم`;
  };

  const getProviderDistanceTime = (id: string) => {
    // Deterministic mock based on ID
    const dist =
      (parseInt(id.replace(/\D/g, "") || "5") % 15) + 1.2;
    const time = Math.round(dist * 4 + 5);
    return {
      dist,
      distance: `${dist.toFixed(1)} كم`,
      time: `${time} دقيقة`,
    };
  };

  const getProviderBookings = (id: string) => {
    // Deterministic mock for completed bookings
    return (parseInt(id.replace(/\D/g, "") || "1") * 43) % 200 + 50;
  };

  const getProviderServices = (providerId: string) => {
    const services: string[] = [];
    serviceCategories.forEach((cat) => {
      cat.services.forEach((s) => {
        if (s.providers.some((p) => p.id === providerId)) {
          if (!services.includes(s.name)) {
            services.push(s.name);
          }
        }
      });
    });
    if (services.length === 0 && service) {
      services.push(service.name);
    }
    return services;
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedProvider) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (requiresCarSelection && !selectedCar) {
      alert("يرجى اختيار سيارة");
      return;
    }
    navigate(
      `/module/${module}/${categoryId}/${serviceId}/confirmation`,
      {
        state: {
          service,
          provider: selectedProvider,
          date: selectedDate,
          time: selectedTime,
          address,
          phone,
          notes,
          wantsPickup: selectedPickup,
          ...(requiresCarSelection && selectedCar
            ? { car: selectedCar }
            : {}),
        },
      },
    );
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString("ar-SA", {
      month: "short",
    });
    const day = date.getDate();
    const weekday = date.toLocaleDateString("ar-SA", {
      weekday: "short",
    });
    return {
      month,
      day,
      weekday,
      full: date.toISOString().split("T")[0],
    };
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24"
      dir="rtl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
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
            <div>
              <h1 className="font-medium text-[#2952AB]">
                حجز الخدمة
              </h1>
              <p className="text-xs text-[#2952AB]/60">
                {service.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mx-[0px] mt-[24px] mb-[80px]">
        {currentStep === 1 ? (
          <div className="space-y-6">
            {/* Service Info */}
            <div className="bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30">
              <h2 className="font-medium text-[#2952AB] mb-2">
                {service.name}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                {service.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#C2D1E8]/30">
                <div className="flex items-center gap-1">
                  <Star
                    size={14}
                    className="text-[#C69815] fill-[#C69815]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {service.rating}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({service.reviews})
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {service.duration}
                </div>
                <div className="font-medium text-[#2952AB]">
                  {formatPrice()}
                </div>
              </div>
            </div>

            {/* Select Car — only for car-services and street-assistant */}
            {requiresCarSelection && (
              <div>
                <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
                  <Car size={16} strokeWidth={1.5} />
                  اختر سيارتك
                </h3>
                <div className="space-y-2">
                  {cars.map((car) => (
                    <button
                      key={car.id}
                      onClick={() => setSelectedCar(car)}
                      className={`w-full bg-white rounded-[10px] p-4 shadow-sm border transition-all ${
                        selectedCar?.id === car.id
                          ? "border-[#2952AB] ring-1 ring-[#2952AB]/20"
                          : "border-[#C2D1E8]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center overflow-hidden">
                            {car.imageUrl ? (
                              <img
                                src={car.imageUrl}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Car
                                size={20}
                                className="text-[#2952AB]"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {car.year} {car.make}{" "}
                                {car.model}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-xs text-gray-600">
                                {car.color}
                              </span>
                              <span className="text-xs text-gray-500">
                                •
                              </span>
                              <span className="text-xs text-gray-500">
                                {car.plateNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {selectedCar?.id === car.id && (
                            <CheckCircle2
                              size={20}
                              className="text-[#2952AB]"
                              strokeWidth={2}
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Add New Car button */}
                  <button
                    onClick={() => setAddCarOpen(true)}
                    className="w-full bg-gradient-to-r from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] p-4 border border-dashed border-[#C2D1E8]/60 transition-all hover:border-[#2952AB]/40"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#C2D1E8]/30">
                        <Plus
                          size={16}
                          className="text-[#2952AB]"
                          strokeWidth={2}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#2952AB]/70">
                        إضافة سيارة جديدة
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Select Provider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#2952AB]">
                  {selectedProvider
                    ? "المزود المختار"
                    : "اختر المزود"}
                </h3>
                {selectedProvider && (
                  <button
                    onClick={() => {
                      setSelectedProvider(null);
                      setSelectedDate("");
                      setSelectedTime("");
                    }}
                    className="text-xs text-[#7A9ACB] font-medium hover:underline"
                  >
                    تغيير المزود
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {/* Search & Sort UI */}
                {!selectedProvider && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="ابحث عن مزود..."
                        value={providerSearchQuery}
                        onChange={(e) =>
                          setProviderSearchQuery(e.target.value)
                        }
                        className="w-full bg-white pl-3 pr-10 py-2.5 rounded-[10px] border border-[#C2D1E8]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#2952AB]/30"
                      />
                    </div>
                    <div className="relative shrink-0">
                      <select
                        value={providerSortBy}
                        onChange={(e) =>
                          setProviderSortBy(
                            e.target.value as any,
                          )
                        }
                        className="appearance-none bg-white px-4 py-2.5 pl-10 rounded-[10px] border border-[#C2D1E8]/50 text-sm font-medium text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#2952AB]/30 cursor-pointer"
                      >
                        <option value="recommended">
                          موصى به
                        </option>
                        <option value="distance">الأقرب</option>
                        <option value="rating">
                          الأعلى تقييماً
                        </option>
                        <option value="price">
                          الأقل سعراً
                        </option>
                      </select>
                      <SlidersHorizontal
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2952AB] pointer-events-none"
                        size={16}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {service.providers
                    .filter((p) => {
                      if (selectedProvider)
                        return p.id === selectedProvider.id;
                      if (!providerSearchQuery) return true;
                      return p.name
                        .toLowerCase()
                        .includes(
                          providerSearchQuery.toLowerCase(),
                        );
                    })
                    .sort((a, b) => {
                      if (selectedProvider) return 0;
                      if (providerSortBy === "distance") {
                        return (
                          getProviderDistanceTime(a.id).dist -
                          getProviderDistanceTime(b.id).dist
                        );
                      }
                      if (providerSortBy === "rating") {
                        return b.rating - a.rating;
                      }
                      if (providerSortBy === "price") {
                        const priceA = a.price || service.price;
                        const priceB = b.price || service.price;
                        return priceA - priceB;
                      }
                      return 0; // recommended
                    })
                    .map((provider) => {
                      const isSelected =
                        selectedProvider?.id === provider.id;
                      const { distance, time } =
                        getProviderDistanceTime(provider.id);

                      return (
                        <div
                          key={provider.id}
                          className={`w-full bg-white rounded-[10px] shadow-sm border transition-all ${
                            isSelected
                              ? "border-[#2952AB] ring-1 ring-[#2952AB]/10"
                              : "border-[#C2D1E8]/30"
                          }`}
                        >
                          <button
                            onClick={() => {
                              if (!isSelected) {
                                setSelectedProvider(provider);
                                setSelectedPickup(false); // Reset when changing provider
                              }
                            }}
                            disabled={isSelected}
                            className={`w-full p-4 text-right flex items-center justify-between ${isSelected ? "cursor-default" : "hover:bg-gray-50/50"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center">
                                <User
                                  size={20}
                                  className="text-[#2952AB]"
                                  strokeWidth={1.5}
                                />
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span 
                                    className="font-medium text-gray-900 hover:text-[#2952AB] transition-colors cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingProvider(provider);
                                      setProfileDrawerOpen(true);
                                    }}
                                  >
                                    {provider.name}
                                  </span>
                                  {provider.verified && (
                                    <CheckCircle2
                                      size={14}
                                      className="text-blue-500"
                                      strokeWidth={2}
                                    />
                                  )}
                                </div>
                                <div className="flex items-center gap-x-2 gap-y-1 mt-0.5 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <Star
                                      size={12}
                                      className="text-[#C69815] fill-[#C69815]"
                                      strokeWidth={1.5}
                                    />
                                    <span className="text-xs text-gray-600">
                                      {provider.rating}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({provider.reviews})
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-300">
                                    •
                                  </span>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Navigation
                                      size={10}
                                      className="text-[#7A9ACB]"
                                    />
                                    <span>{distance}</span>
                                    <span>•</span>
                                    <span>{time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="font-semibold text-[#2952AB]">
                                {formatProviderPrice(provider)}
                              </div>
                              {isSelected && (
                                <CheckCircle2
                                  size={20}
                                  className="text-[#2952AB]"
                                  strokeWidth={2}
                                />
                              )}
                            </div>
                          </button>

                          {/* Embedded Date & Time selection when selected */}
                          {isSelected && (
                            <div className="px-4 pb-4 pt-2 border-t border-[#C2D1E8]/20 animate-in fade-in slide-in-from-top-1 duration-300">
                              <div className="space-y-4">
                                {/* Select Date */}
                                <div>
                                  <h3 className="text-[11px] font-semibold text-[#2952AB]/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Calendar
                                      size={12}
                                      strokeWidth={2}
                                    />
                                    اختر التاريخ
                                  </h3>
                                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                                    {dates.map((date) => {
                                      const formatted =
                                        formatDate(date);
                                      const isDateSelected =
                                        selectedDate ===
                                        formatted.full;
                                      return (
                                        <button
                                          key={formatted.full}
                                          onClick={() =>
                                            setSelectedDate(
                                              formatted.full,
                                            )
                                          }
                                          className={`flex-shrink-0 w-14 py-2.5 rounded-[10px] border text-right transition-all ${
                                            isDateSelected
                                              ? "bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] text-white border-[#2952AB]"
                                              : "bg-[#F2F5FB]/50 text-gray-700 border-[#C2D1E8]/30"
                                          }`}
                                        >
                                          <div className="text-[9px] opacity-80 uppercase text-center">
                                            {formatted.weekday}
                                          </div>
                                          <div className="text-base font-medium my-0.5 text-center">
                                            {formatted.day}
                                          </div>
                                          <div className="text-[9px] opacity-80 uppercase text-center">
                                            {formatted.month}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Select Time */}
                                <div>
                                  <h3 className="text-[11px] font-semibold text-[#2952AB]/40 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock
                                      size={12}
                                      strokeWidth={2}
                                    />
                                    اختر الوقت
                                  </h3>
                                  <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                      <button
                                        key={time}
                                        onClick={() =>
                                          setSelectedTime(time)
                                        }
                                        className={`py-2 rounded-[10px] border text-xs transition-all ${
                                          selectedTime === time
                                            ? "bg-gradient-to-br from-[#C69815] to-[#A88012] text-white border-[#C69815]"
                                            : "bg-white text-gray-700 border-[#C2D1E8]/30"
                                        }`}
                                      >
                                        {time}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Pick-up & Drop-off Service */}
                                {module === "car-services" &&
                                  provider.pickupFee && (
                                    <div className="mt-4 pt-4 border-t border-[#C2D1E8]/20">
                                      <h3 className="text-[11px] font-semibold text-[#2952AB]/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Car
                                          size={12}
                                          strokeWidth={2}
                                        />
                                        خدمة مميزة
                                      </h3>
                                      <button
                                        onClick={() =>
                                          setSelectedPickup(
                                            !selectedPickup,
                                          )
                                        }
                                        className={`w-full flex items-center justify-between p-3 rounded-[10px] border transition-all ${
                                          selectedPickup
                                            ? "bg-[#2952AB]/5 border-[#2952AB]/30"
                                            : "bg-white border-[#C2D1E8]/30"
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                              selectedPickup
                                                ? "bg-[#2952AB] border-[#2952AB]"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            {selectedPickup && (
                                              <CheckCircle2
                                                size={14}
                                                className="text-white"
                                                strokeWidth={3}
                                              />
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <span className="text-sm font-medium text-[#2952AB]">
                                              الاستلام والتوصيل
                                            </span>
                                            <p className="text-[10px] text-gray-500">
                                              سيقوم المركز
                                              باستلام وإعادة
                                              سيارتك
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-sm font-semibold text-[#C69815]">
                                          +{provider.pickupFee}{" "}
                                          درهم
                                        </div>
                                      </button>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Attach Photos */}
            <div>
              <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
                <Camera size={16} strokeWidth={1.5} />
                إرفاق صور (اختياري)
              </h3>
              <p className="text-xs text-[#2952AB]/50 mb-3">
                أضف صورًا للمشكلة لمساعدة المزود على فهمها بشكل
                أفضل
              </p>

              {/* Photo thumbnails */}
              {photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide mb-3">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-20 h-20 rounded-[10px] overflow-hidden border-2 border-[#C2D1E8]/30 shadow-sm group"
                    >
                      <img
                        src={photo}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X
                          size={10}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[8px] text-center py-0.5">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload buttons */}
              <div className="flex gap-2">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  className="flex-1 bg-white rounded-[10px] p-3.5 border border-[#C2D1E8]/30 shadow-sm flex items-center justify-center gap-2 hover:border-[#2952AB]/30 transition-all active:scale-[0.98]"
                >
                  <Camera
                    size={18}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-[#2952AB]/80 font-medium">
                    الكاميرا
                  </span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-white rounded-[10px] p-3.5 border border-[#C2D1E8]/30 shadow-sm flex items-center justify-center gap-2 hover:border-[#2952AB]/30 transition-all active:scale-[0.98]"
                >
                  <ImageIcon
                    size={18}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                  <span className="text-sm text-[#2952AB]/80 font-medium">
                    المعرض
                  </span>
                </button>
              </div>

              {photos.length > 0 && (
                <p className="text-[10px] text-[#2952AB]/40 mt-2 text-center">
                  تم إرفاق {photos.length} صور
                </p>
              )}
            </div>

            {/* Voice Note */}
            <div>
              <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
                <Mic size={16} strokeWidth={1.5} />
                ملاحظة صوتية (اختياري)
              </h3>
              <p className="text-xs text-[#2952AB]/50 mb-3">
                سجل رسالة صوتية لوصف المشكلة
              </p>

              {!voiceRecording ? (
                <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm">
                  {isRecording ? (
                    <div className="flex items-center gap-4">
                      {/* Recording animation */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-red-500 rounded-full animate-pulse"
                            style={{
                              height: `${12 + Math.random() * 16}px`,
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "0.6s",
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-sm font-medium text-red-600">
                            جاري التسجيل...
                          </span>
                        </div>
                        <span className="text-xs text-[#2952AB]/50 mt-0.5 block">
                          {formatDuration(recordingDuration)}
                        </span>
                      </div>
                      <button
                        onClick={stopRecording}
                        className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors active:scale-95"
                      >
                        <Square
                          size={14}
                          className="text-white"
                          fill="white"
                          strokeWidth={0}
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="w-full flex items-center justify-center gap-3 py-2"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-full flex items-center justify-center shadow-md">
                        <Mic
                          size={18}
                          className="text-white"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-sm text-[#2952AB]/70 font-medium">
                        اضغط لبدء التسجيل
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* Play button */}
                    <button
                      onClick={togglePlayback}
                      className="w-10 h-10 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-full flex items-center justify-center shadow-md flex-shrink-0 active:scale-95 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause
                          size={16}
                          className="text-white"
                          strokeWidth={2}
                        />
                      ) : (
                        <Play
                          size={16}
                          className="text-white ml-0.5"
                          strokeWidth={2}
                        />
                      )}
                    </button>

                    {/* Waveform visualization */}
                    <div className="flex-1 flex items-center gap-0.5 h-8">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full bg-gradient-to-t from-[#2952AB]/20 to-[#C69815]/30"
                          style={{
                            height: `${4 + Math.sin(i * 0.8) * 10 + Math.random() * 8}px`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Duration */}
                    <span className="text-xs text-[#2952AB]/60 font-medium flex-shrink-0">
                      {formatDuration(voiceRecording.duration)}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={deleteRecording}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2
                        size={16}
                        className="text-red-400"
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Service Address */}
            <div>
              <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
                <MapPin size={16} strokeWidth={1.5} />
                عنوان الخدمة
              </h3>

              {/* Selected address display / trigger */}
              <button
                onClick={() =>
                  setShowAddressPicker(!showAddressPicker)
                }
                className="w-full bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm text-right flex items-center gap-3 hover:border-[#2952AB]/30 transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <Home
                    size={18}
                    className="text-[#2952AB]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#2952AB] truncate">
                    {address}
                  </div>
                  <div className="text-xs text-[#2952AB]/50 mt-0.5">
                    اضغط لتغيير العنوان
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#7A9ACB] transition-transform flex-shrink-0 ${showAddressPicker ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>

              {/* Address picker dropdown */}
              {showAddressPicker && (
                <div className="mt-2 bg-white rounded-[10px] border border-[#C2D1E8]/30 shadow-md overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Use current location */}
                  <button
                    onClick={() => {
                      setAddress("الموقع الحالي (GPS)");
                      setShowAddressPicker(false);
                    }}
                    className="w-full p-3.5 flex items-center gap-3 hover:bg-[#E4ECF7]/50 transition-colors border-b border-[#C2D1E8]/20"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center shadow-sm">
                      <Navigation
                        size={16}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#2952AB]">
                        استخدام الموقع الحالي
                      </div>
                      <div className="text-xs text-[#2952AB]/50">
                        تحديد عبر GPS
                      </div>
                    </div>
                  </button>

                  {/* Saved addresses */}
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      onClick={() => {
                        setAddress(addr.address);
                        setShowAddressPicker(false);
                      }}
                      className={`w-full p-3.5 flex items-center gap-3 hover:bg-[#E4ECF7]/50 transition-colors border-b border-[#C2D1E8]/10 last:border-b-0 ${
                        address === addr.address
                          ? "bg-[#E4ECF7]/40"
                          : ""
                      }`}
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-[10px] flex items-center justify-center">
                        <MapPin
                          size={16}
                          className="text-[#2952AB]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 text-right min-w-0">
                        <div className="text-sm font-medium text-[#2952AB]">
                          {addr.label}
                        </div>
                        <div className="text-xs text-[#2952AB]/50 truncate">
                          {addr.address}
                        </div>
                      </div>
                      {address === addr.address && (
                        <CheckCircle2
                          size={18}
                          className="text-[#2952AB] flex-shrink-0"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <h3 className="text-sm font-medium text-[#2952AB] mb-3 flex items-center gap-2">
                <Phone size={16} strokeWidth={1.5} />
                رقم هاتف التواصل
              </h3>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 text-sm text-[#2952AB] focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-sm font-medium text-[#2952AB] mb-3">
                ملاحظات إضافية (اختياري)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تعليمات أو طلبات خاصة..."
                rows={3}
                className="w-full bg-white px-4 py-3 rounded-[10px] border border-[#C2D1E8]/30 text-sm text-[#2952AB] placeholder:text-[#2952AB]/40 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-4 pb-4">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 bg-white text-[#2952AB] py-4 rounded-[10px] font-medium border border-[#C2D1E8]/60 shadow-sm"
            >
              السابق
            </button>
          )}
          <button
            onClick={() => {
              if (currentStep === 1) {
                if (
                  !selectedProvider ||
                  !selectedDate ||
                  !selectedTime
                ) {
                  alert("يرجى اختيار المزود ووقت الحجز");
                  return;
                }
                setCurrentStep(2);
                window.scrollTo(0, 0);
              } else {
                handleBooking();
              }
            }}
            className={`${currentStep === 2 ? "flex-[2]" : "w-full"} bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium shadow-lg transition-all active:scale-[0.98]`}
          >
            {currentStep === 1
              ? "التالي للتفاصيل"
              : "تأكيد الحجز"}
          </button>
        </div>
      </div>

      <BottomNav />

      {/* Add New Car Bottom Sheet */}
      <Drawer
        open={addCarOpen}
        onOpenChange={(open) => {
          setAddCarOpen(open);
          if (!open) {
            setAddCarErrors({});
          }
        }}
      >
        <DrawerContent className="max-h-[92vh] rounded-t-[10px] bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3]">
          {/* Drag handle */}
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#C2D1E8]/60" />

          <DrawerHeader className="px-6 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2952AB] to-[#3B6EC9] rounded-[10px] flex items-center justify-center shadow-md">
                  <Car
                    size={20}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <DrawerTitle className="text-[#2952AB] text-lg">
                    إضافة سيارة جديدة
                  </DrawerTitle>
                  <DrawerDescription className="text-[#2952AB]/50 text-xs">
                    أدخل تفاصيل مركبتك
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose className="p-2 rounded-[10px] hover:bg-[#C2D1E8]/20 transition-colors">
                <X
                  size={20}
                  className="text-[#2952AB]/60"
                  strokeWidth={1.5}
                />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="px-6 pb-8 space-y-4 overflow-y-auto">
            {/* Make & Model row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2952AB]/70 mb-1.5 flex items-center gap-1.5">
                  <Type size={12} strokeWidth={2} />
                  الماركة
                </label>
                <input
                  type="text"
                  value={newCar.make}
                  onChange={(e) =>
                    setNewCar((p) => ({
                      ...p,
                      make: e.target.value,
                    }))
                  }
                  placeholder="مثال: تويوتا"
                  className={`w-full bg-white px-3.5 py-3 rounded-[10px] border text-sm text-[#2952AB] placeholder:text-[#2952AB]/30 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 transition-all ${
                    addCarErrors.make
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-[#C2D1E8]/30"
                  }`}
                />
                {addCarErrors.make && (
                  <p className="text-[10px] text-red-400 mt-1 ml-1">
                    {addCarErrors.make}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-[#2952AB]/70 mb-1.5 flex items-center gap-1.5">
                  <Type size={12} strokeWidth={2} />
                  الموديل
                </label>
                <input
                  type="text"
                  value={newCar.model}
                  onChange={(e) =>
                    setNewCar((p) => ({
                      ...p,
                      model: e.target.value,
                    }))
                  }
                  placeholder="مثال: كامري"
                  className={`w-full bg-white px-3.5 py-3 rounded-[10px] border text-sm text-[#2952AB] placeholder:text-[#2952AB]/30 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 transition-all ${
                    addCarErrors.model
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-[#C2D1E8]/30"
                  }`}
                />
                {addCarErrors.model && (
                  <p className="text-[10px] text-red-400 mt-1 ml-1">
                    {addCarErrors.model}
                  </p>
                )}
              </div>
            </div>

            {/* Year & Color row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#2952AB]/70 mb-1.5 flex items-center gap-1.5">
                  <CalendarDays size={12} strokeWidth={2} />
                  السنة
                </label>
                <input
                  type="number"
                  value={newCar.year}
                  onChange={(e) =>
                    setNewCar((p) => ({
                      ...p,
                      year: e.target.value,
                    }))
                  }
                  placeholder="مثال: 2024"
                  min="1900"
                  max="2030"
                  className={`w-full bg-white px-3.5 py-3 rounded-[10px] border text-sm text-[#2952AB] placeholder:text-[#2952AB]/30 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 transition-all ${
                    addCarErrors.year
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-[#C2D1E8]/30"
                  }`}
                />
                {addCarErrors.year && (
                  <p className="text-[10px] text-red-400 mt-1 ml-1">
                    {addCarErrors.year}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-[#2952AB]/70 mb-1.5 flex items-center gap-1.5">
                  <Palette size={12} strokeWidth={2} />
                  اللون
                </label>
                <input
                  type="text"
                  value={newCar.color}
                  onChange={(e) =>
                    setNewCar((p) => ({
                      ...p,
                      color: e.target.value,
                    }))
                  }
                  placeholder="مثال: فضي"
                  className={`w-full bg-white px-3.5 py-3 rounded-[10px] border text-sm text-[#2952AB] placeholder:text-[#2952AB]/30 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 transition-all ${
                    addCarErrors.color
                      ? "border-red-300 ring-2 ring-red-100"
                      : "border-[#C2D1E8]/30"
                  }`}
                />
                {addCarErrors.color && (
                  <p className="text-[10px] text-red-400 mt-1 ml-1">
                    {addCarErrors.color}
                  </p>
                )}
              </div>
            </div>

            {/* Plate Number */}
            <div>
              <label className="text-xs font-medium text-[#2952AB]/70 mb-1.5 flex items-center gap-1.5">
                <Hash size={12} strokeWidth={2} />
                رقم اللوحة
              </label>
              <input
                type="text"
                value={newCar.plateNumber}
                onChange={(e) =>
                  setNewCar((p) => ({
                    ...p,
                    plateNumber: e.target.value,
                  }))
                }
                placeholder="مثال: أ ب ج 1234"
                className={`w-full bg-white px-3.5 py-3 rounded-[10px] border text-sm text-[#2952AB] placeholder:text-[#2952AB]/30 focus:outline-none focus:ring-2 focus:ring-[#2952AB]/20 transition-all uppercase ${
                  addCarErrors.plateNumber
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-[#C2D1E8]/30"
                }`}
              />
              {addCarErrors.plateNumber && (
                <p className="text-[10px] text-red-400 mt-1 ml-1">
                  {addCarErrors.plateNumber}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <DrawerClose className="flex-1 py-3.5 rounded-[10px] border border-[#C2D1E8]/40 text-sm font-medium text-[#2952AB]/70 hover:bg-[#C2D1E8]/10 transition-colors">
                إلغاء
              </DrawerClose>
              <button
                onClick={handleAddCar}
                className="flex-[2] bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-3.5 rounded-[10px] font-medium text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Plus size={16} strokeWidth={2} />
                أضف السيارة
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Provider Profile Bottom Sheet */}
      <Drawer
        open={profileDrawerOpen}
        onOpenChange={setProfileDrawerOpen}
      >
        <DrawerContent className="max-h-[92vh] rounded-t-[10px] bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] px-0">
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#C2D1E8]/60" />
          
          {viewingProvider && (
            <div className="flex flex-col h-full overflow-hidden w-full max-w-md mx-auto relative" dir="rtl">
              <DrawerHeader className="px-6 pt-4 pb-2 border-b border-[#C2D1E8]/20 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <DrawerTitle className="text-[#2952AB] text-lg font-medium text-right">
                    الملف الشخصي للمزود
                  </DrawerTitle>
                  <DrawerClose className="p-2 rounded-[10px] hover:bg-[#C2D1E8]/20 transition-colors">
                    <X size={20} className="text-[#2952AB]/60" strokeWidth={1.5} />
                  </DrawerClose>
                </div>
              </DrawerHeader>

              <div className="px-6 py-6 overflow-y-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-[10px] p-5 border border-[#C2D1E8]/30 shadow-sm flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2952AB]/10 to-[#C69815]/10 rounded-full flex items-center justify-center flex-shrink-0 border border-[#2952AB]/20">
                    {viewingProvider.imageUrl ? (
                       <img src={viewingProvider.imageUrl} alt={viewingProvider.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                       <User size={28} className="text-[#2952AB]" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <h2 className="text-lg font-semibold text-gray-900">{viewingProvider.name}</h2>
                      {viewingProvider.verified && <CheckCircle2 size={16} className="text-blue-500" strokeWidth={2} />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 justify-start">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-[#C69815] fill-[#C69815]" strokeWidth={1.5} />
                        <span className="font-medium text-gray-900">{viewingProvider.rating}</span>
                        <span className="text-xs">({viewingProvider.reviews} تقييم)</span>
                      </div>
                      <div className="flex items-center gap-3 border-r border-gray-100 pr-3 mr-1">
                        <div className="flex items-center gap-1">
                          <Navigation size={12} className="text-[#7A9ACB]" />
                          <span className="text-xs font-medium text-gray-900">{getProviderDistanceTime(viewingProvider.id).distance}</span>
                        </div>
                        <span className="text-gray-200 text-[10px]">•</span>
                        <span className="text-xs text-gray-500">{getProviderDistanceTime(viewingProvider.id).time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[#2952AB]/5 flex items-center justify-center mb-2">
                      <Briefcase size={18} className="text-[#2952AB]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{getProviderBookings(viewingProvider.id)}</span>
                    <span className="text-xs text-gray-500 mt-0.5">حجز مكتمل</span>
                  </div>
                  <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[#C69815]/5 flex items-center justify-center mb-2">
                      <Award size={18} className="text-[#C69815]" strokeWidth={1.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900">{viewingProvider.rating >= 4.8 ? "ممتاز" : "جيد جداً"}</span>
                    <span className="text-xs text-gray-500 mt-0.5">مستوى الخدمة</span>
                  </div>
                </div>

                {/* About Section (Mock) */}
                <div>
                  <h3 className="text-sm font-medium text-[#2952AB] mb-2 flex items-center gap-2 justify-start">
                    <User size={16} strokeWidth={1.5} />
                    نبذة عن المزود
                  </h3>
                  <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm text-sm text-gray-600 leading-relaxed text-right">
                    يقدم {viewingProvider.name} خدمات احترافية وعالية الجودة. متخصص في تلبية احتياجات العملاء بسرعة وكفاءة مع ضمان رضا العميل في كل خدمة يتم تقديمها. يمتلك خبرة واسعة تمتد لسنوات في هذا المجال.
                  </div>
                </div>

                {/* Provided Services */}
                <div>
                  <h3 className="text-sm font-medium text-[#2952AB] mb-2 flex items-center gap-2 justify-start">
                    <Briefcase size={16} strokeWidth={1.5} />
                    الخدمات المقدمة
                  </h3>
                  <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {getProviderServices(viewingProvider.id).map((srv, idx) => (
                        <div key={idx} className="bg-[#F2F5FB] px-3 py-1.5 rounded-full border border-[#C2D1E8]/40 flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-[#2952AB]" strokeWidth={2} />
                          <span className="text-[11px] font-medium text-gray-700">{srv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div>
                  <h3 className="text-sm font-medium text-[#2952AB] mb-2 text-right">التواصل المباشر</h3>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-white border border-[#C2D1E8]/40 hover:border-[#2952AB]/40 py-3 rounded-[10px] flex items-center justify-center gap-2 transition-all shadow-sm group">
                      <MessageSquare size={18} className="text-[#2952AB] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                      <span className="text-sm font-medium text-[#2952AB]">مراسلة</span>
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-3 rounded-[10px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95">
                      <PhoneCall size={18} strokeWidth={1.5} />
                      <span className="text-sm font-medium">اتصال</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}