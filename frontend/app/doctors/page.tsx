"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { useDoctorsList } from "@/hooks/useDoctors";
import { useSpecialties } from "@/hooks/useSpecialties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const { data: specialtiesData } = useSpecialties();
  const { data, isLoading } = useDoctorsList({
    search: search || undefined,
    specialty_id: selectedSpecialty || undefined,
  });

  const doctors = data?.doctors || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1320] text-slate-900 dark:text-slate-100 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find & Book Trusted Physicians
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Select a specialist, check live availability, and schedule your appointment with verified healthcare professionals.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Search by doctor name or condition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedSpecialty("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedSpecialty === ""
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              All Specialties
            </button>
            {specialtiesData?.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpecialty(spec.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSpecialty === spec.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {spec.name}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-lg font-medium text-slate-500">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {doc.avatar_url ? (
                        <Image
                          src={doc.avatar_url}
                          alt={doc.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                          Dr
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                        {doc.name}
                      </h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                        {doc.specialty?.name || "Specialist"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {doc.bio || "Dedicated healthcare specialist committed to providing evidence-based patient-first care."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">Consultation Fee</span>
                    <p className="font-extrabold text-base text-slate-900 dark:text-white">
                      {(doc.consultation_fee_cents / 100).toLocaleString()} DZD
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/doctors/${doc.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        Profile
                      </Button>
                    </Link>
                    <Link href={`/appointments/new?doctorId=${doc.id}`}>
                      <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                        Book Slot
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
