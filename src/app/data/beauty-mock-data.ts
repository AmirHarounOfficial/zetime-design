export interface BeautyCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  servicesCount: number;
}

export interface BeautyMasterService {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  description: string;
  defaultDurationMin: number;
  homeServiceEligible: boolean;
  audience: 'women' | 'men' | 'kids' | 'unisex';
}

export interface BeautyProfessional {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  titleEn: string;
  photoUrl: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  businessId: string;
  branchId: string;
  branchName: string;
  homeServiceAvailable: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'TRANSFER_PENDING';
  bio: string;
}

export interface BeautyBranch {
  id: string;
  businessId: string;
  name: string;
  nameEn: string;
  address: string;
  city: string;
  country: string;
  distanceKm: number;
  phone: string;
  workingHours: string;
  isNearest?: boolean;
  queueActive: boolean;
  currentQueueCount: number;
  estimatedWaitMins: number;
  supportedHomeAreas: string[];
}

export interface BeautyBranchService {
  serviceId: string;
  name: string;
  nameEn: string;
  categoryId: string;
  price: number;
  homePrice?: number;
  durationMin: number;
  confirmationMode: 'AUTOMATIC' | 'MANUAL';
  homeServiceAvailable: boolean;
  popular?: boolean;
}

export interface BeautyReview {
  id: string;
  customerName: string;
  customerPhoto?: string;
  rating: number;
  date: string;
  serviceName: string;
  professionalName: string;
  comment: string;
  providerReply?: {
    date: string;
    text: string;
  };
}

export interface BeautyBusiness {
  id: string;
  name: string;
  nameEn: string;
  type: 'SALON' | 'SPA' | 'BARBERSHOP' | 'FREELANCER';
  audience: 'women' | 'men' | 'unisex' | 'kids';
  logoUrl: string;
  coverUrls: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  description: string;
  descriptionEn: string;
  gracePeriodMins: number;
  cancellationPolicy: string;
  subscriptionStatus: 'ACTIVE' | 'EXPIRED';
  branches: BeautyBranch[];
  services: BeautyBranchService[];
  professionals: BeautyProfessional[];
  reviews: BeautyReview[];
  offers?: {
    id: string;
    title: string;
    discountPercent: number;
    description: string;
    expiresAt: string;
  }[];
}

export interface BeautyServiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string; // 'ANY' or specific professional ID
  professionalName: string;
  price: number;
  durationMin: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface BeautyBooking {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  branchId: string;
  branchName: string;
  branchAddress: string;
  mode: 'IN_BRANCH' | 'AT_HOME';
  homeAddress?: string;
  date: string;
  overallStartTime: string;
  overallEndTime: string;
  totalDurationMin: number;
  items: BeautyServiceItem[];
  subtotal: number;
  homeServiceFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'ONLINE' | 'APPLE_PAY' | 'CARD_AT_PROVIDER' | 'CASH';
  paymentStatus: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'REFUNDED';
  confirmationMode: 'AUTOMATIC' | 'MANUAL';
  status:
    | 'CREATED'
    | 'PENDING_CONFIRMATION'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'IN_SERVICE'
    | 'COMPLETED'
    | 'PAID'
    | 'CANCELLED_BY_CUSTOMER'
    | 'CANCELLED_BY_PROVIDER'
    | 'CANCELLED_NO_RESPONSE'
    | 'NO_SHOW'
    | 'RESCHEDULE_PENDING';
  confirmationDeadline?: string; // 25% deadline
  gracePeriodMins: number;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  reviewSubmitted?: boolean;
}

export interface BeautyQueueTicket {
  id: string;
  ticketNumber: string; // e.g., "B-14"
  businessId: string;
  businessName: string;
  branchId: string;
  branchName: string;
  customerName: string;
  serviceName: string;
  professionalName: string;
  position: number;
  customersAhead: number;
  estimatedWaitMinutes: number;
  status: 'WAITING' | 'TEMPORARILY_AWAY' | 'CALLED' | 'CHECKED_IN' | 'SERVING' | 'COMPLETED' | 'EXPIRED';
  insertedInGap?: boolean;
  gapDetails?: string;
  joinedAt: string;
}

