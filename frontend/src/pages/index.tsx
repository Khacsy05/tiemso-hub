import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { VietQRGenerator } from '@/components/modules/vietqr/VietQRGenerator';

export default function VietQRPage() {
  return (
    <DashboardLayout title="Tạo mã VietQR để bàn — Tiệm Số Hub">
      <VietQRGenerator />
    </DashboardLayout>
  );
}

