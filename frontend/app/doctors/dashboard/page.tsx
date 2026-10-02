"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
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

  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ["doctor", "appointments"],
    queryFn: () => doctorService.getDoctorAppointments(),
  });

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
        subtitle={`Department of ${specialty} · CarePulse Medical Center`}
        badge={
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
            Attending Physician
          </span>
        }
      >
        <div className="flex items-center gap-2">
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
    </AppShell>
  );
}
