import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, Check, AlertCircle, 
  ArrowRight, ArrowLeft, Smartphone, Mailbox, Unlock, ShieldCheck,
  ChevronRight, ChevronDown, Globe, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from '../ui/input-otp';
import logoImg from '../../../imports/2I4YuwjtmtIwldnBxuVa7qGkSgzmi4mUBugMn9lm.png';

export function SignUp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(107); // 01:47 in seconds
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    phoneOtp: '',
    emailOtp: ''
  });

  // Password validation rules
  const passwordRules = [
    { label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { label: 'One number', valid: /[0-9]/.test(formData.password) },
    { label: 'One special character', valid: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  const isPasswordValid = passwordRules.every(rule => rule.valid);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((currentStep === 3 || currentStep === 4) && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div 
          key={step}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            step === currentStep 
              ? 'w-8 bg-[#2952AB]' 
              : step < currentStep 
                ? 'w-4 bg-[#2952AB]/40' 
                : 'w-4 bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] overflow-y-auto font-sans text-right" dir="rtl">
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <img src={logoImg} alt="ZeTime Logo" className="h-20 w-auto" />
          </motion.div>
          
          {currentStep < 5 && renderStepIndicator()}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-right">
                <h1 className="text-3xl font-bold text-[#2952AB] mb-2">انشاء حساب</h1>
                <p className="text-gray-600">سجل الأن و احصل علي خدماتنا</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">الاسم الاول</Label>
                  <Input 
                    placeholder="ادخل الاسم الاول" 
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="bg-white border-[#C2D1E8]/30 h-12 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">الاسم الثانى / الاوسط</Label>
                  <Input 
                    placeholder="ادخل الاسم الاوسط" 
                    value={formData.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                    className="bg-white border-[#C2D1E8]/30 h-12 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">الاسم الاخير / العائلة</Label>
                  <Input 
                    placeholder="ادخل اسم العائلة" 
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="bg-white border-[#C2D1E8]/30 h-12 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">البريد الالكتروني</Label>
                  <Input 
                    type="email"
                    placeholder="example@mail.com" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-white border-[#C2D1E8]/30 h-12 text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">رقم الهاتف</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        placeholder="0123456789" 
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="bg-white border-[#C2D1E8]/30 h-12 text-right"
                      />
                    </div>
                    <div className="w-24 bg-white border border-[#C2D1E8]/30 rounded-[10px] flex items-center justify-center gap-1 cursor-pointer">
                      <ChevronDown size={16} className="text-gray-400" />
                      <span className="text-sm">+20</span>
                      <img src="https://flagcdn.com/w20/eg.png" alt="EG" className="w-5 h-auto rounded-sm" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">النوع</Label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white border border-[#C2D1E8]/30 rounded-[10px] h-12 px-4 appearance-none text-right text-sm focus:ring-2 focus:ring-[#C69815]/30 focus:outline-none"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                    >
                      <option value="">اختر النوع</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                    <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] hover:from-[#1D3D7A] hover:to-[#2952AB] h-14 rounded-xl text-lg font-bold shadow-lg mt-4"
              >
                سجل الان
              </Button>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-500">
                  هل لديك حساب بالفعل؟{' '}
                  <button onClick={() => navigate('/login')} className="text-[#2952AB] font-bold">تسجيل دخول</button>
                </p>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <span className="relative px-3 bg-white text-xs text-gray-400">أو سجل عبر</span>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-[#C2D1E8]/30 text-gray-700 font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  سجل عبر جوجل
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Password Creation */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <button onClick={handleBack} className="p-2 -mr-2 text-gray-400 hover:text-[#2952AB] transition-colors">
                <ArrowRight size={24} />
              </button>

              <div className="text-right">
                <h1 className="text-3xl font-bold text-[#2952AB] mb-2">انشاء كلمة مرور</h1>
                <p className="text-gray-600">أضف كلمة مرور لتأمين حسابك</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">كلمة المرور</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور" 
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="bg-white border-[#C2D1E8]/30 h-12 text-right pl-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 bg-blue-50/50 p-4 rounded-xl border border-[#C2D1E8]/20">
                  {passwordRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 justify-end">
                      <span className={`text-xs ${rule.valid ? 'text-green-600 font-medium' : 'text-gray-400'}`}>{rule.label}</span>
                      {rule.valid ? <Check size={14} className="text-green-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-200" />}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-[#2952AB]">تاكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="تأكيد كلمة المرور" 
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="bg-white border-[#C2D1E8]/30 h-12 text-right pl-12"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500 text-right mt-1">كلمات المرور غير متطابقة</p>
                  )}
                </div>
              </div>

              <Button 
                onClick={handleNext}
                disabled={!isPasswordValid || !passwordsMatch}
                className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] hover:from-[#1D3D7A] hover:to-[#2952AB] h-14 rounded-xl text-lg font-bold shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                حفظ كلمة المرور
              </Button>
            </motion.div>
          )}

          {/* STEP 3: Phone OTP Verification */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 text-center"
            >
              <div className="flex justify-start">
                <button onClick={handleBack} className="p-2 -mr-2 text-gray-400 hover:text-[#2952AB] transition-colors">
                  <ArrowRight size={24} />
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#2952AB]/10 rounded-full flex items-center justify-center">
                    <Smartphone size={32} className="text-[#2952AB]" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2952AB] mb-2">تحقق من رسايلك</h1>
                <p className="text-gray-600">
                  الرجاء إدخال الرمز المكون من 4 أرقام المرسل إلى <span className="font-bold text-[#2952AB]" dir="ltr">0112*******</span>
                </p>
              </div>

              <div className="flex justify-center py-4">
                <InputOTP 
                  maxLength={4} 
                  value={formData.phoneOtp}
                  onChange={(val) => handleChange('phoneOtp', val)}
                  containerClassName="flex gap-4"
                >
                  <InputOTPGroup className="gap-4">
                    <InputOTPSlot index={0} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={1} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={2} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={3} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  إعادة إرسال رمز آخر خلال <span className="text-[#C69815] font-bold">{formatTime(timer)}</span>
                </p>
                
                {timer === 0 && (
                  <button onClick={() => setTimer(107)} className="text-[#2952AB] font-bold underline">اعادة الارسال</button>
                )}

                <Button 
                  onClick={handleNext}
                  disabled={formData.phoneOtp.length !== 4}
                  className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] hover:from-[#1D3D7A] hover:to-[#2952AB] h-14 rounded-xl text-lg font-bold shadow-lg disabled:opacity-50"
                >
                  تاكيد
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Email OTP Verification */}
          {currentStep === 4 && (
            <motion.div 
              key="step4"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6 text-center"
            >
              <div className="flex justify-start">
                <button onClick={handleBack} className="p-2 -mr-2 text-gray-400 hover:text-[#2952AB] transition-colors">
                  <ArrowRight size={24} />
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#C69815]/10 rounded-full flex items-center justify-center">
                    <Mail size={32} className="text-[#C69815]" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-3xl font-bold text-[#2952AB] mb-2">تحقق من بريدك الالكترونى</h1>
                <p className="text-gray-600">
                  الرجاء إدخال الرمز المرسل إلى <span className="font-bold text-[#2952AB]" dir="ltr">a****@gmail.com</span>
                </p>
              </div>

              <div className="flex justify-center py-4">
                <InputOTP 
                  maxLength={4} 
                  value={formData.emailOtp}
                  onChange={(val) => handleChange('emailOtp', val)}
                  containerClassName="flex gap-4"
                >
                  <InputOTPGroup className="gap-4">
                    <InputOTPSlot index={0} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={1} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={2} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                    <InputOTPSlot index={3} className="w-16 h-16 text-2xl font-bold rounded-xl border-[#C2D1E8]/40 bg-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-500">
                  إعادة إرسال رمز آخر خلال <span className="text-[#C69815] font-bold">{formatTime(timer)}</span>
                </p>

                <Button 
                  onClick={handleNext}
                  disabled={formData.emailOtp.length !== 4}
                  className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] hover:from-[#1D3D7A] hover:to-[#2952AB] h-14 rounded-xl text-lg font-bold shadow-lg disabled:opacity-50"
                >
                  تاكيد
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Verification Success & Activation */}
          {currentStep === 5 && (
            <motion.div 
              key="step5"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 text-center"
            >
              <div className="flex justify-center mt-8">
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                  >
                    <ShieldCheck size={64} className="text-green-500" />
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -bottom-2 -left-2 w-12 h-12 bg-[#C69815] rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                  >
                    <Check size={24} className="text-white" />
                  </motion.div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold text-[#2952AB] leading-tight">
                  تم التحقق من بريدك الالكترونى و رقم الموبايل بنجاح!
                </h1>
                <p className="text-gray-600 px-6">
                  اضغط علي زر انشئ الحساب لتفعيل حسابك و البدء في استكشاف عالم ZeTime المذهل
                </p>
              </div>

              <Button 
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] hover:from-[#1D3D7A] hover:to-[#2952AB] h-14 rounded-xl text-lg font-bold shadow-lg"
              >
                انشئ الحساب
              </Button>
            </motion.div>
          )}

          {/* STEP 6: Final Success State */}
          {currentStep === 6 && (
            <motion.div 
              key="step6"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 text-center py-12"
            >
              <div className="flex justify-center">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-48 h-48 flex items-center justify-center"
                >
                  <img src={logoImg} alt="ZeTime Success" className="w-full h-auto" />
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2952AB] to-[#C69815]"
                >
                  تم انشاء الحساب بنجاح!
                </motion.h1>
                <p className="text-gray-500">جاري توجيهك إلى الصفحة الرئيسية...</p>
              </div>

              <Button 
                onClick={() => navigate('/')}
                className="px-12 bg-[#2952AB] text-white h-12 rounded-full font-medium"
              >
                اذهب للرئيسية
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#2952AB] via-[#C69815] to-[#2952AB] opacity-20" />
    </div>
  );
}
