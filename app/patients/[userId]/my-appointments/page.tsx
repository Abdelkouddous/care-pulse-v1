"use client";
import { StatusBadge } from "@/components/StatusBadge";
import {
  getRecentAppointmentsForPatient,
  deleteAppointment,
} from "@/lib/actions/appointment.actions";
// import { getRecentAppointmentsForPatient, deleteAppointment } from "@/lib/actions/appointment.actions";
import type { Appointment } from "@/types/appwrite.types";
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the response structure from the API call
// interface AppointmentsResponse {
//   totalCount: number;
//   documents: Appointment[];
// }

const MyAppointment = async ({
  params: { userId },
}: {
  params: { userId: string };
}) => {
  // const appointments = await getRecentAppointmentsForPatient(userId);
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const result = await getRecentAppointmentsForPatient(userId);
        setAppointments(result.documents);
      } catch (err) {
        setError("Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  // Handle deleting an appointment
  const handleDelete = async (appointmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (confirmed) {
      try {
        const response = await deleteAppointment(appointmentId);
        if (response.success) {
          // Filter out the deleted appointment from the state
          setAppointments(
            (prevAppointments) =>
              prevAppointments?.filter(
                (appointment) => appointment.$id !== appointmentId
              ) || []
          );
          alert("Successfully deleted appointment");
          //pageRefresh
          // window.location.reload();
        } else {
          alert("Failed to delete the appointment.");
        }
      } catch (error) {
        alert("Error deleting appointment.");
      }
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center  h-screen text-white">
        <div className="flex align-center items-center">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={40}
            height={3240}
            className="animate-spin mr-2"
          />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="flex flex-col h-full max-h-full m-auto w-screen p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {appointments && appointments.length > 0 ? (
        <div className="overflow-y-auto max-h-full">
          {appointments.map((appointment: Appointment) => (
            <div
              key={appointment.$id}
              className="p-4 mb-4 border border-gray-200 rounded shadow"
            >
              <h2 className="text-xl font-semibold">
                Dr. {appointment.primaryPhysician || "Appointment"}
              </h2>
              <div className="flex flex-row justify-between items-center">
                Status: <StatusBadge status={appointment.status}></StatusBadge>
              </div>
              <div className="flex flex-auto justify-between items-center">
                <p>Date: {new Date(appointment.schedule).toLocaleString()}</p>
                {/* <p>Time: {new Date(appointment.).toLocaleTimeString()}</p>
              <p>Location: {appointment.location}</p> */}
                <button
                  onClick={() => handleDelete(appointment.$id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-700 hover:placeholder-opacity-95 hover:scale-110"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No appointments found for this user.</p>
      )}
    </div>
  );
};

export default MyAppointment;
