"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEcho } from "@/lib/echo";
import {
  Clock,
  Calendar,
  Users,
  Layers,
  User,
  RefreshCw,
  Activity,
  Sliders,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { doctorService } from "@/lib/api/doctor.service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Sub-components for Doctor Workspace Hash Views
import { ScheduleSection } from "@/components/doctor/ScheduleSection";
import { AppointmentsSection } from "@/components/doctor/AppointmentsSection";
import { PatientsSection } from "@/components/doctor/PatientsSection";
import { PlansSection } from "@/components/doctor/PlansSection";
import { ProfileSection } from "@/components/doctor/ProfileSection";

export type DoctorDashboardSection = "schedule" | "appointments" | "patients" | "plans" | "profile";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const doctorName =
    user?.name && !user.name.toLowerCase().includes("ramirez")
      ? user.name
      : "Dr. Amine Mansouri";
  const specialty = "Cardiology";

  // Intake Capacity Settings State (default 20 patients/day)
  const [dailyCapacityQuota, setDailyCapacityQuota] = useState<number>(20);
  const [acceptingWalkIns, setAcceptingWalkIns] = useState<boolean>(true);

  // Hash-based Active Section State
  const [activeSection, setActiveSection] = useState<DoctorDashboardSection>("schedule");

  const syncHashToSection = useCallback(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "") as DoctorDashboardSection;
    if (
      hash === "schedule" ||
      hash === "appointments" ||
      hash === "patients" ||
      hash === "plans" ||
      hash === "profile"
    ) {
      setActiveSection(hash);
    } else {
      setActiveSection("schedule");
    }
  }, []);

  useEffect(() => {
    syncHashToSection();
    window.addEventListener("hashchange", syncHashToSection);
    return () => window.removeEventListener("hashchange", syncHashToSection);
  }, [syncHashToSection]);

  const handleNavigateSection = (section: DoctorDashboardSection) => {
    setActiveSection(section);
    if (typeof window !== "undefined") {
      window.location.hash = section;
    }
  };

  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: () => doctorService.getDoctorAppointments(),
  });

  const currentDoctorId = user?.id || (user as any)?.doctor_id;

  interface BookingSnackbar {
    id: string;
    patientName: string;
    message: string;
    scheduledTime?: string;
    scheduledDate?: string;
    reason?: string;
  }
  const [activeSnackbar, setActiveSnackbar] = useState<BookingSnackbar | null>(null);

  useEffect(() => {
    if (!activeSnackbar) return;
    const timer = setTimeout(() => {
      setActiveSnackbar(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeSnackbar]);

  // Real-time WebSocket connection via Laravel Reverb
  useEffect(() => {
    if (!currentDoctorId) return;

    const echoClient = getEcho();
    if (!echoClient) return;

    const channelName = `doctor.${currentDoctorId}`;
    const channel = echoClient.private(channelName);

    const handleAppointmentCreated = (payload: any) => {
      // 1. Reactive agenda refresh: immediately invalidate cached appointments
      queryClient.invalidateQueries({ queryKey: ["doctor", "appointments"] });

      // 2. Set real-time booking snackbar banner
      const patientName = payload.patient_name || "A patient";
      const message = payload.message || `${patientName} has booked an appointment.`;

      setActiveSnackbar({
        id: `booking-${Date.now()}`,
        patientName,
        message,
        scheduledTime: payload.scheduled_time || "",
        scheduledDate: payload.scheduled_date || "",
        reason: payload.reason || "General Consultation",
      });

      // 3. Surface doctor alert toast
      toast({
        title: "🏥 New Patient Booking",
        description: message,
      });

      // 4. Dispatch global custom event for AppShell bell notification increment
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vitalbook:notification", {
            detail: {
              title: "New Patient Booking",
              message: message,
            },
          })
        );
      }
    };

    channel.listen(".AppointmentCreated", handleAppointmentCreated);
    channel.listen("AppointmentCreated", handleAppointmentCreated);
    channel.listen(".App\\Events\\AppointmentCreated", handleAppointmentCreated);

    return () => {
      echoClient.leave(channelName);
    };
  }, [currentDoctorId, queryClient]);


  const [triageActionId, setTriageActionId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    setTriageActionId(id);
    try {
      await doctorService.updateDoctorAppointmentStatus(id, status);
      toast({
        title: "Clinical Status Updated",
        description: `Consultation transitioned to "${status}".`,
      });
      refetch();
    } catch {
      toast({
        title: "Action Failed",
        description: "Unable to update consultation status. Please retry.",
        variant: "destructive",
      });
    } finally {
      setTriageActionId(null);
    }
  };

  // Metrics computation
  const pendingCount = appointments.filter((a: any) => a.status === "pending").length;
  const scheduledCount = appointments.filter((a: any) => a.status === "scheduled").length;
  const inConsultCount = appointments.filter((a: any) => a.status === "in_consultation").length;
  const remainingToday = pendingCount + scheduledCount + inConsultCount;

  return (
    <AppShell role="doctor" pageTitle="Doctor Workspace">
      <PageHeader
        title={`Clinical Workspace — ${doctorName}`}
        subtitle={`Department of ${specialty} · Wateen Medical Center`}
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
            Attending Physician
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Button
            asChild
            roleVariant="outline"
            size="sm"
            className="text-xs rounded-xl gap-2 border-border"
          >
            <Link href="/doctors/dashboard/activity">
              <Activity className="size-3.5 text-primary" />
              <span>Activity Feed</span>
            </Link>
          </Button>
          <Button
            roleVariant="secondary"
            size="sm"
            onClick={() => {
              refetch();
              toast({
                title: "Roster Refreshed",
                description: "Live appointments and queue statuses updated.",
              });
            }}
            className="text-xs rounded-xl gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh Roster</span>
          </Button>
        </div>
      </PageHeader>

      {/* Clinical Workspace Navigation Bar for Hash Sections */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-8 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Section 1: Schedule */}
          <button
            onClick={() => handleNavigateSection("schedule")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
              activeSection === "schedule"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Clock className="size-4" />
            <span>Today&apos;s Schedule</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-md text-[10px] font-mono",
                activeSection === "schedule" ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
              )}
            >
              {remainingToday}
            </span>
          </button>

          {/* Section 2: Appointments */}
          <button
            onClick={() => handleNavigateSection("appointments")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
              activeSection === "appointments"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Calendar className="size-4" />
            <span>Appointments</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded-md text-[10px] font-mono",
                activeSection === "appointments" ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
              )}
            >
              {appointments.length}
            </span>
          </button>

          {/* Section 3: Patients */}
          <button
            onClick={() => handleNavigateSection("patients")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
              activeSection === "patients"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Users className="size-4" />
            <span>Patients</span>
          </button>

          {/* Section 4: Plans */}
          <button
            onClick={() => handleNavigateSection("plans")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
              activeSection === "plans"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <Layers className="size-4" />
            <span>Consultation Plans</span>
          </button>

          {/* Section 5: Profile */}
          <button
            onClick={() => handleNavigateSection("profile")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
              activeSection === "profile"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            <User className="size-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* RENDER SECTION ACCORDING TO HASH ROUTE */}
      {activeSection === "schedule" && (
        <ScheduleSection
          appointments={appointments}
          isLoading={isLoading}
          dailyCapacityQuota={dailyCapacityQuota}
          setDailyCapacityQuota={setDailyCapacityQuota}
          acceptingWalkIns={acceptingWalkIns}
          setAcceptingWalkIns={setAcceptingWalkIns}
          triageActionId={triageActionId}
          onUpdateStatus={handleUpdateStatus}
          onNavigateToSection={handleNavigateSection}
        />
      )}

      {activeSection === "appointments" && (
        <AppointmentsSection
          appointments={appointments}
          isLoading={isLoading}
          triageActionId={triageActionId}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {activeSection === "patients" && (
        <PatientsSection
          appointments={appointments}
          onNavigateToSection={handleNavigateSection}
        />
      )}

      {activeSection === "plans" && <PlansSection />}

      {activeSection === "profile" && <ProfileSection />}

      {/* Real-time Clinical Booking Snackbar Banner */}
      {activeSnackbar && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 right-6 z-50 flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-2xl max-w-sm sm:max-w-md animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-emerald-500/15"
        >
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar className="size-5" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>New Patient Booking</span>
                <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
              </h4>
              <button
                onClick={() => setActiveSnackbar(null)}
                className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md hover:bg-secondary/60 transition-colors"
                aria-label="Dismiss snackbar"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {activeSnackbar.patientName}
            </p>
            {activeSnackbar.scheduledTime && (
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3 text-emerald-500" />
                <span>
                  {activeSnackbar.scheduledDate ? `${activeSnackbar.scheduledDate} at ` : ""}
                  {activeSnackbar.scheduledTime}
                </span>
              </p>
            )}
            <div className="flex items-center gap-2 pt-1.5">
              <Button
                size="sm"
                roleVariant="doctor"
                onClick={() => {
                  handleNavigateSection("schedule");
                  setActiveSnackbar(null);
                }}
                className="h-8 text-xs font-semibold px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              >
                View in Schedule
              </Button>
              <Button
                asChild
                size="sm"
                roleVariant="outline"
                className="h-8 text-xs font-semibold px-2.5 rounded-lg border-border"
              >
                <Link
                  href="/doctors/dashboard/activity"
                  onClick={() => setActiveSnackbar(null)}
                >
                  Activity Feed
                </Link>
              </Button>
              <Button
                size="sm"
                roleVariant="ghost"
                onClick={() => setActiveSnackbar(null)}
                className="h-8 text-xs px-2 rounded-lg text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
