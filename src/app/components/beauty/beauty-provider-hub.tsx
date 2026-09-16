import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Store,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Zap,
  TrendingUp,
  Shield,
  Settings,
  Scissors,
  DollarSign,
  AlertCircle,
  Building,
  UserCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  beautyBusinesses,
  mockBeautyBookings,
  BeautyBooking,
} from '../../data/beauty-mock-data';

export function BeautyProviderHub() {
  const navigate = useNavigate();

  // Active role simulation: Business Owner vs Branch Manager vs Staff vs Freelancer
  const [activeRole, setActiveRole] = useState<'OWNER' | 'MANAGER' | 'STAFF' | 'FREELANCER'>('OWNER');

  // Business context
  const business = beautyBusinesses[0]; // Lumiere Beauty
  const [selectedBranchId, setSelectedBranchId] = useState(business.branches[0].id);
  const currentBranch = business.branches.find((b) => b.id === selectedBranchId) || business.branches[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests' | 'queue' | 'team' | 'catalog'>('schedule');

  // Bookings state in provider hub
  const [bookings, setBookings] = useState<BeautyBooking[]>(mockBeautyBookings);

  // Queue customers list
  const [queueList, setQueueList] = useState([
    { id: 'q-1', ticket: 'B-14', customer: 'سارة ويليامز', service: 'استشوار وتسريحة ويفي', status: 'WAITING', etaMins: 18, isGapInserted: true },
    { id: 'q-2', ticket: 'B-15', customer: 'نورة السالم', service: 'مانيكير كلاسيك', status: 'WAITING', etaMins: 35, isGapInserted: false },
    { id: 'q-3', ticket: 'B-16', customer: 'خلود العتيبي', service: 'تنظيف بشرة سريع', status: 'CALLED', etaMins: 0, isGapInserted: false },
  ]);

  // Walk-in modal
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInService, setWalkInService] = useState('قص شعر احترافي وتصفيف');
  const [insertInGap, setInsertInGap] = useState(true);

  // Staff Permissions Matrix (US-029)
  const [permissions, setPermissions] = useState({
    canManageAppointments: true,
    canManageQueue: true,
    canViewRevenue: activeRole === 'OWNER',
    canEditCatalog: activeRole === 'OWNER',
    canTransferStaff: activeRole === 'OWNER',
  });

  // Actions for Pending Bookings (US-058, US-059)
  const handleAcceptBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CONFIRMED' } : b))
    );
  };

  const handleRejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED_BY_PROVIDER' } : b))
    );
  };

  // Queue actions (US-091, US-092)
  const handleCallQueue = (id: string) => {
    setQueueList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'CALLED' } : q))
    );
  };

  const handleCompleteQueue = (id: string) => {
    setQueueList((prev) => prev.filter((q) => q.id !== id));
  };

  // Add Walk-in (US-083, US-094)
  const handleAddWalkIn = () => {
    if (!walkInName.trim()) return;
    const nextTicketNum = `B-${queueList.length + 17}`;
    setQueueList((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        ticket: nextTicketNum,
        customer: walkInName,
        service: walkInService,
        status: 'WAITING',
        etaMins: insertInGap ? 12 : 45,
        isGapInserted: insertInGap,
      },
    ]);
    setWalkInName('');
    setShowWalkInModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#1D3D7A] to-[#2952AB] text-white px-4 pt-10 pb-5 sticky top-0 z-30 shadow-md">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link
                to="/module/beauty"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft size={18} className="rotate-180" />
              </Link>
              <div>
                <h1 className="font-bold text-base leading-tight">بوابة إدارة صالونات ZeTime</h1>
                <p className="text-[11px] text-[#FAEFC1]">ZeTime Beauty Provider & Business Portal</p>
              </div>
            </div>

            {/* Back to Customer Experience button */}
            <Link
              to="/module/beauty"
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#FAEFC1] rounded-[6px] text-xs font-bold border border-white/20"
            >
              عرض العميل &larr;
            </Link>
          </div>

          {/* Role Switcher Toolbar (US-027, US-028, US-029) */}
          <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-[10px] text-xs mb-3">
            <span className="text-[10px] text-white/70 mr-1">الصلاحية:</span>
            <div className="flex gap-1">
              {[
                { id: 'OWNER', label: 'المالك' },
                { id: 'MANAGER', label: 'مدير فرع' },
                { id: 'STAFF', label: 'موظف' },
                { id: 'FREELANCER', label: 'مستقل' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id as any);
                    setPermissions((prev) => ({
                      ...prev,
                      canViewRevenue: role.id === 'OWNER',
                      canEditCatalog: role.id === 'OWNER',
                      canTransferStaff: role.id === 'OWNER',
                    }));
                  }}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-all ${
                    activeRole === role.id ? 'bg-[#C69815] text-white shadow' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business & Branch Selector */}
          <div className="flex items-center justify-between text-xs text-white/90">
            <div className="flex items-center gap-1.5">
              <Store size={14} className="text-[#C69815]" />
              <span className="font-bold">{business.name}</span>
            </div>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-white/15 border border-white/20 rounded px-2 py-0.5 text-xs text-white"
            >
              {business.branches.map((b) => (
                <option key={b.id} value={b.id} className="text-gray-900">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Quick KPI Dashboard (US-158, US-160) */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white p-2.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs">
            <span className="text-[10px] text-gray-500 block">مواعيد اليوم</span>
            <strong className="text-sm font-black text-[#2952AB]">14</strong>
          </div>
          <div className="bg-white p-2.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs">
            <span className="text-[10px] text-gray-500 block">في الطابور</span>
            <strong className="text-sm font-black text-[#C69815]">{queueList.length}</strong>
          </div>
          <div className="bg-white p-2.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs">
            <span className="text-[10px] text-gray-500 block">بانتظار قبول</span>
            <strong className="text-sm font-black text-orange-600">
              {bookings.filter((b) => b.status === 'PENDING_CONFIRMATION').length}
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs">
            <span className="text-[10px] text-gray-500 block">دخل اليوم</span>
            <strong className="text-sm font-black text-green-700">
              {permissions.canViewRevenue ? '2,840 ر.س' : '***'}
            </strong>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C2D1E8]/40 bg-white rounded-[10px] p-1 shadow-2xs text-xs font-bold text-gray-600">
          {[
            { id: 'schedule', label: 'جدول اليوم' },
            { id: 'requests', label: 'الطلبات المعلقة' },
            { id: 'queue', label: 'الطابور الذكي' },
            { id: 'team', label: 'فريق العمل' },
            { id: 'catalog', label: 'الخدمات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-center rounded-[8px] transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2952AB] text-white shadow-xs'
                  : 'hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Today's Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-xs text-gray-900">المواعيد المجدولة لفرع {currentBranch.name}</h3>
              <span className="text-[11px] text-gray-500">اليوم، 16 سبتمبر</span>
            </div>

            <div className="space-y-2.5">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="font-bold text-xs text-gray-900">{b.customerName}</span>
                      <span className="text-[11px] text-gray-400">({b.customerPhone})</span>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#2952AB]">
                      {b.overallStartTime} - {b.overallEndTime}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-[8px]">
                    {b.items.map((it) => (
                      <div key={it.id} className="flex justify-between py-0.5">
                        <span>• {it.serviceName} ({it.durationMin}د)</span>
                        <span className="font-semibold text-gray-800">الأخصائي: {it.professionalName}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[11px] text-gray-500">
                      طريقة الدفع: {b.paymentMethod === 'APPLE_PAY' ? 'Apple Pay' : 'نقداً / شبكة'}
                    </span>
                    <span className="font-bold text-green-700">{b.totalAmount} ر.س</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Pending Requests & 25% Deadline Rule (US-056, US-057, US-058) */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#FEFBF3] border border-[#FAEFC1] rounded-[10px] text-xs text-[#6C510C] flex items-start gap-2">
              <Clock size={16} className="text-[#C69815] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">قاعدة مهلة الـ 25% للحجوزات (US-057):</strong>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  يتعين على الصالون قبول أو رفض الحجز قبل انتهاء ربع المدة المتبقية حتى الموعد لتجنب الإلغاء التلقائي.
                </p>
              </div>
            </div>

            {bookings
              .filter((b) => b.status === 'PENDING_CONFIRMATION')
              .map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-[14px] border border-orange-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{b.customerName}</h4>
                      <span className="text-[11px] text-gray-500">{b.date} في {b.overallStartTime}</span>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">
                      {b.confirmationDeadline || 'متبقي 35 دقيقة'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-[8px] text-xs space-y-1">
                    {b.items.map((it) => (
                      <div key={it.id} className="flex justify-between">
                        <span>{it.serviceName}</span>
                        <span className="text-gray-500">{it.price} ر.س</span>
                      </div>
                    ))}
                    <div className="pt-1 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                      <span>الإجمالي:</span>
                      <span className="text-[#2952AB]">{b.totalAmount} ر.س</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAcceptBooking(b.id)}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-[8px] text-xs font-bold shadow-xs flex items-center justify-center gap-1 active:scale-95"
                    >
                      <CheckCircle2 size={14} />
                      <span>قبول الحجز (US-058)</span>
                    </button>
                    <button
                      onClick={() => handleRejectBooking(b.id)}
                      className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-[8px] text-xs font-bold hover:bg-red-50 active:scale-95"
                    >
                      رفض مع سبب
                    </button>
                  </div>
                </div>
              ))}

            {bookings.filter((b) => b.status === 'PENDING_CONFIRMATION').length === 0 && (
              <div className="text-center py-8 text-gray-400 text-xs">
                لا توجد طلبات حجز معلقة حالياً
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Smart Queue Management & Walk-In Gap Insertion (US-083, US-091, US-094) */}
        {activeTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-gray-900">طابور الحضور السريع المباشر</h3>
                <p className="text-[10px] text-gray-500">استدعاء العملاء وإدراج الزوار في فراغات المواعيد</p>
              </div>
              <button
                onClick={() => setShowWalkInModal(true)}
                className="px-3 py-1.5 bg-[#2952AB] text-white rounded-[8px] text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#1D3D7A]"
              >
                <Plus size={14} />
                <span>إضافة زائر Walk-In</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {queueList.map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F2F5FB] text-[#2952AB] font-black flex items-center justify-center font-mono border border-[#C2D1E8]/40">
                      {q.ticket}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900">{q.customer}</span>
                        {q.isGapInserted && (
                          <span className="text-[9px] bg-[#FEF8E7] text-[#8A680F] border border-[#FAEFC1] px-1.5 py-0.2 rounded font-bold">
                            فراغ جدول ⚡
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 block">{q.service}</span>
                      <span className="text-[10px] text-[#2952AB]">
                        {q.status === 'CALLED' ? 'تم استدعاء العميل الآن' : `انتظار ~${q.etaMins} دقيقة`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {q.status === 'WAITING' ? (
                      <button
                        onClick={() => handleCallQueue(q.id)}
                        className="px-3 py-1.5 bg-[#C69815] hover:bg-[#A88012] text-white rounded-[6px] text-xs font-bold shadow-xs active:scale-95"
                      >
                        استدعاء (Call)
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCompleteQueue(q.id)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-[6px] text-xs font-bold shadow-xs active:scale-95"
                      >
                        بدء الخدمة
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Team & Staff Permissions (US-027 - US-034) */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-gray-900">طاقم العمل وتوزيع الصلاحيات</h3>
              {permissions.canTransferStaff && (
                <button className="text-xs text-[#2952AB] font-bold hover:underline">
                  + إضافة أخصائي جديد
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {business.professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white p-3.5 rounded-[12px] border border-[#C2D1E8]/40 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.photoUrl}
                      alt={pro.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{pro.name}</h4>
                      <p className="text-[11px] text-[#2952AB]">{pro.title}</p>
                      <span className="text-[10px] text-gray-500">{pro.branchName}</span>
                    </div>
                  </div>

                  {permissions.canTransferStaff ? (
                    <button className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-bold">
                      نقل فرع (Transfer)
                    </button>
                  ) : (
                    <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">
                      نشط
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Permission Toggles for Management (US-029) */}
            {activeRole === 'OWNER' && (
              <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                  <Shield size={16} className="text-[#2952AB]" />
                  <span>مصفوفة صلاحيات الموظفين (Role & Permissions US-029)</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { key: 'canManageAppointments', label: 'إدارة وتأكيد المواعيد' },
                    { key: 'canManageQueue', label: 'التحكم في طابور الانتظار واستدعاء العملاء' },
                    { key: 'canViewRevenue', label: 'عرض تقارير الإيرادات والمبالغ المالية' },
                    { key: 'canEditCatalog', label: 'تعديل أسعار وخدمات الفرع' },
                    { key: 'canTransferStaff', label: 'نقل الأخصائيين بين الفروع' },
                  ].map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-700">{perm.label}</span>
                      <input
                        type="checkbox"
                        checked={(permissions as any)[perm.key]}
                        onChange={(e) =>
                          setPermissions((prev) => ({ ...prev, [perm.key]: e.target.checked }))
                        }
                        className="w-4 h-4 accent-[#2952AB] rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Master Catalog Configuration (US-037, US-038) */}
        {activeTab === 'catalog' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-gray-900">خدمات الفرع من الكتالوج المعتمد</h3>
              <span className="text-[11px] text-gray-500">ZeTime Master Services</span>
            </div>

            <div className="space-y-2">
              {business.services.map((srv) => (
                <div
                  key={srv.serviceId}
                  className="bg-white p-3 rounded-[10px] border border-[#C2D1E8]/40 shadow-xs flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-gray-900">{srv.name}</h4>
                    <span className="text-[10px] text-gray-500">
                      {srv.durationMin} دقيقة • تأكيد {srv.confirmationMode === 'AUTOMATIC' ? 'فوري' : 'يدوي'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2952AB]">{srv.price} ر.س</span>
                    <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold">
                      مفعل
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Walk-in Modal (US-083, US-094) */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-sm p-5 space-y-3 text-right">
            <h3 className="font-bold text-sm text-gray-900">تسجيل زائر فوري (Walk-In)</h3>
            <p className="text-xs text-gray-500">أدخل اسم العميل والخدمة المطلوبة لإدراجه في الطابور:</p>
            <input
              type="text"
              placeholder="اسم العميل..."
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded text-xs"
            />
            <select
              value={walkInService}
              onChange={(e) => setWalkInService(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 p-2 rounded text-xs"
            >
              {business.services.map((s) => (
                <option key={s.serviceId} value={s.name}>
                  {s.name} ({s.durationMin}د)
                </option>
              ))}
            </select>

            {/* Gap Insertion Toggle (US-094) */}
            <div className="p-2.5 bg-[#FEFBF3] border border-[#FAEFC1] rounded-[8px] text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#8A680F]">
                <input
                  type="checkbox"
                  checked={insertInGap}
                  onChange={(e) => setInsertInGap(e.target.checked)}
                  className="accent-[#C69815]"
                />
                <span>إدراج في الفراغات المتاحة بين المواعيد (Gap Insertion)</span>
              </label>
              <p className="text-[10px] text-gray-500 mt-1">
                تحديد هذا الخيار يمنح الزائر أولوية الدخول في أي وقت فراغ مدته كافية قبل الموعد القادم.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddWalkIn}
                className="flex-1 py-2.5 bg-[#2952AB] text-white text-xs font-bold rounded-[8px]"
              >
                إضافة للتذكرة
              </button>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-[8px]"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
