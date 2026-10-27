import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const MARKETING_DIR = path.resolve(ROOT_DIR, "docs/marketing");
const TEMP_VIDEO_DIR = path.resolve(MARKETING_DIR, "temp_video");

async function generateOfflineDemoVideo() {
  console.log("🎬 Generating 45-Second Mobile Interactive Demonstration Video...");

  if (!fs.existsSync(TEMP_VIDEO_DIR)) {
    fs.mkdirSync(TEMP_VIDEO_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  // Native smartphone resolution: 1080 x 1920 (9:16 vertical full screen)
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    recordVideo: {
      dir: TEMP_VIDEO_DIR,
      size: { width: 1080, height: 1920 },
    },
  });

  const page = await context.newPage();

  const demoHtml = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>VitalBook Live Walk-in Demo</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', sans-serif;
        background-color: #F8FAFC;
        color: #0F172A;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 50px 45px;
      }

      /* TOP BAR */
      .top-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #FFFFFF;
        border: 2px solid #E2E8F0;
        border-radius: 20px;
        padding: 18px 28px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
      }
      .brand-wrap {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .logo-box {
        width: 50px;
        height: 50px;
      }
      .logo-box svg { width: 100%; height: 100%; }
      .brand-text h1 {
        font-family: 'Poppins', sans-serif;
        font-size: 26px;
        font-weight: 800;
        color: #0F172A;
        line-height: 1;
      }
      .brand-text h1 span { color: #0D9488; }
      .brand-text p {
        font-size: 11.5px;
        color: #64748B;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 3px;
      }
      .clinic-pill {
        background: #F0FDFA;
        border: 1.5px solid #0D9488;
        color: #006666;
        font-size: 13px;
        font-weight: 700;
        padding: 8px 18px;
        border-radius: 20px;
      }

      /* PROGRESS STAGES BAR */
      .progress-bar {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin: 20px 0;
      }
      .stage-pill {
        flex: 1;
        background: #E2E8F0;
        color: #64748B;
        padding: 12px 10px;
        border-radius: 12px;
        text-align: center;
        font-size: 13px;
        font-weight: 700;
        transition: all 0.4s ease;
      }
      .stage-pill.active {
        background: #006666;
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(0, 102, 102, 0.25);
      }
      .stage-pill.completed {
        background: #10B981;
        color: #FFFFFF;
      }

      /* MAIN CONTAINER */
      .main-stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
      }

      /* CARD 1: RECEPTIONIST DASHBOARD */
      .step-card {
        background: #FFFFFF;
        border: 2.5px solid #E2E8F0;
        border-radius: 24px;
        padding: 34px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .card-header h2 {
        font-family: 'Poppins', sans-serif;
        font-size: 26px;
        font-weight: 800;
        color: #0F172A;
      }
      .card-header p {
        font-size: 14px;
        color: #64748B;
        margin-top: 4px;
      }

      /* FORM INPUTS */
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .form-label {
        font-size: 13px;
        font-weight: 700;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .form-input {
        background: #F8FAFC;
        border: 2px solid #CBD5E1;
        border-radius: 14px;
        padding: 16px 20px;
        font-size: 18px;
        font-weight: 600;
        color: #0F172A;
        font-family: 'Inter', sans-serif;
      }
      .form-input.filled {
        background: #FFFFFF;
        border-color: #006666;
        color: #006666;
      }

      .btn-submit {
        background: #006666;
        border: none;
        color: #FFFFFF;
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        font-weight: 800;
        padding: 20px;
        border-radius: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        box-shadow: 0 6px 20px rgba(0, 102, 102, 0.3);
        transition: transform 0.2s;
      }

      /* CARD 2: WHATSAPP INTERACTION */
      .wa-screen {
        background: #ECE5DD;
        border-radius: 24px;
        border: 2px solid #CBD5E1;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }
      .wa-bar {
        background: #075E54;
        color: #FFFFFF;
        padding: 16px 20px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .wa-bar-info h3 {
        font-size: 17px;
        font-weight: 700;
      }
      .wa-bar-info p {
        font-size: 12px;
        color: #A7F3D0;
      }
      .wa-msg-in {
        background: #FFFFFF;
        border-radius: 0 16px 16px 16px;
        padding: 18px 22px;
        font-size: 16px;
        line-height: 1.5;
        color: #111827;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        max-width: 85%;
        border-left: 4px solid #006666;
      }
      .wa-msg-in strong { color: #006666; }
      .wa-msg-out {
        background: #DCF8C6;
        border-radius: 16px 0 16px 16px;
        padding: 14px 22px;
        font-size: 18px;
        font-weight: 800;
        color: #111827;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        align-self: flex-end;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wa-msg-out .tick { color: #34B7F1; font-size: 16px; }

      /* CARD 3: SUCCESS LIVE STATUS SYNC */
      .sync-box {
        background: #F0FDF4;
        border: 2.5px solid #22C55E;
        border-radius: 20px;
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      .sync-icon {
        width: 60px;
        height: 60px;
        background: #22C55E;
        color: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 800;
      }
      .sync-box h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 24px;
        font-weight: 800;
        color: #166534;
      }
      .sync-box p {
        font-size: 15px;
        color: #15803D;
      }

      /* STATS FOOTER */
      .footer-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        margin-top: 20px;
      }
      .stat-mini {
        background: #FFFFFF;
        border: 2px solid #E2E8F0;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
      }
      .stat-mini .num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 24px;
        font-weight: 800;
        color: #006666;
      }
      .stat-mini .lbl {
        font-size: 11px;
        font-weight: 600;
        color: #64748B;
        margin-top: 4px;
      }

      /* BOTTOM BANNER */
      .bottom-bar {
        background: #FFFFFF;
        border: 2px solid #E2E8F0;
        border-radius: 20px;
        padding: 20px 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
      }
      .bottom-info h4 {
        font-family: 'Poppins', sans-serif;
        font-size: 17px;
        font-weight: 800;
        color: #0F172A;
      }
      .bottom-info p {
        font-size: 12.5px;
        color: #64748B;
      }
      .btn-cta {
        background: #006666;
        color: #FFFFFF;
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        font-weight: 800;
        padding: 12px 22px;
        border-radius: 12px;
      }
    </style>
  </head>
  <body>

    <!-- TOP BAR -->
    <div class="top-nav">
      <div class="brand-wrap">
        <div class="logo-box">
          <svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="vb-bg-cal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#14B8A6"/>
                <stop offset="0.45" stop-color="#0D9488"/>
                <stop offset="1" stop-color="#006666"/>
              </linearGradient>
            </defs>
            <rect width="1024" height="1024" rx="232" fill="url(#vb-bg-cal)"/>
            <rect x="20" y="20" width="984" height="984" rx="214" fill="none" stroke="#33CCCC" stroke-opacity="0.55" stroke-width="16"/>
            <rect x="232" y="276" width="560" height="512" rx="76" fill="#FFFFFF"/>
            <rect x="340" y="200" width="64" height="148" rx="32" fill="#FF9833"/>
            <rect x="620" y="200" width="64" height="148" rx="32" fill="#FF9833"/>
            <path fill="#0D9488" d="M412 404h80a16 16 0 0 1 16 16v76h76a16 16 0 0 1 16 16v80a16 16 0 0 1-16 16h-76v76a16 16 0 0 1-16 16h-80a16 16 0 0 1-16-16v-76h-76a16 16 0 0 1-16-16v-80a16 16 0 0 1 16-16h76v-76a16 16 0 0 1 16-16z"/>
            <path d="M528 596l84 84 168-196" fill="none" stroke="#FFFFFF" stroke-width="128" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M528 596l84 84 168-196" fill="none" stroke="#006666" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="brand-text">
          <h1>Vital<span>Book</span></h1>
          <p>Triage & Confirmation Médicale</p>
        </div>
      </div>
      <div class="clinic-pill">Cabinet Sidi Yahia</div>
    </div>

    <!-- PROGRESS STEPS -->
    <div class="progress-bar">
      <div class="stage-pill active" id="pill-step1">1. Enregistrement (15s)</div>
      <div class="stage-pill" id="pill-step2">2. WhatsApp Automatique</div>
      <div class="stage-pill" id="pill-step3">3. Planning Confirmé</div>
    </div>

    <!-- MAIN DYNAMIC STAGE CONTAINER -->
    <div class="main-stage" id="stage-content">

      <!-- SCENE 1: RECEPTIONIST DASHBOARD -->
      <div class="step-card" id="scene-reception">
        <div class="card-header">
          <h2>Prise de Rendez-vous Rapide</h2>
          <p>L'assistante entre le patient et valide le créneau en 15 secondes chrono</p>
        </div>

        <div class="form-group">
          <label class="form-label">Nom & Prénom du Patient</label>
          <div class="form-input filled" id="input-name">Sarah Benali</div>
        </div>

        <div class="form-group">
          <label class="form-label">Numéro WhatsApp du Patient</label>
          <div class="form-input filled" id="input-phone">+213 555 99 88 77</div>
        </div>

        <div class="form-group">
          <label class="form-label">Médecin Spécialiste</label>
          <div class="form-input filled">Dr. Amine Mansouri — Cardiologie</div>
        </div>

        <div class="form-group">
          <label class="form-label">Date & Créneau de Consultation</label>
          <div class="form-input filled">Lundi 24 Mai — 10h00</div>
        </div>

        <button class="btn-submit" id="btn-save">
          <span>⚡ Enregistrer & Envoyer WhatsApp</span>
        </button>
      </div>

    </div>

    <!-- FOOTER STATS SUMMARY -->
    <div class="footer-stats">
      <div class="stat-mini">
        <div class="num" id="stat-noshow">0 / Jour</div>
        <div class="lbl">Absences non prévenues</div>
      </div>
      <div class="stat-mini">
        <div class="num">+360 000 DA</div>
        <div class="lbl">Revenus protégés / mois</div>
      </div>
      <div class="stat-mini">
        <div class="num">0 Minute</div>
        <div class="lbl">Perdue au téléphone</div>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="bottom-bar">
      <div class="bottom-info">
        <h4>VitalSoft · Programme Pilote 30 Jours</h4>
        <p>Hamel Aymen · contact@vitalsoft.com</p>
      </div>
      <div class="btn-cta">WhatsApp : +213 549 88 24 56</div>
    </div>

  </body>
  </html>
  `;

  await page.setContent(demoHtml, { waitUntil: "networkidle" });

  console.log("⏱️ Animating Scene 1: Receptionist Booking (0s - 10s)...");
  await page.waitForTimeout(3000);

  // Transition to Scene 2: WhatsApp Incoming Message
  console.log("⏱️ Animating Scene 2: Inbound Patient WhatsApp (10s - 22s)...");
  await page.evaluate(() => {
    document.getElementById("pill-step1").className = "stage-pill completed";
    document.getElementById("pill-step2").className = "stage-pill active";

    document.getElementById("stage-content").innerHTML = `
      <div class="wa-screen">
        <div class="wa-bar">
          <div class="wa-bar-info">
            <h3>Cabinet Médical VitalBook</h3>
            <p>Compte Professionnel Vérifié · en ligne</p>
          </div>
          <span style="font-size: 20px;">🔒</span>
        </div>

        <div class="wa-msg-in">
          Bonjour <strong>Sarah</strong>, votre rendez-vous avec le <strong>Dr. Mansouri</strong> est prévu le <strong>Lundi 24 Mai à 10h00</strong>.<br/><br/>
          👉 Tapez <strong>1</strong> pour <strong>CONFIRMER</strong> votre présence.<br/>
          👉 Tapez <strong>2</strong> pour <strong>ANNULER</strong> et libérer le créneau.
        </div>

        <div class="wa-msg-out" id="reply-bubble" style="opacity: 0; transform: translateY(10px); transition: all 0.5s ease;">
          <span>1 (Confirmé)</span>
          <span class="tick">✓✓</span>
        </div>
      </div>
    `;
  });

  await page.waitForTimeout(2500);

  // Simulate patient typing '1'
  console.log("⏱️ Simulating Patient Tapping '1' on WhatsApp (22s - 28s)...");
  await page.evaluate(() => {
    const bubble = document.getElementById("reply-bubble");
    bubble.style.opacity = "1";
    bubble.style.transform = "translateY(0)";
  });

  await page.waitForTimeout(3500);

  // Transition to Scene 3: Live Dashboard Sync (Confirmation Turned Green)
  console.log("⏱️ Animating Scene 3: Live Dashboard Sync (28s - 38s)...");
  await page.evaluate(() => {
    document.getElementById("pill-step2").className = "stage-pill completed";
    document.getElementById("pill-step3").className = "stage-pill active completed";

    document.getElementById("stage-content").innerHTML = `
      <div class="sync-box">
        <div class="sync-icon">✓</div>
        <h3>Créneau Confirmé en Temps Réel !</h3>
        <p>Le patient Sarah Benali a confirmé sa présence via WhatsApp.<br/>Le tableau de bord de l'assistante est passé au <strong>VERT</strong> instantanément.</p>
        
        <div style="background: #FFFFFF; border: 2px solid #86EFAC; border-radius: 14px; padding: 14px 20px; width: 100%; margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div style="text-align: left;">
            <strong style="color: #0F172A; font-size: 16px;">Sarah Benali — 10h00</strong><br/>
            <span style="font-size: 13px; color: #16A34A; font-weight: 700;">● Statut: Confirmé par WhatsApp</span>
          </div>
          <span style="background: #DCFCE7; color: #166534; font-size: 12px; font-weight: 800; padding: 6px 12px; border-radius: 20px;">Dossier Prêt</span>
        </div>
      </div>
    `;
  });

  await page.waitForTimeout(4000);

  // Scene 4: Pilot Offer Call-To-Action (38s - 45s)
  console.log("⏱️ Animating Scene 4: 30-Day Free Pilot Call to Action (38s - 45s)...");
  await page.evaluate(() => {
    document.getElementById("stage-content").innerHTML = `
      <div style="background: #FFFFFF; border: 2.5px solid #006666; border-radius: 24px; padding: 36px 30px; text-align: center; box-shadow: 0 10px 30px rgba(0, 102, 102, 0.1);">
        <div style="background: #F0FDF4; border: 2px dashed #22C55E; border-radius: 16px; padding: 18px; margin-bottom: 24px;">
          <span style="color: #16A34A; font-weight: 800; font-size: 18px; text-transform: uppercase;">Programme Pilote Alger 2026</span>
          <h2 style="font-family: 'Poppins', sans-serif; font-size: 32px; font-weight: 900; color: #166534; margin: 8px 0;">30 Jours d'Essai 100% Offerts</h2>
          <p style="color: #15803D; font-size: 15px;">Sans matériel dédié · Compatible tout PC/tablette · Conforme Secret Médical</p>
        </div>

        <h3 style="font-family: 'Poppins', sans-serif; font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 12px;">Testez la démo sur votre téléphone :</h3>
        <div style="background: #006666; color: #FFFFFF; font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; padding: 18px; border-radius: 16px; box-shadow: 0 4px 18px rgba(0, 102, 102, 0.3);">
          WhatsApp : +213 549 88 24 56
        </div>
      </div>
    `;
  });

  await page.waitForTimeout(4000);

  await page.close();
  await context.close();
  await browser.close();

  // Find the recorded webm file in temp directory
  const files = fs.readdirSync(TEMP_VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    throw new Error("No webm video recorded by Playwright.");
  }

  const rawWebmPath = path.resolve(TEMP_VIDEO_DIR, files[0]);
  const finalMp4Path = path.resolve(MARKETING_DIR, "VitalBook_Demo_Clinique_45s.mp4");

  console.log(`🎬 Converting WebM to Universal H.264 MP4 via ffmpeg: ${finalMp4Path}...`);
  execSync(`/opt/homebrew/bin/ffmpeg -y -i "${rawWebmPath}" -c:v libx264 -pix_fmt yuv420p -r 30 -preset fast "${finalMp4Path}"`, { stdio: "inherit" });

  console.log(`🎉 45-Second Mobile Demo Video successfully created at: ${finalMp4Path}`);
}

generateOfflineDemoVideo().catch((err) => {
  console.error("❌ Error generating demo video:", err);
  process.exit(1);
});
