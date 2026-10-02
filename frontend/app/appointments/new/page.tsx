"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDoctorsList, useDoctorSlots, useDoctorDetail } from "@/hooks/useDoctors";
import { useAppointments } from "@/hooks/useAppointments";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDoctorId = searchParams.get("doctorId") || "";

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(initialDoctorId ? 2 : 1);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId);
  const [specialtyFilter, setSpecialtyFilter] = useState("All");
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctorsList();
  const { data: doctorDetail } = useDoctorDetail(selectedDoctorId);
  const { data: availableSlots, isLoading: isSlotsLoading } = useDoctorSlots(
    selectedDoctorId,
    selectedDate
  );
  const { bookAppointment } = useAppointments();

  const doctorsList = doctorsData?.doctors || [];

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchDoctorQuery.toLowerCase()) ||
        doc.specialty?.name.toLowerCase().includes(searchDoctorQuery.toLowerCase());
      const matchesSpecialty =
        specialtyFilter === "All" ||
        doc.specialty?.name.toLowerCase() === specialtyFilter.toLowerCase();
      return matchesSearch && matchesSpecialty;
    });
  }, [doctorsList, searchDoctorQuery, specialtyFilter]);

  const selectedDoctor = doctorDetail || doctorsList.find((d) => d.id === selectedDoctorId);

  // Fallback slots if doctor has availability
  const timeSlots: string[] = (Array.isArray(availableSlots) && availableSlots.length > 0)
    ? availableSlots
    : [
    "09:00:00",
    "09:30:00",
    "10:00:00",
    "10:30:00",
    "11:00:00",
    "14:00:00",
    "14:30:00",
    "15:00:00",
    "15:30:00",
    "16:00:00",
  ];

  // Format slot display helper (handles both ISO strings like '2026-10-06T09:00:00+00:00' and '09:00:00')
  const getSlotDisplay = (slot: string) => {
    if (slot.includes("T")) {
      const parts = slot.split("T")[1];
      return parts.substring(0, 5);
    }
    return slot.substring(0, 5);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctorId || !selectedSlot || !reason.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Build ISO UTC timestamp for slot robustly
      let scheduledIso = selectedSlot;
      if (!scheduledIso.includes("T")) {
        const timeFormatted = selectedSlot.length === 5 ? `${selectedSlot}:00` : selectedSlot;
        scheduledIso = `${selectedDate}T${timeFormatted}Z`;
      }

      const appt = await bookAppointment.mutateAsync({
        doctor_id: selectedDoctorId,
        scheduled_at: scheduledIso,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
      });

      setBookedAppointment(appt);
      setCurrentStep(5); // Success step
      toast({
        title: "Appointment Successfully Scheduled",
        description: "Your consultation has been registered in the clinic system.",
      });
    } catch (err: any) {
      const detail =
        err.response?.data?.errors?.scheduled_at?.[0] ||
        err.response?.data?.message ||
        "This slot has already been booked. Please choose another time.";
      setErrorMsg(detail);
      toast({
        title: "Booking Conflict",
        description: detail,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: "Physician" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Consultation Details" },
    { num: 4, label: "Review & Confirm" },
  ];

  return (
    <AppShell role="patient" pageTitle="Schedule Consultation">
      <PageHeader
        title="Book Medical Consultation"
        subtitle="Complete our 4-step wizard to reserve a guaranteed consultation slot with a licensed clinician."
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Step {currentStep <= 4 ? currentStep : 4} of 4
          </span>
        }
      />

      {/* ======================================================================= */}
      {/* 4-STEP WIZARD PROGRESS BAR */}
      {/* ======================================================================= */}
      {currentStep <= 4 && (
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-0"
              style={{
                width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`,
              }}
            />

            {stepsList.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                      isDone
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md"
                        : "bg-card text-muted-foreground border border-border"
                    )}
                  >
                    {isDone ? <CheckCircle2 className="size-4" /> : s.num}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold mt-2 hidden sm:block",
                      isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Wizard Content Card */}
      <div className="max-w-3xl mx-auto">
        {/* =================================================================== */}
        {/* STEP 1: CHOOSE DOCTOR */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search physician by name or specialty..."
                  value={searchDoctorQuery}
                  onChange={(e) => setSearchDoctorQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
              </div>

              {/* Specialty Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
                {["All", "Cardiology", "Pediatrics", "General Medicine", "Dermatology"].map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSpecialtyFilter(spec)}
                    className={cn(
                      "px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                      specialtyFilter === spec
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {isDoctorsLoading ? (
              <div className="space-y-3">
                <div className="h-28 rounded-2xl bg-muted animate-pulse" />
                <div className="h-28 rounded-2xl bg-muted animate-pulse" />
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card">
                <p className="text-sm text-muted-foreground">No doctors match your search criteria.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setCurrentStep(2);
                    }}
                    className={cn(
                      "p-5 rounded-2xl border border-border bg-card hover:border-primary cursor-pointer transition-all duration-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group shadow-xs hover:shadow-md",
                      selectedDoctorId === doc.id && "border-primary ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="size-13 rounded-2xl border border-border group-hover:scale-105 transition-transform">
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-base rounded-2xl">
                          {doc.name.replace("Dr. ", "").substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="space-y-0.5">
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-primary font-semibold">
                          {doc.specialty?.name || "General Medicine"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                          {doc.bio || "Senior certified physician specializing in clinical consultation."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                          Consultation Fee
                        </span>
                        <span className="font-bold text-foreground text-sm">
                          {((doc.consultation_fee_cents || 300000) / 100).toLocaleString()} DZD
                        </span>
                      </div>

                      <Button
                        roleVariant="patient"
                        size="sm"
                        className="rounded-xl shadow-xs"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 2: DATE & TIME SLOTS */}
        {/* =================================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {selectedDoctor && (
              <div className="p-4 rounded-2xl border border-border bg-secondary/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs">
                    MD
                  </div>
                  <div>
                    <span className="font-bold text-sm text-foreground block">{selectedDoctor.name}</span>
                    <span className="text-xs text-primary font-medium">{selectedDoctor.specialty?.name}</span>
                  </div>
                </div>

                <Button
                  roleVariant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Change Doctor
                </Button>
              </div>
            )}

            <div className="p-6 rounded-3xl border border-border bg-card space-y-6 shadow-xs">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Select Consultation Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                  className="w-full sm:w-64 h-11 px-3.5 rounded-xl border border-border bg-secondary text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Select Available Time Slot
                </label>

                {isSlotsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-10 rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {timeSlots.map((slot) => {
                      const timeDisplay = getSlotDisplay(slot);
                      const isSelected = selectedSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "h-11 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-center gap-1.5 shadow-xs",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20"
                              : "bg-secondary/40 border-border text-foreground hover:bg-secondary hover:border-primary/50"
                          )}
                        >
                          <Clock className="size-3.5 opacity-60" />
                          <span>{timeDisplay}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                roleVariant="outline"
                onClick={() => setCurrentStep(1)}
                className="gap-2 rounded-xl text-xs"
              >
                <ArrowLeft className="size-3.5" /> Previous
              </Button>

              <Button
                roleVariant="patient"
                disabled={!selectedSlot}
                onClick={() => setCurrentStep(3)}
                className="gap-2 rounded-xl font-bold text-xs"
              >
                Next: Consultation Details <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: REASON & CLINICAL NOTES */}
        {/* =================================================================== */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl border border-border bg-card space-y-5 shadow-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Reason for Consultation <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">{reason.length} / 500</span>
                </div>
                <input
                  type="text"
                  maxLength={500}
                  placeholder="e.g. Routine cardiology follow-up, chest tightness evaluation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Provide a concise summary so the physician can review relevant medical charts in advance.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Additional Clinical Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any existing medications, recent symptom changes, or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none shadow-xs"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                roleVariant="outline"
                onClick={() => setCurrentStep(2)}
                className="gap-2 rounded-xl text-xs"
              >
                <ArrowLeft className="size-3.5" /> Previous
              </Button>

              <Button
                roleVariant="patient"
                disabled={!reason.trim()}
                onClick={() => setCurrentStep(4)}
                className="gap-2 rounded-xl font-bold text-xs"
              >
                Review Summary <ArrowRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: REVIEW & CONFIRM */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-3 text-xs sm:text-sm">
                <AlertCircle className="size-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground pb-3 border-b border-border">
                Booking Verification Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Assigned Physician
                  </span>
                  <span className="font-bold text-foreground text-base block">
                    {selectedDoctor?.name || "Dr. Amine Mansouri"}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {selectedDoctor?.specialty?.name || "Cardiology"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Scheduled Slot
                  </span>
                  <span className="font-bold text-foreground text-base block">
                    📅 {(() => {
                      try {
                        const d = selectedSlot.includes("T")
                          ? new Date(selectedSlot)
                          : new Date(`${selectedDate}T${selectedSlot.length === 5 ? `${selectedSlot}:00` : selectedSlot}`);
                        return isNaN(d.getTime()) ? selectedDate : d.toLocaleDateString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        });
                      } catch {
                        return selectedDate;
                      }
                    })()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ⏰ Time: {getSlotDisplay(selectedSlot)} (Africa/Algiers)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Clinic Center
                  </span>
                  <span className="font-semibold text-foreground block">
                    CarePulse Medical Center
                  </span>
                  <span className="text-xs text-muted-foreground">
                    12 Rue Didouche Mourad, Algiers
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Consultation Fee
                  </span>
                  <span className="font-extrabold text-foreground text-lg text-emerald-600 dark:text-emerald-400 block">
                    {(((selectedDoctor?.consultation_fee_cents || 300000)) / 100).toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-muted-foreground">Payable at clinic desk or via CNAS</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Consultation Purpose
                </span>
                <p className="text-xs sm:text-sm text-foreground italic bg-secondary/50 p-3 rounded-xl border border-border">
                  &ldquo;{reason}&rdquo;
                </p>
                {notes && (
                  <p className="text-xs text-muted-foreground pt-1">
                    Notes: {notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                roleVariant="outline"
                onClick={() => setCurrentStep(3)}
                className="gap-2 rounded-xl text-xs"
              >
                <ArrowLeft className="size-3.5" /> Edit Details
              </Button>

              <Button
                roleVariant="patient"
                disabled={isSubmitting}
                onClick={handleConfirmBooking}
                className="gap-2 rounded-xl font-bold shadow-lg"
              >
                {isSubmitting ? "Locking Slot..." : "Confirm & Book Consultation"}
              </Button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 5: SUCCESS CONFIRMATION */}
        {/* =================================================================== */}
        {currentStep === 5 && (
          <div className="p-8 sm:p-12 text-center rounded-3xl border border-border bg-card space-y-6 shadow-md">
            <div className="size-16 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Consultation Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Your consultation slot with{" "}
                <span className="font-semibold text-foreground">{selectedDoctor?.name}</span> on{" "}
                <span className="font-semibold text-foreground">
                  {selectedDate} at {getSlotDisplay(selectedSlot)}
                </span>{" "}
                has been successfully reserved.
              </p>
            </div>

            {bookedAppointment?.id && (
              <div className="inline-block p-3 rounded-xl bg-secondary text-xs font-mono text-muted-foreground border border-border">
                Booking Reference ID: <span className="font-bold text-foreground">{bookedAppointment.id}</span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                roleVariant="outline"
                onClick={() => {
                  const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Medical Consultation with ${selectedDoctor?.name}\nDESCRIPTION:${reason}\nLOCATION:CarePulse Medical Center\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
                  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
                  const link = document.createElement("a");
                  link.href = window.URL.createObjectURL(blob);
                  link.setAttribute("download", `carepulse_appointment_${selectedDate}.ics`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full sm:w-auto rounded-xl text-xs gap-2"
              >
                <CalendarPlus className="size-4" /> Add to Calendar
              </Button>

              <Link href="/patient/dashboard" className="w-full sm:w-auto">
                <Button roleVariant="patient" className="w-full sm:w-auto rounded-xl font-bold">
                  Go to Patient Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function NewAppointmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading appointment booking wizard...</div>}>
      <NewAppointmentContent />
    </Suspense>
  );
}
