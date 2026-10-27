import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.resolve(ROOT_DIR, "tools/screens");
const DOCS_DIR = path.resolve(ROOT_DIR, "docs");
const DOCS_MOBILE_DIR = path.resolve(ROOT_DIR, "docs/screens/mobile");

async function renderUpworkMobile3DThumbnail() {
  console.log("🎨 Rendering 4:3 Upwork-Ready 3D Mobile Showcase Thumbnail...");

  const loginScreenPath = path.resolve(OUTPUT_DIR, "15_mobile_patient_login.png");
  const homeScreenPath = path.resolve(DOCS_MOBILE_DIR, "02_patient_home.png");
  const faviconSvgPath = path.resolve(ROOT_DIR, "apps/web/public/favicon.svg");

  if (!fs.existsSync(loginScreenPath)) throw new Error(`Login screen not found: ${loginScreenPath}`);
  if (!fs.existsSync(homeScreenPath)) throw new Error(`Home screen not found: ${homeScreenPath}`);

  const loginBase64 = fs.readFileSync(loginScreenPath).toString("base64");
  const homeBase64 = fs.readFileSync(homeScreenPath).toString("base64");
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
        background: radial-gradient(circle at 50% 18%, #082330 0%, #04121a 45%, #010609 100%);
        color: #ffffff;
        width: 1600px;
        height: 1200px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 48px 60px 42px 60px;
        position: relative;
      }

      /* Ambient Light Glows */
      .glow-teal {
        position: absolute;
        top: 20%;
        left: 10%;
        width: 750px;
        height: 750px;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.32) 0%, transparent 68%);
        filter: blur(100px);
        pointer-events: none;
        z-index: 1;
      }

      .glow-cyan {
        position: absolute;
        bottom: 12%;
        right: 12%;
        width: 800px;
        height: 800px;
        background: radial-gradient(circle, rgba(14, 165, 233, 0.30) 0%, transparent 70%);
        filter: blur(110px);
        pointer-events: none;
        z-index: 1;
      }

      .glow-emerald {
        position: absolute;
        top: 35%;
        right: 28%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%);
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
        width: 54px;
        height: 54px;
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

      /* Stage Split: Left Content + Right 3D Mockup */
      .stage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        position: relative;
        z-index: 10;
        margin-top: 10px;
        margin-bottom: 5px;
      }

      /* Left Text Column */
      .hero-content {
        width: 610px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .subtitle-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 999px;
        background: rgba(20, 184, 166, 0.14);
        border: 1px solid rgba(20, 184, 166, 0.4);
        color: #2dd4bf;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        margin-bottom: 18px;
        align-self: flex-start;
      }

      .headline {
        font-size: 56px;
        font-weight: 900;
        line-height: 1.08;
        letter-spacing: -0.04em;
        margin-bottom: 18px;
        background: linear-gradient(135deg, #ffffff 45%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .headline span {
        background: linear-gradient(135deg, #2dd4bf 0%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .description {
        font-size: 19px;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 28px;
        font-weight: 500;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
      }

      .metric-box {
        background: rgba(8, 30, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 16px;
        padding: 16px 18px;
        backdrop-filter: blur(14px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      .metric-val {
        font-size: 24px;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: -0.02em;
      }

      .metric-label {
        font-size: 11px;
        color: #64748b;
        font-weight: 700;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* 3D Perspective Mobile Mockups (Right Side) */
      .mockup-container {
        position: relative;
        perspective: 1800px;
        width: 840px;
        height: 800px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Primary Phone Mockup (Login Screen) */
      .device-phone-main {
        position: absolute;
        width: 360px;
        height: 720px;
        background: #090e17;
        border-radius: 54px;
        border: 4px solid #1e293b;
        box-shadow: 
          0 45px 110px -15px rgba(0, 0, 0, 0.95),
          0 0 60px rgba(20, 184, 166, 0.4),
          inset 0 0 4px rgba(255, 255, 255, 0.4);
        overflow: hidden;
        transform: rotateY(-17deg) rotateX(7deg) rotateZ(-2deg);
        transform-style: preserve-3d;
        z-index: 3;
        left: 55px;
        bottom: 20px;
      }

      .device-phone-main::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50px;
        border: 2px solid rgba(255, 255, 255, 0.14);
        pointer-events: none;
        z-index: 10;
      }

      .island {
        position: absolute;
        top: 14px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 26px;
        background: #000000;
        border-radius: 20px;
        z-index: 12;
      }

      .phone-screen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 48px;
      }

      /* Secondary Floating Phone Mockup (Patient Home Screen) */
      .device-phone-secondary {
        position: absolute;
        width: 350px;
        height: 700px;
        background: #090e17;
        border-radius: 54px;
        border: 4px solid #1e293b;
        box-shadow: 
          0 40px 100px rgba(0, 0, 0, 0.92),
          0 0 55px rgba(14, 165, 233, 0.38),
          inset 0 0 4px rgba(255, 255, 255, 0.35);
        overflow: hidden;
        transform: translateZ(95px) rotateY(-11deg) rotateX(5deg) rotateZ(3deg);
        z-index: 5;
        right: 45px;
        bottom: 40px;
      }

      .device-phone-secondary::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50px;
        border: 2px solid rgba(56, 189, 248, 0.4);
        pointer-events: none;
        z-index: 10;
      }

      /* Floating Feature Pill Badge */
      .floating-feature-badge {
        position: absolute;
        bottom: 60px;
        left: -10px;
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(20, 184, 166, 0.6);
        border-radius: 20px;
        padding: 14px 22px;
        backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(20, 184, 166, 0.35);
        transform: translateZ(150px);
        z-index: 8;
      }

      .badge-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(20, 184, 166, 0.22);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2dd4bf;
        font-size: 22px;
      }

      .badge-text-title {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
      }

      .badge-text-sub {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 500;
      }

      /* Floating Top Specialty Badge */
      .floating-top-badge {
        position: absolute;
        top: 40px;
        right: 25px;
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(56, 189, 248, 0.55);
        border-radius: 20px;
        padding: 12px 20px;
        backdrop-filter: blur(16px);
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.3);
        transform: translateZ(130px);
        z-index: 8;
      }

      /* Footer Bar */
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
        font-size: 14px;
        font-weight: 800;
        color: #f1f5f9;
        backdrop-filter: blur(12px);
      }

      .tech-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
      }
      .dot-flutter { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
      .dot-riverpod { background: #14b8a6; box-shadow: 0 0 8px #14b8a6; }
      .dot-laravel { background: #ff2d20; box-shadow: 0 0 8px #ff2d20; }
      .dot-pg { background: #60a5fa; box-shadow: 0 0 8px #60a5fa; }

      .footer-meta {
        font-size: 14px;
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
    <div class="glow-emerald"></div>

    <!-- Header -->
    <header class="header">
      <div class="logo-group">
        <div class="logo-svg-wrapper">
          ${faviconSvg}
        </div>
        <div class="logo-text">Vital<span>Book</span></div>
      </div>
      <div class="header-badges">
        <div class="pill highlight">Flutter 3.x Mobile App</div>
        <div class="pill">Riverpod & Clean Arch</div>
        <div class="pill">iOS & Android Ready</div>
      </div>
    </header>

    <!-- Stage Split: Left Content + Right 3D Mockup -->
    <div class="stage">
      <div class="hero-content">
        <div class="subtitle-pill">
          <span>●</span> Native Cross-Platform Healthcare Experience
        </div>
        <h1 class="headline">
          Clinical Booking, <br>
          <span>Native & On-the-Go.</span>
        </h1>
        <p class="description">
          A sleek, production-grade Flutter application empowering Algerian patients with fast SMS OTP authentication, real-time doctor slot reservations, and unified medical bookings.
        </p>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-val">60 / 120 FPS</div>
            <div class="metric-label">Impeller Metal Engine</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">58 Wilayas</div>
            <div class="metric-label">Algeria Directory & Chifa</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Riverpod 3</div>
            <div class="metric-label">Type-Safe State</div>
          </div>
        </div>
      </div>

      <div class="mockup-container">
        <!-- Main Phone Mockup: Login Flow -->
        <div class="device-phone-main">
          <div class="island"></div>
          <img class="phone-screen" src="data:image/png;base64,${loginBase64}" alt="VitalBook Mobile Login" />
        </div>

        <!-- Secondary Phone Mockup: Patient Home Experience -->
        <div class="device-phone-secondary">
          <div class="island"></div>
          <img class="phone-screen" src="data:image/png;base64,${homeBase64}" alt="VitalBook Patient Home" />
        </div>

        <!-- Floating Glassmorphism Badge -->
        <div class="floating-feature-badge">
          <div class="badge-icon">⚡</div>
          <div>
            <div class="badge-text-title">Instant OTP Auth</div>
            <div class="badge-text-sub">Algerian Phone +213 Verification</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bar -->
    <footer class="footer-bar">
      <div class="tech-badges-group">
        <div class="tech-pill"><span class="tech-dot dot-flutter"></span> Flutter 3.x</div>
        <div class="tech-pill"><span class="tech-dot dot-riverpod"></span> Riverpod 3</div>
        <div class="tech-pill"><span class="tech-dot dot-laravel"></span> Laravel 11 REST</div>
        <div class="tech-pill"><span class="tech-dot dot-pg"></span> PostgreSQL</div>
      </div>
      <div class="footer-meta">
        <span class="badge-geo">🇩🇿 Carte Chifa & MSPRH</span> • Upwork Showcase Ready
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

renderUpworkMobile3DThumbnail().catch(err => {
  console.error("Error generating Upwork thumbnail:", err);
  process.exit(1);
});
