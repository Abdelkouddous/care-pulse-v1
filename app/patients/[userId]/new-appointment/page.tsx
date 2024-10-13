import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);

  return (
    <div className="flex min-h-screen max-h-screen ">
      <section className="remove-scrollbar  container my-auto">
        <div className="bg-dark-50 relative border-b-2 border-dark flex justify-between items-center">
          <h1 className="z-50">
            <span className="text-dark"></span>
          </h1>
          <span className="text-dark">{patient?.name}</span>
        </div>

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
