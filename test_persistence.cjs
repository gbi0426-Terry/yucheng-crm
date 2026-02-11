const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log('1. Navigate to customers...');
  await page.goto('http://localhost:5173/customers', { waitUntil: 'networkidle0' });
  
  console.log('2. Adding customer...');
  await page.waitForSelector('.primary-btn');
  await page.click('.primary-btn');
  await new Promise(r => setTimeout(r, 500));
  
  const nameInput = await page.$('input[placeholder*="請輸入"]');
  if (nameInput) {
    const testName = 'Persist Test ' + Date.now();
    await nameInput.type(testName);
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const save = btns.find(b => b.textContent && b.textContent.includes('儲存'));
      if (save) save.click();
    });
    
    await new Promise(r => setTimeout(r, 1000)); // Wait for API response
    
    console.log('3. Reloading page...');
    await page.reload({ waitUntil: 'networkidle0' });
    
    console.log('4. Checking for customer...');
    const content = await page.content();
    if (content.includes(testName)) {
      console.log('✅ SUCCESS: Customer persisted after reload!');
    } else {
      console.log('❌ FAILURE: Customer lost after reload.');
    }
  }
  
  await browser.close();
})();
