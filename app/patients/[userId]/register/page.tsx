// import Image from "next/image";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);
  if (patient) {
    return (
      // <div className=" flex flex-col m-auto justify-center ">
      //   <AlertDestructive></AlertDestructive>
      // </div>
      redirect(`/patients/${userId}/login`)
    );
  } else {
    return (
      <div className=" relative flex-col h-full max-h-full m-4 p-4  ">
        {/* <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="patient"
                className="mb-12 h-10 w-fit"
              /> */}

        <RegisterForm user={user} />

        {/* <p className="copyright py-12">© 2024 CarePluse</p> */}

        {/* 
          <Image
            src="/assets/images/register-img.png"
            height={1000}
            width={1000}
            alt="patient"
            className="side-img max-w-[390px]"
          /> */}
      </div>
    );
  }
};

export default Register;
