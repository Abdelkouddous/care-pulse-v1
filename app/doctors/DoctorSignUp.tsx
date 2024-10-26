import React, { useState } from "react";
import { createDoctor } from "@/lib/actions/doctors.actions";

export const DoctorSignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
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
      <input
        type="text"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        placeholder="Specialty"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Sign Up as Doctor"}
      </button>
    </form>
  );
};

export default DoctorSignUp;
