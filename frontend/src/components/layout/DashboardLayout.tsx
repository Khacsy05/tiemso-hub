import React from 'react';
import Head from 'next/head';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CoffeeModal } from '@/components/modals/CoffeeModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = "Tiệm Số Hub — Trợ Lý Số Cho Shop Online & Hộ Kinh Doanh" 
}) => {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Bộ công cụ All-in-One: Tạo mã VietQR để bàn chuẩn A6/A5, tính phí sàn Shopee TikTok, tạo hóa đơn bán lẻ nhanh miễn phí 100%." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Sidebar (Left) */}
      <Sidebar />

      {/* Main Content (Right) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <Footer />
      </div>

      <CoffeeModal />
    </div>
  );
};

export default DashboardLayout;
