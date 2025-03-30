import * as sdk from "node-appwrite";

// Environment variables setup
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

// Appwrite client setup with API key
const client = new sdk.Client()
  .setEndpoint(ENDPOINT!)
  .setProject(PROJECT_ID!)
  .setKey(API_KEY!);

// Individual clients and database instances
export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
