export interface LiveActivity {
  id: string;
  type:
    | "food-delivery"
    | "property-rental"
    | "parcel-delivery"
    | "car-service"
    | "beauty";
  title: string;
  subtitle: string;
  progress: number;
  status: "in-progress" | "confirmed" | "completed";
  estimatedTime?: string;
  countdownTime?: string;
}

export interface RoomBed {
  type: string;
  count: number;
}

export interface RoomDetail {
  id: string;
  name: string;
  type: string;
  beds: RoomBed[];
  features: string[];
  images?: string[];
}

export interface BathroomDetail {
  id: string;
  name: string;
  type: string;
  access: "private" | "shared";
  location: string;
  images?: string[];
}

export interface ActivityItem {
  id: string;
  module:
    | "home-services"
    | "car-services"
    | "street-assistant"
    | "property-rental"
    | "restaurant-tables"
    | "food-delivery"
    | "parcel-delivery"
    | "beauty";
  title: string;
  description: string;
  date: string;
  time: string;
  status: "confirmed" | "in-progress" | "completed";
  amount?: string;
}

export interface FeaturedService {
  id: string;
  type: "property" | "restaurant";
  title: string;
  subtitle: string;
  imageUrl: string;
  badge?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  module: string;
  module_key: string;
  gradient: string;
  textColor: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
  experience?: string;
  verified: boolean;
  price?: number;
  priceUnit?: string;
  pickupFee?: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  duration: string;
  availability: string;
  providers: ServiceProvider[];
  rating: number;
  reviews: number;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  module: "home-services" | "car-services";
  name: string;
  description: string;
  icon: string;
  services: Service[];
}

export interface StreetAssistantProvider {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  estimatedTime: string;
  baseCost: number;
  verified: boolean;
  vehicleType?: string;
}

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  distance: string;
  price: number;
  priceUnit: string;
  availability: number;
  total: number;
  features: string[];
}

export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  area: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviews: number;
  images: string[];
  has360View: boolean;
  hasVideo: boolean;
  view: "garden" | "street" | "kitchen" | "pool";
  rooms: {
    bedrooms: number;
    bedroomType: string[];
    bathrooms: number;
    bathroomType: string[];
    beds: number;
    bedType: string[];
  };
  roomDetails: RoomDetail[];
  bathroomDetails: BathroomDetail[];
  amenities: string[];
  maxGuests: {
    adults: number;
    children: number;
  };
  propertyType: string;
  popular?: boolean;
  blockedDates?: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  country: string;
  distance?: string;
  travelTime?: string;
  rating: number;
  reviews: number;
  priceRange: string;
  images: string[];
  menu: MenuCategory[];
  halls: Hall[];
  openingHours: string;
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
}

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  view: "garden" | "street" | "kitchen" | "pool";
  tables: Table[];
}

export interface Table {
  id: string;
  number: number;
  shape: "circle" | "oval" | "rectangle" | "square";
  seats: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  available: boolean;
}

export interface FoodRestaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  country: string;
  distance?: string;
  travelTime?: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  menu: FoodCategory[];
  popular?: boolean;
}

export interface FoodOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodOptionGroup {
  id: string;
  name: string;
  required: boolean;
  options: FoodOption[];
}

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}
export interface FoodCategory {
  id: string;
  name: string;
  items: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  customizable?: boolean;
  optionGroups?: FoodOptionGroup[];
  addons?: FoodAddon[];
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  notes?: string;
  selectedOptions?: Record<string, FoodOption>;
  selectedAddons?: FoodAddon[];
  totalItemPrice: number;
}

export interface ParcelDriver {
  id: string;
  name: string;
  type: "freelancer" | "company-captain";
  companyName?: string;
  companyLogo?: string;
  rating: number;
  reviews: number;
  distance: string;
  estimatedTime: string;
  baseFee: number;
  pricePerStop: number;
  verified: boolean;
  vehicleType: "motorcycle" | "car" | "van" | "truck";
  vehicleInfo: string;
  completedDeliveries: number;
}

export const parcelDrivers: ParcelDriver[] = [
  {
    id: "pd-1",
    name: "Ahmed Yilmaz",
    type: "freelancer",
    rating: 4.9,
    reviews: 312,
    distance: "1.2 km",
    estimatedTime: "5 min",
    baseFee: 4.0,
    pricePerStop: 2.5,
    verified: true,
    vehicleType: "motorcycle",
    vehicleInfo: "Honda PCX 150",
    completedDeliveries: 1240,
  },
  {
    id: "pd-2",
    name: "Sara El-Masri",
    type: "company-captain",
    companyName: "SwiftPost Logistics",
    rating: 4.8,
    reviews: 589,
    distance: "2.4 km",
    estimatedTime: "8 min",
    baseFee: 6.0,
    pricePerStop: 3.0,
    verified: true,
    vehicleType: "van",
    vehicleInfo: "Mercedes Vito",
    completedDeliveries: 2100,
  },
  {
    id: "pd-3",
    name: "Kemal Demir",
    type: "freelancer",
    rating: 4.7,
    reviews: 198,
    distance: "0.8 km",
    estimatedTime: "3 min",
    baseFee: 3.5,
    pricePerStop: 2.0,
    verified: true,
    vehicleType: "motorcycle",
    vehicleInfo: "Yamaha NMAX",
    completedDeliveries: 780,
  },
  {
    id: "pd-4",
    name: "Omar Khalil",
    type: "company-captain",
    companyName: "ZeTime Express",
    rating: 4.9,
    reviews: 1021,
    distance: "3.1 km",
    estimatedTime: "12 min",
    baseFee: 7.5,
    pricePerStop: 3.5,
    verified: true,
    vehicleType: "truck",
    vehicleInfo: "Isuzu NPR",
    completedDeliveries: 3500,
  },
  {
    id: "pd-5",
    name: "Fatima Bayrak",
    type: "freelancer",
    rating: 4.6,
    reviews: 87,
    distance: "1.8 km",
    estimatedTime: "6 min",
    baseFee: 3.0,
    pricePerStop: 1.75,
    verified: false,
    vehicleType: "car",
    vehicleInfo: "Toyota Yaris",
    completedDeliveries: 320,
  },
  {
    id: "pd-6",
    name: "Hassan Korkmaz",
    type: "company-captain",
    companyName: "FleetDash",
    rating: 4.8,
    reviews: 445,
    distance: "2.0 km",
    estimatedTime: "7 min",
    baseFee: 5.5,
    pricePerStop: 2.75,
    verified: true,
    vehicleType: "van",
    vehicleInfo: "Ford Transit Custom",
    completedDeliveries: 1850,
  },
];

