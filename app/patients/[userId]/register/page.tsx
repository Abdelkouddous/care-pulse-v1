import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);
  if (patient) {
    return redirect(`/patients/${userId}/new-appointment`);
  } else {
    return (
      <div className=" relative flex-col h-full max-h-full m-4 p-4  ">
        <RegisterForm user={user} />
      </div>
    );
  }
};

export default Register;
