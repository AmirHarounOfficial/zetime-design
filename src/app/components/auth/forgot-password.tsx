import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Lock, 
  ArrowRight, 
  Check, 
  ShieldCheck,
  Eye,
  EyeOff
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

export function ForgotPassword() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(107); // 01:47
  
  const [formData, setFormData] = useState({
    identifier: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });

  const passwordRules = [
    { label: 'استخدم علي الاقل حرف كبير', valid: /[A-Z]/.test(formData.password) },
    { label: 'استخدم علي الاقل حرف صغير', valid: /[a-z]/.test(formData.password) },
    { label: 'استخدم علي الاقل رمز', valid: /[^A-Za-z0-9]/.test(formData.password) },
    { label: 'استخدم علي الاقل رقم واحد', valid: /[0-9]/.test(formData.password) },
    { label: 'لا تقل كلمة المرور عن 8 حروف', valid: formData.password.length >= 8 },
  ];

  const isPasswordValid = passwordRules.every(rule => rule.valid);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 2 && timer > 0) {
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

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => {
    if (currentStep === 1) navigate('/login');
    else setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] flex flex-col font-sans text-right" dir="rtl">
      <div className="max-w-md mx-auto w-full px-6 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img src={logoImg} alt="ZeTime" className="h-16 w-auto" />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Forgot Password Request */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="flex justify-start">
                <button onClick={handleBack} className="p-2 -mr-2 text-gray-400 hover:text-[#2952AB]">
                  <ArrowRight size={24} />
                </button>
              </div>

              <div className="flex justify-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                  <Lock size={40} className="text-[#2952AB]" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#2952AB]">هل نسيت كلمة المرور؟</h1>
                <p className="text-gray-600 px-4">
                  قم بادخال رقم الموبايل او البريد الالكتروني لاستقبال كود التحقق لتعيين كلمة سر جديدة
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">رقم الموبايل/البريد الالكتروني</Label>
                  <Input 
                    placeholder="ادخل رقم الموبايل او البريد الالكتروني" 
                    value={formData.identifier}
                    onChange={(e) => handleChange('identifier', e.target.value)}
                    className="bg-white border-[#C2D1E8]/30 h-14 text-right"
                  />
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!formData.identifier}
                  className="w-full bg-[#2952AB] hover:bg-[#1D3D7A] h-14 rounded-xl text-lg font-bold shadow-lg"
                >
                  ارسال
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: OTP Verification */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="flex justify-start">
                <button onClick={handleBack} className="p-2 -mr-2 text-gray-400 hover:text-[#2952AB]">
                  <ArrowRight size={24} />
                </button>
              </div>

              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center">
                  <Lock size={40} className="text-[#C69815]" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#2952AB]">تحقق من رسايلك</h1>
                <p className="text-gray-600">
                  الرجاء إدخال الرمز الذي أرسلناه إلى رقم <span className="font-bold text-[#2952AB]" dir="ltr">*****0112</span> للتحقق من رسايلك
                </p>
              </div>

              <div className="flex justify-center">
                <InputOTP 
                  maxLength={4} 
                  value={formData.otp}
                  onChange={(val) => handleChange('otp', val)}
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

              <div className="space-y-6 text-center">
                <p className="text-sm text-gray-500">
                  إعادة إرسال رمز آخر خلال <span className="text-[#C69815] font-bold">{formatTime(timer)}</span>
                </p>

                <Button 
                  onClick={handleNext}
                  disabled={formData.otp.length !== 4}
                  className="w-full bg-[#2952AB] hover:bg-[#1D3D7A] h-14 rounded-xl text-lg font-bold shadow-lg"
                >
                  تأكيد
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Set New Password */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div className="text-right">
                <h1 className="text-3xl font-bold text-[#2952AB] mb-2">قم بتعيين كلمة المرور الجديدة</h1>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#2952AB]">كلمة المرور</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة المرور" 
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="bg-white border-[#C2D1E8]/30 h-14 text-right pl-12"
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
                  <Label className="text-[#2952AB]">تأكيد كلمة المرور</Label>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="ادخل كلمة المرور مرة اخرى" 
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className="bg-white border-[#C2D1E8]/30 h-14 text-right pl-12"
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

                <Button 
                  onClick={handleNext}
                  disabled={!isPasswordValid || !passwordsMatch}
                  className="w-full bg-[#2952AB] hover:bg-[#1D3D7A] h-14 rounded-xl text-lg font-bold shadow-lg mt-4 disabled:opacity-50"
                >
                  تسجيل الدخول
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success State */}
          {currentStep === 4 && (
            <motion.div 
              key="step4"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8 text-center"
            >
              <div className="flex justify-center mt-8">
                <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative">
                  <ShieldCheck size={64} className="text-green-500" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -left-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
                  >
                    <Check size={20} className="text-white" />
                  </motion.div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl font-bold text-[#2952AB]">تم التحقق من رقم الهاتف بنجاح</h1>
                <p className="text-gray-500">تم تعيين كلمة المرور الجديدة بنجاح، يمكنك الآن تسجيل الدخول.</p>
              </div>

              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-[#2952AB] hover:bg-[#1D3D7A] h-14 rounded-xl text-lg font-bold shadow-lg"
              >
                تسجيل الدخول
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
