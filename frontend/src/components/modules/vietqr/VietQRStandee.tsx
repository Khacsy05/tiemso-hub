import React from 'react';
import { VietQRStandeeTheme } from './types';
import { formatVND } from '@/utils/vietqr';
import { Wifi } from 'lucide-react';

interface VietQRStandeeProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  shopName: string;
  selectedBank: {
    logo: string;
    shortName: string;
  };
  displayQrUrl: string;
  accountNo: string;
  accountName: string;
  amount: number | '';
  includeWifiOnStandee: boolean;
  wifiSsid: string;
  wifiPass: string;
  hotline: string;
  currentTheme: VietQRStandeeTheme;
}

export const VietQRStandee: React.FC<VietQRStandeeProps> = ({
  cardRef,
  shopName,
  selectedBank,
  displayQrUrl,
  accountNo,
  accountName,
  amount,
  includeWifiOnStandee,
  wifiSsid,
  wifiPass,
  hotline,
  currentTheme
}) => {
  const bankLogoUrl = selectedBank.logo.startsWith('http')
    ? `/api/proxy-image?url=${encodeURIComponent(selectedBank.logo)}`
    : selectedBank.logo;

  const qrImageUrl = displayQrUrl.startsWith('http')
    ? `/api/proxy-image?url=${encodeURIComponent(displayQrUrl)}`
    : displayQrUrl;

  return (
    <div
      ref={cardRef}
      className={`relative w-full max-w-[340px] rounded-2xl p-5 flex flex-col items-center justify-between transition-all duration-300 ${currentTheme.card} min-h-[440px]`}
    >
      <div className="w-full text-center space-y-1">
        <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-slate-100 text-slate-900 border border-slate-200">
          {shopName || 'TIỆM CỦA BẠN'}
        </div>
        <h3 className="text-base sm:text-lg font-black tracking-tight leading-tight pt-1">
          QUÉT MÃ ĐỂ THANH TOÁN
        </h3>
        <p className="text-[10px] opacity-75">
          Hỗ trợ tất cả ứng dụng Ngân hàng & Ví điện tử
        </p>
      </div>

      <div className="my-3 p-3 bg-white rounded-2xl shadow-md border border-slate-200 flex flex-col items-center w-full max-w-[260px]">
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <img
            src={bankLogoUrl}
            alt={selectedBank.shortName}
            crossOrigin="anonymous"
            className="h-6 object-contain"
          />
          <span className="text-[11px] font-black text-slate-800">
            {selectedBank.shortName}
          </span>
        </div>

        <div className="w-48 h-48 relative flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt="VietQR"
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full mt-2 text-center text-slate-900 border-t border-slate-100 pt-2">
          <div className="text-[10px] font-semibold text-slate-500 uppercase">
            Số tài khoản:
          </div>
          <div className="font-mono text-sm font-extrabold tracking-wider text-slate-900">
            {accountNo}
          </div>
          <div className="text-xs font-bold text-purple-600 truncate uppercase mt-0.5">
            {accountName}
          </div>
          {typeof amount === 'number' && amount > 0 && (
            <div className="mt-2 py-1 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black inline-block border border-emerald-200">
              Số tiền: {formatVND(amount)}
            </div>
          )}
        </div>
      </div>

      <div className={`w-full rounded-xl p-2.5 text-center text-[10px] space-y-1 ${currentTheme.footerBg}`}>
        {includeWifiOnStandee && wifiSsid && (
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <Wifi className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span>
              Wifi: <strong>{wifiSsid}</strong> | Pass: <code className="font-mono font-bold">{wifiPass}</code>
            </span>
          </div>
        )}
        {hotline && (
          <div className="opacity-80">
            Hotline: <span className="font-bold">{hotline}</span>
          </div>
        )}
      </div>
    </div>
  );
};
