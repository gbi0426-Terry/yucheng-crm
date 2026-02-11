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
  
  // Dashboard
  console.log('Navigating to dashboard...');
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('Navigating dashboard timeout or error:', e.message);
  }
  
  try {
    await page.waitForSelector('.card-title', { timeout: 10000 });
    console.log('Dashboard loaded.');
  } catch (e) {
    console.log('Timeout waiting for dashboard selector');
  }
  
  await page.screenshot({ path: 'yucheng_dashboard_v3.png', fullPage: true });

  // Customers
  console.log('Navigating to customers...');
  try {
    await page.goto('http://localhost:5173/customers', { waitUntil: 'networkidle0', timeout: 30000 });
  } catch (e) {
    console.log('Navigating customers timeout or error:', e.message);
  }
  
  try {
    await page.waitForSelector('.card-title', { timeout: 10000 }); // Wait for specific element
    // Wait a bit more for table data?
    await new Promise(r => setTimeout(r, 2000));
    console.log('Customers loaded.');
  } catch (e) {
    console.log('Timeout waiting for customer selector');
  }

  await page.screenshot({ path: 'yucheng_customers_v3.png', fullPage: true });
  
  await browser.close();
})();
