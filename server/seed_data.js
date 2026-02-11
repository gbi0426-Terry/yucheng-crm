import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
  const db = await open({
    filename: './crm.sqlite',
    driver: sqlite3.Database
  });

  console.log('Start seeding realistic data...');

  // 1. Customers (客戶資料)
  const customers = [
    ['高鐵建設 (張董事長)', '法人', '營建工程', 5, '已成交', 1200000, 'Alex'],
    ['李美玲 醫師', '自然人', '醫療服務', 4, '提案中', 300000, 'Karen'],
    ['展宏科技 (陳總)', '法人', '半導體/電子', 3, '約訪中', 800000, 'Vincent'],
    ['王小美 (美甲店)', '自然人', '美容服務', 2, '新名單', 50000, 'Alex'],
    ['富邦金控 (林經理)', '法人', '金融保險', 5, '已成交', 2500000, 'Karen'],
    ['老四川餐飲集團', '法人', '餐飲服務', 4, '提案中', 600000, 'Vincent'],
    ['陳志豪 律師', '自然人', '專業服務', 3, '約訪中', 150000, 'Karen'],
    ['大安區地主 (黃先生)', '自然人', '不動產', 5, '已成交', 5000000, 'Alex'],
    ['綠能光電 (吳特助)', '法人', '能源科技', 2, '新名單', 1500000, 'Vincent'],
    ['林怡君 (網拍賣家)', '自然人', '電子商務', 3, '約訪中', 80000, 'Alex']
  ];

  for (const c of customers) {
    await db.run(
      `INSERT INTO customers (name, type, industry, probability, status, revenue, consultant, lastContact) 
       VALUES (?, ?, ?, ?, ?, ?, ?, date('now', '-' || abs(random() % 30) || ' days'))`,
      c
    );
  }

  // 2. Sales (業績/成交紀錄)
  const sales = [
    ['Alex', '高鐵建設', '年度法務顧問約', 1200000, 50000, 0.63, '已付款', '2026-01-15'],
    ['Karen', '富邦金控', '企業內訓課程', 250000, 20000, 0.63, '已付款', '2026-01-20'],
    ['Alex', '大安區地主', '土地開發諮詢', 500000, 0, 0.50, '部分付款', '2026-02-02'],
    ['Vincent', '展宏科技', '專利申請服務', 80000, 5000, 0.50, '未付款', '2026-02-08'],
    ['Karen', '長榮海運', 'ESG 永續報告書', 350000, 0, 0.63, '已付款', '2026-02-10']
  ];

  for (const s of sales) {
    await db.run(
      `INSERT INTO sales (consultant, client, item, amount, serviceFee, rate, status, dealDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      s
    );
  }

  // 3. Events (行事曆)
  const events = [
    ['拜訪張董', '2026-02-12', '10:00', '拜訪', 'Alex', '討論合約細節'],
    ['李醫師視訊會議', '2026-02-12', '14:00', '會議', 'Karen', '醫療糾紛諮詢'],
    ['內部教育訓練', '2026-02-13', '09:00', '培訓', 'Admin', '全體員工參加'],
    ['展宏科技簽約', '2026-02-14', '11:00', '簽約', 'Vincent', '帶印章'],
    ['老四川試菜', '2026-02-15', '18:30', '餐敘', 'Vincent', '與採購經理用餐']
  ];

  for (const e of events) {
    await db.run(
      `INSERT INTO events (title, date, time, type, consultant, details) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      e
    );
  }

  console.log('✅ Realistic data seeded successfully!');
})();
