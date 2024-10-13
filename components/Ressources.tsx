import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Ressources = () => {
  return (
    <div
      className=" flex flex-col m-auto max-w-screen  relative my-3
"
    >
      <Card x-chunk="dashboard-01-chunk-1 " className="p-5 fade-in">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <CardTitle className="flex text-sm font-medium items-center text-center "></CardTitle>
          <h1 className="text-center font-serif text-4xl m-4  fade-in">
            {" "}
            Ressources
          </h1>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Ressources;
