import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ArrowRight, 
  LayoutGrid, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import logoImg from '../../imports/2I4YuwjtmtIwldnBxuVa7qGkSgzmi4mUBugMn9lm.png';

const slides = [
  {
    id: 1,
    title: 'مرحباً بك في ZeTime',
    subtitle: 'كل ما تحتاجه في تطبيق واحد',
    description: 'استكشف عالمًا من الخدمات المتكاملة التي تلبي جميع احتياجاتك اليومية بكل سهولة وأمان.',
    icon: <Zap className="w-16 h-16 text-[#C69815]" />,
    color: '#2952AB',
    bg: 'from-[#F2F5FB] to-white'
  },
  {
    id: 2,
    title: 'خدمات متنوعة بلا حدود',
    subtitle: 'من الطعام إلى العقارات',
    description: 'سواء كنت ترغب في طلب طعام، شحن طرد، أو استئجار عقار، نحن هنا لخدمتك على مدار الساعة.',
    icon: <LayoutGrid className="w-16 h-16 text-[#2952AB]" />,
    color: '#C69815',
    bg: 'from-[#FEFBF3] to-white'
  },
  {
    id: 3,
    title: 'أمان وثقة تامة',
    subtitle: 'مزودي خدمات موثوقين',
    description: 'نحن نضمن لك جودة الخدمات وأمان التعاملات مع نظام تتبع مباشر ودعم فني متواصل.',
    icon: <ShieldCheck className="w-16 h-16 text-green-500" />,
    color: '#2952AB',
    bg: 'from-[#F2F5FB] to-white'
  }
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    navigate('/signup');
  };

  const slide = slides[currentSlide];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${slide.bg} flex flex-col items-center overflow-hidden font-sans`} dir="rtl">
      {/* Skip Button */}
      <div className="w-full flex justify-end p-6">
        {currentSlide < slides.length - 1 && (
          <button 
            onClick={handleSkip}
            className="text-[#2952AB] font-bold text-sm hover:opacity-70 transition-opacity"
          >
            تخطي
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="flex flex-col items-center text-center w-full"
          >
            {/* Visual Element */}
            <div className="relative mb-12">
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 rounded-[40px] bg-white shadow-2xl shadow-blue-200/50 flex items-center justify-center relative z-10"
              >
                {slide.icon}
              </motion.div>
              
              {/* Decorative Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#2952AB]/5 rounded-full animate-ping" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#2952AB]/5 rounded-full" />
            </div>

            {/* Text Content */}
            <div className="space-y-4 mb-12">
              <h1 className="text-3xl font-extrabold text-[#2952AB]">
                {slide.title}
              </h1>
              <h2 className="text-xl font-bold text-[#C69815]">
                {slide.subtitle}
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="w-full max-w-md px-8 pb-12">
        <div className="flex flex-col items-center gap-8">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-[#2952AB]' : 'w-2 bg-[#2952AB]/20'
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          <div className="w-full space-y-4">
            <Button 
              onClick={handleNext}
              className="w-full h-14 bg-[#2952AB] hover:bg-[#1D3D7A] rounded-2xl text-lg font-bold shadow-xl shadow-blue-500/20 group"
            >
              {currentSlide === slides.length - 1 ? (
                <span className="flex items-center gap-2">
                  ابدأ الآن <CheckCircle2 size={20} />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  التالي <ArrowRight size={20} className="rotate-180" />
                </span>
              )}
            </Button>

            {currentSlide === slides.length - 1 && (
              <Button 
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full h-12 text-[#2952AB] font-bold hover:bg-[#2952AB]/5 rounded-2xl"
              >
                الدخول كزائر
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Logo Branding */}
      <div className="pb-6 opacity-20">
        <img src={logoImg} alt="ZeTime" className="h-8 w-auto grayscale" />
      </div>
    </div>
  );
}
