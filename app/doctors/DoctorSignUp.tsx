import React, { useState } from "react";
import { createDoctor } from "@/lib/actions/doctors.actions";
import { Speciality } from "@/lib/actions/doctors.actions";

export const DoctorSignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState<Speciality>(Speciality.CARDIO);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const doctorData = { name, email, password, specialty };
      const response = await createDoctor(doctorData);
      console.log("Doctor created:", response);
      // Redirect or show success message here
    } catch (error) {
      console.error("Error during doctor sign up:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <select
        title="speciality"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value as Speciality)}
      >
        <option value={""}>Select Specialty</option>
        <option value={Speciality.CARDIO}>{Speciality.CARDIO}</option>
        <option value={Speciality.OPHTALMO}>{Speciality.OPHTALMO}</option>
        <option value={Speciality.ORTHO}>{Speciality.ORTHO}</option>
        <option value={Speciality.PEDIATRICS}>{Speciality.PEDIATRICS}</option>
        <option value={Speciality.GENERAL_PRACTITIONER}>
          {Speciality.GENERAL_PRACTITIONER}
        </option>
        <option value={Speciality.DENTIST}>{Speciality.DENTIST}</option>
        <option value={Speciality.GYNAECOLOGY}>{Speciality.GYNAECOLOGY}</option>
        <option value={Speciality.NEUROLOGY}>{Speciality.NEUROLOGY}</option>
        <option value={Speciality.GASTRO}>{Speciality.GASTRO}</option>
      </select>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Sign Up as Doctor"}
      </button>
    </form>
  );
};

export default DoctorSignUp;
