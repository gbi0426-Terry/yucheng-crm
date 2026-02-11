import express from 'express';
import cors from 'cors';
import { initDb } from './database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { NotificationService } from './notification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique filename: timestamp-original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());

// Init DB
let db;
initDb().then(database => {
  db = database;
  
  // Seed Mock Data if empty
  // Customers
  db.get("SELECT count(*) as count FROM customers", (err, row) => {
    if (row && row.count === 0) {
      console.log('Seeding customers...');
      db.run(`INSERT INTO customers (name, type, industry, probability, status, revenue, consultant) VALUES 
        ('長榮海運 (林先生)', '自然人', '傳產/航運', 4, '已成交', 150000, 'Karen'),
        ('房仲老闆 (張先生)', '法人', '不動產', 5, '已成交', 300000, 'Alex')
      `);
    }
  });

  // Sales
  db.get("SELECT count(*) as count FROM sales", (err, row) => {
    if (row && row.count === 0) {
      console.log('Seeding sales...');
      db.run(`INSERT INTO sales (consultant, client, item, amount, serviceFee, rate, status, dealDate) VALUES 
        ('Karen', '長榮海運', '基金標的', 150000, 0, 0.63, '已付款', '2026-01-05')
      `);
    }
  });

  // Checkins
  db.get("SELECT count(*) as count FROM checkins", (err, row) => {
    if (row && row.count === 0) {
      console.log('Seeding checkins...');
      db.run(`INSERT INTO checkins (consultant, month, count) VALUES 
        ('Karen', '2025-12', 23),
        ('Vincent', '2025-12', 16)
      `);
    }
  });
});

// Audit Helper
const logAudit = (action, target, targetId, user, details) => {
  const sql = `INSERT INTO audit_logs (action, target, targetId, user, details, timestamp) VALUES (?, ?, ?, ?, ?, ?)`;
  const timestamp = new Date().toISOString();
  db.run(sql, [action, target, targetId, user, JSON.stringify(details), timestamp], (err) => {
    if (err) console.error('Audit Log Error:', err);
  });
};

// --- API Routes ---

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  db.all("SELECT * FROM audit_logs ORDER BY timestamp DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Customers
app.get('/api/customers', (req, res) => {
  db.all("SELECT * FROM customers ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/customers', (req, res) => {
  const { name, type, industry, probability, status, revenue, consultant } = req.body;
  const sql = `INSERT INTO customers (name, type, industry, probability, status, revenue, consultant, lastContact) 
               VALUES (?, ?, ?, ?, ?, ?, ?, date('now'))`;
  db.run(sql, [name, type, industry, probability, status, revenue, consultant], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Trigger Notification
    NotificationService.notify('NEW_CUSTOMER', req.body);
    
    // Audit Log
    logAudit('新增', '客戶', this.lastID, 'Admin', { name, consultant });

    res.json({ id: this.lastID, ...req.body });
  });
});

// Sales
app.get('/api/sales', (req, res) => {
  db.all("SELECT * FROM sales ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/sales', (req, res) => {
  const { consultant, client, item, amount, serviceFee } = req.body;
  const rate = consultant === 'Karen' ? 0.63 : 0.50; // Simple logic
  const sql = `INSERT INTO sales (consultant, client, item, amount, serviceFee, rate, status, dealDate) 
               VALUES (?, ?, ?, ?, ?, ?, '未付款', date('now'))`;
  db.run(sql, [consultant, client, item, amount, serviceFee, rate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Trigger Notification: New Deal (Pending)
    NotificationService.notify('CASE_STATUS', { client, item, status: '未付款' });

    // Audit Log
    logAudit('新增', '業績', this.lastID, 'Admin', { client, item, amount });

    res.json({ id: this.lastID, ...req.body, rate, status: '未付款' });
  });
});

// Checkins
app.get('/api/checkins', (req, res) => {
  db.all("SELECT * FROM checkins", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/checkins', (req, res) => {
  const { consultant, month } = req.body;
  // Upsert logic (simplified: check then update or insert)
  db.get("SELECT * FROM checkins WHERE consultant = ? AND month = ?", [consultant, month], (err, row) => {
    if (row) {
      db.run("UPDATE checkins SET count = count + 1 WHERE id = ?", [row.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ ...row, count: row.count + 1 });
      });
    } else {
      db.run("INSERT INTO checkins (consultant, month, count) VALUES (?, ?, 1)", [consultant, month], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, consultant, month, count: 1 });
      });
    }
  });
});

