import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Activity, CreditCard, Users } from "lucide-react";
import { getPatientCount } from "@/lib/actions/patient.actions";
import {
  getActiveDoctorCount,
  getDoctorCount,
} from "@/lib/actions/doctors.actions";
import "@/app/globals.css";
import { useEffect, useState } from "react";

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

    fetchCount();
  }, []);
  return (
    <div
      className=" flex flex-col m-auto max-w-screen  relative my-3
    "
    >
      <Card x-chunk="dashboard-01-chunk-1 " className="p-5 fade-in">
        <h1 className="text-center font-serif text-4xl m-4  fade-in">
          {" "}
          We offered & offer
        </h1>
        <div className=" grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-3 ">
          {/* <div className="min-w-full max-w-screen grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4"> */}
          {/* <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card> */}
          <Card x-chunk="dashboard-01-chunk-1 fade-in">
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
