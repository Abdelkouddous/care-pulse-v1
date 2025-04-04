import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getAdmin } from "@/lib/actions/admin.actions";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async ({ params: { adminId } }: SearchParamProps) => {
  const appointments = await getRecentAppointmentList();
  const admin = await getAdmin(adminId);

  return (
    <div className="space-y-22 mx-auto flex max-w-[95%] flex-col overflow-auto">
      <header className="admin-header text-right">
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

        <section className=" admin-stat m-auto mx-4 flex items-center justify-center space-x-6 overflow-auto ">
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
