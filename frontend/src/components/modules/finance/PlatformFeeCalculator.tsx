import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { formatVND } from '@/utils/vietqr';

export const PlatformFeeCalculator: React.FC = () => {
  const [platform, setPlatform] = useState<'shopee' | 'tiktok' | 'lazada'>('shopee');
  const [sellingPrice, setSellingPrice] = useState<number>(250000);
  const [costPrice, setCostPrice] = useState<number>(120000);
  const [packagingFee, setPackagingFee] = useState<number>(5000);
  const [adsFee, setAdsFee] = useState<number>(20000);
  
  const [useFreeshipXtra, setUseFreeshipXtra] = useState(true);
  const [useVoucherXtra, setUseVoucherXtra] = useState(false);
  const [useAffiliate, setUseAffiliate] = useState(false);
  const [affiliateRate, setAffiliateRate] = useState<number>(5);

  const platformData = {
    shopee: {
      name: 'Shopee',
      paymentFeeRate: 4.0,
      fixedFeeRate: 4.0,
      freeshipRate: 6.0,
      voucherRate: 4.0,
      taxWithheld: 1.5
    },
    tiktok: {
      name: 'TikTok Shop',
      paymentFeeRate: 4.0,
      fixedFeeRate: 5.0,
      freeshipRate: 4.5,
      voucherRate: 0,
      taxWithheld: 1.5
    },
    lazada: {
      name: 'Lazada',
      paymentFeeRate: 3.99,
      fixedFeeRate: 4.0,
      freeshipRate: 5.5,
      voucherRate: 3.0,
      taxWithheld: 1.5
    }
  };

  const currentPlatform = platformData[platform];

  const paymentFee = (sellingPrice * currentPlatform.paymentFeeRate) / 100;
  const fixedFee = (sellingPrice * currentPlatform.fixedFeeRate) / 100;
  const freeshipFee = useFreeshipXtra ? (sellingPrice * currentPlatform.freeshipRate) / 100 : 0;
  const voucherFee = useVoucherXtra ? (sellingPrice * currentPlatform.voucherRate) / 100 : 0;
  const affiliateFee = useAffiliate ? (sellingPrice * affiliateRate) / 100 : 0;
  const taxFee = (sellingPrice * currentPlatform.taxWithheld) / 100;

  const totalPlatformFees = paymentFee + fixedFee + freeshipFee + voucherFee + affiliateFee + taxFee;
  const netReceived = sellingPrice - totalPlatformFees;
  const totalCost = costPrice + packagingFee + adsFee;
  const netProfit = netReceived - totalCost;
  const profitMargin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner (White) */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biểu Phí Sàn TMĐT 2026 Chuẩn Xác</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Bảng Tính Phí Sàn Shopee, TikTok Shop, Lazada
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Bóc tách đầy đủ phí cố định, phí thanh toán, Freeship Xtra và thuế sàn khấu trừ để tính số tiền thực nhận về ví.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Chọn Sàn Thương Mại Điện Tử:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'shopee', name: 'Shopee', badge: 'Phổ biến' },
                { id: 'tiktok', name: 'TikTok Shop', badge: 'KOC / Live' },
                { id: 'lazada', name: 'Lazada', badge: 'Ổn định' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id as any)}
                  className={`py-3 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                    platform === p.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-600/20 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-extrabold">{p.name}</span>
                  <span className="text-[10px] opacity-75">{p.badge}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Giá bán niêm yết trên sàn:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₫</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Giá vốn nhập hàng:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₫</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chi phí đóng gói (Hộp, xốp, băng dính):
                </label>
                <input
                  type="number"
                  value={packagingFee}
                  onChange={(e) => setPackagingFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Chi phí Quảng cáo Ads / Đơn hàng:
                </label>
                <input
                  type="number"
                  value={adsFee}
                  onChange={(e) => setAdsFee(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-700">
                Các gói dịch vụ đăng ký thêm:
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">
                      Gói Freeship Xtra ({currentPlatform.freeshipRate}%)
                    </span>
                    <p className="text-[10px] text-slate-500">Tăng tỷ lệ chốt đơn của khách</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useFreeshipXtra}
                    onChange={(e) => setUseFreeshipXtra(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {platform === 'shopee' && (
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">
                        Gói Voucher Xtra (4.0%)
                      </span>
                      <p className="text-[10px] text-slate-500">Mã giảm giá độc quyền từ sàn</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={useVoucherXtra}
                      onChange={(e) => setUseVoucherXtra(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                )}

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="text-xs">
                    <span className="font-bold text-slate-800">
                      Hoa hồng Affiliate / KOC ({affiliateRate}%)
                    </span>
                    <p className="text-[10px] text-slate-500">Chi trả cho người làm tiếp thị liên kết</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useAffiliate}
                    onChange={(e) => setUseAffiliate(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              Kết Quả Bóc Tách Chi Phí
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-600 text-white shadow-md space-y-2">
              <div className="text-xs font-medium text-emerald-100">
                Thực nhận về ví sau khi trừ hết phí sàn:
              </div>
              <div className="text-2xl font-black tracking-tight">
                {formatVND(netReceived)}
              </div>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Lợi nhuận ròng dự tính:</span>
                <span className="font-black text-sm">
                  {formatVND(netProfit)} ({profitMargin.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Phí thanh toán ({currentPlatform.paymentFeeRate}%):</span>
                <span className="font-bold font-mono text-slate-800">
                  {formatVND(paymentFee)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Phí cố định ({currentPlatform.fixedFeeRate}%):</span>
                <span className="font-bold font-mono text-slate-800">
                  {formatVND(fixedFee)}
                </span>
              </div>
              {useFreeshipXtra && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span>Phí Freeship Xtra:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {formatVND(freeshipFee)}
                  </span>
                </div>
              )}
              {useVoucherXtra && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span>Phí Voucher Xtra:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {formatVND(voucherFee)}
                  </span>
                </div>
              )}
              {useAffiliate && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                  <span>Hoa hồng Affiliate:</span>
                  <span className="font-bold font-mono text-slate-800">
                    {formatVND(affiliateFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
                <span>Thuế sàn giữ lại ({currentPlatform.taxWithheld}%):</span>
                <span className="font-bold font-mono text-slate-800">
                  {formatVND(taxFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-rose-600 font-bold">
                <span>Tổng sàn chiết khấu:</span>
                <span className="font-mono">
                  {formatVND(totalPlatformFees)} ({((totalPlatformFees / sellingPrice) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {netProfit <= 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Cảnh báo lỗ:</strong> Giá bán niêm yết chưa đủ bù chi phí sàn và vốn hàng.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