// Master Categories
export const beautyCategories: BeautyCategory[] = [
  {
    id: 'hair',
    name: 'شعر وتسريحات',
    nameEn: 'Hair & Styling',
    icon: 'scissors',
    description: 'قص، صبغات، استشوار وعلاجات الشعر',
    servicesCount: 24,
  },
  {
    id: 'nails',
    name: 'أظافر ومانيكير',
    nameEn: 'Nails & Art',
    icon: 'sparkles',
    description: 'مانيكير، باديكير، جل وتركيب أظافر',
    servicesCount: 18,
  },
  {
    id: 'facial-skincare',
    name: 'بشرة وعناية بالوجه',
    nameEn: 'Skincare & Facial',
    icon: 'smile',
    description: 'تنظيف عميق، نضارة وماسكات طبيعية',
    servicesCount: 15,
  },
  {
    id: 'makeup',
    name: 'مكياج وسهرات',
    nameEn: 'Makeup & Glam',
    icon: 'palette',
    description: 'مكياج ناعم، سهرة وعرائس',
    servicesCount: 12,
  },
  {
    id: 'barber',
    name: 'حلاقة رجالية ولحية',
    nameEn: 'Barbershop & Beard',
    icon: 'user-check',
    description: 'قص شعر احترافي وتحديد لحية بالبخار',
    servicesCount: 16,
  },
  {
    id: 'spa-massage',
    name: 'مساج وسبا',
    nameEn: 'Spa & Massage',
    icon: 'heart',
    description: 'مساج استرخائي، حمام مغربي وساونا',
    servicesCount: 14,
  },
  {
    id: 'lashes-brows',
    name: 'رموش وحواجب',
    nameEn: 'Lashes & Brows',
    icon: 'eye',
    description: 'تركيب رموش، رفع حواجب وتكثيف',
    servicesCount: 10,
  },
];

// Master Services
export const beautyMasterCatalog: BeautyMasterService[] = [
  {
    id: 'ms-hair-cut',
    categoryId: 'hair',
    name: 'قص شعر استشاري وتصفيف',
    nameEn: 'Haircut & Styling',
    description: 'قص حسب شكل الوجه مع غسيل وتجفيف احترافي',
    defaultDurationMin: 45,
    homeServiceEligible: true,
    audience: 'women',
  },
  {
    id: 'ms-hair-blowdry',
    categoryId: 'hair',
    name: 'استشوار وتسريحة ويفي',
    nameEn: 'Blowdry & Waves',
    description: 'تصفيف بالمجفف والفرشاة أو تمويج ويفي جذاب',
    defaultDurationMin: 35,
    homeServiceEligible: true,
    audience: 'women',
  },
  {
    id: 'ms-hair-color',
    categoryId: 'hair',
    name: 'صبغة كاملة أو رينساج',
    nameEn: 'Full Hair Color / Toner',
    description: 'صبغ الشعر بدرجات عصرية مع حماية الأولابلكس',
    defaultDurationMin: 90,
    homeServiceEligible: false,
    audience: 'women',
  },
  {
    id: 'ms-manicure-pedicure',
    categoryId: 'nails',
    name: 'مانيكير وباديكير ملكي سبا',
    nameEn: 'Royal Spa Mani-Pedi',
    description: 'عناية كاملة بالأظافر مع تقشير وترطيب وماسك بارافين',
    defaultDurationMin: 60,
    homeServiceEligible: true,
    audience: 'women',
  },
  {
    id: 'ms-gel-polish',
    categoryId: 'nails',
    name: 'طلاء أظافر جل يدوم طويلاً',
    nameEn: 'Long-Lasting Gel Polish',
    description: 'تطبيق لون جل احترافي مع تجفيف بالأشعة فوق البنفسجية',
    defaultDurationMin: 30,
    homeServiceEligible: true,
    audience: 'women',
  },
  {
    id: 'ms-deep-facial',
    categoryId: 'facial-skincare',
    name: 'تنظيف بشرة هايدرافاشيال عميق',
    nameEn: 'Deep Hydrafacial Cleansing',
    description: 'تنظيف مسام وإزالة الرؤوس السوداء مع سيروم فيتامين C',
    defaultDurationMin: 60,
    homeServiceEligible: true,
    audience: 'unisex',
  },
  {
    id: 'ms-glam-makeup',
    categoryId: 'makeup',
    name: 'مكياج سهرة كامل مع رموش',
    nameEn: 'Full Glam Evening Makeup',
    description: 'مكياج فخم للمناسبات مع كنتور وهايلايتر ورموش ثلاثية الأبعاد',
    defaultDurationMin: 60,
    homeServiceEligible: true,
    audience: 'women',
  },
  {
    id: 'ms-barber-fade',
    categoryId: 'barber',
    name: 'قص شعر فيد مدرج + غسيل',
    nameEn: 'Fade Haircut & Wash',
    description: 'قص كلاسيكي أو فيد مدرج مع استشوار وزيت مغذي',
    defaultDurationMin: 30,
    homeServiceEligible: true,
    audience: 'men',
  },
  {
    id: 'ms-barber-beard',
    categoryId: 'barber',
    name: 'تحديد لحية بالبخار والموس',
    nameEn: 'Hot Towel Beard Grooming',
    description: 'تحديد دقيق بالموس مع فوطة ساخنة وماسك مهدئ',
    defaultDurationMin: 25,
    homeServiceEligible: true,
    audience: 'men',
  },
  {
    id: 'ms-relax-massage',
    categoryId: 'spa-massage',
    name: 'مساج استرخائي سويدي (60 دقيقة)',
    nameEn: 'Swedish Relaxation Massage (60m)',
    description: 'تدليك كامل للجسم بالزيوت العطرية الدافئة لإزالة الإجهاد',
    defaultDurationMin: 60,
    homeServiceEligible: true,
    audience: 'unisex',
  },
];

