import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { SettingsPage } from './settings-page';

export function PersonalInfo() {
  return (
    <SettingsPage title="Personal Information">
      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-white rounded-[10px] p-6 border border-[#C2D1E8]/30 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-semibold">
            SJ
          </div>
          <button className="text-sm text-[#2952AB] font-medium">Change Photo</button>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30 space-y-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-2">
              <User size={14} strokeWidth={1.5} />
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Sarah Johnson"
              className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-2">
              <Mail size={14} strokeWidth={1.5} />
              Email
            </label>
            <input
              type="email"
              defaultValue="sarah.j@email.com"
              className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-2">
              <Phone size={14} strokeWidth={1.5} />
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-2">
              <Calendar size={14} strokeWidth={1.5} />
              Date of Birth
            </label>
            <input
              type="date"
              defaultValue="1990-05-15"
              className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.5} />
              Address
            </label>
            <textarea
              defaultValue="123 Main Street, Apartment 4B, New York, NY 10001"
              className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-4 rounded-[10px] font-medium shadow-lg">
          Save Changes
        </button>
      </div>
    </SettingsPage>
  );
}
