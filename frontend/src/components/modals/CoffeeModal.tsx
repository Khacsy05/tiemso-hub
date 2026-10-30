import React, { useState } from 'react';
import { X, Coffee, Heart, Copy, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getVietQRUrl } from '@/utils/vietqr';

export const CoffeeModal: React.FC = () => {
  const { coffeeModalOpen, setCoffeeModalOpen } = useApp();
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(30000);

  if (!coffeeModalOpen) return null;

  const bin = '970422'; // MB Bank
  const accountNo = '0988888888';
  const accountName = 'TIEM SO HUB';
  const qrUrl = getVietQRUrl(bin, accountNo, 'compact2', selectedAmount, 'Moi ca phe Tiem So Hub', accountName);

  const amounts = [
    { label: '☕ 1 Ly Trà Đá (10k)', val: 10000 },
    { label: '🧋 1 Ly Cà Phê (30k)', val: 30000 },
    { label: '🍕 Bữa Ăn Nhẹ (50k)', val: 50000 },
    { label: '💖 Yêu Thích (100k)', val: 100000 }
  ];

  const handleCopyStk = () => {
    navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-slate-900">
        <button
          onClick={() => setCoffeeModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mb-3 border border-amber-200">
            <Coffee className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold flex items-center justify-center gap-2 text-slate-900">
            Mời tác giả ly Cà phê <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Tiệm Số là dự án cộng đồng miễn phí 100%. Mỗi ly cà phê là nguồn động viên rất lớn để đội ngũ tiếp tục phát triển!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {amounts.map((item) => (
            <button
              key={item.val}
              onClick={() => setSelectedAmount(item.val)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                selectedAmount === item.val
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-amber-400 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
          <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt="VietQR Mời cà phê"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-2">
            Quét mã qua app ngân hàng bất kỳ (NAPAS 24/7)
          </p>
        </div>

        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] text-amber-800 font-bold uppercase">
              MBBank (Ngân hàng Quân Đội)
            </div>
            <div className="font-mono font-bold text-slate-900 text-sm">
              {accountNo}
            </div>
            <div className="text-[11px] text-slate-600">
              Chủ TK: {accountName}
            </div>
          </div>
          <button
            onClick={handleCopyStk}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors shadow-sm text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setCoffeeModalOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
