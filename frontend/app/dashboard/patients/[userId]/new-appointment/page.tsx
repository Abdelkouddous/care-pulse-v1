"use server";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getPatient } from "@/lib/actions/patient.actions";
const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="mx-auto max-w-4xl px-4 py-8">
        <Card className="overflow-hidden border-0 shadow-xl dark:bg-gray-800">
          <CardHeader className="bg-emerald-50 px-6 py-4 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Patient Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Welcome back,
                </span>
                <h2 className="font-serif text-xl text-emerald-700 dark:text-emerald-300">
                  {patient?.name}
                </h2>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                Schedule New Appointment
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete the form below to book your medical consultation
              </p>
            </div>

            <div className="e p-6 shadow-sm ">
              <AppointmentForm
                patientId={patient?.$id}
                userId={userId}
                type="create"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
  // return (
  //   <div className="flex flex-col min-h-screen ">
  //     <section className="remove-scrollbar container m-2 ">
  //       <span className="font-sans flex justify-between my-3">
  //         Welcome back
  //         <h1 className="text-lime-800 dark:text-lime-200 font-serif text-right">
  //           {patient?.name}
  //         </h1>
  //       </span>

  //       <div className=" sub-container max-w-full flex-1 justify-center ">
  //         <AppointmentForm
  //           patientId={patient?.$id}
  //           userId={userId}
  //           type="create"
  //         />
  //       </div>
  //     </section>
  //   </div>
  // );
};

export default Appointment;
