import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Clinical Workspace | VitalBook",
  description: "Physician triage workspace, patient queue management, and consultation schedule.",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
