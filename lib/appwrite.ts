// lib/appwrite.ts
import { Client, Account } from "appwrite";

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  ADMIN_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new Client()
  .setEndpoint(ENDPOINT!) // Your Appwrite endpoint
  .setProject(PROJECT_ID!); // Your Appwrite Project ID

const account = new Account(client);

export { client, account };
