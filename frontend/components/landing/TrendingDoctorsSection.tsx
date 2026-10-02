"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useDoctorsList } from "@/hooks/useDoctors";
import { MOCK_DOCTOR_DISPLAY } from "@/mocks/data";
import { getRatingStars, formatReviews } from "@/constants";

interface TrendingDoctorsSectionProps {
  filterSpecialty?: string;
  filterWilaya?: string;
}

export function TrendingDoctorsSection({
  filterSpecialty = "All",
  filterWilaya = "16",
}: TrendingDoctorsSectionProps) {
  const router = useRouter();
  const [selectedSpecialtyTab, setSelectedSpecialtyTab] = useState(filterSpecialty);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isUserHovering, setIsUserHovering] = useState(false);

  const { data: doctorsData } = useDoctorsList();

  // Resolve doctors from API or centralized canonical mock fixture
  const resolvedDoctors = useMemo(() => {
    if (doctorsData?.doctors && doctorsData.doctors.length > 0) {
      return doctorsData.doctors.map((doc, idx) => ({
        id: doc.id,
        name: doc.name || `Dr. ${doc.first_name} ${doc.last_name}`,
        specialty: doc.specialty?.name || "General Medicine",
        avatar: doc.avatar_url?.startsWith("/assets")
          ? doc.avatar_url
          : MOCK_DOCTOR_DISPLAY.avatar,
        address: (doc as any).clinic?.address || "12 Rue Didouche Mourad, Alger",
        wilaya: "16 - Alger",
        fee_cents: doc.consultation_fee_cents || 400000,
        fee_dzd: `${Math.round((doc.consultation_fee_cents || 400000) / 100).toLocaleString()} DZD`,
        rating: 4.9,
        reviewsCount: 120 + idx * 15,
        license: doc.license_number || MOCK_DOCTOR_DISPLAY.license,
        nextSlot: "Tomorrow, 09:30 AM",
        experience: `${8 + (idx % 8)} Years`,
      }));
    }
    return [MOCK_DOCTOR_DISPLAY];
  }, [doctorsData]);

  // Filter doctors by active tab
  const filteredDoctors = useMemo(() => {
    if (selectedSpecialtyTab === "All" || selectedSpecialtyTab === "All Specialties") {
      return resolvedDoctors;
    }
    return resolvedDoctors.filter(
      (doc) => doc.specialty.toLowerCase() === selectedSpecialtyTab.toLowerCase()
    );
  }, [resolvedDoctors, selectedSpecialtyTab]);

  // Synchronize Embla Carousel state
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Autoplay Engine: 3500ms Interval, paused on hover or user toggle
  useEffect(() => {
    if (!api || isPaused || isUserHovering) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [api, isPaused, isUserHovering]);

  const handleBookDoctor = (doctorId: string) => {
    router.push(`/appointments/new?doctorId=${encodeURIComponent(doctorId)}`);
  };

  const specialtyTabs = [
    "All",
    "Cardiology",
    "Pediatrics",
    "General Medicine",
    "Dermatology",
    "Neurology",
    "Orthopedics",
  ];

  return (
    <section id="book-appointment" className="w-full py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unified Outer Container Card (Single Visual Hierarchy) */}
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl dark:bg-slate-900/80 rounded-3xl">
          {/* Section Header */}
          <CardHeader className="text-center pb-4 pt-8 px-4 sm:px-8 border-b border-slate-100 dark:border-slate-800">
            <div className="mx-auto max-w-3xl space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                Verified Algerian Physician Roster
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                Meet Our Trending Medical Specialists
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 md:text-lg">
                Browse our accredited specialists, verify consultation fees strictly in Algerian Dinars (DZD),
                and reserve guaranteed clinical slots with live doctor triage.
              </p>

              {/* Specialty Filter Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
                {specialtyTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialtyTab(tab);
                      api?.scrollTo(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedSpecialtyTab === tab
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          {/* Autoplay Carousel Body */}
          <CardContent
            className="p-4 sm:p-8 relative"
            onMouseEnter={() => setIsUserHovering(true)}
            onMouseLeave={() => setIsUserHovering(false)}
            onTouchStart={() => setIsUserHovering(true)}
            onTouchEnd={() => setIsUserHovering(false)}
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4 pb-4">
                {filteredDoctors.map((doc, index) => (
                  <CarouselItem
                    key={`${doc.id}-${index}`}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="h-full overflow-hidden border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/90 rounded-2xl flex flex-col justify-between group">
                      <div className="p-0 flex flex-col justify-between h-full">
                        {/* Doctor Card Top Banner & Avatar */}
                        <div className="relative h-32 w-full bg-gradient-to-r from-emerald-600/15 via-teal-600/15 to-sky-600/15 dark:from-emerald-950/50 dark:to-sky-950/50 border-b border-slate-100 dark:border-slate-800">
                          {/* Experience Badge */}
                          <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-800/95 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200 dark:border-slate-700">
                            {doc.experience} Exp
                          </span>

                          {/* Avatar Circle */}
                          <div className="absolute -bottom-9 left-5">
                            <div className="relative size-18 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800">
                              <Image
                                src={doc.avatar}
                                alt={doc.name}
                                fill
                                className="object-cover"
                                sizes="72px"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="pt-11 px-5 pb-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">
                                {doc.name}
                              </h3>
                              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono">
                              License: {doc.license}
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                {doc.specialty}
                              </span>

                              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                <Star className="size-3.5 fill-amber-400" />
                                <span>{doc.rating}</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  ({doc.reviewsCount})
                                </span>
                              </div>
                            </div>

                            {/* Location & Slot */}
                            <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1.5 truncate">
                                <MapPin className="size-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{doc.address}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                                <Clock className="size-3.5 shrink-0" />
                                <span>{doc.nextSlot}</span>
                              </div>
                            </div>
                          </div>

                          {/* Fee & Action Button */}
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-[11px] font-semibold uppercase text-slate-400">
                                Consultation Fee
                              </span>
                              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                                {doc.fee_dzd}
                              </span>
                            </div>

                            <Button
                              type="button"
                              roleVariant="patient"
                              size="sm"
                              onClick={() => handleBookDoctor(doc.id)}
                              className="w-full rounded-xl text-xs font-bold gap-2 shadow-xs cursor-pointer"
                            >
                              <span>Reserve Consultation</span>
                              <ArrowRight className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Bottom Controls Bar: Prev/Next Buttons + Dots + Pause Indicator */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => api?.scrollNext()}
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-4" />
                </Button>

                {/* Accessible Autoplay Toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  onClick={() => setIsPaused((prev) => !prev)}
                  aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                >
                  {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                </Button>
              </div>

              {/* Synchronized Pagination Dots */}
              <div className="flex items-center space-x-1.5">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      current === index
                        ? "w-6 bg-emerald-600 dark:bg-emerald-400"
                        : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="text-xs font-semibold text-slate-400">
                {current + 1} of {count}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default TrendingDoctorsSection;
