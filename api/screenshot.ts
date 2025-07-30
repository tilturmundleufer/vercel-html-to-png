import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export default async function handler(req, res) {
  try {
    const { html = '', css = '' } = req.body || {};

    if (!html) {
      return res.status(400).json({ error: 'Missing HTML' });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: { width: 800, height: 600 }
    });

    const page = await browser.newPage();
    await page.setContent(`<style>${css}</style>${html}`, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({ type: 'png' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(screenshot);
  } catch (err) {
    console.error('Screenshot error:', err);
    res.status(500).json({ error: 'Screenshot failed', details: err.message });
  }
}
