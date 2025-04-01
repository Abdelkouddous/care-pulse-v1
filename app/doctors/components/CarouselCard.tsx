import { LocateIcon, Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { Doctors, getRatingStars, formatReviews } from "@/constants"; // Import updated utility functions

/**
 * Doctor Carousel Component
 *
 * A circular carousel that displays doctor profiles with ratings.
 * Features automatic looping, animated transitions, and interactive navigation.
 */
export function CarouselDApiDemo() {
  // State management for carousel
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [prevIndex, setPrevIndex] = React.useState<number | null>(null);

  // Set up carousel event listeners and circular navigation
  React.useEffect(() => {
    if (!api) {
      return;
    }

    // Initialize count and current
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      const selected = api.selectedScrollSnap();
      setCurrent(selected + 1);

      // Circular logic: go to the first snap if on the last snap
      if (selected === count - 1) {
        setTimeout(() => {
          api.scrollTo(0); // Scroll to the first element
          setCurrent(0);
        }, 200); // Small delay for better transition effect
      }
    };

    api.on("select", handleSelect);

    // Cleanup listener on unmount or dependency change
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, count]);

  /**
   * Renders star icons based on rating
   * @param rating - Doctor's rating value
   * @returns JSX with appropriate star icons
   */
  const renderStars = (rating: number) => {
    const stars = getRatingStars(rating);

    return (
      <div className="flex items-center justify-center space-x-1">
        {stars.map((type, idx) => (
          <Star
            key={idx}
            className={`size-4 ${
              type === "full"
                ? "fill-yellow-400 text-yellow-400"
                : type === "half"
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-6 md:py-3">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-md">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              loop: true,
              align: "center",
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {Doctors.map((doctor, i) => (
                <CarouselItem
                  key={doctor.name + i}
                  className="pl-2 md:basis-full md:pl-4 lg:basis-full"
                >
                  <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-xl ">
                    <CardContent className="p-0">
                      {/* Background header area */}
                      <div className="relative h-48 w-full ">
                        <div className="absolute -bottom-14 left-1/2 flex -translate-x-1/2 justify-center">
                          <Image
                            src={doctor.image}
                            width={112}
                            height={112}
                            alt={`Dr. ${doctor.name}`}
                            className="size-28 rounded-full border-4 border-white object-cover shadow-md dark:border-gray-800"
                          />
                        </div>
                      </div>

                      {/* Doctor details */}
                      <div className="mt-16 px-6 pb-6 text-center">
                        <h3 className="mb-1 font-serif text-xl font-bold text-gray-800 dark:text-white">
                          Dr. {doctor.name}
                        </h3>

                        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {doctor.speciality.name} {doctor.speciality.icon}
                        </span>

                        {/* Dynamic star rating */}
                        <div className="mt-2">
                          {renderStars(doctor.rating)}
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {doctor.rating.toFixed(1)} (
                            {formatReviews(doctor.reviews)})
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {doctor.exp} of experience
                        </p>

                        <div className="mt-2 flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <LocateIcon className="size-4" />
                          <span>Algiers, Algeria</span>
                        </div>

                        <Button className="mt-4 w-full rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Carousel navigation indicators */}
            <div className="absolute inset-x-0 -bottom-12 flex justify-center space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    current === index + 1
                      ? "w-6 bg-emerald-600"
                      : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Previous/Next buttons */}
            <CarouselPrevious className="absolute -left-4 top-1/2 size-8 border-0 bg-white shadow-md dark:bg-gray-800" />
            <CarouselNext className="absolute -right-4 top-1/2 size-8 border-0 bg-white shadow-md dark:bg-gray-800" />
          </Carousel>
        </div>
      </div>
      <div className="my-8 text-center text-sm text-gray-500">
        <p>Swipe or use arrows to see more specialists</p>
      </div>
    </section>
  );
}

export default CarouselDApiDemo;
