"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { useDoctorDetail } from "@/hooks/useDoctors";
import { Button } from "@/components/ui/button";

const DAYS_MAP: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export default function DoctorProfilePage() {
  const params = useParams();
  const doctorId = (params.doctorId || params.id) as string;
  const { data: doctor, isLoading } = useDoctorDetail(doctorId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1320] flex flex-col">
        <SiteHeader />
        <div className="max-w-4xl mx-auto w-full p-8">
          <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b1320] flex flex-col">
        <SiteHeader />
        <div className="max-w-xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold">Doctor Not Found</h2>
          <p className="mt-2 text-slate-500">The requested physician profile does not exist.</p>
          <Link href="/doctors" className="mt-4 inline-block">
            <Button className="rounded-xl">Browse All Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1320] text-slate-900 dark:text-slate-100 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border-2 border-emerald-500/20">
              {doctor.avatar_url ? (
                <Image
                  src={doctor.avatar_url}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-extrabold text-slate-400">
                  Dr
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {doctor.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  {doctor.specialty?.name || "Specialist"}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Medical License: <span className="font-mono">{doctor.license_number}</span>
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-xs text-slate-500 block">Consultation Fee</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {(doctor.consultation_fee_cents / 100).toLocaleString()} DZD
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Phone</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {doctor.phone || "Clinic Line"}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/appointments/new?doctorId=${doctor.id}`} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 px-8 shadow-lg shadow-emerald-600/20">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Biography */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About the Physician</h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
              {doctor.bio || "Extensive experience in clinical consultations, preventative diagnosis, and personalized treatment plans."}
            </p>
          </div>

          {/* Regular Weekly Availability */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Weekly Clinic Hours</h2>
            {doctor.availabilities && doctor.availabilities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {doctor.availabilities.map((av) => (
                  <div
                    key={av.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center"
                  >
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      {DAYS_MAP[av.day_of_week] || `Day ${av.day_of_week}`}
                    </span>
                    <span className="block mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {av.start_time.slice(0, 5)} - {av.end_time.slice(0, 5)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Available Monday through Friday by scheduled reservation.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
