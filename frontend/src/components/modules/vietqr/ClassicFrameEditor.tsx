import React, { useState } from 'react';
import {
  ClassicFrameType,
  ClassicSubTab,
  PresetType,
  QRErrorLevel,
  QRBodyShape,
  QROuterEyeShape,
  QRInnerEyeShape
} from './types';
import { PRESET_LOGOS } from './presetLogos';
import { Sparkles, ChevronDown, Upload, X, Info } from 'lucide-react';

interface ClassicFrameEditorProps {
  classicSubTab: ClassicSubTab;
  setClassicSubTab: (tab: ClassicSubTab) => void;
  errorCorrectionLevel: QRErrorLevel;
  setErrorCorrectionLevel: (lvl: QRErrorLevel) => void;
  frameType: ClassicFrameType;
  setFrameType: (type: ClassicFrameType) => void;
  frameBorderColor: string;
  setFrameBorderColor: (c: string) => void;
  frameBgColor: string;
  setFrameBgColor: (c: string) => void;
  isTransparentBg: boolean;
  setIsTransparentBg: (val: boolean) => void;
  frameText: string;
  setFrameText: (text: string) => void;
  frameTextColor: string;
  setFrameTextColor: (c: string) => void;
  frameFontFamily: string;
  setFrameFontFamily: (font: string) => void;
  framePreset: PresetType;
  setFramePreset: (preset: PresetType) => void;
  // State mới cho Hình dạng (Shape)
  bodyShape: QRBodyShape;
  setBodyShape: (s: QRBodyShape) => void;
  outerEyeShape: QROuterEyeShape;
  setOuterEyeShape: (s: QROuterEyeShape) => void;
  innerEyeShape: QRInnerEyeShape;
  setInnerEyeShape: (s: QRInnerEyeShape) => void;
  bodyColor: string;
  setBodyColor: (c: string) => void;
  outerEyeColor: string;
  setOuterEyeColor: (c: string) => void;
  innerEyeColor: string;
  setInnerEyeColor: (c: string) => void;
  setQrDotsColor: (c: string) => void;
  setQrCornerColor: (c: string) => void;
  // State mới cho Logo giữa
  centerLogoUrl: string;
  setCenterLogoUrl: (url: string) => void;
  centerLogoSizePercent: number;
  setCenterLogoSizePercent: (pct: number) => void;
  centerLogoHasBg: boolean;
  setCenterLogoHasBg: (hasBg: boolean) => void;
}

