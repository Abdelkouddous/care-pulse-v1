import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.resolve(ROOT_DIR, "tools/screens");
const DOCS_MOBILE_DIR = path.resolve(ROOT_DIR, "docs/screens/mobile");

async function renderMobile3DCover() {
  console.log("🚀 Generating 3D Mobile Device Mockup Cover for Portfolio...");

  // Load screenshots in Base64
  const loginScreenPath = path.resolve(OUTPUT_DIR, "15_mobile_patient_login.png");
  const homeScreenPath = path.resolve(DOCS_MOBILE_DIR, "02_patient_home.png");
  const faviconSvgPath = path.resolve(ROOT_DIR, "apps/web/public/favicon.svg");

  let loginBase64 = "";
  if (fs.existsSync(loginScreenPath)) {
    loginBase64 = fs.readFileSync(loginScreenPath).toString("base64");
  } else {
    throw new Error(`Login screen not found at: ${loginScreenPath}`);
  }

  let homeBase64 = "";
  if (fs.existsSync(homeScreenPath)) {
    homeBase64 = fs.readFileSync(homeScreenPath).toString("base64");
  }

  let faviconSvg = "";
  if (fs.existsSync(faviconSvgPath)) {
    faviconSvg = fs.readFileSync(faviconSvgPath, "utf8");
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // 4K 2x Retina Quality (3840x2160)
  });

  const page = await context.newPage();

  const coverHtml = `
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
        background: radial-gradient(circle at 50% 15%, #08212b 0%, #041017 50%, #010609 100%);
        color: #ffffff;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 60px 80px;
        position: relative;
      }

      /* Ambient Light Glows */
      .glow-teal {
        position: absolute;
        top: 20%;
        left: 15%;
        width: 650px;
        height: 650px;
        background: radial-gradient(circle, rgba(20, 184, 166, 0.28) 0%, transparent 70%);
        filter: blur(90px);
        pointer-events: none;
      }

      .glow-cyan {
        position: absolute;
        bottom: 12%;
        right: 18%;
        width: 750px;
        height: 750px;
        background: radial-gradient(circle, rgba(14, 165, 233, 0.26) 0%, transparent 70%);
        filter: blur(100px);
        pointer-events: none;
      }

      .glow-emerald {
        position: absolute;
        top: 35%;
        right: 30%;
        width: 450px;
        height: 450px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
        filter: blur(80px);
        pointer-events: none;
      }

      /* Header Bar */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }

      .logo-group {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .logo-svg-wrapper {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 10px 25px rgba(20, 184, 166, 0.5));
      }

      .logo-svg-wrapper svg {
        width: 100%;
        height: 100%;
        border-radius: 14px;
        display: block;
      }

      .logo-text {
        font-size: 34px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #ffffff;
      }

      .logo-text span {
        color: #14b8a6;
        font-weight: 300;
      }

      .badges-group {
        display: flex;
        gap: 14px;
      }

      .badge {
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
      }

      .badge.highlight {
        background: rgba(20, 184, 166, 0.18);
        border-color: rgba(20, 184, 166, 0.5);
        color: #2dd4bf;
      }

      /* Hero Stage Container */
      .stage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        position: relative;
        z-index: 10;
        margin-top: 10px;
      }

      .hero-content {
        max-width: 660px;
      }

      .subtitle-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 999px;
        background: rgba(20, 184, 166, 0.12);
        border: 1px solid rgba(20, 184, 166, 0.35);
        color: #2dd4bf;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 22px;
      }

      .headline {
        font-size: 64px;
        font-weight: 900;
        line-height: 1.08;
        letter-spacing: -0.04em;
        margin-bottom: 22px;
        background: linear-gradient(135deg, #ffffff 45%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .headline span {
        background: linear-gradient(135deg, #14b8a6 0%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .description {
        font-size: 19px;
        color: #94a3b8;
        line-height: 1.55;
        margin-bottom: 34px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 18px;
      }

      .metric-box {
        background: rgba(8, 30, 40, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 18px;
        padding: 16px 20px;
        backdrop-filter: blur(12px);
      }

      .metric-val {
        font-size: 26px;
        font-weight: 800;
        color: #ffffff;
      }

      .metric-label {
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
        margin-top: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* 3D Perspective Mobile Mockups */
      .mockup-container {
        position: relative;
        perspective: 1700px;
        width: 960px;
        height: 680px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Primary Phone Mockup (Login Screen) */
      .device-phone-main {
        position: absolute;
        width: 320px;
        height: 650px;
        background: #090e17;
        border-radius: 54px;
        border: 4px solid #1e293b;
        box-shadow: 
          0 40px 100px -15px rgba(0, 0, 0, 0.9),
          0 0 50px rgba(20, 184, 166, 0.35),
          inset 0 0 4px rgba(255, 255, 255, 0.4);
        overflow: hidden;
        transform: rotateY(-18deg) rotateX(8deg) rotateZ(-2deg);
        transform-style: preserve-3d;
        z-index: 3;
        left: 210px;
      }

      /* Titanium Phone Border Ring */
      .device-phone-main::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        pointer-events: none;
        z-index: 10;
      }

      /* Dynamic Island */
      .island {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 90px;
        height: 24px;
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
        width: 310px;
        height: 630px;
        background: #090e17;
        border-radius: 54px;
        border: 4px solid #1e293b;
        box-shadow: 
          0 35px 90px rgba(0, 0, 0, 0.88),
          0 0 45px rgba(14, 165, 233, 0.3),
          inset 0 0 4px rgba(255, 255, 255, 0.3);
        overflow: hidden;
        transform: translateZ(90px) rotateY(-12deg) rotateX(6deg) rotateZ(3deg);
        z-index: 5;
        right: 100px;
        bottom: 20px;
      }

      .device-phone-secondary::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50px;
        border: 2px solid rgba(56, 189, 248, 0.35);
        pointer-events: none;
        z-index: 10;
      }

      /* Floating Feature Pill Badge */
      .floating-feature-badge {
        position: absolute;
        bottom: 70px;
        left: 90px;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(20, 184, 166, 0.5);
        border-radius: 16px;
        padding: 12px 20px;
        backdrop-filter: blur(14px);
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
        transform: translateZ(140px);
        z-index: 8;
      }

      .badge-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: rgba(20, 184, 166, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #2dd4bf;
        font-size: 20px;
      }

      .badge-text-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }

      .badge-text-sub {
        font-size: 11px;
        color: #94a3b8;
      }

      /* Footer */
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 24px;
        font-size: 14px;
        color: #64748b;
      }

      .stack-tags {
        display: flex;
        gap: 12px;
      }

      .stack-tag {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="glow-teal"></div>
    <div class="glow-cyan"></div>
    <div class="glow-emerald"></div>

    <header class="header">
      <div class="logo-group">
        <div class="logo-svg-wrapper">
          ${faviconSvg}
        </div>
        <div class="logo-text">Vital<span>Book</span></div>
      </div>
      <div class="badges-group">
        <div class="badge highlight">Flutter 3.x Mobile App</div>
        <div class="badge">Riverpod & Clean Arch</div>
        <div class="badge">iOS & Android Ready</div>
      </div>
    </header>

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
            <div class="metric-label">Type-Safe Architecture</div>
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

    <footer class="footer">
      <div class="stack-tags">
        <span class="stack-tag">Flutter 3.x SDK</span> •
        <span class="stack-tag">Dart 3 & Riverpod</span> •
        <span class="stack-tag">GoRouter & Dio Client</span> •
        <span class="stack-tag">Laravel 11 REST API</span>
      </div>
      <div>Designed for Upwork & Mostaql Professional Portfolios</div>
    </footer>
  </body>
  </html>
  `;

  await page.setContent(coverHtml);
  await page.waitForTimeout(1000);

  // Save to both tools/screens and docs/screens/mobile
  const outPath1 = path.join(OUTPUT_DIR, "16_mobile_3d_showcase_cover.png");
  const outPath2 = path.join(DOCS_MOBILE_DIR, "00_mobile_3d_showcase_cover.png");

  await page.screenshot({ path: outPath1 });
  await page.screenshot({ path: outPath2 });

  const stats1 = fs.statSync(outPath1);
  console.log(`  ✓ Saved 3D Mobile Cover: tools/screens/16_mobile_3d_showcase_cover.png (${(stats1.size / 1024).toFixed(1)} KB)`);
  console.log(`  ✓ Saved 3D Mobile Cover: docs/screens/mobile/00_mobile_3d_showcase_cover.png`);

  await context.close();
  await browser.close();
  console.log("🎉 3D Mobile Showcase Cover successfully created!");
}

renderMobile3DCover().catch((err) => {
  console.error("Error creating 3D mobile cover:", err);
  process.exit(1);
});
