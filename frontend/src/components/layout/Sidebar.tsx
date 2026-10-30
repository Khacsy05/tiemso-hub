import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  QrCode, 
  Calculator, 
  Receipt, 
  Coffee, 
  Store, 
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const { 
    mobileMenuOpen, 
    setMobileMenuOpen, 
    setCoffeeModalOpen,
    profile 
  } = useApp();

  const navItems = [
    {
      href: '/',
      label: 'Tạo mã QR',
      icon: QrCode,
      tag: 'Đa năng',
      tagColor: 'bg-purple-50 text-purple-700 border border-purple-200',
      desc: 'VietQR, URL, Văn bản, Ảnh...'
    },
    {
      href: '/phi-san',
      label: 'Tính phí sàn Shopee / TikTok',
      icon: Calculator,
      tag: 'Tài chính',
      tagColor: 'bg-blue-50 text-blue-700 border border-blue-200',
      desc: 'Bóc tách phí, tính giá bán'
    },
    {
      href: '/hoa-don',
      label: 'Tạo hóa đơn bán lẻ nhanh',
      icon: Receipt,
      tag: 'Tiện ích',
      tagColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      desc: 'Bill nhiệt K80, xuất PDF/Zalo'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar (Full White Theme) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  Tiệm Số <span className="text-purple-600">Hub</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                All-in-One Business Toolkit
              </p>
            </div>
          </Link>
        </div>

        {/* Current Active Shop Info Card */}
        <div className="mx-3.5 my-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Cửa hàng đang chọn:</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sẵn sàng
            </span>
          </div>
          <div className="mt-1 font-bold text-slate-900 text-xs truncate">
            {profile.shopName || 'Tiệm Của Bạn'}
          </div>
          <div className="text-[10px] text-slate-500 truncate mt-0.5">
            {profile.bankName} • {profile.accountNo || 'Chưa thiết lập'}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Công Cụ Chính
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full group text-left px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="leading-tight text-[13px]">{item.label}</div>
                    <div
                      className={`text-[10px] font-normal leading-tight mt-0.5 ${
                        isActive ? 'text-purple-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.tag && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.tagColor
                    }`}
                  >
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Coffee CTA in Sidebar */}
        <div className="p-3.5 border-t border-slate-100 space-y-2.5 bg-white">
          <button
            onClick={() => setCoffeeModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Coffee className="w-4 h-4" />
            <span>Mời cà phê tác giả</span>
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
          </button>

          <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Dữ liệu lưu trên máy bạn (LocalStorage), bảo mật 100%.</span>
          </div>
        </div>
      </aside>
    </>
  );
};
