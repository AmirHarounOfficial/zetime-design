import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { SettingsPage } from './settings-page';

export function PaymentMethods() {
  const paymentMethods = [
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ];

  return (
    <SettingsPage title="Payment Methods">
      <div className="space-y-4">
        {/* Payment Cards */}
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white rounded-[10px] p-4 border border-[#C2D1E8]/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E4ECF7] to-[#FEF8E7] rounded-[10px] flex items-center justify-center">
                  <CreditCard size={20} className="text-[#2952AB]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {method.type} •••• {method.last4}
                  </div>
                  <div className="text-sm text-gray-500">Expires {method.expiry}</div>
                  {method.isDefault && (
                    <span className="inline-block bg-gradient-to-r from-[#C69815] to-[#A88012] text-white text-xs px-2 py-0.5 rounded-full mt-1">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <button className="p-2 hover:bg-red-50 rounded-[10px] transition-colors">
                <Trash2 size={18} className="text-red-600" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="w-full bg-white border-2 border-dashed border-[#C2D1E8] rounded-[10px] p-4 text-[#2952AB] hover:border-[#C69815] transition-colors">
          <div className="flex items-center justify-center gap-2">
            <Plus size={20} strokeWidth={1.5} />
            <span className="font-medium">Add Payment Method</span>
          </div>
        </button>
      </div>
    </SettingsPage>
  );
}
