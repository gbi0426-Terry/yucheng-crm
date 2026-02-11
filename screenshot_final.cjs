const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Sales
  await page.goto('http://localhost:5173/performance', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'yucheng_final_sales.png', fullPage: true });
  
  // Calendar
  await page.goto('http://localhost:5173/calendar', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'yucheng_final_calendar.png', fullPage: true });
  
  await browser.close();
})();
