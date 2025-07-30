import { chromium } from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: NextRequest) {
  const url = 'https://example.com'; // Ersetze mit gewünschtem HTML

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: 'networkidle0' });

  const screenshotBuffer = await page.screenshot({ type: 'png' });
  await browser.close();

  return new Response(screenshotBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline; filename="screenshot.png"',
      'Content-Length': screenshotBuffer.length.toString(),
    },
  });
}
