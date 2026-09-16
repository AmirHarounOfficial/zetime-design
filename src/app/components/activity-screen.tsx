import { ChevronLeft, Home, Car, Navigation, Building, UtensilsCrossed, Pizza, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { activityHistory } from '../data/mock-data';
import { BottomNav } from './bottom-nav';

const moduleIconMap: Record<string, any> = {
  'home-services': Home,
  'car-services': Car,
  'street-assistant': Navigation,
  'property-rental': Building,
  'restaurant-tables': UtensilsCrossed,
  'food-delivery': Pizza,
  'parcel-delivery': Package,
  'beauty': Sparkles,
};

const moduleColorMap: Record<string, string> = {
  'home-services': '#2952AB',
  'car-services': '#3B6EC9',
  'street-assistant': '#1D3D7A',
  'property-rental': '#7A9ACB',
  'restaurant-tables': '#2F0909',
  'food-delivery': '#D4A3A3',
  'parcel-delivery': '#2952AB',
  'beauty': '#C69815',
};

export function ActivityScreen() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          label: 'Confirmed'
        };
      case 'in-progress':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          label: 'In Progress'
        };
      case 'completed':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: 'Completed'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          label: status
        };
    }
  };

  // Group activities by date
  const groupedActivities = activityHistory.reduce((acc, activity) => {
    if (!acc[activity.date]) {
      acc[activity.date] = [];
    }
    acc[activity.date].push(activity);
    return acc;
  }, {} as Record<string, typeof activityHistory>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-[#F2F5FB] px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30 sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1">
              <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Activity</h1>
              <p className="text-sm text-[#2952AB]/60">All your bookings & orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {Object.entries(groupedActivities).map(([date, activities]) => (
          <div key={date} className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-[#2952AB]/60 px-1 mb-3">
              {date}
            </h2>
            
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = moduleIconMap[activity.module];
                const iconColor = moduleColorMap[activity.module];
                const statusBadge = getStatusBadge(activity.status);

                const getActivityRoute = () => {
                  if (activity.module === 'food-delivery') return `/activity/food-delivery/${activity.id}`;
                  if (activity.module === 'property-rental') return `/activity/property-rental/${activity.id}`;
                  if (activity.module === 'parcel-delivery') return `/activity/parcel-delivery/${activity.id}`;
                  if (activity.module === 'car-services') return `/activity/car-service/${activity.id}`;
                  if (activity.module === 'restaurant-tables') return `/activity/restaurant-reservation/${activity.id}`;
                  if (activity.module === 'beauty') return `/activity/beauty/${activity.id}`;
                  return '#';
                };

                return (
                  <Link
                    key={activity.id}
                    to={getActivityRoute()}
                    className="block bg-white rounded-[10px] p-4 shadow-md border border-[#C2D1E8]/30 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div 
                        className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 border shadow-sm"
                        style={{ 
                          backgroundColor: `${iconColor}08`,
                          borderColor: `${iconColor}20`
                        }}
                      >
                        <Icon size={20} style={{ color: iconColor }} strokeWidth={1.5} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{activity.title}</h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 border ${statusBadge.bg} ${statusBadge.text}`}
                            style={{ borderColor: statusBadge.text === 'text-green-600' ? '#86efac' : statusBadge.text === 'text-orange-600' ? '#fdba74' : '#d1d5db' }}
                          >
                            {statusBadge.label}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">
                          {activity.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">{activity.time}</span>
                          {activity.amount && activity.amount !== '$0.00' && (
                            <span className="font-medium text-gray-900">{activity.amount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}