const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Đọc file .env nếu có
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["'](.*)["']$/, '$1');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

async function testConnection() {
  const config = {
    host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: parseInt(process.env.DB_PORT || '4000', 10),
    user: process.env.DB_USER || '3tRMi6WpQRDK9wY.root',
    password: process.env.DB_PASSWORD || '07YLZlTbygdCQtl2',
    database: process.env.DB_DATABASE || 'tiemso_hub',
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  };

  try {
    console.log('🔄 Đang kết nối tới TiDB Cloud...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Kết nối thành công tới TiDB Cloud Serverless!');

    const [rows] = await connection.execute('SELECT VERSION() as version, DATABASE() as db');
    console.log('📌 Thông tin server:', rows[0]);

    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📁 Danh sách bảng hiện tại trong DB:', tables);

    await connection.end();
    console.log('🔒 Đã đóng kết nối kiểm tra an toàn.');
  } catch (err) {
    console.error('❌ Kết nối thất bại:', err.message);
  }
}

testConnection();
