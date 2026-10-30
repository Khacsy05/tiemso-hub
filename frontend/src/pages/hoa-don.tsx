import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { InvoiceGenerator } from '@/components/modules/invoice/InvoiceGenerator';

export default function HoaDonPage() {
  return (
    <DashboardLayout title="Tạo hóa đơn bán lẻ nhanh — Tiệm Số Hub">
      <InvoiceGenerator />
    </DashboardLayout>
  );
}