export const ClassicFrameEditor: React.FC<ClassicFrameEditorProps> = ({
  classicSubTab,
  setClassicSubTab,
  errorCorrectionLevel,
  setErrorCorrectionLevel,
  frameType,
  setFrameType,
  frameBorderColor,
  setFrameBorderColor,
  frameBgColor,
  setFrameBgColor,
  isTransparentBg,
  setIsTransparentBg,
  frameText,
  setFrameText,
  frameTextColor,
  setFrameTextColor,
  frameFontFamily,
  setFrameFontFamily,
  framePreset,
  setFramePreset,
  bodyShape,
  setBodyShape,
  outerEyeShape,
  setOuterEyeShape,
  innerEyeShape,
  setInnerEyeShape,
  bodyColor,
  setBodyColor,
  outerEyeColor,
  setOuterEyeColor,
  innerEyeColor,
  setInnerEyeColor,
  setQrDotsColor,
  setQrCornerColor,
  centerLogoUrl,
  setCenterLogoUrl,
  centerLogoSizePercent,
  setCenterLogoSizePercent,
  centerLogoHasBg,
  setCenterLogoHasBg
}) => {
  const [showAllLogos, setShowAllLogos] = useState<boolean>(false);

  // Giới hạn max kích thước logo an toàn theo cấp độ sửa lỗi
  const maxSafeSize =
    errorCorrectionLevel === 'H'
      ? 28
      : errorCorrectionLevel === 'Q'
      ? 22
      : errorCorrectionLevel === 'M'
      ? 18
      : 14;

  const handleUploadLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCenterLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* 4 Tab con & Nút Đặt lại */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'frame' as ClassicSubTab, label: 'Khung' },
            { id: 'shape' as ClassicSubTab, label: 'Hình dạng' },
            { id: 'logo' as ClassicSubTab, label: 'Logo' },
            { id: 'level' as ClassicSubTab, label: 'Cấp độ' }
          ].map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setClassicSubTab(sub.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                classicSubTab === sub.id
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorCorrectionLevel('Q');
            setFrameType('none');
            setFrameBorderColor('#475569');
            setFrameBgColor('#ffffff');
            setIsTransparentBg(false);
            setFrameText('QUÉT TÔI ĐI');
            setFrameTextColor('#ffffff');
            setFramePreset('none');
            setBodyShape('square');
            setOuterEyeShape('square');
            setInnerEyeShape('square');
            setBodyColor('#000000');
            setOuterEyeColor('#000000');
            setInnerEyeColor('#000000');
            setQrDotsColor('#000000');
            setQrCornerColor('#000000');
            setCenterLogoUrl('');
            setCenterLogoSizePercent(20);
            setCenterLogoHasBg(true);
          }}
          className="text-xs text-slate-500 hover:text-purple-600 font-semibold flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* TAB [KHUNG] */}
      {classicSubTab === 'frame' && (
        <div className="space-y-6">
          {/* PHẦN 1: MẪU SẴN CÓ */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Mẫu Sẵn Có</label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setFramePreset('none');
                  setFrameType('none');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameBgColor('#ffffff');
                  setFrameBorderColor('#475569');
                }}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'none' && frameType === 'none'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xl text-slate-400 font-light">✕</span>
              </button>

              {/* Nón bảo hộ vàng */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('safety-hat');
                  setFrameType('none'); // Không chọn khung khác
                  setFrameBgColor('#ffffff');
                  setFrameBorderColor('#581c87');
                  setQrDotsColor('#581c87');
                  setQrCornerColor('#eab308');
                  setFrameText('CÔNG TRÌNH');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'safety-hat'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-amber-50/40'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <span className="text-xl leading-none">⛑️</span>
                <span className="text-[9px] font-black text-amber-700 mt-1">Nón vàng</span>
              </button>

              {/* Cam ấm */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('orange-floral');
                  setFrameType('none'); // Không chọn khung khác
                  setFrameBgColor('#fff7ed');
                  setFrameBorderColor('#ea580c');
                  setQrDotsColor('#c2410c');
                  setQrCornerColor('#ea580c');
                  setFrameText('QUÉT ĐỂ ĐẶT MÓN');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'orange-floral'
                    ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/50'
                    : 'border-slate-200 bg-white hover:border-orange-200'
                }`}
              >
                <span className="text-base">🌸</span>
                <span className="text-[9px] font-bold text-orange-600 mt-0.5">Cam ấm</span>
              </button>

              {/* Xanh lá */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('green-fresh');
                  setFrameType('none'); // Không chọn khung khác
                  setFrameBgColor('#f0fdf4');
                  setFrameBorderColor('#16a34a');
                  setQrDotsColor('#15803d');
                  setQrCornerColor('#16a34a');
                  setFrameText('SCAN ME NOW');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'green-fresh'
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/50'
                    : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <span className="text-base">🌿</span>
                <span className="text-[9px] font-bold text-emerald-600 mt-0.5">Xanh lá</span>
              </button>

              {/* Vàng VIP */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('yellow-vip');
                  setFrameType('none'); // Không chọn khung khác
                  setFrameBgColor('#fefce8');
                  setFrameBorderColor('#ca8a04');
                  setQrDotsColor('#854d0e');
                  setQrCornerColor('#ca8a04');
                  setFrameText('VIP SCAN');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'yellow-vip'
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50'
                    : 'border-slate-200 bg-white hover:border-amber-200'
                }`}
              >
                <span className="text-base">👑</span>
                <span className="text-[9px] font-bold text-amber-600 mt-0.5">Vàng VIP</span>
              </button>

              {/* Tím yêu */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('purple-love');
                  setFrameType('none'); // Không chọn khung khác
                  setFrameBgColor('#faf5ff');
                  setFrameBorderColor('#9333ea');
                  setQrDotsColor('#7e22ce');
                  setQrCornerColor('#9333ea');
                  setFrameText('QUÉT ĐỂ KẾT NỐI');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'purple-love'
                    ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/50'
                    : 'border-slate-200 bg-white hover:border-purple-200'
                }`}
              >
                <span className="text-base">💜</span>
                <span className="text-[9px] font-bold text-purple-600 mt-0.5">Tím yêu</span>
              </button>

              {/* Cà phê quán (Coffee Cup) */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('coffee-cup');
                  setFrameType('none');
                  setFrameBgColor('#fffbeb');
                  setFrameBorderColor('#78350f');
                  setQrDotsColor('#78350f');
                  setQrCornerColor('#b45309');
                  setFrameText('THƯỞNG THỨC CÀ PHÊ');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'coffee-cup'
                    ? 'border-amber-700 ring-2 ring-amber-700/20 bg-amber-50/60'
                    : 'border-slate-200 bg-white hover:border-amber-200'
                }`}
              >
                <span className="text-xl leading-none">☕</span>
                <span className="text-[9px] font-black text-amber-900 mt-1">Cà phê</span>
              </button>

              {/* Giỏ mua sắm / Shop (Shopping Bag) */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('shopping-bag');
                  setFrameType('none');
                  setFrameBgColor('#fef2f2');
                  setFrameBorderColor('#e11d48');
                  setQrDotsColor('#e11d48');
                  setQrCornerColor('#fb7185');
                  setFrameText('MUA SẮM NGAY');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 relative transition-all ${
                  framePreset === 'shopping-bag'
                    ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/50'
                    : 'border-slate-200 bg-white hover:border-rose-200'
                }`}
              >
                <span className="text-xl leading-none">🛍️</span>
                <span className="text-[9px] font-black text-rose-700 mt-1">Mua sắm</span>
              </button>

              <div className="w-14 h-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold text-xs">
                +62
              </div>
            </div>
          </div>

          {/* PHẦN 2: CHỌN KIỂU KHUNG (7 ICON ĐÚNG MẪU) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">Khung</label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {/* 1. Nút ✕ */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('none');
                }}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'none'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xl text-slate-400 font-light">✕</span>
              </button>

              {/* 2. Top Header với mấu tam giác trỏ xuống và 4 góc ngắm */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('top-header');
                  setFramePreset('none'); // Tách biệt: gỡ Mẫu Sẵn Có
                  // Khôi phục màu chuẩn mặc định cho Khung
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-between flex-shrink-0 transition-all ${
                  frameType === 'top-header'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-3 rounded bg-slate-600 relative flex justify-center">
                  <div
                    className="absolute -bottom-1 w-2 h-1.5 bg-slate-600"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                  ></div>
                </div>
                <div className="w-8 h-7 relative flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-400"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-400"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-slate-400"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-400"></div>
                </div>
              </button>

              {/* 3. Khung viền liền khối có thanh đế xám dưới đáy */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('bottom-bar');
                  setFramePreset('none');
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'bottom-bar'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 border-2 border-slate-600 rounded-t-sm border-b-0"></div>
                <div className="w-10 h-3 rounded-b bg-slate-600 relative flex justify-center">
                  <div
                    className="absolute -top-1 w-2 h-1.5 bg-slate-600"
                    style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}
                  ></div>
                </div>
              </button>

              {/* 4. Chỉ thanh đế xám nhỏ trỏ lên */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('chat-bubble');
                  setFramePreset('none');
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-end pb-2 flex-shrink-0 transition-all ${
                  frameType === 'chat-bubble'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-2.5 rounded bg-slate-600 relative flex justify-center">
                  <div
                    className="absolute -top-1 w-2 h-1 bg-slate-600"
                    style={{ clipPath: 'polygon(50% 0, 0 100%, 100% 100%)' }}
                  ></div>
                </div>
              </button>

              {/* 5. Khung thanh ngang trên có bubble trỏ xuống + viền bao khép kín */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('border-box');
                  setFramePreset('none');
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'border-box'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-3 rounded-t bg-slate-600 relative flex justify-end pr-1.5">
                  <div
                    className="absolute -bottom-1 right-2 w-2 h-1.5 bg-slate-600"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                  ></div>
                </div>
                <div className="w-9 h-7 border-2 border-slate-600 border-t-0 rounded-b"></div>
              </button>

              {/* 6. Phone chassis */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('phone-mockup');
                  setFramePreset('none');
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'phone-mockup'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-7 border-2 border-slate-600 rounded-t border-b-0"></div>
                <div className="w-10 h-3 rounded-b-lg bg-slate-600 flex items-center justify-center">
                  <div className="w-3.5 h-1.5 rounded-full border border-white flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </div>
              </button>

              {/* 7. Khung viền vuông đơn giản */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('badge-top');
                  setFramePreset('none');
                  setFrameBorderColor('#475569');
                  setFrameBgColor('#ffffff');
                  setQrDotsColor('#000000');
                  setQrCornerColor('#000000');
                  setFrameTextColor('#ffffff');
                }}
                className={`w-14 h-14 rounded-2xl border p-2 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'badge-top'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 border-2 border-slate-400 rounded-sm"></div>
              </button>

              <div className="w-14 h-14 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 font-bold text-xs">
                +246
              </div>
            </div>
          </div>

          {/* PHẦN 3: NỀN & MÀU KHUNG */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Màu Sắc Khung & Nền
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. MÀU KHUNG / VIỀN / BANNER */}
              <div className="flex items-center justify-between px-3.5 py-2 border border-slate-200 bg-white rounded-xl shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Màu Khung & Viền
                  </div>
                  <div className="font-mono font-bold text-xs text-slate-800">
                    {frameBorderColor}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFrameBorderColor('#475569')}
                    className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] font-semibold text-slate-500"
                    title="Mặc định xám"
                  >
                    Reset
                  </button>
                  <input
                    type="color"
                    value={frameBorderColor}
                    onChange={(e) => setFrameBorderColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0"
                  />
                </div>
              </div>

              {/* 2. MÀU NỀN MÃ QR */}
              <div className="flex items-center justify-between px-3.5 py-2 border border-slate-200 bg-white rounded-xl shadow-sm">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Nền QR
                  </div>
                  <div className="font-mono font-bold text-xs text-slate-800">
                    {isTransparentBg ? 'Trong suốt' : frameBgColor}
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={isTransparentBg}
                      onChange={(e) => setIsTransparentBg(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Trong suốt</span>
                  </label>

                  <input
                    type="color"
                    value={frameBgColor}
                    onChange={(e) => setFrameBgColor(e.target.value)}
                    disabled={isTransparentBg}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer p-0 disabled:opacity-30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 4: VĂN BẢN BỔ SUNG */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Văn Bản Bổ Sung
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={frameText}
                  onChange={(e) => setFrameText(e.target.value)}
                  placeholder="Văn bản bổ sung..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={frameFontFamily}
                  onChange={(e) => setFrameFontFamily(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta</option>
                  <option value="sans-serif">Roboto</option>
                  <option value="monospace">JetBrains Mono</option>
                  <option value="cursive">Viết tay</option>
                </select>
              </div>

              <div className="sm:col-span-4 flex items-center justify-between px-3 py-1.5 border border-slate-200 bg-white rounded-xl">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Màu Chữ
                  </div>
                  <div className="font-mono font-bold text-xs text-slate-800">
                    {frameTextColor}
                  </div>
                </div>
                <input
                  type="color"
                  value={frameTextColor}
                  onChange={(e) => setFrameTextColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB [HÌNH DẠNG] - THIẾT KẾ 100% CHUẨN THEO ẢNH BẠN GỬI */}
      {classicSubTab === 'shape' && (
        <div className="space-y-6">
          {/* PHẦN 1: HÌNH DẠNG CƠ THỂ */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <label className="block text-sm font-bold text-slate-800">
              Hình Dạng Cơ Thể
            </label>

            {/* Dải 8 kiểu hình dạng cơ thể */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'square' as QRBodyShape, label: 'Vuông' },
                { id: 'rounded' as QRBodyShape, label: 'Bo tròn' },
                { id: 'extra-rounded' as QRBodyShape, label: 'Siêu bo' },
                { id: 'dots' as QRBodyShape, label: 'Chấm tròn' },
                { id: 'classy' as QRBodyShape, label: 'Kim cương' },
                { id: 'classy-rounded' as QRBodyShape, label: 'Thoi tròn' },
                { id: 'mosaic' as QRBodyShape, label: 'Khảm' },
                { id: 'star' as QRBodyShape, label: 'Hoa thị' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBodyShape(item.id)}
                  className={`w-14 h-14 rounded-2xl border p-2 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                    bodyShape === item.id
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Icon mô phỏng body mini */}
                  <div className="w-7 h-7 flex items-center justify-center">
                    {item.id === 'square' && (
                      <div className="w-5 h-5 bg-slate-900 grid grid-cols-2 gap-0.5 p-0.5">
                        <div className="bg-white"></div>
                        <div></div>
                      </div>
                    )}
                    {item.id === 'rounded' && (
                      <div className="w-5 h-5 bg-slate-900 rounded-md"></div>
                    )}
                    {item.id === 'extra-rounded' && (
                      <div className="w-5 h-5 bg-slate-900 rounded-full"></div>
                    )}
                    {item.id === 'dots' && (
                      <div className="grid grid-cols-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                        <div className="w-2 h-2 rounded-full bg-slate-900"></div>
                      </div>
                    )}
                    {item.id === 'classy' && (
                      <div className="w-4 h-4 bg-slate-900 rotate-45"></div>
                    )}
                    {item.id === 'classy-rounded' && (
                      <div className="w-4 h-4 bg-slate-900 rotate-45 rounded-sm"></div>
                    )}
                    {item.id === 'mosaic' && (
                      <div className="grid grid-cols-3 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-slate-900"></div>
                        <div className="w-1.5 h-1.5 bg-slate-900"></div>
                        <div className="w-1.5 h-1.5 bg-slate-900"></div>
                      </div>
                    )}
                    {item.id === 'star' && <span className="text-base">✦</span>}
                  </div>
                  <span className="text-[8px] font-bold text-slate-500 mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
              >
                <span>Xem Thêm</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Màu Đơn / Màu Gradient cho Thân */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="bodyColorType"
                    defaultChecked
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Màu Đơn</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="bodyColorType"
                    disabled
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <span>Màu Gradient</span>
                </label>
              </div>

              {/* Hộp chọn mã màu thân */}
              <div className="flex items-center gap-2 max-w-[240px]">
                <div className="flex items-center justify-between flex-1 px-3.5 py-2 border border-slate-200 bg-white rounded-xl shadow-sm">
                  <span className="font-mono font-bold text-xs text-slate-800">{bodyColor}</span>
                  <input
                    type="color"
                    value={bodyColor}
                    onChange={(e) => setBodyColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setBodyColor('#000000')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                  title="Mặc định đen"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>
          </div>

          {/* PHẦN 2 & 3: MẮT NGOÀI & MẮT TRONG (2 CỘT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CỘT TRÁI: MẮT NGOÀI (OUTER EYE) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                Mắt Ngoài
              </label>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* 1. Mặc định vuông */}
                <button
                  type="button"
                  onClick={() => setOuterEyeShape('square')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    outerEyeShape === 'square'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-6 h-6 border-[3px] border-slate-800 rounded-none"></div>
                </button>

                {/* 2. Bo tròn góc */}
                <button
                  type="button"
                  onClick={() => setOuterEyeShape('rounded')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    outerEyeShape === 'rounded'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-6 h-6 border-[3px] border-slate-800 rounded-md"></div>
                </button>

                {/* 3. Hình tròn */}
                <button
                  type="button"
                  onClick={() => setOuterEyeShape('circle')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    outerEyeShape === 'circle'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-6 h-6 border-[3px] border-slate-800 rounded-full"></div>
                </button>

                {/* 4. Hình chiếc lá (Leaf) */}
                <button
                  type="button"
                  onClick={() => setOuterEyeShape('leaf')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    outerEyeShape === 'leaf'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-6 h-6 border-[3px] border-slate-800 rounded-tl-xl rounded-br-xl"></div>
                </button>
              </div>

              {/* Màu mắt ngoài */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500">Màu Mắt Ngoài:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-xl shadow-sm">
                    <span className="font-mono font-bold text-xs text-slate-800">{outerEyeColor}</span>
                    <input
                      type="color"
                      value={outerEyeColor}
                      onChange={(e) => setOuterEyeColor(e.target.value)}
                      className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setOuterEyeColor('#000000')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: MẮT TRONG (INNER EYE) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <label className="block text-sm font-bold text-slate-800">
                Mắt Trong
              </label>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* 1. Vuông */}
                <button
                  type="button"
                  onClick={() => setInnerEyeShape('square')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    innerEyeShape === 'square'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-800 rounded-none"></div>
                </button>

                {/* 2. Bo tròn góc */}
                <button
                  type="button"
                  onClick={() => setInnerEyeShape('rounded')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    innerEyeShape === 'rounded'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-800 rounded-sm"></div>
                </button>

                {/* 3. Tròn */}
                <button
                  type="button"
                  onClick={() => setInnerEyeShape('circle')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    innerEyeShape === 'circle'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-800 rounded-full"></div>
                </button>

                {/* 4. Chiếc lá */}
                <button
                  type="button"
                  onClick={() => setInnerEyeShape('leaf')}
                  className={`w-12 h-12 rounded-xl border p-1.5 flex items-center justify-center transition-all ${
                    innerEyeShape === 'leaf'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="w-4 h-4 bg-slate-800 rounded-tl-lg rounded-br-lg"></div>
                </button>
              </div>

              {/* Màu mắt trong */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-semibold text-slate-500">Màu Mắt Trong:</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-between flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-xl shadow-sm">
                    <span className="font-mono font-bold text-xs text-slate-800">{innerEyeColor}</span>
                    <input
                      type="color"
                      value={innerEyeColor}
                      onChange={(e) => setInnerEyeColor(e.target.value)}
                      className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setInnerEyeColor('#000000')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 4: NỀN MÃ QR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              Nền Mã QR
            </label>
            <div className="flex items-center gap-5 flex-wrap text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgType"
                  checked={!isTransparentBg}
                  onChange={() => setIsTransparentBg(false)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Màu Đơn</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgType"
                  checked={isTransparentBg}
                  onChange={() => setIsTransparentBg(true)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Nền Trong Suốt</span>
              </label>

              {!isTransparentBg && (
                <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-xl shadow-sm">
                  <span className="font-mono font-bold text-xs text-slate-800">{frameBgColor}</span>
                  <input
                    type="color"
                    value={frameBgColor}
                    onChange={(e) => setFrameBgColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB [LOGO] */}
      {classicSubTab === 'logo' && (
        <div className="space-y-5">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">Logo</label>

            {/* Grid Icon Thương Hiệu */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Nút Hủy / Không dùng logo (Dấu X chéo) */}
              <button
                type="button"
                onClick={() => setCenterLogoUrl('')}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  !centerLogoUrl
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20 text-purple-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-400'
                }`}
                title="Không dùng logo"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Các logo hiển thị (mặc định 6 cái đầu, hoặc mở rộng hết) */}
              {(showAllLogos ? PRESET_LOGOS : PRESET_LOGOS.slice(0, 6)).map((item) => {
                const isSelected = centerLogoUrl === item.svgDataUri;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCenterLogoUrl(item.svgDataUri);
                      if (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M') {
                        setErrorCorrectionLevel('Q');
                        setCenterLogoSizePercent(22);
                      }
                    }}
                    className={`w-12 h-12 rounded-xl border p-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    title={item.name}
                  >
                    <img src={item.svgDataUri} alt={item.name} className="w-full h-full object-contain" />
                  </button>
                );
              })}

              {/* Nút Xem thêm / +64 */}
              <button
                type="button"
                onClick={() => setShowAllLogos(!showAllLogos)}
                className={`h-12 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  showAllLogos
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                {showAllLogos ? 'Thu gọn' : `+${PRESET_LOGOS.length - 6 > 0 ? PRESET_LOGOS.length - 6 : 'Xem thêm'}`}
              </button>
            </div>
          </div>

          {/* NÚT TẢI LÊN HÌNH ẢNH */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl cursor-pointer font-bold text-xs transition-all shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Tải Lên Hình Ảnh</span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleUploadLogoFile}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-500 text-center">
              Các Định Dạng Tệp Được Hỗ Trợ: PNG, JPEG.
            </p>
          </div>

          {/* THANH TRƯỢT KÍCH THƯỚC BIỂU TRƯNG & TOGGLE NỀN BIỂU TRƯNG */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 flex-wrap sm:flex-nowrap">
            {/* Range Slider Kích thước */}
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Kích Thước Biểu Trưng</span>
                <span className="text-purple-600 font-mono">{centerLogoSizePercent}% (Tối đa: {maxSafeSize}%)</span>
              </div>
              <input
                type="range"
                min="10"
                max={maxSafeSize}
                value={Math.min(centerLogoSizePercent, maxSafeSize)}
                onChange={(e) => setCenterLogoSizePercent(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-500">
                * Giới hạn an toàn được khóa theo Cấp độ sửa lỗi ({errorCorrectionLevel}) để đảm bảo QR luôn quét được.
              </p>
            </div>

            {/* Toggle Switch Nền Biểu Trưng */}
            <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => setCenterLogoHasBg(!centerLogoHasBg)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  centerLogoHasBg ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    centerLogoHasBg ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-slate-800 select-none cursor-pointer" onClick={() => setCenterLogoHasBg(!centerLogoHasBg)}>
                Nền Biểu Trưng
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB [CẤP ĐỘ] */}
      {classicSubTab === 'level' && (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Mức Độ Có Thể Quét (Mức Độ Sửa Lỗi)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Bằng cách thay đổi mức độ sửa lỗi, bạn có thể đơn giản hóa hoặc phức tạp hóa mẫu mã QR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              {
                lvl: 'H' as QRErrorLevel,
                title: 'Tốt nhất',
                desc: 'Mẫu chịu được hư hại tối đa (30%)'
              },
              {
                lvl: 'Q' as QRErrorLevel,
                title: 'Cao',
                desc: 'Mẫu chịu được hư hại tối ưu (25%)'
              },
              {
                lvl: 'M' as QRErrorLevel,
                title: 'Trung bình',
                desc: 'Mẫu lộn xộn cân bằng (15%)'
              },
              {
                lvl: 'L' as QRErrorLevel,
                title: 'Nhỏ nhất',
                desc: 'Mẫu ít lộn xộn hơn (7%)'
              }
            ].map((item) => (
              <button
                key={item.lvl}
                type="button"
                onClick={() => setErrorCorrectionLevel(item.lvl)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${
                  errorCorrectionLevel === item.lvl
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl border border-slate-200 p-1 flex items-center justify-center flex-shrink-0">
                  <div
                    className={`w-full h-full border-2 rounded ${
                      errorCorrectionLevel === item.lvl ? 'border-purple-600' : 'border-slate-400'
                    } flex items-center justify-center font-black text-xs`}
                  >
                    {item.lvl}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

