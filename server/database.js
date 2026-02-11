import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize Database
let db;

export async function initDb() {
  if (db) return db;
  
  db = await new sqlite3.Database('./crm.sqlite', (err) => {
    if (err) {
      console.error('Could not connect to database', err);
    } else {
      console.log('Connected to SQLite database');
    }
  });
  
  // Create Tables
  db.serialize(() => {
    // Customers Table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      industry TEXT,
      source TEXT,
      probability INTEGER,
      status TEXT,
      revenue REAL,
      lastContact TEXT,
      consultant TEXT
    )`);

    // Sales Table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultant TEXT,
      client TEXT,
      item TEXT,
      amount REAL,
      serviceFee REAL,
      rate REAL,
      status TEXT,
      dealDate TEXT,
      paidAmount REAL,
      commissionDate TEXT
    )`);

    // Checkins Table
    db.run(`CREATE TABLE IF NOT EXISTS checkins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      consultant TEXT,
      month TEXT,
      count INTEGER
    )`);

    // Events Table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      time TEXT,
      type TEXT,
      consultant TEXT,
      details TEXT
    )`);

    // Resources Table
    db.run(`CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      category TEXT,
      updatedAt TEXT,
      size TEXT,
      url TEXT
    )`);

    // Documents Table
    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      originalName TEXT,
      storedName TEXT,
      size INTEGER,
      mimeType TEXT,
      category TEXT,
      customerId INTEGER,
      salesId INTEGER,
      uploadedAt TEXT,
      uploadedBy TEXT
    )`);

    // Settings Table (Notifications)
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE,
      value TEXT
    )`);

    // Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      target TEXT,
      targetId INTEGER,
      user TEXT,
      details TEXT,
      timestamp TEXT
    )`);
    
    // Seed Default Settings if not exist
    db.get("SELECT count(*) as count FROM settings", (err, row) => {
      if (row && row.count === 0) {
        const defaultSettings = {
          'email_enabled': 'true',
          'email_address': 'admin@yucheng.com',
          'line_enabled': 'true',
          'line_token': '',
          'notify_new_customer': 'true',
          'notify_case_status': 'true',
          'notify_deal_closed': 'true',
          'notify_announcement': 'true',
          'commission_rate_consultant': '63',
          'commission_rate_service': '50',
          'case_stages': '新名單,約訪中,提案中,已成交,已結案',
          'roles_permissions': '{"Admin":["all"],"Manager":["view_all","edit_all"],"Consultant":["view_own","edit_own"]}'
        };
        const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
        Object.entries(defaultSettings).forEach(([k, v]) => stmt.run(k, v));
        stmt.finalize();
      }
    });
  });

  return db;
}

export { db };
