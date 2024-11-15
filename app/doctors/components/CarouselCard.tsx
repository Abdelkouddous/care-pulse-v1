import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { type CarouselApi } from "@/components/ui/carousel";
import { Doctors } from "@/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon, LocateIcon } from "lucide-react";
// import { getDoctors } from "@/lib/actions/doctors.actions";

export function CarouselDApiDemo() {
  // const doctors = await getDoctors();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [prevIndex, setPrevIndex] = React.useState<number | null>(null);

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
      // Circular logic: go to the last snap if on the first snap
    };

    api.on("select", handleSelect);

    // Cleanup listener on unmount or dependency change
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, count]);

  return (
    <div className="mx-auto max-w-xs h-screen">
      <Carousel setApi={setApi} className="w-screen max-w-xs hover:shadow-sm">
        <CarouselContent className="border-none hover:shadow-lg dark:hover:shadow-md dark:hover:shadow-slate-400">
          {/* {Array.from({ length: 5 }).map((_, Doctors) => (
            <CarouselItem key={Doctors}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">
                    Doctor {Doctors + 1}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))} */}
          {Doctors.map((doctor, i) => (
            <CarouselItem key={doctor.name + i}>
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6 space-y-2">
                  <Image
                    src={doctor.image}
                    width={128}
                    height={128}
                    alt="doctor"
                    className="rounded-full"
                  />

                  <p className="font-serif text-2xl">Dr.{doctor.name}</p>
                  <span className="text-sky-900-900 dark:text-sky-50">
                    {doctor.speciality.name} {doctor.speciality.icon}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {doctor.exp} of experience
                  </p>
                  <span className="flex flex-auto space-x-1 items-center  text-sm text-gray-500 dark:text-gray-400">
                    <LocateIcon height={16} width={16}></LocateIcon>{" "}
                    <span>Algiers, Algeria</span>
                  </span>

                  <Button className="rounded-xl hover:scale-105">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
