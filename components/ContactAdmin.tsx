import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Contact } from "lucide-react";

const ContactAdmin = () => {
  return (
    <div
      className=" h-screen flex m-auto flex-col  max-w-screen  relative my-3  justify-center
"
      id="contact"
    >
      <Card x-chunk="dashboard-01-chunk-1 " className="p-5 fade-in">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <CardTitle className="flex text-sm font-medium items-center text-center "></CardTitle>
          <span className=" flex items-center text-center font-serif text-4xl m-4 space-x-3  fade-in">
            {" "}
            <Contact className="mr-4 h-full "></Contact> Contact us
          </span>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ContactAdmin;