export const liveActivities: LiveActivity[] = [
  {
    id: "BK-BEAUTY-8821",
    type: "beauty",
    title: "صالون لوميار لاونج",
    subtitle: "موعدك اليوم في 3:30 م • قص وتصفيف + مانيكير",
    progress: 75,
    status: "confirmed",
    countdownTime: "متبقي 45 دقيقة",
  },
  {
    id: "1",
    type: "food-delivery",
    title: "باستا بريمافيرا",
    subtitle: "يصل خلال 12 دقيقة",
    progress: 65,
    status: "in-progress",
    estimatedTime: "7:45 مساءً",
  },
  {
    id: "2",
    type: "property-rental",
    title: "شقة سكاي لاين",
    subtitle: "العد التنازلي لتسجيل الوصول",
    progress: 40,
    status: "confirmed",
    countdownTime: "يومين و 5 ساعات",
  },
];

export const activityHistory: ActivityItem[] = [
  {
    id: "BK-BEAUTY-8821",
    module: "beauty",
    title: "صالون لوميار لاونج للتجميل",
    description: "قص شعر وتصفيف + مانيكير وباديكير ملكي",
    date: "اليوم",
    time: "3:30 مساءً",
    status: "confirmed",
    amount: "448.50 ر.س",
  },
  {
    id: "1",
    module: "food-delivery",
    title: "باستا بريمافيرا",
    description: "مطبخ ماريو الإيطالي",
    date: "اليوم",
    time: "7:45 مساءً",
    status: "in-progress",
    amount: "32.50$",
  },
  {
    id: "2",
    module: "property-rental",
    title: "شقة سكاي لاين",
    description: "وسط المدينة، غرفتين • 22-25 أبريل",
    date: "اليوم",
    time: "2:30 مساءً",
    status: "confirmed",
    amount: "450.00$",
  },
  {
    id: "3",
    module: "car-services",
    title: "تغيير زيت وفحص",
    description: "إيليت للعناية بالسيارات",
    date: "أمس",
    time: "3:00 مساءً",
    status: "completed",
    amount: "89.99$",
  },
  {
    id: "4",
    module: "restaurant-tables",
    title: "تراس الحديقة",
    description: "4 أشخاص • جلوس بجانب النافذة",
    date: "أمس",
    time: "7:00 مساءً",
    status: "completed",
    amount: "0.00$",
  },
  {
    id: "5",
    module: "parcel-delivery",
    title: "طرود إلى مكتب وسط المدينة",
    description: "توصيل سريع",
    date: "18 أبريل",
    time: "11:30 صباحاً",
    status: "completed",
    amount: "15.00$",
  },
  {
    id: "6",
    module: "home-services",
    title: "إصلاح التكيف",
    description: "خدمات كول بريز",
    date: "15 أبريل",
    time: "2:00 مساءً",
    status: "completed",
    amount: "120.00$",
  },
  {
    id: "7",
    module: "street-assistant",
    title: "تم حجز موقف سيارات",
    description: "شارع الرئيسي والشارع الخامس • ساعتين",
    date: "14 أبريل",
    time: "9:00 صباحاً",
    status: "completed",
    amount: "8.00$",
  },
  {
    id: "8",
    module: "food-delivery",
    title: "صندوق سوشي ديلوكس",
    description: "طوكيو إكسبريس",
    date: "13 أبريل",
    time: "6:30 مساءً",
    status: "completed",
    amount: "45.00$",
  },
];

export interface UserCar {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  plateNumber: string;
  imageUrl?: string;
}

export const userCars: UserCar[] = [
  {
    id: "car-1",
    make: "تويوتا",
    model: "كامري",
    year: 2022,
    color: "فضي",
    plateNumber: "أ ب ج 1234",
    imageUrl:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80",
  },
  {
    id: "car-2",
    make: "بي إم دبليو",
    model: "الفئة الثالثة",
    year: 2023,
    color: "أسود",
    plateNumber: "س ص ع 5678",
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80",
  },
  {
    id: "car-3",
    make: "مرسيدس",
    model: "سي كلاس",
    year: 2021,
    color: "أبيض",
    plateNumber: "ل م ن 9012",
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80",
  },
];

