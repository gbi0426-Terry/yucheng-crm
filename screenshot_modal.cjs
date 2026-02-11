const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to customers...');
  await page.goto('http://localhost:5173/customers', { waitUntil: 'networkidle0' });
  
  // Click "Add Customer" button
  // The button has text "新增客戶" and class "primary-btn"
  // Let's find button by text or class
  await page.waitForSelector('.primary-btn', { timeout: 10000 });
  
  console.log('Clicking Add Customer button...');
  await page.click('.primary-btn');
  
  // Wait for modal
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Modal opened.');
  await page.screenshot({ path: 'yucheng_customer_modal.png', fullPage: true });
  
  await browser.close();
})();
