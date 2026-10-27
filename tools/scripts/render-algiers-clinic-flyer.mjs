import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const DOCS_DIR = path.resolve(ROOT_DIR, "docs");

async function renderClinicFlyer() {
  console.log("📄 Generating 100% Light Mode Print-Ready A4 Clinic Flyer with VitalBook Calendar Logo...");

  const pdfPath = path.resolve(DOCS_DIR, "VitalBook_Fiche_Cabinet_Alger.pdf");
  const pngPath = path.resolve(DOCS_DIR, "VitalBook_Fiche_Cabinet_Alger.png");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();

  // A4 dimensions at 96 DPI: 794 x 1123 px
  await page.setViewportSize({ width: 794, height: 1123 });

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>VitalBook Algérie — Fiche de Présentation Cabinet</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600;700&family=Noto+Sans+Arabic:wght@500;700&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #FFFFFF;
        color: #0F172A;
        width: 794px;
        height: 1123px;
        padding: 34px 44px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        -webkit-font-smoothing: antialiased;
      }

      /* HEADER */
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #E2E8F0;
        padding-bottom: 14px;
      }

      .brand-container {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .logo-icon {
        width: 48px;
        height: 48px;
        filter: drop-shadow(0 2px 6px rgba(0, 102, 102, 0.2));
      }

      .logo-icon svg {
        width: 100%;
        height: 100%;
      }

      .product-title h1 {
        font-family: 'Poppins', sans-serif;
        font-size: 24px;
        font-weight: 800;
        color: #0F172A;
        letter-spacing: -0.5px;
        line-height: 1.1;
      }

      .product-title h1 span {
        color: #0D9488;
      }

      .product-title p {
        font-size: 10.5px;
        font-weight: 600;
        color: #64748B;
        letter-spacing: 0.6px;
        text-transform: uppercase;
      }

      .badge-pilot {
        background: #F0FDFA;
        border: 1.5px solid #0D9488;
        color: #006666;
        font-size: 10.5px;
        font-weight: 700;
        padding: 6px 14px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* HERO SECTION */
      .hero {
        margin-top: 14px;
      }

      .hero-tag {
        font-size: 11px;
        font-weight: 700;
        color: #E11D48;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .hero-tag::before {
        content: "";
        width: 7px;
        height: 7px;
        background-color: #E11D48;
        border-radius: 50%;
        display: inline-block;
      }

      .hero-title {
        font-family: 'Poppins', sans-serif;
        font-size: 23px;
        font-weight: 700;
        line-height: 1.25;
        letter-spacing: -0.5px;
        color: #0F172A;
      }

      .hero-title span {
        color: #006666;
        background: linear-gradient(120deg, rgba(0, 102, 102, 0.08) 0%, rgba(51, 204, 204, 0.12) 100%);
        padding: 0 6px;
        border-radius: 4px;
      }

      /* FINANCIAL STATS GRID (LIGHT PRINT-FRIENDLY) */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin: 14px 0;
      }

      .stat-card {
        background: #F8FAFC;
        border: 1.5px solid #E2E8F0;
        border-radius: 12px;
        padding: 14px;
      }

      .stat-card.alert {
        background: #FFF5F5;
        border-color: #FECDD3;
      }

      .stat-val {
        font-size: 22px;
        font-weight: 800;
        font-family: 'JetBrains Mono', monospace;
        color: #0F172A;
        margin-bottom: 3px;
      }

      .stat-card.alert .stat-val {
        color: #BE123C;
      }

      .stat-lbl {
        font-size: 11px;
        font-weight: 600;
        color: #475569;
        line-height: 1.35;
      }

      /* SOLUTION HOW IT WORKS */
      .solution-box {
        background: #FFFFFF;
        border: 1.5px solid #006666;
        border-radius: 14px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0, 102, 102, 0.05);
      }

      .solution-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .solution-header h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 13.5px;
        font-weight: 700;
        color: #006666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .solution-steps {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .step {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 10px 12px;
      }

      .step-num {
        width: 22px;
        height: 22px;
        background: #006666;
        color: #FFFFFF;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 6px;
      }

      .step-title {
        font-size: 12px;
        font-weight: 700;
        color: #0F172A;
        margin-bottom: 3px;
      }

      .step-desc {
        font-size: 10.5px;
        color: #64748B;
        line-height: 1.35;
      }

      /* BILINGUAL WHATSAPP MOCK (SIDE BY SIDE) */
      .wa-section-header {
        font-size: 11px;
        font-weight: 700;
        color: #0D9488;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        margin: 12px 0 6px 0;
        display: flex;
        justify-content: space-between;
      }

      .wa-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 12px;
      }

      .wa-preview {
        background: #F8FAFC;
        border-radius: 12px;
        padding: 12px 14px;
        border: 1.5px solid #CBD5E1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .wa-preview.arabic {
        direction: rtl;
        font-family: 'Noto Sans Arabic', 'Inter', sans-serif;
      }

      .wa-badge {
        background: #25D366;
        color: #FFFFFF;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        align-self: flex-start;
      }

      .wa-preview.arabic .wa-badge {
        align-self: flex-start;
      }

      .wa-bubble {
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 0 10px 10px 10px;
        padding: 9px 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        font-size: 11px;
        line-height: 1.45;
        color: #111827;
      }

      .wa-preview.arabic .wa-bubble {
        border-radius: 10px 0 10px 10px;
      }

      .wa-bubble strong {
        color: #006666;
      }

      /* TESTIMONIAL & QR CODE STRIP */
      .feature-strip {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 12px;
        margin-bottom: 12px;
      }

      .testimonial-card {
        background: #F8FAFC;
        border-left: 3.5px solid #006666;
        border-radius: 0 10px 10px 0;
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .testimonial-card p {
        font-size: 11px;
        font-style: italic;
        color: #334155;
        line-height: 1.4;
      }

      .testimonial-card span {
        font-size: 10px;
        font-weight: 700;
        color: #006666;
        margin-top: 4px;
      }

      .qr-card {
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .qr-code-box {
        width: 44px;
        height: 44px;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 6px;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .qr-desc h6 {
        font-size: 10.5px;
        font-weight: 700;
        color: #0F172A;
      }

      .qr-desc p {
        font-size: 9.5px;
        color: #64748B;
        line-height: 1.3;
      }

      /* TRUST & MEDICAL SECURITY BAR */
      .trust-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        margin-bottom: 12px;
      }

      .trust-item {
        background: #F1F5F9;
        border-radius: 8px;
        padding: 7px 12px;
        font-size: 10.5px;
        color: #334155;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .trust-item span {
        color: #006666;
        font-weight: 700;
      }

      /* ZERO RISK PROMISE */
      .offer-box {
        background: #F0FDF4;
        border: 1.5px dashed #22C55E;
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .offer-text h4 {
        font-family: 'Poppins', sans-serif;
        font-size: 12.5px;
        font-weight: 700;
        color: #166534;
        margin-bottom: 2px;
      }

      .offer-text p {
        font-size: 10.5px;
        color: #15803D;
        line-height: 1.3;
      }

      .offer-badge {
        background: #16A34A;
        color: #FFFFFF;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 11px;
        padding: 8px 14px;
        border-radius: 8px;
        text-align: center;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }

      /* FOOTER */
      .footer {
        border-top: 2px solid #E2E8F0;
        padding-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-brand {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .vitalsoft-logo-text {
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        font-weight: 800;
        letter-spacing: -0.3px;
      }

      .vitalsoft-logo-text .teal {
        color: #006666;
      }

      .vitalsoft-logo-text .aqua {
        color: #0D9488;
      }

      .footer-brand p {
        font-size: 10px;
        color: #64748B;
      }

      .footer-brand .links {
        font-size: 9.5px;
        color: #0D9488;
        font-weight: 600;
      }

      .contact-pills {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pill.cta {
        background: #006666;
        border: 1px solid #006666;
        color: #FFFFFF;
        font-weight: 700;
        font-size: 11.5px;
        padding: 8px 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 102, 102, 0.2);
        font-family: 'JetBrains Mono', monospace;
      }
    </style>
  </head>
  <body>

    <!-- HEADER WITH VITALBOOK CALENDAR LOGO -->
    <div class="header">
      <div class="brand-container">
        <div class="logo-icon">
          <!-- Official VitalBook Calendar Icon (favicon.svg) -->
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
        <div class="product-title">
          <h1>Vital<span>Book</span></h1>
          <p>Confirmation & Triage Médical Automatisé</p>
        </div>
      </div>
      <div class="badge-pilot">Programme Pilote — Alger 2026</div>
    </div>

    <!-- HERO -->
    <div class="hero">
      <div class="hero-tag">Constat d'Activité Médicale</div>
      <h2 class="hero-title">
        Docteur, combien vous coûtent les <span>rendez-vous non honorés</span> chaque mois ?
      </h2>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card alert">
        <div class="stat-val">4 à 6</div>
        <div class="stat-lbl">Patients absents sans prévenir chaque jour dans votre cabinet</div>
      </div>
      <div class="stat-card">
        <div class="stat-val">3 000 DA</div>
        <div class="stat-lbl">Tarif moyen d'une consultation spécialisée à Alger (2 500 – 4 000 DA)</div>
      </div>
      <div class="stat-card alert">
        <div class="stat-val">360 000 DA</div>
        <div class="stat-lbl">Perte sèche moyenne par mois (créneaux non récupérables)</div>
      </div>
    </div>

    <!-- SOLUTION -->
    <div class="solution-box">
      <div class="solution-header">
        <h3>La Solution VitalBook : Confirmation Automatisée par WhatsApp</h3>
        <span style="font-size: 10.5px; color: #0D9488; font-weight: 700;">100% Automatique & Sans Application</span>
      </div>

      <div class="solution-steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-title">Enregistrement Rapide</div>
          <div class="step-desc">Votre assistante note le rendez-vous sur son écran en 15 secondes chrono.</div>
        </div>

        <div class="step">
          <div class="step-num">2</div>
          <div class="step-title">WhatsApp Interactif</div>
          <div class="step-desc">Le patient reçoit le rappel officiel. Il tape <strong>1 pour Confirmer</strong> ou <strong>2 pour Annuler</strong>.</div>
        </div>

        <div class="step">
          <div class="step-num">3</div>
          <div class="step-title">Planning Actualisé</div>
          <div class="step-desc">L'écran s'allume en VERT. Si annulé, la place est libérée pour une urgence.</div>
        </div>
      </div>
    </div>

    <!-- BILINGUAL WHATSAPP SAMPLES -->
    <div class="wa-section-header">
      <span>Exemple de Message Envoyé au Patient (Au Choix : Français ou Arabe)</span>
      <span>Directement sur son WhatsApp</span>
    </div>

    <div class="wa-grid">
      <!-- French Preview -->
      <div class="wa-preview">
        <div class="wa-badge">🇫🇷 Version Française</div>
        <div class="wa-bubble">
          Bonjour <strong>Sarah</strong>, votre RDV avec le <strong>Dr. Mansouri</strong> est prévu le <strong>Lundi 24 Mai à 10h00</strong>.<br/>
          👉 Tapez <strong>1</strong> pour <strong>CONFIRMER</strong> votre venue.<br/>
          👉 Tapez <strong>2</strong> pour <strong>ANNULER</strong> et libérer le créneau.
        </div>
      </div>

      <!-- Arabic Preview -->
      <div class="wa-preview arabic">
        <div class="wa-badge">🇩🇿 النسخة العربية</div>
        <div class="wa-bubble">
          مرحباً <strong>سارة</strong>، موعدك الطبي مع <strong>د. منصوري</strong> مبرمج يوم <strong>الإثنين 24 ماي على 10:00</strong>.<br/>
          👉 اضغط <strong>1</strong> لـ <strong>تأكيد</strong> حضورك.<br/>
          👉 اضغط <strong>2</strong> لـ <strong>إلغاء</strong> الموعد وتحرير المكان.
        </div>
      </div>
    </div>

    <!-- TESTIMONIAL & QR CODE STRIP -->
    <div class="feature-strip">
      <div class="testimonial-card">
        <p>« Notre assistante ne perd plus 2 heures chaque matin à téléphoner. Plus de 85% de nos patients confirment par WhatsApp dès la veille. »</p>
        <span>— Dr. M. Kaci, Cabinet de Spécialités Médicales</span>
      </div>

      <div class="qr-card">
        <div class="qr-code-box">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="#006666">
            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm-2 10h8v8H2v-8zm2 2v4h4v-4H4zm10-14h8v8h-8V2zm2 2v4h4V4h-4zm-1 9h2v2h-2v-2zm4 0h3v2h-3v-2zm-4 4h3v2h-3v-2zm5 0h2v4h-2v-4zm-2 2h2v2h-2v-2zm-3 2h2v2h-2v-2zm-2-2h2v2h-2v-2z"/>
          </svg>
        </div>
        <div class="qr-desc">
          <h6>Test en Direct</h6>
          <p>Scannez pour tester le ping WhatsApp instantané sur votre mobile</p>
        </div>
      </div>
    </div>

    <!-- TRUST & MEDICAL SECURITY -->
    <div class="trust-grid">
      <div class="trust-item">
        🛡️ <span>Secret Médical :</span> Conforme à la Loi 18-07 sur la protection des données
      </div>
      <div class="trust-item">
        ⚡ <span>Zéro Matériel :</span> Fonctionne sur votre ordinateur ou tablette existante
      </div>
    </div>

    <!-- ZERO RISK PROMISE -->
    <div class="offer-box">
      <div class="offer-text">
        <h4>Essai Pilote de 30 Jours 100% Gratuit & Sans Engagement</h4>
        <p>
          • Ne modifie pas vos habitudes : fonctionne parfaitement en parallèle avec votre registre papier.<br/>
          • Mise en service et prise en main par votre assistante en 15 minutes chrono.
        </p>
      </div>
      <div class="offer-badge">
        30 JOURS<br/>OFFERTS
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="footer-brand">
        <div class="vitalsoft-logo-text">
          <span class="teal">Vital</span><span class="aqua">Soft</span>
        </div>
        <p>Solutions Numériques & Architectures de Santé</p>
        <p class="links">contact@vitalsoft.com · https://vitalsoft.aymenhamel.com</p>
      </div>
      <div class="contact-pills">
        <div class="pill cta">WhatsApp Direct : +213 549 88 24 56</div>
      </div>
    </div>

  </body>
  </html>
  `;

  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });
  console.log(`✅ Saved A4 Light Mode PDF to: ${pdfPath}`);

  await page.screenshot({ path: pngPath, fullPage: true });
  console.log(`✅ Saved A4 Light Mode PNG to: ${pngPath}`);

  await browser.close();
}

renderClinicFlyer().catch((err) => {
  console.error("❌ Error rendering clinic flyer:", err);
  process.exit(1);
});
