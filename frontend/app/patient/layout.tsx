import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Portal | VitalBook",
  description: "Manage your consultations, clinical records, and appointments.",
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
