const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Console logs from page
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.setViewport({ width: 1440, height: 900 });
  
  // Check-In Page
  console.log('Navigating to Check-In...');
  try {
    await page.goto('http://localhost:5173/checkin', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('.card-title', { timeout: 10000 });
    console.log('Check-In loaded.');
    await page.screenshot({ path: 'yucheng_checkin.png', fullPage: true });
  } catch (e) {
    console.log('Error checkin:', e.message);
  }

  // Tools Page
  console.log('Navigating to Query Tools...');
  try {
    await page.goto('http://localhost:5173/tools', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('.card-title', { timeout: 10000 });
    console.log('Tools loaded.');
    await page.screenshot({ path: 'yucheng_tools.png', fullPage: true });
  } catch (e) {
    console.log('Error tools:', e.message);
  }
  
  await browser.close();
})();
