import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.resolve(process.cwd(), "tools/screens");

// Ensure screens directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Rich Mock Healthcare Data Fixtures
const MOCK_FIXTURES = {
  patient: {
    id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    first_name: "Sarah",
    last_name: "Benali",
    name: "Sarah Benali",
    email: "patient@vitalbook.com",
    phone: "+213 549 88 24 56",
    role: "patient",
    national_id: "119951600000123456",
    chifa_number: "9504121234",
    blood_type: "O+",
    allergies: "Penicillin & Beta-Lactam Antibiotics (Severe)",
    current_medications: "CardioPlus 75mg (1 tab/day), Omega-3 EPA 1000mg",
    insurance_provider: "CNAS Algérie (Caisse Nationale des Assurances Sociales)",
    address: "45 Boulevard des Martyrs, Alger, Algeria",
  },
  doctor: {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    clinic_id: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
    first_name: "Amine",
    last_name: "Mansouri",
    name: "Dr. Amine Mansouri",
    email: "dr.mansouri@vitalbook.com",
    phone: "+213 550 11 22 33",
    avatar_url: "/assets/images/dr-remirez.png",
    bio: "Senior Consulting Cardiologist specializing in preventive cardiovascular diagnostics, non-invasive imaging, and hypertension management.",
    consultation_fee_cents: 400000,
    license_number: "DZ-MSPRH-16-10492",
    is_active: true,
    specialty: {
      id: "s1eebc99-9c0b-4ef8-bb6d-6bb9bd380a01",
      name: "Cardiology",
      description: "Cardiovascular clinical diagnostics and preventative heart health.",
    },
  },
  admin: {
    id: "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    admin_id: "admin_pulse_demo_01",
    name: "Dr. Aymen Hamel",
    email: "admin@vitalbook.com",
    role: "admin",
    scope: "Multi-Tenant Clinical Center",
  },
  appointments: [
    {
      id: "apt-101",
      clinic_id: "clinic-algiers",
      patient_id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      status: "scheduled",
      consultation_fee_cents: 400000,
      reason: "Cardiovascular checkup & 12-lead ECG review",
      notes: "Follow-up on blood pressure regulation. Patient adhering to therapy.",
      doctor: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Dr. Amine Mansouri",
        avatar_url: "/assets/images/dr-remirez.png",
        specialty: { name: "Cardiology" },
      },
      patient: {
        id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        name: "Sarah Benali",
        phone: "+213 549 88 24 56",
        chifa_number: "9504121234",
      },
    },
    {
      id: "apt-102",
      clinic_id: "clinic-algiers",
      patient_id: "p-202",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      scheduled_at: new Date(Date.now() + 172800000).toISOString(),
      status: "pending",
      consultation_fee_cents: 350000,
      reason: "Echocardiogram diagnostic reading",
      notes: "Referral from general physician Dr. Brahimi.",
      doctor: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Dr. Amine Mansouri",
        avatar_url: "/assets/images/dr-remirez.png",
        specialty: { name: "Cardiology" },
      },
      patient: {
        id: "p-202",
        name: "Karim Belkacem",
        phone: "+213 555 33 44 55",
        chifa_number: "9102148821",
      },
    },
    {
      id: "apt-103",
      clinic_id: "clinic-algiers",
      patient_id: "p-203",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      scheduled_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "completed",
      consultation_fee_cents: 400000,
      reason: "Holter monitor assessment",
      notes: "Normal sinus rhythm observed over 24h. No ventricular arrhythmias.",
      doctor: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Dr. Amine Mansouri",
        avatar_url: "/assets/images/dr-remirez.png",
        specialty: { name: "Cardiology" },
      },
      patient: {
        id: "p-203",
        name: "Fatima Zohra Khelif",
        phone: "+213 560 99 88 77",
        chifa_number: "8809153342",
      },
    },
    {
      id: "apt-104",
      clinic_id: "clinic-algiers",
      patient_id: "p-204",
      doctor_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      scheduled_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: "completed",
      consultation_fee_cents: 450000,
      reason: "Post-operative stent consultation",
      notes: "Arterial healing optimal. Dual antiplatelet regimen confirmed.",
      doctor: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Dr. Amine Mansouri",
        avatar_url: "/assets/images/dr-remirez.png",
        specialty: { name: "Cardiology" },
      },
      patient: {
        id: "p-204",
        name: "Omar Meziane",
        phone: "+213 770 12 34 56",
        chifa_number: "7503119904",
      },
    },
  ],
  adminStats: {
    total_patients: 1485,
    total_doctors: 42,
    total_appointments: 4320,
    pending_appointments: 18,
    scheduled_appointments: 36,
    completed_appointments: 4180,
    cancelled_appointments: 86,
    total_revenue_dzd: 17280000,
    daily_growth_percentage: 14.8,
  },
  doctorsList: [
    {
      id: "doc-1",
      first_name: "Amine",
      last_name: "Mansouri",
      name: "Dr. Amine Mansouri",
      email: "dr.mansouri@vitalbook.com",
      phone: "+213 550 11 22 33",
      avatar_url: "/assets/images/dr-remirez.png",
      consultation_fee_cents: 400000,
      license_number: "DZ-MSPRH-16-10492",
      is_active: true,
      rating: 4.95,
      review_count: 148,
      specialty: { id: "spec-1", name: "Cardiology" },
      clinic_address: "12 Rue Didouche Mourad, Alger",
    },
    {
      id: "doc-2",
      first_name: "Leila",
      last_name: "Benali",
      name: "Dr. Leila Benali",
      email: "dr.l.benali@vitalbook.com",
      phone: "+213 551 22 33 44",
      avatar_url: "/assets/images/dr-cameron.png",
      consultation_fee_cents: 350000,
      license_number: "DZ-MSPRH-16-11840",
      is_active: true,
      rating: 4.92,
      review_count: 212,
      specialty: { id: "spec-2", name: "Pediatrics" },
      clinic_address: "45 Boulevard Bougara, El Biar",
    },
    {
      id: "doc-3",
      first_name: "Karim",
      last_name: "Belkacem",
      name: "Dr. Karim Belkacem",
      email: "dr.belkacem@vitalbook.com",
      phone: "+213 552 33 44 55",
      avatar_url: "/assets/images/dr-peter.png",
      consultation_fee_cents: 500000,
      license_number: "DZ-MSPRH-16-09214",
      is_active: true,
      rating: 4.88,
      review_count: 96,
      specialty: { id: "spec-3", name: "Neurology" },
      clinic_address: "08 Rue Capitaine Menani, Hydra",
    },
    {
      id: "doc-4",
      first_name: "Nadia",
      last_name: "Zerrouki",
      name: "Dr. Nadia Zerrouki",
      email: "dr.zerrouki@vitalbook.com",
      phone: "+213 553 44 55 66",
      avatar_url: "/assets/images/dr-powell.png",
      consultation_fee_cents: 380000,
      license_number: "DZ-MSPRH-16-14022",
      is_active: true,
      rating: 4.97,
      review_count: 180,
      specialty: { id: "spec-4", name: "Dermatology" },
      clinic_address: "19 Avenue Franklin Roosevelt, Sidi M'Hamed",
    },
  ],
  patientsList: [
    {
      id: "b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
      name: "Sarah Benali",
      email: "patient@vitalbook.com",
      phone: "+213 549 88 24 56",
      national_id: "119951600000123456",
      chifa_number: "9504121234",
      blood_type: "O+",
      allergies: "Penicillin",
      wilaya_code: 16,
      total_appointments: 4,
    },
    {
      id: "p-202",
      name: "Karim Belkacem",
      email: "k.belkacem@gmail.com",
      phone: "+213 555 33 44 55",
      national_id: "119911600000456789",
      chifa_number: "9102148821",
      blood_type: "A+",
      allergies: "None",
      wilaya_code: 16,
      total_appointments: 2,
    },
    {
      id: "p-203",
      name: "Fatima Zohra Khelif",
      email: "f.khelif@gmail.com",
      phone: "+213 560 99 88 77",
      national_id: "119881600000987654",
      chifa_number: "8809153342",
      blood_type: "B+",
      allergies: "Aspirin",
      wilaya_code: 31,
      total_appointments: 7,
    },
  ],
};

