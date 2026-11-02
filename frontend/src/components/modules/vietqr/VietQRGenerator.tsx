import React, { useState, useEffect, useRef } from 'react';
import {
  Link as LinkIcon,
  AlignLeft,
  Image as ImageIcon,
  FileText,
  Share2,
  MapPin,
  Wifi,
  Globe,
  Video,
  Building2,
  Download,
  Palette,
  Sparkles,
  Upload
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { POPULAR_BANKS } from '@/constants/banks';
import { getVietQRUrl } from '@/utils/vietqr';
import { toPng } from 'html-to-image';
import {
  QRCategory,
  CustomQRSubTab,
  ClassicSubTab,
  QRErrorLevel,
  ClassicFrameType,
  PresetType,
  QRBodyShape,
  QROuterEyeShape,
  QRInnerEyeShape
} from './types';
import { drawLogoQRCanvas, drawClassicQRCanvas } from './qrCanvasRenderer';
import { ClassicFrameEditor } from './ClassicFrameEditor';
import { LogoQREditor } from './LogoQREditor';
import { QRPreviewRenderer } from './QRPreviewRenderer';
import { VietQRStandee } from './VietQRStandee';

export const VietQRGenerator: React.FC = () => {
  const { profile, updateProfile, activeQrCategory, setActiveQrCategory } = useApp();

  // Active Category gắn liền trực tiếp với AppContext (giữ nguyên khi chuyển trang, không bị giật nháy)
  const activeCategory = (activeQrCategory as QRCategory) || 'vietqr';
  const handleSelectCategory = (cat: QRCategory) => {
    setActiveQrCategory(cat);
  };

  // Input states theo từng loại
  const [urlInput, setUrlInput] = useState('https://facebook.com/tiemsohub');
  const [textInput, setTextInput] = useState('Cảm ơn quý khách đã mua sắm tại Tiệm Số Hub! Mã giảm giá của bạn: TIEMSO2026');
  const [imageUrlInput, setImageUrlInput] = useState('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800');
  const [pdfUrlInput, setPdfUrlInput] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [fbInput, setFbInput] = useState('https://facebook.com/');
  const [mapsInput, setMapsInput] = useState('https://maps.google.com/?q=Hanoi');
  const [xInput, setXInput] = useState('https://x.com/');
  const [videoInput, setVideoInput] = useState('https://youtube.com/');

  // Wifi Inputs
  const [wifiSsid, setWifiSsid] = useState(profile.wifiSSID || 'TiemSo_Coffee_5G');
  const [wifiPass, setWifiPass] = useState(profile.wifiPassword || 'tiemso@coffee2026');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // VietQR Inputs
  const [bankBin, setBankBin] = useState(profile.bankBin || '970436');
  const [accountNo, setAccountNo] = useState(profile.accountNo || '1029384756');
  const [accountName, setAccountName] = useState(profile.accountName || 'NGUYEN VAN A');
  const [shopName, setShopName] = useState(profile.shopName || 'Tiệm Cà Phê Số');
  const [hotline, setHotline] = useState(profile.hotline || '0988 123 456');
  const [amount, setAmount] = useState<number | ''>('');
  const [memo, setMemo] = useState<string>('Thanh toan');
  const [standeeStyle, setStandeeStyle] = useState<'minimal' | 'navy' | 'emerald' | 'gold'>('minimal');
  const [paperSize, setPaperSize] = useState<'a6' | 'a5'>('a6');
  const [includeWifiOnStandee, setIncludeWifiOnStandee] = useState(true);

  // QR generated dataURL
  const [clientQrDataUrl, setClientQrDataUrl] = useState<string>('');
  const [qrDotsColor, setQrDotsColor] = useState<string>('#000000');
  const [qrCornerColor, setQrCornerColor] = useState<string>('#000000');
  const [isExporting, setIsExporting] = useState(false);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const selectedBank = POPULAR_BANKS.find((b) => b.bin === bankBin) || POPULAR_BANKS[0];

  // Xử lý tải ảnh trực tiếp từ máy tính lên
  const handleUploadLocalImage = (e: React.ChangeEvent<HTMLInputElement>, target: 'imageCategory' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'imageCategory') {
        setImageUrlInput(result);
      } else {
        setLogoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const quickAmounts = [20000, 35000, 50000, 100000, 200000, 500000];

  const tabOptions = [
    { id: 'vietqr' as QRCategory, label: 'VietQR Ngân Hàng', icon: Building2, highlight: true },
    { id: 'url' as QRCategory, label: 'Liên kết / URL', icon: LinkIcon },
    { id: 'text' as QRCategory, label: 'Bản văn', icon: AlignLeft },
    { id: 'image' as QRCategory, label: 'Hình ảnh', icon: ImageIcon },
    { id: 'pdf' as QRCategory, label: 'PDF', icon: FileText },
    { id: 'facebook' as QRCategory, label: 'Facebook', icon: Share2 },
    { id: 'maps' as QRCategory, label: 'Google Maps', icon: MapPin },
    { id: 'wifi' as QRCategory, label: 'Wi-Fi', icon: Wifi },
    { id: 'x' as QRCategory, label: 'X (Twitter)', icon: Globe },
    { id: 'video' as QRCategory, label: 'Video', icon: Video }
  ];

  // 2 Tab tùy chỉnh kiểu mã QR
  const [customStyleTab, setCustomStyleTab] = useState<CustomQRSubTab>('classic');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // 4 Tab con bên trong tab Cổ điển
  const [classicSubTab, setClassicSubTab] = useState<ClassicSubTab>('logo');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QRErrorLevel>('Q');

  // Logo giữa cho QR Cổ điển
  const [centerLogoUrl, setCenterLogoUrl] = useState<string>('');
  const [centerLogoSizePercent, setCenterLogoSizePercent] = useState<number>(20);
  const [centerLogoHasBg, setCenterLogoHasBg] = useState<boolean>(true);

  // Tùy chỉnh Khung cho QR Cổ điển
  const [frameType, setFrameType] = useState<ClassicFrameType>('none');
  const [frameBorderColor, setFrameBorderColor] = useState<string>('#475569');
  const [frameBgColor, setFrameBgColor] = useState<string>('#ffffff');
  const [isTransparentBg, setIsTransparentBg] = useState<boolean>(false);
  const [frameText, setFrameText] = useState<string>('QUÉT TÔI ĐI');
  const [frameTextColor, setFrameTextColor] = useState<string>('#ffffff');
  const [frameFontFamily, setFrameFontFamily] = useState<string>('Plus Jakarta Sans');
  const [framePreset, setFramePreset] = useState<PresetType>('none');

  // Tùy chỉnh Hình dạng (Shape) cho QR Cổ điển
  const [bodyShape, setBodyShape] = useState<QRBodyShape>('square');
  const [outerEyeShape, setOuterEyeShape] = useState<QROuterEyeShape>('square');
  const [innerEyeShape, setInnerEyeShape] = useState<QRInnerEyeShape>('square');
  const [bodyColor, setBodyColor] = useState<string>('#000000');
  const [outerEyeColor, setOuterEyeColor] = useState<string>('#000000');
  const [innerEyeColor, setInnerEyeColor] = useState<string>('#000000');

  // Lấy chuỗi raw content để encode vào QR
  const getRawContent = () => {
    switch (activeCategory) {
      case 'url':
        return urlInput || 'https://';
      case 'text':
        return textInput || '';
      case 'image':
        return imageUrlInput || 'https://';
      case 'pdf':
        return pdfUrlInput || 'https://';
      case 'facebook':
        return fbInput || 'https://facebook.com';
      case 'maps':
        return mapsInput || 'https://maps.google.com';
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPass};;`;
      case 'x':
        return xInput || 'https://x.com';
      case 'video':
        return videoInput || 'https://youtube.com';
      default:
        return '';
    }
  };

  // Render QR Code Client-side khi nội dung hoặc phong cách thay đổi
  useEffect(() => {
    if (activeCategory === 'vietqr') return;
    const raw = getRawContent();
    if (!raw) return;

    if (customStyleTab === 'logo') {
      drawLogoQRCanvas({
        raw,
        logoUrl,
        logoScalePercent: centerLogoSizePercent,
        errorCorrectionLevel,
        bodyShape,
        outerEyeShape,
        innerEyeShape,
        bodyColor: bodyColor || qrDotsColor || '#000000',
        outerEyeColor: outerEyeColor || qrCornerColor || '#000000',
        innerEyeColor: innerEyeColor || qrDotsColor || '#000000',
        backgroundColor: frameBgColor,
        isTransparentBg
      }).then((url) => setClientQrDataUrl(url));
    } else {
      drawClassicQRCanvas({
        raw,
        errorCorrectionLevel,
        bodyShape,
        outerEyeShape,
        innerEyeShape,
        bodyColor: bodyColor || qrDotsColor || '#000000',
        outerEyeColor: outerEyeColor || qrCornerColor || '#000000',
        innerEyeColor: innerEyeColor || qrDotsColor || '#000000',
        backgroundColor: frameBgColor,
        isTransparentBg,
        centerLogoUrl,
        centerLogoSizePercent,
        centerLogoHasBg
      }).then((url) => setClientQrDataUrl(url));
    }
  }, [
    activeCategory,
    customStyleTab,
    errorCorrectionLevel,
    bodyShape,
    outerEyeShape,
    innerEyeShape,
    bodyColor,
    outerEyeColor,
    innerEyeColor,
    frameBgColor,
    isTransparentBg,
    qrDotsColor,
    qrCornerColor,
    logoUrl,
    centerLogoUrl,
    centerLogoSizePercent,
    centerLogoHasBg,
    urlInput,
    textInput,
    imageUrlInput,
    pdfUrlInput,
    fbInput,
    mapsInput,
    wifiSsid,
    wifiPass,
    wifiType,
    xInput,
    videoInput
  ]);

  const vietQrUrl = getVietQRUrl(
    bankBin,
    accountNo,
    'compact2',
    typeof amount === 'number' ? amount : 0,
    memo,
    accountName
  );

  const displayQrUrl = activeCategory === 'vietqr' ? vietQrUrl : clientQrDataUrl;

  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      let dataUrl = '';
      if (previewCardRef.current) {
        try {
          dataUrl = await toPng(previewCardRef.current, {
            quality: 0.98,
            pixelRatio: 2,
            cacheBust: true,
            skipFonts: true
          });
        } catch (captureErr) {
          console.warn('html-to-image capture failed, trying fallback:', captureErr);
        }
      }

      if (!dataUrl && displayQrUrl) {
        if (displayQrUrl.startsWith('data:')) {
          dataUrl = displayQrUrl;
        } else {
          // Thử proxy ảnh để lấy blob
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(displayQrUrl)}`;
            const resp = await fetch(proxyUrl);
            const blob = await resp.blob();
            dataUrl = URL.createObjectURL(blob);
          } catch {
            // Nếu không được, dùng fetch trực tiếp
            try {
              const resp = await fetch(displayQrUrl);
              const blob = await resp.blob();
              dataUrl = URL.createObjectURL(blob);
            } catch {
              // Cuối cùng: trigger download qua thẻ <a>
              const link = document.createElement('a');
              link.target = '_blank';
              link.href = displayQrUrl;
              link.download = `Ma-QR-${activeCategory.toUpperCase()}-${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setIsExporting(false);
              return;
            }
          }
        }
      }

      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Ma-QR-${activeCategory.toUpperCase()}-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Không thể tạo file ảnh tải về.');
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi xuất ảnh PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const themeStyles = {
    minimal: {
      card: 'bg-white text-slate-900 border-2 border-slate-300 shadow-xl',
      badge: 'bg-purple-600 text-white',
      accent: 'text-purple-600',
      footerBg: 'bg-slate-100 border border-slate-200'
    },
    navy: {
      card: 'bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white border border-blue-700/50 shadow-2xl',
      badge: 'bg-amber-400 text-slate-950',
      accent: 'text-amber-400',
      footerBg: 'bg-white/10'
    },
    emerald: {
      card: 'bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white border border-emerald-700/50 shadow-2xl',
      badge: 'bg-emerald-400 text-slate-950',
      accent: 'text-emerald-300',
      footerBg: 'bg-white/10'
    },
    gold: {
      card: 'bg-gradient-to-b from-amber-950 via-stone-900 to-black text-amber-50 border border-amber-600/50 shadow-2xl',
      badge: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950',
      accent: 'text-amber-300',
      footerBg: 'bg-amber-950/60'
    }
  };

  const currentTheme = themeStyles[standeeStyle];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1 mb-2">
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Dễ dàng tạo, quản lý và chia sẻ mã QR chuyên nghiệp cho cửa hàng & kinh doanh của bạn
        </p>
      </div>

      {/* DẢI NÚT CHỌN LOẠI MÃ QR */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {tabOptions.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleSelectCategory(tab.id)}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all min-w-[96px] ${
                  isSelected
                    ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-slate-600'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GRID CHÍNH (7 - 5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (7 cols): CÁC Ô NHẬP LIỆU & TÙY BIẾN KHUNG */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. URL */}
          {activeCategory === 'url' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <LinkIcon className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Nhập Liên Kết Website / Fanpage / Shopee
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đường dẫn URL:
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://yourwebsite.com hoặc link Bio..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* 2. TEXT */}
          {activeCategory === 'text' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <AlignLeft className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Nhập Nội Dung Bản Văn / Tin Nhắn
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đoạn văn bản hiển thị khi quét:
                </label>
                <textarea
                  rows={4}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Nhập thông điệp, lời cảm ơn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* 3. IMAGE */}
          {activeCategory === 'image' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Tải Ảnh Menu / Bảng Giá / Banner Lên
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 rounded-2xl cursor-pointer transition-all">
                  <Upload className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-xs font-bold text-purple-900">Bấm để tải ảnh từ máy tính / điện thoại</span>
                  <span className="text-[10px] text-slate-500 mt-1">Hỗ trợ định dạng PNG, JPG, JPEG</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadLocalImage(e, 'imageCategory')}
                    className="hidden"
                  />
                </label>

                {imageUrlInput && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-medium truncate flex-1">Đã nạp ảnh thành công</span>
                    <button
                      type="button"
                      onClick={() => setImageUrlInput('')}
                      className="text-[10px] text-rose-500 hover:underline font-bold"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. PDF */}
          {activeCategory === 'pdf' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Tạo Mã QR Mở File Tài Liệu PDF
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đường link File PDF:
                </label>
                <input
                  type="url"
                  value={pdfUrlInput}
                  onChange={(e) => setPdfUrlInput(e.target.value)}
                  placeholder="https://...catalog.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* 5. FACEBOOK */}
          {activeCategory === 'facebook' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Share2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Quét Mã Vào Thẳng Facebook
                </h3>
              </div>
              <input
                type="url"
                value={fbInput}
                onChange={(e) => setFbInput(e.target.value)}
                placeholder="https://facebook.com/your_shop"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          )}

          {/* 6. MAPS */}
          {activeCategory === 'maps' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Chỉ Đường Google Maps
                </h3>
              </div>
              <input
                type="url"
                value={mapsInput}
                onChange={(e) => setMapsInput(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          )}

          {/* 7. WIFI */}
          {activeCategory === 'wifi' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Wifi className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Cấu Hình Quét Mã Bắt Wi-Fi Tự Động
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên Wi-Fi (SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu Wi-Fi:
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 8. X / VIDEO */}
          {activeCategory === 'x' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Globe className="w-4 h-4 text-slate-900" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Liên Kết X (Twitter)
                </h3>
              </div>
              <input
                type="url"
                value={xInput}
                onChange={(e) => setXInput(e.target.value)}
                placeholder="https://x.com/your_handle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          )}

          {activeCategory === 'video' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Video className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Liên Kết Video (YouTube / TikTok)
                </h3>
              </div>
              <input
                type="url"
                value={videoInput}
                onChange={(e) => setVideoInput(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          )}

          {/* THANH 2 TAB TÙY CHỈNH: [QR CỔ ĐIỂN] VÀ [LOGO QR] */}
          {activeCategory !== 'vietqr' && (
            <div className="space-y-3">
              {/* THANH CHỌN: [QR CỔ ĐIỂN] VÀ [LOGO QR] THEO ĐÚNG THIẾT KẾ BAN ĐẦU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Nút QR Cổ Điển */}
                <button
                  type="button"
                  onClick={() => setCustomStyleTab('classic')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    customStyleTab === 'classic'
                      ? 'border-purple-600 ring-2 ring-purple-600/20 bg-white shadow-sm'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        customStyleTab === 'classic' ? 'border-purple-600' : 'border-slate-300'
                      }`}
                    >
                      {customStyleTab === 'classic' && (
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">QR cổ điển</span>
                  </div>

                  {/* 3 icon preview thu nhỏ mô phỏng QR Cổ Điển */}
                  <div className="flex items-center gap-1.5 opacity-90">
                    <div className="w-6 h-6 rounded-md border border-sky-300 bg-sky-50/60 p-1 flex items-center justify-center">
                      <div className="w-full h-full border-[1.5px] border-sky-500 rounded-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-[1px]" />
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-md border border-pink-300 bg-pink-50/60 p-1 flex items-center justify-center">
                      <div className="w-full h-full border-[1.5px] border-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-md border border-rose-300 bg-rose-50/60 p-1 flex items-center justify-center">
                      <div className="w-full h-full border-[1.5px] border-rose-500 rounded-sm flex items-center justify-center rotate-45">
                        <div className="w-1 h-1 bg-rose-500" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* 2. Nút Logo QR */}
                <button
                  type="button"
                  onClick={() => setCustomStyleTab('logo')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all relative overflow-hidden ${
                    customStyleTab === 'logo'
                      ? 'border-transparent bg-gradient-to-r from-purple-700 via-purple-600 to-rose-600 text-white shadow-md'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        customStyleTab === 'logo' ? 'border-white' : 'border-slate-300'
                      }`}
                    >
                      {customStyleTab === 'logo' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold">Logo QR</span>
                      <Sparkles className={`w-3.5 h-3.5 ${customStyleTab === 'logo' ? 'text-amber-300' : 'text-purple-600'}`} />
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                        MỚI
                      </span>
                    </div>
                  </div>

                  {/* 3 icon logo nhỏ bên phải */}
                  <div className="flex items-center gap-1 z-10">
                    <div className="w-6 h-6 rounded-md bg-white/90 p-0.5 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-black text-emerald-600">☕</span>
                    </div>
                    <div className="w-6 h-6 rounded-md bg-white/90 p-0.5 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-black text-rose-600">🍔</span>
                    </div>
                    <div className="w-6 h-6 rounded-md bg-white/90 p-0.5 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-black text-amber-700">📦</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* KHI Ở TAB QR CỔ ĐIỂN: GỌI COMPONENT ClassicFrameEditor */}
              {customStyleTab === 'classic' && (
                <ClassicFrameEditor
                  classicSubTab={classicSubTab}
                  setClassicSubTab={setClassicSubTab}
                  errorCorrectionLevel={errorCorrectionLevel}
                  setErrorCorrectionLevel={setErrorCorrectionLevel}
                  frameType={frameType}
                  setFrameType={setFrameType}
                  frameBorderColor={frameBorderColor}
                  setFrameBorderColor={setFrameBorderColor}
                  frameBgColor={frameBgColor}
                  setFrameBgColor={setFrameBgColor}
                  isTransparentBg={isTransparentBg}
                  setIsTransparentBg={setIsTransparentBg}
                  frameText={frameText}
                  setFrameText={setFrameText}
                  frameTextColor={frameTextColor}
                  setFrameTextColor={setFrameTextColor}
                  frameFontFamily={frameFontFamily}
                  setFrameFontFamily={setFrameFontFamily}
                  framePreset={framePreset}
                  setFramePreset={setFramePreset}
                  bodyShape={bodyShape}
                  setBodyShape={setBodyShape}
                  outerEyeShape={outerEyeShape}
                  setOuterEyeShape={setOuterEyeShape}
                  innerEyeShape={innerEyeShape}
                  setInnerEyeShape={setInnerEyeShape}
                  bodyColor={bodyColor}
                  setBodyColor={setBodyColor}
                  outerEyeColor={outerEyeColor}
                  setOuterEyeColor={setOuterEyeColor}
                  innerEyeColor={innerEyeColor}
                  setInnerEyeColor={setInnerEyeColor}
                  setQrDotsColor={setQrDotsColor}
                  setQrCornerColor={setQrCornerColor}
                  centerLogoUrl={centerLogoUrl}
                  setCenterLogoUrl={setCenterLogoUrl}
                  centerLogoSizePercent={centerLogoSizePercent}
                  setCenterLogoSizePercent={setCenterLogoSizePercent}
                  centerLogoHasBg={centerLogoHasBg}
                  setCenterLogoHasBg={setCenterLogoHasBg}
                />
              )}

              {/* KHI Ở TAB LOGO QR: GỌI COMPONENT LogoQREditor */}
              {customStyleTab === 'logo' && (
                <LogoQREditor
                  logoUrl={logoUrl}
                  setLogoUrl={setLogoUrl}
                  errorCorrectionLevel={errorCorrectionLevel}
                  setErrorCorrectionLevel={setErrorCorrectionLevel}
                  bodyShape={bodyShape}
                  setBodyShape={setBodyShape}
                  outerEyeShape={outerEyeShape}
                  setOuterEyeShape={setOuterEyeShape}
                  innerEyeShape={innerEyeShape}
                  setInnerEyeShape={setInnerEyeShape}
                  bodyColor={bodyColor}
                  setBodyColor={setBodyColor}
                  outerEyeColor={outerEyeColor}
                  setOuterEyeColor={setOuterEyeColor}
                  innerEyeColor={innerEyeColor}
                  setInnerEyeColor={setInnerEyeColor}
                  frameBgColor={frameBgColor}
                  setFrameBgColor={setFrameBgColor}
                  isTransparentBg={isTransparentBg}
                  setIsTransparentBg={setIsTransparentBg}
                  centerLogoUrl={centerLogoUrl}
                  setCenterLogoUrl={setCenterLogoUrl}
                  centerLogoSizePercent={centerLogoSizePercent}
                  setCenterLogoSizePercent={setCenterLogoSizePercent}
                  frameType={frameType}
                  setFrameType={setFrameType}
                  frameBorderColor={frameBorderColor}
                  setFrameBorderColor={setFrameBorderColor}
                  frameText={frameText}
                  setFrameText={setFrameText}
                  frameTextColor={frameTextColor}
                  setFrameTextColor={setFrameTextColor}
                  frameFontFamily={frameFontFamily}
                  setFrameFontFamily={setFrameFontFamily}
                  framePreset={framePreset}
                  setFramePreset={setFramePreset}
                />
              )}
            </div>
          )}

          {/* 9. VIETQR FORM */}
          {activeCategory === 'vietqr' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Thông Tin Tài Khoản Ngân Hàng
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chọn Ngân Hàng Thụ Hưởng:
                    </label>
                    <select
                      value={bankBin}
                      onChange={(e) => setBankBin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                    >
                      {POPULAR_BANKS.map((b) => (
                        <option key={b.bin} value={b.bin}>
                          {b.shortName} - {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Số Tài Khoản:
                    </label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tên Chủ Tài Khoản:
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Số tiền (để trống nếu khách tự nhập):
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                      placeholder="Ví dụ: 35000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nội dung chuyển khoản (Memo):
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Thanh toan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Gợi ý:</span>
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        amount === amt
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {amt / 1000}k
                    </button>
                  ))}
                  {amount !== '' && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="px-2 py-1 rounded-lg text-[10px] font-semibold text-rose-500 hover:bg-rose-50"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>

              {/* Tùy chỉnh màu standee */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tên quán / Cửa hàng:
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Hotline:
                    </label>
                    <input
                      type="text"
                      value={hotline}
                      onChange={(e) => setHotline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Màu sắc Standee:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'minimal', label: 'Trắng', color: 'bg-white border-2 border-slate-400' },
                      { id: 'navy', label: 'Navy', color: 'bg-blue-900' },
                      { id: 'emerald', label: 'Xanh ngọc', color: 'bg-emerald-800' },
                      { id: 'gold', label: 'Vàng đồng', color: 'bg-amber-900' }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStandeeStyle(st.id as any)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border flex flex-col items-center gap-1 ${
                          standeeStyle === st.id
                            ? 'ring-2 ring-purple-600 border-purple-600 bg-purple-50/40'
                            : 'border-slate-200'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${st.color}`}></span>
                        <span>{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI (5 cols): KHUNG XEM TRƯỚC MÃ QR VÀ NÚT TẢI */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                <span>Xem Trước Mã QR</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase">
                {activeCategory}
              </span>
            </div>

            {/* KHUNG HIỂN THỊ PREVIEW */}
            <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
              {activeCategory === 'vietqr' ? (
                <VietQRStandee
                  cardRef={previewCardRef}
                  shopName={shopName}
                  selectedBank={selectedBank}
                  displayQrUrl={displayQrUrl}
                  accountNo={accountNo}
                  accountName={accountName}
                  amount={amount}
                  includeWifiOnStandee={includeWifiOnStandee}
                  wifiSsid={wifiSsid}
                  wifiPass={wifiPass}
                  hotline={hotline}
                  currentTheme={currentTheme}
                />
              ) : (
                <div ref={previewCardRef} className="w-full flex justify-center">
                  <QRPreviewRenderer
                    displayQrUrl={displayQrUrl}
                    customStyleTab={customStyleTab}
                    framePreset={framePreset}
                    frameType={frameType}
                    frameBorderColor={frameBorderColor}
                    frameBgColor={frameBgColor}
                    isTransparentBg={isTransparentBg}
                    frameText={frameText}
                    frameTextColor={frameTextColor}
                    frameFontFamily={frameFontFamily}
                    activeCategory={activeCategory}
                    rawContent={getRawContent()}
                    wifiSsid={wifiSsid}
                    categoryLabel={tabOptions.find((t) => t.id === activeCategory)?.label}
                  />
                </div>
              )}
            </div>

            {/* CÁC NÚT THAO TÁC */}
            <div className="mt-4">
              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Đang xuất ảnh...' : 'Tải Ảnh (PNG)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
