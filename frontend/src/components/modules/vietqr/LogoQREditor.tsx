import React, { useState } from 'react';
import {
  ClassicFrameType,
  PresetType,
  QRErrorLevel,
  QRBodyShape,
  QROuterEyeShape,
  QRInnerEyeShape
} from './types';
import { PRESET_LOGOS } from './presetLogos';
import { Sparkles, Upload, X, Info } from 'lucide-react';

export type LogoQRSubTab = 'logo' | 'shape' | 'level' | 'frame';

interface LogoQREditorProps {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  errorCorrectionLevel: QRErrorLevel;
  setErrorCorrectionLevel: (lvl: QRErrorLevel) => void;
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
  frameBgColor: string;
  setFrameBgColor: (c: string) => void;
  isTransparentBg: boolean;
  setIsTransparentBg: (val: boolean) => void;
  centerLogoUrl: string;
  setCenterLogoUrl: (url: string) => void;
  centerLogoSizePercent: number;
  setCenterLogoSizePercent: (pct: number) => void;
  // Các props Khung viền & Preset giống QR Cổ điển
  frameType: ClassicFrameType;
  setFrameType: (type: ClassicFrameType) => void;
  frameBorderColor: string;
  setFrameBorderColor: (c: string) => void;
  frameText: string;
  setFrameText: (text: string) => void;
  frameTextColor: string;
  setFrameTextColor: (c: string) => void;
  frameFontFamily: string;
  setFrameFontFamily: (font: string) => void;
  framePreset: PresetType;
  setFramePreset: (preset: PresetType) => void;
}

