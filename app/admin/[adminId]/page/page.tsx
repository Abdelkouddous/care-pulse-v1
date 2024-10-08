import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

// import { AlertDestructive } from "../../patients/[userId]/register/alert-destructive";
import { getAdmin } from "@/lib/actions/admin.actions";

const AdminPage = async ({ params: { adminId } }: SearchParamProps) => {
  const appointments = await getRecentAppointmentList();
  const admin = await getAdmin(adminId);

  // if (admin)
  //   return (
  //     <div className=" flex flex-col m-auto justify-center ">
  //       <AlertDestructive></AlertDestructive>
  //     </div>
  //   );
  return (
    <div className="mx-auto overflow-auto flex max-w-[95%] flex-col space-y-22">
      <header className="admin-header text-right">
        {/* <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link> */}

        <h1 className="header">
          Welcome 👋
          {admin?.adminName}
          <p> Admin Dashboard</p>
        </h1>
      </header>

      <main className="admin-main flex-1 items-center justify-center">
        <section className="flex flex-row items-center justify-center ">
          <p className="text-dark-700 mb-5">
            Start the day with managing new appointments
          </p>
        </section>

        <section className=" overflow-auto admin-stat flex space-x-6 items-center  justify-center ">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default AdminPage;
