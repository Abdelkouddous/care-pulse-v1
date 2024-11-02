import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Login from "../login/page";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  // const user = await getUser(userId);
  const patient = await getPatient(userId);
  if (patient) {
    return (
      <div className="relative flex-col h-full max-h-full m-4 p-4  ">
        <Login user={patient} />
      </div>
    );
  } else {
    return (
      <div className=" relative flex-col h-full max-h-full m-4 p-4  ">
        <RegisterForm user={patient} />
      </div>
    );
  }
};

export default Register;
