import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselDApiDemo } from "./components/CarouselCard";

const DoctorsCard = () => {
  return (
    <div
      className=" min-h-screen flex m-auto flex-col  max-w-screen  relative my-3  justify-center
"
      id="doctors"
    >
      <Card
        x-chunk="dashboard-01-chunk-1"
        className=" border-none p-5 fade-in "
      >
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
          <CardTitle className="flex text-sm font-medium items-center text-center ">
            <h1 className="text-center font-serif text-4xl m-4  fade-in">
              {" "}
              Our Doctors
            </h1>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <CarouselDApiDemo></CarouselDApiDemo>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsCard;
