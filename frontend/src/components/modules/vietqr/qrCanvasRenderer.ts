import QRCode from 'qrcode';
import {
  QRErrorLevel,
  QRBodyShape,
  QROuterEyeShape,
  QRInnerEyeShape
} from './types';

interface DrawLogoQROptions {
  raw: string;
  logoUrl?: string;
  logoScalePercent?: number; // Tỷ lệ độ to của logo chìm (từ 10% đến 100%)
  errorCorrectionLevel?: QRErrorLevel;
  bodyShape?: QRBodyShape;
  outerEyeShape?: QROuterEyeShape;
  innerEyeShape?: QRInnerEyeShape;
  bodyColor?: string;
  outerEyeColor?: string;
  innerEyeColor?: string;
  backgroundColor?: string;
  isTransparentBg?: boolean;
  canvasSize?: number;
}

interface DrawClassicQROptions {
  raw: string;
  errorCorrectionLevel: QRErrorLevel;
  bodyShape?: QRBodyShape;
  outerEyeShape?: QROuterEyeShape;
  innerEyeShape?: QRInnerEyeShape;
  bodyColor?: string;
  outerEyeColor?: string;
  innerEyeColor?: string;
  backgroundColor?: string;
  isTransparentBg?: boolean;
  centerLogoUrl?: string; // Logo chèn vào giữa
  centerLogoSizePercent?: number; // % kích thước so với QR (ví dụ 10% - 28%)
  centerLogoHasBg?: boolean; // Có nền đệm tròn/vuông che chấm QR bên dưới không
  canvasSize?: number;
}

/**
 * Vẽ Logo QR (chấm đen ma trận li ti, các module bit 0 nằm trong logo được vẽ bằng chấm trắng tương phản)
 */