async function setupPageInterception(page, role = "unauthenticated") {
  // Mock API routes to guarantee rich, deterministic data density
  await page.route("**/api/**", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/api/v1/auth/me")) {
      const user =
        role === "patient"
          ? MOCK_FIXTURES.patient
          : role === "doctor"
          ? MOCK_FIXTURES.doctor
          : role === "admin"
          ? MOCK_FIXTURES.admin
          : null;
      return route.fulfill({
        status: user ? 200 : 401,
        contentType: "application/json",
        body: JSON.stringify({ success: !!user, data: user }),
      });
    }

    if (url.includes("/api/v1/admin/dashboard")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.adminStats,
        }),
      });
    }

    if (url.includes("/api/v1/admin/appointments") || url.includes("/doctor-portal/appointments")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.appointments,
          meta: { total: MOCK_FIXTURES.appointments.length, current_page: 1, last_page: 1 },
        }),
      });
    }

    if (url.includes("/api/v1/admin/doctors") || (url.includes("/api/v1/doctors") && method === "GET")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.doctorsList,
          meta: { total: MOCK_FIXTURES.doctorsList.length },
        }),
      });
    }

    if (url.includes("/api/v1/admin/patients")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.patientsList,
          meta: { total: MOCK_FIXTURES.patientsList.length },
        }),
      });
    }

    if (url.includes("/api/v1/patients/me/appointments") || url.includes("/api/v1/appointments")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.appointments,
        }),
      });
    }

    if (url.includes("/api/v1/patients/me")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: MOCK_FIXTURES.patient,
        }),
      });
    }

    // Default passthrough or empty success
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    });
  });
}

