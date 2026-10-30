import React from 'react';
import { useRouter } from 'next/router';
import { Menu, Coffee } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const { 
    setMobileMenuOpen, 
    setCoffeeModalOpen,
    profile 
  } = useApp();

  const titles: Record<string, { title: string; desc: string }> = {
    '/': {
      title: 'Tạo mã QR Đa Năng',
      desc: 'Tạo VietQR để bàn, mã URL/Link, Văn bản, Hình ảnh, PDF, Facebook, Wifi...'
    },
    '/phi-san': {
      title: 'Tính phí sàn TMĐT & Định giá bán',
      desc: 'Bóc tách phí Shopee, TikTok Shop, Lazada & Tính tỷ suất lợi nhuận ròng'
    },
    '/hoa-don': {
      title: 'Tạo hóa đơn bán lẻ nhanh',
      desc: 'In bill nhiệt K80 hoặc A5/A4, đính kèm mã QR thanh toán gửi khách Zalo'
    }
  };

  const current = titles[router.pathname] || titles['/'];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-colors no-print">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left: Mobile Toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Mở menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {current.title}
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {current.desc}
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Shop badge (Desktop) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="truncate max-w-[150px]">{profile.shopName}</span>
          </div>

          {/* Buy me a Coffee CTA */}
          <button
            onClick={() => setCoffeeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Ủng hộ tác giả duy trì dự án"
          >
            <Coffee className="w-4 h-4" />
            <span className="hidden sm:inline">Mời cà phê</span>
          </button>
        </div>
      </div>
    </header>
  );
};
