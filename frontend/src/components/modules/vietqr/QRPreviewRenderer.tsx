import React from 'react';
import { ClassicFrameType, CustomQRSubTab, PresetType, QRCategory } from './types';

interface QRPreviewRendererProps {
  displayQrUrl: string;
  customStyleTab: CustomQRSubTab;
  framePreset: PresetType;
  frameType: ClassicFrameType;
  frameBorderColor: string;
  frameBgColor: string;
  isTransparentBg: boolean;
  frameText: string;
  frameTextColor: string;
  frameFontFamily: string;
  activeCategory: QRCategory;
  rawContent: string;
  wifiSsid?: string;
  categoryLabel?: string;
}

export const QRPreviewRenderer: React.FC<QRPreviewRendererProps> = ({
  displayQrUrl,
  customStyleTab,
  framePreset,
  frameType,
  frameBorderColor,
  frameBgColor,
  isTransparentBg,
  frameText,
  frameTextColor,
  frameFontFamily,
  activeCategory,
  rawContent,
  wifiSsid,
  categoryLabel
}) => {
  return (
    <div
      className="w-full max-w-[340px] flex flex-col items-center text-center transition-all duration-300"
      style={{ fontFamily: frameFontFamily }}
    >
      {/* 1. NẾU CHỌN MẪU SẴN CÓ: NÓN BẢO HỘ VÀNG */}
      {framePreset === 'safety-hat' && (
        <div className="relative inline-flex flex-col items-center pt-16 px-4 pb-3">
          {/* Nón bảo hộ vàng đặt ở trên đỉnh khung viền, vành nón chạm mép viền trên */}
          <div className="absolute top-0 z-20 w-32 h-20 filter drop-shadow-md pointer-events-none">
            <svg viewBox="0 0 100 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M22 48C22 25 33 10 50 10C67 10 78 25 78 48Z" fill="#FBBF24" />
              <path d="M45 10.5C45 25 43.5 42 41 48H59C56.5 42 55 25 55 10.5C53 10 47 10 45 10.5Z" fill="#F59E0B" />
              <path
                d="M32 20C36 14 43 12 50 12C52 12 53 12.2 55 12.5C51 14 45 17 40 23C36 28 34 35 33 42C29 38 27 30 32 20Z"
                fill="#FDE68A"
                opacity="0.6"
              />
              <path d="M10 48C10 46 16 44 26 44H74C84 44 90 46 90 48C90 52.5 80 55 50 55C20 55 10 52.5 10 48Z" fill="#D97706" />
              <path d="M14 48C14 47 20 45.2 28 45.2H72C80 45.2 86 47 86 48C86 51.5 76 53.5 50 53.5C24 53.5 14 51.5 14 48Z" fill="#FBBF24" />
            </svg>
          </div>

          {/* Khung viền màu tím bo tròn ôm vừa khít mã QR bên trong, bảo đảm không bị nón đè */}
          <div
            className="rounded-[32px] p-2.5 border-[5px] shadow-sm flex items-center justify-center relative"
            style={{
              borderColor: frameBorderColor || '#581c87',
              backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff',
              width: '240px',
              height: '240px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden rounded-[22px]"
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
              }}
            >
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MẪU SẴN CÓ: CÀ PHÊ QUÁN (COFFEE CUP - TÁCH CÀ PHÊ KHÓI TRÊN ĐỈNH) */}
      {framePreset === 'coffee-cup' && (
        <div className="relative inline-flex flex-col items-center pt-16 px-4 pb-3">
          {/* Tách cà phê bốc khói trên đỉnh khung */}
          <div className="absolute top-1 z-20 w-24 h-16 flex flex-col items-center pointer-events-none filter drop-shadow">
            <svg viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Làn khói bay */}
              <path d="M30 18C28 12 34 8 32 2" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              <path d="M40 16C38 10 44 6 42 0" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              <path d="M50 18C48 12 54 8 52 2" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
              {/* Thân ly cà phê */}
              <path d="M20 22H60L55 48C55 52 48 55 40 55C32 55 25 52 25 48L20 22Z" fill="#78350f" />
              {/* Quai cầm ly */}
              <path d="M58 26C65 26 68 31 68 36C68 41 63 44 56 44" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Vành đĩa lót ly */}
              <path d="M15 54C15 52 26 51 40 51C54 51 65 52 65 54C65 56 54 58 40 58C26 58 15 56 15 54Z" fill="#b45309" />
            </svg>
          </div>

          <div
            className="rounded-[30px] p-2.5 border-[5px] shadow-sm flex items-center justify-center relative"
            style={{
              borderColor: frameBorderColor || '#78350f',
              backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fffbeb',
              width: '240px',
              height: '240px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden rounded-[20px]"
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fffbeb'
              }}
            >
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR Cà Phê" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MẪU SẴN CÓ: GIỎ MUA SẮM SHOP (SHOPPING BAG) */}
      {framePreset === 'shopping-bag' && (
        <div className="relative inline-flex flex-col items-center pt-16 px-4 pb-3">
          {/* Quai túi xách mua sắm treo trên đỉnh */}
          <div className="absolute top-1 z-20 w-28 h-16 flex flex-col items-center pointer-events-none filter drop-shadow">
            <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Quai túi cong */}
              <path
                d="M26 42V18C26 9 32 3 40 3C48 3 54 9 54 18V42"
                stroke="#e11d48"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Nút thắt nơ xinh xắn */}
              <circle cx="26" cy="40" r="3.5" fill="#fb7185" />
              <circle cx="54" cy="40" r="3.5" fill="#fb7185" />
            </svg>
          </div>

          <div
            className="rounded-[28px] p-2.5 border-[5px] shadow-sm flex items-center justify-center relative"
            style={{
              borderColor: frameBorderColor || '#e11d48',
              backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fef2f2',
              width: '240px',
              height: '240px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden rounded-[20px]"
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fef2f2'
              }}
            >
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR Mua Sắm" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. MẪU SẴN CÓ: VƯƠNG MIỆN HOÀNG GIA (VIP GOLD) */}
      {framePreset === 'yellow-vip' && (
        <div className="relative inline-flex flex-col items-center pt-14 px-4 pb-3">
          {/* Vương miện vàng chạm mép trên khung */}
          <div className="absolute top-0 z-20 w-24 h-16 flex items-center justify-center pointer-events-none filter drop-shadow">
            <svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M10 40L18 12L32 26L40 6L48 26L62 12L70 40H10Z"
                fill="#FBBF24"
                stroke="#D97706"
                strokeWidth="2"
              />
              <circle cx="18" cy="11" r="3" fill="#EF4444" />
              <circle cx="40" cy="5" r="3.5" fill="#3B82F6" />
              <circle cx="62" cy="11" r="3" fill="#10B981" />
              <rect x="14" y="34" width="52" height="4" rx="2" fill="#D97706" />
            </svg>
          </div>

          <div
            className="rounded-[28px] p-2.5 border-[5px] shadow-sm flex items-center justify-center relative"
            style={{
              borderColor: frameBorderColor || '#ca8a04',
              backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fefce8',
              width: '240px',
              height: '240px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden rounded-[20px]"
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#fefce8'
              }}
            >
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR VIP" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. MẪU SẴN CÓ: HOA VĂN CAM ẤM */}
      {framePreset === 'orange-floral' && (
        <div className="relative inline-flex flex-col items-center p-3">
          <div
            className="p-3 border-4 border-amber-400 rounded-3xl relative flex items-center justify-center bg-orange-50/50 shadow-sm"
            style={{ width: '250px', height: '250px' }}
          >
            <span className="absolute -top-3 -left-2 text-2xl">🌸</span>
            <span className="absolute -bottom-3 -right-2 text-2xl">🏮</span>
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. MẪU SẴN CÓ: VÒNG LÁ XANH FRESH */}
      {framePreset === 'green-fresh' && (
        <div className="relative inline-flex flex-col items-center p-3">
          <div
            className="p-3 border-4 border-emerald-400 rounded-[36px] relative flex items-center justify-center bg-emerald-50/40 shadow-sm"
            style={{ width: '250px', height: '250px' }}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🌿</span>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-2xl">🍃</span>
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-[26px] bg-white p-2">
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. MẪU SẴN CÓ: TÍM YÊU PURPLE */}
      {framePreset === 'purple-love' && (
        <div className="relative inline-flex flex-col items-center p-3">
          <div
            className="p-3 border-4 border-purple-400 rounded-3xl relative flex items-center justify-center bg-purple-50/40 shadow-sm"
            style={{ width: '250px', height: '250px' }}
          >
            <span className="absolute -top-3 -right-2 text-2xl">💜</span>
            <span className="absolute -bottom-3 -left-2 text-2xl">✨</span>
            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
              {displayQrUrl ? (
                <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
              ) : (
                <div className="text-xs text-slate-400">Đang tạo mã...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === TRƯỜNG HỢP: KHÔNG CHỌN MẪU SẴN CÓ (framePreset === 'none') => HIỂN THỊ THEO KHUNG === */}
      {framePreset === 'none' && (
        <>
          {/* KHUNG: TOP HEADER VỚI MẪU TAM GIÁC + 4 GÓC NGẮM */}
          {frameType === 'top-header' && (
            <div className="relative inline-flex flex-col items-center p-3 rounded-2xl transition-all">
              <div className="relative mb-3 flex flex-col items-center">
                <div
                  className="px-5 py-2 rounded-lg font-black text-xs tracking-wider uppercase text-center shadow-sm min-w-[190px]"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    color: frameTextColor || '#ffffff'
                  }}
                >
                  {frameText || 'QUÉT TÔI ĐI'}
                </div>
                <div
                  className="w-3 h-2"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                  }}
                ></div>
              </div>

              <div
                className="relative p-2.5 flex items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                <div className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px]" style={{ borderColor: frameBorderColor || '#475569' }}></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px]" style={{ borderColor: frameBorderColor || '#475569' }}></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px]" style={{ borderColor: frameBorderColor || '#475569' }}></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px]" style={{ borderColor: frameBorderColor || '#475569' }}></div>

                <div className="w-52 h-52 flex items-center justify-center overflow-hidden">
                  {displayQrUrl ? (
                    <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-slate-400">Đang tạo mã...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KHUNG: VIỀN LIỀN KHỐI VỚI ĐẾ DƯỚI ĐÁY */}
          {frameType === 'bottom-bar' && (
            <div className="relative inline-flex flex-col items-center transition-all">
              <div
                className="p-3 border-4 border-b-0 rounded-t-2xl flex items-center justify-center"
                style={{
                  borderColor: frameBorderColor || '#475569',
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                <div className="w-52 h-52 flex items-center justify-center overflow-hidden">
                  {displayQrUrl ? (
                    <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-slate-400">Đang tạo mã...</div>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col items-center">
                <div
                  className="w-3.5 h-2 -mb-0.5 z-10"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'
                  }}
                ></div>
                <div
                  className="w-full py-2.5 px-4 rounded-b-xl font-black text-xs tracking-wider uppercase text-center shadow-sm"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    color: frameTextColor || '#ffffff'
                  }}
                >
                  {frameText || 'QUÉT TÔI ĐI'}
                </div>
              </div>
            </div>
          )}

          {/* KHUNG: CHỈ CÓ THANH ĐẾ NHỎ DƯỚI ĐÁY */}
          {frameType === 'chat-bubble' && (
            <div className="relative inline-flex flex-col items-center p-3 transition-all">
              <div
                className="w-52 h-52 p-2 rounded-xl flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                {displayQrUrl ? (
                  <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-xs text-slate-400">Đang tạo mã...</div>
                )}
              </div>

              <div className="mt-2 flex flex-col items-center">
                <div
                  className="w-3 h-2"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    clipPath: 'polygon(50% 0, 0 100%, 100% 100%)'
                  }}
                ></div>
                <div
                  className="px-6 py-1.5 rounded-full font-black text-xs tracking-wide uppercase text-center shadow-sm"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    color: frameTextColor || '#ffffff'
                  }}
                >
                  {frameText || 'QUÉT TÔI ĐI'}
                </div>
              </div>
            </div>
          )}

          {/* KHUNG: THANH BANNER TRÊN CÓ MẪU BUBBLE LỆCH PHẢI + VIỀN KHÉP KÍN */}
          {frameType === 'border-box' && (
            <div className="relative inline-flex flex-col items-center transition-all">
              <div className="w-full flex flex-col items-end">
                <div
                  className="w-full py-2.5 px-4 rounded-t-xl font-black text-xs tracking-wider uppercase text-left flex items-center justify-between shadow-sm"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    color: frameTextColor || '#ffffff'
                  }}
                >
                  <span>{frameText || 'QUÉT TÔI ĐI'}</span>
                  <span className="text-xs opacity-75">💬</span>
                </div>
                <div
                  className="w-3.5 h-2.5 mr-6 -mt-0.5 z-10"
                  style={{
                    backgroundColor: frameBorderColor || '#475569',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                  }}
                ></div>
              </div>

              <div
                className="p-3 border-4 border-t-0 rounded-b-2xl flex items-center justify-center w-full"
                style={{
                  borderColor: frameBorderColor || '#475569',
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                <div className="w-52 h-52 flex items-center justify-center overflow-hidden">
                  {displayQrUrl ? (
                    <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-slate-400">Đang tạo mã...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KHUNG: PHONE CHASSIS CÓ NÚT HOME Ở THANH ĐÁY */}
          {frameType === 'phone-mockup' && (
            <div className="relative inline-flex flex-col items-center transition-all">
              <div
                className="p-3 border-4 border-b-0 rounded-t-3xl flex items-center justify-center"
                style={{
                  borderColor: frameBorderColor || '#475569',
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                <div className="w-52 h-52 flex items-center justify-center overflow-hidden">
                  {displayQrUrl ? (
                    <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-slate-400">Đang tạo mã...</div>
                  )}
                </div>
              </div>

              <div
                className="w-full py-2.5 px-4 rounded-b-2xl flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: frameBorderColor || '#475569'
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/80 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                  <span
                    className="font-bold text-[11px] tracking-wider uppercase"
                    style={{ color: frameTextColor || '#ffffff' }}
                  >
                    {frameText || 'SCAN WITH PHONE'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* KHUNG: KHUNG VIỀN VUÔNG ĐƠN GIẢN */}
          {frameType === 'badge-top' && (
            <div className="relative inline-flex p-3 rounded-2xl transition-all">
              <div
                className="p-2 border-4 rounded-xl flex items-center justify-center"
                style={{
                  borderColor: frameBorderColor || '#475569',
                  backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
                }}
              >
                <div className="w-52 h-52 flex items-center justify-center overflow-hidden">
                  {displayQrUrl ? (
                    <img src={displayQrUrl} alt="Mã QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-xs text-slate-400">Đang tạo mã...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MẶC ĐỊNH: KHÔNG KHUNG (frameType === 'none') */}
          {frameType === 'none' && (
            <div
              className="w-full rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col items-center space-y-3"
              style={{
                backgroundColor: isTransparentBg ? 'transparent' : frameBgColor || '#ffffff'
              }}
            >
              <div className="space-y-1">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase">
                  {categoryLabel || activeCategory}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 pt-1">
                  QUÉT MÃ ĐỂ TRUY CẬP
                </h4>
              </div>

              <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center relative overflow-hidden">
                {displayQrUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
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
                  <div className="truncate font-mono text-[11px]">{rawContent}</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


