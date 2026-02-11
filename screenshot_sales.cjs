const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to performance...');
  await page.goto('http://localhost:5173/performance', { waitUntil: 'networkidle0' });
  
  // Click "Add Sale" button
  console.log('Clicking Add Sale button...');
  await page.waitForSelector('.primary-btn', { timeout: 10000 });
  await page.click('.primary-btn');
  
  // Wait for modal
  await new Promise(r => setTimeout(r, 1000));
  
  console.log('Modal opened.');
  await page.screenshot({ path: 'yucheng_sales_modal.png', fullPage: true });
  
  await browser.close();
})();