async function configureSession(context, role) {
  const token = `token-${role}-${Date.now()}`;
  const user =
    role === "patient"
      ? MOCK_FIXTURES.patient
      : role === "doctor"
      ? MOCK_FIXTURES.doctor
      : role === "admin"
      ? MOCK_FIXTURES.admin
      : null;

  if (role === "unauthenticated" || !user) {
    await context.clearCookies();
    return;
  }

  // Set cookies for Next.js middleware & SSR
  await context.addCookies([
    { name: "vitalbook_token", value: token, domain: "localhost", path: "/" },
    { name: "vitalbook_role", value: role.toUpperCase(), domain: "localhost", path: "/" },
    { name: "vitalbook_demo", value: "true", domain: "localhost", path: "/" },
    { name: "token_expiry", value: (Date.now() + 86400000).toString(), domain: "localhost", path: "/" },
  ]);

  // Inject localStorage for frontend client-side stores
  await context.addInitScript(
    ({ role, token, user }) => {
      localStorage.setItem("vitalbook_token", token);
      localStorage.setItem("vitalbook_role", role);
      localStorage.setItem("vitalbook_demo", "true");
      localStorage.setItem("vitalbook_user", JSON.stringify(user));
      localStorage.setItem("theme", "dark"); // Default sleek dark UI mode
    },
    { role, token, user }
  );
}

// Clean screen styling injection (hides scrollbars, ensures sharp rendering)
async function polishPageUI(page) {
  await page.addStyleTag({
    content: `
      * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      ::-webkit-scrollbar {
        display: none !important;
      }
      /* Prevent Next.js portal or dev badge from interrupting screenshot */
      nextjs-portal, #__next-build-watcher, [data-nextjs-toast] {
        display: none !important;
      }
    `,
  });
}