export const featuredServices: FeaturedService[] = [
  {
    id: "1",
    type: "property",
    title: "لوفت فاخر على الواجهة البحرية",
    subtitle: "وسط المدينة • 280$/ليلة",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    badge: "شائع",
  },
  {
    id: "2",
    type: "restaurant",
    title: "ذا آيفي جاردن",
    subtitle: "عشاء فاخر • $$$$",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    badge: "الأعلى تقييماً",
  },
  {
    id: "3",
    type: "property",
    title: "استوديو عصري",
    subtitle: "مركز المدينة • 150$/ليلة",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
  {
    id: "1",
    type: "restaurant",
    title: "سانسيت روفتوب",
    subtitle: "معاصر • $$$",
    imageUrl:
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80",
    badge: "جديد",
  },
];

export const promotions: Promotion[] = [
  {
    id: "beauty-1",
    title: "خصم 25% على باقات التجميل",
    description: "أول حجز صالون أو خدمة منزلية",
    discount: "25%",
    module: "الجمال والعناية",
    module_key: "beauty",
    gradient: "from-[#2952AB] via-[#7A9ACB] to-[#C69815]",
    textColor: "text-white",
  },
  {
    id: "1",
    title: "30% خصم",
    description: "أول خدمة منزلية",
    discount: "30%",
    module: "خدمات منزلية",
    module_key: "home-services",
    gradient: "from-[#2952AB] to-[#3B6EC9]",
    textColor: "text-white",
  },
  {
    id: "2",
    title: "توصيل مجاني",
    description: "للطلبات فوق 25$",
    discount: "مجاني",
    module: "توصيل طعام",
    module_key: "food-delivery",
    gradient: "from-[#C69815] to-[#A88012]",
    textColor: "text-[#000000]",
  },
  {
    id: "3",
    title: "20% خصم",
    description: "إيجارات عطلة نهاية الأسبوع",
    discount: "20%",
    module: "تأجير العقارات",
    module_key: "property-rental",
    gradient: "from-[#1D3D7A] to-[#2952AB]",
    textColor: "text-white",
  },
];

export const serviceCategories: ServiceCategory[] = [
  // Home Services
  {
    id: "plumbing",
    module: "home-services",
    name: "السباكة",
    description: "خدمات سباكة احترافية",
    icon: "droplet",
    services: [
      {
        id: "plumbing-1",
        categoryId: "plumbing",
        name: "Leak Repair",
        description: "Fix leaking pipes, faucets, and fixtures",
        price: 79,
        priceUnit: "from",
        duration: "1-2 hours",
        availability: "Available today",
        rating: 4.8,
        reviews: 342,
        popular: true,
        providers: [
          {
            id: "p1",
            name: "Mike Johnson",
            rating: 4.9,
            reviews: 156,
            experience: "8 years",
            verified: true,
            price: 79,
            priceUnit: "fixed",
          },
          {
            id: "p2",
            name: "Sarah Miller",
            rating: 4.7,
            reviews: 98,
            experience: "5 years",
            verified: true,
            price: 85,
            priceUnit: "fixed",
          },
        ],
      },
      {
        id: "plumbing-2",
        categoryId: "plumbing",
        name: "Drain Cleaning",
        description: "Unclog and clean drains and sewers",
        price: 89,
        priceUnit: "from",
        duration: "1 hour",
        availability: "Available today",
        rating: 4.7,
        reviews: 289,
        providers: [
          {
            id: "p1",
            name: "Mike Johnson",
            rating: 4.9,
            reviews: 156,
            experience: "8 years",
            verified: true,
            pickupFee: 20,
          },
        ],
      },
      {
        id: "plumbing-3",
        categoryId: "plumbing",
        name: "Water Heater Service",
        description: "Installation and repair of water heaters",
        price: 120,
        priceUnit: "from",
        duration: "2-3 hours",
        availability: "Next available: Tomorrow",
        rating: 4.9,
        reviews: 198,
        providers: [
          {
            id: "p3",
            name: "Tom Davis",
            rating: 4.8,
            reviews: 123,
            experience: "10 years",
            verified: true,
            pickupFee: 25,
          },
        ],
      },
    ],
  },
  {
    id: "electrical",
    module: "home-services",
    name: "الكهرباء",
    description: "خدمات كهربائية مرخصة",
    icon: "zap",
    services: [
      {
        id: "electrical-1",
        categoryId: "electrical",
        name: "Wiring & Outlets",
        description:
          "Install and repair electrical outlets and wiring",
        price: 95,
        priceUnit: "from",
        duration: "1-2 hours",
        availability: "Available today",
        rating: 4.9,
        reviews: 412,
        popular: true,
        providers: [
          {
            id: "e1",
            name: "John Electric",
            rating: 5.0,
            reviews: 234,
            experience: "12 years",
            verified: true,
          },
        ],
      },
      {
        id: "electrical-2",
        categoryId: "electrical",
        name: "Light Fixture Installation",
        description:
          "Install ceiling fans, chandeliers, and lights",
        price: 69,
        priceUnit: "from",
        duration: "1 hour",
        availability: "Available today",
        rating: 4.8,
        reviews: 267,
        providers: [
          {
            id: "e1",
            name: "John Electric",
            rating: 5.0,
            reviews: 234,
            experience: "12 years",
            verified: true,
          },
        ],
      },
    ],
  },
  {
    id: "ac-repair",
    module: "home-services",
    name: "إصلاح التكييف",
    description: "خدمات التكييف والتبريد",
    icon: "wind",
    services: [
      {
        id: "ac-1",
        categoryId: "ac-repair",
        name: "AC Maintenance",
        description: "Complete AC system checkup and cleaning",
        price: 99,
        priceUnit: "from",
        duration: "1-2 hours",
        availability: "Available today",
        rating: 4.7,
        reviews: 298,
        popular: true,
        providers: [
          {
            id: "ac1",
            name: "CoolBreeze Services",
            rating: 4.8,
            reviews: 189,
            experience: "7 years",
            verified: true,
          },
        ],
      },
      {
        id: "ac-2",
        categoryId: "ac-repair",
        name: "AC Repair",
        description: "Diagnose and repair AC issues",
        price: 120,
        priceUnit: "from",
        duration: "2-3 hours",
        availability: "Next available: Tomorrow",
        rating: 4.8,
        reviews: 234,
        providers: [
          {
            id: "ac1",
            name: "CoolBreeze Services",
            rating: 4.8,
            reviews: 189,
            experience: "7 years",
            verified: true,
          },
        ],
      },
    ],
  },
  {
    id: "carpentry",
    module: "home-services",
    name: "Carpentry",
    description: "Professional carpentry work",
    icon: "hammer",
    services: [
      {
        id: "carpentry-1",
        categoryId: "carpentry",
        name: "Furniture Assembly",
        description: "Assemble furniture and fixtures",
        price: 59,
        priceUnit: "from",
        duration: "1 hour",
        availability: "Available today",
        rating: 4.6,
        reviews: 178,
        providers: [
          {
            id: "c1",
            name: "Wood Works Pro",
            rating: 4.7,
            reviews: 145,
            experience: "6 years",
            verified: true,
          },
        ],
      },
      {
        id: "carpentry-2",
        categoryId: "carpentry",
        name: "Custom Shelving",
        description: "Build and install custom shelves",
        price: 149,
        priceUnit: "from",
        duration: "3-4 hours",
        availability: "Available today",
        rating: 4.9,
        reviews: 156,
        popular: true,
        providers: [
          {
            id: "c1",
            name: "Wood Works Pro",
            rating: 4.7,
            reviews: 145,
            experience: "6 years",
            verified: true,
          },
        ],
      },
    ],
  },
  {
    id: "general-repair",
    module: "home-services",
    name: "General Repair",
    description: "All-around handyman services",
    icon: "wrench",
    services: [
      {
        id: "general-1",
        categoryId: "general-repair",
        name: "Handyman Service",
        description: "General repairs and maintenance",
        price: 69,
        priceUnit: "per hour",
        duration: "Flexible",
        availability: "Available now",
        rating: 4.8,
        reviews: 567,
        popular: true,
        providers: [
          {
            id: "g1",
            name: "Fix-It Frank",
            rating: 4.9,
            reviews: 289,
            experience: "9 years",
            verified: true,
          },
        ],
      },
    ],
  },
  // Car Services
  {
    id: "oil-change",
    module: "car-services",
    name: "Oil Change",
    description: "Quick oil change service",
    icon: "droplets",
    services: [
      {
        id: "oil-1",
        categoryId: "oil-change",
        name: "Standard Oil Change",
        description: "Conventional oil change with filter",
        price: 49,
        priceUnit: "from",
        duration: "30 mins",
        availability: "Available today",
        rating: 4.7,
        reviews: 456,
        popular: true,
        providers: [
          {
            id: "o1",
            name: "Quick Lube Auto",
            rating: 4.8,
            reviews: 234,
            experience: "5 years",
            verified: true,
            pickupFee: 15,
          },
        ],
      },
      {
        id: "oil-2",
        categoryId: "oil-change",
        name: "Synthetic Oil Change",
        description: "Full synthetic oil with premium filter",
        price: 79,
        priceUnit: "from",
        duration: "30 mins",
        availability: "Available today",
        rating: 4.9,
        reviews: 389,
        providers: [
          {
            id: "o1",
            name: "Quick Lube Auto",
            rating: 4.8,
            reviews: 234,
            experience: "5 years",
            verified: true,
            pickupFee: 15,
          },
        ],
      },
    ],
  },
  {
    id: "tire-service",
    module: "car-services",
    name: "Tire Service",
    description: "Complete tire care",
    icon: "gauge",
    services: [
      {
        id: "tire-1",
        categoryId: "tire-service",
        name: "Tire Rotation",
        description: "Rotate and balance all four tires",
        price: 59,
        priceUnit: "from",
        duration: "45 mins",
        availability: "Available today",
        rating: 4.8,
        reviews: 298,
        providers: [
          {
            id: "t1",
            name: "Elite Tire Center",
            rating: 4.9,
            reviews: 178,
            experience: "8 years",
            verified: true,
            pickupFee: 20,
          },
        ],
      },
      {
        id: "tire-2",
        categoryId: "tire-service",
        name: "New Tire Installation",
        description: "Install new tires with balancing",
        price: 89,
        priceUnit: "per tire",
        duration: "1 hour",
        availability: "Available today",
        rating: 4.9,
        reviews: 412,
        popular: true,
        providers: [
          {
            id: "t1",
            name: "Elite Tire Center",
            rating: 4.9,
            reviews: 178,
            experience: "8 years",
            verified: true,
            pickupFee: 20,
          },
        ],
      },
      {
        id: "tire-3",
        categoryId: "tire-service",
        name: "Flat Tire Repair",
        description: "Patch and repair punctured tires",
        price: 35,
        priceUnit: "from",
        duration: "30 mins",
        availability: "Available now",
        rating: 4.7,
        reviews: 234,
        providers: [
          {
            id: "t1",
            name: "Elite Tire Center",
            rating: 4.9,
            reviews: 178,
            experience: "8 years",
            verified: true,
            pickupFee: 20,
          },
        ],
      },
    ],
  },
  {
    id: "battery-service",
    module: "car-services",
    name: "Battery Service",
    description: "Battery check and replacement",
    icon: "battery",
    services: [
      {
        id: "battery-1",
        categoryId: "battery-service",
        name: "Battery Test",
        description: "Free battery health check",
        price: 0,
        priceUnit: "free",
        duration: "15 mins",
        availability: "Available now",
        rating: 4.9,
        reviews: 567,
        popular: true,
        providers: [
          {
            id: "b1",
            name: "Power Auto",
            rating: 4.9,
            reviews: 345,
            experience: "6 years",
            verified: true,
          },
        ],
      },
      {
        id: "battery-2",
        categoryId: "battery-service",
        name: "Battery Replacement",
        description: "Install new battery with warranty",
        price: 149,
        priceUnit: "from",
        duration: "30 mins",
        availability: "Available today",
        rating: 4.8,
        reviews: 423,
        providers: [
          {
            id: "b1",
            name: "Power Auto",
            rating: 4.9,
            reviews: 345,
            experience: "6 years",
            verified: true,
          },
        ],
      },
    ],
  },
  {
    id: "car-ac-service",
    module: "car-services",
    name: "AC Service",
    description: "Auto air conditioning",
    icon: "wind",
    services: [
      {
        id: "car-ac-1",
        categoryId: "car-ac-service",
        name: "AC Recharge",
        description: "Refill refrigerant and check system",
        price: 120,
        priceUnit: "from",
        duration: "1 hour",
        availability: "Available today",
        rating: 4.7,
        reviews: 289,
        providers: [
          {
            id: "ca1",
            name: "Cool Car AC",
            rating: 4.8,
            reviews: 167,
            experience: "7 years",
            verified: true,
          },
        ],
      },
      {
        id: "car-ac-2",
        categoryId: "car-ac-service",
        name: "AC System Repair",
        description: "Diagnose and fix AC issues",
        price: 180,
        priceUnit: "from",
        duration: "2 hours",
        availability: "Next available: Tomorrow",
        rating: 4.8,
        reviews: 198,
        providers: [
          {
            id: "ca1",
            name: "Cool Car AC",
            rating: 4.8,
            reviews: 167,
            experience: "7 years",
            verified: true,
          },
        ],
      },
    ],
  },
  {
    id: "general-inspection",
    module: "car-services",
    name: "General Inspection",
    description: "Complete vehicle checkup",
    icon: "wrench",
    services: [
      {
        id: "inspection-1",
        categoryId: "general-inspection",
        name: "Multi-Point Inspection",
        description: "Comprehensive vehicle inspection",
        price: 69,
        priceUnit: "from",
        duration: "45 mins",
        availability: "Available today",
        rating: 4.9,
        reviews: 634,
        popular: true,
        providers: [
          {
            id: "i1",
            name: "Elite Auto Care",
            rating: 4.9,
            reviews: 456,
            experience: "10 years",
            verified: true,
            pickupFee: 25,
          },
        ],
      },
      {
        id: "inspection-2",
        categoryId: "general-inspection",
        name: "Pre-Purchase Inspection",
        description: "Thorough check before buying a car",
        price: 99,
        priceUnit: "from",
        duration: "1 hour",
        availability: "Available today",
        rating: 5.0,
        reviews: 298,
        providers: [
          {
            id: "i1",
            name: "Elite Auto Care",
            rating: 4.9,
            reviews: 456,
            experience: "10 years",
            verified: true,
            pickupFee: 25,
          },
        ],
      },
    ],
  },
];

export const streetAssistantProviders: Record<
  string,
  StreetAssistantProvider[]
> = {
  "car-towing": [
    {
      id: "tow1",
      name: "Fast Tow Services",
      rating: 4.8,
      reviews: 234,
      distance: "2.3 km",
      estimatedTime: "12 mins",
      baseCost: 65,
      verified: true,
      vehicleType: "Flatbed Truck",
    },
    {
      id: "tow2",
      name: "City Towing Pro",
      rating: 4.9,
      reviews: 312,
      distance: "3.1 km",
      estimatedTime: "18 mins",
      baseCost: 70,
      verified: true,
      vehicleType: "Heavy Duty",
    },
    {
      id: "tow3",
      name: "QuickTow 24/7",
      rating: 4.7,
      reviews: 189,
      distance: "4.5 km",
      estimatedTime: "22 mins",
      baseCost: 75,
      verified: true,
      vehicleType: "Flatbed Truck",
    },
  ],
  "fuel-delivery": [
    {
      id: "fuel1",
      name: "FuelRush Express",
      rating: 4.9,
      reviews: 456,
      distance: "1.8 km",
      estimatedTime: "10 mins",
      baseCost: 15,
      verified: true,
    },
    {
      id: "fuel2",
      name: "Gas On Wheels",
      rating: 4.8,
      reviews: 298,
      distance: "2.5 km",
      estimatedTime: "15 mins",
      baseCost: 18,
      verified: true,
    },
    {
      id: "fuel3",
      name: "Quick Fuel Service",
      rating: 4.7,
      reviews: 234,
      distance: "3.2 km",
      estimatedTime: "20 mins",
      baseCost: 20,
      verified: true,
    },
  ],
  "car-opening": [
    {
      id: "open1",
      name: "LockOut Masters",
      rating: 5.0,
      reviews: 512,
      distance: "1.5 km",
      estimatedTime: "8 mins",
      baseCost: 45,
      verified: true,
    },
    {
      id: "open2",
      name: "Auto Unlock Pro",
      rating: 4.9,
      reviews: 387,
      distance: "2.2 km",
      estimatedTime: "12 mins",
      baseCost: 50,
      verified: true,
    },
    {
      id: "open3",
      name: "KeySave Services",
      rating: 4.8,
      reviews: 276,
      distance: "3.0 km",
      estimatedTime: "16 mins",
      baseCost: 55,
      verified: true,
    },
  ],
  "battery-revive": [
    {
      id: "bat1",
      name: "JumpStart Heroes",
      rating: 4.9,
      reviews: 423,
      distance: "1.2 km",
      estimatedTime: "7 mins",
      baseCost: 35,
      verified: true,
    },
    {
      id: "bat2",
      name: "Battery Rescue",
      rating: 4.8,
      reviews: 345,
      distance: "2.8 km",
      estimatedTime: "14 mins",
      baseCost: 40,
      verified: true,
    },
    {
      id: "bat3",
      name: "PowerUp Mobile",
      rating: 4.7,
      reviews: 289,
      distance: "3.5 km",
      estimatedTime: "18 mins",
      baseCost: 42,
      verified: true,
    },
  ],
  "tyre-fixing": [
    {
      id: "tyre1",
      name: "TireQuick Fix",
      rating: 4.8,
      reviews: 367,
      distance: "1.6 km",
      estimatedTime: "9 mins",
      baseCost: 0,
      verified: true,
    },
    {
      id: "tyre2",
      name: "RoadSide Tires",
      rating: 4.9,
      reviews: 412,
      distance: "2.4 km",
      estimatedTime: "13 mins",
      baseCost: 0,
      verified: true,
    },
    {
      id: "tyre3",
      name: "Mobile Tire Pro",
      rating: 4.7,
      reviews: 298,
      distance: "3.3 km",
      estimatedTime: "17 mins",
      baseCost: 0,
      verified: true,
    },
  ],
  "global-fixing": [
    {
      id: "fix1",
      name: "RoadSide Fix All",
      rating: 4.9,
      reviews: 534,
      distance: "2.0 km",
      estimatedTime: "11 mins",
      baseCost: 0,
      verified: true,
    },
    {
      id: "fix2",
      name: "Mobile Mechanic",
      rating: 4.8,
      reviews: 445,
      distance: "2.7 km",
      estimatedTime: "15 mins",
      baseCost: 0,
      verified: true,
    },
    {
      id: "fix3",
      name: "Auto Fix Express",
      rating: 4.7,
      reviews: 356,
      distance: "3.8 km",
      estimatedTime: "19 mins",
      baseCost: 0,
      verified: true,
    },
  ],
};

export const parkingSpots: ParkingSpot[] = [
  {
    id: "park1",
    name: "Downtown Parking Plaza",
    address: "123 Market St, San Francisco",
    distance: "0.3 km",
    price: 4,
    priceUnit: "per hour",
    availability: 12,
    total: 50,
    features: ["Covered", "Security", "EV Charging"],
  },
  {
    id: "park2",
    name: "City Center Garage",
    address: "456 Main St, San Francisco",
    distance: "0.5 km",
    price: 3.5,
    priceUnit: "per hour",
    availability: 23,
    total: 100,
    features: ["24/7 Access", "Security", "Valet"],
  },
  {
    id: "park3",
    name: "Metro Parking Lot",
    address: "789 Pine St, San Francisco",
    distance: "0.8 km",
    price: 3,
    priceUnit: "per hour",
    availability: 8,
    total: 30,
    features: ["Open Air", "Well Lit"],
  },
  {
    id: "park4",
    name: "Financial District Parking",
    address: "321 Montgomery St, San Francisco",
    distance: "1.2 km",
    price: 5,
    priceUnit: "per hour",
    availability: 5,
    total: 75,
    features: [
      "Covered",
      "Security",
      "EV Charging",
      "Car Wash",
    ],
  },
];

export const fuelTypes = [
  { id: "regular", name: "Regular (87)", price: 4.5 },
  { id: "midgrade", name: "Mid-Grade (89)", price: 4.8 },
  { id: "premium", name: "Premium (91)", price: 5.2 },
  { id: "diesel", name: "Diesel", price: 5.0 },
];

export const properties: Property[] = [
  {
    id: "prop1",
    name: "Luxury Waterfront Loft",
    description:
      "Stunning waterfront loft with panoramic city views. Modern design with high-end finishes throughout.",
    address: "123 Harbor View, Downtown",
    city: "San Francisco",
    country: "USA",
    area: "Downtown",
    price: 280,
    priceUnit: "per night",
    rating: 4.9,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    has360View: true,
    hasVideo: true,
    view: "pool",
    rooms: {
      bedrooms: 2,
      bedroomType: ["Master", "Queen"],
      bathrooms: 2,
      bathroomType: ["Full", "Half"],
      beds: 3,
      bedType: ["King", "Queen", "Sofa Bed"],
    },

    roomDetails: [
      {
        id: "r1",
        name: "Master Bedroom",
        type: "Master Suite",
        beds: [{ type: "King", count: 1 }],
        features: [
          "Private Bathroom",
          "AC",
          "Wardrobe",
          "Balcony",
        ],
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        ],
      },
      {
        id: "r2",
        name: "Guest Bedroom",
        type: "Queen Room",
        beds: [
          { type: "Queen", count: 1 },
          { type: "Sofa Bed", count: 1 },
        ],
        features: ["AC", "Wardrobe"],
        images: [
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
        ],
      },
    ],
    bathroomDetails: [
      {
        id: "b1",
        name: "Master Bathroom",
        type: "Full Bathroom",
        access: "private",
        location: "Master Bedroom",
        images: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
        ],
      },
      {
        id: "b2",
        name: "Guest Bathroom",
        type: "Half Bath",
        access: "shared",
        location: "Hallway",
      },
    ],
    amenities: [
      "WiFi",
      "Kitchen",
      "Washer",
      "Dryer",
      "AC",
      "Heating",
      "TV",
      "Parking",
      "Gym",
      "Pool",
    ],
    maxGuests: { adults: 4, children: 2 },
    propertyType: "Loft",
    popular: true,
    blockedDates: [
      "2026-04-25",
      "2026-04-26",
      "2026-05-02",
      "2026-05-03",
    ],
  },
  {
    id: "prop2",
    name: "Modern Studio Downtown",
    description:
      "Cozy studio apartment in the heart of the city. Perfect for solo travelers or couples.",
    address: "456 Market St, City Center",
    city: "San Francisco",
    country: "USA",
    area: "City Center",
    price: 150,
    priceUnit: "per night",
    rating: 4.7,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    has360View: false,
    hasVideo: true,
    view: "street",
    rooms: {
      bedrooms: 1,
      bedroomType: ["Studio"],
      bathrooms: 1,
      bathroomType: ["Full"],
      beds: 1,
      bedType: ["Queen"],
    },
    roomDetails: [
      {
        id: "r1",
        name: "Studio Room",
        type: "Open Plan Studio",
        beds: [{ type: "Queen", count: 1 }],
        features: ["AC", "Wardrobe", "Desk"],
      },
    ],
    bathroomDetails: [
      {
        id: "b1",
        name: "Bathroom",
        type: "Full Bathroom",
        access: "private",
        location: "Studio Room",
      },
    ],
    amenities: ["WiFi", "Kitchen", "AC", "Heating", "TV"],
    maxGuests: { adults: 2, children: 0 },
    propertyType: "Studio",
  },
  {
    id: "prop3",
    name: "Spacious Family Home",
    description:
      "Beautiful 3-bedroom home with backyard. Ideal for families looking for a comfortable stay.",
    address: "789 Oak Ave, Suburbs",
    city: "San Francisco",
    country: "USA",
    area: "Suburbs",
    price: 320,
    priceUnit: "per night",
    rating: 4.8,
    reviews: 124,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    ],
    has360View: true,
    hasVideo: false,
    view: "garden",
    rooms: {
      bedrooms: 3,
      bedroomType: ["Master", "Queen", "Twin"],
      bathrooms: 2,
      bathroomType: ["Full", "Full"],
      beds: 4,
      bedType: ["King", "Queen", "Twin", "Twin"],
    },
    roomDetails: [
      {
        id: "r1",
        name: "Master Bedroom",
        type: "Master Suite",
        beds: [{ type: "King", count: 1 }],
        features: [
          "Private Bathroom",
          "AC",
          "Wardrobe",
          "Balcony",
        ],
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        ],
      },
      {
        id: "r2",
        name: "Queen Bedroom",
        type: "Queen Room",
        beds: [{ type: "Queen", count: 1 }],
        features: ["AC", "Wardrobe"],
        images: [
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
        ],
      },
      {
        id: "r3",
        name: "Kids Room",
        type: "Twin Room",
        beds: [{ type: "Twin", count: 2 }],
        features: ["AC"],
      },
    ],
    bathroomDetails: [
      {
        id: "b1",
        name: "Master Bathroom",
        type: "Full Bathroom",
        access: "private",
        location: "Master Bedroom",
        images: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
        ],
      },
      {
        id: "b2",
        name: "Family Bathroom",
        type: "Full Bathroom",
        access: "shared",
        location: "Hallway",
      },
    ],
    amenities: [
      "WiFi",
      "Kitchen",
      "Washer",
      "Dryer",
      "AC",
      "Heating",
      "TV",
      "Parking",
      "Backyard",
      "BBQ",
    ],
    maxGuests: { adults: 6, children: 3 },
    propertyType: "House",
    popular: true,
    blockedDates: ["2026-04-30", "2026-05-01", "2026-05-05"],
  },
  {
    id: "prop4",
    name: "Charming Victorian Apartment",
    description:
      "Historic Victorian-style apartment with original features and modern amenities.",
    address: "321 Heritage Ln, Historic District",
    city: "San Francisco",
    country: "USA",
    area: "Historic District",
    price: 200,
    priceUnit: "per night",
    rating: 4.6,
    reviews: 78,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    ],
    has360View: false,
    hasVideo: false,
    view: "kitchen",
    rooms: {
      bedrooms: 2,
      bedroomType: ["Queen", "Full"],
      bathrooms: 1,
      bathroomType: ["Full"],
      beds: 2,
      bedType: ["Queen", "Full"],
    },
    roomDetails: [
      {
        id: "r1",
        name: "Primary Bedroom",
        type: "Queen Room",
        beds: [{ type: "Queen", count: 1 }],
        features: ["AC", "Wardrobe", "Fireplace"],
      },
      {
        id: "r2",
        name: "Second Bedroom",
        type: "Full Room",
        beds: [{ type: "Full", count: 1 }],
        features: ["AC"],
      },
    ],
    bathroomDetails: [
      {
        id: "b1",
        name: "Main Bathroom",
        type: "Full Bathroom",
        access: "shared",
        location: "Hallway",
      },
    ],
    amenities: [
      "WiFi",
      "Kitchen",
      "AC",
      "Heating",
      "TV",
      "Fireplace",
    ],
    maxGuests: { adults: 4, children: 1 },
    propertyType: "Apartment",
  },
];

