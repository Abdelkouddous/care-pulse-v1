import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const DoctorsCard = () => {
  return (
    <div
      className=" h-screen flex m-auto flex-col  max-w-screen  relative my-3  justify-center
"
      id="doctors"
    >
      <Card x-chunk="dashboard-01-chunk-1 " className="p-5 fade-in">
        <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
          <CardTitle className="flex text-sm font-medium items-center text-center "></CardTitle>
          <h1 className="text-center font-serif text-4xl m-4  fade-in">
            {" "}
            Our Doctors
          </h1>
          <p> Cardiologists </p>
          <p> Cardiologists </p>
          <p> Cardiologists </p>
          <p> Cardiologists </p>
          <p> Cardiologists </p>
          <p> Cardiologists </p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DoctorsCard;
