import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import * as Sentry from "@sentry/nextjs";
import { getPatient } from "@/lib/actions/patient.actions";

const RequestSuccess = async ({
  searchParams,
  params: { userId },
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  // const getDoctor = async ({}) =>
  //   Doctors.find((doctor) => doctor.name === appointment.primaryPhysician);
  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );
  const user = await getPatient(userId);
  Sentry.metrics.set("user_view_appointment-sucess", user.name);

  return (
    <div className="m-auto mb-4">
      <div className="success-img m-auto p-2 space-y-1">
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We&apos;ll be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
          <p className="text-center"> Requested appointment details: </p>
          <div className="flex items-center gap-2 m-auto justify-center">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            <div className="flex col-2 gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <p> {formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </div>
          <div className="flex flex-col mt-3 space-y-2">
            <Button
              variant="outline"
              className="shad-primary-btn max-w-[60]% "
              asChild
            >
              <Link href={`/dashboard/patients/${userId}/new-appointment`}>
                New Appointment
              </Link>
            </Button>
            <Button
              variant="outline"
              className="shad-primary-btn max-w-[60]%"
              asChild
            >
              <Link href={`/dashboard/patients/${userId}/my-appointments`}>
                Check Appointments
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RequestSuccess;
