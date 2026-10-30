import React, { useState } from 'react';
import { StaticPageModal, StaticPageType } from '@/components/modals/StaticPageModal';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<StaticPageType>(null);

  return (
    <>
      <footer className="mt-12 border-t border-slate-200 bg-white no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright & Brand */}
            <div className="text-center md:text-left">
              <div className="text-xs font-bold text-slate-900">
                Tiệm Số Hub © {new Date().getFullYear()} — Trợ lý số cho Người kinh doanh & Shop Online.
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Toàn bộ dữ liệu xử lý Client-side trên trình duyệt của bạn, miễn phí trọn đời và tuyệt đối bảo mật.
              </p>
            </div>

            {/* Google AdSense Compliant Static Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-600">
              <button
                onClick={() => setModalType('about')}
                className="hover:text-blue-600 transition-colors"
              >
                Giới thiệu
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-blue-600 transition-colors"
              >
                Chính sách bảo mật
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-blue-600 transition-colors"
              >
                Điều khoản dịch vụ
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setModalType('contact')}
                className="hover:text-blue-600 transition-colors"
              >
                Liên hệ & Hỗ trợ
              </button>
            </div>
          </div>
        </div>
      </footer>

      <StaticPageModal
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </>
  );
};