export const drawLogoQRCanvas = (options: DrawLogoQROptions): Promise<string> => {
  const {
    raw,
    logoUrl,
    logoScalePercent = 60,
    errorCorrectionLevel = 'H',
    bodyShape = 'dots',
    outerEyeShape = 'square',
    innerEyeShape = 'square',
    bodyColor = '#000000',
    outerEyeColor = '#000000',
    innerEyeColor = '#000000',
    backgroundColor = '#ffffff',
    isTransparentBg = false,
    canvasSize = 600
  } = options;

  return new Promise((resolve) => {
    try {
      const qr = QRCode.create(raw, { errorCorrectionLevel });
      const size = qr.modules.size;
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('');
        return;
      }

      const render = (logoImg?: HTMLImageElement) => {
        if (isTransparentBg) {
          ctx.clearRect(0, 0, canvasSize, canvasSize);
        } else {
          ctx.fillStyle = backgroundColor || '#ffffff';
          ctx.fillRect(0, 0, canvasSize, canvasSize);
        }

        const margin = 2;
        const totalCells = size + margin * 2;
        const cellSize = canvasSize / totalCells;

        // Vùng phủ của Logo ở giữa: giới hạn tối đa nằm gọn trong phần thân ma trận QR, chạm mép 3 mắt/khung chứ không bao giờ lấn ra ngoài
        // Vùng ma trận QR có kích thước: size * cellSize. Tỷ lệ tối đa chạm khung = size / totalCells
        const maxQrMatrixRatio = size / totalCells; // ~0.87 - 0.90
        const scaleClamped = (Math.max(5, Math.min(100, logoScalePercent)) / 100) * maxQrMatrixRatio;
        const logoBoxSize = canvasSize * scaleClamped;
        const logoBoxX = (canvasSize - logoBoxSize) / 2;
        const logoBoxY = (canvasSize - logoBoxSize) / 2;
        const centerX = canvasSize / 2;
        const centerY = canvasSize / 2;
        const logoRadius = logoBoxSize / 2;

        if (logoImg) {
          ctx.save();
          // Cắt theo hình tròn/bo góc bán kính chạm khung, tuyệt đối không vẽ tràn ra ngoài
          ctx.beginPath();
          ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);
          ctx.restore();
        }

        const isFinderPattern = (r: number, c: number) => {
          if (r < 7 && c < 7) return true;
          if (r < 7 && c >= size - 7) return true;
          if (r >= size - 7 && c < 7) return true;
          return false;
        };

        // 1. Vẽ các module thân QR
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (isFinderPattern(r, c)) continue;

            const cellX = (c + margin) * cellSize;
            const cellY = (r + margin) * cellSize;
            const dotCenterX = cellX + cellSize / 2;
            const dotCenterY = cellY + cellSize / 2;
            const isBitOne = !!qr.modules.get(r, c);

            const distToCenter = Math.hypot(dotCenterX - centerX, dotCenterY - centerY);
            const isInsideLogo = logoImg && distToCenter <= logoRadius * 0.98;

            if (isBitOne) {
              ctx.fillStyle = bodyColor;
              drawModuleShape(ctx, bodyShape, cellX, cellY, cellSize, dotCenterX, dotCenterY, 0.35);
            } else if (isInsideLogo) {
              ctx.fillStyle = '#ffffff';
              drawModuleShape(ctx, bodyShape, cellX, cellY, cellSize, dotCenterX, dotCenterY, 0.3);
            }
          }
        }

        // 2. Vẽ 3 mắt Finder Patterns theo Mắt Ngoài & Mắt Trong
        const drawEye = (startX: number, startY: number) => {
          const outerDim = 7 * cellSize;
          const eyeBorderWidth = cellSize;
          const ox = startX + eyeBorderWidth / 2;
          const oy = startY + eyeBorderWidth / 2;
          const outerRealSize = outerDim - eyeBorderWidth;
          const ocx = startX + outerDim / 2;
          const ocy = startY + outerDim / 2;

          ctx.lineWidth = eyeBorderWidth;
          ctx.strokeStyle = outerEyeColor;

          switch (outerEyeShape) {
            case 'circle': {
              ctx.beginPath();
              ctx.arc(ocx, ocy, outerRealSize / 2, 0, Math.PI * 2);
              ctx.stroke();
              break;
            }
            case 'rounded': {
              ctx.beginPath();
              ctx.roundRect(ox, oy, outerRealSize, outerRealSize, outerRealSize * 0.28);
              ctx.stroke();
              break;
            }
            case 'leaf': {
              ctx.beginPath();
              ctx.roundRect(ox, oy, outerRealSize, outerRealSize, [
                outerRealSize * 0.4,
                0,
                outerRealSize * 0.4,
                outerRealSize * 0.2
              ]);
              ctx.stroke();
              break;
            }
            case 'square':
            default: {
              ctx.lineJoin = 'miter';
              ctx.strokeRect(ox, oy, outerRealSize, outerRealSize);
              break;
            }
          }

          const innerX = startX + 2 * cellSize;
          const innerY = startY + 2 * cellSize;
          const innerDim = 3 * cellSize;
          const icx = startX + 3.5 * cellSize;
          const icy = startY + 3.5 * cellSize;

          ctx.fillStyle = innerEyeColor;

          switch (innerEyeShape) {
            case 'circle': {
              ctx.beginPath();
              ctx.arc(icx, icy, innerDim * 0.48, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            case 'rounded': {
              ctx.beginPath();
              ctx.roundRect(innerX, innerY, innerDim, innerDim, innerDim * 0.35);
              ctx.fill();
              break;
            }
            case 'leaf': {
              ctx.beginPath();
              ctx.roundRect(innerX, innerY, innerDim, innerDim, [
                innerDim * 0.45,
                0,
                innerDim * 0.45,
                innerDim * 0.2
              ]);
              ctx.fill();
              break;
            }
            case 'square':
            default: {
              ctx.fillRect(innerX, innerY, innerDim, innerDim);
              break;
            }
          }
        };

        drawEye(margin * cellSize, margin * cellSize);
        drawEye((size - 7 + margin) * cellSize, margin * cellSize);
        drawEye(margin * cellSize, (size - 7 + margin) * cellSize);

        resolve(canvas.toDataURL('image/png'));
      };

      if (logoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => render(img);
        img.onerror = () => render();
        img.src = logoUrl;
      } else {
        render();
      }
    } catch (e) {
      console.error('drawLogoQRCanvas error:', e);
      resolve('');
    }
  });
};

