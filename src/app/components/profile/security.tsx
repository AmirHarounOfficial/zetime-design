import { Lock, Smartphone, Shield, Eye } from 'lucide-react';
import { SettingsPage } from './settings-page';

export function Security() {
  return (
    <SettingsPage title="Password & Security">
      <div className="space-y-6">
        {/* Change Password */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Change Password</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 bg-[#E4ECF7]/30 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#C69815]/30"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-[#2952AB] to-[#3B6EC9] text-white py-3 rounded-[10px] font-medium">
              Update Password
            </button>
          </div>
        </div>

        {/* Security Options */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Security Options</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors">
              <div className="flex items-center gap-3">
                <Smartphone size={18} className="text-gray-600" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-sm text-gray-900">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500">Add extra security layer</div>
                </div>
              </div>
              <span className="text-xs text-gray-400">Not enabled</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-600" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-sm text-gray-900">Login Activity</div>
                  <div className="text-xs text-gray-500">View recent login history</div>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-gray-600" strokeWidth={1.5} />
                <div className="text-left">
                  <div className="text-sm text-gray-900">Privacy Settings</div>
                  <div className="text-xs text-gray-500">Manage data visibility</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </SettingsPage>
  );
}
