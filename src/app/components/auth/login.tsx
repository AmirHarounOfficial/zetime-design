import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import logoImg from '../../../imports/2I4YuwjtmtIwldnBxuVa7qGkSgzmi4mUBugMn9lm.png';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] flex flex-col font-sans text-right" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-16 pb-8">
        <div className="max-w-md mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-8"
          >
            <img src={logoImg} alt="ZeTime Logo" className="h-24 w-auto" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#2952AB] mb-2"
          >
            تسجيل الدخول
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 px-4"
          >
            مرحبًا بعودتك! سجّل الآن واستمتع بخدماتنا المميزة مرة أخرى.
          </motion.p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[#2952AB]">البريد الالكتروني او رقم الهاتف</Label>
              <div className="relative">
                <Input 
                  placeholder="اكتب البريد الالكتروني" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-[#C2D1E8]/30 h-14 text-right"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#2952AB]">كلمة المرور</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="اكتب كلمة المرور" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-[#C2D1E8]/30 h-14 text-right pl-12"
                  required
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

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#2952AB] font-bold hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] h-14 rounded-xl text-lg font-bold shadow-lg mt-4"
            >
              سجل الان
            </Button>

            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <span className="relative px-4 bg-white text-sm text-gray-400">أو سجل عبر</span>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-14 rounded-xl border-[#C2D1E8]/30 text-gray-700 font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                سجل عبر جوجل
              </Button>

              <p className="text-sm text-gray-500">
                ليس لديك حساب؟{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/signup')} 
                  className="text-[#2952AB] font-bold hover:underline"
                >
                  أنشئ حسابك الآن
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
