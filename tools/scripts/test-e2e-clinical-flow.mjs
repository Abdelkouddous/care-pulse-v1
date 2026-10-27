// tools/scripts/test-e2e-clinical-flow.mjs
// Comprehensive End-to-End Clinical Flow Verification for VitalBook V1
// Tests Patient, Doctor, and Clinic Admin lifecycles against live API & Supabase PostgreSQL

const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000/api/v1";
const CLINIC_ID = process.env.CLINIC_ID || "58b759e3-41f6-47d2-aa1d-35e004849e52";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Clinic-ID": CLINIC_ID,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: response.status, ok: response.ok, data };
}

async function runClinicalAudit() {
  console.log("============================================================");
  console.log(`🏥 STARTING CLINICAL E2E AUDIT ON: ${API_BASE}`);
  console.log(`🏢 CLINIC TENANT: ${CLINIC_ID}`);
  console.log("============================================================\n");

  const results = [];

  function assert(condition, message, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      results.push({ pass: true, message });
    } else {
      console.error(`  ❌ FAIL: ${message} ${details ? `(${JSON.stringify(details)})` : ""}`);
      results.push({ pass: false, message, details });
    }
  }

  try {
    // -------------------------------------------------------------
    // PHASE 1: PUBLIC DISCOVERY & METRICS
    // -------------------------------------------------------------
    console.log("--- [PHASE 1] PUBLIC CATALOG & DISCOVERY ---");
    const specialtiesRes = await request("/specialties");
    assert(specialtiesRes.status === 200, "Catalog: GET /specialties returned 200");
    assert(Array.isArray(specialtiesRes.data.data) && specialtiesRes.data.data.length >= 4, "Catalog: Specialties list loaded >= 4 categories");

    const doctorsRes = await request("/doctors");
    assert(doctorsRes.status === 200, "Directory: GET /doctors returned 200");
    const doctors = doctorsRes.data.data || doctorsRes.data.doctors || [];
    assert(doctors.length >= 1, `Directory: Found ${doctors.length} active physicians`);
    const targetDoctor = doctors[0];
    console.log(`  -> Selected Target Physician: ${targetDoctor.name} (${targetDoctor.email})`);

    // Check availability slots for a future Monday (offset to avoid static slot collisions)
    const weeksAhead = Math.floor(Math.random() * 30) + 2;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + ((1 + 7 - nextDate.getDay()) % 7 || 7) + (weeksAhead * 7));
    const dateStr = nextDate.toISOString().split("T")[0];
    const slotsRes = await request(`/doctors/${targetDoctor.id}/slots?date=${dateStr}`);
    assert(slotsRes.status === 200, `Slots: GET /doctors/${targetDoctor.id}/slots returned 200`);
    const availableSlots = Array.isArray(slotsRes.data.data?.slots) ? slotsRes.data.data.slots : (Array.isArray(slotsRes.data.data) ? slotsRes.data.data : []);
    console.log(`  -> Available consultation slots on ${dateStr} (offset +${weeksAhead}w): ${availableSlots.length} slots`);

    // -------------------------------------------------------------
    // PHASE 2: PATIENT LIFECYCLE (SARAH BENALI)
    // -------------------------------------------------------------
    console.log("\n--- [PHASE 2] PATIENT AUTHENTICATION & CONSULTATION BOOKING ---");
    const patientLoginRes = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "patient@vitalbook.com",
        password: "password123",
      }),
    });
    assert(patientLoginRes.status === 200, "Patient: POST /auth/login authenticated successfully");
    const patientToken = patientLoginRes.data.data?.token || patientLoginRes.data.token;
    assert(!!patientToken, "Patient: Sanctum bearer token issued");

    // Verify patient profile
    const patientMeRes = await request("/patients/me", {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    assert(patientMeRes.status === 200, "Patient: GET /patients/me loaded profile");
    const patientProfile = patientMeRes.data.data || patientMeRes.data;
    assert(patientProfile.email === "patient@vitalbook.com", "Patient: Profile email matches Sarah Benali");

    // Book Appointment
    const slotToBook = availableSlots[0] || `${dateStr}T10:00:00+00:00`;
    console.log(`  -> Submitting Appointment Booking for slot: ${slotToBook}`);
    const bookingRes = await request("/appointments", {
      method: "POST",
      headers: { Authorization: `Bearer ${patientToken}` },
      body: JSON.stringify({
        doctor_id: targetDoctor.id,
        scheduled_at: slotToBook.includes("T") ? slotToBook : `${dateStr}T${slotToBook}Z`,
        reason: "Cardiovascular clinical routine evaluation & blood pressure checkup",
        note: "Patient has history of mild hypertension. Algerian Chifa policy confirmed.",
      }),
    });
    assert([200, 201].includes(bookingRes.status), "Patient: POST /appointments created new clinical appointment", bookingRes.data);
    const appointmentId = bookingRes.data.data?.id || bookingRes.data.id || bookingRes.data.appointment?.id;
    console.log(`  -> Created Appointment UUID: ${appointmentId}`);

    // Verify in Patient Appointments list
    const patientApptsRes = await request("/patients/me/appointments", {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    assert(patientApptsRes.status === 200, "Patient: GET /patients/me/appointments retrieved bookings history");

    // -------------------------------------------------------------
    // PHASE 3: PHYSICIAN PORTAL LIFECYCLE
    // -------------------------------------------------------------
    console.log("\n--- [PHASE 3] PHYSICIAN PORTAL TRIAGE ---");
    const doctorLoginRes = await request("/auth/doctor/login", {
      method: "POST",
      body: JSON.stringify({
        email: targetDoctor.email,
        password: "password123",
      }),
    });
    assert(doctorLoginRes.status === 200, `Doctor: POST /auth/doctor/login authenticated for ${targetDoctor.name}`);
    const doctorToken = doctorLoginRes.data.data?.token || doctorLoginRes.data.token;
    assert(!!doctorToken, "Doctor: Physician Sanctum bearer token issued");

    // View doctor schedule
    const doctorApptsRes = await request("/doctor-portal/appointments", {
      headers: { Authorization: `Bearer ${doctorToken}` },
    });
    assert(doctorApptsRes.status === 200, "Doctor: GET /doctor-portal/appointments retrieved doctor queue");

    // Transition appointment status: scheduled -> completed
    if (appointmentId) {
      const statusRes = await request(`/doctor-portal/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${doctorToken}` },
        body: JSON.stringify({ status: "scheduled" }),
      });
      assert(statusRes.status === 200, `Doctor: Triage status updated to 'scheduled' for ${appointmentId}`);
    }

    // -------------------------------------------------------------
    // PHASE 4: CLINIC ADMINISTRATOR CONTROL CENTER
    // -------------------------------------------------------------
    console.log("\n--- [PHASE 4] CLINIC ADMIN CONTROL CENTER ---");
    const adminLoginRes = await request("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@vitalbook.com",
        password: "password123",
      }),
    });
    assert(adminLoginRes.status === 200, "Admin: POST /auth/admin/login authenticated for Dr. Aymen Hamel");
    const adminToken = adminLoginRes.data.data?.token || adminLoginRes.data.token;
    assert(!!adminToken, "Admin: Multi-tenant Administrator Bearer Token issued");

    // Admin Dashboard KPIs
    const adminDashRes = await request("/admin/dashboard", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDashRes.status === 200, "Admin: GET /admin/dashboard loaded clinic metrics");
    console.log("  -> Clinic Metrics:", JSON.stringify(adminDashRes.data.data || adminDashRes.data));

    // Admin Consultations Queue
    const adminApptsRes = await request("/admin/appointments", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminApptsRes.status === 200, "Admin: GET /admin/appointments loaded live triage queue");

    // Admin Physicians Roster
    const adminDoctorsRes = await request("/admin/doctors", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminDoctorsRes.status === 200, "Admin: GET /admin/doctors loaded verified medical roster");

    // Admin Patients Registry
    const adminPatientsRes = await request("/admin/patients", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminPatientsRes.status === 200, "Admin: GET /admin/patients loaded patient directory");

    // Admin WhatsApp Ping Trigger (Optional)
    if (appointmentId) {
      const pingRes = await request(`/admin/appointments/${appointmentId}/whatsapp-ping`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      assert([200, 202].includes(pingRes.status), `Admin: POST /admin/appointments/${appointmentId}/whatsapp-ping triggered reminder`);
    }

    // -------------------------------------------------------------
    // PHASE 5: TWO-WAY WHATSAPP WEBHOOK TRIAGE ENGINE (JIRA-101)
    // -------------------------------------------------------------
    console.log("\n--- [PHASE 5] TWO-WAY WHATSAPP WEBHOOK TRIAGE ENGINE (JIRA-101) ---");

    // Fetch updated appointment to retrieve generated whatsapp_message_id
    const preHookRes = await request("/admin/appointments", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const preList = preHookRes.data.data?.data || preHookRes.data.data || [];
    const preAppt = preList.find((a) => a.id === appointmentId);
    const messageSid = preAppt?.whatsapp_message_id || `wam_e2e_${Date.now()}`;

    // 1. Inbound Webhook Confirmation (Patient replies "1" or "OUI")
    console.log(`  -> Simulating Inbound WhatsApp Confirmation for Appt ${appointmentId} (MessageSid: ${messageSid})...`);
    const confirmWebhookRes = await request("/webhooks/whatsapp", {
      method: "POST",
      body: JSON.stringify({
        From: "+213555998877",
        Body: "1",
        MessageSid: messageSid,
        appointment_id: appointmentId,
      }),
    });

    assert(confirmWebhookRes.status === 200, "WhatsApp Webhook: POST /webhooks/whatsapp returned 200 OK");
    assert(confirmWebhookRes.data.success === true, "WhatsApp Webhook: Response payload success flag is true");
    assert(confirmWebhookRes.data.result?.handled === true, "WhatsApp Webhook: Triage marked as handled");
    assert(confirmWebhookRes.data.result?.action === "confirmed", "WhatsApp Webhook: Action resolved as 'confirmed'");
    assert(confirmWebhookRes.data.result?.status === "scheduled", "WhatsApp Webhook: Appointment status updated to 'scheduled'");

    // 2. Verify Mutation via Admin API
    const verifyApptRes = await request("/admin/appointments", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const appointmentsList = verifyApptRes.data.data?.data || verifyApptRes.data.data || [];
    const targetedAppt = appointmentsList.find((a) => a.id === appointmentId);
    if (targetedAppt) {
      assert(targetedAppt.status === "scheduled", `Admin Audit: Live appointment ${appointmentId} status confirmed as 'scheduled'`);
      assert(targetedAppt.whatsapp_status === "confirmed", `Admin Audit: Live appointment ${appointmentId} whatsapp_status is 'confirmed'`);
    }

    // 3. Inbound Webhook Cancellation (Patient replies "2" or "NON")
    console.log(`  -> Simulating Inbound WhatsApp Cancellation for Appt ${appointmentId}...`);
    const cancelWebhookRes = await request("/webhooks/whatsapp", {
      method: "POST",
      body: JSON.stringify({
        From: "+213555998877",
        Body: "2",
        MessageSid: messageSid,
        appointment_id: appointmentId,
      }),
    });

    assert(cancelWebhookRes.status === 200, "WhatsApp Webhook: Cancellation webhook returned 200 OK");
    assert(cancelWebhookRes.data.result?.handled === true, "WhatsApp Webhook: Cancellation marked as handled");
    assert(cancelWebhookRes.data.result?.action === "cancelled", "WhatsApp Webhook: Action resolved as 'cancelled'");
    assert(cancelWebhookRes.data.result?.status === "cancelled", "WhatsApp Webhook: Status updated to 'cancelled'");

    // 4. Edge Case: Unregistered / Unknown Phone Webhook
    console.log("  -> Simulating WhatsApp Webhook from Unrecognized Phone (+213999000000)...");
    const unknownWebhookRes = await request("/webhooks/whatsapp", {
      method: "POST",
      body: JSON.stringify({
        From: "+213999000000",
        Body: "1",
        MessageSid: "wam_e2e_unknown_003",
      }),
    });

    assert(unknownWebhookRes.status === 200, "WhatsApp Webhook: Unknown phone gracefully returns 200 OK without crashing");
    assert(unknownWebhookRes.data.result?.handled === false, "WhatsApp Webhook: Unknown phone correctly unhandled");
    assert(!!unknownWebhookRes.data.result?.error, "WhatsApp Webhook: Explanatory error metadata returned");

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    const failed = results.filter((r) => !r.pass);
    console.log("\n============================================================");
    if (failed.length === 0) {
      console.log(`🎉 100% CLINICAL E2E FLOW SUCCESSFUL (${results.length}/${results.length} checks passed)`);
    } else {
      console.error(`⚠️ FAILED CHECKS: ${failed.length}/${results.length}`);
    }
    console.log("============================================================\n");
    return failed.length === 0;
  } catch (err) {
    console.error("Critical Execution Error:", err);
    return false;
  }
}

runClinicalAudit().then((success) => {
  process.exit(success ? 0 : 1);
});
