const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function takeScreenshots() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const pages = [
    { url: 'http://localhost:3000', name: 'homepage' },
    { url: 'http://localhost:3000/auth', name: 'auth' },
    { url: 'http://localhost:3000/dashboard', name: 'dashboard' },
    { url: 'http://localhost:3000/polls', name: 'polls' },
    { url: 'http://localhost:3000/wheels', name: 'wheels' },
    { url: 'http://localhost:3000/polls/create', name: 'polls-create' },
    { url: 'http://localhost:3000/wheels/create', name: 'wheels-create' }
  ];

  console.log('📸 Ekran görüntüleri alınıyor...');

  for (const pageInfo of pages) {
    try {
      console.log(`📷 ${pageInfo.name} sayfası yükleniyor...`);
      
      await page.goto(pageInfo.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      const screenshotPath = path.join(screenshotsDir, `${pageInfo.name}.png`);
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true
      });

      console.log(`✅ ${pageInfo.name}.png kaydedildi`);
    } catch (error) {
      console.error(`❌ ${pageInfo.name} sayfası için hata:`, error.message);
    }
  }

  await browser.close();
  console.log('🎉 Tüm ekran görüntüleri alındı!');
}

takeScreenshots().catch(console.error);