// Hàm vẽ module hạt thích ứng kích thước nhỏ cho Logo QR
function drawModuleShape(
  ctx: CanvasRenderingContext2D,
  shape: QRBodyShape,
  cellX: number,
  cellY: number,
  cellSize: number,
  cx: number,
  cy: number,
  scale: number
) {
  const r = cellSize * scale;
  switch (shape) {
    case 'square': {
      const dim = r * 2;
      ctx.fillRect(cx - r, cy - r, dim, dim);
      break;
    }
    case 'rounded': {
      const dim = r * 2;
      ctx.beginPath();
      ctx.roundRect(cx - r, cy - r, dim, dim, dim * 0.3);
      ctx.fill();
      break;
    }
    case 'classy': {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-r, -r, r * 2, r * 2);
      ctx.restore();
      break;
    }
    case 'classy-rounded': {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.roundRect(-r, -r, r * 2, r * 2, r * 0.35);
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'extra-rounded': {
      const dim = r * 2;
      ctx.beginPath();
      ctx.roundRect(cx - r, cy - r, dim, dim, dim * 0.45);
      ctx.fill();
      break;
    }
    case 'star': {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(r, 0);
        ctx.lineTo(r * 0.4, r * 0.4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      break;
    }
    case 'mosaic': {
      const subR = r * 0.9;
      ctx.fillRect(cx - subR, cy - subR, subR * 0.9, subR * 0.9);
      ctx.fillRect(cx, cy - subR, subR * 0.9, subR * 0.9);
      ctx.fillRect(cx - subR, cy, subR * 0.9, subR * 0.9);
      ctx.fillRect(cx, cy, subR * 0.9, subR * 0.9);
      break;
    }
    case 'dots':
    default: {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

/**
 * Vẽ QR Cổ điển hỗ trợ đầy đủ Hình Dạng Cơ Thể, Mắt Ngoài, Mắt Trong và Màu Sắc độc lập
 */
export const drawClassicQRCanvas = (options: DrawClassicQROptions): Promise<string> => {
  const {
    raw,
    errorCorrectionLevel,
    bodyShape = 'square',
    outerEyeShape = 'square',
    innerEyeShape = 'square',
    bodyColor = '#000000',
    outerEyeColor = '#000000',
    innerEyeColor = '#000000',
    backgroundColor = '#ffffff',
    isTransparentBg = false,
    centerLogoUrl,
    centerLogoSizePercent = 20,
    centerLogoHasBg = true,
    canvasSize = 600
  } = options;

  return new Promise((resolve) => {
    try {
      const qr = QRCode.create(raw, { errorCorrectionLevel });
      const size = qr.modules.size;
      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('');
        return;
      }

      // Tô màu nền hoặc trong suốt
      if (isTransparentBg) {
        ctx.clearRect(0, 0, canvasSize, canvasSize);
      } else {
        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }

      const margin = 2;
      const totalCells = size + margin * 2;
      const cellSize = canvasSize / totalCells;

      const isFinderPattern = (r: number, c: number) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= size - 7) return true;
        if (r >= size - 7 && c < 7) return true;
        return false;
      };

      // 1. VẼ CÁC CHẤM THÂN (BODY SHAPE)
      ctx.fillStyle = bodyColor;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (isFinderPattern(r, c)) continue;

          const isBitOne = !!qr.modules.get(r, c);
          if (!isBitOne) continue;

          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;
          const cx = x + cellSize / 2;
          const cy = y + cellSize / 2;

          switch (bodyShape) {
            case 'dots': {
              const rDot = cellSize * 0.42;
              ctx.beginPath();
              ctx.arc(cx, cy, rDot, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            case 'rounded': {
              const pad = cellSize * 0.05;
              const w = cellSize - pad * 2;
              const rad = w * 0.35;
              ctx.beginPath();
              ctx.roundRect(x + pad, y + pad, w, w, rad);
              ctx.fill();
              break;
            }
            case 'extra-rounded': {
              const pad = cellSize * 0.08;
              const w = cellSize - pad * 2;
              const rad = w * 0.5;
              ctx.beginPath();
              ctx.roundRect(x + pad, y + pad, w, w, rad);
              ctx.fill();
              break;
            }
            case 'classy': {
              const half = cellSize * 0.48;
              ctx.beginPath();
              ctx.moveTo(cx, cy - half);
              ctx.lineTo(cx + half, cy);
              ctx.lineTo(cx, cy + half);
              ctx.lineTo(cx - half, cy);
              ctx.closePath();
              ctx.fill();
              break;
            }
            case 'classy-rounded': {
              const half = cellSize * 0.44;
              ctx.beginPath();
              ctx.arc(cx, cy, half, 0, Math.PI * 2);
              ctx.fill();
              break;
            }
            case 'star': {
              const rOut = cellSize * 0.48;
              const rIn = cellSize * 0.2;
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                const radVal = i % 2 === 0 ? rOut : rIn;
                const px = cx + Math.cos(angle) * radVal;
                const py = cy + Math.sin(angle) * radVal;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fill();
              break;
            }
            case 'mosaic': {
              const pad = cellSize * 0.15;
              ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);
              break;
            }
            case 'square':
            default: {
              ctx.fillRect(x, y, cellSize, cellSize);
              break;
            }
          }
        }
      }

      // 2. VẼ 3 MẮT ĐỊNH VỊ (MẮT NGOÀI & MẮT TRONG)
      const drawEye = (startX: number, startY: number) => {
        const outerPadding = cellSize * 0.5;
        const outerDim = 7 * cellSize - cellSize;
        const ox = startX + outerPadding;
        const oy = startY + outerPadding;
        const strokeW = cellSize * 0.95;

        ctx.strokeStyle = outerEyeColor;
        ctx.lineWidth = strokeW;

        switch (outerEyeShape) {
          case 'circle': {
            ctx.beginPath();
            const radius = outerDim / 2;
            ctx.arc(startX + 3.5 * cellSize, startY + 3.5 * cellSize, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
          }
          case 'rounded': {
            ctx.beginPath();
            ctx.roundRect(ox, oy, outerDim, outerDim, outerDim * 0.28);
            ctx.stroke();
            break;
          }
          case 'leaf': {
            ctx.beginPath();
            ctx.roundRect(ox, oy, outerDim, outerDim, [outerDim * 0.4, 0, outerDim * 0.4, outerDim * 0.2]);
            ctx.stroke();
            break;
          }
          case 'square':
          default: {
            ctx.lineJoin = 'miter';
            ctx.strokeRect(ox, oy, outerDim, outerDim);
            break;
          }
        }

        const innerX = startX + 2 * cellSize;
        const innerY = startY + 2 * cellSize;
        const innerDim = 3 * cellSize;
        const icx = startX + 3.5 * cellSize;
        const icy = startY + 3.5 * cellSize;

        ctx.fillStyle = innerEyeColor;

        switch (innerEyeShape) {
          case 'circle': {
            ctx.beginPath();
            ctx.arc(icx, icy, innerDim * 0.48, 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case 'rounded': {
            ctx.beginPath();
            ctx.roundRect(innerX, innerY, innerDim, innerDim, innerDim * 0.35);
            ctx.fill();
            break;
          }
          case 'leaf': {
            ctx.beginPath();
            ctx.roundRect(innerX, innerY, innerDim, innerDim, [innerDim * 0.45, 0, innerDim * 0.45, innerDim * 0.2]);
            ctx.fill();
            break;
          }
          case 'square':
          default: {
            ctx.fillRect(innerX, innerY, innerDim, innerDim);
            break;
          }
        }
      };

      drawEye(margin * cellSize, margin * cellSize);
      drawEye((size - 7 + margin) * cellSize, margin * cellSize);
      drawEye(margin * cellSize, (size - 7 + margin) * cellSize);

      // 3. CHÈN LOGO VÀO GIỮA NẾU CÓ
      if (centerLogoUrl) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';

        const drawLogoOnCanvas = () => {
          // Kích thước logo ở giữa cố định theo centerLogoSizePercent đã chỉnh
          const pct = Math.max(10, Math.min(28, centerLogoSizePercent));
          const logoDim = canvasSize * (pct / 100);
          const lx = (canvasSize - logoDim) / 2;
          const ly = (canvasSize - logoDim) / 2;

          // Nếu có bật Nền Biểu Trưng (Padding nền trắng che bớt hạt ma trận dưới đáy)
          if (centerLogoHasBg) {
            const pad = logoDim * 0.12;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(lx - pad, ly - pad, logoDim + pad * 2, logoDim + pad * 2, (logoDim + pad * 2) * 0.25);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0,0,0,0.06)';
            ctx.stroke();
          }

          // Vẽ logo vào chính giữa
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(lx, ly, logoDim, logoDim, logoDim * 0.2);
          ctx.clip();
          ctx.drawImage(logoImg, lx, ly, logoDim, logoDim);
          ctx.restore();

          resolve(canvas.toDataURL('image/png'));
        };

        logoImg.onload = drawLogoOnCanvas;
        logoImg.onerror = () => {
          // Nếu ảnh lỗi thì vẫn trả về QR không logo
          resolve(canvas.toDataURL('image/png'));
        };
        logoImg.src = centerLogoUrl;
        return;
      }

      resolve(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error('drawClassicQRCanvas error:', e);
      QRCode.toDataURL(raw, {
        width: canvasSize,
        margin: 2,
        errorCorrectionLevel,
        color: { dark: bodyColor || '#000000', light: isTransparentBg ? '#00000000' : backgroundColor }
      })
        .then((url) => resolve(url))
        .catch(() => resolve(''));
    }
  });
};

