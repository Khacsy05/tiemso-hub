import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
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
  Printer,
  Sparkles,
  Palette,
  Store,
  Coins,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Upload
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { POPULAR_BANKS } from '@/constants/banks';
import { formatVND, getVietQRUrl } from '@/utils/vietqr';
import { toPng } from 'html-to-image';

export type QRCategory =
  | 'url'
  | 'text'
  | 'image'
  | 'pdf'
  | 'facebook'
  | 'maps'
  | 'wifi'
  | 'x'
  | 'video'
  | 'vietqr';

export type CustomQRSubTab = 'classic' | 'logo';
export type ClassicSubTab = 'frame' | 'shape' | 'logo' | 'level';
export type QRErrorLevel = 'H' | 'Q' | 'M' | 'L';

export const VietQRGenerator: React.FC = () => {
  const { profile, updateProfile } = useApp();

  // Active Category (mặc định là 'url' giống ảnh, hoặc 'vietqr')
  const [activeCategory, setActiveCategory] = useState<QRCategory>('url');

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

  // QR generated dataURL (cho các loại không phải VietQR API)
  const [clientQrDataUrl, setClientQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const previewCardRef = useRef<HTMLDivElement>(null);
  const selectedBank = POPULAR_BANKS.find(b => b.bin === bankBin) || POPULAR_BANKS[0];

  // Xử lý tải ảnh trực tiếp từ máy tính lên (chuyển sang base64 chạy ngay tại Client)
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

  // Quick Amount Buttons cho VietQR
  const quickAmounts = [20000, 35000, 50000, 100000, 200000, 500000];

  // 10 Tabs danh mục loại mã QR
  const tabOptions = [
    { id: 'url' as QRCategory, label: 'Liên kết / URL', icon: LinkIcon },
    { id: 'text' as QRCategory, label: 'Bản văn', icon: AlignLeft },
    { id: 'image' as QRCategory, label: 'Hình ảnh', icon: ImageIcon },
    { id: 'pdf' as QRCategory, label: 'PDF', icon: FileText },
    { id: 'facebook' as QRCategory, label: 'Facebook', icon: Share2 },
    { id: 'maps' as QRCategory, label: 'Google Maps', icon: MapPin },
    { id: 'wifi' as QRCategory, label: 'Wi-Fi', icon: Wifi },
    { id: 'x' as QRCategory, label: 'X (Twitter)', icon: Globe },
    { id: 'video' as QRCategory, label: 'Video', icon: Video },
    { id: 'vietqr' as QRCategory, label: 'VietQR Ngân Hàng', icon: Building2, highlight: true }
  ];

  // 2 Tab tùy chỉnh kiểu mã QR (áp dụng cho các mã QR thông thường, trừ VietQR)
  const [customStyleTab, setCustomStyleTab] = useState<CustomQRSubTab>('classic');
  const [logoUrl, setLogoUrl] = useState<string>(''); // Mặc định để trống, khi nào người dùng tải thì mới hiện
  const [logoBgOpacity, setLogoBgOpacity] = useState<number>(0.85);

  // 4 Tab con bên trong tab Cổ điển (Khung, Hình dạng, Logo, Cấp độ)
  const [classicSubTab, setClassicSubTab] = useState<ClassicSubTab>('level');
  // 4 Cấp độ sửa lỗi QR: H (Tốt nhất - 30%), Q (Cao - 25%), M (Trung bình - 15%), L (Nhỏ nhất - 7%)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<QRErrorLevel>('Q');

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

  // Tự động render QR Code Client-side khi content thay đổi
  useEffect(() => {
    if (activeCategory === 'vietqr') return;
    const raw = getRawContent();
    if (!raw) return;

    // Khi ở tab Logo QR: Vẽ Canvas kết hợp ảnh logo & chấm đen/chấm trắng tương phản
    if (customStyleTab === 'logo') {
      try {
        const qr = QRCode.create(raw, { errorCorrectionLevel: 'H' });
        const size = qr.modules.size;
        const canvas = document.createElement('canvas');
        const canvasSize = 600;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const drawLogoQR = (logoImg?: HTMLImageElement) => {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvasSize, canvasSize);

            const margin = 2;
            const totalCells = size + margin * 2;
            const cellSize = canvasSize / totalCells;

            // Kích thước và vùng phủ của Logo ở giữa
            const logoBoxSize = canvasSize * 0.72; // Vùng logo tròn chiếm ~72% QR
            const logoBoxX = (canvasSize - logoBoxSize) / 2;
            const logoBoxY = (canvasSize - logoBoxSize) / 2;
            const centerX = canvasSize / 2;
            const centerY = canvasSize / 2;
            const logoRadius = logoBoxSize / 2;

            // 1. Vẽ ảnh Logo ở chính giữa nếu có
            if (logoImg) {
              ctx.save();
              ctx.drawImage(logoImg, logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);
              ctx.restore();
            }

            // Hàm kiểm tra xem ô (r, c) có thuộc 3 góc định vị (Finder patterns) hay không
            const isFinderPattern = (r: number, c: number) => {
              if (r < 7 && c < 7) return true; // Góc trên trái
              if (r < 7 && c >= size - 7) return true; // Góc trên phải
              if (r >= size - 7 && c < 7) return true; // Góc dưới trái
              return false;
            };

            // 2. Duyệt từng ô ma trận QR:
            // - Nếu là bit 1 (đen): Vẽ chấm đen nhỏ (hoặc cột đen bo tròn)
            // - Nếu là bit 0 (trắng) VÀ nằm trong vùng ảnh logo: Vẽ chấm TRẮNG nổi bật trên nền logo
            for (let r = 0; r < size; r++) {
              for (let c = 0; c < size; c++) {
                const cellX = (c + margin) * cellSize;
                const cellY = (r + margin) * cellSize;
                const dotCenterX = cellX + cellSize / 2;
                const dotCenterY = cellY + cellSize / 2;
                const isBitOne = !!qr.modules.get(r, c);

                if (isFinderPattern(r, c)) {
                  // 3 góc định vị: Vẽ chuẩn đen sắc nét viền trắng quanh finder để camera bắt nét
                  if (isBitOne) {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                  } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                  }
                  continue;
                }

                // Kiểm tra xem chấm này có nằm bên trong vùng hình tròn của Logo không
                const distToCenter = Math.hypot(dotCenterX - centerX, dotCenterY - centerY);
                const isInsideLogo = logoImg && distToCenter <= logoRadius * 0.98;

                if (isBitOne) {
                  // Bit 1: Vẽ chấm đen nhỏ li ti
                  ctx.fillStyle = '#000000';
                  const dotRadius = cellSize * 0.32;
                  ctx.beginPath();
                  ctx.arc(dotCenterX, dotCenterY, dotRadius, 0, Math.PI * 2);
                  ctx.fill();
                } else if (isInsideLogo) {
                  // Bit 0 nhưng nằm trên ảnh logo: Vẽ chấm TRẮNG nổi bật (Đúng như ảnh mẫu Telegram/Facebook)
                  ctx.fillStyle = '#ffffff';
                  const dotRadius = cellSize * 0.28;
                  ctx.beginPath();
                  ctx.arc(dotCenterX, dotCenterY, dotRadius, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }

            setClientQrDataUrl(canvas.toDataURL('image/png'));
          };

          // Nếu có logoUrl (base64 hoặc link), nạp ảnh rồi vẽ canvas
          if (logoUrl) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => drawLogoQR(img);
            img.onerror = () => drawLogoQR();
            img.src = logoUrl;
          } else {
            drawLogoQR();
          }

          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // QR Cổ điển thông thường: Áp dụng đúng cấp độ sửa lỗi người dùng chọn
    QRCode.toDataURL(raw, {
      width: 600,
      margin: 2,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then((url) => setClientQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [
    activeCategory,
    customStyleTab,
    errorCorrectionLevel,
    logoUrl,
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

  // VietQR Image URL
  const vietQrUrl = getVietQRUrl(
    bankBin,
    accountNo,
    'compact2',
    typeof amount === 'number' ? amount : 0,
    memo,
    accountName
  );

  const displayQrUrl = activeCategory === 'vietqr' ? vietQrUrl : clientQrDataUrl;

  // Lưu thông tin shop vào localStorage
  const handleSaveDefault = () => {
    updateProfile({
      bankBin,
      bankName: selectedBank.shortName,
      accountNo,
      accountName,
      shopName,
      hotline,
      wifiSSID: wifiSsid,
      wifiPassword: wifiPass
    });
    alert('Đã lưu thông tin cấu hình shop thành công!');
  };

  // Tải ảnh QR Code / Standee nét PNG
  const handleDownloadImage = async () => {
    if (!previewCardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewCardRef.current, {
        quality: 0.98,
        pixelRatio: 3,
        cacheBust: true
      });
      const link = document.createElement('a');
      link.download = `Ma-QR-${activeCategory.toUpperCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi xuất ảnh PNG');
    } finally {
      setIsExporting(false);
    }
  };

  // Sao chép nội dung
  const handleCopyContent = () => {
    const raw = activeCategory === 'vietqr' ? `${selectedBank.shortName} - ${accountNo} - ${accountName}` : getRawContent();
    navigator.clipboard.writeText(raw);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Theme Standee cho VietQR
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
      {/* Subtitle intro giống trên ảnh người dùng gửi */}
      <div className="text-center space-y-1 mb-2">
        <p className="text-xs sm:text-sm font-medium text-slate-500">
          Dễ dàng tạo, quản lý và chia sẻ mã QR chuyên nghiệp cho cửa hàng & kinh doanh của bạn
        </p>
      </div>

      {/* DẢI NÚT CHỌN LOẠI MÃ QR (Thanh cuộn ngang hoặc dàn hàng hệt ảnh) */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {tabOptions.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all min-w-[96px] ${isSelected
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

      {/* MAIN CONTAINER: FORM NHẬP (BÊN TRÁI) & XEM TRƯỚC (BÊN PHẢI) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (7 cols): CÁC TRƯỜNG DỮ LIỆU TÙY CHỌN */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. NẾU LÀ LIÊN KẾT / URL */}
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
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Khách quét mã bằng camera điện thoại sẽ mở trực tiếp trang web này.
                </p>
              </div>
            </div>
          )}

          {/* 2. NẾU LÀ BẢN VĂN (TEXT) */}
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
                  placeholder="Nhập thông điệp, lời cảm ơn, mật mã ưu đãi hoặc ghi chú..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* 3. NẾU LÀ HÌNH ẢNH */}
          {activeCategory === 'image' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Tải Ảnh Menu / Bảng Giá / Banner Lên
                </h3>
              </div>
              <div className="space-y-3">
                {/* Nút bấm tải ảnh trực tiếp từ máy */}
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

          {/* 4. NẾU LÀ PDF */}
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
                  Đường link File PDF (Google Drive công khai, Cloudinary...):
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

          {/* 5. NẾU LÀ FACEBOOK */}
          {activeCategory === 'facebook' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Share2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Quét Mã Vào Thẳng Fanpage / Trang Cá Nhân Facebook
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Link Facebook của bạn:
                </label>
                <input
                  type="url"
                  value={fbInput}
                  onChange={(e) => setFbInput(e.target.value)}
                  placeholder="https://facebook.com/your_shop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* 6. NẾU LÀ GOOGLE MAPS */}
          {activeCategory === 'maps' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Mã QR Dẫn Đường Đến Cửa Hàng (Google Maps)
                </h3>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Link vị trí Google Maps:
                </label>
                <input
                  type="url"
                  value={mapsInput}
                  onChange={(e) => setMapsInput(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          {/* 7. NẾU LÀ WI-FI */}
          {activeCategory === 'wifi' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Mã QR Kết Nối Wifi Tự Động (Quét là vào mạng)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên mạng Wi-Fi (SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Tên Wifi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mật khẩu Wi-Fi:
                  </label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Mật khẩu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Chuẩn bảo mật:
                  </label>
                  <select
                    value={wifiType}
                    onChange={(e) => setWifiType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Phổ biến nhất)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Không có mật khẩu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 8. NẾU LÀ X / TWITTER HOẶC VIDEO */}
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
                  Liên Kết Video (YouTube / TikTok / Reel)
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

          {/* THANH 2 TAB TÙY CHỈNH: [QR CỔ ĐIỂN] VÀ [LOGO QR] ĐẶT DƯỚI CÁC Ô NHẬP LIỆU */}
          {activeCategory !== 'vietqr' && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 pl-2">Kiểu dáng:</span>
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => setCustomStyleTab('classic')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${customStyleTab === 'classic'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>QR Cổ điển</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomStyleTab('logo')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${customStyleTab === 'logo'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Logo QR</span>
                  </button>
                </div>
              </div>

              {/* KHI Ở TAB QR CỔ ĐIỂN: HIỂN THỊ 4 MỤC CON [KHUNG, HÌNH DẠNG, LOGO, CẤP ĐỘ] */}
              {customStyleTab === 'classic' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  {/* Dải 4 Tab con & Nút Đặt lại */}
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${classicSubTab === sub.id
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
                      onClick={() => setErrorCorrectionLevel('Q')}
                      className="text-xs text-slate-500 hover:text-purple-600 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Đặt lại</span>
                    </button>
                  </div>

                  {/* NỘI DUNG TAB [CẤP ĐỘ] - ĐÚNG THEO ẢNH BẠN GỬI */}
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

                      {/* 4 Khối Cấp Độ Chọn Lựa */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* 1. TỐT NHẤT (Level H - 30%) */}
                        <button
                          type="button"
                          onClick={() => setErrorCorrectionLevel('H')}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${errorCorrectionLevel === 'H'
                              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          {/* Mini QR Icon Preview */}
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center p-1.5 flex-shrink-0">
                            <div className="w-full h-full border border-white/40 grid grid-cols-3 gap-0.5 p-0.5">
                              <span className="bg-white"></span><span className="bg-white"></span><span className="bg-white"></span>
                              <span className="bg-white"></span><span></span><span className="bg-white"></span>
                              <span className="bg-white"></span><span className="bg-white"></span><span className="bg-white"></span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Tốt nhất (H)</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Mẫu chịu được hư hại tối đa (30%)
                            </div>
                          </div>
                        </button>

                        {/* 2. CAO (Level Q - 25%) */}
                        <button
                          type="button"
                          onClick={() => setErrorCorrectionLevel('Q')}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${errorCorrectionLevel === 'Q'
                              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center p-1.5 flex-shrink-0">
                            <div className="w-full h-full border border-white/40 grid grid-cols-3 gap-0.5 p-0.5">
                              <span className="bg-white"></span><span></span><span className="bg-white"></span>
                              <span></span><span className="bg-white"></span><span></span>
                              <span className="bg-white"></span><span></span><span className="bg-white"></span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Cao (Q)</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Mẫu chịu được hư hại tối ưu (25%)
                            </div>
                          </div>
                        </button>

                        {/* 3. TRUNG BÌNH (Level M - 15%) */}
                        <button
                          type="button"
                          onClick={() => setErrorCorrectionLevel('M')}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${errorCorrectionLevel === 'M'
                              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-700 text-white flex items-center justify-center p-1.5 flex-shrink-0">
                            <div className="w-full h-full border border-white/40 grid grid-cols-2 gap-0.5 p-0.5">
                              <span className="bg-white"></span><span></span>
                              <span></span><span className="bg-white"></span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Trung bình (M)</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Mẫu lộn xộn cân bằng (15%)
                            </div>
                          </div>
                        </button>

                        {/* 4. NHỎ NHẤT (Level L - 7%) */}
                        <button
                          type="button"
                          onClick={() => setErrorCorrectionLevel('L')}
                          className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all ${errorCorrectionLevel === 'L'
                              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-600 text-white flex items-center justify-center p-1.5 flex-shrink-0">
                            <div className="w-full h-full border border-white/40 flex items-center justify-center">
                              <div className="w-4 h-4 bg-white rounded-sm"></div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Nhỏ nhất (L)</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Mẫu ít lộn xộn hơn (7%)
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* NỘI DUNG CÁC TAB KHUNG, HÌNH DẠNG, LOGO CỦA CỔ ĐIỂN (Sẽ tiếp tục cấu hình tiếp theo ý bạn) */}
                  {classicSubTab !== 'level' && (
                    <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                      Đang ở mục <strong>{classicSubTab === 'frame' ? 'Khung' : classicSubTab === 'shape' ? 'Hình dạng' : 'Logo'}</strong> của QR Cổ điển.
                    </div>
                  )}
                </div>
              )}

              {/* NẾU ĐANG CHỌN TAB LOGO QR THÌ HIỆN Ô TẢI LOGO TRỰC TIẾP */}
              {customStyleTab === 'logo' && (
                <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-1.5">
                      Tải Logo thương hiệu lồng vào nền mã QR:
                    </label>

                    {/* Nút bấm tải ảnh logo trực tiếp từ máy */}
                    <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-purple-300 hover:border-purple-500 bg-white rounded-xl cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-900">
                        {logoUrl ? 'Đổi ảnh logo khác từ máy' : 'Chọn tệp ảnh logo từ máy'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadLocalImage(e, 'logo')}
                        className="hidden"
                      />
                    </label>

                    {logoUrl && (
                      <div className="flex items-center justify-between p-2 mt-2 bg-white rounded-xl border border-purple-200 text-xs text-purple-800">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Đã nạp logo thành công
                        </span>
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-[10px] text-rose-500 hover:underline font-bold"
                        >
                          Xóa logo
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-purple-600">
                    ✨ Các chấm đen của mã QR sẽ tự động thu nhỏ lại và ảnh logo thương hiệu sẽ hòa quyện lồng ở lớp nền phía sau (như mẫu).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 9. NẾU LÀ VIETQR (MODULE ĐẶC THÙ THANH TOÁN QUẦY) */}
          {activeCategory === 'vietqr' && (
            <div className="space-y-4">
              {/* Bank Details */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Tài Khoản Ngân Hàng Thụ Hưởng
                    </h3>
                  </div>
                  <button
                    onClick={handleSaveDefault}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lưu làm mặc định</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chọn Ngân hàng:
                    </label>
                    <select
                      value={bankBin}
                      onChange={(e) => setBankBin(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
                    >
                      {POPULAR_BANKS.map((b) => (
                        <option key={b.bin} value={b.bin}>
                          {b.shortName} — {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Số tài khoản (STK):
                    </label>
                    <input
                      type="text"
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value.replace(/\s+/g, ''))}
                      placeholder="Số tài khoản..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tên chủ tài khoản:
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                      placeholder="NGUYEN VAN A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-900"
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

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Gợi ý:</span>
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${amount === amt
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

              {/* Tùy chỉnh màu standee & khổ in */}
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
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border flex flex-col items-center gap-1 ${standeeStyle === st.id
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
              {/* TRƯỜNG HỢP 1: NẾU LÀ VIETQR STANDEE */}
              {activeCategory === 'vietqr' ? (
                <div
                  ref={previewCardRef}
                  className={`relative w-full max-w-[340px] rounded-2xl p-5 flex flex-col items-center justify-between transition-all duration-300 ${currentTheme.card
                    } min-h-[440px]`}
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedBank.logo}
                        alt={selectedBank.shortName}
                        className="h-6 object-contain"
                      />
                      <span className="text-[11px] font-black text-slate-800">
                        {selectedBank.shortName}
                      </span>
                    </div>

                    <div className="w-48 h-48 relative flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayQrUrl}
                        alt="VietQR"
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
              ) : (
                /* TRƯỜNG HỢP 2: NẾU LÀ CÁC MÃ QR KHÁC (URL, TEXT, WIFI, ẢNH...) */
                <div
                  ref={previewCardRef}
                  className="w-full max-w-[320px] bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col items-center text-center space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase">
                      {tabOptions.find(t => t.id === activeCategory)?.label}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 pt-1">
                      QUÉT MÃ ĐỂ TRUY CẬP
                    </h4>
                  </div>

                  <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center relative overflow-hidden">
                    {displayQrUrl ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {/* ẢNH MÃ QR ĐÃ ĐƯỢC CANVAS VẼ NGUYÊN KHỐI (Gồm ảnh logo + chấm đen + chấm trắng chuẩn xác) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={displayQrUrl}
                          alt="Mã QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">Đang tạo mã...</div>
                    )}
                  </div>

                  <div className="w-full pt-2 border-t border-slate-100 text-xs text-slate-500 truncate">
                    {activeCategory === 'wifi' ? (
                      <div>
                        Wifi: <strong className="text-slate-800">{wifiSsid}</strong>
                      </div>
                    ) : (
                      <div className="truncate font-mono text-[11px]">
                        {getRawContent()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CÁC NÚT THAO TÁC */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Đang xuất...' : 'Tải Ảnh (PNG)'}</span>
              </button>

              <button
                onClick={handleCopyContent}
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? 'Đã sao chép' : 'Sao chép Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
