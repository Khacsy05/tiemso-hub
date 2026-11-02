// Danh sách các logo / biểu trưng thương hiệu phổ biến dưới dạng SVG Vector Data URL
// Giúp hiển thị sắc nét ở mọi kích thước mà không phụ thuộc ảnh bên ngoài
export interface PresetLogo {
  id: string;
  name: string;
  color: string;
  svgDataUri: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    color: '#FF0000',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="%23FF0000"/><polygon points="9.5,7.5 16.5,12 9.5,16.5" fill="%23ffffff"/></svg>`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%231877F2"/><path fill="%23ffffff" d="M15.1 12.3l.5-3.3h-3.2v-2.1c0-.9.3-1.6 1.6-1.6h1.7V2.3c-.8-.1-1.7-.1-2.4-.1-2.5 0-4.2 1.5-4.2 4.3v2.5H6.2v3.3h2.9V22c.6.1 1.2.1 1.8.1s1.2 0 1.8-.1v-9.7h2.4z"/></svg>`
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%2325D366"/><path fill="%23ffffff" d="M17.5 14.3c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.4.2-.7.1s-1.3-.5-2.5-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.3 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.4z"/></svg>`
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%25" cy="107%25" r="150%25"><stop offset="0%25" stop-color="%23fdf497"/><stop offset="10%25" stop-color="%23fed373"/><stop offset="50%25" stop-color="%23d6249f"/><stop offset="100%25" stop-color="%23285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(%23ig)"/><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="%23ffffff" stroke-width="1.8"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="%23ffffff" stroke-width="1.8"/><circle cx="15.8" cy="8.2" r="0.9" fill="%23ffffff"/></svg>`
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="%230A66C2"/><path fill="%23ffffff" d="M6.9 8.6c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6zM5.3 19h3.2v-9.5H5.3V19zM15.4 9.2c-1.6 0-2.3.9-2.7 1.5v-1.2H9.5V19h3.2v-5.2c0-1.4.3-2.7 2-2.7 1.7 0 1.7 1.6 1.7 2.8V19h3.2v-5.6c0-2.8-1.5-4.2-4.2-4.2z"/></svg>`
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#24A1DE',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%2324A1DE"/><path fill="%23ffffff" d="M5.5 11.5l11-4.2c.5-.2 1 .1.8.6l-1.9 8.8c-.1.6-.5.7-1 .4l-2.7-2-1.3 1.2c-.1.1-.3.3-.6.3l.2-2.7 5-4.5c.2-.2 0-.3-.3-.1l-6.2 3.9-2.6-.8c-.6-.2-.6-.6.1-.8z"/></svg>`
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#000000',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23000000"/><path fill="%23ffffff" d="M16.6 8.2c-.8-.5-1.4-1.3-1.6-2.2h-2.5v10.5c0 1.5-1.2 2.7-2.7 2.7S7.1 18 7.1 16.5s1.2-2.7 2.7-2.7c.3 0 .6.1.9.2V11.4c-.3 0-.6-.1-.9-.1-3 0-5.3 2.4-5.3 5.4s2.4 5.3 5.3 5.3 5.3-2.4 5.3-5.3V10.6c1.1.8 2.5 1.2 3.9 1.2V9.3c-.9 0-1.8-.4-2.4-1.1z"/></svg>`
  },
  {
    id: 'zalo',
    name: 'Zalo',
    color: '#0068FF',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="%230068FF"/><text x="12" y="15.5" font-family="Arial, sans-serif" font-weight="900" font-size="8" fill="%23ffffff" text-anchor="middle">Zalo</text></svg>`
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    color: '#000000',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23000000"/><path fill="%23ffffff" d="M14.7 6.5h1.9l-4.1 4.7 4.9 6.3h-3.8l-3-3.8-3.4 3.8H5.3l4.4-5-4.6-6h3.9l2.7 3.5 3-3.5zm-.7 9.8h1l-6.7-8.8h-1.1l6.8 8.8z"/></svg>`
  },
  {
    id: 'shopee',
    name: 'Shopee',
    color: '#EE4D2D',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="%23EE4D2D"/><path fill="%23ffffff" d="M12 4c-1.8 0-3.3 1.2-3.7 2.8H7c-.6 0-1 .4-1 1l-1 10.5c0 .6.4 1 1 1h12c.6 0 1-.4 1-1L18 7.8c0-.6-.4-1-1-1h-1.3C15.3 5.2 13.8 4 12 4zm0 1.8c1.1 0 2 .7 2.3 1.6H9.7c.3-.9 1.2-1.6 2.3-1.6zm0 5.2c1.7 0 2.8 1 2.8 2.2 0 1.6-1.5 2-2.8 2.3-.9.2-1.5.4-1.5.8 0 .4.4.6 1.2.6.9 0 1.8-.3 2.1-.5l.4 1.2c-.5.3-1.4.6-2.5.6-1.8 0-2.8-1-2.8-2.2 0-1.5 1.4-2 2.7-2.3.9-.2 1.6-.4 1.6-.8s-.4-.6-1.1-.6c-.8 0-1.6.3-2 .5l-.4-1.2c.6-.4 1.4-.6 2.3-.6z"/></svg>`
  },
  {
    id: 'globe',
    name: 'Website / Internet',
    color: '#6366F1',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%236366F1"/><path fill="none" stroke="%23ffffff" stroke-width="1.8" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-8 10h16M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    id: 'email',
    name: 'Email / Mail',
    color: '#EA4335',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23EA4335"/><path fill="%23ffffff" d="M6 8h12c.6 0 1 .4 1 1v7c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1V9c0-.6.4-1 1-1zm6 3.5l5.5-3.5H6.5l5.5 3.5zm0 1.2L6 9.3V16h12V9.3l-6 3.4z"/></svg>`
  },
  {
    id: 'phone',
    name: 'Điện Thoại / Hotline',
    color: '#10B981',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%2310B981"/><path fill="%23ffffff" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>`
  },
  {
    id: 'wifi',
    name: 'Wi-Fi Hotspot',
    color: '#8B5CF6',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%238B5CF6"/><path fill="%23ffffff" d="M12 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm-4.2-4.2a6 6 0 0 1 8.4 0 .9.9 0 0 0 1.3-1.3 7.8 7.8 0 0 0-11 0 .9.9 0 0 0 1.3 1.3zm-2.8-2.8a10 10 0 0 1 14 0 .9.9 0 0 0 1.3-1.3 11.8 11.8 0 0 0-16.6 0 .9.9 0 0 0 1.3 1.3z"/></svg>`
  },
  {
    id: 'cart',
    name: 'Mua Sắm / Shop',
    color: '#F59E0B',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23F59E0B"/><path fill="%23ffffff" d="M7 6h12l-1.5 8H8.5L7 6zm0 0L6 3H3v2h2l2 11h11v-2H8.5l-.2-1h9.2c.6 0 1-.4 1.1-1l1.4-7.5c.1-.5-.3-.9-.8-.9H7zm2 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm7 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>`
  },
  {
    id: 'star',
    name: 'Đánh Giá / VIP',
    color: '#EC4899',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%23EC4899"/><polygon points="12,5 14.2,9.5 19,10.2 15.5,13.6 16.3,18.4 12,16.1 7.7,18.4 8.5,13.6 5,10.2 9.8,9.5" fill="%23ffffff"/></svg>`
  }
];

