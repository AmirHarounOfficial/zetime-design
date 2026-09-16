import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../bottom-nav';

interface SettingsPageProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsPage({ title, children }: SettingsPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F5FB] via-white to-[#FEFBF3] pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 border-b border-[#C2D1E8]/30">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft size={24} className="text-[#2952AB]" strokeWidth={1.5} />
          </button>
          <h1 className="font-medium text-[#2952AB]">{title}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        {children}
      </div>

      <BottomNav />
    </div>
  );
}
