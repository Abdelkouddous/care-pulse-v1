import React from "react";
import { useEffect, useState } from "react";

import { Activity, Users } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPatientCount } from "@/lib/actions/patient.actions";
import {
  getActiveDoctorCount,
  getDoctorCount,
} from "@/lib/actions/doctors.actions";
import "@/app/globals.css";

const CustomCard: React.FC = () => {
  const [patientCount, setPatientCount] = useState<number | undefined>(
    undefined
  );
  const [docCount, setDocCount] = useState<number | undefined>(undefined);
  const [activeDocs, setActiveDocs] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getPatientCount();
      const docCount = await getDoctorCount();
      const activeDocs = await getActiveDoctorCount();
      setPatientCount(count);
      setDocCount(docCount);
      setActiveDocs(activeDocs);
    };

    // Function to repeatedly fetch data every hour
    const intervalFetch = () => {
      fetchCount();
      setInterval(intervalFetch, 1000 * 60 * 60); // Set timeout for 5 seconds
    };

    // Start the initial fetch and interval setup
    intervalFetch();
  }, []);

  return (
    <div
      className="flex flex-col m-auto max-w-screen h-screen relative p-4
    "
    >
      <Card x-chunk="dashboard-01-chunk-1 " className="p-8 fade-in">
        <h1 className="text-center font-serif text-5xl m-4  fade-in">
          {" "}
          We offered & offer
        </h1>
        <div className=" grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 ">
          <Card x-chunk=" dashboard-01-chunk-1 fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold fade-in">
                + {patientCount !== undefined ? patientCount : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                +180.1% treated & diagnosed from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2 fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold fade-in">
                + {docCount !== undefined ? docCount : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                +18.1% signed doctors
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3 fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold fade-in">
                + {activeDocs !== undefined ? activeDocs : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                +1 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default CustomCard;
