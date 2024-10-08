// import Image from "next/image";

import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
// import { SiteFooter } from "@/components/site-footer";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex min-h-screen max-h-screen ">
      <section className="remove-scrollbar  container my-auto">
        {/* <div className="bg-dark-50 border-b-2 border-dark ">
          <h1 className=" border-collapse z-50">
            <span className="text-lime-600 ">Welcome: {patient?.name}</span>{" "}
          </h1>
        </div> */}
        <div className="bg-dark-50 relative border-b-2 border-dark flex justify-between items-center">
          <h1 className="z-50">
            <span className="text-dark"></span>
          </h1>
          <span className="text-dark">{patient?.name}</span>
        </div>

        <div className=" sub-container max-w-full flex-1 justify-center ">
          {/* <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          /> */}

          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />
        </div>
      </section>
      {/* 
      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      /> */}
    </div>
  );
};

export default Appointment;
