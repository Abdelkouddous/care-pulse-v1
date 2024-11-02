"use server";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex flex-col min-h-screen ">
      <section className="remove-scrollbar container m-2 ">
        <span className="font-sans flex justify-between my-3">
          Welcome back
          <h1 className="text-lime-800 dark:text-lime-200 font-serif text-right">
            {patient?.name}
          </h1>
        </span>

        <div className=" sub-container max-w-full flex-1 justify-center ">
          <AppointmentForm
            patientId={patient?.$id}
            userId={userId}
            type="create"
          />
        </div>
      </section>
    </div>
  );
};

export default Appointment;
