"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Building2,
  Phone,
  Stethoscope,
  Compass,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { TARGET_CITIES } from "@/constants/cities";
import { Clinic, TargetCity } from "@/types/clinic";
import { clinicService } from "@/lib/api/clinic.service";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

// Lazy-load the Google Map near viewport with fixed-height skeleton to prevent layout shift
const DynamicClinicGoogleMap = dynamic(
  () => import("@/components/maps/ClinicGoogleMap").then((mod) => mod.ClinicGoogleMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse flex flex-col items-center justify-center gap-3 border border-slate-200 dark:border-slate-800">
        <MapPin className="size-8 text-emerald-500 animate-bounce" />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Loading interactive clinic map...
        </span>
      </div>
    ),
  }
);

interface ClinicGeolocationSectionProps {
  onSelectClinicForBooking?: (clinic: Clinic) => void;
}

export function ClinicGeolocationSection({
  onSelectClinicForBooking,
}: ClinicGeolocationSectionProps) {
  const { t, locale } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<TargetCity>(TARGET_CITIES[0]); // Algiers by default
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [radiusKm, setRadiusKm] = useState<number>(15);

  // Fetch clinics when city or radius changes
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    clinicService
      .getNearbyClinics({
        city: selectedCity.slug,
        wilaya_code: selectedCity.wilaya_code,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        radius_km: radiusKm,
      })
      .then((data) => {
        if (!isMounted) return;
        setClinics(data);
        if (data.length > 0) {
          setSelectedClinicId(data[0].id);
        } else {
          setSelectedClinicId(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load clinics for city:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCity, radiusKm]);

  const handleCityChange = (city: TargetCity) => {
    setSelectedCity(city);
  };

  const handleBookAtClinic = (clinic: Clinic) => {
    if (onSelectClinicForBooking) {
      onSelectClinicForBooking(clinic);
    }
    const targetElement = document.getElementById("doctors");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="clinics"
      className="w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Compass className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.clinics.badge}</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.clinics.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
            {t.clinics.subtitle}
          </p>
        </div>

        {/* City Filter Pills (Algiers & Tébessa Target Pilot) */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
          {TARGET_CITIES.map((city) => {
            const isSelected = city.slug === selectedCity.slug;
            return (
              <button
                key={city.slug}
                type="button"
                onClick={() => handleCityChange(city)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <MapPin className="size-3.5" />
                <span>
                  {locale === "ar" ? city.arabic_name : city.name} ({city.wilaya_code})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Clinic List + Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Clinic Directory List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 px-1">
            <span>
              {clinics.length === 1
                ? (locale === "ar" ? "عيادة واحدة متوفرة" : "1 clinique disponible")
                : `${clinics.length} ${locale === "ar" ? "عيادات متوفرة" : "cliniques disponibles"}`}
            </span>
            <div className="flex items-center gap-1.5">
              <span>{t.clinics.radius}:</span>
              {[10, 15, 25].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    radiusKm === r
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {r}km
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : clinics.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <p className="text-xs text-slate-500">
                  {locale === "ar"
                    ? `لا توجد عيادات شريكة مسجلة ضمن نطاق ${radiusKm} كم في ${selectedCity.arabic_name}.`
                    : `Aucun centre partenaire trouvé dans un rayon de ${radiusKm}km à ${selectedCity.name}.`}
                </p>
              </div>
            ) : (
              clinics.map((clinic) => {
                const isSelected = clinic.id === selectedClinicId;
                const doctorsCount = clinic.doctors_count || (clinic.doctors ? clinic.doctors.length : 1);

                return (
                  <div
                    key={clinic.id}
                    onClick={() => setSelectedClinicId(clinic.id)}
                    className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? "bg-white dark:bg-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20"
                        : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                            {clinic.name}
                          </h4>
                          <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {clinic.address}
                        </p>
                      </div>

                      {clinic.distance_km != null && (
                        <span className="shrink-0 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                          {clinic.distance_km} km
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="size-3.5 text-sky-500" />
                          <span>
                            {doctorsCount === 1
                              ? (locale === "ar" ? "طبيب واحد" : "1 médecin")
                              : `${doctorsCount} ${locale === "ar" ? "أطباء" : "médecins"}`}
                          </span>
                        </span>
                        <a
                          href={`tel:${clinic.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                        >
                          <Phone className="size-3 text-emerald-500" />
                          <span>{clinic.phone}</span>
                        </a>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        roleVariant="patient"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookAtClinic(clinic);
                        }}
                        className="rounded-xl text-xs font-bold gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>{t.clinics.bookAtClinic}</span>
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Google Maps (Lazy Loaded) */}
        <div className="lg:col-span-7 h-[500px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative">
          <DynamicClinicGoogleMap
            clinics={clinics}
            selectedClinicId={selectedClinicId}
            onSelectClinic={(clinic) => setSelectedClinicId(clinic.id)}
            targetCity={selectedCity}
          />
        </div>
      </div>
    </section>
  );
}

export default ClinicGeolocationSection;
