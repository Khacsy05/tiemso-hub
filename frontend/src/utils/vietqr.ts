export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export function getVietQRUrl(
  bin: string,
  accountNo: string,
  template: string = 'compact2',
  amount: number = 0,
  memo: string = '',
  accountName: string = ''
): string {
  const params = new URLSearchParams();
  if (amount > 0) params.append('amount', amount.toString());
  if (memo) params.append('addInfo', memo);
  if (accountName) params.append('accountName', accountName);

  const queryStr = params.toString();
  return `https://img.vietqr.io/image/${bin}-${accountNo}-${template}.png${queryStr ? '?' + queryStr : ''}`;
}

