/**
 * Generates .github/social-preview.png — the image GitHub shows when this repo is
 * shared on social, in chat and in search previews.
 *
 * 1280x640 at deviceScaleFactor 1. Do not render at 2x: GitHub caps the upload at
 * 1MB and the extra pixels buy nothing at this display size.
 *
 * There is no API for uploading it. Settings -> General -> Social preview.
 *
 * Playwright is not a dependency of a Shopify theme, so point at an install elsewhere:
 *   PLAYWRIGHT_PATH="/path/to/node_modules/playwright/index.js" node .github/social-preview.mjs
 */

import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pw = await import(process.env.PLAYWRIGHT_PATH || 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;

const hero = readFileSync(join(here, 'screenshots/hero.jpg')).toString('base64');

const html = `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1280px; height: 640px; overflow: hidden;
         font-family: Montserrat, Georgia, serif; }
  .card { position: relative; width: 1280px; height: 640px; background: #15161d;
          display: grid; grid-template-columns: 730px 550px; }
  .body { padding: 74px 56px 62px 76px; display: flex; flex-direction: column; }
  /* Zooms past the storefront's own headline into the lower-right of the shot.
     A plain "cover" lands on that headline, which then sits beside this card's
     headline and reads as two competing designs. hero.jpg is 1200x675; this
     shows roughly x 877-1200, y 300-675 scaled into the 550x640 panel. */
  .shot { position: relative; background: url(data:image/jpeg;base64,${hero}) no-repeat;
          background-size: 2044px 1150px; background-position: -1494px -510px; }
  .shot::before { content: ''; position: absolute; inset: 0;
                  background: linear-gradient(90deg, #15161d 0%, #15161d8c 12%, transparent 34%); }
  .kicker { font-family: Roboto, Montserrat, sans-serif; font-size: 19px; letter-spacing: .34em;
            text-transform: uppercase; color: #d10024; font-weight: 600; }
  h1 { font-size: 124px; line-height: .95; font-weight: 400; color: #fff;
       letter-spacing: -.02em; margin-top: 22px; }
  h1 b { font-weight: 700; color: #d10024; }
  p { font-family: Roboto, Montserrat, sans-serif; font-size: 27px; line-height: 1.38;
      color: rgba(255,255,255,.82); font-weight: 300; margin-top: 26px; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto;
           font-family: Roboto, Montserrat, sans-serif; }
  .chip { font-size: 17px; color: rgba(255,255,255,.9); white-space: nowrap;
          border: 1px solid rgba(255,255,255,.3); border-radius: 999px; padding: 8px 18px; }
  .chip--on { background: #d10024; border-color: #d10024; color: #fff; font-weight: 600; }
  .by { position: absolute; right: 46px; bottom: 40px; font-family: Roboto, Montserrat, sans-serif;
        font-size: 17px; letter-spacing: .18em; text-transform: uppercase;
        color: rgba(255,255,255,.75); text-shadow: 0 1px 12px rgba(0,0,0,.85); }
</style>
<div class="card">
  <div class="body">
    <div class="kicker">Free Shopify theme</div>
    <h1>ELEC<b>TRO</b></h1>
    <p>For computing and audio stores — built on Online&nbsp;Store&nbsp;2.0 theme blocks.</p>
    <div class="chips"><span class="chip chip--on">Free</span><span class="chip">Theme blocks</span><span class="chip">Spec table</span><span class="chip">No jQuery</span></div>
  </div>
  <div class="shot"><div class="by">Colorlib</div></div>
</div>`;

const tmp = join(here, '.social-preview.tmp.html');
writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 640 }, deviceScaleFactor: 1 });
await page.goto('file://' + tmp, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.waitForTimeout(500);
await page.screenshot({ path: join(here, 'social-preview.png') });
await browser.close();
unlinkSync(tmp);
console.log('wrote .github/social-preview.png (1280x640)');
