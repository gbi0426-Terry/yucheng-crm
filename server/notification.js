import nodemailer from 'nodemailer';
import axios from 'axios';
import { db } from './database.js';

// Mock Transporter (In prod, use real SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "test@ethereal.email", 
    pass: "testpass" 
  },
});

export const NotificationService = {
  async getSettings() {
    const rows = await db.all("SELECT key, value FROM settings");
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  },

  async sendEmail(subject, text) {
    const settings = await this.getSettings();
    if (settings['email_enabled'] !== 'true' || !settings['email_address']) return;

    console.log(`[Email Mock] Sending to ${settings['email_address']}: ${subject}`);
    // In real implementation:
    // await transporter.sendMail({ from: '"Yucheng CRM" <system@yucheng.com>', to: settings['email_address'], subject, text });
  },

  async sendLine(message) {
    const settings = await this.getSettings();
    if (settings['line_enabled'] !== 'true' || !settings['line_token']) return;

    console.log(`[LINE Mock] Sending: ${message}`);
    // In real implementation:
    // await axios.post('https://notify-api.line.me/api/notify', `message=${encodeURIComponent(message)}`, {
    //   headers: { 'Authorization': `Bearer ${settings['line_token']}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    // });
  },

  async notify(type, data) {
    const settings = await this.getSettings();
    let shouldNotify = false;
    let title = '';
    let message = '';

    switch (type) {
      case 'NEW_CUSTOMER':
        if (settings['notify_new_customer'] === 'true') {
          shouldNotify = true;
          title = '🆕 新客戶指派通知';
          message = `已指派新客戶：${data.name} (顧問: ${data.consultant})`;
        }
        break;
      case 'CASE_STATUS':
        if (settings['notify_case_status'] === 'true') {
          shouldNotify = true;
          title = '📝 案件狀態變更通知';
          message = `案件狀態更新：${data.client} - ${data.item} 目前狀態為「${data.status}」`;
        }
        break;
      case 'DEAL_CLOSED':
        if (settings['notify_deal_closed'] === 'true') {
          shouldNotify = true;
          title = '🎉 成交賀喜通知';
          message = `恭喜成交！\n顧問：${data.consultant}\n客戶：${data.client}\n金額：$${data.amount?.toLocaleString()}`;
        }
        break;
      case 'ANNOUNCEMENT':
        if (settings['notify_announcement'] === 'true') {
          shouldNotify = true;
          title = '📢 新公告發布';
          message = `系統公告：${data.title}`;
        }
        break;
    }

    if (shouldNotify) {
      this.sendEmail(title, message);
      this.sendLine(`${title}\n${message}`);
    }
  }
};