export const LogoQREditor: React.FC<LogoQREditorProps> = ({
  logoUrl,
  setLogoUrl,
  errorCorrectionLevel,
  setErrorCorrectionLevel,
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
  frameBgColor,
  setFrameBgColor,
  isTransparentBg,
  setIsTransparentBg,
  centerLogoUrl,
  setCenterLogoUrl,
  centerLogoSizePercent,
  setCenterLogoSizePercent,
  frameType,
  setFrameType,
  frameBorderColor,
  setFrameBorderColor,
  frameText,
  setFrameText,
  frameTextColor,
  setFrameTextColor,
  frameFontFamily,
  setFrameFontFamily,
  framePreset,
  setFramePreset
}) => {
  const [logoSubTab, setLogoSubTab] = useState<LogoQRSubTab>('logo');
  const [showAllLogos, setShowAllLogos] = useState<boolean>(false);

  // Giới hạn max kích thước an toàn theo cấp độ sửa lỗi
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
      const result = reader.result as string;
      setCenterLogoUrl(result);
      setLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* 4 Tab con: [Logo] [Hình dạng] [Cấp độ] [Khung] & Nút Đặt lại */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'logo' as LogoQRSubTab, label: 'Logo' },
            { id: 'shape' as LogoQRSubTab, label: 'Hình dạng' },
            { id: 'level' as LogoQRSubTab, label: 'Cấp độ' },
            { id: 'frame' as LogoQRSubTab, label: 'Khung' }
          ].map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setLogoSubTab(sub.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                logoSubTab === sub.id
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
            setCenterLogoUrl('');
            setLogoUrl('');
            setCenterLogoSizePercent(60);
            setBodyShape('square');
            setOuterEyeShape('square');
            setInnerEyeShape('square');
            setBodyColor('#000000');
            setOuterEyeColor('#000000');
            setInnerEyeColor('#000000');
            setFrameBgColor('#ffffff');
            setIsTransparentBg(false);
            setFrameType('none');
            setFramePreset('none');
            setFrameBorderColor('#475569');
            setFrameText('QUÉT TÔI ĐI');
            setFrameTextColor('#ffffff');
          }}
          className="text-xs text-slate-500 hover:text-purple-600 font-semibold flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* 1. SUB-TAB [LOGO] */}
      {logoSubTab === 'logo' && (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-800">Logo</label>

          {/* NÚT TẢI LÊN LOGO */}
          <div className="space-y-2">
            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-purple-50/70 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl cursor-pointer font-bold text-xs transition-all shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Tải Lên Logo</span>
              <input
                type="file"
                accept=".svg, image/svg+xml, image/png, image/jpeg, image/jpg"
                onChange={handleUploadLogoFile}
                className="hidden"
              />
            </label>

            {/* Thông báo định dạng hỗ trợ */}
            <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                Định Dạng Hỗ Trợ: SVG (Khuyến Nghị), PNG, JPEG, JPG. Định Dạng QR Vector Có Sẵn Khi Tải Lên Logo Ở Định Dạng SVG.
              </span>
            </div>
          </div>

          {/* THANH TRƯỢT KÍCH THƯỚC BIỂU TRƯNG (Tùy chỉnh từ 5% bé xíu đến 100% chạm khung ma trận) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <div className="flex items-center gap-4">
                <span>Kích Thước BiỂu Trưng</span>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={centerLogoSizePercent || 60}
                  onChange={(e) => setCenterLogoSizePercent(Number(e.target.value))}
                  className="w-40 sm:w-56 accent-purple-600 cursor-pointer h-2 bg-purple-100 rounded-lg appearance-none"
                />
              </div>
              <span className="text-purple-600 font-mono text-[11px]">{centerLogoSizePercent || 60}%</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Bé xíu (5%)</span>
              <span>Cân đối (60%)</span>
              <span>Chạm mép khung (100%)</span>
            </div>
          </div>

          {/* GRID CÁC ICON THƯƠNG HIỆU */}
          <div className="pt-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Nút Hủy / Không dùng logo (Dấu X chéo) */}
              <button
                type="button"
                onClick={() => {
                  setCenterLogoUrl('');
                  setLogoUrl('');
                }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                  !centerLogoUrl && !logoUrl
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20 text-purple-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-400'
                }`}
                title="Không dùng logo"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Các logo hiển thị */}
              {(showAllLogos ? PRESET_LOGOS : PRESET_LOGOS.slice(0, 6)).map((item) => {
                const isSelected = centerLogoUrl === item.svgDataUri || logoUrl === item.svgDataUri;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCenterLogoUrl(item.svgDataUri);
                      setLogoUrl(item.svgDataUri);
                      if (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M') {
                        setErrorCorrectionLevel('Q');
                        setCenterLogoSizePercent(60);
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
        </div>
      )}

      {/* 2. SUB-TAB [HÌNH DẠNG] */}
      {logoSubTab === 'shape' && (
        <div className="space-y-6">
          {/* HÌNH DẠNG CƠ THỂ */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">Hình Dạng Cơ Thể</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[
                { id: 'square' as QRBodyShape, label: 'Vuông' },
                { id: 'rounded' as QRBodyShape, label: 'Bo tròn' },
                { id: 'dots' as QRBodyShape, label: 'Chấm bi' },
                { id: 'classy' as QRBodyShape, label: 'Thoi' },
                { id: 'classy-rounded' as QRBodyShape, label: 'Thoi bo' },
                { id: 'extra-rounded' as QRBodyShape, label: 'Siêu tròn' },
                { id: 'star' as QRBodyShape, label: 'Sao' },
                { id: 'mosaic' as QRBodyShape, label: 'Khảm' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBodyShape(item.id)}
                  className={`h-14 rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition-all ${
                    bodyShape === item.id
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {item.id === 'square' && <div className="w-4 h-4 bg-slate-800" />}
                    {item.id === 'rounded' && <div className="w-4 h-4 bg-slate-800 rounded-sm" />}
                    {item.id === 'dots' && <div className="w-3.5 h-3.5 bg-slate-800 rounded-full" />}
                    {item.id === 'classy' && <div className="w-3.5 h-3.5 bg-slate-800 rotate-45" />}
                    {item.id === 'classy-rounded' && <div className="w-3.5 h-3.5 bg-slate-800 rotate-45 rounded-sm" />}
                    {item.id === 'extra-rounded' && <div className="w-4 h-4 bg-slate-800 rounded-lg" />}
                    {item.id === 'star' && <Sparkles className="w-4 h-4 text-slate-800" />}
                    {item.id === 'mosaic' && (
                      <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                        <div className="bg-slate-800 rounded-tl-sm" />
                        <div className="bg-slate-800 rounded-tr-sm" />
                        <div className="bg-slate-800 rounded-bl-sm" />
                        <div className="bg-slate-800 rounded-br-sm" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 font-medium truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Màu thân */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-slate-600">Màu thân:</span>
              <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-white rounded-xl shadow-sm">
                <span className="font-mono font-bold text-xs text-slate-800">{bodyColor}</span>
                <input
                  type="color"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer p-0"
                />
              </div>
            </div>
          </div>

          {/* MẮT NGOÀI & MẮT TRONG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Mắt Ngoài */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800">Mắt Ngoài</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'square' as QROuterEyeShape, label: 'Vuông' },
                  { id: 'rounded' as QROuterEyeShape, label: 'Bo' },
                  { id: 'circle' as QROuterEyeShape, label: 'Tròn' },
                  { id: 'leaf' as QROuterEyeShape, label: 'Lá' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOuterEyeShape(item.id)}
                    className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                      outerEyeShape === item.id
                        ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 border-2 border-slate-800 flex items-center justify-center ${
                        item.id === 'rounded'
                          ? 'rounded-md'
                          : item.id === 'circle'
                          ? 'rounded-full'
                          : item.id === 'leaf'
                          ? 'rounded-tl-xl rounded-br-xl'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-500">Màu:</span>
                <div className="flex items-center gap-2 px-2.5 py-1 border border-slate-200 bg-white rounded-lg shadow-sm">
                  <span className="font-mono font-bold text-xs text-slate-800">{outerEyeColor}</span>
                  <input
                    type="color"
                    value={outerEyeColor}
                    onChange={(e) => setOuterEyeColor(e.target.value)}
                    className="w-5 h-5 rounded border-0 cursor-pointer p-0"
                  />
                </div>
              </div>
            </div>

            {/* Mắt Trong */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800">Mắt Trong</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'square' as QRInnerEyeShape, label: 'Vuông' },
                  { id: 'rounded' as QRInnerEyeShape, label: 'Bo' },
                  { id: 'circle' as QRInnerEyeShape, label: 'Tròn' },
                  { id: 'leaf' as QRInnerEyeShape, label: 'Lá' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInnerEyeShape(item.id)}
                    className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                      innerEyeShape === item.id
                        ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 bg-slate-800 ${
                        item.id === 'rounded'
                          ? 'rounded-sm'
                          : item.id === 'circle'
                          ? 'rounded-full'
                          : item.id === 'leaf'
                          ? 'rounded-tl-lg rounded-br-lg'
                          : ''
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-500">Màu:</span>
                <div className="flex items-center gap-2 px-2.5 py-1 border border-slate-200 bg-white rounded-lg shadow-sm">
                  <span className="font-mono font-bold text-xs text-slate-800">{innerEyeColor}</span>
                  <input
                    type="color"
                    value={innerEyeColor}
                    onChange={(e) => setInnerEyeColor(e.target.value)}
                    className="w-5 h-5 rounded border-0 cursor-pointer p-0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* NỀN MÃ QR */}
          <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-800">Nền Mã QR</span>
            <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgLogoType"
                  checked={!isTransparentBg}
                  onChange={() => setIsTransparentBg(false)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Màu Đơn</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="bgLogoType"
                  checked={isTransparentBg}
                  onChange={() => setIsTransparentBg(true)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Nền Trong Suốt</span>
              </label>

              {!isTransparentBg && (
                <div className="flex items-center gap-2 px-2.5 py-1 border border-slate-200 bg-white rounded-lg shadow-sm">
                  <span className="font-mono font-bold text-xs text-slate-800">{frameBgColor}</span>
                  <input
                    type="color"
                    value={frameBgColor}
                    onChange={(e) => setFrameBgColor(e.target.value)}
                    className="w-5 h-5 rounded border-0 cursor-pointer p-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB [CẤP ĐỘ] */}
      {logoSubTab === 'level' && (
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

      {/* 4. SUB-TAB [KHUNG] - ĐỒNG BỘ ĐẦY ĐỦ NHƯ QR CỔ ĐIỂN */}
      {logoSubTab === 'frame' && (
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
                }}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'none' && frameType === 'none'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xl text-slate-400">✕</span>
              </button>

              {/* 1. MẪU NÓN BẢO HỘ */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('safety-hat');
                  setFrameType('none');
                  setFrameBorderColor('#d97706');
                  setFrameBgColor('#fffbeb');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'safety-hat'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-7 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 100 65" fill="none" className="w-full h-full">
                    <path d="M22 48C22 25 33 10 50 10C67 10 78 25 78 48Z" fill="#FBBF24" />
                    <path d="M10 48C10 45 25 45 50 45C75 45 90 45 90 48C90 51 75 53 50 53C25 53 10 51 10 48Z" fill="#F59E0B" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-amber-700 mt-0.5">Nón Mũ</span>
              </button>

              {/* 2. MẪU LY CÀ PHÊ */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('coffee-cup');
                  setFrameType('none');
                  setFrameBorderColor('#78350f');
                  setFrameBgColor('#fffbeb');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'coffee-cup'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-lg">☕</span>
                <span className="text-[9px] font-bold text-amber-900">Cà phê</span>
              </button>

              {/* 3. MẪU GIỎ SHOPPING */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('shopping-bag');
                  setFrameType('none');
                  setFrameBorderColor('#e11d48');
                  setFrameBgColor('#fef2f2');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'shopping-bag'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-lg">🛍️</span>
                <span className="text-[9px] font-bold text-rose-700">Mua sắm</span>
              </button>

              {/* 4. MẪU HOA VĂN CAM */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('orange-floral');
                  setFrameType('none');
                  setFrameBorderColor('#f59e0b');
                  setFrameBgColor('#fff7ed');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'orange-floral'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-lg">🌸</span>
                <span className="text-[9px] font-bold text-orange-700">Hoa xuân</span>
              </button>

              {/* 5. MẪU LÁ XANH */}
              <button
                type="button"
                onClick={() => {
                  setFramePreset('green-fresh');
                  setFrameType('none');
                  setFrameBorderColor('#059669');
                  setFrameBgColor('#f0fdf4');
                }}
                className={`w-14 h-14 rounded-2xl border p-1 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  framePreset === 'green-fresh'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-lg">🌿</span>
                <span className="text-[9px] font-bold text-emerald-700">Tươi mới</span>
              </button>
            </div>
          </div>

          {/* PHẦN 2: CÁC KIỂU KHUNG */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">Kiểu Khung</label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {/* 1. Không khung */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('none');
                  setFramePreset('none');
                }}
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'none' && framePreset === 'none'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xl text-slate-400">✕</span>
              </button>

              {/* 2. Banner viền trên */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('top-header');
                  setFramePreset('none');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'top-header'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-3 rounded-t-md bg-slate-600 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-white/70 rounded"></div>
                </div>
                <div className="w-9 h-7 border-2 border-slate-400 rounded-b border-t-0"></div>
              </button>

              {/* 3. Banner viền dưới */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('bottom-bar');
                  setFramePreset('none');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'bottom-bar'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-7 border-2 border-slate-400 rounded-t border-b-0"></div>
                <div className="w-10 h-3 rounded-b-md bg-slate-600 flex items-center justify-center">
                  <div className="w-6 h-0.5 bg-white/70 rounded"></div>
                </div>
              </button>

              {/* 4. Chat Bubble dưới */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('chat-bubble');
                  setFramePreset('none');
                }}
                className={`w-14 h-14 rounded-2xl border p-1.5 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'chat-bubble'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-7 border border-slate-300 rounded"></div>
                <div className="w-8 h-2.5 rounded-full bg-slate-600 mt-1 flex items-center justify-center">
                  <div className="w-4 h-0.5 bg-white rounded"></div>
                </div>
              </button>

              {/* 5. Khung viền vuông */}
              <button
                type="button"
                onClick={() => {
                  setFrameType('badge-top');
                  setFramePreset('none');
                }}
                className={`w-14 h-14 rounded-2xl border p-2 flex flex-col items-center justify-center flex-shrink-0 transition-all ${
                  frameType === 'badge-top'
                    ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 border-2 border-slate-400 rounded-sm"></div>
              </button>
            </div>
          </div>

          {/* PHẦN 3: MÀU SẮC KHUNG & NỀN */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Màu Sắc Khung
            </label>
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
          </div>

          {/* PHẦN 4: VĂN BẢN KHUNG */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800">
              Văn Bản Khung
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  value={frameText}
                  onChange={(e) => setFrameText(e.target.value)}
                  placeholder="Văn bản bổ sung..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={frameFontFamily}
                  onChange={(e) => setFrameFontFamily(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta</option>
                  <option value="sans-serif">Roboto</option>
                  <option value="monospace">JetBrains Mono</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
