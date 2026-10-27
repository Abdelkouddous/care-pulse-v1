import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const MARKETING_DIR = path.resolve(ROOT_DIR, "docs/marketing");

async function renderMarketingAssets() {
  console.log("🎨 Starting 100% Light Mode Print & Marketing Assets Generation (Poster, Square, Story)...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  // Calendar SVG markup (Official VitalBook Logo Icon from favicon.svg)
  const calendarSvgIcon = `
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
  `;

  // ============================================================
  // 1. A3 / HIGH-IMPACT LIGHT MODE POSTER (1200 x 1700 px)
  // ============================================================
  console.log("📄 [1/3] Rendering 100% Light Mode A3 Poster...");
  const posterPage = await browser.newPage();
  await posterPage.setViewportSize({ width: 1200, height: 1700 });

  const posterHtml = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>VitalBook — Poster A3 Professionnel (Light Mode)</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@700&family=Noto+Sans+Arabic:wght@600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', sans-serif;
        background-color: #FFFFFF;
        color: #0F172A;
        width: 1200px;
        height: 1700px;
        padding: 56px 68px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        -webkit-font-smoothing: antialiased;
      }

      /* HEADER */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #E2E8F0;
        padding-bottom: 22px;
      }
      .brand-box {
        display: flex;
        align-items: center;
        gap: 18px;
      }
      .logo-icon {
        width: 72px;
        height: 72px;
        filter: drop-shadow(0 4px 10px rgba(0, 102, 102, 0.25));
      }
      .logo-icon svg { width: 100%; height: 100%; }
      .brand-title h1 {
        font-family: 'Poppins', sans-serif;
        font-size: 38px;
        font-weight: 900;
        letter-spacing: -1px;
        line-height: 1;
        color: #0F172A;
      }
      .brand-title h1 span { color: #0D9488; }
      .brand-title p {
        font-size: 13.5px;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 700;
        margin-top: 4px;
      }
      .badge-algeria {
        background: #F0FDFA;
        border: 2px solid #0D9488;
        color: #006666;
        font-size: 14px;
        font-weight: 800;
        padding: 10px 24px;
        border-radius: 30px;
        letter-spacing: 1px;
        text-transform: uppercase;
        box-shadow: 0 2px 10px rgba(13, 148, 136, 0.15);
      }

      /* HERO */
      .hero {
        margin-top: 24px;
        text-align: center;
      }
      .hero-pill {
        display: inline-block;
        background: #FFF1F2;
        border: 1.5px solid #FECDD3;
        color: #E11D48;
        font-size: 13.5px;
        font-weight: 800;
        padding: 8px 22px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 14px;
      }
      .hero-headline {
        font-family: 'Poppins', sans-serif;
        font-size: 48px;
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: -1.2px;
        color: #0F172A;
        max-width: 1040px;
        margin: 0 auto;
      }
      .hero-headline span {
        color: #006666;
        background: linear-gradient(120deg, rgba(0, 102, 102, 0.08) 0%, rgba(51, 204, 204, 0.14) 100%);
        padding: 0 10px;
        border-radius: 6px;
      }
      .hero-sub {
        font-size: 20px;
        color: #475569;
        margin-top: 14px;
        font-weight: 500;
        max-width: 880px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.45;
      }

      /* STATS ROW */
      .stats-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
        margin: 28px 0;
      }
      .stat-card {
        background: #F8FAFC;
        border: 2px solid #E2E8F0;
        border-radius: 20px;
        padding: 24px;
        text-align: center;
      }
      .stat-card.alert {
        border-color: #FECDD3;
        background: #FFF5F5;
      }
      .stat-card .val {
        font-family: 'JetBrains Mono', monospace;
        font-size: 38px;
        font-weight: 800;
        color: #0F172A;
        margin-bottom: 6px;
      }
      .stat-card.alert .val { color: #BE123C; }
      .stat-card .desc {
        font-size: 14.5px;
        color: #475569;
        line-height: 1.4;
        font-weight: 600;
      }

      /* HOW IT WORKS / 3 STEPS */
      .workflow-box {
        background: #FFFFFF;
        border: 2px solid #006666;
        border-radius: 24px;
        padding: 30px 36px;
        box-shadow: 0 8px 24px rgba(0, 102, 102, 0.06);
      }
      .workflow-title {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        font-weight: 800;
        color: #006666;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        margin-bottom: 20px;
        text-align: center;
      }
      .steps-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }
      .step-item {
        background: #F8FAFC;
        border: 1.5px solid #E2E8F0;
        border-radius: 16px;
        padding: 20px;
      }
      .step-badge {
        width: 36px;
        height: 36px;
        background: #006666;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 16px;
        color: #FFFFFF;
        margin-bottom: 12px;
      }
      .step-item h4 {
        font-family: 'Poppins', sans-serif;
        font-size: 17px;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 6px;
      }
      .step-item p {
        font-size: 13.5px;
        color: #64748B;
        line-height: 1.45;
      }

      /* BILINGUAL WHATSAPP DUAL PREVIEW */
      .wa-strip {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin: 24px 0;
      }
      .wa-card {
        background: #F8FAFC;
        border: 2px solid #CBD5E1;
        border-radius: 18px;
        padding: 20px 24px;
      }
      .wa-card.ar {
        direction: rtl;
        text-align: right;
        font-family: 'Noto Sans Arabic', 'Inter', sans-serif;
      }
      .wa-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .wa-tag {
        background: #25D366;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 12px;
        text-transform: uppercase;
      }
      .wa-text {
        font-size: 14.5px;
        line-height: 1.5;
        color: #111827;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      }
      .wa-text strong { color: #006666; }

      /* TRUST BADGES */
      .trust-strip {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 22px;
      }
      .trust-pill {
        background: #F1F5F9;
        border-radius: 12px;
        padding: 12px 20px;
        font-size: 13.5px;
        font-weight: 600;
        color: #334155;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .trust-pill strong { color: #006666; }

      /* PILOT PROMISE BAR */
      .pilot-bar {
        background: #F0FDF4;
        border: 2px dashed #22C55E;
        border-radius: 20px;
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .pilot-content h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        font-weight: 800;
        color: #166534;
        margin-bottom: 4px;
      }
      .pilot-content p {
        font-size: 13.5px;
        color: #15803D;
      }
      .pilot-cta-badge {
        background: #16A34A;
        color: #FFFFFF;
        font-family: 'Poppins', sans-serif;
        font-weight: 800;
        font-size: 15px;
        padding: 12px 26px;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 14px rgba(22, 163, 74, 0.25);
      }

      /* FOOTER */
      .footer {
        border-top: 3px solid #E2E8F0;
        padding-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .vitalsoft-logo {
        font-family: 'Poppins', sans-serif;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .vitalsoft-logo .teal { color: #006666; }
      .vitalsoft-logo .aqua { color: #0D9488; }
      .footer-meta {
        font-size: 12px;
        color: #64748B;
        line-height: 1.4;
      }
      .footer-meta span { color: #0D9488; font-weight: 600; }
      .contact-pill {
        background: #006666;
        border: 2px solid #006666;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        box-shadow: 0 4px 12px rgba(0, 102, 102, 0.25);
      }
    </style>
  </head>
  <body>

    <!-- HEADER WITH CALENDAR LOGO -->
    <div class="header">
      <div class="brand-box">
        <div class="logo-icon">
          ${calendarSvgIcon}
        </div>
        <div class="brand-title">
          <h1>Vital<span>Book</span></h1>
          <p>Confirmation Médicale & Triage de Cabinet</p>
        </div>
      </div>
      <div class="badge-algeria">Programme Pilote 2026 · Alger</div>
    </div>

    <!-- HERO -->
    <div class="hero">
      <div class="hero-tag">Secteur Médical Privé Algérien</div>
      <h2 class="hero-headline">
        Éliminez les <span>Rendez-vous Perdus</span> en Cabinet Médical.
      </h2>
      <p class="hero-sub">
        La première solution clinique intégrée qui confirme et trie automatiquement vos consultations par WhatsApp sans changer votre logiciel habituel.
      </p>
    </div>

    <!-- STATS -->
    <div class="stats-container">
      <div class="stat-card alert">
        <div class="val">4 à 6</div>
        <div class="desc">Patients absents chaque jour sans prévenir votre assistante</div>
      </div>
      <div class="stat-card alert">
        <div class="val">360 000 DA</div>
        <div class="desc">Perte sèche moyenne estimée par mois pour un praticien</div>
      </div>
      <div class="stat-card">
        <div class="val">85%</div>
        <div class="desc">Taux de réponse moyen des patients algériens par WhatsApp</div>
      </div>
    </div>

    <!-- WORKFLOW -->
    <div class="workflow-box">
      <div class="workflow-title">Comment Fonctionne VitalBook en 3 Étapes</div>
      <div class="steps-grid">
        <div class="step-item">
          <div class="step-badge">1</div>
          <h4>Enregistrement</h4>
          <p>L'assistante note le RDV sur son tableau de bord en 15 secondes chrono (Nom & Téléphone).</p>
        </div>
        <div class="step-item">
          <div class="step-badge">2</div>
          <h4>Rappel WhatsApp</h4>
          <p>Le patient reçoit le rappel officiel. Il tape <strong>1 pour Confirmer</strong> ou <strong>2 pour Annuler</strong>.</p>
        </div>
        <div class="step-item">
          <div class="step-badge">3</div>
          <h4>Planning Synchronisé</h4>
          <p>L'écran devient VERT. Si annulé, la place est libérée immédiatement pour une urgence.</p>
        </div>
      </div>
    </div>

    <!-- DUAL WHATSAPP PREVIEWS -->
    <div class="wa-strip">
      <div class="wa-card">
        <div class="wa-header">
          <span class="wa-tag">🇫🇷 WhatsApp Français</span>
        </div>
        <div class="wa-text">
          Bonjour <strong>Sarah</strong>, votre rendez-vous avec le <strong>Dr. Mansouri</strong> est prévu le <strong>Lundi 24 Mai à 10h00</strong>.<br/>
          👉 Tapez <strong>1</strong> pour <strong>CONFIRMER</strong> votre venue.<br/>
          👉 Tapez <strong>2</strong> pour <strong>ANNULER</strong> et libérer le créneau.
        </div>
      </div>
      <div class="wa-card ar">
        <div class="wa-header">
          <span class="wa-tag">🇩🇿 WhatsApp العربية</span>
        </div>
        <div class="wa-text">
          مرحباً <strong>سارة</strong>، موعدك الطبي مع <strong>د. منصوري</strong> مبرمج يوم <strong>الإثنين 24 ماي على 10:00</strong>.<br/>
          👉 اضغط <strong>1</strong> لـ <strong>تأكيد</strong> الحضور.<br/>
          👉 اضغط <strong>2</strong> لـ <strong>إلغاء</strong> الموعد وتحرير المكان.
        </div>
      </div>
    </div>

    <!-- TRUST BADGES -->
    <div class="trust-strip">
      <div class="trust-pill">
        🛡️ <strong>Secret Médical :</strong> Conforme à la Loi 18-07 sur la protection des données
      </div>
      <div class="trust-pill">
        ⚡ <strong>Zéro Matériel Requis :</strong> Fonctionne sur votre ordinateur ou tablette existante
      </div>
    </div>

    <!-- PILOT PROMISE -->
    <div class="pilot-bar">
      <div class="pilot-content">
        <h3>Programme Pilote : 30 Jours d'Essai 100% Offerts</h3>
        <p>Sans engagement · Prise en main assistante en 15 minutes chrono · Support sur place à Alger</p>
      </div>
      <div class="pilot-cta-badge">30 Jours Gratuits</div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div>
        <div class="vitalsoft-logo">
          <span class="teal">Vital</span><span class="aqua">Soft</span>
        </div>
        <p class="footer-meta">
          Solutions Numériques & Architectures de Santé · Fondateur: Hamel Aymen<br/>
          <span>https://vitalsoft.aymenhamel.com</span> · contact@vitalsoft.com
        </p>
      </div>
      <div class="contact-pill">WhatsApp Direct : +213 549 88 24 56</div>
    </div>

  </body>
  </html>
  `;

  await posterPage.setContent(posterHtml, { waitUntil: "networkidle" });
  const posterPdfPath = path.resolve(MARKETING_DIR, "VitalBook_A3_Poster.pdf");
  const posterPngPath = path.resolve(MARKETING_DIR, "VitalBook_A3_Poster.png");

  await posterPage.pdf({
    path: posterPdfPath,
    width: "1200px",
    height: "1700px",
    printBackground: true,
  });
  console.log(`✅ Saved Light Mode A3 Poster PDF to: ${posterPdfPath}`);

  await posterPage.screenshot({ path: posterPngPath, fullPage: true });
  console.log(`✅ Saved Light Mode A3 Poster PNG to: ${posterPngPath}`);
  await posterPage.close();

  // ============================================================
  // 2. SOCIAL MEDIA SQUARE POST (1:1 - 1080 x 1080 px) LIGHT MODE
  // ============================================================
  console.log("📱 [2/3] Rendering Light Mode Square Post (1080x1080)...");
  const squarePage = await browser.newPage();
  await squarePage.setViewportSize({ width: 1080, height: 1080 });

  const squareHtml = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>VitalBook — Square B2B Social Post</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', sans-serif;
        background-color: #FFFFFF;
        color: #0F172A;
        width: 1080px;
        height: 1080px;
        padding: 56px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        -webkit-font-smoothing: antialiased;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 18px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .brand-icon {
        width: 52px;
        height: 52px;
      }
      .brand-icon svg { width: 100%; height: 100%; }
      .brand-title {
        font-family: 'Poppins', sans-serif;
        font-size: 28px;
        font-weight: 800;
        color: #0F172A;
      }
      .brand-title span { color: #0D9488; }
      .pill {
        background: #F0FDFA;
        border: 1.5px solid #0D9488;
        color: #006666;
        font-size: 13px;
        font-weight: 800;
        padding: 6px 18px;
        border-radius: 20px;
        text-transform: uppercase;
      }

      .center {
        text-align: center;
        margin: 20px 0;
      }
      .alert-tag {
        color: #E11D48;
        font-size: 13.5px;
        font-weight: 800;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .headline {
        font-family: 'Poppins', sans-serif;
        font-size: 40px;
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: -1px;
        color: #0F172A;
      }
      .headline span { color: #006666; }

      .card-showcase {
        margin: 24px auto;
        background: #F8FAFC;
        border: 2px solid #CBD5E1;
        border-radius: 18px;
        padding: 20px 24px;
        max-width: 720px;
        text-align: left;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      }
      .card-showcase .badge {
        background: #25D366;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 800;
        padding: 4px 12px;
        border-radius: 10px;
        display: inline-block;
        margin-bottom: 8px;
      }
      .card-showcase p {
        font-size: 16px;
        line-height: 1.5;
        color: #111827;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        padding: 12px 16px;
        border-radius: 10px;
      }
      .card-showcase p strong { color: #006666; }

      .stats-strip {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        max-width: 720px;
        margin: 0 auto;
      }
      .stat-mini {
        background: #F8FAFC;
        border: 1.5px solid #E2E8F0;
        border-radius: 14px;
        padding: 14px;
        text-align: center;
      }
      .stat-mini .num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 26px;
        font-weight: 800;
        color: #006666;
      }
      .stat-mini .lbl {
        font-size: 12px;
        color: #475569;
        margin-top: 2px;
        font-weight: 600;
      }

      .footer {
        border-top: 2px solid #E2E8F0;
        padding-top: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .footer-left {
        font-size: 13px;
        color: #64748B;
      }
      .footer-left strong { color: #006666; font-size: 15px; }
      .footer-cta {
        background: #006666;
        color: #FFFFFF;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14.5px;
        font-weight: 800;
        padding: 11px 22px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 102, 102, 0.2);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">
        <div class="brand-icon">
          ${calendarSvgIcon}
        </div>
        <div class="brand-title">Vital<span>Book</span></div>
      </div>
      <div class="pill">Algérie 2026</div>
    </div>

    <div class="center">
      <div class="alert-tag">Problème Majeur en Cabinet Médical</div>
      <h2 class="headline">
        40% de rendez-vous manqués ?<br/>
        <span>Réglez-le avec WhatsApp.</span>
      </h2>

      <div class="card-showcase">
        <span class="badge">📱 Confirmation WhatsApp Instantanée</span>
        <p>
          "Bonjour Sarah, votre RDV avec le <strong>Dr. Mansouri</strong> est prévu le <strong>Lundi à 10h00</strong>.<br/>
          👉 Tapez <strong>1</strong> pour <strong>CONFIRMER</strong> votre venue.<br/>
          👉 Tapez <strong>2</strong> pour <strong>ANNULER</strong> et libérer le créneau."
        </p>
      </div>

      <div class="stats-strip">
        <div class="stat-mini">
          <div class="num">360 000 DA</div>
          <div class="lbl">Revenus sauvés / mois</div>
        </div>
        <div class="stat-mini">
          <div class="num">0 Heure</div>
          <div class="lbl">Perdue au téléphone</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-left">
        <strong>VitalSoft</strong> · Solutions Numériques de Santé<br/>
        Essai Pilote 30 Jours Offerts
      </div>
      <div class="footer-cta">WhatsApp : +213 549 88 24 56</div>
    </div>
  </body>
  </html>
  `;

  await squarePage.setContent(squareHtml, { waitUntil: "networkidle" });
  const squarePngPath = path.resolve(MARKETING_DIR, "VitalBook_Social_Post_Square.png");
  await squarePage.screenshot({ path: squarePngPath, fullPage: true });
  console.log(`✅ Saved Light Mode Square Social Post PNG to: ${squarePngPath}`);
  await squarePage.close();

  // ============================================================
  // 3. SOCIAL MEDIA STORY / VERTICAL (9:16 - 1080 x 1920 px)
  // ============================================================
  console.log("📲 [3/3] Rendering Light Mode Story Vertical (1080x1920)...");
  const storyPage = await browser.newPage();
  await storyPage.setViewportSize({ width: 1080, height: 1920 });

  const storyHtml = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>VitalBook — Story Format</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', sans-serif;
        background-color: #FFFFFF;
        color: #0F172A;
        width: 1080px;
        height: 1920px;
        padding: 80px 65px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        -webkit-font-smoothing: antialiased;
      }
      .story-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 20px;
      }
      .story-brand {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .brand-dot {
        width: 58px;
        height: 58px;
      }
      .brand-dot svg { width: 100%; height: 100%; }
      .brand-name {
        font-family: 'Poppins', sans-serif;
        font-size: 34px;
        font-weight: 800;
        color: #0F172A;
      }
      .brand-name span { color: #0D9488; }
      .story-badge {
        background: #F0FDFA;
        border: 1.5px solid #0D9488;
        color: #006666;
        font-size: 14px;
        font-weight: 800;
        padding: 8px 20px;
        border-radius: 20px;
        text-transform: uppercase;
      }

      .story-main {
        display: flex;
        flex-direction: column;
        gap: 32px;
      }
      .story-tag {
        color: #E11D48;
        font-size: 16px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }
      .story-title {
        font-family: 'Poppins', sans-serif;
        font-size: 50px;
        font-weight: 900;
        line-height: 1.15;
        letter-spacing: -1.5px;
        color: #0F172A;
      }
      .story-title span { color: #006666; }

      .card-bubble {
        background: #F8FAFC;
        border: 2px solid #CBD5E1;
        border-radius: 22px;
        padding: 26px 30px;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
      }
      .card-bubble .label {
        background: #25D366;
        color: #FFFFFF;
        font-size: 13px;
        font-weight: 800;
        padding: 5px 14px;
        border-radius: 12px;
        display: inline-block;
        margin-bottom: 12px;
      }
      .card-bubble p {
        font-size: 19px;
        line-height: 1.5;
        color: #111827;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        padding: 16px 20px;
        border-radius: 14px;
      }
      .card-bubble p strong { color: #006666; }

      .feature-box {
        background: #F8FAFC;
        border: 1.5px solid #E2E8F0;
        border-radius: 22px;
        padding: 26px 30px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        text-align: center;
      }
      .feature-box .num {
        font-family: 'JetBrains Mono', monospace;
        font-size: 34px;
        font-weight: 800;
        color: #006666;
      }
      .feature-box .lbl {
        font-size: 13px;
        color: #475569;
        margin-top: 4px;
        font-weight: 600;
      }

      .story-footer {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        text-align: center;
        border-top: 2px solid #E2E8F0;
        padding-top: 20px;
      }
      .offer-badge {
        background: #F0FDF4;
        border: 1.5px solid #22C55E;
        color: #15803D;
        font-size: 15px;
        font-weight: 800;
        padding: 10px 24px;
        border-radius: 30px;
        text-transform: uppercase;
      }
      .swipe-btn {
        width: 100%;
        background: #006666;
        color: #FFFFFF;
        font-family: 'Poppins', sans-serif;
        font-size: 22px;
        font-weight: 800;
        padding: 22px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 18px rgba(0, 102, 102, 0.25);
      }
      .footer-sub {
        font-size: 14px;
        color: #64748B;
      }
      .footer-sub strong { color: #006666; }
    </style>
  </head>
  <body>
    <div class="story-top">
      <div class="story-brand">
        <div class="brand-dot">
          ${calendarSvgIcon}
        </div>
        <div class="brand-name">Vital<span>Book</span></div>
      </div>
      <div class="story-badge">Secteur Médical</div>
    </div>

    <div class="story-main">
      <div>
        <div class="story-tag">Cabinets Médicaux · Algérie</div>
        <h2 class="story-title">
          Ne perdez plus <span>360 000 DA</span> chaque mois en consultations manquées.
        </h2>
      </div>

      <div class="card-bubble">
        <span class="label">📱 Confirmation WhatsApp Instantanée</span>
        <p>
          "Bonjour Sarah, votre RDV avec le <strong>Dr. Mansouri</strong> est prévu le <strong>Lundi à 10h00</strong>.<br/>
          👉 Tapez <strong>1</strong> pour <strong>CONFIRMER</strong>.<br/>
          👉 Tapez <strong>2</strong> pour <strong>ANNULER</strong>."
        </p>
      </div>

      <div class="feature-box">
        <div>
          <div class="num">15s</div>
          <div class="lbl">Pour noter le RDV</div>
        </div>
        <div>
          <div class="num">85%</div>
          <div class="lbl">Taux de réponse</div>
        </div>
        <div>
          <div class="num">0 DA</div>
          <div class="lbl">30 Jours d'essai</div>
        </div>
      </div>
    </div>

    <div class="story-footer">
      <div class="offer-badge">✓ Essai 100% Gratuit & Sans Engagement</div>
      <div class="swipe-btn">WhatsApp : +213 549 88 24 56</div>
      <div class="footer-sub">
        <strong>VitalSoft</strong> · Solutions Numériques de Santé
      </div>
    </div>
  </body>
  </html>
  `;

  await storyPage.setContent(storyHtml, { waitUntil: "networkidle" });
  const storyPngPath = path.resolve(MARKETING_DIR, "VitalBook_Social_Story_Vertical.png");
  await storyPage.screenshot({ path: storyPngPath, fullPage: true });
  console.log(`✅ Saved Light Mode Story Vertical PNG to: ${storyPngPath}`);
  await storyPage.close();

  await browser.close();
  console.log("🎉 All 100% Light Mode Marketing Graphics Successfully Regenerated!");
}

renderMarketingAssets().catch((err) => {
  console.error("❌ Error rendering marketing assets:", err);
  process.exit(1);
});
