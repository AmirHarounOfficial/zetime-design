import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  MapPin,
  Sparkles,
  Phone,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  mockBeautyQueueTicket,
  beautyBusinesses,
  BeautyQueueTicket,
} from '../../data/beauty-mock-data';

export function BeautyQueueView() {
  const { businessId } = useParams();
  const navigate = useNavigate();

  const business =
    beautyBusinesses.find((b) => b.id === businessId) || beautyBusinesses[0];
  const branch = business.branches[0];

  // Local state for the live queue ticket
  const [ticket, setTicket] = useState<BeautyQueueTicket>(mockBeautyQueueTicket);

  // US-089: Leave Temporarily (TEMPORARILY_AWAY) with retained position
  const handleToggleTemporarilyAway = () => {
    if (ticket.status === 'WAITING') {
      setTicket((prev) => ({
        ...prev,
        status: 'TEMPORARILY_AWAY',
      }));
    } else if (ticket.status === 'TEMPORARILY_AWAY') {
      setTicket((prev) => ({
        ...prev,
        status: 'WAITING',
      }));
    }
  };

  // Simulate calling the customer
  const handleSimulateCall = () => {
    setTicket((prev) => ({
      ...prev,
      status: 'CALLED',
      position: 1,
      customersAhead: 0,
      estimatedWaitMinutes: 0,
    }));
  };

  // Simulate Check-In
  const handleCheckIn = () => {
    setTicket((prev) => ({
      ...prev,
      status: 'CHECKED_IN',
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24" dir="rtl">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#C2D1E8]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#C2D1E8]/50 flex items-center justify-center text-[#2952AB] shadow-sm hover:bg-[#F2F5FB]"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-gray-900 leading-tight">طابور الحضور الذكي</h1>
            <p className="text-[11px] text-gray-500">{business.name} • {branch.name}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-[#C69815] bg-[#FEFBF3] px-2.5 py-1 rounded-full border border-[#FAEFC1]">
          Walk-In مباشر
        </span>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">
        {/* Main Queue Ticket Display (US-088) */}
        <div className="bg-white rounded-[16px] border border-[#C2D1E8]/50 shadow-lg overflow-hidden text-center">
          {/* Header of Ticket */}
          <div className="bg-gradient-to-r from-[#2952AB] to-[#1D3D7A] text-white p-5">
            <span className="text-xs font-medium text-white/80 block">رقم تذكرتك في الطابور</span>
            <div className="text-4xl font-black tracking-widest text-[#FAEFC1] my-1 font-mono">
              {ticket.ticketNumber}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-sm border border-white/20 mt-1">
              {ticket.status === 'WAITING' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  <span>في الانتظار (دورك يقترب)</span>
                </>
              )}
              {ticket.status === 'TEMPORARILY_AWAY' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span>مغادرة مؤقتة (مكانك محفوظ)</span>
                </>
              )}
              {ticket.status === 'CALLED' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" />
                  <span>حان دورك الآن! يرجى التوجه لمكتب الاستقبال</span>
                </>
              )}
              {ticket.status === 'CHECKED_IN' && (
                <>
                  <CheckCircle2 size={14} className="text-green-300" />
                  <span>تم تسجيل وصولك بنجاح</span>
                </>
              )}
            </div>
          </div>

          {/* Ticket Stats Grid */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#F2F5FB] p-3 rounded-[10px] border border-[#C2D1E8]/30">
                <span className="text-[10px] text-gray-500 block">ترتيبك</span>
                <strong className="text-lg font-black text-[#2952AB]">#{ticket.position}</strong>
              </div>
              <div className="bg-[#F2F5FB] p-3 rounded-[10px] border border-[#C2D1E8]/30">
                <span className="text-[10px] text-gray-500 block">أمامك</span>
                <strong className="text-lg font-black text-gray-800">{ticket.customersAhead} عملاء</strong>
              </div>
              <div className="bg-[#FEF8E7] p-3 rounded-[10px] border border-[#FAEFC1]">
                <span className="text-[10px] text-[#8A680F] block">الوقت المتوقع</span>
                <strong className="text-lg font-black text-[#C69815]">~{ticket.estimatedWaitMinutes} دقيقة</strong>
              </div>
            </div>

            {/* Service & Details */}
            <div className="text-right text-xs bg-gray-50 p-3 rounded-[10px] space-y-1.5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">الخدمة المطلوبة:</span>
                <span className="font-bold text-gray-900">{ticket.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الأخصائي:</span>
                <span className="font-bold text-[#2952AB]">{ticket.professionalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">وقت الانضمام:</span>
                <span className="text-gray-700">{ticket.joinedAt}</span>
              </div>
            </div>

            {/* Smart Gap Insertion Feature (US-094, US-096) */}
            {ticket.insertedInGap && (
              <div className="p-3 bg-gradient-to-r from-[#FEF8E7] to-white border border-[#C69815]/30 rounded-[10px] text-right text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#8A680F] font-bold">
                  <Zap size={14} />
                  <span>تقنية إدراج الفراغات الذكية (Calendar Gap Insertion)</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {ticket.gapDetails}
                </p>
              </div>
            )}

            {/* Interactive Actions for the Customer */}
            <div className="space-y-2 pt-1">
              {ticket.status === 'CALLED' ? (
                <button
                  onClick={handleCheckIn}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-[10px] text-xs shadow flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <CheckCircle2 size={16} />
                  <span>تسجيل الوصول للاستقبال (أنا متواجد)</span>
                </button>
              ) : ticket.status === 'CHECKED_IN' ? (
                <div className="p-3 bg-green-50 text-green-700 rounded-[10px] border border-green-200 text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>تم التحقق! سيقوم الأخصائي باستدعائك خلال لحظات</span>
                </div>
              ) : (
                /* US-089 & US-090: Leave Temporarily / Return */
                <button
                  onClick={handleToggleTemporarilyAway}
                  className={`w-full py-3 rounded-[10px] text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                    ticket.status === 'WAITING'
                      ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      : 'bg-[#2952AB] text-white border-[#2952AB]'
                  }`}
                >
                  {ticket.status === 'WAITING' ? (
                    <>
                      <PauseCircle size={16} className="text-orange-500" />
                      <span>مغادرة مؤقتة (سأعود بعد قليل مع حفظ مكاني)</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle size={16} className="text-white" />
                      <span>لقد عدت للصالون (استئناف الطابور)</span>
                    </>
                  )}
                </button>
              )}

              {/* Simulation test button for testing US-091 "Call Customer" */}
              <button
                onClick={handleSimulateCall}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-[8px] text-[11px] font-medium border border-gray-200"
              >
                (تجربة المحاكاة: استدعاء العميل CALLED)
              </button>
            </div>
          </div>
        </div>

        {/* Salon Info & Rules */}
        <div className="bg-white rounded-[14px] p-4 border border-[#C2D1E8]/40 shadow-sm text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Info size={16} className="text-[#2952AB]" />
            <span>قواعد طابور الانتظار (US-086 - US-096)</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px] leading-relaxed">
            <li>في حال تفعيل "مغادرة مؤقتة"، يحفظ دورك في الطابور لمدة 20 دقيقة.</li>
            <li>عند استدعاء رقمك (CALLED)، يرجى التوجه للاستقبال خلال 5 دقائق لتجنب تجاوز الدور.</li>
            <li>يتم تحديث الوقت المتوقع للانتظار ديناميكياً بناءً على سرعة إنهاء الخدمات الجارية.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
