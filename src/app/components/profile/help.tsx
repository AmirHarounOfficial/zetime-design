import { MessageCircle, Phone, Mail, FileText, HelpCircle } from 'lucide-react';
import { SettingsPage } from './settings-page';

export function Help() {
  return (
    <SettingsPage title="Help & Support">
      <div className="space-y-6">
        {/* Contact Support */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Contact Support</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                <MessageCircle size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Live Chat</div>
                <div className="text-xs text-gray-500">Available 24/7</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                <Phone size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Call Support</div>
                <div className="text-xs text-gray-500">+1 (800) 123-4567</div>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                <Mail size={18} className="text-[#2952AB]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Email Support</div>
                <div className="text-xs text-gray-500">support@zetime.com</div>
              </div>
            </button>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30">
          <h3 className="text-sm font-medium text-[#2952AB] mb-3">Resources</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="flex items-center gap-3">
                <HelpCircle size={18} className="text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-900">FAQ</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-900">User Guide</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 hover:bg-[#E4ECF7]/30 rounded-[10px] transition-colors text-left">
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-gray-600" strokeWidth={1.5} />
                <span className="text-sm text-gray-900">Community Forum</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </SettingsPage>
  );
}
