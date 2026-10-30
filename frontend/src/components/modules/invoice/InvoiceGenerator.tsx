import React, { useState, useRef } from 'react';
import { Plus, Trash2, Printer, Download, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatVND, getVietQRUrl } from '@/utils/vietqr';
import { toPng } from 'html-to-image';

interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  unit: string;
}

export const InvoiceGenerator: React.FC = () => {
  const { profile } = useApp();

  const [customerName, setCustomerName] = useState('Chị Mai (0912.xxx.888)');
  const [invoiceNo, setInvoiceNo] = useState(`HD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [discount, setDiscount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(20000);
  const [note, setNote] = useState('Cảm ơn quý khách! Hàng được đổi trả trong 3 ngày.');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: 'Cà phê Muối Đặc Biệt', qty: 2, price: 35000, unit: 'Ly' },
    { id: '2', name: 'Trà Sữa Oolong Nướng', qty: 1, price: 40000, unit: 'Ly' },
    { id: '3', name: 'Bánh Croissant Bơ Tỏi', qty: 1, price: 25000, unit: 'Cái' }
  ]);

  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const subTotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const finalTotal = Math.max(0, subTotal - discount + shippingFee);

  const invoiceQR = getVietQRUrl(
    profile.bankBin,
    profile.accountNo,
    'compact2',
    finalTotal,
    `${invoiceNo}`,
    profile.accountName
  );

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: 'Món mới', qty: 1, price: 30000, unit: 'Món' }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(it => it.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: value } : it));
  };

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(invoiceRef.current, {
        pixelRatio: 2.5,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `HoaDon-${invoiceNo}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Có lỗi khi xuất hóa đơn');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Xuất Phiếu Bán Lẻ K80 & Gửi Zalo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Tạo Hóa Đơn Bán Lẻ & Phiếu Thu Nhanh
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Tạo hóa đơn chuyên nghiệp tự động đính kèm mã VietQR đúng tổng tiền để khách quét thanh toán ngay khi nhận hàng.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mã hóa đơn:
                </label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày lập:
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên / SĐT Khách:
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Danh Sách Món / Hàng Hóa:
                </span>
                <button
                  onClick={addItem}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm món</span>
                </button>
              </div>

              <div className="space-y-2 mt-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Tên món/sản phẩm"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                      className="w-14 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono text-center"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="w-24 px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-mono text-right"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount & Shipping */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chiết khấu / Giảm giá (₫):
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phí giao hàng (Ship) (₫):
                </label>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú chân hóa đơn:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Preview: Receipt Paper K80 (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Phiếu Bán Lẻ (Khổ K80)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                K80 Thermal
              </span>
            </div>

            {/* Receipt container */}
            <div className="p-3 bg-slate-50 rounded-2xl flex justify-center border border-slate-200">
              <div
                ref={invoiceRef}
                className="w-full max-w-[320px] bg-white text-slate-900 p-5 rounded-xl shadow-md border border-slate-200 font-sans text-xs space-y-3"
              >
                <div className="text-center pb-2 border-b border-dashed border-slate-300 space-y-0.5">
                  <div className="font-extrabold text-sm uppercase tracking-wide">
                    {profile.shopName}
                  </div>
                  <div className="text-[10px] text-slate-500">{profile.address}</div>
                  <div className="text-[10px] text-slate-500">Hotline: {profile.hotline}</div>
                  <div className="pt-2 font-black text-sm uppercase tracking-wider text-slate-900">
                    HÓA ĐƠN BÁN LẺ
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Số: {invoiceNo} | Ngày: {invoiceDate}
                  </div>
                </div>

                <div className="text-[11px] text-slate-700">
                  <div>Khách hàng: <strong>{customerName}</strong></div>
                </div>

                <div className="border-t border-b border-dashed border-slate-300 py-2 space-y-1.5">
                  <div className="flex justify-between font-bold text-[10px] uppercase text-slate-400">
                    <span>Món</span>
                    <span>T.Tiền</span>
                  </div>
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between items-start text-xs">
                      <div>
                        <div>{it.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {it.qty} x {formatVND(it.price)}
                        </div>
                      </div>
                      <div className="font-mono font-bold">
                        {formatVND(it.qty * itemTotal(it))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Tạm tính:</span>
                    <span className="font-mono">{formatVND(subTotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá:</span>
                      <span className="font-mono">-{formatVND(discount)}</span>
                    </div>
                  )}
                  {shippingFee > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Phí ship:</span>
                      <span className="font-mono">+{formatVND(shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-extrabold text-sm pt-1.5 border-t border-slate-200 text-blue-700">
                    <span>TỔNG THANH TOÁN:</span>
                    <span className="font-mono">{formatVND(finalTotal)}</span>
                  </div>
                </div>

                {/* QR */}
                <div className="pt-2 border-t border-dashed border-slate-300 text-center flex flex-col items-center">
                  <div className="w-32 h-32 bg-white p-1 rounded-lg border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={invoiceQR} alt="QR Bill" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">
                    Quét mã VietQR chuyển khoản {formatVND(finalTotal)}
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  {note}
                  <div className="text-[8px] uppercase tracking-wider text-slate-400 mt-1">
                    Xin cảm ơn và hẹn gặp lại quý khách!
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Đang xuất...' : 'Tải Phiếu (PNG)'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Thu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function itemTotal(it: InvoiceItem) {
  return it.price;
}

