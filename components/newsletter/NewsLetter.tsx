import { Calendar } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const NewsLetter = () => {
  return (
    <div>
      <Card className="my-12 overflow-hidden border-0 shadow-lg dark:bg-gray-800">
        {" "}
        {/* Column 4: Newsletter */}
        <CardHeader className="border-b border-gray-100 pb-2 text-center dark:border-gray-700">
          <CardTitle className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold ">Newsletter</h3>
            <p className="text-sm">
              Stay updated with the latest health tips and features.
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center px-6 pb-8 pt-6 md:px-8">
          <div className="flex space-x-2">
            <Input
              placeholder="Your email address"
              className="border-gray-700 bg-gray-800 text-sm text-white"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Subscribe
            </Button>
          </div>
        </CardContent>
        <div className="mt-2 flex items-center justify-center  space-x-2 rounded-md p-2">
          <Calendar className="size-8 text-emerald-400" />
          <div>
            <h4 className="text-sm font-semibold">Need an appointment?</h4>
            <p className="text-xs text-gray-400">
              Book online or call us today
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NewsLetter;