export const restaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "The Ivy Garden",
    description:
      "Fine dining experience with seasonal ingredients and elegant ambiance.",
    cuisine: "Contemporary",
    address: "123 Fine Dining Blvd, Downtown",
    city: "San Francisco",
    country: "USA",
    distance: "2.4 km",
    travelTime: "12 min",
    rating: 4.9,
    reviews: 234,
    priceRange: "$$$$",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80",
    ],
    openingHours: "5:00 PM - 11:00 PM",
    popular: true,
    menu: [
      {
        id: "appetizers",
        name: "Appetizers",
        items: [
          {
            id: "app1",
            name: "Truffle Arancini",
            description:
              "Crispy risotto balls with truffle aioli",
            price: 16,
            image:
              "https://images.unsplash.com/photo-1541529086526-db283c563270?w=400&q=80",
          },
          {
            id: "app2",
            name: "Tuna Tartare",
            description: "Fresh tuna with avocado and sesame",
            price: 18,
            popular: true,
            image:
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
          },
          {
            id: "app3",
            name: "Burrata",
            description:
              "Creamy burrata with heirloom tomatoes",
            price: 14,
            image:
              "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&q=80",
          },
        ],
      },
      {
        id: "mains",
        name: "Main Courses",
        items: [
          {
            id: "main1",
            name: "Wagyu Ribeye",
            description:
              "12oz premium wagyu with seasonal vegetables",
            price: 65,
            popular: true,
            image:
              "https://images.unsplash.com/photo-1546241072-48010ad2862c?w=400&q=80",
          },
          {
            id: "main2",
            name: "Pan-Seared Salmon",
            description:
              "Atlantic salmon with lemon butter sauce",
            price: 38,
            image:
              "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
          },
          {
            id: "main3",
            name: "Mushroom Risotto",
            description:
              "Creamy arborio rice with wild mushrooms",
            price: 28,
            image:
              "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
          },
        ],
      },
      {
        id: "desserts",
        name: "Desserts",
        items: [
          {
            id: "des1",
            name: "Chocolate Soufflé",
            description: "Light and airy chocolate soufflé",
            price: 12,
          },
          {
            id: "des2",
            name: "Tiramisu",
            description: "Classic Italian tiramisu",
            price: 10,
          },
        ],
      },
    ],
    halls: [
      {
        id: "main-hall",
        name: "Main Dining Hall",
        capacity: 80,
        view: "garden",
        tables: [
          {
            id: "t1",
            number: 1,
            shape: "circle",
            seats: 4,
            position: { x: 50, y: 50 },
            size: { width: 60, height: 60 },
            available: true,
          },
          {
            id: "t2",
            number: 2,
            shape: "rectangle",
            seats: 6,
            position: { x: 150, y: 50 },
            size: { width: 80, height: 50 },
            available: true,
          },
          {
            id: "t3",
            number: 3,
            shape: "circle",
            seats: 2,
            position: { x: 50, y: 150 },
            size: { width: 50, height: 50 },
            available: false,
          },
          {
            id: "t4",
            number: 4,
            shape: "oval",
            seats: 8,
            position: { x: 150, y: 150 },
            size: { width: 100, height: 60 },
            available: true,
          },
          {
            id: "t5",
            number: 5,
            shape: "square",
            seats: 4,
            position: { x: 280, y: 50 },
            size: { width: 60, height: 60 },
            available: true,
          },
          {
            id: "t6",
            number: 6,
            shape: "rectangle",
            seats: 4,
            position: { x: 280, y: 150 },
            size: { width: 70, height: 50 },
            available: true,
          },
        ],
      },
      {
        id: "private-room",
        name: "Private Dining Room",
        capacity: 20,
        view: "pool",
        tables: [
          {
            id: "tp1",
            number: 10,
            shape: "rectangle",
            seats: 12,
            position: { x: 100, y: 100 },
            size: { width: 150, height: 70 },
            available: true,
          },
          {
            id: "tp2",
            number: 11,
            shape: "circle",
            seats: 6,
            position: { x: 280, y: 100 },
            size: { width: 70, height: 70 },
            available: true,
          },
        ],
      },
    ],
  },
  {
    id: "rest2",
    name: "Sunset Rooftop",
    description:
      "Breathtaking views with modern American cuisine.",
    cuisine: "American",
    address: "456 Sky Tower, Downtown",
    city: "San Francisco",
    country: "USA",
    distance: "3.1 km",
    travelTime: "15 min",
    rating: 4.7,
    reviews: 189,
    priceRange: "$$$",
    images: [
      "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    ],
    openingHours: "4:00 PM - 12:00 AM",
    popular: true,
    menu: [
      {
        id: "starters",
        name: "Starters",
        items: [
          {
            id: "s1",
            name: "Loaded Nachos",
            description:
              "House-made chips with all the fixings",
            price: 14,
          },
          {
            id: "s2",
            name: "Buffalo Wings",
            description: "Crispy wings with blue cheese",
            price: 12,
            popular: true,
          },
        ],
      },
      {
        id: "mains",
        name: "Main Dishes",
        items: [
          {
            id: "m1",
            name: "Classic Burger",
            description: "Angus beef with fries",
            price: 22,
            popular: true,
          },
          {
            id: "m2",
            name: "Grilled Chicken",
            description: "Herb-marinated chicken breast",
            price: 26,
          },
        ],
      },
    ],
    halls: [
      {
        id: "rooftop",
        name: "Rooftop Terrace",
        capacity: 60,
        view: "street",
        tables: [
          {
            id: "tr1",
            number: 1,
            shape: "circle",
            seats: 4,
            position: { x: 60, y: 60 },
            size: { width: 60, height: 60 },
            available: true,
          },
          {
            id: "tr2",
            number: 2,
            shape: "circle",
            seats: 4,
            position: { x: 160, y: 60 },
            size: { width: 60, height: 60 },
            available: true,
          },
          {
            id: "tr3",
            number: 3,
            shape: "square",
            seats: 2,
            position: { x: 260, y: 60 },
            size: { width: 50, height: 50 },
            available: true,
          },
          {
            id: "tr4",
            number: 4,
            shape: "rectangle",
            seats: 6,
            position: { x: 60, y: 160 },
            size: { width: 80, height: 50 },
            available: false,
          },
          {
            id: "tr5",
            number: 5,
            shape: "oval",
            seats: 6,
            position: { x: 180, y: 160 },
            size: { width: 90, height: 60 },
            available: true,
          },
        ],
      },
    ],
  },
];

