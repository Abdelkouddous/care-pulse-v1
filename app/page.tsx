import Image from "next/image";
import Link from "next/link";

import PatientForm from "@/components/forms/PatientForm";
// import { SiteFooter } from "@/components/site-footer";
import { PasskeyModal } from "@/components/PasskeyModal";

export default async function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";

  // const isPatient = searchParams?.patient === "true";

  // const MyComponent = () => {
  //   useScrollAnimation(".animate-on-scroll");

  //   return (
  //     <div>
  //       <div className="animate-on-scroll fade-in">Content that fades in on scroll</div>
  //       <div className="animate-on-scroll fade-in">Another content block</div>
  //     </div>
  //   );
  // };

  // export default MyComponent;
  return (
    <div>
      <div className="flex justify-stretch m-auto p-3 h-screen fade-in-page">
        {/* OTP Verification  */}

        {isAdmin && <PasskeyModal></PasskeyModal>}

        <Image
          src="/assets/main.jpg"
          height={750}
          width={750}
          alt="Doctor"
          className=" side-img max-w-[50%] m-3 mb-2  opacity-90 border-r-8 border-l-dark-200 border-spacing-10 "
        ></Image>

        <section className="remove-scrollbar container my-auto ">
          <PatientForm></PatientForm>
        </section>
      </div>

      <div className="flex justify-center items-center ">
        {/* <SiteFooter></SiteFooter> */}
      </div>
    </div>
  );
}
