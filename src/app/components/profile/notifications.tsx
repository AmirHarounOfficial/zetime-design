import { useState } from 'react';
import { Bell, Mail, MessageSquare, Package, Calendar } from 'lucide-react';
import { SettingsPage } from './settings-page';

export function Notifications() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    deliveryUpdates: true
  });

  const toggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key as keyof typeof settings] });
  };

  return (
    <SettingsPage title="Notifications">
      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Push Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-600" strokeWidth={1.5} />
                <div>
                  <div className="text-sm text-gray-900">Order Updates</div>
                  <div className="text-xs text-gray-500">Status changes on your orders</div>
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.orderUpdates}
                  onChange={() => toggle('orderUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-gray-600" strokeWidth={1.5} />
                <div>
                  <div className="text-sm text-gray-900">Delivery Updates</div>
                  <div className="text-xs text-gray-500">Real-time delivery tracking</div>
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.deliveryUpdates}
                  onChange={() => toggle('deliveryUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-600" strokeWidth={1.5} />
                <div>
                  <div className="text-sm text-gray-900">Booking Reminders</div>
                  <div className="text-xs text-gray-500">Upcoming appointments</div>
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.bookingReminders}
                  onChange={() => toggle('bookingReminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-gray-600" strokeWidth={1.5} />
                <div>
                  <div className="text-sm text-gray-900">Promotions</div>
                  <div className="text-xs text-gray-500">Special offers and discounts</div>
                </div>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.promotions}
                  onChange={() => toggle('promotions')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Other Channels */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Other Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-900">Email Notifications</span>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => toggle('emailNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-900">SMS Notifications</span>
              </div>
              <label className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => toggle('smsNotifications')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#2952AB] peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </SettingsPage>
  );
}