export const foodRestaurants: FoodRestaurant[] = [
  {
    id: "food1",
    name: "Mario's Italian Kitchen",
    description:
      "Authentic Italian cuisine with fresh pasta made daily",
    cuisine: "Italian",
    address: "456 Pasta Lane, Downtown",
    city: "Istanbul",
    country: "Turkey",
    distance: "2.4 km",
    travelTime: "18 min",
    rating: 4.8,
    reviews: 342,
    deliveryTime: "30-40 min",
    deliveryFee: 3.99,
    minimumOrder: 15,
    image:
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80",
    popular: true,
    menu: [
      {
        id: "pasta",
        name: "Pasta",
        items: [
          {
            id: "p1",
            name: "Pasta Primavera",
            description: "Fresh vegetables in garlic olive oil",
            price: 16.99,
            image:
              "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&q=80",
            popular: true,
            customizable: true,
            optionGroups: [
              {
                id: "p1-size",
                name: "Choose Size",
                required: true,
                options: [
                  { id: "p1-reg", name: "Regular", price: 0 },
                  { id: "p1-lrg", name: "Large", price: 4.99 },
                ],
              },
            ],
            addons: [
              {
                id: "p1-a1",
                name: "Extra Parmesan",
                price: 1.5,
              },
              {
                id: "p1-a2",
                name: "Add Grilled Chicken",
                price: 4.0,
              },
            ],
          },
          {
            id: "p2",
            name: "Spaghetti Carbonara",
            description: "Creamy sauce with bacon and parmesan",
            price: 18.99,
            image:
              "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
            customizable: true,
            optionGroups: [
              {
                id: "p2-pasta",
                name: "Pasta Type",
                required: true,
                options: [
                  {
                    id: "p2-spag",
                    name: "Spaghetti",
                    price: 0,
                  },
                  {
                    id: "p2-fett",
                    name: "Fettuccine",
                    price: 0,
                  },
                  { id: "p2-penn", name: "Penne", price: 0 },
                ],
              },
            ],
          },
          {
            id: "p3",
            name: "Fettuccine Alfredo",
            description: "Rich cream sauce with parmesan",
            price: 17.99,
            image:
              "https://images.unsplash.com/photo-1645112481338-69065f448db4?w=400&q=80",
          },
        ],
      },
      {
        id: "pizza",
        name: "Pizza",
        items: [
          {
            id: "pz1",
            name: "Margherita Pizza",
            description:
              "Fresh mozzarella, basil, and tomato sauce",
            price: 14.99,
            image:
              "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&q=80",
            popular: true,
            customizable: true,
            optionGroups: [
              {
                id: "pz1-size",
                name: "Pizza Size",
                required: true,
                options: [
                  {
                    id: "pz1-10",
                    name: "10-inch (Personal)",
                    price: 0,
                  },
                  {
                    id: "pz1-14",
                    name: "14-inch (Medium)",
                    price: 5.0,
                  },
                  {
                    id: "pz1-18",
                    name: "18-inch (Large)",
                    price: 9.0,
                  },
                ],
              },
            ],
          },
          {
            id: "pz2",
            name: "Pepperoni Pizza",
            description: "Classic pepperoni with mozzarella",
            price: 16.99,
            image:
              "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
          },
        ],
      },
    ],
  },
  {
    id: "food2",
    name: "Sushi Express",
    description: "Fresh sushi and Japanese favorites",
    cuisine: "Japanese",
    address: "789 Tokyo St, Midtown",
    city: "Istanbul",
    country: "Turkey",
    distance: "5.1 km",
    travelTime: "25 min",
    rating: 4.9,
    reviews: 456,
    deliveryTime: "25-35 min",
    deliveryFee: 4.99,
    minimumOrder: 20,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
    popular: true,
    menu: [
      {
        id: "rolls",
        name: "Sushi Rolls",
        items: [
          {
            id: "r1",
            name: "California Roll",
            description: "Crab, avocado, and cucumber",
            price: 12.99,
            image:
              "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
            popular: true,
          },
          {
            id: "r2",
            name: "Spicy Tuna Roll",
            description: "Spicy tuna with cucumber",
            price: 14.99,
            image:
              "https://images.unsplash.com/photo-1559466273-d95e72debaf8?w=400&q=80",
            popular: true,
          },
        ],
      },
    ],
  },
  {
    id: "food3",
    name: "Burger Haven",
    description: "Gourmet burgers and crispy fries",
    cuisine: "American",
    address: "321 Beef Blvd, Downtown",
    city: "Istanbul",
    country: "Turkey",
    distance: "1.2 km",
    travelTime: "10 min",
    rating: 4.7,
    reviews: 289,
    deliveryTime: "20-30 min",
    deliveryFee: 2.99,
    minimumOrder: 10,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    menu: [
      {
        id: "burgers",
        name: "Burgers",
        items: [
          {
            id: "b1",
            name: "Classic Cheeseburger",
            description:
              "Angus beef with cheese, lettuce, tomato",
            price: 11.99,
            image:
              "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80",
            popular: true,
            customizable: true,
            optionGroups: [
              {
                id: "b1-doneness",
                name: "Meat Doneness",
                required: true,
                options: [
                  { id: "b1-rare", name: "Rare", price: 0 },
                  { id: "b1-med", name: "Medium", price: 0 },
                  {
                    id: "b1-well",
                    name: "Well Done",
                    price: 0,
                  },
                ],
              },
            ],
            addons: [
              {
                id: "b1-extra-cheese",
                name: "Extra Cheddar",
                price: 1.5,
              },
              {
                id: "b1-bacon",
                name: "Add Crispy Bacon",
                price: 2.0,
              },
            ],
          },
          {
            id: "b2",
            name: "Bacon BBQ Burger",
            description: "Bacon, BBQ sauce, onion rings",
            price: 13.99,
            image:
              "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80",
          },
        ],
      },
      {
        id: "sides",
        name: "Sides",
        items: [
          {
            id: "s1",
            name: "French Fries",
            description: "Crispy golden fries",
            price: 4.99,
            image:
              "https://images.unsplash.com/photo-1630384066252-19e1ed95534a?w=400&q=80",
          },
        ],
      },
    ],
  },
];

export const moduleConfig = [
  {
    id: "home-services",
    name: "Home\nServices",
    icon: "home",
    route: "/module/home-services",
  },
  {
    id: "car-services",
    name: "Car\nServices",
    icon: "car",
    route: "/module/car-services",
  },
  {
    id: "street-assistant",
    name: "Street\nAssistant",
    icon: "map-pin",
    route: "/module/street-assistant",
  },
  {
    id: "property-rental",
    name: "Property\nRental",
    icon: "building",
    route: "/module/property-rental",
  },
  {
    id: "restaurant-tables",
    name: "Restaurant\nTables",
    icon: "utensils",
    route: "/module/restaurant-tables",
  },
  {
    id: "food-delivery",
    name: "Food\nDelivery",
    icon: "pizza",
    route: "/module/food-delivery",
  },
  {
    id: "parcel-delivery",
    name: "Parcel\nDelivery",
    icon: "package",
    route: "/module/parcel-delivery",
  },
];