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

// Kiểu dáng chấm thân QR (Body Shape)
export type QRBodyShape =
  | 'square' // Ô vuông chuẩn
  | 'rounded' // Bo góc nhẹ
  | 'dots' // Chấm tròn
  | 'classy' // Hình kim cương / thoi
  | 'classy-rounded' // Hình thoi bo góc
  | 'extra-rounded' // Siêu bo tròn
  | 'star' // Ngôi sao / hoa thị
  | 'mosaic'; // Khảm mosaic

// Kiểu dáng mắt ngoài (Eye Frame / Outer Eye)
export type QROuterEyeShape =
  | 'square' // Vuông chuẩn
  | 'rounded' // Vuông bo góc tròn
  | 'circle' // Tròn hoàn toàn
  | 'leaf'; // Hình chiếc lá (1 góc nhọn)

// Kiểu dáng mắt trong (Eye Dot / Inner Eye)
export type QRInnerEyeShape =
  | 'square' // Vuông
  | 'rounded' // Vuông bo góc
  | 'circle' // Tròn
  | 'leaf'; // Chiếc lá

export type PresetType =
  | 'none'
  | 'safety-hat'
  | 'orange-floral'
  | 'green-fresh'
  | 'yellow-vip'
  | 'purple-love'
  | 'pink-party'
  | 'coffee-cup'
  | 'shopping-bag';

export type ClassicFrameType =
  | 'none'
  | 'top-header'
  | 'bottom-bar'
  | 'chat-bubble'
  | 'phone-mockup'
  | 'border-box'
  | 'badge-top';

export interface VietQRStandeeTheme {
  card: string;
  badge: string;
  accent: string;
  footerBg: string;
}

