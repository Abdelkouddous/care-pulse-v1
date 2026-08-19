"use client";

import { LocateIcon, Star, Calendar, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Doctors, getRatingStars, formatReviews } from "@/constants";

/**
 * Autoplay Medical Specialist Carousel
 * Architecture:
 * - Multi-item responsive viewport (1 mobile, 2 tablet, 3 desktop)
 * - Managed Autoplay State Machine with Pause-on-Hover / Touch
 * - Synchronized dot navigation & direct role-based booking actions
 */
export function CarouselDApiDemo() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [isUserHovering, setIsUserHovering] = React.useState(false);

  // Synchronize Embla Carousel state
  React.useEffect(() => {
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

  // Autoplay Engine (Scrolls every 3500ms, paused on hover or user toggle)
  React.useEffect(() => {
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

  const renderStars = (rating: number) => {
    const stars = getRatingStars(rating);
    return (
      <div className="flex items-center space-x-0.5">
        {stars.map((type, idx) => (
          <Star
            key={idx}
            className={`size-3.5 ${
              type === "full"
                ? "fill-amber-400 text-amber-400"
                : type === "half"
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsUserHovering(true)}
      onMouseLeave={() => setIsUserHovering(false)}
      onTouchStart={() => setIsUserHovering(true)}
      onTouchEnd={() => setIsUserHovering(false)}
    >
      {/* Carousel Container with responsive items */}
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
          {Doctors.map((doctor, index) => (
            <CarouselItem
              key={`${doctor.name}-${index}`}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full overflow-hidden border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-2xl flex flex-col justify-between">
                <CardContent className="p-0 flex flex-col justify-between h-full">
                  {/* Doctor Card Top Banner & Avatar */}
                  <div className="relative h-28 w-full bg-gradient-to-r from-sky-600/20 via-emerald-600/20 to-teal-600/20 dark:from-sky-950/40 dark:to-emerald-950/40 border-b border-slate-100 dark:border-slate-800">
                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 text-sky-700 dark:text-sky-300 shadow-sm border border-slate-200 dark:border-slate-700">
                      {doctor.exp}
                    </span>
                    <div className="absolute -bottom-10 left-6">
                      <div className="relative size-20 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-lg bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={doctor.image}
                          alt={`Dr. ${doctor.name}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctor Profile Details */}
                  <div className="pt-12 px-6 pb-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                          Dr. {doctor.name}
                        </h3>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                          {doctor.speciality.name} {doctor.speciality.icon}
                        </span>
                      </div>

                      {/* Ratings & Reviews */}
                      <div className="mt-3 flex items-center gap-2">
                        {renderStars(doctor.rating)}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {doctor.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          ({formatReviews(doctor.reviews)})
                        </span>
                      </div>

                      {/* Location metadata */}
                      <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <LocateIcon className="size-3.5 text-slate-400" />
                        <span>Algiers · Hospital Partner</span>
                      </div>
                    </div>

                    {/* Unified Doctor Booking CTA Button */}
                    <div className="pt-2">
                      <Link href={`/?doctor=true`}>
                        <Button
                          roleVariant="doctor"
                          size="default"
                          className="w-full gap-2 font-semibold shadow-sm text-xs"
                        >
                          <Calendar className="size-3.5" />
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Floating Navigation Controls */}
        <CarouselPrevious className="-left-3 top-1/2 size-10 border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 shadow-md hover:bg-slate-50" />
        <CarouselNext className="-right-3 top-1/2 size-10 border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 shadow-md hover:bg-slate-50" />
      </Carousel>

      {/* Footer Navigation Bar: Autoplay Toggle & Dot Pagination */}
      <div className="mt-6 flex items-center justify-between px-2">
        {/* Autoplay Play/Pause Button */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
        >
          {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          <span>{isPaused ? "Auto-play: Off" : "Auto-play: Active"}</span>
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-6 bg-sky-600 dark:bg-sky-400"
                  : "w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CarouselDApiDemo;