// Events
app.get('/api/events', (req, res) => {
  db.all("SELECT * FROM events ORDER BY date ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events', (req, res) => {
  const { title, date, time, type, consultant, details } = req.body;
  const sql = `INSERT INTO events (title, date, time, type, consultant, details) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [title, date, time, type, consultant, details], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...req.body });
  });
});

// Resources
app.get('/api/resources', (req, res) => {
  db.all("SELECT * FROM resources ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/resources', (req, res) => {
  const { name, category } = req.body;
  const sql = `INSERT INTO resources (name, category, type, updatedAt, size, url) VALUES (?, ?, 'PDF', date('now'), '1.0 MB', '#')`;
  db.run(sql, [name, category], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...req.body });
  });
});

// Documents
app.get('/api/documents', (req, res) => {
  const { customerId, salesId, category } = req.query;
  let sql = `SELECT * FROM documents`;
  const params = [];

  const conditions = [];
  if (customerId) {
    conditions.push(`customerId = ?`);
    params.push(customerId);
  }
  if (salesId) {
    conditions.push(`salesId = ?`);
    params.push(salesId);
  }
  if (category) {
    conditions.push(`category = ?`);
    params.push(category);
  }
  
  if (conditions.length > 0) {
    sql += ` WHERE ` + conditions.join(' AND ');
  }

  sql += ` ORDER BY uploadedAt DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { category, uploadedBy } = req.body;
  const customerId = req.body.customerId ? parseInt(req.body.customerId) : null;
  const salesId = req.body.salesId ? parseInt(req.body.salesId) : null;
  
  const originalName = req.file.originalname;
  const storedName = req.file.filename;
  const size = req.file.size;
  const mimeType = req.file.mimetype;
  const uploadedAt = new Date().toISOString();

  const sql = `INSERT INTO documents (originalName, storedName, size, mimeType, category, customerId, salesId, uploadedAt, uploadedBy) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [originalName, storedName, size, mimeType, category, customerId, salesId, uploadedAt, uploadedBy], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Audit Log
    logAudit('上傳', '文件', this.lastID, uploadedBy || 'Admin', { originalName, category });

    res.json({ id: this.lastID, originalName, size, mimeType, category, customerId, salesId, uploadedAt, uploadedBy });
  });
});

app.get('/api/documents/:id/download', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM documents WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Document not found' });

    const filePath = path.join(__dirname, 'uploads', row.storedName);
    
    // Audit Log: Record download
    logAudit('下載', '文件', id, 'Admin', { originalName: row.originalName });

    res.download(filePath, row.originalName);
  });
});

// Dashboard Stats Endpoint
app.get('/api/dashboard-stats', (req, res) => {
  const stats = {
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    monthlySalesCount: 0,
    monthlyRevenue: 0,
    monthlyTrend: [],
    revenueComposition: [],
    customerIndustry: [],
    customerSource: [],
    recentActivity: []
  };

  db.all("SELECT * FROM customers", (err, customers) => {
    if (err) return res.status(500).json({ error: err.message });
    
    stats.totalCustomers = customers.length;
    const currentMonth = new Date().toISOString().slice(0, 7);
    stats.newCustomersThisMonth = customers.filter(c => c.lastContact && c.lastContact.startsWith(currentMonth)).length;

    // Industry Stats
    const industries = {};
    customers.forEach(c => {
      const ind = c.industry || 'Unknown';
      industries[ind] = (industries[ind] || 0) + 1;
    });
    stats.customerIndustry = Object.entries(industries).map(([name, value]) => ({ name, value }));

    // Source Stats (Mocking source since it might be empty or missing in some records)
    const sources = {};
    customers.forEach(c => {
      const src = c.source || '其他';
      sources[src] = (sources[src] || 0) + 1;
    });
    stats.customerSource = Object.entries(sources).map(([name, value]) => ({ name, value }));

    db.all("SELECT * FROM sales ORDER BY dealDate DESC", (err, sales) => {
      if (err) return res.status(500).json({ error: err.message });

      const monthlySales = sales.filter(s => s.dealDate && s.dealDate.startsWith(currentMonth));
      stats.monthlySalesCount = monthlySales.length;
      stats.monthlyRevenue = monthlySales.reduce((sum, s) => sum + (s.amount || 0), 0);

      // Recent Activity
      stats.recentActivity = sales.slice(0, 5);

      // Revenue Composition (Mock Logic for Demo)
      stats.revenueComposition = [
        { name: '顧問費', value: sales.reduce((sum, s) => sum + (s.amount * 0.6), 0) },
        { name: '服務費', value: sales.reduce((sum, s) => sum + (s.amount * 0.3), 0) },
        { name: '專案佣金', value: sales.reduce((sum, s) => sum + (s.amount * 0.1), 0) },
      ];

      // Monthly Trend (Mocking 6 months back)
      // In real app, query GROUP BY strftime('%Y-%m', dealDate)
      stats.monthlyTrend = [
        { name: '1月', 顧問費: 40000, 服務費: 24000 },
        { name: '2月', 顧問費: stats.monthlyRevenue * 0.7, 服務費: stats.monthlyRevenue * 0.3 }, // Current
      ];

      res.json(stats);
    });
  });
});

// AI Analysis Endpoint
app.get('/api/ai-analysis', (req, res) => {
  // Simulate AI aggregating data
  // In a real scenario, this would query the DB and pass data to an LLM
  
  db.all("SELECT * FROM sales", (err, sales) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all("SELECT * FROM customers", (err, customers) => {
       if (err) return res.status(500).json({ error: err.message });

       // 1. Monthly Revenue
       const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
       // Mock for Demo: if no sales this month, use all time for better visual
       const monthlySales = sales.length > 0 ? sales : []; 
       const monthlyRevenue = monthlySales.reduce((sum, s) => sum + (s.amount || 0), 0);

       // 2. Consultant Ranking
       const consultantRevenue = {};
       sales.forEach(s => {
         const name = s.consultant || 'Unknown';
         consultantRevenue[name] = (consultantRevenue[name] || 0) + (s.amount || 0);
       });
       
       const ranking = Object.entries(consultantRevenue)
         .map(([name, revenue]) => ({ name, revenue }))
         .sort((a, b) => b.revenue - a.revenue);

       // 3. Conversion Rate
       // Simple logic: sales count / customer count (mock)
       const conversionRate = customers.length > 0 ? ((sales.length / customers.length) * 100).toFixed(1) : "0.0";

       // 4. AI Summary Generation (Mock)
       const summary = `本月業績表現${monthlyRevenue > 0 ? '穩健成長' : '持平'}，累計營收達 $${monthlyRevenue.toLocaleString()}。${ranking.length > 0 ? `銷售冠軍為 ${ranking[0].name}，貢獻了 ${((ranking[0].revenue / (monthlyRevenue || 1)) * 100).toFixed(0)}% 的業績。` : ''}整體轉換率為 ${conversionRate}%，建議加強對潛在客戶的跟進以提升下月成效。`;

       res.json({
         monthlyRevenue,
         ranking,
         conversionRate,
         summary,
         generatedAt: new Date().toISOString()
       });
    });
  });
});

// Settings API
app.get('/api/settings', (req, res) => {
  db.all("SELECT key, value FROM settings", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const settings = {};
    rows.forEach(row => settings[row.key] = row.value);
    res.json(settings);
  });
});

app.post('/api/settings', (req, res) => {
  const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  Object.entries(req.body).forEach(([key, value]) => {
    stmt.run(key, String(value));
  });
  stmt.finalize();
  res.json({ success: true });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
