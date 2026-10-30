export interface Bank {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
}

export const POPULAR_BANKS: Bank[] = [
  {
    id: 'vietcombank',
    name: 'Ngân hàng Ngoại Thương Việt Nam',
    code: 'VCB',
    bin: '970436',
    shortName: 'Vietcombank',
    logo: 'https://api.vietqr.io/img/VCB.png'
  },
  {
    id: 'mbbank',
    name: 'Ngân hàng Quân Đội',
    code: 'MB',
    bin: '970422',
    shortName: 'MB Bank',
    logo: 'https://api.vietqr.io/img/MB.png'
  },
  {
    id: 'techcombank',
    name: 'Ngân hàng Kỹ Thương Việt Nam',
    code: 'TCB',
    bin: '970407',
    shortName: 'Techcombank',
    logo: 'https://api.vietqr.io/img/TCB.png'
  },
  {
    id: 'acb',
    name: 'Ngân hàng Á Châu',
    code: 'ACB',
    bin: '970416',
    shortName: 'ACB',
    logo: 'https://api.vietqr.io/img/ACB.png'
  },
  {
    id: 'bidv',
    name: 'Ngân hàng Đầu tư và Phát triển VN',
    code: 'BIDV',
    bin: '970418',
    shortName: 'BIDV',
    logo: 'https://api.vietqr.io/img/BIDV.png'
  },
  {
    id: 'vietinbank',
    name: 'Ngân hàng Công Thương Việt Nam',
    code: 'CTG',
    bin: '970415',
    shortName: 'VietinBank',
    logo: 'https://api.vietqr.io/img/ICB.png'
  },
  {
    id: 'vpbank',
    name: 'Ngân hàng Việt Nam Thịnh Vượng',
    code: 'VPB',
    bin: '970432',
    shortName: 'VPBank',
    logo: 'https://api.vietqr.io/img/VPB.png'
  },
  {
    id: 'tpbank',
    name: 'Ngân hàng Tiên Phong',
    code: 'TPB',
    bin: '970423',
    shortName: 'TPBank',
    logo: 'https://api.vietqr.io/img/TPB.png'
  },
  {
    id: 'vib',
    name: 'Ngân hàng Quốc tế',
    code: 'VIB',
    bin: '970441',
    shortName: 'VIB',
    logo: 'https://api.vietqr.io/img/VIB.png'
  },
  {
    id: 'hdbank',
    name: 'Ngân hàng Phát triển TP.HCM',
    code: 'HDB',
    bin: '970437',
    shortName: 'HDBank',
    logo: 'https://api.vietqr.io/img/HDB.png'
  },
  {
    id: 'sacombank',
    name: 'Ngân hàng Sài Gòn Thương Tín',
    code: 'STB',
    bin: '970403',
    shortName: 'Sacombank',
    logo: 'https://api.vietqr.io/img/STB.png'
  },
  {
    id: 'ocb',
    name: 'Ngân hàng Phương Đông',
    code: 'OCB',
    bin: '970448',
    shortName: 'OCB',
    logo: 'https://api.vietqr.io/img/OCB.png'
  },
  {
    id: 'msb',
    name: 'Ngân hàng Hàng Hải',
    code: 'MSB',
    bin: '970426',
    shortName: 'MSB',
    logo: 'https://api.vietqr.io/img/MSB.png'
  },
  {
    id: 'shb',
    name: 'Ngân hàng Sài Gòn - Hà Nội',
    code: 'SHB',
    bin: '970443',
    shortName: 'SHB',
    logo: 'https://api.vietqr.io/img/SHB.png'
  },
  {
    id: 'seabank',
    name: 'Ngân hàng Đông Nam Á',
    code: 'SEAB',
    bin: '970440',
    shortName: 'SeABank',
    logo: 'https://api.vietqr.io/img/SEAB.png'
  },
  {
    id: 'agribank',
    name: 'Ngân hàng Nông nghiệp & PTNT',
    code: 'VBA',
    bin: '970405',
    shortName: 'Agribank',
    logo: 'https://api.vietqr.io/img/VBA.png'
  },
  {
    id: 'namabank',
    name: 'Ngân hàng Nam Á',
    code: 'NAB',
    bin: '970428',
    shortName: 'NamABank',
    logo: 'https://api.vietqr.io/img/NAB.png'
  }
];

