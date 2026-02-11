const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a good dashboard view
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  // Wait for React to render
  console.log('Waiting for render...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'yucheng_dashboard_v2.png', fullPage: true });

  // Also take customers page
  console.log('Navigating to customers...');
  await page.goto('http://localhost:5173/customers', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: 'yucheng_customers.png', fullPage: true });
  
  await browser.close();
})();
