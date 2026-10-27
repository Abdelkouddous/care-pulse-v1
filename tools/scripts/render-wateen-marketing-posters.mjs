import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const POSTERS_DIR = path.resolve(ROOT_DIR, "marketing/posters");

async function renderPosters() {
  console.log("🎨 Launching Chrome for Wateen Book Marketing Poster Rendering...");

  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  try {
    // ----------------------------------------------------
    // 1. POSTER 01: Rebrand Announcement (Dark Theme)
    // ----------------------------------------------------
    console.log("📄 [1/4] Rendering Poster 01 (Rebrand Announcement)...");
    const page1 = await browser.newPage();
    await page1.setViewportSize({ width: 1200, height: 1650 });
    const html1Path = path.join(POSTERS_DIR, "poster-01-rebrand-announcement.html");
    await page1.goto(`file://${html1Path}`, { waitUntil: "networkidle" });
    await page1.waitForTimeout(1000); // Allow Google Fonts to render

    const png1Path = path.join(POSTERS_DIR, "poster-01-rebrand-announcement.png");
    const pdf1Path = path.join(POSTERS_DIR, "poster-01-rebrand-announcement.pdf");
    await page1.screenshot({ path: png1Path, fullPage: true });
    await page1.pdf({ path: pdf1Path, format: "A3", printBackground: true });
    console.log(`✅ Saved Poster 01 PNG: ${png1Path}`);
    console.log(`✅ Saved Poster 01 PDF: ${pdf1Path}`);
    await page1.close();

    // ----------------------------------------------------
    // 2. POSTER 02: B2B Clinic SaaS (Light Theme)
    // ----------------------------------------------------
    console.log("📄 [2/4] Rendering Poster 02 (B2B Clinic SaaS)...");
    const page2 = await browser.newPage();
    await page2.setViewportSize({ width: 1200, height: 1750 });
    const html2Path = path.join(POSTERS_DIR, "poster-02-b2b-clinic-saas.html");
    await page2.goto(`file://${html2Path}`, { waitUntil: "networkidle" });
    await page2.waitForTimeout(1000);

    const png2Path = path.join(POSTERS_DIR, "poster-02-b2b-clinic-saas.png");
    const pdf2Path = path.join(POSTERS_DIR, "poster-02-b2b-clinic-saas.pdf");
    await page2.screenshot({ path: png2Path, fullPage: true });
    await page2.pdf({ path: pdf2Path, format: "A3", printBackground: true });
    console.log(`✅ Saved Poster 02 PNG: ${png2Path}`);
    console.log(`✅ Saved Poster 02 PDF: ${pdf2Path}`);
    await page2.close();

    // ----------------------------------------------------
    // 3. POSTER 03: B2C Patient Booking & QR Counter-Card
    // ----------------------------------------------------
    console.log("📄 [3/4] Rendering Poster 03 (B2C Patient Booking)...");
    const page3 = await browser.newPage();
    await page3.setViewportSize({ width: 1200, height: 1700 });
    const html3Path = path.join(POSTERS_DIR, "poster-03-b2c-patient-booking.html");
    await page3.goto(`file://${html3Path}`, { waitUntil: "networkidle" });
    await page3.waitForTimeout(1000);

    const png3Path = path.join(POSTERS_DIR, "poster-03-b2c-patient-booking.png");
    const pdf3Path = path.join(POSTERS_DIR, "poster-03-b2c-patient-booking.pdf");
    await page3.screenshot({ path: png3Path, fullPage: true });
    await page3.pdf({ path: pdf3Path, format: "A3", printBackground: true });
    console.log(`✅ Saved Poster 03 PNG: ${png3Path}`);
    console.log(`✅ Saved Poster 03 PDF: ${pdf3Path}`);
    await page3.close();

    // ----------------------------------------------------
    // 4. SOCIAL CAROUSEL SLIDES (1080x1080)
    // ----------------------------------------------------
    console.log("📱 [4/4] Rendering 5x Social Carousel Square Slides (1080x1080)...");
    const page4 = await browser.newPage();
    await page4.setViewportSize({ width: 1200, height: 1250 });
    const html4Path = path.join(POSTERS_DIR, "social-carousel-templates.html");
    await page4.goto(`file://${html4Path}`, { waitUntil: "networkidle" });
    await page4.waitForTimeout(1000);

    // Hide controls bar before rendering slides
    await page4.evaluate(() => {
      const controls = document.querySelector(".controls-bar");
      if (controls) controls.style.display = "none";
      document.body.style.padding = "0";
      document.body.style.background = "transparent";
    });

    const carouselEl = await page4.$(".carousel-stage");

    for (let slideNum = 1; slideNum <= 5; slideNum++) {
      await page4.evaluate((num) => {
        for (let i = 1; i <= 5; i++) {
          const el = document.getElementById("slide" + i);
          if (el) el.classList.remove("active");
        }
        const active = document.getElementById("slide" + num);
        if (active) active.classList.add("active");
        const badge = document.getElementById("badgePage");
        if (badge) badge.innerText = `${num} / 5`;
      }, slideNum);

      await page4.waitForTimeout(200);

      const slidePngPath = path.join(POSTERS_DIR, `social-carousel-slide-${slideNum}.png`);
      if (carouselEl) {
        await carouselEl.screenshot({ path: slidePngPath });
      } else {
        await page4.screenshot({ path: slidePngPath });
      }
      console.log(`✅ Saved Social Carousel Slide ${slideNum} PNG: ${slidePngPath}`);
    }

    await page4.close();
    console.log("\n🎉 All Wateen Book Marketing Assets successfully rendered to PNG & PDF!");
  } finally {
    await browser.close();
  }
}

renderPosters().catch((err) => {
  console.error("❌ Error rendering marketing posters:", err);
  process.exit(1);
});
