"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  CreditCard,
  ShieldCheck,
  Calendar,
  Phone,
  MapPin,
  Heart,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MOCK_PATIENT } from "@/mocks/data/patient.mock";
import { cn } from "@/lib/utils";

interface PatientsSectionProps {
  appointments: any[];
  onNavigateToSection?: (section: "schedule" | "appointments" | "patients" | "plans") => void;
}

export function PatientsSection({
  appointments,
  onNavigateToSection,
}: PatientsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<any | null>(null);

  // Derive unique patient records from mock fixture and appointments
  const patientsList = useMemo(() => {
    const list = [MOCK_PATIENT];
    return list;
  }, []);

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return patientsList;

    return patientsList.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const phone = p.phone?.toLowerCase() || "";
      const nin = (p.national_id_nin || p.national_id || "").toLowerCase();
      const chifa = (p.carte_chifa_number || p.chifa_number || "").toLowerCase();

      return (
        name.includes(query) ||
        phone.includes(query) ||
        nin.includes(query) ||
        chifa.includes(query)
      );
    });
  }, [patientsList, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Patient Clinical Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active patient roster with Algerian civic identifiers, Chifa insurance status, and consultation histories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-secondary border border-border text-foreground">
            Total Patients: <strong className="text-primary">{patientsList.length}</strong>
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-3xl border border-border bg-card shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by patient name, phone (+213...), or 18-digit NIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-secondary/50 border-border text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      {filteredPatients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Patients Found"
          description="No registered patient records match your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPatients.map((patient) => {
            const patientInitials = (patient.name || "Sarah Benali")
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase();

            // Total bookings related to this patient
            const patientBookings = appointments.filter(
              (a) => a.patient_id === patient.id || a.patient?.name === patient.name
            );

            return (
              <div
                key={patient.id}
                className="p-6 rounded-3xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-5"
              >
                {/* Top Patient Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar className="size-12 rounded-2xl border border-border shadow-xs">
                      <AvatarFallback className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-bold text-base">
                        {patientInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-extrabold text-base text-foreground leading-tight">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Member since {patient.member_since || "2024"} · {patient.gender}, {patient.date_of_birth}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                    Blood: {patient.blood_type || "O+"}
                  </span>
                </div>

                {/* Algerian Civic & Health Identifiers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-secondary/40 border border-border/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Biometric NIN (18-digits)
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {patient.national_id_nin || "119951600000123456"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Carte Chifa Number
                    </span>
                    <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="size-3.5" />
                      <span>{patient.carte_chifa_number || "9504121234"}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Contact Phone
                    </span>
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <Phone className="size-3 text-muted-foreground" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                      Wilaya & Address
                    </span>
                    <div className="flex items-center gap-1 font-medium text-foreground truncate">
                      <MapPin className="size-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency & Insurance info */}
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Emergency Contact:</span>
                    <span className="font-semibold text-foreground">
                      {patient.emergency_contact_name} ({patient.emergency_contact_phone})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Health Coverage:</span>
                    <span className="font-semibold text-foreground">
                      {patient.insurance_provider}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 text-primary" />
                    <span>
                      <strong className="text-foreground">{patientBookings.length}</strong> Consultations on file
                    </span>
                  </div>

                  <Button
                    size="sm"
                    roleVariant="outline"
                    onClick={() => setSelectedPatientForHistory(patient)}
                    className="text-xs rounded-xl gap-1.5"
                  >
                    <span>Booking History</span>
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Patient Booking History Modal */}
      {selectedPatientForHistory && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPatientForHistory(null)}
        >
          <div
            className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Consultation History — {selectedPatientForHistory.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chronological record of clinical bookings with Dr. Amine Mansouri. (Bookings Only)
                </p>
              </div>
              <Button
                roleVariant="ghost"
                size="icon"
                onClick={() => setSelectedPatientForHistory(null)}
                className="size-8 rounded-xl"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* History Table / Records */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {appointments
                .filter(
                  (a) =>
                    a.patient_id === selectedPatientForHistory.id ||
                    a.patient?.name === selectedPatientForHistory.name
                )
                .map((appt: any) => {
                  const date = new Date(appt.scheduled_at);
                  return (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground font-mono">
                            {date.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            · {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <StatusBadge status={appt.status} />
                      </div>

                      <p className="text-xs font-medium text-foreground">
                        {appt.reason}
                      </p>

                      {appt.notes && (
                        <p className="text-[11px] text-muted-foreground">
                          Clinical Notes: {appt.notes}
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50">
                        <span>Consultation Fee:</span>
                        <span className="font-bold font-mono text-foreground">
                          {((appt.consultation_fee_cents || 400000) / 100).toLocaleString()} DZD
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <Button
                roleVariant="outline"
                onClick={() => setSelectedPatientForHistory(null)}
                className="text-xs rounded-xl"
              >
                Close History
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