// Mock Businesses
export const beautyBusinesses: BeautyBusiness[] = [
  {
    id: 'biz-lumiere',
    name: 'صالون لوميار لاونج للتجميل',
    nameEn: 'Lumière Beauty Lounge',
    type: 'SALON',
    audience: 'women',
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    coverUrls: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewsCount: 428,
    verified: true,
    description: 'صالون فاخر يقدم أرقى خدمات تصفيف الشعر، العناية بالأظافر، والبشرة بأيدي خبيرات عالميات وبأحدث التقنيات.',
    descriptionEn: 'Luxury salon offering premier hair styling, nail care, and skincare with world-class specialists.',
    gracePeriodMins: 15,
    cancellationPolicy: 'إلغاء مجاني حتى ساعتين قبل الموعد. بعد ذلك قد تطبق رسوم رمزية حسب السياسة.',
    subscriptionStatus: 'ACTIVE',
    branches: [
      {
        id: 'br-lumiere-olaya',
        businessId: 'biz-lumiere',
        name: 'فرع العليا (الرئيسي)',
        nameEn: 'Al Olaya Branch',
        address: 'شارع التحلية، حي العليا، الرياض',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        distanceKm: 2.1,
        phone: '+966 11 462 8899',
        workingHours: '10:00 ص - 10:00 م',
        isNearest: true,
        queueActive: true,
        currentQueueCount: 3,
        estimatedWaitMins: 25,
        supportedHomeAreas: ['العليا', 'السليمانية', 'الملقا', 'النخيل', 'حطين'],
      },
      {
        id: 'br-lumiere-nakheel',
        businessId: 'biz-lumiere',
        name: 'فرع مجمع النخيل',
        nameEn: 'Al Nakheel Branch',
        address: 'طريق الإمام سعود بن عبدالعزيز، حي النخيل، الرياض',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        distanceKm: 6.8,
        phone: '+966 11 489 1234',
        workingHours: '12:00 م - 11:00 م',
        queueActive: true,
        currentQueueCount: 1,
        estimatedWaitMins: 10,
        supportedHomeAreas: ['النخيل', 'الرائد', 'حطين', 'الصحافة'],
      },
    ],
    services: [
      {
        serviceId: 'ms-hair-cut',
        name: 'قص شعر احترافي وتصفيف',
        nameEn: 'Expert Haircut & Style',
        categoryId: 'hair',
        price: 180,
        homePrice: 240,
        durationMin: 45,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
        popular: true,
      },
      {
        serviceId: 'ms-hair-blowdry',
        name: 'استشوار وتسريحة ويفي فخمة',
        nameEn: 'Glam Blowdry & Waves',
        categoryId: 'hair',
        price: 130,
        homePrice: 190,
        durationMin: 35,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
        popular: true,
      },
      {
        serviceId: 'ms-manicure-pedicure',
        name: 'مانيكير وباديكير ملكي سبا',
        nameEn: 'Royal Spa Mani-Pedi',
        categoryId: 'nails',
        price: 210,
        homePrice: 280,
        durationMin: 60,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
        popular: true,
      },
      {
        serviceId: 'ms-gel-polish',
        name: 'طلاء أظافر جل يدوم طويلاً',
        nameEn: 'Long-Lasting Gel Polish',
        categoryId: 'nails',
        price: 95,
        homePrice: 130,
        durationMin: 30,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
      },
      {
        serviceId: 'ms-deep-facial',
        name: 'تنظيف بشرة هايدرافاشيال عميق',
        nameEn: 'Deep Hydrafacial Cleansing',
        categoryId: 'facial-skincare',
        price: 320,
        homePrice: 420,
        durationMin: 60,
        confirmationMode: 'MANUAL',
        homeServiceAvailable: true,
      },
    ],
    professionals: [
      {
        id: 'pro-sara',
        name: 'سارة الأحمد',
        nameEn: 'Sara Al-Ahmad',
        title: 'كبيرة مصففي الشعر وتلوين الصبغات',
        titleEn: 'Senior Hair Stylist & Colorist',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
        rating: 4.95,
        reviewsCount: 214,
        experienceYears: 8,
        languages: ['العربية', 'English'],
        specialties: ['قص الشعر المدرج', 'صبغات البلياج', 'تسريحات المناسبات'],
        businessId: 'biz-lumiere',
        branchId: 'br-lumiere-olaya',
        branchName: 'فرع العليا',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'خبرة تزيد عن 8 سنوات في أرقى صالونات باريس ودبي، متخصصة في اختيار القصة واللون الأنسب لملامح الوجه.',
      },
      {
        id: 'pro-layla',
        name: 'ليلى منصور',
        nameEn: 'Layla Mansour',
        title: 'أخصائية عناية بالأظافر وسبا',
        titleEn: 'Nail Artist & Spa Specialist',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rating: 4.88,
        reviewsCount: 162,
        experienceYears: 6,
        languages: ['العربية', 'English'],
        specialties: ['رسم الأظافر الفني', 'باديكير علاجي', 'جل روسي'],
        businessId: 'biz-lumiere',
        branchId: 'br-lumiere-olaya',
        branchName: 'فرع العليا',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'معتمدة دولياً في تقنيات الجل الروسي والعناية الطبية بالأظافر والسبا الطبيعي.',
      },
      {
        id: 'pro-nour',
        name: 'نور الهدى',
        nameEn: 'Nour El-Hoda',
        title: 'أخصائية عناية بالبشرة وهايدرافاشيال',
        titleEn: 'Certified Aesthetician',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        rating: 4.92,
        reviewsCount: 118,
        experienceYears: 5,
        languages: ['العربية'],
        specialties: ['تنظيف هايدرافاشيال', 'علاج التصبغات', 'مساج الوجه باليشم'],
        businessId: 'biz-lumiere',
        branchId: 'br-lumiere-nakheel',
        branchName: 'فرع النخيل',
        homeServiceAvailable: false,
        status: 'ACTIVE',
        bio: 'أخصائية معتمدة في تقنيات النضارة الفورية واستعادة حيوية البشرة المجهدة.',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        customerName: 'ريم خالد',
        rating: 5,
        date: 'أمس',
        serviceName: 'قص شعر احترافي وتصفيف',
        professionalName: 'سارة الأحمد',
        comment: 'تجربة رائعة جداً! سارة فنانة بكل معنى الكلمة، تفهم نوع الشعر وتعطي نصائح ممتازة. الاستقبال والضيافة قمة بالرقي.',
        providerReply: {
          date: 'اليوم',
          text: 'شكراً لكِ ريم ويسعدنا دائماً أن تكون تجربتكِ استثنائية! ننتظر زيارتك القادمة.',
        },
      },
      {
        id: 'rev-2',
        customerName: 'مها السلطان',
        rating: 5,
        date: 'منذ 3 أيام',
        serviceName: 'مانيكير وباديكير ملكي سبا',
        professionalName: 'ليلى منصور',
        comment: 'السبا الملكي مع ليلى خيالي.. النظافة والتعقيم عالي جداً وكل الأدوات معقمة أمامك.',
      },
    ],
    offers: [
      {
        id: 'off-1',
        title: 'باقة التجديد الذهبية',
        discountPercent: 20,
        description: 'خصم 20% عند حجز قص شعر + مانيكير ملكي معاً',
        expiresAt: 'ينتهي خلال 3 أيام',
      },
    ],
  },
  {
    id: 'biz-crown-barber',
    name: 'صالون كراون للرجال',
    nameEn: 'Crown Executive Barbershop',
    type: 'BARBERSHOP',
    audience: 'men',
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
    coverUrls: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.85,
    reviewsCount: 310,
    verified: true,
    description: 'صالون حلاقة رجالي كلاسيكي راقٍ يقدم تجربة الحلاقة الفاخرة، العناية باللحية بالبخار والزيوت العضوية.',
    descriptionEn: 'Executive barbershop providing premium hair fades, beard sculpting, and facial steam therapy.',
    gracePeriodMins: 15,
    cancellationPolicy: 'إلغاء مجاني قبل 60 دقيقة من الموعد.',
    subscriptionStatus: 'ACTIVE',
    branches: [
      {
        id: 'br-crown-malqa',
        businessId: 'biz-crown-barber',
        name: 'فرع الملقا - شارع أنس بن مالك',
        nameEn: 'Al Malqa Branch',
        address: 'شارع أنس بن مالك، حي الملقا، الرياض',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        distanceKm: 3.4,
        phone: '+966 11 234 5678',
        workingHours: '09:00 ص - 12:00 ص',
        isNearest: true,
        queueActive: true,
        currentQueueCount: 4,
        estimatedWaitMins: 30,
        supportedHomeAreas: ['الملقا', 'حطين', 'الصحافة', 'الياسمين'],
      },
    ],
    services: [
      {
        serviceId: 'ms-barber-fade',
        name: 'قص شعر فيد مدرج + غسيل وسيشوار',
        nameEn: 'Fade Haircut & Styling',
        categoryId: 'barber',
        price: 90,
        homePrice: 150,
        durationMin: 30,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
        popular: true,
      },
      {
        serviceId: 'ms-barber-beard',
        name: 'تحديد لحية ملكي بالبخار والفوطة الساخنة',
        nameEn: 'Hot Towel Royal Beard Trim',
        categoryId: 'barber',
        price: 70,
        homePrice: 120,
        durationMin: 25,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: true,
        popular: true,
      },
      {
        serviceId: 'ms-deep-facial',
        name: 'تنظيف وجه رجالي سريع وماسك فحم',
        nameEn: 'Express Charcoal Facial',
        categoryId: 'facial-skincare',
        price: 110,
        homePrice: 170,
        durationMin: 30,
        confirmationMode: 'AUTOMATIC',
        homeServiceAvailable: false,
      },
    ],
    professionals: [
      {
        id: 'pro-tariq',
        name: 'طارق الدليمي',
        nameEn: 'Tariq Al-Dulaimi',
        title: 'ماستر باربر وخبير تدريج اللحية',
        titleEn: 'Master Barber & Beard Stylist',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        rating: 4.96,
        reviewsCount: 195,
        experienceYears: 10,
        languages: ['العربية', 'English'],
        specialties: ['سكين فيد Skin Fade', 'تحديد اللحية الكلاسيكي', 'مساج الرأس'],
        businessId: 'biz-crown-barber',
        branchId: 'br-crown-malqa',
        branchName: 'فرع الملقا',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'حاصل على جوائز في فن الحلاقة والتدريج الكلاسيكي مع عناية فائقة بالتفاصيل.',
      },
      {
        id: 'pro-omar',
        name: 'عمر النجار',
        nameEn: 'Omar Al-Najjar',
        title: 'باربر محترف',
        titleEn: 'Professional Barber',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        rating: 4.82,
        reviewsCount: 115,
        experienceYears: 5,
        languages: ['العربية'],
        specialties: ['قصات عصرية', 'صبغة اللحية الطبيعية'],
        businessId: 'biz-crown-barber',
        branchId: 'br-crown-malqa',
        branchName: 'فرع الملقا',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'دقة وسرعة في العمل مع الحفاظ على أعلى معايير النظافة والتعقيم.',
      },
    ],
    reviews: [
      {
        id: 'rev-3',
        customerName: 'فهد المطيري',
        rating: 5,
        date: 'منذ يومين',
        serviceName: 'قص شعر فيد مدرج + تحديد لحية',
        professionalName: 'طارق الدليمي',
        comment: 'أفضل حلاق في الرياض بلا منازع، يد طارق خفيفة وتدريجه مسطرة!',
      },
    ],
  },
  {
    id: 'biz-aura-spa',
    name: 'أورا سبا ومساج استرخائي',
    nameEn: 'Aura Luxury Wellness & Spa',
    type: 'SPA',
    audience: 'unisex',
    logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80',
    coverUrls: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.93,
    reviewsCount: 184,
    verified: true,
    description: 'واحة من الهدوء والاسترخاء تقدم جلسات المساج السويدي والتايلندي والعلاجي بأجواء معطرة ومريحة للأعصاب.',
    descriptionEn: 'Sanctuary of peace offering authentic Swedish, Thai, and aromatherapy massage therapies.',
    gracePeriodMins: 15,
    cancellationPolicy: 'إلغاء مجاني حتى 3 ساعات قبل الموعد.',
    subscriptionStatus: 'ACTIVE',
    branches: [
      {
        id: 'br-aura-hittin',
        businessId: 'biz-aura-spa',
        name: 'فرع حطين بوليفارد',
        nameEn: 'Hittin Boulevard Branch',
        address: 'طريق الأمير تركي الأول، حي حطين، الرياض',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        distanceKm: 4.2,
        phone: '+966 11 555 9911',
        workingHours: '11:00 ص - 11:00 م',
        isNearest: true,
        queueActive: false,
        currentQueueCount: 0,
        estimatedWaitMins: 0,
        supportedHomeAreas: ['حطين', 'الملقا', 'النخيل'],
      },
    ],
    services: [
      {
        serviceId: 'ms-relax-massage',
        name: 'مساج استرخائي سويدي (60 دقيقة)',
        nameEn: 'Swedish Relaxation Massage (60m)',
        categoryId: 'spa-massage',
        price: 280,
        homePrice: 380,
        durationMin: 60,
        confirmationMode: 'MANUAL',
        homeServiceAvailable: true,
        popular: true,
      },
    ],
    professionals: [
      {
        id: 'pro-elena',
        name: 'إيلينا كوفاك',
        nameEn: 'Elena Kovac',
        title: 'أخصائية علاج فيزيائي وتدليك استرخائي',
        titleEn: 'Physical Therapist & Masseur',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        rating: 4.97,
        reviewsCount: 94,
        experienceYears: 7,
        languages: ['English', 'العربية'],
        specialties: ['المساج السويدي', 'مساج الأحجار الساخنة', 'إزالة الشد العضلي'],
        businessId: 'biz-aura-spa',
        branchId: 'br-aura-hittin',
        branchName: 'فرع حطين بوليفارد',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'أخصائية علاجية محترفة حاصلة على شهادات أوروبية في العلاج الطبيعي وتدليك الاسترخاء العميق.',
      },
    ],
    reviews: [],
  },
  {
    id: 'biz-sara-freelancer',
    name: 'خبيرة التجميل سارة الدوسري (مستقلة)',
    nameEn: 'Sara Al-Dossari (Freelancer Makeup Artist)',
    type: 'FREELANCER',
    audience: 'women',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    coverUrls: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.98,
    reviewsCount: 89,
    verified: true,
    description: 'ميك اب آرتست مستقلة متخصصة في مكياج العرائس والسهرات الفاخرة، تقدم خدمات منزلية مع كامل المعدات والمنتجات الأصلية.',
    descriptionEn: 'Independent celebrity makeup artist specializing in bridal and glam looks with home service.',
    gracePeriodMins: 20,
    cancellationPolicy: 'إلغاء مجاني حتى 24 ساعة قبل الموعد.',
    subscriptionStatus: 'ACTIVE',
    branches: [
      {
        id: 'br-sara-homeonly',
        businessId: 'biz-sara-freelancer',
        name: 'خدمة منزلية فقط (الرياض)',
        nameEn: 'Home Service Only',
        address: 'الرياض - تغطية كاملة لجميع الأحياء',
        city: 'الرياض',
        country: 'المملكة العربية السعودية',
        distanceKm: 0,
        phone: '+966 55 987 6543',
        workingHours: '01:00 م - 11:00 م',
        isNearest: true,
        queueActive: false,
        currentQueueCount: 0,
        estimatedWaitMins: 0,
        supportedHomeAreas: ['العليا', 'النخيل', 'حطين', 'الملقا', 'الياسمين', 'الصحافة'],
      },
    ],
    services: [
      {
        serviceId: 'ms-glam-makeup',
        name: 'مكياج سهرة كامل مع رموش مينك طبيعية',
        nameEn: 'Luxury Glam Evening Makeup',
        categoryId: 'makeup',
        price: 450,
        homePrice: 450,
        durationMin: 60,
        confirmationMode: 'MANUAL',
        homeServiceAvailable: true,
        popular: true,
      },
    ],
    professionals: [
      {
        id: 'pro-sara-dossari',
        name: 'سارة الدوسري',
        nameEn: 'Sara Al-Dossari',
        title: 'ميك اب آرتست معتمدة',
        titleEn: 'Certified Makeup Artist',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rating: 4.98,
        reviewsCount: 89,
        experienceYears: 6,
        languages: ['العربية', 'English'],
        specialties: ['مكياج عرائس', 'مكياج سهرة ناعم', 'كنتور سينمائي'],
        businessId: 'biz-sara-freelancer',
        branchId: 'br-sara-homeonly',
        branchName: 'الرياض',
        homeServiceAvailable: true,
        status: 'ACTIVE',
        bio: 'شغف بالتجميل وإبراز الجمال الطبيعي باستخدام أشهر البراندات العالمية الأصلية (Dior, Charlotte Tilbury, NARS).',
      },
    ],
    reviews: [],
  },
];