// Main capture sequence
async function capturePortfolioScreens() {
  console.log("🚀 Starting VitalBook 15-Screen Portfolio Export Pipeline...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const screensManifest = [
    // ─── 1. LANDING PAGE (2 Screens) ──────────────────────────────────────────
    {
      id: "01_landing_hero",
      title: "Landing Page - Hero & Live Care Booking CTA",
      role: "unauthenticated",
      url: `${BASE_URL}/`,
      selector: null,
      scrollWait: 0,
    },
    {
      id: "02_landing_features",
      title: "Landing Page - Healthcare Directory & Services",
      role: "unauthenticated",
      url: `${BASE_URL}/`,
      selector: null,
      scrollTo: 920,
      scrollWait: 800,
    },

    // ─── 2. PATIENT WORKSPACE (4 Screens) ─────────────────────────────────────
    {
      id: "03_patient_dashboard",
      title: "Patient Workspace - Health Overview & Upcoming Consultations",
      role: "patient",
      url: `${BASE_URL}/patient/dashboard`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "04_patient_appointments",
      title: "Patient Workspace - Consultation Timeline & History",
      role: "patient",
      url: `${BASE_URL}/patient/dashboard/appointments`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "05_patient_booking",
      title: "Patient Workspace - Specialist Booking Wizard",
      role: "patient",
      url: `${BASE_URL}/patient/dashboard/book`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "06_patient_profile",
      title: "Patient Workspace - Biometric NIN, Chifa Card & Medical Record",
      role: "patient",
      url: `${BASE_URL}/patient/dashboard/profile`,
      selector: null,
      scrollWait: 600,
    },

    // ─── 3. ADMIN PORTAL (4 Screens) ──────────────────────────────────────────
    {
      id: "07_admin_dashboard_overview",
      title: "Admin Portal - Key Performance Indicators & Revenue Stats",
      role: "admin",
      url: `${BASE_URL}/admin/dashboard`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "08_admin_appointments_table",
      title: "Admin Portal - Real-Time Triage & Appointment Management",
      role: "admin",
      url: `${BASE_URL}/admin/dashboard`,
      selector: null,
      scrollTo: 420,
      scrollWait: 600,
    },
    {
      id: "09_admin_doctors_management",
      title: "Admin Portal - Physician Directory & Medical Licensing",
      role: "admin",
      url: `${BASE_URL}/admin/dashboard`,
      action: async (page) => {
        const btn = page.locator("button:has-text('Doctors')");
        if (await btn.count()) await btn.first().click();
        await page.waitForTimeout(600);
      },
    },
    {
      id: "10_admin_reports_analytics",
      title: "Admin Portal - Clinical Reports & Performance Intelligence",
      role: "admin",
      url: `${BASE_URL}/admin/dashboard`,
      action: async (page) => {
        const btn = page.locator("button:has-text('Reports')");
        if (await btn.count()) await btn.first().click();
        await page.waitForTimeout(600);
      },
    },

    // ─── 4. DOCTOR PORTAL (4 Screens) ─────────────────────────────────────────
    {
      id: "11_doctor_dashboard_schedule",
      title: "Doctor Portal - Daily Clinical Schedule & Capacity Quotas",
      role: "doctor",
      url: `${BASE_URL}/doctors/dashboard#schedule`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "12_doctor_patient_queue",
      title: "Doctor Portal - Attending Patient Queue & Triage",
      role: "doctor",
      url: `${BASE_URL}/doctors/dashboard#patients`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "13_doctor_consultation_plans",
      title: "Doctor Portal - Clinical Care Plans & Prescriptions",
      role: "doctor",
      url: `${BASE_URL}/doctors/dashboard#plans`,
      selector: null,
      scrollWait: 600,
    },
    {
      id: "14_doctor_directory_public",
      title: "Specialist Directory - Public Medical Search & Ratings",
      role: "unauthenticated",
      url: `${BASE_URL}/doctors`,
      selector: null,
      scrollWait: 600,
    },
  ];

  // If --cover-only is passed in CLI args, jump straight to rendering cover
  if (process.argv.includes("--cover-only")) {
    console.log("🎯 Running in --cover-only mode...");
    console.log(`\n✨ Rendering Hero 3D Device Mockup Cover (00_hero_portfolio_cover.png)...`);
    await renderHeroMockupCover(browser);
    await browser.close();
    console.log(`\n🎉 Hero Cover Refreshed at: ${path.join(OUTPUT_DIR, "00_hero_portfolio_cover.png")}\n`);
    return;
  }

  for (let i = 0; i < screensManifest.length; i++) {
    const screen = screensManifest[i];
    const indexStr = String(i + 1).padStart(2, "0");
    console.log(`\n📸 [${indexStr}/15] Capturing: ${screen.title} (${screen.id}.png)...`);

    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 2, // 2x Retina Quality (3200x2000px)
      colorScheme: "dark",
    });

    const page = await context.newPage();
    await setupPageInterception(page, screen.role);
    await configureSession(context, screen.role);

    try {
      await page.goto(screen.url, { waitUntil: "networkidle", timeout: 20000 });
      await polishPageUI(page);

      if (screen.action) {
        await screen.action(page);
      }

      if (screen.scrollTo) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), screen.scrollTo);
      }

      if (screen.scrollWait) {
        await page.waitForTimeout(screen.scrollWait);
      } else {
        await page.waitForTimeout(800);
      }

      const filePath = path.join(OUTPUT_DIR, `${screen.id}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      const stats = fs.statSync(filePath);
      console.log(`  ✓ Saved: screens/${screen.id}.png (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`  ⚠️ Error capturing ${screen.id}:`, err.message);
      // Fallback capture
      const filePath = path.join(OUTPUT_DIR, `${screen.id}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
    } finally {
      await context.close();
    }
  }

  // ─── 5. HERO 3D COMPOSITE COVER (Screen 15) ───────────────────────────────
  console.log(`\n✨ [15/15] Rendering Hero 3D Device Mockup Cover (00_hero_portfolio_cover.png)...`);
  await renderHeroMockupCover(browser);

  await browser.close();
  console.log(`\n🎉 All 15 Fresh Portfolio Screenshots Exported to: ${OUTPUT_DIR}\n`);
}

/**
 * Generates an ultra-premium 3D perspective device mockup cover card for Upwork / Mostaql
 */
async function renderHeroMockupCover(browser) {
  const adminScreenPath = path.join(OUTPUT_DIR, "07_admin_dashboard_overview.png");
  let adminBase64 = "";
  if (fs.existsSync(adminScreenPath)) {
    adminBase64 = fs.readFileSync(adminScreenPath).toString("base64");
  }

  const patientScreenPath = path.join(OUTPUT_DIR, "03_patient_dashboard.png");
  let patientBase64 = "";
  if (fs.existsSync(patientScreenPath)) {
    patientBase64 = fs.readFileSync(patientScreenPath).toString("base64");
  }

  const faviconSvgPath = path.resolve(process.cwd(), "apps/web/public/favicon.svg");
  let faviconSvg = "";
  if (fs.existsSync(faviconSvgPath)) {
    faviconSvg = fs.readFileSync(faviconSvgPath, "utf8");
  }

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  const coverHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at 50% 20%, #0d1e38 0%, #060b14 70%, #020408 100%);
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
        top: 15%;
        left: 20%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%);
        filter: blur(80px);
        pointer-events: none;
      }

      .glow-blue {
        position: absolute;
        bottom: 10%;
        right: 15%;
        width: 700px;
        height: 700px;
        background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%);
        filter: blur(90px);
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
        filter: drop-shadow(0 10px 25px rgba(20, 184, 166, 0.45));
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
        font-weight: 400;
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
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.4);
        color: #34d399;
      }

      /* Hero Stage Container */
      .stage {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        position: relative;
        z-index: 10;
        margin-top: 20px;
      }

      .hero-content {
        max-width: 650px;
      }

      .subtitle-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(56, 189, 248, 0.12);
        border: 1px solid rgba(56, 189, 248, 0.3);
        color: #38bdf8;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 20px;
      }

      .headline {
        font-size: 64px;
        font-weight: 900;
        line-height: 1.08;
        letter-spacing: -0.04em;
        margin-bottom: 24px;
        background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .headline span {
        background: linear-gradient(135deg, #34d399 0%, #38bdf8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .description {
        font-size: 20px;
        color: #94a3b8;
        line-height: 1.5;
        margin-bottom: 36px;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 10px;
      }

      .metric-box {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 18px;
        padding: 16px 20px;
        backdrop-filter: blur(10px);
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

      /* 3D Perspective Device Mockup */
      .mockup-container {
        position: relative;
        perspective: 1600px;
        width: 980px;
        height: 640px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Primary Laptop Mockup */
      .device-laptop {
        position: absolute;
        width: 860px;
        height: 540px;
        background: #0f172a;
        border-radius: 20px;
        border: 2px solid rgba(255, 255, 255, 0.16);
        box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.8),
          0 0 50px rgba(56, 189, 248, 0.25);
        overflow: hidden;
        transform: rotateY(-14deg) rotateX(8deg) rotateZ(1deg);
        transform-style: preserve-3d;
        z-index: 2;
      }

      .device-header {
        height: 32px;
        background: #1e293b;
        display: flex;
        align-items: center;
        padding: 0 16px;
        gap: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .dot.red { background: #ef4444; }
      .dot.yellow { background: #f59e0b; }
      .dot.green { background: #10b981; }

      .device-screen {
        width: 100%;
        height: calc(100% - 32px);
        object-fit: cover;
        display: block;
      }

      /* Secondary Floating Card Mockup (Patient View) */
      .floating-card {
        position: absolute;
        width: 480px;
        height: 310px;
        right: -20px;
        bottom: -30px;
        background: #0f172a;
        border-radius: 18px;
        border: 2px solid rgba(52, 211, 153, 0.4);
        box-shadow: 
          0 30px 80px rgba(0, 0, 0, 0.85),
          0 0 40px rgba(16, 185, 129, 0.3);
        overflow: hidden;
        transform: translateZ(80px) rotateY(-8deg) rotateX(4deg);
        z-index: 4;
      }

      .floating-screen {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
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
    <div class="glow-blue"></div>

    <header class="header">
      <div class="logo-group">
        <div class="logo-svg-wrapper">
          ${faviconSvg}
        </div>
        <div class="logo-text">Vital<span>Book</span></div>
      </div>
      <div class="badges-group">
        <div class="badge highlight">Enterprise Clinical SaaS</div>
        <div class="badge">Multi-Tenant Architecture</div>
        <div class="badge">MSPRH & CNAS Compliant</div>
      </div>
    </header>

    <div class="stage">
      <div class="hero-content">
        <div class="subtitle-pill">
          <span>●</span> Modern Full-Stack Medical Ecosystem
        </div>
        <h1 class="headline">
          Clinical Operations, <br>
          <span>Unified & Elevated.</span>
        </h1>
        <p class="description">
          A state-of-the-art multi-portal platform orchestrating real-time patient reservations, attending physician triage queues, and administrative hospital analytics.
        </p>

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-val">3 Portals</div>
            <div class="metric-label">Patient • Doctor • Admin</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">Real-Time</div>
            <div class="metric-label">Sanctum RBAC & SMS</div>
          </div>
          <div class="metric-box">
            <div class="metric-val">100% Type-Safe</div>
            <div class="metric-label">Next.js 14 & Laravel</div>
          </div>
        </div>
      </div>

      <div class="mockup-container">
        <!-- Main Admin Laptop Frame -->
        <div class="device-laptop">
          <div class="device-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <img class="device-screen" src="data:image/png;base64,${adminBase64}" alt="Admin Dashboard" />
        </div>

        <!-- Floating Patient Card -->
        <div class="floating-card">
          <img class="floating-screen" src="data:image/png;base64,${patientBase64}" alt="Patient Portal" />
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="stack-tags">
        <span class="stack-tag">Next.js 14 App Router</span> •
        <span class="stack-tag">Tailwind CSS & Radix UI</span> •
        <span class="stack-tag">Laravel Sanctum API</span> •
        <span class="stack-tag">PostgreSQL Multi-Tenant</span>
      </div>
      <div>Designed for Upwork & Mostaql Professional Portfolios</div>
    </footer>
  </body>
  </html>
  `;

  await page.setContent(coverHtml);
  await page.waitForTimeout(1000);

  const coverPath = path.join(OUTPUT_DIR, "00_hero_portfolio_cover.png");
  await page.screenshot({ path: coverPath });
  const stats = fs.statSync(coverPath);
  console.log(`  ✓ Saved Hero Cover: screens/00_hero_portfolio_cover.png (${(stats.size / 1024).toFixed(1)} KB)`);

  await context.close();
}

// Execute
capturePortfolioScreens().catch((err) => {
  console.error("Fatal error in export pipeline:", err);
  process.exit(1);
});
