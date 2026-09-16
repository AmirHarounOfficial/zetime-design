import { ChevronLeft, Package, Home, Car, Building, UtensilsCrossed, Pizza, MapPin, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { BottomNav } from './bottom-nav';

export function NotificationsScreen() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: '1',
      type: 'delivery',
      icon: Package,
      title: 'Delivery Completed',
      message: 'Your parcel has been delivered to 123 Main St',
      time: '5 min ago',
      read: false,
      priority: 'success'
    },
    {
      id: '2',
      type: 'food',
      icon: Pizza,
      title: 'Order is on the way',
      message: 'Your food order from Mario\'s Italian Kitchen is out for delivery',
      time: '15 min ago',
      read: false,
      priority: 'info'
    },
    {
      id: '3',
      type: 'property',
      icon: Building,
      title: 'Booking Reminder',
      message: 'Your property check-in is tomorrow at 3:00 PM',
      time: '2 hours ago',
      read: false,
      priority: 'warning'
    },
    {
      id: '4',
      type: 'restaurant',
      icon: UtensilsCrossed,
      title: 'Reservation Confirmed',
      message: 'Table for 4 at The Grand Restaurant confirmed for tonight 7:00 PM',
      time: '3 hours ago',
      read: true,
      priority: 'success'
    },
    {
      id: '5',
      type: 'service',
      icon: Car,
      title: 'Service Scheduled',
      message: 'Car wash appointment confirmed for Apr 22 at 10:00 AM',
      time: '5 hours ago',
      read: true,
      priority: 'info'
    },
    {
      id: '6',
      type: 'promotion',
      icon: Info,
      title: 'Special Offer',
      message: 'Get 20% off on your next home service booking!',
      time: '1 day ago',
      read: true,
      priority: 'info'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'success':
        return { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' };
      case 'warning':
        return { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' };
      case 'error':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-1">
                <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-[#2952AB]/60">{unreadCount} unread</p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button className="text-sm text-[#2952AB] font-medium hover:text-[#3B6EC9]">
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {/* Today */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            Today
          </h2>

          <div className="space-y-3">
            {notifications.filter((_, idx) => idx < 3).map((notification) => {
              const Icon = notification.icon;
              const colors = getPriorityColors(notification.priority);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-[10px] p-4 shadow-md border transition-all ${
                    notification.read ? 'border-[#C2D1E8]/30' : 'border-[#C69815]/30'
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                      <Icon size={20} className={colors.icon} strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-[#C69815] flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>

                      <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={12} className="mr-1" strokeWidth={1.5} />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Earlier */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
            Earlier
          </h2>

          <div className="space-y-3">
            {notifications.filter((_, idx) => idx >= 3).map((notification) => {
              const Icon = notification.icon;
              const colors = getPriorityColors(notification.priority);

              return (
                <div
                  key={notification.id}
                  className="bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30"
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                      <Icon size={20} className={colors.icon} strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-700 mb-1">
                        {notification.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center text-xs text-gray-400">
                        <Clock size={12} className="mr-1" strokeWidth={1.5} />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
