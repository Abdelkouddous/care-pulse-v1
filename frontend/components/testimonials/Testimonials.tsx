"use client";

import { Star } from "lucide-react";
import React, { useEffect, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DICTIONARY_EN } from "@/constants/locales/en";

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="w-full opacity-0 transition-opacity duration-700">
      <div className="mx-auto">
        <div className="mb-10 text-center space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
            {DICTIONARY_EN.testimonials.badge}
          </span>
          <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            {DICTIONARY_EN.testimonials.title}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {DICTIONARY_EN.testimonials.subtitle}
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="mx-auto max-w-6xl px-8 relative"
        >
          <CarouselContent className="-ml-4">
            {DICTIONARY_EN.testimonials.list.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full border border-slate-200 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 rounded-2xl">
                  <CardContent className="flex h-full flex-col p-6">
                    {/* Avatar Initials Badge */}
                    <div className="mb-4 flex justify-center">
                      <div
                        className={`flex size-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md ${testimonial.color}`}
                      >
                        {testimonial.initials}
                      </div>
                    </div>
                    {/* Star Ratings */}
                    <div className="mb-4 flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${
                            i < testimonial.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    {/* Testimonial Quote */}
                    <blockquote className="mb-6 flex-1 border-l-2 border-emerald-500 pl-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 top-1/2 size-10 border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-lg" />
          <CarouselNext className="-right-2 top-1/2 size-10 border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-lg" />
        </Carousel>
      </div>
    </section>
  );
}

export default Testimonials;
