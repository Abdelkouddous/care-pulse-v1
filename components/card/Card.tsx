import { motion } from "framer-motion";
import { Activity, Users, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getActiveDoctorCount,
  getDoctorCount,
} from "@/lib/actions/doctors.actions";
import { getPatientCount } from "@/lib/actions/patient.actions";
import "@/app/globals.css";

const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState({
    patientCount: 0,
    doctorCount: 0,
    activeDoctors: 0,
    isLoading: true,
  });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchMetrics = async () => {
      try {
        const [patientCount, doctorCount, activeDoctors] = await Promise.all([
          getPatientCount(),
          getDoctorCount(),
          getActiveDoctorCount(),
        ]);

        setMetrics({
          patientCount: patientCount || 0,
          doctorCount: doctorCount || 0,
          activeDoctors: activeDoctors || 0,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        setMetrics((prev) => ({ ...prev, isLoading: false }));
      }
    };

    // Initial fetch
    fetchMetrics();

    // Set up hourly refresh interval
    intervalId = setInterval(fetchMetrics, 60 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
  }: {
    title: string;
    value: number;
    change: string;
    icon: React.ElementType;
  }) => (
    <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-md dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-gray-100 pb-2 dark:border-gray-700">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
            {metrics.isLoading ? "—" : value.toLocaleString()}
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
          {change}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <section className="mt-16 md:mt-16">
      <div className="">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="flex flex-col space-y-6"
        >
          <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 pb-2 text-center dark:border-gray-700">
              <CardTitle className="flex flex-col items-center justify-center">
                <span className="mb-2 text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  NETWORK OVERVIEW
                </span>
                <h2 className="font-serif text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
                  Healthcare Statistics
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-6 md:px-8">
              <div className="grid gap-6 md:grid-cols-3">
                <MetricCard
                  title="Total Treated Patients"
                  value={metrics.patientCount}
                  change="+180.1% from previous month"
                  icon={Users}
                />
                <MetricCard
                  title="Network Physicians"
                  value={metrics.doctorCount}
                  change="+18.1% growth in provider network"
                  icon={UserPlus}
                />
                <MetricCard
                  title="Currently Active Doctors"
                  value={metrics.activeDoctors}
                  change="Real-time provider availability"
                  icon={Activity}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardOverview;