// Active mock bookings showcasing the business rules & states
export const mockBeautyBookings: BeautyBooking[] = [
  {
    id: 'BK-BEAUTY-8821',
    businessId: 'biz-lumiere',
    businessName: 'صالون لوميار لاونج للتجميل',
    businessLogo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    branchId: 'br-lumiere-olaya',
    branchName: 'فرع العليا',
    branchAddress: 'شارع التحلية، حي العليا، الرياض',
    mode: 'IN_BRANCH',
    date: 'اليوم، 16 سبتمبر',
    overallStartTime: '15:30',
    overallEndTime: '17:15',
    totalDurationMin: 105,
    items: [
      {
        id: 'item-1',
        serviceId: 'ms-hair-cut',
        serviceName: 'قص شعر احترافي وتصفيف',
        professionalId: 'pro-sara',
        professionalName: 'سارة الأحمد',
        price: 180,
        durationMin: 45,
        startTime: '15:30',
        endTime: '16:15',
        status: 'SCHEDULED',
      },
      {
        id: 'item-2',
        serviceId: 'ms-manicure-pedicure',
        serviceName: 'مانيكير وباديكير ملكي سبا',
        professionalId: 'pro-layla',
        professionalName: 'ليلى منصور',
        price: 210,
        durationMin: 60,
        startTime: '16:15',
        endTime: '17:15',
        status: 'SCHEDULED',
      },
    ],
    subtotal: 390,
    homeServiceFee: 0,
    tax: 58.5,
    totalAmount: 448.5,
    paymentMethod: 'APPLE_PAY',
    paymentStatus: 'PENDING',
    confirmationMode: 'AUTOMATIC',
    status: 'CONFIRMED',
    gracePeriodMins: 15,
    createdAt: '2026-09-16T11:00:00Z',
    customerName: 'سارة ويليامز',
    customerPhone: '+966 50 123 4567',
  },
  {
    id: 'BK-BEAUTY-8822',
    businessId: 'biz-crown-barber',
    businessName: 'صالون كراون للرجال',
    businessLogo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
    branchId: 'br-crown-malqa',
    branchName: 'فرع الملقا',
    branchAddress: 'شارع أنس بن مالك، حي الملقا',
    mode: 'IN_BRANCH',
    date: 'اليوم، 16 سبتمبر',
    overallStartTime: '18:00',
    overallEndTime: '18:55',
    totalDurationMin: 55,
    items: [
      {
        id: 'item-3',
        serviceId: 'ms-barber-fade',
        serviceName: 'قص شعر فيد مدرج + غسيل',
        professionalId: 'pro-tariq',
        professionalName: 'طارق الدليمي',
        price: 90,
        durationMin: 30,
        startTime: '18:00',
        endTime: '18:30',
        status: 'ASSIGNED',
      },
      {
        id: 'item-4',
        serviceId: 'ms-barber-beard',
        serviceName: 'تحديد لحية بالبخار',
        professionalId: 'pro-tariq',
        professionalName: 'طارق الدليمي',
        price: 70,
        durationMin: 25,
        startTime: '18:30',
        endTime: '18:55',
        status: 'ASSIGNED',
      },
    ],
    subtotal: 160,
    homeServiceFee: 0,
    tax: 24,
    totalAmount: 184,
    paymentMethod: 'CARD_AT_PROVIDER',
    paymentStatus: 'PENDING',
    confirmationMode: 'MANUAL',
    status: 'PENDING_CONFIRMATION',
    confirmationDeadline: 'متبقي 35 دقيقة للرد (قاعدة الـ 25%)',
    gracePeriodMins: 15,
    createdAt: '2026-09-16T13:30:00Z',
    customerName: 'أحمد فهد',
    customerPhone: '+966 55 432 1098',
  },
];

