import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.resolve(ROOT_DIR, "tools/screens");
const DOCS_DIR = path.resolve(ROOT_DIR, "docs");
const DOCS_MOBILE_DIR = path.resolve(DOCS_DIR, "screens/mobile");

async function renderUpwork3DThumbnail() {
  console.log("🎨 Rendering High-Impact 4:3 Upwork Portfolio 3D Thumbnail...");

  const adminScreenPath = path.resolve(OUTPUT_DIR, "07_admin_dashboard_overview.png");
  const mobileScreenPath = path.resolve(DOCS_MOBILE_DIR, "02_patient_home.png");
  const faviconSvgPath = path.resolve(ROOT_DIR, "apps/web/public/favicon.svg");

  if (!fs.existsSync(adminScreenPath)) throw new Error(`Admin screen not found: ${adminScreenPath}`);
  if (!fs.existsSync(mobileScreenPath)) throw new Error(`Mobile screen not found: ${mobileScreenPath}`);

  const adminBase64 = fs.readFileSync(adminScreenPath).toString("base64");
  const mobileBase64 = fs.readFileSync(mobileScreenPath).toString("base64");
  const faviconSvg = fs.existsSync(faviconSvgPath) ? fs.readFileSync(faviconSvgPath, "utf8") : "";

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  // Upwork standard 4:3 aspect ratio at 1600 x 1200 (scale 2x = 3200 x 2400)
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  const thumbnailHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at 50% 20%, #082330 0%, #04121a 45%, #010609 100%);
        color: #ffffff;
        width: 1600px;
        height: 1200px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 50px 60px 45px 60px;
        position: relative;
      }

      /* High Intensity Vibrant Ambient Backlights */
      .glow-teal {
        position: absolute;
        top: 25%;
        left: 20%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.32) 0%, transparent 68%);
        filter: blur(100px);
        pointer-events: none;
        z-index: 1;
      }

      .glow-cyan {
        position: absolute;
        bottom: 15%;
        right: 15%;
        width: 750px;
        height: 750px;
        background: radial-gradient(circle, rgba(14, 165, 233, 0.28) 0%, transparent 70%);
        filter: blur(110px);
        pointer-events: none;
        z-index: 1;
      }

      .glow-top-spot {
        position: absolute;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        width: 1100px;
        height: 350px;
        background: radial-gradient(ellipse, rgba(45, 212, 191, 0.18) 0%, transparent 70%);
        filter: blur(90px);
        pointer-events: none;
        z-index: 1;
      }

      /* Header Bar */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 20;
      }

      .logo-group {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo-svg-wrapper {
        width: 58px;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 10px 30px rgba(20, 184, 166, 0.6));
      }

      .logo-svg-wrapper svg {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        display: block;
      }

      .logo-text {
        font-size: 38px;
        font-weight: 900;
        letter-spacing: -0.03em;
        color: #ffffff;
      }

      .logo-text span {
        color: #14b8a6;
        font-weight: 400;
      }

      .header-badges {
        display: flex;
        gap: 12px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(16px);
      }

      .pill.highlight {
        background: rgba(20, 184, 166, 0.22);
        border-color: rgba(20, 184, 166, 0.6);
        color: #2dd4bf;
        box-shadow: 0 0 24px rgba(20, 184, 166, 0.3);
      }

      /* Main Titles - Bold & Scalable */
      .hero-title-area {
        z-index: 20;
        margin-top: 15px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .headline-block h1 {
        font-size: 52px;
        font-weight: 900;
        line-height: 1.08;
        letter-spacing: -0.04em;
        background: linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .headline-block h1 span {
        background: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .headline-block p {
        font-size: 19px;
        color: #94a3b8;
        font-weight: 500;
        margin-top: 8px;
      }

      .quick-stats-row {
        display: flex;
        gap: 12px;
      }

      .stat-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 700;
        color: #f1f5f9;
        backdrop-filter: blur(12px);
      }

      .stat-pill .dot-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 10px #10b981;
      }

      /* 3D Showcase Stage */
      .stage-3d {
        position: relative;
        flex: 1;
        width: 100%;
        perspective: 1800px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        margin-top: 15px;
        margin-bottom: 10px;
      }

      /* MacBook Frame */
      .laptop-frame {
        position: absolute;
        left: 25px;
        bottom: 15px;
        width: 1120px;
        height: 700px;
        background: #0d1520;
        border-radius: 24px;
        border: 2px solid rgba(255, 255, 255, 0.22);
        box-shadow: 
          0 45px 110px -15px rgba(0, 0, 0, 0.98),
          0 0 80px rgba(20, 184, 166, 0.38),
          inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        overflow: hidden;
        transform: rotateY(-6deg) rotateX(5deg) rotateZ(0.5deg);
        transform-style: preserve-3d;
        z-index: 2;
      }

      .laptop-header {
        height: 40px;
        background: #141e2b;
        display: flex;
        align-items: center;
        padding: 0 20px;
        gap: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .mac-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .mac-dot.red { background: #ef4444; }
      .mac-dot.yellow { background: #f59e0b; }
      .mac-dot.green { background: #10b981; }

      .mac-title {
        font-size: 14px;
        font-weight: 700;
        color: #94a3b8;
        margin-left: 14px;
        letter-spacing: -0.01em;
      }

      .laptop-screen {
        width: 100%;
        height: calc(100% - 40px);
        object-fit: cover;
        object-position: top center;
        display: block;
      }

      /* iPhone 15 Pro Frame (Foreground 3D) */
      .phone-frame {
        position: absolute;
        right: 40px;
        bottom: -10px;
        width: 390px;
        height: 780px;
        background: #000000;
        border-radius: 58px;
        border: 4px solid #334155;
        box-shadow: 
          0 45px 110px rgba(0, 0, 0, 0.98),
          0 0 70px rgba(14, 165, 233, 0.45),
          inset 0 0 0 2px rgba(255, 255, 255, 0.18);
        overflow: hidden;
        transform: translateZ(100px) rotateY(-10deg) rotateX(4deg) rotateZ(-1deg);
        z-index: 6;
      }

      .phone-screen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Floating Feature Pill Badges for Depth */
      .floating-pill {
        position: absolute;
        z-index: 8;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 22px;
        background: rgba(8, 22, 33, 0.92);
        border: 1px solid rgba(45, 212, 191, 0.55);
        border-radius: 999px;
        box-shadow: 
          0 20px 45px rgba(0, 0, 0, 0.85),
          0 0 35px rgba(20, 184, 166, 0.4);
        backdrop-filter: blur(20px);
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
      }

      .floating-pill.left {
        left: 15px;
        bottom: 110px;
        transform: translateZ(70px) rotateY(-4deg);
      }

      .floating-pill.center-top {
        left: 520px;
        top: 30px;
        border-color: rgba(56, 189, 248, 0.55);
        box-shadow: 
          0 20px 45px rgba(0, 0, 0, 0.85),
          0 0 35px rgba(56, 189, 248, 0.4);
        transform: translateZ(90px);
      }

      .floating-pill-icon {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(20, 184, 166, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      /* Footer Bar with Tech Stack */
      .footer-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 20;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 22px;
      }

      .tech-badges-group {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .tech-pill {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 8px 18px;
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        font-size: 15px;
        font-weight: 800;
        color: #f1f5f9;
        backdrop-filter: blur(12px);
      }

      .tech-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .dot-next { background: #ffffff; box-shadow: 0 0 8px #ffffff; }
      .dot-laravel { background: #ff2d20; box-shadow: 0 0 8px #ff2d20; }
      .dot-flutter { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
      .dot-pg { background: #60a5fa; box-shadow: 0 0 8px #60a5fa; }
      .dot-tw { background: #2dd4bf; box-shadow: 0 0 8px #2dd4bf; }

      .footer-meta {
        font-size: 15px;
        font-weight: 700;
        color: #cbd5e1;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .badge-geo {
        color: #2dd4bf;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <div class="glow-teal"></div>
    <div class="glow-cyan"></div>
    <div class="glow-top-spot"></div>

    <!-- Header -->
    <header class="header">
      <div class="logo-group">
        <div class="logo-svg-wrapper">
          ${faviconSvg}
        </div>
        <div class="logo-text">Vital<span>Book</span></div>
      </div>
      <div class="header-badges">
        <div class="pill highlight">Enterprise Clinical Suite</div>
        <div class="pill">Web SaaS & Mobile App</div>
      </div>
    </header>

    <!-- Punchy Scalable Headline -->
    <div class="hero-title-area">
      <div class="headline-block">
        <h1>Clinical Operations, <span>Unified.</span></h1>
        <p>Full-Stack Healthcare SaaS & Cross-Platform Mobile App</p>
      </div>
      <div class="quick-stats-row">
        <div class="stat-pill"><span class="dot-pulse"></span> 3 Portals: Patient, Doctor, Admin</div>
        <div class="stat-pill">📱 iOS & Android Ready</div>
      </div>
    </div>

    <!-- 3D Perspective Stage -->
    <div class="stage-3d">
      <!-- MacBook Pro 3D Frame (Clinic Dashboard) -->
      <div class="laptop-frame">
        <div class="laptop-header">
          <div class="mac-dot red"></div>
          <div class="mac-dot yellow"></div>
          <div class="mac-dot green"></div>
          <div class="mac-title">VitalBook Admin Console — Clinic Control Center</div>
        </div>
        <img class="laptop-screen" src="data:image/png;base64,${adminBase64}" alt="Clinic Control Center" />
      </div>

      <!-- iPhone 15 Pro 3D Frame (Mobile App Home) -->
      <div class="phone-frame">
        <img class="phone-screen" src="data:image/png;base64,${mobileBase64}" alt="Mobile App Home" />
      </div>

      <!-- Floating Glass Pills for Real 3D Stacking -->
      <div class="floating-pill left">
        <span class="floating-pill-icon">⚡</span>
        Real-Time Triage & SMS OTP
      </div>

      <div class="floating-pill center-top">
        <span class="floating-pill-icon">🏥</span>
        Algeria Healthcare • 58 Wilayas
      </div>
    </div>

    <!-- Footer Bar with Tech Stack Badges -->
    <footer class="footer-bar">
      <div class="tech-badges-group">
        <div class="tech-pill"><span class="tech-dot dot-next"></span> Next.js 14</div>
        <div class="tech-pill"><span class="tech-dot dot-laravel"></span> Laravel 11</div>
        <div class="tech-pill"><span class="tech-dot dot-flutter"></span> Flutter 3.x</div>
        <div class="tech-pill"><span class="tech-dot dot-pg"></span> PostgreSQL</div>
        <div class="tech-pill"><span class="tech-dot dot-tw"></span> Tailwind CSS</div>
      </div>
      <div class="footer-meta">
        <span class="badge-geo">🇩🇿 Carte Chifa & MSPRH Compliant</span> • Upwork Showcase Ready
      </div>
    </footer>
  </body>
  </html>
  `;

  await page.setContent(thumbnailHtml);
  // Wait for webfonts and layout rendering
  await page.waitForTimeout(1200);

  const targetPathDocs = path.resolve(DOCS_DIR, "VitalBook_Upwork_3D_Thumbnail.png");
  const targetPathScreens = path.resolve(OUTPUT_DIR, "00_upwork_3d_portfolio_thumbnail.png");

  await page.screenshot({ path: targetPathDocs });
  fs.copyFileSync(targetPathDocs, targetPathScreens);

  const stats = fs.statSync(targetPathDocs);
  console.log(`✅ Saved New Upwork Thumbnail: docs/VitalBook_Upwork_3D_Thumbnail.png (${(stats.size / 1024).toFixed(1)} KB)`);
  console.log(`✅ Synced to: tools/screens/00_upwork_3d_portfolio_thumbnail.png`);

  await context.close();
  await browser.close();
}

renderUpwork3DThumbnail().catch(err => {
  console.error("Error generating Upwork thumbnail:", err);
  process.exit(1);
});
