import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PlatformFeeCalculator } from '@/components/modules/finance/PlatformFeeCalculator';

export default function PhiSanPage() {
  return (
    <DashboardLayout title="Tính phí sàn Shopee & TikTok Shop — Tiệm Số Hub">
      <PlatformFeeCalculator />
    </DashboardLayout>
  );
}

