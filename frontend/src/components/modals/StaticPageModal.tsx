import React from 'react';
import { X, ShieldCheck, FileText, Info, Mail } from 'lucide-react';

export type StaticPageType = 'privacy' | 'terms' | 'about' | 'contact' | null;

interface StaticPageModalProps {
  type: StaticPageType;
  onClose: () => void;
}

export const StaticPageModal: React.FC<StaticPageModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const contentMap: Record<
    Exclude<StaticPageType, null>,
    { title: string; icon: React.ReactNode; body: React.ReactNode }
  > = {
    privacy: {
      title: 'Chính Sách Bảo Mật (Privacy Policy)',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <p>
            Chào mừng bạn đến với <strong>Tiệm Số Hub</strong>. Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ thông tin cá nhân của bạn một cách tuyệt đối theo quy định của pháp luật.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Nguyên tắc Lưu trữ Trực tiếp trên Thiết bị (Client-side First)</h4>
          <p>
            Toàn bộ dữ liệu ngân hàng, số tài khoản, danh sách món ăn, thông tin hóa đơn và cấu hình shop của bạn được xử lý và lưu trữ trực tiếp trên thiết bị của bạn thông qua <code>localStorage</code> của trình duyệt. Máy chủ hoàn toàn không thu thập số tài khoản hay doanh thu của bạn.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Thu thập dữ liệu gián tiếp & Cookie</h4>
          <p>
            Để tối ưu trải nghiệm và phân tích hiệu năng, trang web có thể sử dụng cookie ẩn danh của các đối tác dịch vụ như Google Analytics hoặc Google AdSense để hiển thị nội dung phù hợp. Người dùng có quyền tắt cookie trong phần cài đặt của trình duyệt bất cứ lúc nào.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Bảo mật thanh toán VietQR</h4>
          <p>
            Các mã QR thanh toán được tạo theo tiêu chuẩn mở VietQR (NAPAS 24/7). Chúng tôi không can thiệp vào quá trình giao dịch hay giữ tiền của bạn.
          </p>
        </div>
      )
    },
    terms: {
      title: 'Điều Khoản Dịch Vụ (Terms of Service)',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <p>
            Khi sử dụng các công cụ trên nền tảng <strong>Tiệm Số Hub</strong>, bạn đồng ý với các điều khoản sử dụng dưới đây:
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Mục đích sử dụng hợp pháp</h4>
          <p>
            Tiệm Số Hub cung cấp công cụ miễn phí hỗ trợ người kinh doanh cá nhân, hộ kinh doanh và chủ shop tạo mã VietQR, tính giá thành, dự toán phí sàn TMĐT và tạo hóa đơn bán lẻ. Bạn cam kết không sử dụng công cụ vào mục đích lừa đảo hoặc vi phạm pháp luật.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Miễn trừ trách nhiệm về tính toán</h4>
          <p>
            Các bảng tính phí sàn TMĐT và công thức tính toán được cập nhật theo biểu phí công bố. Người dùng nên đối chiếu với sao kê thực tế để có quyết định kinh doanh tối ưu nhất.
          </p>
        </div>
      )
    },
    about: {
      title: 'Giới Thiệu Tiệm Số Hub (About Us)',
      icon: <Info className="w-6 h-6 text-purple-600" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <p>
            <strong>Tiệm Số Hub</strong> ra đời với sứ mệnh đồng hành cùng hơn 5 triệu hộ kinh doanh cá thể, chủ tiệm nhỏ, quán cafe và người bán hàng online tại Việt Nam trong công cuộc chuyển đổi số đơn giản.
          </p>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
            <h5 className="font-bold text-blue-700 text-xs mb-1">Phương châm phát triển:</h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li><strong>Đơn giản & Tiện dụng:</strong> Không cần đăng ký tài khoản phức tạp, mở lên là dùng ngay.</li>
              <li><strong>Miễn phí 100%:</strong> Hỗ trợ người khởi nghiệp tiết kiệm tối đa chi phí.</li>
              <li><strong>Bảo mật tối đa:</strong> Dữ liệu chỉ nằm trên máy bạn.</li>
            </ul>
          </div>
        </div>
      )
    },
    contact: {
      title: 'Liên Hệ & Hỗ Trợ (Contact)',
      icon: <Mail className="w-6 h-6 text-amber-600" />,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <p>Chúng tôi luôn lắng nghe ý kiến đóng góp từ các bạn:</p>
          <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <div><strong>Dự án:</strong> Tiệm Số Hub (All-in-One Business Toolkit)</div>
            <div><strong>Email hỗ trợ:</strong> support@tiemsohub.vn</div>
            <div><strong>Hotline / Zalo:</strong> 0988 123 456</div>
            <div><strong>Địa chỉ:</strong> Cầu Giấy, Hà Nội, Việt Nam</div>
          </div>
        </div>
      )
    }
  };

  const current = contentMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-slate-100">
            {current.icon}
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {current.title}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto py-4 pr-1">
          {current.body}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