// Active mock live queue tickets
export const mockBeautyQueueTicket: BeautyQueueTicket = {
  id: 'QT-9912',
  ticketNumber: 'B-14',
  businessId: 'biz-lumiere',
  businessName: 'صالون لوميار لاونج للتجميل',
  branchId: 'br-lumiere-olaya',
  branchName: 'فرع العليا',
  customerName: 'سارة ويليامز',
  serviceName: 'استشوار وتسريحة ويفي فخمة',
  professionalName: 'أي أخصائي متاح (Any Professional)',
  position: 3,
  customersAhead: 2,
  estimatedWaitMinutes: 18,
  status: 'WAITING',
  insertedInGap: true,
  gapDetails: 'تم إدراجك بذكاء في فراغ بين موعدين (15:00 - 15:30) دون تأخير المواعيد المحجوزة مسبقاً',
  joinedAt: '14:40',
};

// Customer Beauty CRM Profile
export const mockCustomerBeautyProfile = {
  id: 'usr-sarah',
  name: 'سارة ويليامز',
  skinType: 'مختلطة حساسة',
  hairType: 'متوسط النعومة، معالج بصبغة',
  allergies: ['لا توجد حساسية معروفة لمنتجات الشعر'],
  preferences: {
    favoriteMusic: 'موسيقى كلاسيكية هادئة',
    preferredBeverage: 'قهوة لاتيه بحليب الشوفان',
    notes: 'تفضل عدم استخدام حرارة عالية على أطراف الشعر',
  },
  completedBookingsCount: 6,
  totalSpentSar: 2450,
  cancellationsCount: 0,
  noShowsCount: 0,
  restrictionStatus: 'NONE', // or 'BOOKING_RESTRICTED'
};
